import { useState } from 'react'
import {
  Bell,
  Calendar,
  Mail,
  Play,
  Plus,
  ToggleLeft,
  ToggleRight,
  Zap,
} from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { mockAutomations, type AutomationRule } from '../data/dashboardData'

const triggerIcons: Record<string, typeof Zap> = {
  Stock: Bell,
  User: Mail,
  Schedule: Calendar,
  Cart: Mail,
  Deadline: Bell,
}

function getIcon(trigger: string) {
  const key = Object.keys(triggerIcons).find((k) => trigger.startsWith(k))
  return key ? triggerIcons[key] : Zap
}

export function AutomationPage() {
  const [rules, setRules] = useState<AutomationRule[]>(mockAutomations)
  const [toast, setToast] = useState('')

  const enabledCount = rules.filter((r) => r.enabled).length
  const totalRuns = rules.reduce((s, r) => s + r.runsCount, 0)

  function toggleRule(id: string) {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)),
    )
    setToast('Automation updated (UI preview — backend coming soon)')
    setTimeout(() => setToast(''), 2500)
  }

  function runNow(id: string) {
    setRules((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              runsCount: r.runsCount + 1,
              lastRun: new Date().toISOString(),
            }
          : r,
      ),
    )
    setToast('Test run simulated successfully')
    setTimeout(() => setToast(''), 2500)
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="Automation"
        description="Set up rules to automate alerts, emails, and reports across your apps"
        action={
          <button type="button" className="btn btn-primary opacity-60" disabled title="Coming soon">
            <Plus className="h-4 w-4" />
            Create rule
          </button>
        }
      />

      {toast && (
        <div className="rounded-xl border border-chrome-green/30 bg-chrome-green/10 px-4 py-3 text-sm font-medium text-chrome-green">
          {toast}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border-subtle bg-surface p-5">
          <p className="text-sm text-muted">Total rules</p>
          <p className="mt-1 text-3xl font-bold text-text">{rules.length}</p>
        </div>
        <div className="rounded-2xl border border-chrome-green/30 bg-chrome-green/5 p-5">
          <p className="text-sm text-chrome-green">Active</p>
          <p className="mt-1 text-3xl font-bold text-chrome-green">{enabledCount}</p>
        </div>
        <div className="rounded-2xl border border-chrome-blue/30 bg-chrome-blue/5 p-5">
          <p className="text-sm text-chrome-blue">Total runs</p>
          <p className="mt-1 text-3xl font-bold text-chrome-blue">{totalRuns}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-chrome-yellow/20 bg-gradient-to-r from-chrome-yellow/5 to-chrome-red/5 p-5">
        <p className="text-sm font-semibold text-chrome-yellow">Automation ideas you can enable later</p>
        <ul className="mt-2 grid gap-1 text-sm text-muted sm:grid-cols-2">
          <li>• Low stock email alerts</li>
          <li>• New user welcome emails</li>
          <li>• Daily sales PDF reports</li>
          <li>• Tax deadline reminders</li>
          <li>• Abandoned cart follow-ups</li>
          <li>• Weekly admin digest</li>
        </ul>
      </div>

      <div className="space-y-4">
        {rules.map((rule) => {
          const Icon = getIcon(rule.trigger)
          return (
            <article
              key={rule.id}
              className={`rounded-2xl border p-6 transition-all duration-300 ${
                rule.enabled
                  ? 'border-chrome-blue/30 bg-surface shadow-lg shadow-black/20 ring-1 ring-chrome-blue/10'
                  : 'border-border-subtle bg-elevated/40 opacity-80'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                      rule.enabled
                        ? 'bg-gradient-to-br from-chrome-blue to-[#3367d6] text-white shadow-lg shadow-chrome-blue/25'
                        : 'bg-elevated-hover text-muted'
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-bold text-text">{rule.name}</h3>
                      <span className={`badge ${rule.enabled ? 'badge-green' : 'badge-gray'}`}>
                        {rule.enabled ? 'Active' : 'Paused'}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted">{rule.description}</p>
                    <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-dim">
                      <span>
                        <strong className="text-muted">Trigger:</strong> {rule.trigger}
                      </span>
                      <span>
                        <strong className="text-muted">Action:</strong> {rule.action}
                      </span>
                      {rule.lastRun && (
                        <span>Last run: {new Date(rule.lastRun).toLocaleString()}</span>
                      )}
                      <span>{rule.runsCount} runs</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => runNow(rule.id)}
                    className="btn btn-secondary"
                    disabled={!rule.enabled}
                  >
                    <Play className="h-4 w-4" />
                    Test run
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleRule(rule.id)}
                    className="rounded-xl p-2 text-chrome-blue transition hover:bg-chrome-blue/10"
                    aria-label={rule.enabled ? 'Disable' : 'Enable'}
                  >
                    {rule.enabled ? (
                      <ToggleRight className="h-8 w-8" />
                    ) : (
                      <ToggleLeft className="h-8 w-8 text-muted" />
                    )}
                  </button>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
