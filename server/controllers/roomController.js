import mongoose from 'mongoose'
import Announcement from '../models/Announcement.js'
import Message from '../models/Message.js'
import Report from '../models/Report.js'
import Room from '../models/Room.js'
import User from '../models/User.js'
import { getMessagesForRoom, serializeMessage } from './messageController.js'
import { getOnlineCount } from '../socket/presence.js'

const toMillis = (value) => {
  if (!value) return null
  if (typeof value === 'number') return value
  const time = new Date(value).getTime()
  return Number.isNaN(time) ? null : time
}

export const serializeRoom = (room) => {
  const doc = typeof room.toObject === 'function' ? room.toObject() : room
  if (!doc) return null

  return {
    id: doc.id || doc.slug || String(doc._id),
    _id: doc._id,
    name: doc.name,
    slug: doc.slug,
    description: doc.description || doc.desc || '',
    desc: doc.desc || doc.description || '',
    icon: doc.icon || '#',
    color: doc.color || '#6c63ff',
    category: doc.category || 'Public Room',
    visibility: doc.visibility || 'public',
    isPasswordProtected: Boolean(doc.isPasswordProtected || doc.passwordProtected),
    passwordProtected: Boolean(doc.isPasswordProtected || doc.passwordProtected),
    maxCapacity: Number(doc.maxCapacity || 250),
    activeMembers: Number(doc.activeMembers || 0),
    onlineMembers: Number(doc.onlineMembers || 0),
    messageCount: Number(doc.messageCount || 0),
    pinnedMessage: doc.pinnedMessage || '',
    isSeeded: Boolean(doc.isSeeded),
    status: doc.status || 'active',
    hidden: Boolean(doc.hidden),
    createdAt: toMillis(doc.createdAt),
    updatedAt: toMillis(doc.updatedAt)
  }
}

const serializeAnnouncement = (announcement) => {
  const doc = typeof announcement.toObject === 'function' ? announcement.toObject() : announcement
  if (!doc) return null

  return {
    id: doc.id || String(doc._id),
    title: doc.title,
    body: doc.body,
    priority: doc.priority || 'normal',
    target: doc.target || 'all',
    targetRoomId: doc.targetRoomId || null,
    status: doc.status || 'published',
    scheduledAt: toMillis(doc.scheduledAt),
    publishedAt: toMillis(doc.publishedAt),
    createdAt: toMillis(doc.createdAt),
    updatedAt: toMillis(doc.updatedAt)
  }
}

export const getPublicState = async (req, res, next) => {
  try {
    const [rooms, messages, announcements, onlineCount, userCount, openReports, hiddenMessages] = await Promise.all([
      Room.find({ status: 'active', hidden: { $ne: true } }).sort({ createdAt: 1 }).lean(),
      Message.find({ hidden: { $ne: true } }).sort({ createdAt: 1 }).limit(250).lean(),
      Announcement.find({ status: 'published' }).sort({ createdAt: -1 }).limit(30).lean(),
      getOnlineCount(),
      User.countDocuments({ status: 'active' }),
      Report.countDocuments({ status: 'open' }),
      Message.countDocuments({ hidden: true })
    ])

    return res.json({
      rooms: rooms.map(serializeRoom),
      messages: messages.map(serializeMessage),
      announcements: announcements.map(serializeAnnouncement),
      reports: [],
      typing: [],
      stats: {
        online: onlineCount,
        users: userCount,
        openReports,
        hiddenMessages
      }
    })
  } catch (error) {
    return next(error)
  }
}

export const getRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find({
      status: 'active',
      hidden: { $ne: true }
    }).sort({ createdAt: 1 })

    return res.json({ rooms: rooms.map(serializeRoom) })
  } catch (error) {
    return next(error)
  }
}

export const getRoomById = async (req, res, next) => {
  try {
    const room = await findRoom(req.params.id)

    if (!room) {
      return res.status(404).json({
        error: 'Room not found.'
      })
    }

    return res.json({ room: serializeRoom(room) })
  } catch (error) {
    return next(error)
  }
}

export const getRoomMessages = async (req, res, next) => {
  try {
    const room = await findRoom(req.params.id || req.params.roomId)
    if (!room) return res.status(404).json({ error: 'Room not found.' })

    const viewerId = String(req.user?._id || req.user?.id || '')
    const messages = await getMessagesForRoom(room.id || room.slug, viewerId)

    return res.json({ room: serializeRoom(room), messages })
  } catch (error) {
    return next(error)
  }
}

export const createRoom = async (req, res, next) => {
  try {
    const {
      name,
      description,
      icon,
      color,
      category,
      visibility,
      maxCapacity
    } = req.body

    if (!name) {
      return res.status(400).json({
        error: 'Room name is required.'
      })
    }

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')

    const room = await Room.create({
      name: name.trim(),
      slug: `${slug}-${Date.now()}`,
      description: description || '',
      desc: description || '',
      icon: icon || '#',
      color: color || '#6c63ff',
      category: category || 'Public Room',
      visibility: visibility || 'public',
      maxCapacity: maxCapacity || 250,
      status: 'active',
      createdBy: req.user._id,
      createdById: String(req.user._id)
    })

    return res.status(201).json({ room: serializeRoom(room) })
  } catch (error) {
    return next(error)
  }
}

export const updateRoom = async (req, res, next) => {
  try {
    const room = await Room.findOneAndUpdate(
      roomFilter(req.params.id),
      req.body,
      { returnDocument: 'after', runValidators: true }
    )

    if (!room) return res.status(404).json({ error: 'Room not found.' })

    return res.json({ room: serializeRoom(room) })
  } catch (error) {
    return next(error)
  }
}

export const deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findOneAndUpdate(
      roomFilter(req.params.id),
      { status: 'deleted' },
      { returnDocument: 'after' }
    )

    if (!room) return res.status(404).json({ error: 'Room not found.' })

    return res.json({ message: 'Room deleted.' })
  } catch (error) {
    return next(error)
  }
}

async function findRoom(id) {
  return Room.findOne({
    ...roomFilter(id),
    status: 'active',
    hidden: { $ne: true }
  })
}

function roomFilter(id) {
  const or = [{ slug: id }, { id }]
  if (mongoose.Types.ObjectId.isValid(String(id || ''))) {
    or.push({ _id: id })
  }
  return { $or: or }
}

export const listRooms = getRooms
export const getRoom = getRoomById
