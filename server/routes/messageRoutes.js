import express from 'express'
import { protect } from '../middleware/auth.js'
import { messageLimiter } from '../middleware/rateLimiter.js'
import {
  getMessages,
  sendMessage,
  editMessage,
  deleteMessage,
  reactToMessage
} from '../controllers/messageController.js'

const router = express.Router()

router.get('/', getMessages)
router.post('/', protect, messageLimiter, sendMessage)
router.patch('/:id', protect, editMessage)
router.delete('/:id', protect, deleteMessage)
router.post('/:id/react', protect, reactToMessage)

export default router
