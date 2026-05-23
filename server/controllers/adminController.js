import mongoose from 'mongoose'
import User from '../models/User.js'
import Room from '../models/Room.js'
import Message from '../models/Message.js'
import Report from '../models/Report.js'
import Announcement from '../models/Announcement.js'
import AuditLog from '../models/AuditLog.js'
import PlatformSettings from '../models/PlatformSettings.js'
import { getOnlineCount } from '../socket/presence.js'
import { serializeMessage } from './messageController.js'
import { serializeRoom } from './roomController.js'

const DEFAULT_SETTINGS = {
  maintenanceMode: false,
  openRegistration: true,
  profanityFilter: true,
  guestModeAllowed: true,
  autoDeleteMessages: true,
  emailNotifications: false,
  maxRoomSize: 250,
  maxMessageLength: 2000,
  rateLimitPerMinute: 30
}

const numberOrDefault = (value, fallback) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

const pageParams = (query, defaultLimit = 20) => {
  const page = Math.max(1, numberOrDefault(query.page, 1))
  const limit = Math.min(100, Math.max(1, numberOrDefault(query.limit, defaultLimit)))
  return { page, limit, skip: (page - 1) * limit }
}

const isObjectId = (value) => mongoose.Types.ObjectId.isValid(String(value || ''))

const userFilter = (id) => {
  const or = [{ id }]
  if (isObjectId(id)) or.push({ _id: id })
  return { $or: or }
}

const roomFilter = (id) => {
  const or = [{ id }, { slug: id }]
  if (isObjectId(id)) or.push({ _id: id })
  return { $or: or }
}

const messageFilter = (id) => {
  const or = [{ id }]
  if (isObjectId(id)) or.push({ _id: id })
  return { $or: or }
}

const reportFilter = (id) => {
  const or = [{ id }]
  if (isObjectId(id)) or.push({ _id: id })
  return { $or: or }
}

const announcementFilter = (id) => {
  const or = [{ id }]
  if (isObjectId(id)) or.push({ _id: id })
  return { $or: or }
}

const safeUser = (user) => {
  if (!user) return null
  if (typeof user.toSafeObject === 'function') return user.toSafeObject()

  const obj = typeof user.toObject === 'function' ? user.toObject() : { ...user }
  delete obj.password
  delete obj.passwordResetOtp
  delete obj.passwordResetToken
  delete obj.passwordResetExpiry
  delete obj.passwordSalt
  delete obj.passwordHash
  return obj
}

const formatAnnouncement = (announcement) => {
  const doc = typeof announcement?.toObject === 'function' ? announcement.toObject() : announcement
  if (!doc) return null

  return {
    id: doc.id || String(doc._id),
    _id: doc._id,
    title: doc.title,
    body: doc.body,
    priority: doc.priority || 'normal',
    target: doc.target || 'all',
    targetRoomId: doc.targetRoomId || null,
    status: doc.status || 'published',
    scheduledAt: doc.scheduledAt || null,
    publishedAt: doc.publishedAt || null,
    createdBy: doc.createdBy,
    createdByName: doc.createdByName || 'Admin',
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt
  }
}

const serializeSettings = (doc) => {
  const settings = doc?.settings || {}

  return {
    ...DEFAULT_SETTINGS,
    maintenanceMode: Boolean(settings.maintenanceMode ?? DEFAULT_SETTINGS.maintenanceMode),
    openRegistration: Boolean(settings.openRegistration ?? settings.registrationOpen ?? DEFAULT_SETTINGS.openRegistration),
    profanityFilter: Boolean(settings.profanityFilter ?? DEFAULT_SETTINGS.profanityFilter),
    guestModeAllowed: Boolean(settings.guestModeAllowed ?? DEFAULT_SETTINGS.guestModeAllowed),
    autoDeleteMessages: Boolean(settings.autoDeleteMessages ?? DEFAULT_SETTINGS.autoDeleteMessages),
    emailNotifications: Boolean(settings.emailNotifications ?? DEFAULT_SETTINGS.emailNotifications),
    maxRoomSize: numberOrDefault(settings.maxRoomSize, DEFAULT_SETTINGS.maxRoomSize),
    maxMessageLength: numberOrDefault(settings.maxMessageLength, DEFAULT_SETTINGS.maxMessageLength),
    rateLimitPerMinute: numberOrDefault(settings.rateLimitPerMinute, DEFAULT_SETTINGS.rateLimitPerMinute)
  }
}

