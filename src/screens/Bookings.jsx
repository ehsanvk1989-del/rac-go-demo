import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/StoreContext'
import { itemById, providerById, locationById } from '../data/mockData'
import { GearImage, StateChip, eur } from '../components/ui'
import { Icon } from '../components/Icons'
import { ProgressRail } from '../components/Lifecycle'
import { TabHeader } from '../components/ScreenHeader'
import { isTerminal } from '../lib/bookingMachine'

const FILTERS = [
  { id: 'active', label: 'Active' },
  { id: 'all', label: 'All' },
  { id: 'completed', label: 'Past' },
]

export default function Bookings() {
  const navigate = useNavigate()
  const { bookings } = useStore()
  const [filter, setFilter] = useState('active')

  const list = bookings.filter((b) => {
    if (filter === 'all') return true
    if (filter === 'completed') return isTerminal(b.state)
    return !isTerminal(b.state)
  })

  return (
    <div>
      <TabHeader eyebrow="Your trips" title="Bookings">
        <p className="mt-1 text-[13px] text-ink-soft">Track every rental through its full lifecycle.</p>
      </TabHeader>

      <div className="no-scrollbar mt-4 flex gap-2 px-4">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`rounded-full px-4 py-2 text-[12.5px] font-semibold ${
              filter === f.id ? 'bg-ink text-white' : 'bg-white text-ink-soft ring-1 ring-line'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-3 px-4 pt-4">
        {list.map((b) => {
          const item = itemById(b.itemId)
          const provider = providerById(b.providerId)
          const loc = locationById(b.locationId)
          return (
            <button
              key={b.id}
              onClick={() => navigate(`/bookings/${b.id}`)}
              className="block w-full overflow-hidden rounded-2xl bg-white text-left shadow-soft ring-1 ring-line/70 active:scale-[0.99] transition"
            >
              <div className="flex gap-3 p-3">
                <GearImage item={item} className="h-16 w-16" rounded="rounded-xl" label={false} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-[13.5px] font-bold text-ink">{item.name}</p>
                    {b.isYours && <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[9.5px] font-bold text-brand-700">You</span>}
                  </div>
                  <p className="truncate text-[11px] text-muted">{b.id} · {provider.name}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted">
                    <Icon.pin size={12} /> {loc?.name} · {b.days} days
                  </p>
                </div>
              </div>
              <div className="px-3 pb-3">
                <div className="mb-2 flex items-center justify-between">
                  <StateChip state={b.state} />
                  <span className="text-[12px] font-bold text-brand-700">{eur(item.weekPrice)}</span>
                </div>
                <ProgressRail state={b.state} />
              </div>
            </button>
          )
        })}
        {list.length === 0 && (
          <div className="rounded-2xl bg-white p-8 text-center shadow-soft ring-1 ring-line/70">
            <Icon.bookings size={28} className="mx-auto text-muted" />
            <p className="mt-2 text-[13px] font-semibold text-ink">Nothing here yet</p>
            <button onClick={() => navigate('/search')} className="mt-1 text-[12px] font-semibold text-brand-600">Browse the marketplace</button>
          </div>
        )}
      </div>
    </div>
  )
}
