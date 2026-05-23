import mongoose from 'mongoose'
import { nanoid } from 'nanoid'
import Message from '../models/Message.js'
import Room from '../models/Room.js'

const MAX_MESSAGE_LENGTH = 2000
const EDIT_WINDOW_MS = 5 * 60 * 1000
const MAX_ATTACHMENT_BYTES = 8 * 1024 * 1024
const ATTACHMENT_KINDS = new Set(['image', 'video', 'audio', 'file'])

const toMillis = (value) => {
  if (!value) return null
  if (typeof value === 'number') return value
  const time = new Date(value).getTime()
  return Number.isNaN(time) ? null : time
}

const userId = (user) => String(user?._id || user?.id || '')

const displayName = (user) => user?.anonymousName || user?.fullName || user?.username || 'Anonymous User'

const normalizeReactionEmoji = (emoji) => {
  const value = String(emoji || '').trim()
  return new Set(['\u{1F44D}', '\u2764\uFE0F', '\u{1F602}', '\u{1F62E}', '\u{1F622}', '\u{1F525}']).has(value) ? value : '\u{1F44D}'
}

const summarizeReactions = (reactionsByUser = {}) =>
  Object.values(reactionsByUser).reduce((summary, emoji) => {
    summary[emoji] = (summary[emoji] || 0) + 1
    return summary
  }, {})

export const serializeMessage = (message) => {
  const doc = typeof message.toObject === 'function' ? message.toObject() : message
  if (!doc) return null

  return {
    id: doc.id || String(doc._id),
    _id: doc._id,
    roomId: doc.roomId,
    authorId: String(doc.authorId || ''),
    author: doc.author,
    avatarColor: doc.avatarColor || '#6c63ff',
    avatarDataUrl: doc.avatarDataUrl || '',
    text: doc.text || '',
    type: doc.type || 'text',
    attachment: doc.attachment || null,
    replyTo: doc.replyTo || null,
    poll: doc.poll || null,
    reactions: Number(doc.reactions || 0),
    reactedBy: Array.isArray(doc.reactedBy) ? doc.reactedBy.map(String) : [],
    reactionSummary: doc.reactionSummary || {},
    reactionsByUser: doc.reactionsByUser || {},
    delivery: {
      sentAt: toMillis(doc.delivery?.sentAt) || toMillis(doc.createdAt) || Date.now(),
      deliveredTo: Array.isArray(doc.delivery?.deliveredTo) ? doc.delivery.deliveredTo.map(String) : [],
      seenBy: Array.isArray(doc.delivery?.seenBy) ? doc.delivery.seenBy.map(String) : []
    },
    hidden: Boolean(doc.hidden),
    deletedFor: Array.isArray(doc.deletedFor) ? doc.deletedFor.map(String) : [],
    editedAt: toMillis(doc.editedAt),
    deletedAt: toMillis(doc.deletedAt),
    deletedBy: doc.deletedBy || '',
    reported: Boolean(doc.reported),
    moderationReasons: Array.isArray(doc.moderationReasons) ? doc.moderationReasons : [],
    createdAt: toMillis(doc.createdAt) || Date.now(),
    updatedAt: toMillis(doc.updatedAt)
  }
}

export const getMessagesForRoom = async (roomId, viewerId = '', limit = 200, before = '') => {
  const query = {
    roomId,
    hidden: { $ne: true },
    deletedFor: { $ne: viewerId }
  }

  if (before) {
    query.createdAt = { $lt: new Date(before) }
  }

  const messages = await Message.find(query)
    .sort({ createdAt: -1 })
    .limit(Number(limit))
    .lean()

  return messages.reverse().map(serializeMessage)
}

export const getMessages = async (req, res, next) => {
  try {
    const { roomId, limit = 50, before } = req.query

    if (!roomId) {
      return res.status(400).json({
        error: 'roomId is required.'
      })
    }

    const viewerId = String(req.user?._id || req.user?.id || '')
    const messages = await getMessagesForRoom(roomId, viewerId, limit, before)

    return res.json({ messages })
  } catch (error) {
    return next(error)
  }
}

