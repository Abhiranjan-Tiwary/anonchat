import mongoose from 'mongoose'

const dmAttachmentSchema = new mongoose.Schema({
  kind: {
    type: String,
    enum: ['image', 'video', 'audio', 'file'],
    default: 'file'
  },
  name: String,
  mimeType: String,
  size: Number,
  url: String,
  dataUrl: String,
  publicId: String,
  storage: {
    type: String,
    default: ''
  },
  voiceNote: {
    type: Boolean,
    default: false
  },
  duration: {
    type: Number,
    default: 0
  }
}, { _id: false })

const dmDeliverySchema = new mongoose.Schema({
  sentAt: { type: Date, default: Date.now },
  deliveredTo: [{ type: String, ref: 'User' }],
  seenBy: [{ type: String, ref: 'User' }]
}, { _id: false })

const dmReplyToSchema = new mongoose.Schema({
  id: { type: String, default: '' },
  author: String,
  text: String
}, { _id: false })

const dmMessageSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    sparse: true,
    index: true,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  clientTempId: {
    type: String,
    default: ''
  },
  threadId: {
    type: String,
    required: true,
    index: true
  },
  senderId: {
    type: String,
    required: true,
    index: true
  },
  recipientId: {
    type: String,
    required: true,
    index: true
  },
  participantIds: {
    type: [String],
    required: true
  },
  text: {
    type: String,
    default: '',
    maxlength: 2000
  },
  type: {
    type: String,
    enum: ['text', 'media', 'system'],
    default: 'text'
  },
  attachment: {
    type: dmAttachmentSchema,
    default: null
  },
  replyTo: {
    type: dmReplyToSchema,
    default: null
  },
  reactions: {
    type: Number,
    default: 0
  },
  reactionSummary: {
    type: Map,
    of: Number,
    default: () => ({})
  },
  reactionsByUser: {
    type: Map,
    of: String,
    default: () => ({})
  },
  delivery: {
    type: dmDeliverySchema,
    default: () => ({})
  },
  hiddenForUserIds: [{
    type: String,
    trim: true
  }],
  editedAt: {
    type: Date,
    default: null
  },
  deletedAt: {
    type: Date,
    default: null
  },
  deletedBy: {
    type: String,
    default: '',
    trim: true
  },
  reported: {
    type: Boolean,
    default: false
  }
}, { timestamps: true, id: false })

dmMessageSchema.index({ threadId: 1, createdAt: -1 })
dmMessageSchema.index({ senderId: 1, createdAt: -1 })
dmMessageSchema.index({ recipientId: 1, createdAt: -1 })
dmMessageSchema.index({ participantIds: 1, createdAt: -1 })
dmMessageSchema.index({ clientTempId: 1 }, { sparse: true, name: 'dmClientTempId_sparse_idx' })
dmMessageSchema.index({ reported: 1, createdAt: -1 })

export default mongoose.models.DmMessage || mongoose.model('DmMessage', dmMessageSchema, 'dmMessages')
