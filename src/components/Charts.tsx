interface BarChartProps {
  data: { label: string; value: number }[]
  color?: string
}

export function BarChart({ data, color = 'bg-indigo-500' }: BarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1)

  return (
    <div className="flex h-40 items-end justify-between gap-2">
      {data.map((item) => (
        <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex w-full flex-1 items-end">
            <div
              className={`w-full rounded-t-lg ${color} transition-all duration-500 hover:opacity-80`}
              style={{ height: `${(item.value / max) * 100}%`, minHeight: '8px' }}
            />
          </div>
          <span className="text-[10px] font-medium text-slate-400">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

interface DonutSegment {
  label: string
  value: number
  color: string
}

export function DonutChart({ segments }: { segments: DonutSegment[] }) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1
  let offset = 0
  const gradient = segments
    .map((seg) => {
      const pct = (seg.value / total) * 100
      const start = offset
      offset += pct
      const colorMap: Record<string, string> = {
        'bg-indigo-500': '#6366f1',
        'bg-amber-500': '#f59e0b',
        'bg-emerald-500': '#10b981',
        'bg-violet-500': '#8b5cf6',
      }
      return `${colorMap[seg.color] || '#6366f1'} ${start}% ${offset}%`
    })
    .join(', ')

  return (
    <div className="flex items-center gap-6">
      <div
        className="relative h-28 w-28 shrink-0 rounded-full"
        style={{
          background: `conic-gradient(${gradient})`,
        }}
      >
        <div className="absolute inset-3 flex flex-col items-center justify-center rounded-full bg-white">
          <span className="text-xl font-bold text-slate-900">{total}</span>
          <span className="text-[10px] text-slate-400">total</span>
        </div>
      </div>
      <ul className="space-y-2">
        {segments.map((seg) => (
          <li key={seg.label} className="flex items-center gap-2 text-sm">
            <span className={`h-2.5 w-2.5 rounded-full ${seg.color}`} />
            <span className="text-slate-600">{seg.label}</span>
            <span className="font-semibold text-slate-900">{seg.value}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
