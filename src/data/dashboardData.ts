import {
  dashboardApi,
  usersApi,
  type ActivityEntry,
  type AdminUser,
} from '../lib/api'

export interface ProductSummary {
  id: string
  name: string
  app: string
  category: string
  price: number
  stock: number
  status: 'active' | 'draft' | 'archived'
  updatedAt: string
}

export interface AutomationRule {
  id: string
  name: string
  description: string
  trigger: string
  action: string
  enabled: boolean
  lastRun?: string
  runsCount: number
}

export interface DashboardMetrics {
  totalUsers: number
  activeUsers: number
  newUsersThisWeek: number
  totalProducts: number
  activeProducts: number
  lowStockProducts: number
  totalApps: number
  activeAutomations: number
  automationRunsToday: number
}

export const mockProducts: ProductSummary[] = [
  {
    id: '1',
    name: 'Private Limited Registration',
    app: 'Zaptax',
    category: 'Business',
    price: 10999,
    stock: 999,
    status: 'active',
    updatedAt: '2026-06-08',
  },
  {
    id: '2',
    name: 'ITR Filing — Salaried',
    app: 'Zaptax',
    category: 'Tax',
    price: 1499,
    stock: 999,
    status: 'active',
    updatedAt: '2026-06-07',
  },
  {
    id: '3',
    name: 'Trademark Registration',
    app: 'Zaptax',
    category: 'Brand',
    price: 9500,
    stock: 999,
    status: 'active',
    updatedAt: '2026-06-06',
  },
  {
    id: '4',
    name: 'Espresso Blend 250g',
    app: 'Noir Bean Coffee',
    category: 'Coffee',
    price: 499,
    stock: 42,
    status: 'active',
    updatedAt: '2026-06-09',
  },
  {
    id: '5',
    name: 'Cold Brew Kit',
    app: 'Noir Bean Coffee',
    category: 'Merchandise',
    price: 1299,
    stock: 8,
    status: 'active',
    updatedAt: '2026-06-05',
  },
  {
    id: '6',
    name: 'GST Registration',
    app: 'Zaptax',
    category: 'Business',
    price: 2999,
    stock: 999,
    status: 'draft',
    updatedAt: '2026-06-01',
  },
]

export const mockAutomations: AutomationRule[] = [
  {
    id: 'a1',
    name: 'Low stock alert',
    description: 'Notify admin when product stock drops below 10 units',
    trigger: 'Stock < 10',
    action: 'Send email + dashboard alert',
    enabled: true,
    lastRun: '2026-06-09T08:30:00',
    runsCount: 124,
  },
  {
    id: 'a2',
    name: 'New user welcome',
    description: 'Send welcome email when a new user registers on any connected app',
    trigger: 'User created',
    action: 'Send welcome email',
    enabled: true,
    lastRun: '2026-06-09T11:15:00',
    runsCount: 89,
  },
  {
    id: 'a3',
    name: 'Daily sales report',
    description: 'Generate and email daily revenue summary at 9 PM',
    trigger: 'Schedule — daily 21:00',
    action: 'Email PDF report',
    enabled: false,
    runsCount: 0,
  },
  {
    id: 'a4',
    name: 'Order follow-up',
    description: 'Remind customers 24h after abandoned checkout',
    trigger: 'Cart abandoned 24h',
    action: 'Send reminder SMS',
    enabled: true,
    lastRun: '2026-06-09T06:00:00',
    runsCount: 56,
  },
  {
    id: 'a5',
    name: 'Compliance deadline',
    description: 'Alert clients 7 days before tax filing deadline',
    trigger: 'Deadline - 7 days',
    action: 'Push notification',
    enabled: false,
    runsCount: 0,
  },
]

export const userGrowthData = [
  { label: 'Mon', value: 12 },
  { label: 'Tue', value: 19 },
  { label: 'Wed', value: 15 },
  { label: 'Thu', value: 28 },
  { label: 'Fri', value: 22 },
  { label: 'Sat', value: 34 },
  { label: 'Sun', value: 26 },
]

export const productByAppData = [
  { label: 'Zaptax', value: 16, color: 'bg-chrome-blue' },
  { label: 'Noir Bean', value: 8, color: 'bg-chrome-yellow' },
  { label: 'Apex Ledger', value: 5, color: 'bg-chrome-green' },
  { label: 'E-commerce', value: 12, color: 'bg-chrome-red' },
]

/** Merge live admin users with mock product/automation data for UI preview */
export async function loadDashboardData(): Promise<{
  metrics: DashboardMetrics
  activity: ActivityEntry[]
  users: AdminUser[]
  products: ProductSummary[]
  automations: AutomationRule[]
}> {
  let totalUsers = 1
  let activeUsers = 1
  let totalApps = 2
  let activity: ActivityEntry[] = []

  try {
    const overview = await dashboardApi.overview()
    totalUsers = overview.data.stats.totalUsers
    activeUsers = overview.data.stats.activeUsers
    totalApps = overview.data.stats.totalApps
    activity = overview.data.recentActivity
  } catch {
    /* use defaults when API offline — UI still works */
  }

  let users: AdminUser[] = []
  try {
    const res = await usersApi.list()
    users = res.data
  } catch {
    users = []
  }

  const products = mockProducts
  const automations = mockAutomations

  return {
    metrics: {
      totalUsers,
      activeUsers,
      newUsersThisWeek: Math.max(1, Math.floor(totalUsers * 0.3)),
      totalProducts: products.length + 35,
      activeProducts: products.filter((p) => p.status === 'active').length + 30,
      lowStockProducts: products.filter((p) => p.stock < 15).length,
      totalApps,
      activeAutomations: automations.filter((a) => a.enabled).length,
      automationRunsToday: 47,
    },
    activity,
    users,
    products,
    automations,
  }
}
