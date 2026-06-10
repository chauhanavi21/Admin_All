import jwt from 'jsonwebtoken'
import { fail } from '../utils/apiResponse.js'
import { getStore } from '../services/storeService.js'

export function authenticate(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return fail(res, 'Authentication required', 401)
  }

  try {
    const token = header.slice(7)
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-admin-secret-change-me')
    req.user = payload
    next()
  } catch {
    return fail(res, 'Invalid or expired token', 401)
  }
}

export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return fail(res, 'Authentication required', 401)
    }
    if (roles.length && !roles.includes(req.user.role)) {
      return fail(res, 'Insufficient permissions', 403)
    }
    next()
  }
}

export async function attachCurrentUser(req, res, next) {
  try {
    const store = await getStore()
    const user = store.users.find((u) => u.id === req.user.sub)
    if (!user || !user.active) {
      return fail(res, 'User not found or inactive', 401)
    }
    req.currentUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }
    next()
  } catch {
    return fail(res, 'Failed to load user', 500)
  }
}
