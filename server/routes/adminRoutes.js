import express from 'express'
import { protect } from '../middleware/auth.js'
import { adminOnly } from '../middleware/adminOnly.js'
import {
  getAdminState,
  getAdminUsers,
  updateUserStatus,
  deleteUser,
  getAdminReports,
  resolveReport,
  getAdminRooms,
  deleteAdminRoom,
  getAdminMessages,
  deleteAdminMessage,
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getSettings,
  updateSettings,
  getAdminStats,
  getAuditLogs
} from '../controllers/adminController.js'

const router = express.Router()

router.use(protect, adminOnly)

router.get('/stats', getAdminStats)
router.post('/state', getAdminState)

router.get('/users', getAdminUsers)
router.patch('/users/:id/status', updateUserStatus)
router.delete('/users/:id', deleteUser)

router.get('/reports', getAdminReports)
router.patch('/reports/:id', resolveReport)

router.get('/rooms', getAdminRooms)
router.delete('/rooms/:id', deleteAdminRoom)

router.get('/messages', getAdminMessages)
router.delete('/messages/:id', deleteAdminMessage)

router.get('/announcements', getAnnouncements)
router.post('/announcements', createAnnouncement)
router.patch('/announcements/:id', updateAnnouncement)
router.delete('/announcements/:id', deleteAnnouncement)

router.get('/settings', getSettings)
router.patch('/settings', updateSettings)

router.get('/audit-logs', getAuditLogs)

export default router