export const sendMessage = async (req, res, next) => {
  try {
    const {
      roomId,
      text = '',
      replyToMessageId,
      attachment
    } = req.body
    const cleanText = String(text || '').trim()

    if (!roomId) {
      return res.status(400).json({
        error: 'roomId is required.'
      })
    }

    if (!cleanText && !attachment) {
      return res.status(400).json({
        error: 'Message text or attachment required.'
      })
    }

    if (cleanText.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({ error: `Message cannot exceed ${MAX_MESSAGE_LENGTH} characters.` })
    }

    const room = await Room.findOne({
      $or: [{ slug: roomId }, { id: roomId }],
      status: 'active',
      hidden: { $ne: true }
    })

    if (!room) {
      return res.status(404).json({ error: 'Room not found.' })
    }

    let replyTo = null
    if (replyToMessageId) {
      const original = await findMessageById(replyToMessageId)
      if (original) {
        replyTo = {
          messageId: original._id,
          id: original.id || String(original._id),
          author: original.author,
          text: original.text?.slice(0, 100) || ''
        }
      }
    }

    const message = await Message.create({
      id: `msg_${nanoid(12)}`,
      roomId: room.id || room.slug,
      roomObjectId: room._id,
      authorId: userId(req.user),
      authorObjectId: req.user._id,
      author: displayName(req.user),
      avatarColor: req.user.avatarColor || '#6c63ff',
      avatarDataUrl: req.user.avatarDataUrl || '',
      text: cleanText,
      type: attachment ? 'media' : 'text',
      attachment: normalizeAttachment(attachment),
      replyTo,
      delivery: {
        sentAt: new Date(),
        deliveredTo: [],
        seenBy: []
      },
      reactionSummary: {},
      reactionsByUser: {}
    })

    await Room.findOneAndUpdate(
      { $or: [{ slug: roomId }, { id: roomId }] },
      { $inc: { messageCount: 1 } }
    )

    const formatted = serializeMessage(message)
    await emitToRoom(formatted.roomId, 'message:new', formatted)

    return res.status(201).json({ message: formatted })
  } catch (error) {
    return next(error)
  }
}

export const editMessage = async (req, res, next) => {
  try {
    const { text } = req.body
    const message = await findMessageById(req.params.id)

    if (!message || String(message.authorId) !== userId(req.user)) {
      return res.status(404).json({
        error: 'Message not found.'
      })
    }

    const diff = Date.now() - message.createdAt.getTime()
    if (diff > EDIT_WINDOW_MS) {
      return res.status(400).json({
        error: 'Edit window expired (5 minutes).'
      })
    }

    message.text = String(text || '').trim()
    message.editedAt = new Date()
    await message.save()

    const formatted = serializeMessage(message)
    await emitToRoom(message.roomId, 'message:update', formatted)

    return res.json({ message: formatted })
  } catch (error) {
    return next(error)
  }
}

export const deleteMessage = async (req, res, next) => {
  try {
    const { scope } = req.body
    const message = await findMessageById(req.params.id)

    if (!message) {
      return res.status(404).json({
        error: 'Message not found.'
      })
    }

    if (scope === 'me') {
      await Message.updateOne(
        { _id: message._id },
        { $addToSet: { deletedFor: userId(req.user) } }
      )
      const updated = await Message.findById(message._id)
      return res.json({ message: serializeMessage(updated) })
    }

    if (String(message.authorId) !== userId(req.user) && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Cannot delete others messages.'
      })
    }

    message.hidden = true
    await message.save({ validateBeforeSave: false })

    await emitToRoom(message.roomId, 'message:delete', {
      messageId: message.id || String(message._id)
    })

    return res.json({ message: serializeMessage(message) })
  } catch (error) {
    return next(error)
  }
}

export const reactToMessage = async (req, res, next) => {
  try {
    const message = await findMessageById(req.params.id)

    if (!message) {
      return res.status(404).json({
        error: 'Message not found.'
      })
    }

    const currentUserId = userId(req.user)
    const emoji = normalizeReactionEmoji(req.body.emoji)
    const existingReactions = message.reactionsByUser instanceof Map
      ? Object.fromEntries(message.reactionsByUser)
      : { ...(message.reactionsByUser || {}) }

    if (existingReactions[currentUserId] === emoji) {
      delete existingReactions[currentUserId]
    } else {
      existingReactions[currentUserId] = emoji
    }

    message.reactionsByUser = existingReactions
    message.reactionSummary = summarizeReactions(existingReactions)
    message.reactedBy = Object.keys(existingReactions)
    message.reactions = message.reactedBy.length
    await message.save({ validateBeforeSave: false })

    const formatted = serializeMessage(message)
    await emitToRoom(message.roomId, 'reaction:update', formatted)

    return res.json({ message: formatted })
  } catch (error) {
    return next(error)
  }
}

async function findMessageById(id) {
  if (mongoose.Types.ObjectId.isValid(String(id || ''))) {
    const byObjectId = await Message.findById(id)
    if (byObjectId) return byObjectId
  }

  return Message.findOne({ id })
}

function normalizeAttachment(attachment) {
  if (!attachment) return null

  const kind = ATTACHMENT_KINDS.has(attachment.kind) ? attachment.kind : 'file'
  const size = Number(attachment.size || 0)

  if (size > MAX_ATTACHMENT_BYTES) {
    const error = new Error('Attachment is too large.')
    error.status = 400
    throw error
  }

  return {
    kind,
    name: String(attachment.name || '').slice(0, 160),
    mimeType: String(attachment.mimeType || '').slice(0, 120),
    size,
    url: attachment.url || '',
    dataUrl: attachment.dataUrl || ''
  }
}

async function emitToRoom(roomId, event, payload) {
  try {
    const { io } = await import('../server.js')
    io.to(roomId).emit(event, payload)
  } catch {
    // HTTP persistence should not fail if realtime emit is unavailable.
  }
}

export const createMessage = sendMessage
export const updateMessage = editMessage
export const listRoomMessages = getMessagesForRoom
