import { useOutletContext } from 'react-router-dom'
import { useStore } from '../../store/StoreContext'
import { itemById } from '../../data/mockData'
import { Badge } from '../../components/ui'
import { Icon } from '../../components/Icons'
import { Ring } from '../../components/Charts'
import { computeStats, providerItems } from '../../lib/providerStats'
import { ProviderHeading, SectionCard } from './parts'

const VERIFICATIONS = [
  { label: 'Government ID', icon: Icon.id, done: true },
  { label: 'Business registration', icon: Icon.doc, done: true },
  { label: 'Bank / payout account', icon: Icon.cash, done: true },
  { label: 'Insurance policy', icon: Icon.shield, done: true },
  { label: 'Address verification', icon: Icon.pin, done: true },
]

const SAFETY_CHECKS = [
  { label: 'Sanitisation log up to date', ok: true },
  { label: 'Car seats within expiry window', ok: true },
  { label: 'Annual safety inspection', ok: true },
  { label: 'Linen wash certification', ok: false },
]

const REVIEWS = [
  { name: 'Hannah · UK', rating: 5, text: 'Immaculate stroller waiting at arrivals. Handoff photos were a lovely touch.', item: 'i1' },
  { name: 'Lukas · DE', rating: 5, text: 'Responsive, professional, and the gear was spotless. Will book again.', item: 'i8' },
  { name: 'Sofia · ES', rating: 4, text: 'Slight delay to the hotel but kept us updated the whole time.', item: 'i3' },
]

export default function TrustCenter() {
  const { provider } = useOutletContext()
  const { items, bookings } = useStore()
  const s = computeStats(bookings, items, provider.id)
  const myItems = providerItems(items, provider.id)

  const verifiedCount = VERIFICATIONS.filter((v) => v.done).length
  const trustScore = 88 + (provider.id === 'p4' ? 6 : 0)

  // One recall alert wired to a car-seat in the fleet, if any.
  const recallItem = myItems.find((i) => i.category === 'car-seat')

  return (
    <div className="space-y-4 px-4 pb-6 pt-4">
      <ProviderHeading sub="Verification, safety & reputation">Trust center</ProviderHeading>

      {/* Score hero */}
      <div className="flex items-center gap-4 rounded-2xl bg-gradient-to-br from-brand-600 to-teal-500 p-4 text-white">
        <Ring value={trustScore} size={84} stroke={9} color="stroke-white" label={`${trustScore}`} sublabel="score" />
        <div>
          <p className="text-[15px] font-extrabold">Provider score</p>
          <p className="mt-0.5 text-[12px] text-white/85">Excellent standing — top 10% on RentACot Go.</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {provider.badges.slice(0, 3).map((b) => (
              <span key={b} className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold backdrop-blur">{b}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Verification status */}
      <SectionCard title="Verification status" action={<Badge tone="teal">{verifiedCount}/{VERIFICATIONS.length}</Badge>}>
        <div className="space-y-1">
          {VERIFICATIONS.map((v) => {
            const IconCmp = v.icon
            return (
              <div key={v.label} className="flex items-center gap-3 py-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600"><IconCmp size={16} /></span>
                <span className="flex-1 text-[12.5px] font-semibold text-ink">{v.label}</span>
                {v.done ? (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-teal-600"><Icon.checkCircle size={15} /> Verified</span>
                ) : (
                  <span className="text-[11px] font-bold text-amber-700">Pending</span>
                )}
              </div>
            )
          })}
        </div>
      </SectionCard>

      {/* Safety checks */}
      <SectionCard title="Safety checks">
        <div className="space-y-1">
          {SAFETY_CHECKS.map((c) => (
            <div key={c.label} className="flex items-center gap-3 py-2">
              <span className={`flex h-7 w-7 items-center justify-center rounded-full ${c.ok ? 'bg-teal-50 text-teal-600' : 'bg-amber-50 text-amber-700'}`}>
                {c.ok ? <Icon.check size={14} /> : <Icon.alert size={14} />}
              </span>
              <span className="flex-1 text-[12.5px] text-ink">{c.label}</span>
              <span className={`text-[11px] font-bold ${c.ok ? 'text-teal-600' : 'text-amber-700'}`}>{c.ok ? 'OK' : 'Action'}</span>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Recall alert */}
      <SectionCard title="Equipment recall alerts">
        {recallItem ? (
          <div className="flex items-start gap-3 rounded-xl bg-amber-50 p-3 ring-1 ring-amber-100">
            <Icon.alert size={20} className="shrink-0 text-amber-700" />
            <div>
              <p className="text-[12.5px] font-bold text-ink">Manufacturer advisory · {recallItem.name}</p>
              <p className="mt-0.5 text-[11.5px] text-amber-700">
                Check harness batch numbers against advisory #CY-2026-04. Tap to acknowledge once inspected.
              </p>
              <button className="mt-2 rounded-lg bg-amber-600 px-3 py-1.5 text-[11.5px] font-bold text-white">Acknowledge</button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-xl bg-teal-50 p-3 text-[12.5px] font-semibold text-teal-700">
            <Icon.checkCircle size={17} /> No active recalls for your fleet.
          </div>
        )}
      </SectionCard>

      {/* Reviews */}
      <SectionCard title="Customer reviews" action={<span className="flex items-center gap-1 text-[12px] font-bold text-ink"><Icon.star size={13} className="text-amber-soft" /> {provider.rating} ({provider.reviews})</span>}>
        <div className="space-y-2.5">
          {REVIEWS.map((r) => (
            <div key={r.name} className="rounded-xl bg-slate-50 p-3">
              <div className="flex items-center justify-between">
                <p className="text-[12.5px] font-bold text-ink">{r.name}</p>
                <span className="flex">{Array.from({ length: r.rating }).map((_, i) => <Icon.star key={i} size={12} className="text-amber-soft" />)}</span>
              </div>
              <p className="mt-1 text-[12px] text-ink-soft">{r.text}</p>
              <p className="mt-1 text-[10.5px] text-muted">on {itemById(r.item)?.name}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}