const settingsForDb = (settings) => ({
  maintenanceMode: Boolean(settings.maintenanceMode),
  registrationOpen: Boolean(settings.registrationOpen ?? settings.openRegistration),
  profanityFilter: Boolean(settings.profanityFilter),
  guestModeAllowed: Boolean(settings.guestModeAllowed),
  autoDeleteMessages: Boolean(settings.autoDeleteMessages),
  emailNotifications: Boolean(settings.emailNotifications),
  maxRoomSize: numberOrDefault(settings.maxRoomSize, DEFAULT_SETTINGS.maxRoomSize),
  maxMessageLength: numberOrDefault(settings.maxMessageLength, DEFAULT_SETTINGS.maxMessageLength),
  rateLimitPerMinute: numberOrDefault(settings.rateLimitPerMinute, DEFAULT_SETTINGS.rateLimitPerMinute)
})

const getOrCreateSettings = async () => {
  const existing = await PlatformSettings.findOne({ id: 'platform' })
  if (existing) return existing

  return PlatformSettings.create({
    id: 'platform',
    settings: settingsForDb(DEFAULT_SETTINGS)
  })
}

const createAuditLog = async (adminId, adminName, action, targetType, targetId, meta = {}) => {
  try {
    await AuditLog.create({
      action,
      adminId,
      adminName,
      targetType,
      targetId: targetId == null ? null : String(targetId),
      meta,
      adminPublicId: String(adminId || '')
    })
  } catch (err) {
    console.warn('AuditLog error:', err.message)
  }
}

const emitRealtime = async (roomId, event, payload) => {
  try {
    const { io } = await import('../server.js')
    if (roomId) io.to(roomId).emit(event, payload)
    else io.emit(event, payload)
  } catch {
    // Admin HTTP actions should still persist when realtime is unavailable.
  }
}

export const getAdminState = async (req, res, next) => {
  try {
    const [users, reports, deletedUsers, auditLogs, rooms, announcements, settings, stats] = await Promise.all([
      User.find({ status: { $ne: 'deleted' } }).sort({ createdAt: -1 }),
      Report.find().sort({ createdAt: -1 }).limit(50)
        .populate('reporterId', 'fullName username')
        .populate('reportedUserId', 'fullName username'),
      User.find({ status: 'deleted' }).sort({ updatedAt: -1 }).limit(50),
      AuditLog.find().sort({ createdAt: -1 }).limit(20).populate('adminId', 'fullName username'),
      Room.find({ status: { $ne: 'deleted' } }).sort({ createdAt: 1 }),
      Announcement.find().sort({ createdAt: -1 }).limit(20),
      getOrCreateSettings(),
      buildAdminStats()
    ])

    return res.json({
      users: users.map(safeUser),
      reports,
      deletedUsers: deletedUsers.map(safeUser),
      auditLogs,
      rooms: rooms.map(serializeRoom),
      announcements: announcements.map(formatAnnouncement),
      settings: serializeSettings(settings),
      stats
    })
  } catch (error) {
    return next(error)
  }
}

export const getAdminStats = async (req, res, next) => {
  try {
    return res.json(await buildAdminStats())
  } catch (error) {
    return next(error)
  }
}

export const getAdminUsers = async (req, res, next) => {
  try {
    const { search, status } = req.query
    const { page, limit, skip } = pageParams(req.query)
    const query = { status: { $ne: 'deleted' } }

    if (status && status !== 'all') query.status = status

    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { fullName: { $regex: search, $options: 'i' } }
      ]
    }

    const [total, users] = await Promise.all([
      User.countDocuments(query),
      User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit)
    ])

    return res.json({
      users: users.map(safeUser),
      total,
      page,
      totalPages: Math.ceil(total / limit)
    })
  } catch (error) {
    return next(error)
  }
}

