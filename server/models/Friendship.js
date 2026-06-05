import mongoose from 'mongoose'

const friendshipSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    sparse: true,
    index: true,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  userIds: {
    type: [String],
    required: true,
    validate: {
      validator(value) {
        return Array.isArray(value) && value.length === 2 && new Set(value.map(String)).size === 2
      },
      message: 'Friendship must contain exactly two unique users'
    }
  },
  pairKey: {
    type: String,
    required: true,
    unique: true,
    index: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'removed'],
    default: 'active',
    index: true
  },
  requestId: {
    type: String,
    default: '',
    trim: true
  },
  createdByUserId: {
    type: String,
    default: '',
    trim: true
  },
  removedAt: {
    type: Date,
    default: null
  },
  removedByUserId: {
    type: String,
    default: '',
    trim: true
  },
  lastInteractionAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true, id: false })

friendshipSchema.index({ userIds: 1, status: 1, updatedAt: -1 })
friendshipSchema.index({ status: 1, lastInteractionAt: -1 })

export default mongoose.models.Friendship || mongoose.model('Friendship', friendshipSchema, 'friendships')
