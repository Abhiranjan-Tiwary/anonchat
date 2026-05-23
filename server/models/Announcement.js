import mongoose from 'mongoose'

const announcementSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    sparse: true,
    index: true,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: 80
  },
  body: {
    type: String,
    required: [true, 'Body is required'],
    trim: true,
    maxlength: 500
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'critical'],
    default: 'normal'
  },
  target: {
    type: String,
    enum: ['all', 'room'],
    default: 'all'
  },
  targetRoomId: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'scheduled', 'archived'],
    default: 'published'
  },
  scheduledAt: {
    type: Date,
    default: null
  },
  publishedAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdByName: {
    type: String,
    default: 'Admin'
  },

  // Compatibility metadata for the current admin console.
  createdByPublicId: {
    type: String,
    default: ''
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  updatedByPublicId: {
    type: String,
    default: ''
  },
  updatedByName: {
    type: String,
    default: ''
  }
}, { timestamps: true, id: false })

// Indexes
announcementSchema.index({ status: 1 })
announcementSchema.index({ createdAt: -1 })
announcementSchema.index({ priority: 1 })
announcementSchema.index({ target: 1, status: 1, createdAt: -1 })

export default mongoose.models.Announcement || mongoose.model('Announcement', announcementSchema, 'announcements')
