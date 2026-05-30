import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useStore } from '../../store/StoreContext'
import { itemById, locationById, DELIVERY_OPTIONS } from '../../data/mockData'
import { GearImage, StateChip, eur } from '../../components/ui'
import { Icon } from '../../components/Icons'
import { ScreenHeader } from '../../components/ScreenHeader'
import { LifecycleSteps, HistoryLog } from '../../components/Lifecycle'
import { PhotoTile } from '../../components/HandoffPhotos'
import TransitionActions from '../../components/TransitionActions'
import { STATES } from '../../lib/bookingMachine'
import { SectionCard } from './parts'

export default function ProviderBookingDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { bookings } = useStore()
  const booking = bookings.find((b) => b.id === id)

  const [handoffShots, setHandoffShots] = useState(booking?.handoffPhotos ? 2 : 0)
  const [returnShots, setReturnShots] = useState(0)
  const [messages, setMessages] = useState([
    { from: 'customer', text: 'Hi! What time works for the handoff?', at: '09:12' },
    { from: 'provider', text: 'Morning! I can be at your hotel for 11:00. Does that work?', at: '09:15' },
  ])
  const [draftMsg, setDraftMsg] = useState('')

  if (!booking) return <div className="p-8 text-center text-muted">Booking not found.</div>

  const item = itemById(booking.itemId)
  const loc = locationById(booking.locationId)
  const delivery = DELIVERY_OPTIONS.find((d) => d.id === booking.delivery)

  const send = () => {
    if (!draftMsg.trim()) return
    setMessages((m) => [...m, { from: 'provider', text: draftMsg.trim(), at: 'now' }])
    setDraftMsg('')
  }

  const showHandoff = [STATES.IN_DELIVERY, STATES.ACTIVE_RENTAL, STATES.RETURN_INSPECTION, STATES.COMPLETED, STATES.DISPUTED].includes(booking.state)
  const showReturn = [STATES.RETURN_INSPECTION, STATES.COMPLETED, STATES.DISPUTED].includes(booking.state)

  return (
    <div className="pb-6">
      <ScreenHeader title={booking.id} subtitle={item.name} onBack={() => navigate('/provider/bookings')} />

      {/* Hero */}
      <div className="px-4 pt-4">
        <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-teal-500 p-4 text-white">
          <div className="flex items-center justify-between">
            <StateChip state={booking.state} size="lg" />
            <span className="text-[11px] font-semibold text-white/85">{eur(item.weekPrice)} · {booking.days}d</span>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <GearImage item={item} className="h-14 w-14" rounded="rounded-xl" overlay={false} />
            <div className="min-w-0">
              <p className="truncate text-[14px] font-bold">{item.name}</p>
              <p className="text-[11.5px] text-white/85">{booking.customer} · {loc?.name}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 pt-4">
        <h2 className="mb-2 text-[14px] font-bold text-ink">Actions</h2>
        <TransitionActions booking={booking} as="provider" />
      </div>

      {/* Customer + message */}
      <div className="px-4 pt-4">
        <SectionCard title="Message traveller">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-50 p-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-brand-700 text-[12px] font-bold">
              {booking.customer.split(' ').map((w) => w[0]).slice(0, 2).join('')}
            </span>
            <div className="flex-1">
              <p className="text-[12.5px] font-bold text-ink">{booking.customer}</p>
              <p className="text-[10.5px] text-muted">{booking.flightNo ? `Flight ${booking.flightNo}` : booking.hotel || 'Verified traveller'}</p>
            </div>
            <Icon.id size={18} className="text-teal-500" />
          </div>

          <div className="max-h-44 space-y-2 overflow-y-auto pr-1">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'provider' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-[12px] ${
                  m.from === 'provider' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-ink'
                }`}>
                  {m.text}
                  <span className={`ml-1.5 text-[9px] ${m.from === 'provider' ? 'text-white/70' : 'text-muted'}`}>{m.at}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-2">
            <input
              value={draftMsg}
              onChange={(e) => setDraftMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Type a message…"
              className="flex-1 rounded-full bg-slate-100 px-3.5 py-2.5 text-[12.5px] text-ink outline-none placeholder:text-muted"
            />
            <button onClick={send} className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-white active:scale-95">
              <Icon.chevron size={18} />
            </button>
          </div>
        </SectionCard>
      </div>

      {/* Handoff photos */}
      {showHandoff && (
        <div className="px-4 pt-4">
          <SectionCard title="Handoff photos" action={<span className="text-[11px] font-semibold text-muted">{handoffShots} uploaded</span>}>
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: handoffShots }).map((_, i) => (
                <PhotoTile key={i} label={`Handoff ${i + 1}`} tone="from-teal-100 to-brand-200" />
              ))}
              <UploadTile onClick={() => setHandoffShots((n) => Math.min(n + 1, 6))} />
            </div>
            <p className="mt-2 text-[11px] text-muted">Capture the item's condition at handoff to protect your deposit claim.</p>
          </SectionCard>
        </div>
      )}

      {/* Return inspection photos */}
      {showReturn && (
        <div className="px-4 pt-4">
          <SectionCard title="Return inspection photos" action={<span className="text-[11px] font-semibold text-muted">{returnShots} uploaded</span>}>
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: returnShots }).map((_, i) => (
                <PhotoTile key={i} label={`Return ${i + 1}`} tone="from-brand-100 to-teal-100" />
              ))}
              <UploadTile onClick={() => setReturnShots((n) => Math.min(n + 1, 6))} />
            </div>
            <p className="mt-2 text-[11px] text-muted">Compare against handoff photos before approving the return.</p>
          </SectionCard>
        </div>
      )}

      {/* Lifecycle + timeline */}
      <div className="px-4 pt-4">
        <SectionCard title="Booking timeline">
          <LifecycleSteps state={booking.state} />
        </SectionCard>
      </div>
      <div className="px-4 pt-4">
        <SectionCard title="Audit log">
          <HistoryLog history={booking.history} />
        </SectionCard>
      </div>
    </div>
  )
}

function UploadTile({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-line bg-slate-50 text-muted active:bg-slate-100"
    >
      <Icon.camera size={20} />
      <span className="text-[10px] font-semibold">Add</span>
    </button>
  )
}
