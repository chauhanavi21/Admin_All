import { getStore } from '../services/storeService.js'
import { success } from '../utils/apiResponse.js'

export async function getOverview(_req, res) {
  const store = await getStore()

  const stats = {
    totalUsers: store.users.length,
    activeUsers: store.users.filter((u) => u.active).length,
    totalApps: store.apps.length,
    activeApps: store.apps.filter((a) => a.status === 'active').length,
    pendingApps: store.apps.filter((a) => a.status === 'pending').length,
    maintenanceMode: store.settings.maintenanceMode,
  }

  const recentActivity = store.activityLog.slice(0, 8).map((entry) => {
    const user = store.users.find((u) => u.id === entry.userId)
    return {
      ...entry,
      userName: user?.name || 'System',
    }
  })

  const appsSummary = store.apps.map(({ id, name, slug, status, baseUrl, updatedAt }) => ({
    id,
    name,
    slug,
    status,
    baseUrl,
    updatedAt,
  }))

  return success(res, { stats, recentActivity, appsSummary })
}

export async function getStats(_req, res) {
  const store = await getStore()
  return success(res, {
    usersByRole: {
      admin: store.users.filter((u) => u.role === 'admin').length,
      manager: store.users.filter((u) => u.role === 'manager').length,
      viewer: store.users.filter((u) => u.role === 'viewer').length,
    },
    appsByStatus: {
      active: store.apps.filter((a) => a.status === 'active').length,
      inactive: store.apps.filter((a) => a.status === 'inactive').length,
      pending: store.apps.filter((a) => a.status === 'pending').length,
    },
  })
}
