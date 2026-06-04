import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { nanoid } from 'nanoid'
import User from '../models/User.js'

const avatarColors = [
  '#6c63ff',
  '#a78bfa',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#3b82f6',
  '#ec4899',
  '#14b8a6'
]

const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    const error = new Error('JWT_SECRET is not configured.')
    error.status = 500
    throw error
  }

  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

const normalizeEmail = (email) => String(email || '').toLowerCase().trim()

const normalizeUsername = (username) => String(username || '').toLowerCase().trim()

const normalizeDateOfBirth = (value) => {
  const text = String(value || '').trim()
  if (!text) {
    const error = new Error('Date of birth is required.')
    error.status = 400
    throw error
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    const error = new Error('Enter a valid date of birth.')
    error.status = 400
    throw error
  }

  const date = new Date(`${text}T00:00:00.000Z`)
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== text) {
    const error = new Error('Enter a valid date of birth.')
    error.status = 400
    throw error
  }

  const today = new Date()
  const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
  if (date.getTime() > todayUtc) {
    const error = new Error('Date of birth cannot be in the future.')
    error.status = 400
    throw error
  }

  return date
}

const formatDateOfBirth = (value) => {
  if (!value) return ''
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10)
}

const validatePassword = (password) => {
  const allowedPattern = /^[A-Za-z0-9!@#$%^&*_\-+=.?]{8,64}$/
  if (
    !allowedPattern.test(password) ||
    !/[A-Z]/.test(password) ||
    !/[a-z]/.test(password) ||
    !/[0-9]/.test(password) ||
    !/[!@#$%^&*_\-+=.?]/.test(password)
  ) {
    const error = new Error('Use 8-64 characters with uppercase, lowercase, number, and symbol.')
    error.status = 400
    throw error
  }
}

const safeUser = (user) => ({
  id: String(user._id),
  fullName: user.fullName,
  name: user.fullName,
  username: user.username,
  email: user.email,
  dateOfBirth: formatDateOfBirth(user.dateOfBirth),
  contactNumber: user.contactNumber,
  gender: user.gender,
  department: user.department,
  studyYear: user.studyYear,
  campus: user.campus,
  about: user.about,
  avatarDataUrl: user.avatarDataUrl,
  avatarColor: user.avatarColor,
  role: user.role,
  status: user.status,
  createdAt: user.createdAt
})

const comparePassword = async (user, password) => {
  if (typeof user.comparePassword === 'function') {
    return user.comparePassword(password)
  }

  return bcrypt.compare(password, user.password)
}

export const register = async (req, res, next) => {
  try {
    const {
      fullName,
      username,
      email,
      password,
      dateOfBirth
    } = req.body

    const normalizedEmail = normalizeEmail(email)
    const normalizedUsername = normalizeUsername(username)

    if (!fullName || !normalizedUsername || !normalizedEmail || !password || !dateOfBirth) {
      return res.status(400).json({
        error: 'Full name, username, email, password and date of birth are required.'
      })
    }

    const normalizedDateOfBirth = normalizeDateOfBirth(dateOfBirth)

    if (!/^[a-z0-9_]{3,24}$/.test(normalizedUsername)) {
      return res.status(400).json({ error: 'Username must be 3-24 characters using letters, numbers, or underscore.' })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({ error: 'Enter a valid email address.' })
    }

    validatePassword(String(password || ''))

    const existingUser = await User.findOne({
      $or: [
        { email: normalizedEmail },
        { username: normalizedUsername }
      ]
    })

    if (existingUser) {
      if (existingUser.email === normalizedEmail) {
        return res.status(400).json({ error: 'Email is already registered.' })
      }

      return res.status(400).json({ error: 'Username is already taken.' })
    }

    const avatarColor = avatarColors[Math.floor(Math.random() * avatarColors.length)]

    const user = await User.create({
      fullName: String(fullName).trim(),
      username: normalizedUsername,
      email: normalizedEmail,
      password,
      dateOfBirth: normalizedDateOfBirth,
      avatarColor,
      role: 'user',
      status: 'active'
    })

    const token = generateToken(user._id)

    return res.status(201).json({
      token,
      user: safeUser(user)
    })
  } catch (error) {
    return next(error)
  }
}

export const login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body
    const normalizedIdentifier = normalizeEmail(identifier)

    if (!normalizedIdentifier || !password) {
      return res.status(400).json({
        error: 'Username/email and password are required.'
      })
    }

    const user = await User.findOne({
      $or: [
        { email: normalizedIdentifier },
        { username: normalizedIdentifier }
      ]
    }).select('+password')

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password.' })
    }

    if (user.status === 'suspended') {
      return res.status(403).json({
        error: `Account suspended: ${user.suspensionReason || 'Contact admin.'}`
      })
    }

    if (user.status === 'deleted') {
      return res.status(403).json({ error: 'Account is no longer active.' })
    }

    const isMatch = await comparePassword(user, password)
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username or password.' })
    }

    user.lastSeen = new Date()
    await user.save({ validateBeforeSave: false })

    const token = generateToken(user._id)

    return res.json({
      token,
      user: safeUser(user)
    })
  } catch (error) {
    return next(error)
  }
}

