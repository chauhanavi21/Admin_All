import { Router } from 'express'
import * as settingsController from '../controllers/settingsController.js'
import { authenticate, attachCurrentUser, authorize } from '../middleware/authMiddleware.js'

const router = Router()

router.use(authenticate, attachCurrentUser)

router.get('/', settingsController.getSettings)
router.put('/', authorize('admin'), settingsController.updateSettings)
router.get('/activity', settingsController.getActivityLog)
router.get('/profile', settingsController.getProfile)
router.put('/profile', settingsController.updateProfile)

export default router
