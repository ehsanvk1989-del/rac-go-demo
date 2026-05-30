import { useOutletContext } from 'react-router-dom'
import { useStore } from '../../store/StoreContext'
import { itemById } from '../../data/mockData'
import { eur } from '../../components/ui'
import { Icon } from '../../components/Icons'
import { AreaChart } from '../../components/Charts'
import { computeStats, revenueSeries } from '../../lib/providerStats'
import { STATES } from '../../lib/bookingMachine'
import { ProviderHeading, SectionCard } from './parts'

const PAYOUTS = [
  { id: 'PO-3391', date: '24 May 2026', amount: 412, status: 'Paid' },
  { id: 'PO-3380', date: '17 May 2026', amount: 388, status: 'Paid' },
  { id: 'PO-3369', date: '10 May 2026', amount: 503, status: 'Paid' },
  { id: 'PO-3357', date: '03 May 2026', amount: 274, status: 'Paid' },
]

export default function Earnings() {
  const { provider } = useOutletContext()
  const { bookings, items } = useStore()
  const s = computeStats(bookings, items, provider.id)
  const series = revenueSeries(s.monthlyEarnings)

  const upcoming = s.completed.map((b) => ({
    id: b.id,
    name: itemById(b.itemId)?.name,
    amount: Math.round(itemById(b.itemId).weekPrice * 0.85),
  }))

  return (
    <div className="space-y-4 px-4 pb-6 pt-4">
      <ProviderHeading sub="Revenue, fees, escrow & payouts">Earnings center</ProviderHeading>

      {/* Hero balance */}
      <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-teal-600 to-brand-600 p-4 text-white">
        <p className="text-[12px] font-semibold text-white/80">Available to withdraw</p>
        <p className="mt-1 text-[30px] font-extrabold leading-none">{eur(s.pendingPayout)}</p>
        <p className="mt-1.5 text-[11px] text-white/80">Next automatic payout 31 May 2026</p>
        <div className="mt-3 flex gap-2">
          <button className="flex-1 rounded-xl bg-white py-2.5 text-[12.5px] font-bold text-teal-700 active:scale-95">Withdraw now</button>
          <button className="flex-1 rounded-xl bg-white/15 py-2.5 text-[12.5px] font-bold backdrop-blur">Statements</button>
        </div>
      </div>

      {/* Revenue chart */}
      <SectionCard title="Revenue" action={<span className="text-[11px] font-semibold text-teal-600">+18% MoM</span>}>
        <AreaChart data={series} height={140} />
      </SectionCard>

      {/* Breakdown */}
      <SectionCard title="This month breakdown">
        <Line icon={Icon.wallet} label="Booking revenue (gross)" value={eur(s.grossEarnings + 1500)} tone="ink" />
        <Line icon={Icon.tag} label="Platform fees (15%)" value={`– ${eur(s.platformFees + 225)}`} tone="rose" />
        <Line icon={Icon.lock} label="Held in escrow" value={eur(s.escrowHeld)} tone="amber" />
        <div className="my-2 border-t border-line" />
        <Line icon={Icon.cash} label="Net earnings" value={eur(s.monthlyEarnings)} tone="teal" bold />
      </SectionCard>

      {/* Upcoming payouts */}
      <SectionCard title="Upcoming payouts">
        {upcoming.length === 0 ? (
          <p className="py-1 text-center text-[12.5px] text-muted">No payouts pending release.</p>
        ) : (
          <div className="space-y-2">
            {upcoming.map((u) => (
              <div key={u.id} className="flex items-center gap-3 rounded-xl bg-slate-50 p-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100 text-teal-600"><Icon.clock size={15} /></span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12.5px] font-bold text-ink">{u.name}</p>
                  <p className="text-[10.5px] text-muted">{u.id} · releases after return inspection</p>
                </div>
                <span className="text-[13px] font-extrabold text-teal-600">{eur(u.amount)}</span>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {/* Historical payouts */}
      <SectionCard title="Payout history" action={<span className="text-[11px] font-semibold text-brand-600">Export</span>}>
        <div className="space-y-1">
          {PAYOUTS.map((p) => (
            <div key={p.id} className="flex items-center gap-3 py-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-600"><Icon.check size={15} /></span>
              <div className="flex-1">
                <p className="text-[12.5px] font-bold text-ink">{p.id}</p>
                <p className="text-[10.5px] text-muted">{p.date}</p>
              </div>
              <span className="text-[13px] font-extrabold text-ink">{eur(p.amount)}</span>
              <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-600">{p.status}</span>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}

function Line({ icon: IconCmp, label, value, tone, bold }) {
  const tones = { ink: 'text-ink-soft', rose: 'text-rose-500', amber: 'text-amber-700', teal: 'text-teal-600' }
  return (
    <div className="flex items-center gap-2.5 py-1.5">
      <IconCmp size={16} className={tones[tone]} />
      <span className={`flex-1 text-[12.5px] ${bold ? 'font-bold text-ink' : 'text-ink-soft'}`}>{label}</span>
      <span className={`text-[13px] ${bold ? 'font-extrabold' : 'font-bold'} ${tone === 'teal' ? 'text-teal-600' : tone === 'rose' ? 'text-rose-500' : 'text-ink'}`}>{value}</span>
    </div>
  )
}
