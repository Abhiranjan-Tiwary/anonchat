import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: 60
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[a-z0-9_]{3,24}$/,
            'Username must be 3-24 chars: letters, numbers, underscore']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            'Enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 8,
    select: false
  },
  dateOfBirth: {
    type: Date,
    required: [
      function() {
        return this.isNew && (this.role === 'user' || this.role === 'student')
      },
      'Date of birth is required'
    ],
    validate: {
      validator(value) {
        if (!value) return this.role !== 'user' && this.role !== 'student'
        const date = value instanceof Date ? value : new Date(value)
        if (Number.isNaN(date.getTime())) return false
        const today = new Date()
        const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
        return date.getTime() <= todayUtc
      },
      message: 'Date of birth cannot be in the future'
    }
  },
  contactNumber: {
    type: String,
    trim: true,
    default: ''
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', ''],
    default: ''
  },
  department: {
    type: String,
    trim: true,
    default: ''
  },
  studyYear: {
    type: String,
    enum: ['1','2','3','4','5','alumni',''],
    default: ''
  },
  campus: {
    type: String,
    trim: true,
    default: ''
  },
  campusVerified: {
    type: Boolean,
    default: false
  },
  about: {
    type: String,
    maxlength: 180,
    default: ''
  },
  customStatus: {
    type: String,
    maxlength: 80,
    default: ''
  },
  themePreference: {
    type: String,
    enum: ['dark', 'light', 'system'],
    default: 'dark'
  },
  avatarDataUrl: {
    type: String,
    default: ''
  },
  avatarPublicId: {
    type: String,
    default: ''
  },
  avatarColor: {
    type: String,
    default: '#6c63ff'
  },
  blockedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  blockedUserRecords: [{
    userId: {
      type: String,
      default: ''
    },
    blockedAt: {
      type: Date,
      default: Date.now
    }
  }],
  privacySettings: {
    lastSeen: {
      type: String,
      enum: ['everyone', 'nobody'],
      default: 'everyone'
    },
    profilePhoto: {
      type: String,
      enum: ['everyone', 'nobody'],
      default: 'everyone'
    },
    anonymousMode: {
      type: Boolean,
      default: true
    },
    readReceipts: {
      type: Boolean,
      default: true
    },
    allowCalls: {
      type: String,
      enum: ['everyone', 'my-rooms', 'nobody'],
      default: 'everyone'
    },
    onlineVisibility: {
      type: String,
      enum: ['everyone', 'nobody'],
      default: 'everyone'
    }
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'student', 'guest'],
    default: 'user'
  },
  status: {
    type: String,
    enum: ['active', 'suspended', 'deleted'],
    default: 'active'
  },
  suspensionReason: {
    type: String,
    default: ''
  },
  suspendedAt: {
    type: Date,
    default: null
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  passwordResetOtp: {
    type: String,
    default: null,
    select: false
  },
  passwordResetToken: {
    type: String,
    default: null,
    select: false
  },
  passwordResetExpiry: {
    type: Date,
    default: null,
    select: false
  },
  id: {
    type: String,
    index: true
  },
  anonymousName: {
    type: String,
    trim: true,
    default: ''
  },
  emailDomain: {
    type: String,
    trim: true,
    default: ''
  },
  provider: {
    type: String,
    trim: true,
    default: 'password'
  },
  providerId: {
    type: String,
    trim: true,
    default: '',
    index: true
  },
  passwordSalt: {
    type: String,
    default: '',
    select: false
  },
  passwordHash: {
    type: String,
    default: '',
    select: false
  }
}, { timestamps: true, id: false })

// Hash password before save
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 12)
})

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

// Remove sensitive fields from JSON output
userSchema.methods.toSafeObject = function() {
  const obj = this.toObject()
  delete obj.password
  delete obj.passwordResetOtp
  delete obj.passwordResetToken
  delete obj.passwordResetExpiry
  delete obj.passwordSalt
  delete obj.passwordHash
  return obj
}

// Indexes
userSchema.index({ status: 1 })
userSchema.index({ createdAt: -1 })
userSchema.index({ lastSeen: -1 })

export default mongoose.models.User || mongoose.model('User', userSchema, 'users')
