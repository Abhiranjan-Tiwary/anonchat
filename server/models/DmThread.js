import mongoose from 'mongoose'

const dmThreadSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    sparse: true,
    index: true,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  participantIds: {
    type: [String],
    required: true,
    validate: {
      validator(value) {
        return Array.isArray(value) && value.length === 2 && new Set(value.map(String)).size === 2
      },
      message: 'DM thread must contain exactly two unique participants'
    }
  },
  pairKey: {
    type: String,
    required: true,
    unique: true,
    index: true,
    trim: true
  },
  friendshipId: {
    type: String,
    default: '',
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'archived', 'deleted'],
    default: 'active',
    index: true
  },
  lastMessageId: {
    type: String,
    default: '',
    trim: true
  },
  lastMessageText: {
    type: String,
    default: '',
    maxlength: 240
  },
  lastMessageAt: {
    type: Date,
    default: null,
    index: true
  },
  hiddenForUserIds: [{
    type: String,
    trim: true
  }],
  pinnedForUserIds: [{
    type: String,
    trim: true
  }],
  mutedForUserIds: [{
    type: String,
    trim: true
  }],
  archivedForUserIds: [{
    type: String,
    trim: true
  }],
  unreadByUserId: {
    type: Map,
    of: Number,
    default: () => ({})
  }
}, { timestamps: true, id: false })

dmThreadSchema.index({ participantIds: 1, status: 1, updatedAt: -1 })
dmThreadSchema.index({ status: 1, lastMessageAt: -1 })

export default mongoose.models.DmThread || mongoose.model('DmThread', dmThreadSchema, 'dmThreads')
