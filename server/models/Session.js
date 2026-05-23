import mongoose from 'mongoose'

const sessionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: String,
    required: true,
    index: true
  },
  tokenHash: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true
  }
}, { timestamps: true, id: false })

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
sessionSchema.index({ userId: 1, expiresAt: 1 })

export default mongoose.models.Session || mongoose.model('Session', sessionSchema, 'sessions')
