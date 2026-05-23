import express from 'express'
import { authLimiter } from '../middleware/rateLimiter.js'
import {
  register,
  login,
  adminLogin,
  logout,
  requestPasswordReset,
  confirmPasswordReset
} from '../controllers/authController.js'

const router = express.Router()

router.post('/register', authLimiter, register)
router.post('/login', authLimiter, login)
router.post('/admin-login', authLimiter, adminLogin)
router.post('/logout', logout)
router.post('/password-reset/request', requestPasswordReset)
router.post('/password-reset/confirm', confirmPasswordReset)

export default router
