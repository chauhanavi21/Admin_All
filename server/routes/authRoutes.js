import { Router } from 'express'
import * as authController from '../controllers/authController.js'
import { authenticate, attachCurrentUser } from '../middleware/authMiddleware.js'

const router = Router()

router.post('/login', authController.login)
router.post('/register', authController.registerAdmin)

router.get('/me', authenticate, authController.me)
router.post('/logout', authenticate, authController.logout)

export default router
