import { type FormEvent, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { LayoutDashboard, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export function LoginPage() {
  const { user, login } = useAuth()
  const [email, setEmail] = useState('admin@agency.local')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to="/" replace />

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-matte">
      <div className="relative hidden flex-1 flex-col justify-between overflow-hidden bg-matte-deep p-12 text-text lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(66,133,244,0.12),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(234,67,53,0.08),transparent_50%)]" />
        <div className="absolute left-0 top-0 h-1 w-full chrome-gradient-bar" />

        <div className="relative flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-elevated ring-1 ring-border">
            <LayoutDashboard className="h-6 w-6 text-chrome-blue" />
          </div>
          <span className="text-xl font-bold">Agency Hub</span>
        </div>

        <div className="relative">
          <h1 className="text-4xl font-bold leading-tight">
            One panel for users, products & automation
          </h1>
          <p className="mt-4 max-w-md text-lg text-muted">
            Manage all your agency apps from a single dashboard. Connect backends when you&apos;re
            ready.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-muted">
            <li className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-chrome-yellow" /> User analytics across apps
            </li>
            <li className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-chrome-green" /> Product catalog overview
            </li>
            <li className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-chrome-blue" /> Automation rules & alerts
            </li>
          </ul>
        </div>

        <p className="relative text-xs text-muted-dim">© Agency Admin Panel</p>
      </div>

      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <p className="text-2xl font-bold text-text">Agency Hub</p>
            <p className="text-muted">Sign in to continue</p>
          </div>

          <div className="rounded-3xl border border-border-subtle bg-surface p-8 shadow-2xl shadow-black/40 ring-1 ring-border-subtle">
            <div className="mb-6 h-1 w-16 rounded-full chrome-gradient-bar" />
            <h2 className="text-xl font-bold text-text">Welcome back</h2>
            <p className="mt-1 text-sm text-muted">Enter your admin credentials</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {error && (
                <div className="rounded-xl border border-chrome-red/30 bg-chrome-red/10 px-4 py-3 text-sm text-chrome-red">
                  {error}
                </div>
              )}
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-muted">Email</span>
                <input
                  className="input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-muted">Password</span>
                <input
                  className="input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>
              <button type="submit" disabled={loading} className="btn btn-primary w-full py-3">
                {loading ? 'Signing in...' : 'Sign in to dashboard'}
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-muted-dim">
              Default: admin@agency.local / admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
