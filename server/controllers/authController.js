import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { createId, getStore, logActivity, saveStore } from '../services/storeService.js'
import { fail, success } from '../utils/apiResponse.js'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-admin-secret-change-me'
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d'

function signToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES },
  )
}

function sanitizeUser(user) {
  const { passwordHash, ...safe } = user
  return safe
}

export async function login(req, res) {
  const { email, password } = req.body

  if (!email || !password) {
    return fail(res, 'Email and password are required')
  }

  const store = await getStore()
  const user = store.users.find((u) => u.email.toLowerCase() === email.toLowerCase())

  if (!user || !user.active) {
    return fail(res, 'Invalid credentials', 401)
  }

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) {
    return fail(res, 'Invalid credentials', 401)
  }

  const token = signToken(user)
  await logActivity({
    action: 'login',
    resource: 'auth',
    userId: user.id,
    details: user.email,
  })

  return success(res, { token, user: sanitizeUser(user) }, 'Login successful')
}

export async function me(req, res) {
  const store = await getStore()
  const user = store.users.find((u) => u.id === req.user.sub)
  if (!user) {
    return fail(res, 'User not found', 404)
  }
  return success(res, sanitizeUser(user))
}

export async function registerAdmin(req, res) {
  const { name, email, password, role = 'admin' } = req.body

  if (!name || !email || !password) {
    return fail(res, 'Name, email, and password are required')
  }

  if (password.length < 6) {
    return fail(res, 'Password must be at least 6 characters')
  }

  const store = await getStore()
  const exists = store.users.some((u) => u.email.toLowerCase() === email.toLowerCase())
  if (exists) {
    return fail(res, 'Email already registered')
  }

  const now = new Date().toISOString()
  const user = {
    id: createId(),
    name,
    email,
    passwordHash: await bcrypt.hash(password, 10),
    role: ['admin', 'manager', 'viewer'].includes(role) ? role : 'viewer',
    active: true,
    createdAt: now,
    updatedAt: now,
  }

  store.users.push(user)
  await saveStore(store)

  return success(res, sanitizeUser(user), 'Admin user created', 201)
}

export async function logout(req, res) {
  await logActivity({
    action: 'logout',
    resource: 'auth',
    userId: req.user.sub,
  })
  return success(res, null, 'Logged out')
}
