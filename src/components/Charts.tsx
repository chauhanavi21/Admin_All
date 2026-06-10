interface BarChartProps {
  data: { label: string; value: number }[]
  color?: string
}

export function BarChart({ data, color = 'bg-chrome-blue' }: BarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1)

  return (
    <div className="flex h-40 items-end justify-between gap-2">
      {data.map((item) => (
        <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex w-full flex-1 items-end">
            <div
              className={`w-full rounded-t-lg ${color} transition-all duration-500 hover:brightness-110`}
              style={{ height: `${(item.value / max) * 100}%`, minHeight: '8px' }}
            />
          </div>
          <span className="text-[10px] font-medium text-muted-dim">{item.label}</span>
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
        'bg-chrome-blue': '#4285f4',
        'bg-chrome-yellow': '#fbbc04',
        'bg-chrome-green': '#34a853',
        'bg-chrome-red': '#ea4335',
      }
      return `${colorMap[seg.color] || '#4285f4'} ${start}% ${offset}%`
    })
    .join(', ')

  return (
    <div className="flex items-center gap-6">
      <div
        className="relative h-28 w-28 shrink-0 rounded-full shadow-lg shadow-black/30"
        style={{
          background: `conic-gradient(${gradient})`,
        }}
      >
        <div className="absolute inset-3 flex flex-col items-center justify-center rounded-full bg-surface">
          <span className="text-xl font-bold text-text">{total}</span>
          <span className="text-[10px] text-muted-dim">total</span>
        </div>
      </div>
      <ul className="space-y-2">
        {segments.map((seg) => (
          <li key={seg.label} className="flex items-center gap-2 text-sm">
            <span className={`h-2.5 w-2.5 rounded-full ${seg.color}`} />
            <span className="text-muted">{seg.label}</span>
            <span className="font-semibold text-text">{seg.value}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
