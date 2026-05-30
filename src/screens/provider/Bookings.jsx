import { useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { useStore } from '../../store/StoreContext'
import { itemById, locationById } from '../../data/mockData'
import { GearImage, StateChip, eur } from '../../components/ui'
import { Icon } from '../../components/Icons'
import { ProgressRail } from '../../components/Lifecycle'
import { transitionsFor, isTerminal, STATES } from '../../lib/bookingMachine'
import { computeStats } from '../../lib/providerStats'
import { ProviderHeading, EmptyState } from './parts'

const FILTERS = [
  { id: 'requests', label: 'Requests' },
  { id: 'active', label: 'Active' },
  { id: 'all', label: 'All' },
  { id: 'past', label: 'Past' },
]

export default function ProviderBookings() {
  const navigate = useNavigate()
  const { provider } = useOutletContext()
  const { bookings } = useStore()
  const [filter, setFilter] = useState('requests')
  const { mine } = computeStats(bookings, [], provider.id)

  const list = mine.filter((b) => {
    if (filter === 'all') return true
    if (filter === 'past') return isTerminal(b.state)
    if (filter === 'requests') return b.state === STATES.PAYMENT_AUTHORIZED
    return !isTerminal(b.state) && b.state !== STATES.PAYMENT_AUTHORIZED
  })

  const requestCount = mine.filter((b) => b.state === STATES.PAYMENT_AUTHORIZED).length

  return (
    <div>
      <ProviderHeading sub="Manage requests, deliveries & returns">Bookings</ProviderHeading>

      <div className="no-scrollbar mt-3 flex gap-2 px-4">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`relative rounded-full px-4 py-2 text-[12.5px] font-semibold ${
              filter === f.id ? 'bg-ink text-white' : 'bg-white text-ink-soft ring-1 ring-line'
            }`}
          >
            {f.label}
            {f.id === 'requests' && requestCount > 0 && (
              <span className="ml-1.5 rounded-full bg-amber-soft px-1.5 text-[10px] font-bold text-white">{requestCount}</span>
            )}
          </button>
        ))}
      </div>

      <div className="space-y-3 px-4 pb-6 pt-4">
        {list.length === 0 && <EmptyState icon={Icon.bookings} title="Nothing here" hint="No bookings in this view yet." />}
        {list.map((b) => {
          const item = itemById(b.itemId)
          const loc = locationById(b.locationId)
          const hasAction = transitionsFor(b.state).some((t) => t.actor === 'provider')
          return (
            <button
              key={b.id}
              onClick={() => navigate(`/provider/bookings/${b.id}`)}
              className="block w-full overflow-hidden rounded-2xl bg-white text-left shadow-soft ring-1 ring-line/70 active:scale-[0.99]"
            >
              <div className="flex gap-3 p-3">
                <GearImage item={item} className="h-16 w-16" rounded="rounded-xl" overlay={false} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-[13.5px] font-bold text-ink">{item.name}</p>
                    {hasAction && <span className="h-2 w-2 shrink-0 rounded-full bg-amber-soft" />}
                  </div>
                  <p className="truncate text-[11px] text-muted">{b.id} · {b.customer}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted">
                    <Icon.pin size={12} /> {loc?.name} · {b.days} days · {eur(item.weekPrice)}
                  </p>
                </div>
              </div>
              <div className="px-3 pb-3">
                <div className="mb-2 flex items-center justify-between">
                  <StateChip state={b.state} />
                  {hasAction && <span className="text-[11px] font-bold text-amber-700">Action needed →</span>}
                </div>
                <ProgressRail state={b.state} />
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