export const updateUserStatus = async (req, res, next) => {
  try {
    const { status, reason } = req.body
    const allowedStatuses = new Set(['active', 'suspended'])

    if (!allowedStatuses.has(status)) {
      return res.status(400).json({ error: 'Status must be active or suspended.' })
    }

    const user = await User.findOne(userFilter(req.params.id))
    if (!user) return res.status(404).json({ error: 'User not found.' })

    if (user.role === 'admin') {
      return res.status(403).json({ error: 'Cannot modify admin accounts.' })
    }

    user.status = status
    if (status === 'suspended') {
      user.suspensionReason = reason || 'Community safety'
      user.suspendedAt = new Date()
    } else {
      user.suspensionReason = ''
      user.suspendedAt = null
    }

    await user.save({ validateBeforeSave: false })

    await createAuditLog(
      req.user._id,
      req.user.fullName,
      status === 'suspended' ? 'user_suspended' : 'user_reactivated',
      'user',
      user._id,
      { reason: reason || '', username: user.username }
    )

    if (status === 'suspended') {
      await emitRealtime(null, 'user_suspended', { userId: String(user._id) })
    }

    return res.json({
      user: safeUser(user),
      message: status === 'suspended' ? 'User suspended.' : 'User reactivated.'
    })
  } catch (error) {
    return next(error)
  }
}

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findOne(userFilter(req.params.id))
    if (!user) return res.status(404).json({ error: 'User not found.' })

    if (user.role === 'admin') {
      return res.status(403).json({ error: 'Cannot delete admin accounts.' })
    }

    const originalUsername = user.username
    const originalEmail = user.email
    const suffix = `${Date.now()}_${String(user._id).slice(-6)}`

    user.status = 'deleted'
    user.email = `deleted_${suffix}@deleted.com`
    user.username = `deleted_${suffix}`
    user.suspensionReason = ''
    user.suspendedAt = null
    await user.save({ validateBeforeSave: false })

    await createAuditLog(
      req.user._id,
      req.user.fullName,
      'user_deleted',
      'user',
      user._id,
      { originalUsername, originalEmail }
    )

    return res.json({ message: 'User deleted.' })
  } catch (error) {
    return next(error)
  }
}

export const getAdminReports = async (req, res, next) => {
  try {
    const { status } = req.query
    const { page, limit, skip } = pageParams(req.query)
    const query = {}

    if (status && status !== 'all') query.status = status

    const [total, reports] = await Promise.all([
      Report.countDocuments(query),
      Report.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('reporterId', 'fullName username')
        .populate('reportedUserId', 'fullName username')
    ])

    return res.json({
      reports,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    })
  } catch (error) {
    return next(error)
  }
}

export const resolveReport = async (req, res, next) => {
  try {
    const { action, adminNote } = req.body
    const allowedActions = new Set(['hide', 'dismiss', 'delete', 'restore'])

    if (!allowedActions.has(action)) {
      return res.status(400).json({ error: 'Invalid report action.' })
    }

    const report = await Report.findOne(reportFilter(req.params.id))
    if (!report) return res.status(404).json({ error: 'Report not found.' })

    const message = await Message.findById(report.messageId)

    if (action === 'hide') {
      report.status = 'hidden'
      if (message) {
        message.hidden = true
        await message.save({ validateBeforeSave: false })
        await emitRealtime(message.roomId, 'message:delete', { messageId: message.id || String(message._id) })
      }
    } else if (action === 'dismiss') {
      report.status = 'dismissed'
    } else if (action === 'delete') {
      report.status = 'deleted'
      if (message) {
        await Message.findByIdAndDelete(message._id)
        await emitRealtime(message.roomId, 'message:delete', { messageId: message.id || String(message._id) })
      }
    } else if (action === 'restore') {
      report.status = 'dismissed'
      if (message) {
        message.hidden = false
        await message.save({ validateBeforeSave: false })
        await emitRealtime(message.roomId, 'message:update', serializeMessage(message))
      }
    }

    report.resolvedBy = req.user._id
    report.resolvedAt = new Date()
    report.adminNote = adminNote || ''
    await report.save()

    await createAuditLog(
      req.user._id,
      req.user.fullName,
      `report_${action}`,
      'report',
      report._id,
      { reason: report.reason, roomId: report.roomId }
    )

    return res.json({
      report,
      message: 'Report resolved.'
    })
  } catch (error) {
    return next(error)
  }
}

