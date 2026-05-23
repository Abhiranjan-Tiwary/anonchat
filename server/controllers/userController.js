import Message from '../models/Message.js'
import User from '../models/User.js'

const safeUser = (user) => {
  const obj = typeof user.toSafeObject === 'function' ? user.toSafeObject() : user

  return {
    ...obj,
    id: String(user._id || obj._id || obj.id),
    name: user.fullName || obj.fullName,
    _id: user._id || obj._id
  }
}

// GET profile
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({
        error: 'User not found.'
      })
    }

    return res.json({ user: safeUser(user) })
  } catch (error) {
    return next(error)
  }
}

// PATCH profile
export const updateProfile = async (req, res, next) => {
  try {
    const {
      fullName,
      anonymousName,
      contactNumber,
      gender,
      department,
      studyYear,
      about,
      avatarDataUrl,
      avatarColor,
      campus
    } = req.body.profile || req.body

    const updates = {}
    if (fullName) updates.fullName = fullName.trim()
    if (anonymousName) updates.fullName = anonymousName.trim()
    if (contactNumber) updates.contactNumber = contactNumber.trim()
    if (gender) updates.gender = gender
    if (department) updates.department = department.trim()
    if (studyYear) updates.studyYear = studyYear
    if (campus) updates.campus = campus.trim()
    if (about !== undefined) updates.about = String(about).trim()
    if (avatarDataUrl !== undefined) updates.avatarDataUrl = avatarDataUrl
    if (avatarColor !== undefined) updates.avatarColor = avatarColor

    if (updates.avatarDataUrl && !String(updates.avatarDataUrl).startsWith('data:image/')) {
      return res.status(400).json({ error: 'Profile photo must be an image.' })
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { ...updates, lastSeen: new Date() },
      { returnDocument: 'after', runValidators: true }
    )

    if (!user) {
      return res.status(404).json({ error: 'User not found.' })
    }

    if (updates.fullName || updates.avatarColor !== undefined || updates.avatarDataUrl !== undefined) {
      await Message.updateMany(
        { authorId: String(req.user._id) },
        {
          $set: {
            author: user.fullName,
            avatarColor: user.avatarColor || '#6c63ff',
            avatarDataUrl: user.avatarDataUrl || ''
          }
        }
      )
    }

    return res.json({ user: safeUser(user) })
  } catch (error) {
    return next(error)
  }
}

// DELETE account
export const deleteAccount = async (req, res, next) => {
  try {
    const timestamp = Date.now()

    await User.findByIdAndUpdate(req.user._id, {
      status: 'deleted',
      email: `deleted_${timestamp}@deleted.com`,
      username: `deleted_${timestamp}`
    })

    return res.json({ message: 'Account deleted.' })
  } catch (error) {
    return next(error)
  }
}
