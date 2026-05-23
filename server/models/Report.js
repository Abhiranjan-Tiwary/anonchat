import mongoose from 'mongoose'

const reportSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    sparse: true,
    index: true,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  messageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    required: true
  },
  reportedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  reporterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reporterName: {
    type: String,
    default: 'Anonymous'
  },
  reason: {
    type: String,
    required: [true, 'Report reason is required'],
    enum: [
      'harassment',
      'spam',
      'inappropriate_content',
      'hate_speech',
      'threats',
      'misinformation',
      'other'
    ]
  },
  status: {
    type: String,
    enum: ['open', 'hidden', 'dismissed', 'deleted'],
    default: 'open'
  },
  roomId: {
    type: String,
    default: ''
  },
  message: {
    type: Object,
    default: null
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  resolvedAt: {
    type: Date,
    default: null
  },
  adminNote: {
    type: String,
    default: ''
  },

  // Public id mirrors for the current API/client routes.
  messagePublicId: {
    type: String,
    default: '',
    index: true
  },
  reportedUserPublicId: {
    type: String,
    default: ''
  },
  reporterPublicId: {
    type: String,
    default: '',
    index: true
  },
  reasonText: {
    type: String,
    default: ''
  }
}, { timestamps: true, id: false })

// Indexes
reportSchema.index({ status: 1 })
reportSchema.index({ messageId: 1 })
reportSchema.index({ reporterId: 1 })
reportSchema.index({ createdAt: -1 })
reportSchema.index({ status: 1, createdAt: -1 })

export default mongoose.models.Report || mongoose.model('Report', reportSchema, 'reports')