export const adminLogin = async (req, res, next) => {
  try {
    const { identifier, password } = req.body
    const normalizedIdentifier = normalizeUsername(identifier)

    if (!normalizedIdentifier || !password) {
      return res.status(400).json({
        error: 'Admin username and password are required.'
      })
    }

    const envUsername = normalizeUsername(process.env.ADMIN_USERNAME || 'admin')
    const envPassword = process.env.ADMIN_PASSWORD || 'Admin@123456'
    const allowDefaultAdmin = process.env.NODE_ENV !== 'production'
    const isConfiguredAdmin = normalizedIdentifier === envUsername && password === envPassword
    const isDefaultDevAdmin = allowDefaultAdmin && normalizedIdentifier === 'admin' && password === 'Admin@123456'

    if (isConfiguredAdmin || isDefaultDevAdmin) {
      let adminUser = await User.findOne({
        $or: [
          { username: envUsername },
          { username: 'admin' },
          { email: process.env.ADMIN_EMAIL || 'admin@anonchat.io' },
          { role: 'admin' }
        ]
      })

      if (!adminUser) {
        adminUser = await User.create({
          fullName: process.env.ADMIN_NAME || 'Site Admin',
          username: envUsername || 'admin',
          email: process.env.ADMIN_EMAIL || 'admin@anonchat.io',
          password,
          role: 'admin',
          status: 'active',
          avatarColor: '#6c63ff'
        })
      } else if (adminUser.role !== 'admin' || adminUser.status !== 'active') {
        adminUser.role = 'admin'
        adminUser.status = 'active'
        adminUser.lastSeen = new Date()
        await adminUser.save({ validateBeforeSave: false })
      }

      const token = generateToken(adminUser._id)

      return res.json({
        token,
        user: safeUser(adminUser)
      })
    }

    const adminUser = await User.findOne({
      role: 'admin',
      $or: [
        { username: normalizedIdentifier },
        { email: normalizedIdentifier }
      ]
    }).select('+password')

    if (!adminUser) {
      return res.status(401).json({ error: 'Invalid admin credentials.' })
    }

    const isMatch = await comparePassword(adminUser, password)
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid admin credentials.' })
    }

    adminUser.lastSeen = new Date()
    await adminUser.save({ validateBeforeSave: false })

    const token = generateToken(adminUser._id)

    return res.json({
      token,
      user: safeUser(adminUser)
    })
  } catch (error) {
    return next(error)
  }
}

export const logout = async (req, res, next) => {
  try {
    if (req.body.token) {
      try {
        const decoded = jwt.verify(req.body.token, process.env.JWT_SECRET)
        await User.findByIdAndUpdate(decoded.id, { lastSeen: new Date() })
      } catch {
        // Logout should stay idempotent even when the token is already invalid.
      }
    }

    return res.json({ message: 'Logged out successfully.' })
  } catch (error) {
    return next(error)
  }
}

export const requestPasswordReset = async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email)

    if (!email) {
      return res.status(400).json({ error: 'Email is required.' })
    }

    const user = await User.findOne({ email })

    if (!user) {
      return res.json({ message: 'If this email exists, OTP has been sent.' })
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const resetToken = nanoid(32)

    user.passwordResetOtp = otp
    user.passwordResetToken = resetToken
    user.passwordResetExpiry = new Date(Date.now() + 15 * 60 * 1000)
    await user.save({ validateBeforeSave: false })

    if (process.env.NODE_ENV !== 'production') {
      return res.json({
        message: 'OTP generated (dev mode)',
        devOtp: otp,
        devResetToken: resetToken
      })
    }

    return res.json({ message: 'OTP sent to your email address.' })
  } catch (error) {
    return next(error)
  }
}

export const confirmPasswordReset = async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email)
    const { otp, resetToken, password } = req.body

    if (!email || !otp || !resetToken || !password) {
      return res.status(400).json({
        error: 'Email, OTP, reset token and new password are required.'
      })
    }

    const user = await User.findOne({ email }).select(
      '+passwordResetOtp +passwordResetToken +passwordResetExpiry'
    )

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired OTP.' })
    }

    if (!user.passwordResetExpiry || user.passwordResetExpiry < new Date()) {
      return res.status(400).json({ error: 'OTP has expired. Request a new one.' })
    }

    if (user.passwordResetOtp !== String(otp) || user.passwordResetToken !== resetToken) {
      return res.status(400).json({ error: 'Invalid OTP. Please check and try again.' })
    }

    user.password = password
    user.passwordResetOtp = null
    user.passwordResetToken = null
    user.passwordResetExpiry = null
    await user.save()

    return res.json({
      message: 'Password updated successfully. Please log in.'
    })
  } catch (error) {
    return next(error)
  }
}
