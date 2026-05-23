import mongoose from 'mongoose'

const callSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    sparse: true,
    index: true
  },
  type: {
    type: String,
    enum: ['audio', 'video'],
    default: 'audio'
  },
  callerId: {
    type: String,
    index: true,
    default: ''
  },
  callerName: {
    type: String,
    default: ''
  },
  targetId: {
    type: String,
    index: true,
    default: ''
  },
  targetName: {
    type: String,
    default: ''
  },
  roomId: {
    type: String,
    index: true,
    default: ''
  },
  status: {
    type: String,
    enum: ['ringing', 'active', 'ended', 'missed', 'rejected', 'busy'],
    default: 'ringing',
    index: true
  },
  startedAt: {
    type: Number,
    default: Date.now,
    index: true
  },
  answeredAt: {
    type: Number,
    default: null
  },
  endedAt: {
    type: Number,
    default: null
  },
  durationSeconds: {
    type: Number,
    default: 0
  }
}, { timestamps: true, id: false })

callSchema.index({ callerId: 1, targetId: 1, startedAt: -1 })
callSchema.index({ createdAt: -1 })

export default mongoose.models.Call || mongoose.model('Call', callSchema, 'calls')