export const getAdminRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find({ status: { $ne: 'deleted' } }).sort({ createdAt: 1 })
    return res.json({ rooms: rooms.map(serializeRoom) })
  } catch (error) {
    return next(error)
  }
}

export const deleteAdminRoom = async (req, res, next) => {
  try {
    const room = await Room.findOne(roomFilter(req.params.id))
    if (!room) return res.status(404).json({ error: 'Room not found.' })

    if (room.isSeeded) {
      return res.status(403).json({ error: 'Cannot delete default rooms.' })
    }

    room.status = 'deleted'
    room.hidden = true
    await room.save({ validateBeforeSave: false })

    await createAuditLog(
      req.user._id,
      req.user.fullName,
      'room_deleted',
      'room',
      room._id,
      { roomName: room.name, slug: room.slug }
    )

    await emitRealtime(null, 'rooms:update', { room: serializeRoom(room) })

    return res.json({ message: 'Room deleted.' })
  } catch (error) {
    return next(error)
  }
}

export const getAdminMessages = async (req, res, next) => {
  try {
    const { search, roomId, hidden } = req.query
    const { page, limit, skip } = pageParams(req.query, 30)
    const query = {}

    if (roomId) query.roomId = roomId
    if (hidden === 'true') query.hidden = true
    if (hidden === 'false') query.hidden = { $ne: true }

    if (search) {
      query.$or = [
        { text: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ]
    }

    const [total, messages] = await Promise.all([
      Message.countDocuments(query),
      Message.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit)
    ])

    return res.json({
      messages: messages.map(serializeMessage),
      total,
      page,
      totalPages: Math.ceil(total / limit)
    })
  } catch (error) {
    return next(error)
  }
}

export const deleteAdminMessage = async (req, res, next) => {
  try {
    const message = await Message.findOne(messageFilter(req.params.id))
    if (!message) return res.status(404).json({ error: 'Message not found.' })

    message.hidden = true
    await message.save({ validateBeforeSave: false })

    await emitRealtime(message.roomId, 'message:delete', {
      messageId: message.id || String(message._id)
    })

    await createAuditLog(
      req.user._id,
      req.user.fullName,
      'message_deleted',
      'message',
      message._id,
      {
        roomId: message.roomId,
        text: message.text?.slice(0, 50) || ''
      }
    )

    return res.json({ message: 'Message hidden.' })
  } catch (error) {
    return next(error)
  }
}

export const getAnnouncements = async (req, res, next) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 }).limit(20)
    return res.json({ announcements: announcements.map(formatAnnouncement) })
  } catch (error) {
    return next(error)
  }
}

export const createAnnouncement = async (req, res, next) => {
  try {
    const { title, body, priority, target, targetRoomId, status, scheduledAt } = req.body

    if (!title || !body) {
      return res.status(400).json({ error: 'Title and body are required.' })
    }

    const announcement = await Announcement.create({
      title: title.trim(),
      body: body.trim(),
      priority: priority || 'normal',
      target: target || 'all',
      targetRoomId: targetRoomId || null,
      status: status || 'published',
      scheduledAt: scheduledAt || null,
      createdBy: req.user._id,
      createdByName: req.user.fullName,
      createdByPublicId: String(req.user._id)
    })

    if (announcement.status === 'published') {
      await emitRealtime(null, 'announcement', {
        id: announcement.id || String(announcement._id),
        title: announcement.title,
        body: announcement.body,
        priority: announcement.priority,
        target: announcement.target,
        targetRoomId: announcement.targetRoomId
      })
    }

    await createAuditLog(
      req.user._id,
      req.user.fullName,
      'announcement_created',
      'announcement',
      announcement._id,
      { title: announcement.title }
    )

    return res.status(201).json({ announcement: formatAnnouncement(announcement) })
  } catch (error) {
    return next(error)
  }
}

