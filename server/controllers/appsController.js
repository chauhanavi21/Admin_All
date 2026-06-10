import { createId, getStore, logActivity, saveStore } from '../services/storeService.js'
import { fail, success } from '../utils/apiResponse.js'

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export async function listApps(_req, res) {
  const store = await getStore()
  return success(res, store.apps)
}

export async function getApp(req, res) {
  const store = await getStore()
  const app = store.apps.find((a) => a.id === req.params.id)
  if (!app) {
    return fail(res, 'App not found', 404)
  }
  return success(res, app)
}

export async function createApp(req, res) {
  const { name, slug, description = '', baseUrl = '', apiKey = '', status = 'pending', metadata = {} } =
    req.body

  if (!name) {
    return fail(res, 'App name is required')
  }

  const store = await getStore()
  const finalSlug = slugify(slug || name)

  if (store.apps.some((a) => a.slug === finalSlug)) {
    return fail(res, 'App slug already exists')
  }

  const now = new Date().toISOString()
  const app = {
    id: createId(),
    name,
    slug: finalSlug,
    description,
    baseUrl,
    apiKey,
    status: ['active', 'inactive', 'pending'].includes(status) ? status : 'pending',
    metadata,
    createdAt: now,
    updatedAt: now,
  }

  store.apps.push(app)
  await saveStore(store)
  await logActivity({
    action: 'create',
    resource: 'app',
    userId: req.currentUser.id,
    details: app.slug,
  })

  return success(res, app, 'App registered — attach integrations later', 201)
}

export async function updateApp(req, res) {
  const store = await getStore()
  const index = store.apps.findIndex((a) => a.id === req.params.id)
  if (index === -1) {
    return fail(res, 'App not found', 404)
  }

  const app = store.apps[index]
  const { name, slug, description, baseUrl, apiKey, status, metadata } = req.body

  if (slug) {
    const finalSlug = slugify(slug)
    if (store.apps.some((a, i) => i !== index && a.slug === finalSlug)) {
      return fail(res, 'App slug already exists')
    }
    app.slug = finalSlug
  }

  if (name) app.name = name
  if (description !== undefined) app.description = description
  if (baseUrl !== undefined) app.baseUrl = baseUrl
  if (apiKey !== undefined) app.apiKey = apiKey
  if (status && ['active', 'inactive', 'pending'].includes(status)) app.status = status
  if (metadata) app.metadata = { ...app.metadata, ...metadata }
  app.updatedAt = new Date().toISOString()

  store.apps[index] = app
  await saveStore(store)
  await logActivity({
    action: 'update',
    resource: 'app',
    userId: req.currentUser.id,
    details: app.slug,
  })

  return success(res, app, 'App updated')
}

export async function deleteApp(req, res) {
  const store = await getStore()
  const app = store.apps.find((a) => a.id === req.params.id)
  if (!app) {
    return fail(res, 'App not found', 404)
  }

  store.apps = store.apps.filter((a) => a.id !== req.params.id)
  await saveStore(store)
  await logActivity({
    action: 'delete',
    resource: 'app',
    userId: req.currentUser.id,
    details: app.slug,
  })

  return success(res, null, 'App removed')
}

/** Placeholder for future webhook / health check when apps are connected */
export async function testAppConnection(req, res) {
  const store = await getStore()
  const app = store.apps.find((a) => a.id === req.params.id)
  if (!app) {
    return fail(res, 'App not found', 404)
  }

  if (!app.baseUrl) {
    return success(res, { connected: false, message: 'No base URL configured yet' })
  }

  return success(res, {
    connected: false,
    message: 'Connection test stub — wire this controller to your app APIs later',
    app: { id: app.id, slug: app.slug, baseUrl: app.baseUrl },
  })
}
