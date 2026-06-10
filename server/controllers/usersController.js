import bcrypt from 'bcryptjs'
import { createId, getStore, logActivity, saveStore } from '../services/storeService.js'
import { fail, success } from '../utils/apiResponse.js'

function sanitizeUser(user) {
  const { passwordHash, ...safe } = user
  return safe
}

export async function listUsers(_req, res) {
  const store = await getStore()
  return success(res, store.users.map(sanitizeUser))
}

export async function getUser(req, res) {
  const store = await getStore()
  const user = store.users.find((u) => u.id === req.params.id)
  if (!user) {
    return fail(res, 'User not found', 404)
  }
  return success(res, sanitizeUser(user))
}

export async function createUser(req, res) {
  const { name, email, password, role = 'viewer', active = true } = req.body

  if (!name || !email || !password) {
    return fail(res, 'Name, email, and password are required')
  }

  const store = await getStore()
  if (store.users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return fail(res, 'Email already exists')
  }

  const now = new Date().toISOString()
  const user = {
    id: createId(),
    name,
    email,
    passwordHash: await bcrypt.hash(password, 10),
    role: ['admin', 'manager', 'viewer'].includes(role) ? role : 'viewer',
    active: Boolean(active),
    createdAt: now,
    updatedAt: now,
  }

  store.users.push(user)
  await saveStore(store)
  await logActivity({
    action: 'create',
    resource: 'user',
    userId: req.currentUser.id,
    details: user.email,
  })

  return success(res, sanitizeUser(user), 'User created', 201)
}

export async function updateUser(req, res) {
  const store = await getStore()
  const index = store.users.findIndex((u) => u.id === req.params.id)
  if (index === -1) {
    return fail(res, 'User not found', 404)
  }

  const { name, email, role, active, password } = req.body
  const user = store.users[index]

  if (email && store.users.some((u, i) => i !== index && u.email.toLowerCase() === email.toLowerCase())) {
    return fail(res, 'Email already exists')
  }

  if (name) user.name = name
  if (email) user.email = email
  if (role && ['admin', 'manager', 'viewer'].includes(role)) user.role = role
  if (typeof active === 'boolean') user.active = active
  if (password) user.passwordHash = await bcrypt.hash(password, 10)
  user.updatedAt = new Date().toISOString()

  store.users[index] = user
  await saveStore(store)
  await logActivity({
    action: 'update',
    resource: 'user',
    userId: req.currentUser.id,
    details: user.email,
  })

  return success(res, sanitizeUser(user), 'User updated')
}

export async function deleteUser(req, res) {
  const store = await getStore()
  const user = store.users.find((u) => u.id === req.params.id)
  if (!user) {
    return fail(res, 'User not found', 404)
  }

  if (user.id === req.currentUser.id) {
    return fail(res, 'You cannot delete your own account')
  }

  store.users = store.users.filter((u) => u.id !== req.params.id)
  await saveStore(store)
  await logActivity({
    action: 'delete',
    resource: 'user',
    userId: req.currentUser.id,
    details: user.email,
  })

  return success(res, null, 'User deleted')
}
