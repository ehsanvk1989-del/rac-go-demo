import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/StoreContext'
import { PROVIDERS, ITEMS, itemById, locationById } from '../data/mockData'
import { GearImage, StateChip, ProviderAvatar, Badge, eur } from '../components/ui'
import { Icon } from '../components/Icons'
import { TabHeader } from '../components/ScreenHeader'
import TransitionActions from '../components/TransitionActions'
import { transitionsFor, isTerminal, STATES } from '../lib/bookingMachine'

export default function ProviderDashboard() {
  const navigate = useNavigate()
  const { bookings } = useStore()
  const [providerId, setProviderId] = useState('p4')
  const provider = PROVIDERS.find((p) => p.id === providerId)

  const myBookings = bookings.filter((b) => b.providerId === providerId)
  const myItems = ITEMS.filter((i) => i.providerId === providerId)

  // Bookings where the provider has an action to take right now.
  const actionQueue = myBookings.filter((b) =>
    transitionsFor(b.state).some((t) => t.actor === 'provider'),
  )
  const active = myBookings.filter((b) => !isTerminal(b.state))
  const earnings = myBookings
    .filter((b) => [STATES.ACTIVE_RENTAL, STATES.RETURN_INSPECTION, STATES.COMPLETED].includes(b.state))
    .reduce((sum, b) => sum + itemById(b.itemId).weekPrice, 0)
  const pendingPayout = myBookings
    .filter((b) => b.state === STATES.COMPLETED)
    .reduce((sum, b) => sum + itemById(b.itemId).weekPrice, 0)

  return (
    <div>
      <TabHeader eyebrow="Provider console" title="Dashboard">
        <p className="mt-1 text-[13px] text-ink-soft">Manage inventory, accept bookings & coordinate handoffs.</p>
      </TabHeader>

      {/* Provider switcher (demo) */}
      <div className="no-scrollbar mt-4 flex gap-2 px-4">
        {PROVIDERS.map((p) => (
          <button
            key={p.id}
            onClick={() => setProviderId(p.id)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full py-1.5 pl-1.5 pr-3 text-[12px] font-semibold ${
              providerId === p.id ? 'bg-ink text-white' : 'bg-white text-ink-soft ring-1 ring-line'
            }`}
          >
            <ProviderAvatar provider={p} size={22} />
            {p.name.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Provider profile card */}
      <div className="mx-4 mt-4 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-line/70">
        <div className="flex items-center gap-3">
          <ProviderAvatar provider={provider} size={52} />
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-bold text-ink">{provider.name}</p>
            <p className="text-[11.5px] text-muted">{provider.base} · {provider.yearsActive} yrs · {provider.rating}★ ({provider.reviews})</p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {provider.badges.map((b) => (
            <Badge key={b} tone="teal">{b}</Badge>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="mx-4 mt-3 grid grid-cols-4 gap-2.5">
        <Kpi label="Active" value={active.length} icon={Icon.bolt} />
        <Kpi label="To action" value={actionQueue.length} icon={Icon.alert} tone="amber" />
        <Kpi label="Items" value={myItems.length} icon={Icon.box} />
        <Kpi label="Earned" value={eur(earnings)} icon={Icon.wallet} tone="teal" />
      </div>

      {/* Action queue */}
      <section className="px-4 pt-5">
        <h2 className="mb-2.5 flex items-center gap-2 text-[15px] font-bold text-ink">
          <Icon.alert size={17} className="text-amber-soft" /> Needs your action
          {actionQueue.length > 0 && (
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700">{actionQueue.length}</span>
          )}
        </h2>
        {actionQueue.length === 0 ? (
          <div className="rounded-2xl bg-white p-5 text-center text-[12.5px] font-semibold text-muted shadow-soft ring-1 ring-line/70">
            <Icon.checkCircle size={24} className="mx-auto text-teal-500" />
            <p className="mt-1.5">All caught up — nothing waiting.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {actionQueue.map((b) => {
              const item = itemById(b.itemId)
              const loc = locationById(b.locationId)
              return (
                <div key={b.id} className="rounded-2xl bg-white p-3.5 shadow-soft ring-1 ring-line/70">
                  <div className="flex items-center gap-3">
                    <GearImage item={item} className="h-12 w-12" rounded="rounded-lg" label={false} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-bold text-ink">{item.name}</p>
                      <p className="text-[11px] text-muted">{b.id} · {b.customer}</p>
                    </div>
                    <button onClick={() => navigate(`/bookings/${b.id}`)} className="text-muted">
                      <Icon.chevron size={18} />
                    </button>
                  </div>
                  <div className="mt-2.5 flex items-center justify-between">
                    <StateChip state={b.state} />
                    <span className="flex items-center gap-1 text-[11px] text-muted">
                      <Icon.pin size={12} /> {loc?.name}
                    </span>
                  </div>
                  <div className="mt-3">
                    <TransitionActions booking={b} as="provider" />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Inventory */}
      <section className="px-4 pt-6">
        <h2 className="mb-2.5 flex items-center justify-between text-[15px] font-bold text-ink">
          Inventory
          <span className="text-[12px] font-semibold text-brand-600">+ Add item</span>
        </h2>
        <div className="space-y-2.5">
          {myItems.map((i) => {
            const rented = myBookings.some(
              (b) => b.itemId === i.id && [STATES.PROVIDER_ACCEPTED, STATES.IN_DELIVERY, STATES.ACTIVE_RENTAL].includes(b.state),
            )
            return (
              <div key={i.id} className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-soft ring-1 ring-line/70">
                <GearImage item={i} className="h-12 w-12" rounded="rounded-lg" label={false} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-bold text-ink">{i.name}</p>
                  <p className="text-[11px] text-muted">{eur(i.pricePerDay)}/day · {i.reviews} reviews</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[10.5px] font-bold ${rented ? 'bg-amber-50 text-amber-700' : 'bg-teal-50 text-teal-600'}`}>
                  {rented ? 'On rent' : 'Available'}
                </span>
              </div>
            )
          })}
        </div>
      </section>

      {/* Payouts */}
      <section className="px-4 pt-6">
        <div className="rounded-2xl bg-gradient-to-br from-ink to-slate-700 p-4 text-white">
          <p className="text-[12px] font-semibold text-white/80">Escrow payout balance</p>
          <p className="mt-1 text-[26px] font-extrabold">{eur(pendingPayout)}</p>
          <p className="mt-1 text-[11px] text-white/75">
            Released automatically after each return inspection is approved.
          </p>
          <div className="mt-3 flex gap-2">
            <button className="flex-1 rounded-xl bg-white/15 py-2.5 text-[12.5px] font-bold backdrop-blur">Withdraw</button>
            <button className="flex-1 rounded-xl bg-white/15 py-2.5 text-[12.5px] font-bold backdrop-blur">Statements</button>
          </div>
        </div>
      </section>
    </div>
  )
}

function Kpi({ label, value, icon: IconCmp, tone = 'brand' }) {
  const tones = {
    brand: 'text-brand-600 bg-brand-50',
    teal: 'text-teal-600 bg-teal-50',
    amber: 'text-amber-700 bg-amber-50',
  }
  return (
    <div className="rounded-2xl bg-white p-2.5 text-center shadow-soft ring-1 ring-line/70">
      <span className={`mx-auto flex h-8 w-8 items-center justify-center rounded-lg ${tones[tone]}`}>
        <IconCmp size={16} />
      </span>
      <p className="mt-1.5 text-[15px] font-extrabold leading-none text-ink">{value}</p>
      <p className="mt-1 text-[10px] font-semibold text-muted">{label}</p>
    </div>
  )
}