export const updateAnnouncement = async (req, res, next) => {
  try {
    const updates = { ...req.body }
    delete updates.createdBy
    delete updates.createdByName

    updates.updatedBy = req.user._id
    updates.updatedByPublicId = String(req.user._id)
    updates.updatedByName = req.user.fullName

    const announcement = await Announcement.findOneAndUpdate(
      announcementFilter(req.params.id),
      updates,
      { new: true, runValidators: true }
    )

    if (!announcement) return res.status(404).json({ error: 'Announcement not found.' })

    await createAuditLog(
      req.user._id,
      req.user.fullName,
      'announcement_updated',
      'announcement',
      announcement._id,
      { title: announcement.title }
    )

    if (announcement.status === 'published') {
      await emitRealtime(null, 'announcement:update', formatAnnouncement(announcement))
    }

    return res.json({ announcement: formatAnnouncement(announcement) })
  } catch (error) {
    return next(error)
  }
}

export const deleteAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findOneAndDelete(announcementFilter(req.params.id))
    if (!announcement) return res.status(404).json({ error: 'Announcement not found.' })

    await createAuditLog(
      req.user._id,
      req.user.fullName,
      'announcement_deleted',
      'announcement',
      announcement._id,
      { title: announcement.title }
    )

    await emitRealtime(null, 'announcement:delete', {
      announcementId: announcement.id || String(announcement._id)
    })

    return res.json({ message: 'Announcement deleted.' })
  } catch (error) {
    return next(error)
  }
}

export const getSettings = async (req, res, next) => {
  try {
    const settingsDoc = await getOrCreateSettings()
    return res.json({ settings: serializeSettings(settingsDoc) })
  } catch (error) {
    return next(error)
  }
}

export const updateSettings = async (req, res, next) => {
  try {
    const settings = {
      ...DEFAULT_SETTINGS,
      ...req.body
    }

    const settingsDoc = await PlatformSettings.findOneAndUpdate(
      { id: 'platform' },
      {
        $set: {
          settings: settingsForDb(settings),
          updatedBy: String(req.user._id)
        }
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true
      }
    )

    await createAuditLog(
      req.user._id,
      req.user.fullName,
      'settings_updated',
      'settings',
      'platform',
      serializeSettings(settingsDoc)
    )

    return res.json({
      settings: serializeSettings(settingsDoc),
      message: 'Settings saved.'
    })
  } catch (error) {
    return next(error)
  }
}

export const getAuditLogs = async (req, res, next) => {
  try {
    const { page, limit, skip } = pageParams(req.query, 50)

    const [total, logs] = await Promise.all([
      AuditLog.countDocuments(),
      AuditLog.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('adminId', 'fullName username')
    ])

    return res.json({
      logs,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    })
  } catch (error) {
    return next(error)
  }
}

async function buildAdminStats() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [
    totalUsers,
    activeUsers,
    totalRooms,
    activeRooms,
    pendingReports,
    blockedUsers,
    messagesToday,
    hiddenMessages,
    onlineCount
  ] = await Promise.all([
    User.countDocuments({ status: { $ne: 'deleted' } }),
    User.countDocuments({
      role: { $ne: 'admin' },
      status: { $ne: 'deleted' }
    }),
    Room.countDocuments({ status: { $ne: 'deleted' } }),
    Room.countDocuments({ status: 'active' }),
    Report.countDocuments({ status: 'open' }),
    User.countDocuments({ status: 'suspended' }),
    Message.countDocuments({ createdAt: { $gte: today } }),
    Message.countDocuments({ hidden: true }),
    getOnlineCount()
  ])

  return {
    totalUsers,
    activeUsers,
    totalRooms,
    activeRooms,
    pendingReports,
    blockedUsers,
    messagesToday,
    hiddenMessages,
    onlineCount
  }
}
