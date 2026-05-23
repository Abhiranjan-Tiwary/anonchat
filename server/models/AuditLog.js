import mongoose from 'mongoose'

const auditLogSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    sparse: true,
    index: true
  },
  action: {
    type: String,
    required: true
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  adminName: {
    type: String,
    default: 'Admin'
  },
  targetType: {
    type: String,
    enum: ['user', 'message', 'room', 'report', 'announcement', 'settings'],
    required: true
  },
  targetId: {
    type: String,
    default: null
  },
  meta: {
    type: Object,
    default: {}
  },
  adminPublicId: {
    type: String,
    default: ''
  }
}, { timestamps: true, id: false })

auditLogSchema.index({ adminId: 1 })
auditLogSchema.index({ createdAt: -1 })
auditLogSchema.index({ action: 1 })
auditLogSchema.index({ targetType: 1, createdAt: -1 })

export default mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema)
