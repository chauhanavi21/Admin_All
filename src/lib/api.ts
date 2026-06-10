const API_BASE = import.meta.env.VITE_API_URL || '/api'

export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data: T
  errors?: unknown
}

function getToken() {
  return localStorage.getItem('admin_token')
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem('admin_token', token)
  else localStorage.removeItem('admin_token')
}

export async function api<T>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })
  const json = (await res.json()) as ApiResponse<T>

  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Request failed')
  }

  return json
}

export const authApi = {
  login: (email: string, password: string) =>
    api<{ token: string; user: AdminUser }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  me: () => api<AdminUser>('/auth/me'),
  logout: () => api('/auth/logout', { method: 'POST' }),
}

export const dashboardApi = {
  overview: () =>
    api<{
      stats: DashboardStats
      recentActivity: ActivityEntry[]
      appsSummary: AppSummary[]
    }>('/dashboard/overview'),
}

export const usersApi = {
  list: () => api<AdminUser[]>('/users'),
  create: (body: Partial<AdminUser> & { password: string }) =>
    api<AdminUser>('/users', { method: 'POST', body: JSON.stringify(body) }),
  update: (id: string, body: Partial<AdminUser> & { password?: string }) =>
    api<AdminUser>(`/users/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  remove: (id: string) => api(`/users/${id}`, { method: 'DELETE' }),
}

export const appsApi = {
  list: () => api<RegisteredApp[]>('/apps'),
  create: (body: Partial<RegisteredApp>) =>
    api<RegisteredApp>('/apps', { method: 'POST', body: JSON.stringify(body) }),
  update: (id: string, body: Partial<RegisteredApp>) =>
    api<RegisteredApp>(`/apps/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  remove: (id: string) => api(`/apps/${id}`, { method: 'DELETE' }),
  test: (id: string) =>
    api<{ connected: boolean; message: string }>(`/apps/${id}/test`, { method: 'POST' }),
}

export const settingsApi = {
  get: () => api<PlatformSettings>('/settings'),
  update: (body: Partial<PlatformSettings>) =>
    api<PlatformSettings>('/settings', { method: 'PUT', body: JSON.stringify(body) }),
  activity: () => api<ActivityEntry[]>('/settings/activity'),
}

export type UserRole = 'admin' | 'manager' | 'viewer'
export type AppStatus = 'active' | 'inactive' | 'pending'

export interface AdminUser {
  id: string
  name: string
  email: string
  role: UserRole
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface RegisteredApp {
  id: string
  name: string
  slug: string
  description: string
  baseUrl: string
  apiKey?: string
  status: AppStatus
  metadata: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface PlatformSettings {
  platformName: string
  supportEmail: string
  maintenanceMode: boolean
  defaultTimezone: string
  updatedAt: string
}

export interface DashboardStats {
  totalUsers: number
  activeUsers: number
  totalApps: number
  activeApps: number
  pendingApps: number
  maintenanceMode: boolean
}

export interface ActivityEntry {
  id: string
  action: string
  resource: string
  userId: string
  userName?: string
  details: string
  createdAt: string
}

export interface AppSummary {
  id: string
  name: string
  slug: string
  status: AppStatus
  baseUrl: string
  updatedAt: string
}
