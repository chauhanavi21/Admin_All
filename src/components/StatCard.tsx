import type { LucideIcon } from 'lucide-react'
import { TrendingDown, TrendingUp } from 'lucide-react'

interface StatCardProps {
  label: string
  value: number | string
  icon: LucideIcon
  trend?: number
  subtitle?: string
  accent?: 'indigo' | 'violet' | 'emerald' | 'amber' | 'rose' | 'cyan'
}

const accents = {
  indigo: 'from-indigo-500 to-violet-600 shadow-indigo-500/25',
  violet: 'from-violet-500 to-purple-600 shadow-violet-500/25',
  emerald: 'from-emerald-500 to-teal-600 shadow-emerald-500/25',
  amber: 'from-amber-500 to-orange-500 shadow-amber-500/25',
  rose: 'from-rose-500 to-pink-600 shadow-rose-500/25',
  cyan: 'from-cyan-500 to-blue-600 shadow-cyan-500/25',
}

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  subtitle,
  accent = 'indigo',
}: StatCardProps) {
  const up = trend !== undefined && trend >= 0

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg ${accents[accent]}`}
        >
          <Icon className="h-6 w-6" />
        </div>
        {trend !== undefined && (
          <span
            className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold ${
              up ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
            }`}
          >
            {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
      <p className="mt-1 text-sm font-medium text-slate-600">{label}</p>
      {subtitle && <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>}
    </div>
  )
}
