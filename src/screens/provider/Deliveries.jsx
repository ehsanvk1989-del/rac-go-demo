import { useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { useStore } from '../../store/StoreContext'
import { itemById, locationById } from '../../data/mockData'
import { GearImage } from '../../components/ui'
import { Icon } from '../../components/Icons'
import { STATES } from '../../lib/bookingMachine'
import { providerBookings } from '../../lib/providerStats'
import { ProviderHeading, SectionCard, EmptyState } from './parts'

const TABS = [
  { id: 'deliveries', label: 'Deliveries' },
  { id: 'pickups', label: 'Pickups & returns' },
  { id: 'flights', label: 'Flight tracking' },
]

// Mock flight tracking states for airport deliveries.
const FLIGHTS = {
  BA2654: { status: 'On time', detail: 'Landing 14:25 · Gate A12', tone: 'teal' },
  EW7712: { status: 'Delayed 35m', detail: 'New ETA 15:10', tone: 'amber' },
  VY3810: { status: 'Landed', detail: 'At baggage claim', tone: 'brand' },
  SK1789: { status: 'Scheduled', detail: 'Departs tomorrow 08:40', tone: 'slate' },
}

export default function Deliveries() {
  const navigate = useNavigate()
  const { provider } = useOutletContext()
  const { bookings } = useStore()
  const [tab, setTab] = useState('deliveries')

  const mine = providerBookings(bookings, provider.id)
  const deliveries = mine.filter((b) => [STATES.PROVIDER_ACCEPTED, STATES.IN_DELIVERY].includes(b.state))
  const pickups = mine.filter((b) => [STATES.ACTIVE_RENTAL, STATES.RETURN_INSPECTION].includes(b.state))
  const airportRuns = mine.filter((b) => b.delivery === 'airport' && b.flightNo && !['Completed'].includes(b.state))

  return (
    <div className="space-y-4 px-4 pb-6 pt-4">
      <ProviderHeading sub="Coordinate handoffs across airports & hotels">Delivery management</ProviderHeading>

      <div className="grid grid-cols-3 gap-2">
        <Stat icon={Icon.plane} label="Airport" value={mine.filter((b) => b.delivery === 'airport' && !['Completed', 'Cancelled', 'Declined'].includes(b.state)).length} />
        <Stat icon={Icon.truck} label="Hotel" value={mine.filter((b) => b.delivery === 'hotel' && !['Completed', 'Cancelled', 'Declined'].includes(b.state)).length} />
        <Stat icon={Icon.refresh} label="Returns" value={pickups.length} />
      </div>

      <div className="no-scrollbar flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-full px-3.5 py-2 text-[12px] font-semibold ${tab === t.id ? 'bg-ink text-white' : 'bg-white text-ink-soft ring-1 ring-line'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'deliveries' && (
        <div className="space-y-3">
          {deliveries.length === 0 && <EmptyState icon={Icon.truck} title="No deliveries scheduled" />}
          {deliveries.map((b) => <DeliveryCard key={b.id} b={b} onClick={() => navigate(`/provider/bookings/${b.id}`)} />)}
        </div>
      )}

      {tab === 'pickups' && (
        <div className="space-y-3">
          {pickups.length === 0 && <EmptyState icon={Icon.refresh} title="No upcoming returns" />}
          {pickups.map((b) => {
            const item = itemById(b.itemId)
            const loc = locationById(b.locationId)
            return (
              <button key={b.id} onClick={() => navigate(`/provider/bookings/${b.id}`)} className="flex w-full items-center gap-3 rounded-2xl bg-white p-3 text-left shadow-soft ring-1 ring-line/70">
                <GearImage item={item} className="h-12 w-12" rounded="rounded-lg" overlay={false} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-bold text-ink">{item.name}</p>
                  <p className="text-[11px] text-muted">Return from {b.customer.split(' ')[0]} · {loc?.name}</p>
                </div>
                <span className="rounded-full bg-teal-50 px-2 py-1 text-[10.5px] font-bold text-teal-600">
                  {b.state === STATES.RETURN_INSPECTION ? 'Inspect' : 'Due ' + b.endDate.slice(5)}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {tab === 'flights' && (
        <div className="space-y-3">
          {airportRuns.length === 0 && <EmptyState icon={Icon.plane} title="No airport runs tracked" />}
          {airportRuns.map((b) => {
            const item = itemById(b.itemId)
            const f = FLIGHTS[b.flightNo] || { status: 'Scheduled', detail: '—', tone: 'slate' }
            const toneMap = { teal: 'bg-teal-50 text-teal-600', amber: 'bg-amber-50 text-amber-700', brand: 'bg-brand-50 text-brand-700', slate: 'bg-slate-100 text-slate-500' }
            return (
              <button key={b.id} onClick={() => navigate(`/provider/bookings/${b.id}`)} className="w-full rounded-2xl bg-white p-3.5 text-left shadow-soft ring-1 ring-line/70">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[14px] font-extrabold text-ink">
                    <Icon.plane size={17} className="text-brand-500" /> {b.flightNo}
                  </span>
                  <span className={`rounded-full px-2.5 py-1 text-[10.5px] font-bold ${toneMap[f.tone]}`}>{f.status}</span>
                </div>
                <p className="mt-1 text-[11.5px] text-muted">{f.detail}</p>
                <div className="mt-2.5 flex items-center gap-2 border-t border-line pt-2.5">
                  <GearImage item={item} className="h-9 w-9" rounded="rounded-lg" overlay={false} />
                  <span className="flex-1 truncate text-[12px] font-semibold text-ink">{item.name}</span>
                  <span className="text-[11px] text-muted">{locationById(b.locationId)?.name}</span>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function DeliveryCard({ b, onClick }) {
  const item = itemById(b.itemId)
  const loc = locationById(b.locationId)
  const enRoute = b.state === STATES.IN_DELIVERY
  return (
    <button onClick={onClick} className="w-full rounded-2xl bg-white p-3.5 text-left shadow-soft ring-1 ring-line/70">
      <div className="flex items-center gap-3">
        <span className={`relative flex h-11 w-11 items-center justify-center rounded-xl ${enRoute ? 'bg-brand-100 text-brand-600' : 'bg-slate-100 text-ink-soft'}`}>
          {b.delivery === 'airport' ? <Icon.plane size={19} /> : <Icon.truck size={19} />}
          {enRoute && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 animate-pulse rounded-full bg-brand-500 ring-2 ring-white" />}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-bold text-ink">{item.name}</p>
          <p className="flex items-center gap-1 text-[11px] text-muted">
            <Icon.pin size={11} /> {loc?.name} · {b.flightNo ? `Flight ${b.flightNo}` : b.hotel || 'Hotel'}
          </p>
        </div>
        <span className={`rounded-full px-2 py-1 text-[10.5px] font-bold ${enRoute ? 'bg-brand-50 text-brand-700' : 'bg-amber-50 text-amber-700'}`}>
          {enRoute ? 'En route' : 'To dispatch'}
        </span>
      </div>
    </button>
  )
}

function Stat({ icon: IconCmp, label, value }) {
  return (
    <div className="rounded-2xl bg-white p-3 text-center shadow-soft ring-1 ring-line/70">
      <IconCmp size={18} className="mx-auto text-brand-500" />
      <p className="mt-1.5 text-[16px] font-extrabold leading-none text-ink">{value}</p>
      <p className="mt-1 text-[10px] font-semibold text-muted">{label}</p>
    </div>
  )
}
