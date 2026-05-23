import mongoose from 'mongoose'

function slugFromRoom(room) {
  const source = room.slug || room.id || room.name || ''
  return String(source)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Room name is required'],
    trim: true,
    maxlength: 50
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: 200,
    default: ''
  },
  icon: {
    type: String,
    default: '#'
  },
  color: {
    type: String,
    default: '#6c63ff'
  },
  category: {
    type: String,
    default: 'Public Room'
  },
  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'public'
  },
  password: {
    type: String,
    default: null,
    select: false
  },
  isPasswordProtected: {
    type: Boolean,
    default: false
  },
  maxCapacity: {
    type: Number,
    default: 250
  },
  activeMembers: {
    type: Number,
    default: 0
  },
  messageCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'archived', 'deleted'],
    default: 'active'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  pinnedMessage: {
    type: String,
    default: 'Be respectful and follow community guidelines.'
  },
  isSeeded: {
    type: Boolean,
    default: false
  },

  // Compatibility fields used by the current AnonChat API/client.
  id: {
    type: String,
    unique: true,
    trim: true,
    index: true
  },
  desc: {
    type: String,
    trim: true,
    maxlength: 200,
    default: ''
  },
  passwordHash: {
    type: String,
    default: '',
    select: false
  },
  passwordSalt: {
    type: String,
    default: '',
    select: false
  },
  passwordProtected: {
    type: Boolean,
    default: false
  },
  hidden: {
    type: Boolean,
    default: false
  },
  createdById: {
    type: String,
    default: ''
  }
}, { timestamps: true, id: false })

roomSchema.pre('validate', function() {
  if (!this.slug) this.slug = slugFromRoom(this)
  if (!this.id) this.id = this.slug
  if (!this.description && this.desc) this.description = this.desc
  if (!this.desc && this.description) this.desc = this.description
  this.isPasswordProtected = Boolean(this.isPasswordProtected || this.passwordProtected || this.password || this.passwordHash)
  this.passwordProtected = this.isPasswordProtected
})

// Indexes
roomSchema.index({ visibility: 1, status: 1 })
roomSchema.index({ createdAt: -1 })
roomSchema.index({ category: 1, status: 1 })
roomSchema.index({ hidden: 1 })

export default mongoose.models.Room || mongoose.model('Room', roomSchema, 'rooms')
