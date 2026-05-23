import express from 'express'
import { protect } from '../middleware/auth.js'
import {
  getProfile,
  updateProfile,
  deleteAccount
} from '../controllers/userController.js'

const router = express.Router()

router.get('/profile', protect, getProfile)
router.get('/me', protect, getProfile)
router.patch('/profile', protect, updateProfile)
router.delete('/profile', protect, deleteAccount)

export default router
