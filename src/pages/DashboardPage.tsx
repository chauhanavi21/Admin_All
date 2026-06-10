import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Activity,
  ArrowRight,
  Boxes,
  Package,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react'
import { BarChart, DonutChart } from '../components/Charts'
import { PageHeader } from '../components/PageHeader'
import { StatCard } from '../components/StatCard'
import { DashboardSkeleton } from '../components/UiPrimitives'
import {
  loadDashboardData,
  productByAppData,
  userGrowthData,
  type AutomationRule,
  type DashboardMetrics,
} from '../data/dashboardData'
import type { ActivityEntry } from '../lib/api'

export function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [activity, setActivity] = useState<ActivityEntry[]>([])
  const [automations, setAutomations] = useState<AutomationRule[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
      .then((data) => {
        setMetrics(data.metrics)
        setActivity(data.activity)
        setAutomations(data.automations.filter((a) => a.enabled).slice(0, 3))
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading || !metrics) {
    return <DashboardSkeleton />
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="Dashboard"
        description="Users, products, and automations across all your connected apps"
        action={
          <div className="flex gap-2">
            <Link to="/products" className="btn btn-secondary">
              View products
            </Link>
            <Link to="/automation" className="btn btn-primary">
              <Zap className="h-4 w-4" />
              Automations
            </Link>
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-3xl border border-chrome-blue/20 bg-gradient-to-br from-chrome-blue/20 via-surface to-matte-deep p-8 shadow-xl shadow-black/30">
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-chrome-blue/10 blur-2xl" />
          <div className="absolute left-0 top-0 h-1 w-full bg-chrome-blue" />
          <p className="text-sm font-medium text-chrome-blue">Total users across apps</p>
          <p className="mt-2 text-5xl font-bold tracking-tight text-text">
            {metrics.totalUsers.toLocaleString()}
          </p>
          <p className="mt-2 text-muted">
            {metrics.activeUsers} active · +{metrics.newUsersThisWeek} this week
          </p>
          <Link
            to="/users"
            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-chrome-blue/30 bg-chrome-blue/10 px-4 py-2 text-sm font-semibold text-chrome-blue transition hover:bg-chrome-blue/20"
          >
            Manage users <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-chrome-green/20 bg-gradient-to-br from-chrome-green/15 via-surface to-matte-deep p-8 shadow-xl shadow-black/30">
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-chrome-green/10 blur-2xl" />
          <div className="absolute left-0 top-0 h-1 w-full bg-chrome-green" />
          <p className="text-sm font-medium text-chrome-green">Total products / services</p>
          <p className="mt-2 text-5xl font-bold tracking-tight text-text">
            {metrics.totalProducts.toLocaleString()}
          </p>
          <p className="mt-2 text-muted">
            {metrics.activeProducts} active · {metrics.lowStockProducts} low stock
          </p>
          <Link
            to="/products"
            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-chrome-green/30 bg-chrome-green/10 px-4 py-2 text-sm font-semibold text-chrome-green transition hover:bg-chrome-green/20"
          >
            View catalog <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Admin users"
          value={metrics.totalUsers}
          icon={Users}
          trend={12}
          subtitle="Panel access"
          accent="blue"
        />
        <StatCard
          label="Products & services"
          value={metrics.totalProducts}
          icon={Package}
          trend={8}
          subtitle={`${metrics.activeProducts} live`}
          accent="green"
        />
        <StatCard
          label="Connected apps"
          value={metrics.totalApps}
          icon={Boxes}
          subtitle="Ready to wire up"
          accent="yellow"
        />
        <StatCard
          label="Active automations"
          value={metrics.activeAutomations}
          icon={Zap}
          trend={5}
          subtitle={`${metrics.automationRunsToday} runs today`}
          accent="red"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h2 className="text-lg font-bold text-text">User sign-ups this week</h2>
          <p className="mb-6 text-sm text-muted">Preview data — connect apps to sync real numbers</p>
          <BarChart data={userGrowthData} color="bg-chrome-blue" />
        </div>

        <div className="card">
          <h2 className="text-lg font-bold text-text">Products by app</h2>
          <p className="mb-6 text-sm text-muted">Distribution across connected projects</p>
          <DonutChart segments={productByAppData} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="card lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-chrome-yellow" />
              <h2 className="text-lg font-bold text-text">Active automations</h2>
            </div>
            <Link to="/automation" className="link-accent text-sm">
              View all
            </Link>
          </div>
          <ul className="space-y-3">
            {automations.map((rule) => (
              <li
                key={rule.id}
                className="rounded-xl border border-border-subtle bg-elevated/60 p-4 transition hover:border-chrome-blue/30 hover:bg-elevated"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-text">{rule.name}</p>
                  <span className="badge badge-green">On</span>
                </div>
                <p className="mt-1 text-xs text-muted">
                  {rule.trigger} → {rule.action}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="card lg:col-span-3">
          <div className="mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-chrome-blue" />
            <h2 className="text-lg font-bold text-text">Recent activity</h2>
          </div>
          {activity.length === 0 ? (
            <p className="text-sm text-muted">No activity logged yet. Actions will appear here.</p>
          ) : (
            <ul className="divide-y divide-border-subtle">
              {activity.map((entry) => (
                <li key={entry.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                  <div>
                    <span className="font-medium capitalize text-text">
                      {entry.action} {entry.resource}
                    </span>
                    {entry.details && (
                      <span className="text-muted-dim"> — {entry.details}</span>
                    )}
                  </div>
                  <div className="shrink-0 text-right text-muted-dim">
                    <p>{entry.userName}</p>
                    <p className="text-xs">{new Date(entry.createdAt).toLocaleString()}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
