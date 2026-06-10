import { Router } from 'express'
import authRoutes from './authRoutes.js'
import dashboardRoutes from './dashboardRoutes.js'
import usersRoutes from './usersRoutes.js'
import appsRoutes from './appsRoutes.js'
import settingsRoutes from './settingsRoutes.js'

const router = Router()

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'Admin API running', data: { version: '1.0.0' } })
})

router.use('/auth', authRoutes)
router.use('/dashboard', dashboardRoutes)
router.use('/users', usersRoutes)
router.use('/apps', appsRoutes)
router.use('/settings', settingsRoutes)

export default router
