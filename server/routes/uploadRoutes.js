import express from 'express'
import { protect } from '../middleware/auth.js'
import {
  uploadAvatar,
  uploadChatFile,
  handleUploadError
} from '../middleware/upload.js'
import {
  uploadAvatarHandler,
  uploadChatFileHandler,
  uploadBase64Avatar,
  deleteAvatar
} from '../controllers/uploadController.js'

const router = express.Router()

router.post(
  '/avatar',
  protect,
  uploadAvatar,
  handleUploadError,
  uploadAvatarHandler
)

router.post(
  '/avatar/base64',
  protect,
  uploadBase64Avatar
)

router.delete(
  '/avatar',
  protect,
  deleteAvatar
)

router.post(
  '/chat',
  protect,
  uploadChatFile,
  handleUploadError,
  uploadChatFileHandler
)

export default router
