/*
  Tiny dependency-free SVG charts for the provider analytics screens.
  All are responsive (viewBox + preserveAspectRatio) and use the brand palette.
*/

export function BarChart({ data, height = 120, valuePrefix = '', accent = 'fill-brand-500' }) {
  const max = Math.max(1, ...data.map((d) => d.value))
  const barW = 100 / data.length
  return (
    <div>
      <svg viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" className="w-full" style={{ height }}>
        {data.map((d, i) => {
          const h = (d.value / max) * (height - 22)
          const x = i * barW
          const highlight = d.highlight
          return (
            <g key={i}>
              <rect
                x={x + barW * 0.2}
                y={height - 16 - h}
                width={barW * 0.6}
                height={Math.max(2, h)}
                rx="2"
                className={highlight ? 'fill-teal-500' : accent}
                opacity={highlight ? 1 : 0.85}
              />
            </g>
          )
        })}
      </svg>
      <div className="mt-1 flex justify-between px-0.5">
        {data.map((d, i) => (
          <span key={i} className="flex-1 text-center text-[9px] font-semibold text-muted">
            {d.label}
          </span>
        ))}
      </div>
    </div>
  )
}

export function AreaChart({ data, height = 130, prefix = '€' }) {
  const max = Math.max(1, ...data.map((d) => d.value))
  const w = 100
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * w
    const y = height - 20 - (d.value / max) * (height - 30)
    return [x, y]
  })
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')
  const area = `${line} L${w},${height - 20} L0,${height - 20} Z`
  const peak = data.reduce((m, d, i) => (d.value > data[m].value ? i : m), 0)
  return (
    <div>
      <svg viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" className="w-full" style={{ height }}>
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(43,118,230)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="rgb(43,118,230)" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#areaFill)" />
        <path d={line} fill="none" className="stroke-brand-500" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
        <circle cx={pts[peak][0]} cy={pts[peak][1]} r="2.4" className="fill-teal-500" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="mt-1 flex justify-between px-0.5">
        {data.map((d, i) => (
          <span key={i} className="flex-1 text-center text-[9px] font-semibold text-muted">{d.label}</span>
        ))}
      </div>
    </div>
  )
}

/* Circular progress ring for rates / utilization. */
export function Ring({ value, size = 72, stroke = 8, color = 'stroke-brand-500', label, sublabel }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const off = c - (value / 100) * c
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} className="stroke-slate-100" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          className={color}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={off}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-[14px] font-extrabold leading-none text-ink">{label ?? `${value}%`}</p>
        {sublabel && <p className="text-[8px] font-semibold text-muted">{sublabel}</p>}
      </div>
    </div>
  )
}

/* Demand heatmap: weeks × days grid of intensity 0-4. */
export function Heatmap({ grid, days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] }) {
  const tones = ['bg-slate-100', 'bg-brand-100', 'bg-brand-200', 'bg-brand-400', 'bg-brand-600']
  return (
    <div>
      <div className="flex gap-1.5">
        <div className="flex flex-col gap-1.5 pr-1">
          {grid.map((_, r) => (
            <span key={r} className="flex h-5 items-center text-[8px] font-semibold text-muted">W{r + 1}</span>
          ))}
        </div>
        <div className="flex-1">
          <div className="grid grid-cols-7 gap-1.5">
            {grid.flatMap((row, r) =>
              row.map((v, c) => (
                <div key={`${r}-${c}`} className={`aspect-square rounded-[4px] ${tones[v]}`} title={`Intensity ${v}`} />
              )),
            )}
          </div>
          <div className="mt-1.5 grid grid-cols-7 gap-1.5">
            {days.map((d, i) => (
              <span key={i} className="text-center text-[8px] font-semibold text-muted">{d}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-end gap-1 text-[9px] text-muted">
        Less
        {tones.map((t, i) => <span key={i} className={`h-2.5 w-2.5 rounded-[3px] ${t}`} />)}
        More
      </div>
    </div>
  )
}
