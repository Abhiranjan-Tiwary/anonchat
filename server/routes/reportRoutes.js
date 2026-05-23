import express from 'express'
import { protect } from '../middleware/auth.js'
import {
  getReports,
  createReport
} from '../controllers/reportController.js'

const router = express.Router()

router.get('/', protect, getReports)
router.post('/', protect, createReport)

export default router
