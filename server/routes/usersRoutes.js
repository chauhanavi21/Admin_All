import { Router } from 'express'
import * as usersController from '../controllers/usersController.js'
import { authenticate, attachCurrentUser, authorize } from '../middleware/authMiddleware.js'

const router = Router()

router.use(authenticate, attachCurrentUser)

router.get('/', usersController.listUsers)
router.get('/:id', usersController.getUser)
router.post('/', authorize('admin', 'manager'), usersController.createUser)
router.put('/:id', authorize('admin', 'manager'), usersController.updateUser)
router.delete('/:id', authorize('admin'), usersController.deleteUser)

export default router
