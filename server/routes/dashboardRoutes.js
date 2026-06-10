import { Router } from 'express'
import * as dashboardController from '../controllers/dashboardController.js'
import { authenticate, attachCurrentUser } from '../middleware/authMiddleware.js'

const router = Router()

router.use(authenticate, attachCurrentUser)
router.get('/overview', dashboardController.getOverview)
router.get('/stats', dashboardController.getStats)

export default router
