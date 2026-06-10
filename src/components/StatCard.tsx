import type { LucideIcon } from 'lucide-react'
import { TrendingDown, TrendingUp } from 'lucide-react'

interface StatCardProps {
  label: string
  value: number | string
  icon: LucideIcon
  trend?: number
  subtitle?: string
  accent?: 'blue' | 'green' | 'yellow' | 'red'
}

const accents = {
  blue: 'from-chrome-blue to-[#3367d6] shadow-chrome-blue/30',
  green: 'from-chrome-green to-[#2d8f47] shadow-chrome-green/30',
  yellow: 'from-chrome-yellow to-[#e8a800] shadow-chrome-yellow/30',
  red: 'from-chrome-red to-[#c5221f] shadow-chrome-red/30',
}

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  subtitle,
  accent = 'blue',
}: StatCardProps) {
  const up = trend !== undefined && trend >= 0

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border-subtle bg-surface p-5 shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-0.5 hover:border-border hover:shadow-xl hover:shadow-black/30">
      <div className="absolute inset-x-0 top-0 h-px chrome-gradient-bar opacity-0 transition group-hover:opacity-100" />
      <div className="flex items-start justify-between gap-3">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg ${accents[accent]}`}
        >
          <Icon className="h-6 w-6" />
        </div>
        {trend !== undefined && (
          <span
            className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold ${
              up ? 'bg-chrome-green/15 text-chrome-green' : 'bg-chrome-red/15 text-chrome-red'
            }`}
          >
            {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="mt-4 text-3xl font-bold tracking-tight text-text">{value}</p>
      <p className="mt-1 text-sm font-medium text-muted">{label}</p>
      {subtitle && <p className="mt-0.5 text-xs text-muted-dim">{subtitle}</p>}
    </div>
  )
}
