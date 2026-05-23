import dotenv from 'dotenv'
import { v2 as cloudinary } from 'cloudinary'
import User from '../models/User.js'

dotenv.config()

export const uploadAvatarHandler = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded.'
      })
    }

    const imageUrl = req.file.path

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatarDataUrl: imageUrl },
      { returnDocument: 'after' }
    )

    return res.json({
      url: imageUrl,
      user: user.toSafeObject(),
      message: 'Avatar updated successfully.'
    })
  } catch (error) {
    return next(error)
  }
}

export const uploadChatFileHandler = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded.'
      })
    }

    const isImage = req.file.mimetype.startsWith('image/')
    const isVideo = req.file.mimetype.startsWith('video/')
    const isAudio = req.file.mimetype.startsWith('audio/')

    const kind = isImage
      ? 'image'
      : isVideo
        ? 'video'
        : isAudio
          ? 'audio'
          : 'file'

    return res.json({
      attachment: {
        kind,
        name: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        url: req.file.path,
        dataUrl: req.file.path
      }
    })
  } catch (error) {
    return next(error)
  }
}

export const uploadBase64Avatar = async (req, res, next) => {
  try {
    const { dataUrl } = req.body

    if (!dataUrl) {
      return res.status(400).json({
        error: 'No image data provided.'
      })
    }

    const base64Payload = String(dataUrl).split(',').pop() || ''
    const sizeInBytes = Buffer.byteLength(base64Payload, 'base64')

    if (sizeInBytes > 5 * 1024 * 1024) {
      return res.status(400).json({
        error: 'Image too large. Maximum 5MB.'
      })
    }

    const result = await cloudinary.uploader.upload(dataUrl, {
      folder: 'anonchat/avatars',
      transformation: [
        {
          width: 200,
          height: 200,
          crop: 'fill',
          gravity: 'face'
        },
        { quality: 'auto', fetch_format: 'auto' }
      ]
    })

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatarDataUrl: result.secure_url },
      { returnDocument: 'after' }
    )

    return res.json({
      url: result.secure_url,
      user: user.toSafeObject(),
      message: 'Avatar uploaded successfully.'
    })
  } catch (error) {
    return next(error)
  }
}

export const deleteAvatar = async (req, res, next) => {
  try {
    const { publicId } = req.body

    if (publicId) {
      await cloudinary.uploader.destroy(publicId)
    }

    await User.findByIdAndUpdate(req.user._id, {
      avatarDataUrl: ''
    })

    return res.json({ message: 'Avatar removed.' })
  } catch (error) {
    return next(error)
  }
}
