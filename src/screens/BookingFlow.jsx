import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { itemById, providerById, locationById, DELIVERY_OPTIONS, LOCATIONS } from '../data/mockData'
import { useStore } from '../store/StoreContext'
import { GearImage, eur } from '../components/ui'
import { Icon } from '../components/Icons'
import { ScreenHeader } from '../components/ScreenHeader'
import { STATES } from '../lib/bookingMachine'

const STEPS = ['Dates', 'Delivery', 'Identity', 'Payment']

export default function BookingFlow() {
  const { id } = useParams()
  const navigate = useNavigate()
  const store = useStore()
  const item = itemById(id)
  const provider = item ? providerById(item.providerId) : null

  const [step, setStep] = useState(0)
  const [days, setDays] = useState(7)
  const [locId, setLocId] = useState(item?.serves[0] || 'lca')
  const [deliveryId, setDeliveryId] = useState('airport')
  const [flightNo, setFlightNo] = useState('')
  const [hotel, setHotel] = useState('')
  const [idChecked, setIdChecked] = useState(false)
  const [agree, setAgree] = useState(false)

  const delivery = DELIVERY_OPTIONS.find((d) => d.id === deliveryId)
  const serveLocs = useMemo(
    () => (item ? item.serves.map((s) => locationById(s) || LOCATIONS.find((l) => l.id === s)).filter(Boolean) : []),
    [item],
  )

  if (!item) {
    return <div className="p-8 text-center text-muted">Item not found.</div>
  }

  const rentalCost = days >= 7 ? item.weekPrice + Math.max(0, days - 7) * item.pricePerDay : days * item.pricePerDay
  const total = rentalCost + (delivery?.fee || 0)
  const startDate = '2026-06-02'
  const endDate = '2026-06-0' + (2 + (days % 8))

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1))
  const back = () => (step === 0 ? navigate(-1) : setStep((s) => s - 1))

  const canContinue =
    (step === 0 && days > 0 && locId) ||
    (step === 1 && deliveryId && (deliveryId !== 'airport' || true)) ||
    (step === 2 && idChecked) ||
    (step === 3 && agree)

  const confirm = () => {
    // Build the draft, commit it, then drive the machine through the first
    // three lifecycle states — exactly what "booking" means here.
    const newId = `BK-${Math.floor(4900 + Math.random() * 99)}`
    store.startDraft({
      itemId: item.id,
      providerId: item.providerId,
      locationId: locId,
      delivery: deliveryId,
      days,
      startDate,
      endDate,
      flightNo: deliveryId === 'airport' ? flightNo || 'TBA' : null,
      hotel: deliveryId === 'hotel' ? hotel || 'Hotel TBA' : null,
    })
    store.commitDraft(newId)
    store.transition(newId, STATES.PENDING_HOLD, 'customer')
    store.transition(newId, STATES.PAYMENT_AUTHORIZED, 'customer')
    navigate(`/bookings/${newId}`, { replace: true })
  }

  return (
    <div className="flex min-h-full flex-col">
      <ScreenHeader title="Book this item" subtitle={item.name} onBack={back} />

      {/* Stepper */}
      <div className="flex items-center gap-1.5 px-4 pt-4">
        {STEPS.map((s, i) => (
          <div key={s} className="flex flex-1 flex-col items-center gap-1">
            <div className={`h-1.5 w-full rounded-full ${i <= step ? 'bg-brand-500' : 'bg-line'}`} />
            <span className={`text-[10px] font-semibold ${i === step ? 'text-brand-600' : 'text-muted'}`}>{s}</span>
          </div>
        ))}
      </div>

      {/* Item recap */}
      <div className="mx-4 mt-4 flex items-center gap-3 rounded-2xl bg-white p-3 shadow-soft ring-1 ring-line/70">
        <GearImage item={item} className="h-14 w-14" rounded="rounded-xl" label={false} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-bold text-ink">{item.name}</p>
          <p className="text-[11px] text-muted">{provider.name} · {eur(item.pricePerDay)}/day</p>
        </div>
      </div>

      <div className="flex-1 px-4 pt-5">
        {step === 0 && (
          <div className="space-y-5">
            <Field label="Rental length">
              <div className="grid grid-cols-4 gap-2">
                {[3, 5, 7, 14].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDays(d)}
                    className={`rounded-xl py-3 text-[13px] font-bold ${days === d ? 'bg-brand-600 text-white' : 'bg-white text-ink-soft ring-1 ring-line'}`}
                  >
                    {d}d
                  </button>
                ))}
              </div>
              <p className="mt-2 flex items-center gap-1.5 text-[11.5px] text-muted">
                <Icon.calendar size={14} /> {startDate} → check-out · {days} days
              </p>
            </Field>

            <Field label="Pickup / handoff zone" hint="Geo-fenced to this provider's coverage">
              <div className="space-y-2">
                {serveLocs.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setLocId(l.id)}
                    className={`flex w-full items-center gap-3 rounded-xl p-3 text-left ring-1 ${
                      locId === l.id ? 'bg-brand-50 ring-brand-300' : 'bg-white ring-line'
                    }`}
                  >
                    <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${locId === l.id ? 'bg-brand-100 text-brand-600' : 'bg-slate-100 text-muted'}`}>
                      {l.type === 'airport' ? <Icon.plane size={17} /> : <Icon.pin size={17} />}
                    </span>
                    <span className="flex-1 text-[13px] font-semibold text-ink">{l.name}</span>
                    {locId === l.id && <Icon.checkCircle size={18} className="text-brand-600" />}
                  </button>
                ))}
              </div>
            </Field>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <Field label="How would you like it delivered?">
              <div className="space-y-2.5">
                {DELIVERY_OPTIONS.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setDeliveryId(d.id)}
                    className={`flex w-full items-start gap-3 rounded-xl p-3.5 text-left ring-1 ${
                      deliveryId === d.id ? 'bg-brand-50 ring-brand-300' : 'bg-white ring-line'
                    }`}
                  >
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${deliveryId === d.id ? 'bg-brand-100 text-brand-600' : 'bg-slate-100 text-muted'}`}>
                      {d.id === 'airport' ? <Icon.plane size={17} /> : d.id === 'hotel' ? <Icon.truck size={17} /> : <Icon.pin size={17} />}
                    </span>
                    <span className="flex-1">
                      <span className="block text-[13px] font-bold text-ink">{d.label}</span>
                      <span className="block text-[11px] text-muted">{d.desc}</span>
                      <span className="mt-0.5 block text-[11px] font-semibold text-teal-600">{d.eta}</span>
                    </span>
                    <span className="text-[13px] font-bold text-ink">{d.fee ? eur(d.fee) : 'Free'}</span>
                  </button>
                ))}
              </div>
            </Field>

            {deliveryId === 'airport' && (
              <Field label="Flight number" hint="We time the handoff to your landing">
                <input
                  value={flightNo}
                  onChange={(e) => setFlightNo(e.target.value.toUpperCase())}
                  placeholder="e.g. BA2654"
                  className="w-full rounded-xl bg-white px-3.5 py-3 text-[13px] font-medium text-ink ring-1 ring-line outline-none focus:ring-brand-300"
                />
              </Field>
            )}
            {deliveryId === 'hotel' && (
              <Field label="Hotel / villa">
                <input
                  value={hotel}
                  onChange={(e) => setHotel(e.target.value)}
                  placeholder="e.g. Amathus Beach Hotel"
                  className="w-full rounded-xl bg-white px-3.5 py-3 text-[13px] font-medium text-ink ring-1 ring-line outline-none focus:ring-brand-300"
                />
              </Field>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-gradient-to-br from-brand-50 to-teal-50 p-4 ring-1 ring-brand-100">
              <p className="flex items-center gap-2 text-[14px] font-bold text-ink">
                <Icon.id size={18} className="text-brand-600" /> Identity verification
              </p>
              <p className="mt-1 text-[12px] text-ink-soft">
                Both travellers and providers are ID-verified. This is matched at the door during handoff to keep the marketplace safe.
              </p>
            </div>

            <button
              onClick={() => setIdChecked((v) => !v)}
              className={`flex w-full items-center gap-3 rounded-2xl border-2 border-dashed p-5 ${
                idChecked ? 'border-teal-400 bg-teal-50' : 'border-line bg-white'
              }`}
            >
              <span className={`flex h-12 w-12 items-center justify-center rounded-full ${idChecked ? 'bg-teal-500 text-white' : 'bg-slate-100 text-muted'}`}>
                {idChecked ? <Icon.check size={24} /> : <Icon.camera size={22} />}
              </span>
              <span className="text-left">
                <span className="block text-[13px] font-bold text-ink">
                  {idChecked ? 'ID document captured' : 'Scan ID document'}
                </span>
                <span className="block text-[11px] text-muted">
                  {idChecked ? 'Passport · verified (demo)' : 'Tap to simulate a document scan'}
                </span>
              </span>
            </button>

            <ul className="space-y-2 text-[12px] text-ink-soft">
              {['Encrypted & never shared with the provider', 'Liveness check on handoff', 'Required before escrow capture'].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Icon.shield size={15} className="text-teal-500" /> {t}
                </li>
              ))}
            </ul>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-white p-4 shadow-soft ring-1 ring-line/70">
              <p className="text-[13px] font-bold text-ink">Price summary</p>
              <div className="mt-2.5 space-y-1.5">
                <SumRow label={`Rental · ${days} days`} value={eur(rentalCost)} />
                <SumRow label={delivery.label} value={delivery.fee ? eur(delivery.fee) : 'Free'} />
                <SumRow label="Refundable deposit (escrow)" value={eur(item.deposit)} muted />
                <div className="my-1.5 border-t border-line" />
                <SumRow label="Authorized today" value={eur(total + item.deposit)} bold />
                <p className="text-[11px] text-muted">Captured only after a verified handoff. {eur(item.deposit)} deposit released after return inspection.</p>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-4 shadow-soft ring-1 ring-line/70">
              <p className="flex items-center gap-2 text-[13px] font-bold text-ink">
                <Icon.lock size={16} className="text-brand-600" /> Escrow payment (demo)
              </p>
              <div className="mt-3 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                <Icon.wallet size={20} className="text-ink-soft" />
                <span className="text-[13px] font-semibold text-ink">•••• •••• •••• 4242</span>
                <span className="ml-auto text-[11px] text-muted">No real charge</span>
              </div>
            </div>

            <button
              onClick={() => setAgree((v) => !v)}
              className="flex w-full items-start gap-3 text-left"
            >
              <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${agree ? 'bg-brand-600 text-white' : 'bg-white ring-1 ring-line'}`}>
                {agree && <Icon.check size={14} />}
              </span>
              <span className="text-[11.5px] leading-snug text-ink-soft">
                I agree to the rental terms, escrow hold and photo-verified handoff/return process.
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Footer action */}
      <div className="sticky bottom-0 border-t border-line bg-white/95 px-4 py-3 backdrop-blur">
        {step < STEPS.length - 1 ? (
          <button
            disabled={!canContinue}
            onClick={next}
            className="w-full rounded-2xl bg-brand-600 py-3.5 text-[14px] font-bold text-white transition active:scale-[0.99] disabled:opacity-40"
          >
            Continue
          </button>
        ) : (
          <button
            disabled={!agree}
            onClick={confirm}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 py-3.5 text-[14px] font-bold text-white transition active:scale-[0.99] disabled:opacity-40"
          >
            <Icon.lock size={17} /> Authorize {eur(total + item.deposit)} in escrow
          </button>
        )}
      </div>
    </div>
  )
}

function Field({ label, hint, children }) {
  return (
    <div>
      <p className="text-[13px] font-bold text-ink">{label}</p>
      {hint && <p className="mb-2 mt-0.5 text-[11px] text-muted">{hint}</p>}
      <div className={hint ? '' : 'mt-2'}>{children}</div>
    </div>
  )
}

function SumRow({ label, value, bold, muted }) {
  return (
    <div className="flex items-center justify-between text-[12.5px]">
      <span className={muted ? 'text-muted' : 'text-ink-soft'}>{label}</span>
      <span className={`${bold ? 'text-[15px] font-extrabold' : 'font-semibold'} text-ink`}>{value}</span>
    </div>
  )
}
