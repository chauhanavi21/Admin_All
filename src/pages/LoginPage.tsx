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
    <div className="flex min-h-screen">
      <div className="hidden flex-1 flex-col justify-between bg-gradient-to-br from-[#0c1222] via-indigo-950 to-violet-950 p-12 text-white lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500">
            <LayoutDashboard className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold">Agency Hub</span>
        </div>
        <div>
          <h1 className="text-4xl font-bold leading-tight">
            One panel for users, products & automation
          </h1>
          <p className="mt-4 max-w-md text-lg text-indigo-200">
            Manage all your agency apps from a single dashboard. Connect backends when you&apos;re
            ready.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-indigo-100">
            <li className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400" /> User analytics across apps
            </li>
            <li className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400" /> Product catalog overview
            </li>
            <li className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400" /> Automation rules & alerts
            </li>
          </ul>
        </div>
        <p className="text-xs text-slate-500">© Agency Admin Panel</p>
      </div>

      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <p className="text-2xl font-bold text-slate-900">Agency Hub</p>
            <p className="text-slate-500">Sign in to continue</p>
          </div>

          <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xl shadow-slate-200/50">
            <h2 className="text-xl font-bold text-slate-900">Welcome back</h2>
            <p className="mt-1 text-sm text-slate-500">Enter your admin credentials</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {error && (
                <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
              )}
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">Email</span>
                <input
                  className="input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">Password</span>
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

            <p className="mt-6 text-center text-xs text-slate-400">
              Default: admin@agency.local / admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
