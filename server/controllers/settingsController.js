import { getStore, logActivity, saveStore } from '../services/storeService.js'
import { fail, success } from '../utils/apiResponse.js'

export async function getSettings(_req, res) {
  const store = await getStore()
  return success(res, store.settings)
}

export async function updateSettings(req, res) {
  const { platformName, supportEmail, maintenanceMode, defaultTimezone } = req.body
  const store = await getStore()

  if (platformName) store.settings.platformName = platformName
  if (supportEmail) store.settings.supportEmail = supportEmail
  if (typeof maintenanceMode === 'boolean') store.settings.maintenanceMode = maintenanceMode
  if (defaultTimezone) store.settings.defaultTimezone = defaultTimezone
  store.settings.updatedAt = new Date().toISOString()

  await saveStore(store)
  await logActivity({
    action: 'update',
    resource: 'settings',
    userId: req.currentUser.id,
  })

  return success(res, store.settings, 'Settings saved')
}

export async function getActivityLog(req, res) {
  const store = await getStore()
  const limit = Math.min(Number(req.query.limit) || 20, 100)
  const entries = store.activityLog.slice(0, limit).map((entry) => {
    const user = store.users.find((u) => u.id === entry.userId)
    return { ...entry, userName: user?.name || 'System' }
  })
  return success(res, entries)
}

export async function getProfile(req, res) {
  return success(res, req.currentUser)
}

export async function updateProfile(req, res) {
  const store = await getStore()
  const index = store.users.findIndex((u) => u.id === req.currentUser.id)
  if (index === -1) {
    return fail(res, 'User not found', 404)
  }

  const { name, email } = req.body
  const user = store.users[index]

  if (email && store.users.some((u, i) => i !== index && u.email.toLowerCase() === email.toLowerCase())) {
    return fail(res, 'Email already exists')
  }

  if (name) user.name = name
  if (email) user.email = email
  user.updatedAt = new Date().toISOString()

  store.users[index] = user
  await saveStore(store)

  const { passwordHash, ...safe } = user
  return success(res, safe, 'Profile updated')
}
