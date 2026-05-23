import express from 'express'
import { protect } from '../middleware/auth.js'
import {
  getRooms,
  getRoomById,
  getRoomMessages,
  createRoom,
  updateRoom,
  deleteRoom
} from '../controllers/roomController.js'

const router = express.Router()

router.get('/', getRooms)
router.get('/:id/messages', getRoomMessages)
router.get('/:id', getRoomById)
router.post('/', protect, createRoom)
router.patch('/:id', protect, updateRoom)
router.delete('/:id', protect, deleteRoom)

export default router
