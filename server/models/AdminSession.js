import mongoose from 'mongoose'

const adminSessionSchema = new mongoose.Schema({
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

adminSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
adminSessionSchema.index({ userId: 1, expiresAt: 1 })

export default mongoose.models.AdminSession || mongoose.model('AdminSession', adminSessionSchema, 'adminSessions')
