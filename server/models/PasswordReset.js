import mongoose from 'mongoose'

const passwordResetSchema = new mongoose.Schema({
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
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true
  },
  otpHash: {
    type: String,
    required: true,
    select: false
  },
  resetTokenHash: {
    type: String,
    required: true,
    select: false
  },
  otpVerified: {
    type: Boolean,
    default: false,
    index: true
  },
  verifiedAt: {
    type: Date,
    default: null
  },
  used: {
    type: Boolean,
    default: false,
    index: true
  },
  usedAt: {
    type: Date,
    default: null
  },
  expiresAt: {
    type: Date,
    required: true
  }
}, { timestamps: true, id: false })

passwordResetSchema.index({ email: 1, expiresAt: 1 })
passwordResetSchema.index({ resetTokenHash: 1 })
passwordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export default mongoose.models.PasswordReset || mongoose.model('PasswordReset', passwordResetSchema, 'passwordResets')
