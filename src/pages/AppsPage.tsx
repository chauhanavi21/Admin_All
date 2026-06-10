import { type FormEvent, useEffect, useState } from 'react'
import { Link2, Plus, Trash2, Zap } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { appsApi, type AppStatus, type RegisteredApp } from '../lib/api'

function StatusBadge({ status }: { status: AppStatus }) {
  const map = {
    active: 'badge-green',
    pending: 'badge-yellow',
    inactive: 'badge-gray',
  }
  return <span className={`badge ${map[status]}`}>{status}</span>
}

export function AppsPage() {
  const [apps, setApps] = useState<RegisteredApp[]>([])
  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    baseUrl: '',
    status: 'pending' as AppStatus,
  })

  async function load() {
    const res = await appsApi.list()
    setApps(res.data)
  }

  useEffect(() => {
    load()
  }, [])

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    try {
      await appsApi.create(form)
      setMessage('App registered. Connect APIs when ready.')
      setShowForm(false)
      setForm({ name: '', slug: '', description: '', baseUrl: '', status: 'pending' })
      load()
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to create app')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Remove this app registration?')) return
    await appsApi.remove(id)
    load()
  }

  async function handleTest(id: string) {
    const res = await appsApi.test(id)
    setMessage(res.data.message)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Connected apps"
        description="Register projects here — wire APIs and sync products/users later"
        action={
          <button type="button" className="btn btn-primary" onClick={() => setShowForm((v) => !v)}>
            <Plus className="h-4 w-4" />
            Register App
          </button>
        }
      />

      {message && (
        <div className="rounded-xl bg-indigo-50 px-4 py-3 text-sm text-indigo-700">{message}</div>
      )}

      {showForm && (
        <form onSubmit={handleCreate} className="card grid gap-4 md:grid-cols-2">
          <input
            className="input"
            placeholder="App name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            className="input"
            placeholder="Slug (optional)"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
          />
          <input
            className="input md:col-span-2"
            placeholder="Base URL"
            value={form.baseUrl}
            onChange={(e) => setForm({ ...form, baseUrl: e.target.value })}
          />
          <textarea
            className="input md:col-span-2"
            placeholder="Description"
            rows={2}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <select
            className="input"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as AppStatus })}
          >
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary">
              Save
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {apps.map((app) => (
          <div key={app.id} className="card">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{app.name}</h3>
                <p className="text-sm text-slate-500">{app.slug}</p>
              </div>
              <StatusBadge status={app.status} />
            </div>
            <p className="mb-4 text-sm text-slate-600">{app.description || 'No description'}</p>
            {app.baseUrl && (
              <p className="mb-4 flex items-center gap-2 text-sm text-indigo-600">
                <Link2 className="h-4 w-4" />
                {app.baseUrl}
              </p>
            )}
            <div className="flex gap-2">
              <button type="button" className="btn btn-secondary" onClick={() => handleTest(app.id)}>
                <Zap className="h-4 w-4" />
                Test
              </button>
              <button type="button" className="btn btn-danger" onClick={() => handleDelete(app.id)}>
                <Trash2 className="h-4 w-4" />
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
