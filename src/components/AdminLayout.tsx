import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  Boxes,
  LayoutDashboard,
  LogOut,
  Package,
  Search,
  Settings,
  Users,
  Zap,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/users', label: 'Users', icon: Users },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/apps', label: 'Apps', icon: Boxes },
  { to: '/automation', label: 'Automation', icon: Zap },
  { to: '/settings', label: 'Settings', icon: Settings },
]

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/users': 'Users',
  '/products': 'Products & Services',
  '/apps': 'Connected Apps',
  '/automation': 'Automation',
  '/settings': 'Settings',
}

export function AdminLayout() {
  const { user, logout } = useAuth()
  const { pathname } = useLocation()
  const title = pageTitles[pathname] || 'Admin'

  return (
    <div className="flex min-h-screen bg-matte">
      <aside className="fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col border-r border-border-subtle bg-matte-deep text-text">
        <div className="h-1 w-full chrome-gradient-bar" />

        <div className="px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-elevated shadow-lg ring-1 ring-border">
              <LayoutDashboard className="h-5 w-5 text-chrome-blue" />
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-chrome-green ring-2 ring-matte-deep" />
            </div>
            <div>
              <p className="text-base font-bold tracking-tight">Agency Hub</p>
              <p className="text-[11px] text-muted">Admin control center</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-chrome-blue/15 text-chrome-blue ring-1 ring-chrome-blue/30'
                    : 'text-muted hover:bg-elevated hover:text-text'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full chrome-gradient-bar" />
                  )}
                  <Icon className="h-[18px] w-[18px] shrink-0" />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-border-subtle p-4">
          <div className="mb-3 rounded-xl bg-elevated px-4 py-3 ring-1 ring-border-subtle">
            <p className="truncate text-sm font-semibold text-text">{user?.name}</p>
            <p className="text-xs capitalize text-muted">{user?.role}</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-muted transition hover:bg-elevated hover:text-chrome-red"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      <div className="ml-[260px] flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-border-subtle bg-surface/90 px-8 py-4 backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider chrome-gradient-text">
                Admin Panel
              </p>
              <h2 className="text-lg font-bold text-text">{title}</h2>
            </div>
            <div className="relative hidden max-w-xs flex-1 sm:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                className="input py-2 pl-10"
                placeholder="Search..."
                disabled
              />
            </div>
          </div>
        </header>
        <main className="flex-1 bg-matte p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
