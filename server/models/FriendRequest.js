import mongoose from 'mongoose'

const friendRequestSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    sparse: true,
    index: true,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  fromUserId: {
    type: String,
    required: true,
    index: true,
    trim: true
  },
  toUserId: {
    type: String,
    required: true,
    index: true,
    trim: true
  },
  fromUserObjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  toUserObjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  pairKey: {
    type: String,
    required: true,
    index: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined', 'cancelled'],
    default: 'pending',
    index: true
  },
  respondedAt: {
    type: Date,
    default: null
  },
  respondedByUserId: {
    type: String,
    default: '',
    trim: true
  }
}, { timestamps: true, id: false })

friendRequestSchema.index({ pairKey: 1, status: 1, createdAt: -1 })
friendRequestSchema.index({ fromUserId: 1, toUserId: 1, status: 1 })
friendRequestSchema.index({ toUserId: 1, status: 1, createdAt: -1 })
friendRequestSchema.index({ fromUserId: 1, status: 1, createdAt: -1 })

export default mongoose.models.FriendRequest || mongoose.model('FriendRequest', friendRequestSchema, 'friendRequests')
