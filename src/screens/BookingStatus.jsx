import { useNavigate, useParams } from 'react-router-dom'
import { useStore } from '../store/StoreContext'
import { itemById, providerById, locationById, DELIVERY_OPTIONS } from '../data/mockData'
import { GearImage, StateChip, ProviderAvatar, eur, Badge } from '../components/ui'
import { Icon } from '../components/Icons'
import { ScreenHeader } from '../components/ScreenHeader'
import { LifecycleSteps, HistoryLog } from '../components/Lifecycle'
import { PhotoPair } from '../components/HandoffPhotos'
import TransitionActions from '../components/TransitionActions'
import { STATES } from '../lib/bookingMachine'

export default function BookingStatus() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { bookings } = useStore()
  const booking = bookings.find((b) => b.id === id)

  if (!booking) {
    return (
      <div className="p-8 text-center text-muted">
        Booking not found. <button onClick={() => navigate('/bookings')} className="font-semibold text-brand-600">All bookings</button>
      </div>
    )
  }

  const item = itemById(booking.itemId)
  const provider = providerById(booking.providerId)
  const loc = locationById(booking.locationId)
  const delivery = DELIVERY_OPTIONS.find((d) => d.id === booking.delivery)
  const showPhotos = [STATES.ACTIVE_RENTAL, STATES.RETURN_INSPECTION, STATES.COMPLETED, STATES.DISPUTED].includes(booking.state) || booking.handoffPhotos

  return (
    <div>
      <ScreenHeader title={booking.id} subtitle="Booking status" onBack={() => navigate('/bookings')} />

      {/* Status hero */}
      <div className="px-4 pt-4">
        <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-teal-500 p-4 text-white">
          <div className="flex items-center justify-between">
            <StateChip state={booking.state} size="lg" />
            <span className="text-[11px] font-semibold text-white/85">{booking.days} days</span>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <GearImage item={item} className="h-14 w-14" rounded="rounded-xl" label={false} />
            <div className="min-w-0">
              <p className="truncate text-[14px] font-bold">{item.name}</p>
              <p className="text-[11.5px] text-white/85">{booking.startDate} → {booking.endDate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Live coordination line for in-delivery */}
      {booking.state === STATES.IN_DELIVERY && (
        <div className="mx-4 mt-3 flex items-center gap-3 rounded-2xl bg-brand-50 p-3.5 ring-1 ring-brand-100">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-brand-600">
            <Icon.truck size={18} />
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 animate-pulse rounded-full bg-brand-500 ring-2 ring-white" />
          </span>
          <div>
            <p className="text-[12.5px] font-bold text-ink">Driver en route to {delivery?.label.toLowerCase()}</p>
            <p className="text-[11px] text-muted">
              {booking.flightNo ? `Synced to flight ${booking.flightNo}` : booking.hotel} · ETA in ~25 min
            </p>
          </div>
        </div>
      )}

      {/* Delivery details */}
      <div className="mx-4 mt-3 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-line/70">
        <p className="mb-2.5 text-[13px] font-bold text-ink">Delivery & handoff</p>
        <DetailRow icon={delivery?.id === 'airport' ? Icon.plane : Icon.truck} label={delivery?.label} value={delivery?.fee ? eur(delivery.fee) : 'Free'} />
        <DetailRow icon={Icon.pin} label="Zone" value={loc?.name} />
        {booking.flightNo && <DetailRow icon={Icon.plane} label="Flight" value={booking.flightNo} />}
        {booking.hotel && <DetailRow icon={Icon.box} label="Hotel" value={booking.hotel} />}
        <DetailRow icon={Icon.users} label="Traveller" value={booking.customer} />
      </div>

      {/* Provider */}
      <div className="mx-4 mt-3 flex items-center gap-3 rounded-2xl bg-white p-3.5 shadow-soft ring-1 ring-line/70">
        <ProviderAvatar provider={provider} size={42} />
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-bold text-ink">{provider.name}</p>
          <p className="text-[11px] text-muted">{provider.rating}★ · responds in ~{provider.responseMins} min</p>
        </div>
        <button className="rounded-full bg-brand-50 px-3 py-2 text-[12px] font-semibold text-brand-700">Message</button>
      </div>

      {/* Escrow strip */}
      <div className="mx-4 mt-3 flex items-center gap-3 rounded-2xl bg-teal-50 p-3.5 ring-1 ring-teal-100">
        <Icon.lock size={20} className="text-teal-600" />
        <div className="flex-1">
          <p className="text-[12.5px] font-bold text-ink">Escrow protected</p>
          <p className="text-[11px] text-ink-soft">
            {booking.state === STATES.COMPLETED
              ? 'Funds released to provider · deposit refunded'
              : 'Funds + deposit held safely until verified handoff & return'}
          </p>
        </div>
        <Badge tone="teal">{eur(item.deposit)} held</Badge>
      </div>

      {/* Handoff photos */}
      {showPhotos && (
        <div className="mx-4 mt-3 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-line/70">
          <p className="mb-2.5 flex items-center gap-2 text-[13px] font-bold text-ink">
            <Icon.camera size={16} className="text-brand-600" /> Handoff verification photos
          </p>
          <PhotoPair
            before={{ label: 'Handoff', tone: 'from-teal-100 to-brand-200', note: 'Captured at delivery' }}
            after={{
              label: booking.state === STATES.COMPLETED ? 'Return · approved' : 'Return',
              tone: booking.state === STATES.DISPUTED ? 'from-rose-100 to-amber-100' : 'from-brand-100 to-teal-100',
              note: booking.state === STATES.ACTIVE_RENTAL ? 'Captured at return inspection' : 'On file',
            }}
          />
        </div>
      )}

      {/* Lifecycle steps */}
      <div className="mx-4 mt-3 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-line/70">
        <p className="mb-3 text-[13px] font-bold text-ink">Rental lifecycle</p>
        <LifecycleSteps state={booking.state} />
      </div>

      {/* Actions */}
      <div className="mx-4 mt-3">
        <p className="mb-2 text-[13px] font-bold text-ink">Next steps</p>
        <TransitionActions booking={booking} />
        <p className="mt-2 text-center text-[10.5px] text-muted">
          Demo: any actor's action is enabled here so you can drive the full state machine.
        </p>
      </div>

      {/* History */}
      <div className="mx-4 mt-3 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-line/70">
        <p className="mb-3 text-[13px] font-bold text-ink">Audit timeline</p>
        <HistoryLog history={booking.history} />
      </div>
    </div>
  )
}

function DetailRow({ icon: IconCmp, label, value }) {
  return (
    <div className="flex items-center gap-2.5 py-1.5 text-[12.5px]">
      <IconCmp size={16} className="text-muted" />
      <span className="text-ink-soft">{label}</span>
      <span className="ml-auto font-semibold text-ink">{value}</span>
    </div>
  )
}
