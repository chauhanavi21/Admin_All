import { Router } from 'express'
import * as appsController from '../controllers/appsController.js'
import { authenticate, attachCurrentUser, authorize } from '../middleware/authMiddleware.js'

const router = Router()

router.use(authenticate, attachCurrentUser)

router.get('/', appsController.listApps)
router.get('/:id', appsController.getApp)
router.post('/', authorize('admin', 'manager'), appsController.createApp)
router.put('/:id', authorize('admin', 'manager'), appsController.updateApp)
router.delete('/:id', authorize('admin'), appsController.deleteApp)
router.post('/:id/test', authorize('admin', 'manager'), appsController.testAppConnection)

export default router
