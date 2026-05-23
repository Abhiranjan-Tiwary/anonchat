import jwt from 'jsonwebtoken'
import { nanoid } from 'nanoid'
import User from '../models/User.js'
import Message from '../models/Message.js'
import Room from '../models/Room.js'
import Report from '../models/Report.js'
import {
  setUserOnline,
  setUserOffline,
  getOnlineCount,
  joinRoomPresence,
  leaveRoomPresence,
  leaveAllRooms,
  getRoomMemberCount
} from './presence.js'

const socketUserMap = new Map()
const socketRoomsMap = new Map()
const typingTimers = new Map()

export const registerHandlers = (io, socket) => {
  console.log(`Socket connected: ${socket.id}`)

  socket.emit('connected', {
    socketId: socket.id,
    message: 'Connected to AnonChat realtime server.'
  })

  socket.on('presence:online', async ({ token } = {}) => {
    try {
      const user = await authenticate(token || socket.handshake.auth?.token)
      if (!user) return

      socketUserMap.set(socket.id, {
        ...(socketUserMap.get(socket.id) || {}),
        user
      })

      await setUserOnline(user._id, {
        userId: user._id,
        name: user.fullName,
        username: user.username,
        roomId: socketUserMap.get(socket.id)?.roomId || ''
      })

      await broadcastRooms(io)
    } catch (err) {
      console.warn('presence:online error:', err.message)
    }
  })

  socket.on('room:join', async ({ token, roomId } = {}) => {
    try {
      const user = await authenticate(token || socket.handshake.auth?.token)
      if (!user) {
        socket.emit('server-error', {
          error: 'Authentication failed.'
        })
        return
      }

      if (!roomId) {
        socket.emit('server-error', { error: 'roomId is required.' })
        return
      }

      const room = await findRoom(roomId)
      if (!room) {
        socket.emit('server-error', { error: 'Room not found.' })
        return
      }

      const canonicalRoomId = room.id || room.slug
      const prevRooms = socketRoomsMap.get(socket.id) || []

      for (const prevRoom of prevRooms) {
        if (prevRoom === canonicalRoomId) continue
        socket.leave(prevRoom)
        await leaveRoomPresence(prevRoom, user._id)

        socket.to(prevRoom).emit('user_left', {
          userId: String(user._id),
          username: user.fullName,
          roomId: prevRoom
        })

        await syncRoomMemberCount(prevRoom)
      }

      socket.join(canonicalRoomId)
      socketUserMap.set(socket.id, { user, roomId: canonicalRoomId })
      socketRoomsMap.set(socket.id, [canonicalRoomId])

      await setUserOnline(user._id, {
        userId: user._id,
        name: user.fullName,
        username: user.username,
        roomId: canonicalRoomId
      })
      await joinRoomPresence(canonicalRoomId, user._id)

      const memberCount = await syncRoomMemberCount(canonicalRoomId)

      socket.to(canonicalRoomId).emit('user_joined', {
        userId: String(user._id),
        username: user.fullName,
        roomId: canonicalRoomId
      })

      console.log(`User joined ${canonicalRoomId}`)

      const [messages, rooms, onlineCount, userCount, openReports, hiddenMessages] = await Promise.all([
        Message.find({
          roomId: canonicalRoomId,
          hidden: { $ne: true }
        }).sort({ createdAt: -1 }).limit(50),
        Room.find({ status: 'active' }).sort({ createdAt: 1 }),
        getOnlineCount(),
        User.countDocuments({ status: 'active' }),
        Report.countDocuments({ status: 'open' }),
        Message.countDocuments({ hidden: true })
      ])

      socket.emit('state', {
        messages: messages.reverse().map(formatMessage),
        rooms: rooms.map((item) => formatRoom(item, item.id === canonicalRoomId ? memberCount : undefined)),
        typing: [],
        stats: {
          online: onlineCount,
          users: userCount,
          openReports,
          hiddenMessages
        }
      })

      await broadcastRooms(io)
    } catch (err) {
      console.error('room:join error:', err.message)
      socket.emit('server-error', { error: err.message })
    }
  })

  socket.on('room:leave', async ({ token, roomId } = {}) => {
    try {
      const user = await authenticate(token || socket.handshake.auth?.token)
      if (!user || !roomId) return

      await leaveSocketRoom(io, socket, user, roomId)
      await broadcastRooms(io)
    } catch (err) {
      console.warn('room:leave error:', err.message)
    }
  })

  socket.on('message:send', async ({ token, roomId, text, replyToMessageId, attachment } = {}) => {
    try {
      const user = await authenticate(token || socket.handshake.auth?.token)
      if (!user) return
      if (!roomId || (!text && !attachment)) return

      const room = await findRoom(roomId)
      if (!room) return

      let replyTo = null
      if (replyToMessageId) {
        const original = await findMessage(replyToMessageId)
        if (original) {
          replyTo = {
            messageId: original._id,
            id: original.id || String(original._id),
            author: original.author,
            text: original.text?.slice(0, 100) || ''
          }
        }
      }

      const canonicalRoomId = room.id || room.slug
      const message = await Message.create({
        id: `msg_${nanoid(12)}`,
        roomId: canonicalRoomId,
        roomObjectId: room._id,
        authorId: String(user._id),
        authorObjectId: user._id,
        author: user.anonymousName || user.fullName,
        avatarColor: user.avatarColor,
        avatarDataUrl: user.avatarDataUrl || '',
        text: text || '',
        type: attachment ? 'media' : 'text',
        attachment: attachment || null,
        replyTo,
        delivery: {
          sentAt: new Date(),
          deliveredTo: [],
          seenBy: []
        }
      })

      await Room.findOneAndUpdate(
        { $or: [{ slug: canonicalRoomId }, { id: canonicalRoomId }] },
        { $inc: { messageCount: 1 } }
      )

      const formatted = formatMessage(message)
      io.to(canonicalRoomId).emit('message:new', formatted)
      await broadcastRooms(io)
    } catch (err) {
      console.error('message:send error:', err.message)
      socket.emit('server-error', { error: err.message })
    }
  })

  socket.on('typing:start', async ({ token, roomId } = {}) => {
    try {
      const user = await authenticate(token || socket.handshake.auth?.token)
      if (!user || !roomId) return

      const payload = {
        userId: String(user._id),
        name: user.fullName,
        roomId,
        expiresAt: Date.now() + 3500
      }

      socket.to(roomId).emit('typing:start', payload)

      const timerKey = `${socket.id}:${roomId}`
      clearTimeout(typingTimers.get(timerKey))
      typingTimers.set(timerKey, setTimeout(() => {
        socket.to(roomId).emit('typing:stop', {
          userId: String(user._id),
          roomId
        })
        typingTimers.delete(timerKey)
      }, 3500))
    } catch (err) {
      console.warn('typing:start error:', err.message)
    }
  })

  socket.on('typing:stop', async ({ token, roomId } = {}) => {
    try {
      const user = await authenticate(token || socket.handshake.auth?.token)
      if (!user || !roomId) return

      clearTimeout(typingTimers.get(`${socket.id}:${roomId}`))
      typingTimers.delete(`${socket.id}:${roomId}`)

      socket.to(roomId).emit('typing:stop', {
        userId: String(user._id),
        roomId
      })
    } catch (err) {
      console.warn('typing:stop error:', err.message)
    }
  })

  socket.on('message:delivered', async ({ token, messageId } = {}) => {
    try {
      const user = await authenticate(token || socket.handshake.auth?.token)
      if (!user || !messageId) return

      const message = await Message.findOneAndUpdate(
        messageFilter(messageId),
        {
          $addToSet: {
            'delivery.deliveredTo': String(user._id)
          }
        },
        { returnDocument: 'after' }
      )

      if (message) {
        io.to(message.roomId).emit('message:delivery', formatMessage(message))
      }
    } catch (err) {
      console.warn('message:delivered error:', err.message)
    }
  })

  socket.on('message:seen', async ({ token, roomId } = {}) => {
    try {
      const user = await authenticate(token || socket.handshake.auth?.token)
      if (!user || !roomId) return

      await Message.updateMany(
        {
          roomId,
          authorId: { $ne: String(user._id) },
          'delivery.seenBy': { $ne: String(user._id) }
        },
        {
          $addToSet: {
            'delivery.seenBy': String(user._id),
            'delivery.deliveredTo': String(user._id)
          }
        }
      )

      io.to(roomId).emit('message:seen', {
        roomId,
        userId: String(user._id)
      })
    } catch (err) {
      console.warn('message:seen error:', err.message)
    }
  })

  socket.on('message:react', async ({ token, messageId } = {}) => {
    try {
      const user = await authenticate(token || socket.handshake.auth?.token)
      if (!user || !messageId) return

      const message = await findMessage(messageId)
      if (!message) return

      const userKey = String(user._id)
      const reactedBy = message.reactedBy.map(String)
      const index = reactedBy.indexOf(userKey)

      if (index > -1) {
        message.reactedBy.splice(index, 1)
        message.reactions = Math.max(0, message.reactions - 1)
      } else {
        message.reactedBy.push(userKey)
        message.reactions += 1
      }

      await message.save({ validateBeforeSave: false })

      io.to(message.roomId).emit('reaction:update', formatMessage(message))
    } catch (err) {
      console.warn('message:react error:', err.message)
    }
  })

  socket.on('disconnect', async () => {
    try {
      for (const [key, timer] of typingTimers.entries()) {
        if (key.startsWith(`${socket.id}:`)) {
          clearTimeout(timer)
          typingTimers.delete(key)
        }
      }

      const userData = socketUserMap.get(socket.id)
      if (!userData?.user) return

      const { user } = userData
      const rooms = socketRoomsMap.get(socket.id) || []

      await setUserOffline(user._id)
      await leaveAllRooms(user._id, rooms)

      await User.findByIdAndUpdate(user._id, {
        lastSeen: new Date()
      })

      for (const room of rooms) {
        socket.to(room).emit('user_left', {
          userId: String(user._id),
          username: user.fullName,
          roomId: room
        })

        await syncRoomMemberCount(room)
      }

      socketUserMap.delete(socket.id)
      socketRoomsMap.delete(socket.id)

      await broadcastRooms(io)
    } catch (err) {
      console.warn('disconnect error:', err.message)
    }
  })
}

