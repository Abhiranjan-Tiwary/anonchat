import multer from 'multer'
import dotenv from 'dotenv'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'

dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'anonchat/avatars',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 200, height: 200, crop: 'fill', gravity: 'face' },
      { quality: 'auto', fetch_format: 'auto' }
    ]
  }
})

const chatImageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'anonchat/chat',
    resource_type: 'auto',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'webm', 'mp3', 'wav', 'ogg', 'pdf', 'doc', 'docx', 'txt'],
    transformation: [
      { width: 1200, crop: 'limit' },
      { quality: 'auto', fetch_format: 'auto' }
    ]
  }
})

const limits = { fileSize: 5 * 1024 * 1024 }

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(new Error('Only image files allowed.'), false)
  }
}

const anyFileFilter = (req, file, cb) => {
  const allowed = [
    'image/',
    'video/',
    'audio/',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ]
  const isAllowed = allowed.some((type) => file.mimetype.startsWith(type))

  if (isAllowed) {
    cb(null, true)
  } else {
    cb(new Error('File type not allowed.'), false)
  }
}

export const uploadAvatar = multer({
  storage: avatarStorage,
  limits,
  fileFilter: imageFilter
}).single('avatar')

export const uploadChatFile = multer({
  storage: chatImageStorage,
  limits,
  fileFilter: anyFileFilter
}).single('file')

export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File too large. Maximum size is 5MB.'
      })
    }
    return res.status(400).json({ error: err.message })
  }

  if (err) {
    return res.status(400).json({ error: err.message })
  }

  return next()
}
