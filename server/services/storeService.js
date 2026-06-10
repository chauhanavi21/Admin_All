import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import crypto from 'crypto'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const STORE_PATH = path.join(__dirname, '../data/store.json')

const EMPTY_STORE = {
  users: [],
  apps: [],
  settings: {
    platformName: 'Agency Admin',
    supportEmail: 'admin@agency.local',
    maintenanceMode: false,
    defaultTimezone: 'Asia/Kolkata',
    updatedAt: new Date().toISOString(),
  },
  activityLog: [],
}

export async function ensureStoreFile() {
  try {
    await fs.access(STORE_PATH)
  } catch {
    await fs.mkdir(path.dirname(STORE_PATH), { recursive: true })
    await fs.writeFile(STORE_PATH, JSON.stringify(EMPTY_STORE, null, 2), 'utf-8')
  }
}

async function readStore() {
  const raw = await fs.readFile(STORE_PATH, 'utf-8')
  return JSON.parse(raw)
}

async function writeStore(data) {
  await fs.writeFile(STORE_PATH, JSON.stringify(data, null, 2), 'utf-8')
}

export function createId() {
  return crypto.randomUUID()
}

export async function getStore() {
  return readStore()
}

export async function saveStore(data) {
  await writeStore(data)
}

export async function logActivity({ action, resource, userId, details = '' }) {
  const store = await readStore()
  store.activityLog.unshift({
    id: createId(),
    action,
    resource,
    userId,
    details,
    createdAt: new Date().toISOString(),
  })
  store.activityLog = store.activityLog.slice(0, 100)
  await writeStore(store)
}