async function authenticate(token) {
  try {
    if (!token || !process.env.JWT_SECRET) return null
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    return await User.findById(decoded.id).select('-password')
  } catch {
    return null
  }
}

async function leaveSocketRoom(io, socket, user, roomId) {
  const rooms = socketRoomsMap.get(socket.id) || []
  const nextRooms = rooms.filter((item) => item !== roomId)
  socketRoomsMap.set(socket.id, nextRooms)
  socket.leave(roomId)

  await leaveRoomPresence(roomId, user._id)
  await syncRoomMemberCount(roomId)

  socket.to(roomId).emit('user_left', {
    userId: String(user._id),
    username: user.fullName,
    roomId
  })
}

async function syncRoomMemberCount(roomId) {
  const count = await getRoomMemberCount(roomId)
  await Room.findOneAndUpdate(
    { $or: [{ slug: roomId }, { id: roomId }] },
    { activeMembers: count }
  )
  return count
}

async function broadcastRooms(io) {
  const [rooms, onlineCount] = await Promise.all([
    Room.find({ status: 'active' }).sort({ createdAt: 1 }),
    getOnlineCount()
  ])

  io.emit('rooms:update', {
    rooms: rooms.map(formatRoom),
    stats: { online: onlineCount }
  })
}

async function findRoom(roomId) {
  return Room.findOne({
    $or: [{ slug: roomId }, { id: roomId }],
    status: 'active',
    hidden: { $ne: true }
  })
}

