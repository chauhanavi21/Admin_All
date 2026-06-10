import bcrypt from 'bcryptjs'
import { createId, getStore, saveStore } from '../services/storeService.js'

export async function seedAdminIfEmpty() {
  const store = await getStore()

  if (store.users.length > 0) {
    return null
  }

  const now = new Date().toISOString()
  const email = process.env.ADMIN_EMAIL || 'admin@agency.local'
  const password = process.env.ADMIN_PASSWORD || 'admin123'

  store.users.push({
    id: createId(),
    name: 'Super Admin',
    email,
    passwordHash: await bcrypt.hash(password, 10),
    role: 'admin',
    active: true,
    createdAt: now,
    updatedAt: now,
  })

  store.apps.push(
    {
      id: createId(),
      name: 'Zaptax',
      slug: 'zaptax',
      description: 'Business & tax compliance site — connect API later',
      baseUrl: 'http://localhost:5173',
      apiKey: '',
      status: 'pending',
      metadata: { folder: 'dow/zaptax-react' },
      createdAt: now,
      updatedAt: now,
    },
    {
      id: createId(),
      name: 'Noir Bean Coffee',
      slug: 'noir-bean-coffee',
      description: 'Coffee shop app — connect API later',
      baseUrl: 'http://localhost:5174',
      apiKey: '',
      status: 'pending',
      metadata: { folder: 'noir-bean-coffee' },
      createdAt: now,
      updatedAt: now,
    },
  )

  await saveStore(store)
  console.log(`Seeded default admin: ${email} / ${password}`)
  return email
}
