import { Icon } from '../../components/Icons'

const TONES = {
  brand: 'text-brand-600 bg-brand-50',
  teal: 'text-teal-600 bg-teal-50',
  amber: 'text-amber-700 bg-amber-50',
  rose: 'text-rose-600 bg-rose-50',
  ink: 'text-ink bg-slate-100',
}

export function KpiCard({ icon: IconCmp, label, value, sub, tone = 'brand', delta }) {
  return (
    <div className="rounded-2xl bg-white p-3.5 shadow-soft ring-1 ring-line/70">
      <div className="flex items-center justify-between">
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${TONES[tone]}`}>
          <IconCmp size={18} />
        </span>
        {delta != null && (
          <span className={`flex items-center gap-0.5 text-[10.5px] font-bold ${delta >= 0 ? 'text-teal-600' : 'text-rose-500'}`}>
            <Icon.trend size={12} className={delta >= 0 ? '' : 'rotate-180'} />
            {delta >= 0 ? '+' : ''}{delta}%
          </span>
        )}
      </div>
      <p className="mt-2.5 text-[20px] font-extrabold leading-none text-ink">{value}</p>
      <p className="mt-1 text-[11.5px] font-semibold text-ink-soft">{label}</p>
      {sub && <p className="text-[10.5px] text-muted">{sub}</p>}
    </div>
  )
}

export function SectionCard({ title, action, children, className = '' }) {
  return (
    <section className={`rounded-2xl bg-white p-4 shadow-soft ring-1 ring-line/70 ${className}`}>
      {(title || action) && (
        <div className="mb-3 flex items-center justify-between">
          {title && <h2 className="text-[14px] font-bold text-ink">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  )
}

export function ProviderHeading({ children, sub }) {
  return (
    <div className="px-4 pt-4">
      <h1 className="text-[20px] font-extrabold tracking-tight text-ink">{children}</h1>
      {sub && <p className="mt-0.5 text-[12.5px] text-ink-soft">{sub}</p>}
    </div>
  )
}

export function EmptyState({ icon: IconCmp = Icon.box, title, hint }) {
  return (
    <div className="rounded-2xl bg-white p-7 text-center shadow-soft ring-1 ring-line/70">
      <IconCmp size={26} className="mx-auto text-muted" />
      <p className="mt-2 text-[13px] font-semibold text-ink">{title}</p>
      {hint && <p className="mt-1 text-[12px] text-muted">{hint}</p>}
    </div>
  )
}

export function StatusDot({ status }) {
  const map = {
    active: { c: 'bg-teal-500', t: 'text-teal-600', l: 'Active' },
    paused: { c: 'bg-amber-soft', t: 'text-amber-700', l: 'Paused' },
    archived: { c: 'bg-slate-400', t: 'text-slate-500', l: 'Archived' },
  }
  const s = map[status] || map.active
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2 py-1 text-[10.5px] font-bold ${s.t}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.c}`} /> {s.l}
    </span>
  )
}
