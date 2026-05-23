import mongoose from 'mongoose'

const settingsSchema = new mongoose.Schema({
  maintenanceMode: {
    type: Boolean,
    default: false
  },
  registrationOpen: {
    type: Boolean,
    default: true
  },
  maxRoomSize: {
    type: Number,
    min: 10,
    max: 1000,
    default: 250
  },
  maxMessageLength: {
    type: Number,
    min: 20,
    max: 2000,
    default: 2000
  },
  rateLimitPerMinute: {
    type: Number,
    min: 5,
    max: 120,
    default: 20
  },
  profanityFilter: {
    type: Boolean,
    default: true
  },
  guestModeAllowed: {
    type: Boolean,
    default: true
  },
  autoDeleteMessages: {
    type: Boolean,
    default: true
  },
  emailNotifications: {
    type: Boolean,
    default: false
  }
}, { _id: false })

const platformSettingsSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true,
    default: 'platform'
  },
  settings: {
    type: settingsSchema,
    default: () => ({})
  },
  updatedBy: {
    type: String,
    default: ''
  }
}, { timestamps: true, id: false })

platformSettingsSchema.index({ updatedAt: -1 })

export default mongoose.models.PlatformSettings || mongoose.model('PlatformSettings', platformSettingsSchema, 'platformSettings')
