import mongoose from 'mongoose'

const pushSubscriptionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
    trim: true
  },
  endpoint: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  subscription: {
    endpoint: {
      type: String,
      required: true,
      trim: true
    },
    expirationTime: {
      type: Number,
      default: null
    },
    keys: {
      p256dh: {
        type: String,
        required: true,
        trim: true
      },
      auth: {
        type: String,
        required: true,
        trim: true
      }
    }
  },
  userAgent: {
    type: String,
    default: '',
    trim: true
  }
}, { timestamps: true, id: false })

pushSubscriptionSchema.index({ userId: 1, updatedAt: -1 })

export default mongoose.models.PushSubscription ||
  mongoose.model('PushSubscription', pushSubscriptionSchema, 'pushSubscriptions')
