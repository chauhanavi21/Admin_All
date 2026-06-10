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

      {/* Hero highlight row */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-8 text-white shadow-xl shadow-indigo-500/20">
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <p className="text-sm font-medium text-indigo-100">Total users across apps</p>
          <p className="mt-2 text-5xl font-bold tracking-tight">{metrics.totalUsers.toLocaleString()}</p>
          <p className="mt-2 text-indigo-100">
            {metrics.activeUsers} active · +{metrics.newUsersThisWeek} this week
          </p>
          <Link
            to="/users"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur transition hover:bg-white/25"
          >
            Manage users <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 p-8 text-white shadow-xl shadow-emerald-500/20">
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <p className="text-sm font-medium text-emerald-100">Total products / services</p>
          <p className="mt-2 text-5xl font-bold tracking-tight">{metrics.totalProducts.toLocaleString()}</p>
          <p className="mt-2 text-emerald-100">
            {metrics.activeProducts} active · {metrics.lowStockProducts} low stock
          </p>
          <Link
            to="/products"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur transition hover:bg-white/25"
          >
            View catalog <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Stat grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Admin users"
          value={metrics.totalUsers}
          icon={Users}
          trend={12}
          subtitle="Panel access"
          accent="indigo"
        />
        <StatCard
          label="Products & services"
          value={metrics.totalProducts}
          icon={Package}
          trend={8}
          subtitle={`${metrics.activeProducts} live`}
          accent="emerald"
        />
        <StatCard
          label="Connected apps"
          value={metrics.totalApps}
          icon={Boxes}
          subtitle="Ready to wire up"
          accent="violet"
        />
        <StatCard
          label="Active automations"
          value={metrics.activeAutomations}
          icon={Zap}
          trend={5}
          subtitle={`${metrics.automationRunsToday} runs today`}
          accent="amber"
        />
      </div>

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">User sign-ups this week</h2>
          <p className="mb-6 text-sm text-slate-500">Preview data — connect apps to sync real numbers</p>
          <BarChart data={userGrowthData} color="bg-indigo-500" />
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Products by app</h2>
          <p className="mb-6 text-sm text-slate-500">Distribution across connected projects</p>
          <DonutChart segments={productByAppData} />
        </div>
      </div>

      {/* Automation preview + activity */}
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              <h2 className="text-lg font-bold text-slate-900">Active automations</h2>
            </div>
            <Link to="/automation" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
              View all
            </Link>
          </div>
          <ul className="space-y-3">
            {automations.map((rule) => (
              <li
                key={rule.id}
                className="rounded-xl border border-slate-100 bg-slate-50/80 p-4 transition hover:border-indigo-100 hover:bg-indigo-50/30"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-slate-800">{rule.name}</p>
                  <span className="badge badge-green">On</span>
                </div>
                <p className="mt-1 text-xs text-slate-500">{rule.trigger} → {rule.action}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm lg:col-span-3">
          <div className="mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">Recent activity</h2>
          </div>
          {activity.length === 0 ? (
            <p className="text-sm text-slate-500">No activity logged yet. Actions will appear here.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {activity.map((entry) => (
                <li key={entry.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                  <div>
                    <span className="font-medium capitalize text-slate-800">
                      {entry.action} {entry.resource}
                    </span>
                    {entry.details && (
                      <span className="text-slate-400"> — {entry.details}</span>
                    )}
                  </div>
                  <div className="shrink-0 text-right text-slate-400">
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
