import mongoose from 'mongoose'

const deletedUserSchema = new mongoose.Schema({
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
  username: {
    type: String,
    lowercase: true,
    trim: true,
    index: true,
    default: ''
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    index: true,
    default: ''
  },
  contactNumber: {
    type: String,
    trim: true,
    index: true,
    default: ''
  },
  fullName: {
    type: String,
    trim: true,
    default: ''
  },
  deletedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  deletedBy: {
    type: String,
    default: ''
  }
}, { timestamps: true, id: false })

deletedUserSchema.index({ username: 1, email: 1, contactNumber: 1 })
deletedUserSchema.index({ deletedAt: -1 })

export default mongoose.models.DeletedUser || mongoose.model('DeletedUser', deletedUserSchema, 'deletedUsers')
