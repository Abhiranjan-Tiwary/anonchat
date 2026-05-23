import mongoose from 'mongoose'
import { nanoid } from 'nanoid'
import Report from '../models/Report.js'
import Message from '../models/Message.js'

const allowedReasons = new Set([
  'harassment',
  'spam',
  'inappropriate_content',
  'hate_speech',
  'threats',
  'misinformation',
  'other'
])

export const getReports = async (req, res, next) => {
  try {
    const reports = await Report.find({
      reporterId: req.user._id
    }).sort({ createdAt: -1 })

    return res.json({ reports: reports.map(serializeReport) })
  } catch (error) {
    return next(error)
  }
}

export const createReport = async (req, res, next) => {
  try {
    const { messageId, reason } = req.body

    if (!messageId || !reason) {
      return res.status(400).json({
        error: 'Message and reason are required.'
      })
    }

    const message = await findMessageById(messageId)
    if (!message) return res.status(404).json({ error: 'Message not found.' })

    const existing = await Report.findOne({
      messageId: message._id,
      reporterId: req.user._id
    })

    if (existing) {
      return res.status(400).json({
        error: 'You already reported this message.'
      })
    }

    const report = await Report.create({
      id: `rep_${nanoid(12)}`,
      messageId: message._id,
      messagePublicId: message.id || String(message._id),
      reporterId: req.user._id,
      reporterPublicId: String(req.user._id),
      reporterName: req.user.fullName,
      reportedUserId: objectIdOrNull(message.authorId),
      reportedUserPublicId: String(message.authorId || ''),
      reason: normalizeReason(reason),
      reasonText: String(reason || ''),
      roomId: message.roomId || '',
      message: {
        id: message.id || String(message._id),
        text: message.text,
        author: message.author,
        userName: message.author
      }
    })

    message.reported = true
    await message.save({ validateBeforeSave: false })

    return res.status(201).json({
      report: serializeReport(report),
      message: 'Report submitted.'
    })
  } catch (error) {
    return next(error)
  }
}

function serializeReport(report) {
  const doc = typeof report.toObject === 'function' ? report.toObject() : report

  return {
    id: doc.id || String(doc._id),
    messageId: doc.messagePublicId || String(doc.messageId || ''),
    reporterId: doc.reporterPublicId || String(doc.reporterId || ''),
    reporterName: doc.reporterName || 'Anonymous',
    reportedUserId: doc.reportedUserPublicId || String(doc.reportedUserId || ''),
    reason: doc.reasonText || doc.reason,
    status: doc.status || 'open',
    roomId: doc.roomId || '',
    message: doc.message || null,
    createdAt: new Date(doc.createdAt || Date.now()).getTime()
  }
}

async function findMessageById(id) {
  if (mongoose.Types.ObjectId.isValid(String(id || ''))) {
    const byObjectId = await Message.findById(id)
    if (byObjectId) return byObjectId
  }

  return Message.findOne({ id })
}

function objectIdOrNull(value) {
  return mongoose.Types.ObjectId.isValid(String(value || ''))
    ? new mongoose.Types.ObjectId(String(value))
    : null
}

function normalizeReason(reason) {
  const value = String(reason || '')
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_')

  if (allowedReasons.has(value)) return value
  if (value.includes('harass')) return 'harassment'
  if (value.includes('spam')) return 'spam'
  if (value.includes('hate')) return 'hate_speech'
  if (value.includes('threat')) return 'threats'
  if (value.includes('misinformation') || value.includes('fake')) return 'misinformation'
  if (value.includes('inappropriate') || value.includes('explicit') || value.includes('nsfw')) {
    return 'inappropriate_content'
  }

  return 'other'
}