async function findMessage(messageId) {
  return Message.findOne(messageFilter(messageId))
}

function messageFilter(messageId) {
  const or = [{ id: messageId }]
  if (isObjectId(messageId)) or.push({ _id: messageId })
  return { $or: or }
}

function isObjectId(value) {
  return /^[a-f\d]{24}$/i.test(String(value || ''))
}

export const formatMessage = (message) => ({
  id: message.id || String(message._id),
  _id: message._id,
  roomId: message.roomId,
  authorId: String(message.authorId || ''),
  author: message.author,
  avatarColor: message.avatarColor,
  avatarDataUrl: message.avatarDataUrl || '',
  text: message.text,
  type: message.type || 'text',
  attachment: message.attachment || null,
  replyTo: message.replyTo || null,
  poll: message.poll || null,
  reactions: message.reactions || 0,
  reactedBy: (message.reactedBy || []).map(String),
  delivery: {
    sentAt: message.delivery?.sentAt?.getTime?.() || message.delivery?.sentAt || message.createdAt?.getTime?.() || Date.now(),
    deliveredTo: (message.delivery?.deliveredTo || []).map(String),
    seenBy: (message.delivery?.seenBy || []).map(String)
  },
  hidden: message.hidden || false,
  deletedFor: (message.deletedFor || []).map(String),
  editedAt: message.editedAt?.getTime?.() || message.editedAt || null,
  reported: message.reported || false,
  createdAt: message.createdAt?.getTime?.() || Date.now()
})

export const formatRoom = (room, activeMembers) => ({
  id: room.id || room.slug || String(room._id),
  _id: room._id,
  name: room.name,
  slug: room.slug,
  desc: room.description || room.desc || '',
  description: room.description || room.desc || '',
  icon: room.icon || '#',
  color: room.color || '#6c63ff',
  category: room.category || 'Public Room',
  visibility: room.visibility || 'public',
  maxCapacity: room.maxCapacity || 250,
  activeMembers: activeMembers ?? room.activeMembers ?? 0,
  onlineMembers: activeMembers ?? room.activeMembers ?? 0,
  messageCount: room.messageCount || 0,
  status: room.status || 'active',
  isSeeded: room.isSeeded || false,
  createdAt: room.createdAt
})

export const registerSocketHandlers = registerHandlers
