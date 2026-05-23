import mongoose from 'mongoose'

const attachmentSchema = new mongoose.Schema({
  kind: {
    type: String,
    enum: ['image', 'video', 'audio', 'file'],
    required: true
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

const deliverySchema = new mongoose.Schema({
  sentAt: { type: Date, default: Date.now },
  deliveredTo: [{ type: String, ref: 'User' }],
  seenBy: [{ type: String, ref: 'User' }]
}, { _id: false })

const replyToSchema = new mongoose.Schema({
  messageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', default: null },
  id: { type: String, default: '' },
  author: String,
  text: String
}, { _id: false })

const pollOptionSchema = new mongoose.Schema({
  id: String,
  text: String,
  votes: { type: Number, default: 0 },
  votedBy: [{ type: String, ref: 'User' }]
}, { _id: false })

const pollSchema = new mongoose.Schema({
  question: String,
  options: [pollOptionSchema]
}, { _id: false })

const messageSchema = new mongoose.Schema({
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
  roomId: {
    type: String,
    required: true,
    index: true
  },
  roomObjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    default: null
  },
  authorId: {
    type: String,
    ref: 'User',
    required: true
  },
  authorObjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  author: {
    type: String,
    required: true
  },
  username: {
    type: String,
    default: ''
  },
  about: {
    type: String,
    default: ''
  },
  department: {
    type: String,
    default: ''
  },
  campus: {
    type: String,
    default: ''
  },
  joinedAt: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  avatarColor: {
    type: String,
    default: '#6c63ff'
  },
  avatarDataUrl: {
    type: String,
    default: ''
  },
  text: {
    type: String,
    default: '',
    maxlength: 2000
  },
  type: {
    type: String,
    enum: ['text', 'media', 'poll', 'system', 'confession'],
    default: 'text'
  },
  attachment: {
    type: attachmentSchema,
    default: null
  },
  replyTo: {
    type: replyToSchema,
    default: null
  },
  poll: {
    type: pollSchema,
    default: null
  },
  reactions: {
    type: Number,
    default: 0
  },
  reactedBy: [{
    type: String,
    ref: 'User'
  }],
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
    type: deliverySchema,
    default: () => ({})
  },
  hidden: {
    type: Boolean,
    default: false
  },
  deletedFor: [{
    type: String,
    ref: 'User'
  }],
  editedAt: {
    type: Date,
    default: null
  },
  deletedAt: {
    type: Number,
    default: null
  },
  deletedBy: {
    type: String,
    default: ''
  },
  reported: {
    type: Boolean,
    default: false
  },
  moderationReasons: {
    type: [String],
    default: []
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000)
  }
}, { timestamps: true, id: false })

// Indexes for performance
messageSchema.index({ roomId: 1, createdAt: 1 })
messageSchema.index({ authorId: 1 })
messageSchema.index({ authorId: 1, createdAt: -1 })
messageSchema.index({ clientTempId: 1 }, { sparse: true, name: 'clientTempId_sparse_idx' })
messageSchema.index({ hidden: 1 })
messageSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
messageSchema.index({ roomId: 1, hidden: 1, createdAt: 1 })
messageSchema.index({ reported: 1, hidden: 1, createdAt: -1 })
messageSchema.index({ type: 1 })

export default mongoose.models.Message || mongoose.model('Message', messageSchema, 'messages')
