import { type FormEvent, useEffect, useState } from 'react'
import { Save } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { settingsApi, type PlatformSettings } from '../lib/api'
import { useAuth } from '../context/AuthContext'

export function SettingsPage() {
  const { user } = useAuth()
  const [settings, setSettings] = useState<PlatformSettings | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    settingsApi.get().then((res) => setSettings(res.data))
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!settings) return
    await settingsApi.update(settings)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (!settings) return <p className="text-slate-500">Loading settings...</p>

  const isAdmin = user?.role === 'admin'

  return (
    <div className="mx-auto max-w-2xl space-y-6 animate-fade-in">
      <PageHeader title="Settings" description="Platform-wide configuration" />

      <form onSubmit={handleSubmit} className="card space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Platform Name</span>
          <input
            className="input"
            value={settings.platformName}
            onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
            disabled={!isAdmin}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Support Email</span>
          <input
            className="input"
            type="email"
            value={settings.supportEmail}
            onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
            disabled={!isAdmin}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Timezone</span>
          <input
            className="input"
            value={settings.defaultTimezone}
            onChange={(e) => setSettings({ ...settings, defaultTimezone: e.target.value })}
            disabled={!isAdmin}
          />
        </label>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={settings.maintenanceMode}
            onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
            disabled={!isAdmin}
            className="h-4 w-4 rounded border-slate-300"
          />
          <span className="text-sm font-medium text-slate-700">Maintenance mode</span>
        </label>

        {isAdmin && (
          <button type="submit" className="btn btn-primary">
            <Save className="h-4 w-4" />
            {saved ? 'Saved!' : 'Save Settings'}
          </button>
        )}
      </form>
    </div>
  )
}
