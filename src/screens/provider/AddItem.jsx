import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store/StoreContext'
import { CATEGORIES, CATEGORY_GRADIENT, DELIVERY_OPTIONS, LOCATIONS, PROVIDERS } from '../../data/mockData'
import { CategoryIcon, Icon } from '../../components/Icons'
import { ScreenHeader } from '../../components/ScreenHeader'
import { eur } from '../../components/ui'

const STEPS = ['Basics', 'Photos', 'Pricing', 'Availability', 'Delivery', 'Verification', 'Review']

export default function AddItem() {
  const navigate = useNavigate()
  const { addItem, activeProviderId } = useStore()
  const provider = PROVIDERS.find((p) => p.id === activeProviderId) || PROVIDERS[0]
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)

  const [form, setForm] = useState({
    title: '',
    category: 'stroller',
    brand: '',
    model: '',
    description: '',
    photos: 1,
    coverIndex: 0,
    pricePerDay: 9,
    weekDiscount: 15,
    monthDiscount: 30,
    deposit: 60,
    seasonalPricing: true,
    blockedNote: '',
    delivery: { hotel: true, airport: true, pickup: true },
    serial: '',
    ownershipProof: false,
    safetyCert: false,
  })
  const set = (patch) => setForm((f) => ({ ...f, ...patch }))

  const weekPrice = Math.round(form.pricePerDay * 7 * (1 - form.weekDiscount / 100))
  const monthPrice = Math.round(form.pricePerDay * 30 * (1 - form.monthDiscount / 100))

  const canNext = () => {
    if (step === 0) return form.title.trim() && form.brand.trim()
    if (step === 2) return form.pricePerDay > 0 && form.deposit >= 0
    if (step === 5) return form.serial.trim() && form.ownershipProof && form.safetyCert
    return true
  }

  const back = () => (step === 0 ? navigate('/provider/inventory') : setStep((s) => s - 1))

  const publish = () => {
    const id = `i${Math.floor(1000 + Math.random() * 9000)}`
    addItem({
      id,
      name: form.title || `${form.brand} ${form.category}`,
      category: form.category,
      providerId: provider.id,
      brand: form.brand,
      model: form.model || '—',
      pricePerDay: Number(form.pricePerDay),
      weekPrice,
      deposit: Number(form.deposit),
      rating: 0,
      reviews: 0,
      ageRange: '0–4 yrs',
      weightKg: 6,
      instantBook: true,
      cleaned: true,
      status: 'active',
      serves: provider.serves,
      specs: ['Freshly added', 'Sanitised', 'Provider-verified'],
      blurb: form.description || 'Newly listed item.',
    })
    setDone(true)
  }

  if (done) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-teal-50 text-teal-600">
          <Icon.checkCircle size={44} />
        </div>
        <h1 className="mt-4 text-[20px] font-extrabold text-ink">Listing published!</h1>
        <p className="mt-1.5 text-[13px] text-ink-soft">
          {form.title || 'Your item'} is now live and bookable across your coverage zones.
        </p>
        <button
          onClick={() => navigate('/provider/inventory')}
          className="mt-6 w-full rounded-2xl bg-brand-600 py-3.5 text-[14px] font-bold text-white active:scale-[0.99]"
        >
          Back to inventory
        </button>
        <button onClick={() => { setDone(false); setStep(0) }} className="mt-2 text-[12.5px] font-semibold text-brand-600">
          Add another item
        </button>
      </div>
    )
  }

  return (
    <div className="flex min-h-full flex-col">
      <ScreenHeader title="Add new item" subtitle={`Step ${step + 1} of ${STEPS.length} · ${STEPS[step]}`} onBack={back} />

      {/* Stepper */}
      <div className="flex items-center gap-1 px-4 pt-4">
        {STEPS.map((s, i) => (
          <div key={s} className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-brand-500' : 'bg-line'}`} />
        ))}
      </div>

      <div className="flex-1 px-4 pt-5">
        {step === 0 && (
          <div className="space-y-4">
            <Field label="Item title">
              <Input value={form.title} onChange={(v) => set({ title: v })} placeholder="e.g. Bugaboo-class Lightweight Stroller" />
            </Field>
            <Field label="Category">
              <div className="grid grid-cols-3 gap-2">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => set({ category: c.id })}
                    className={`flex flex-col items-center gap-1.5 rounded-xl py-3 ring-1 ${
                      form.category === c.id ? 'bg-brand-50 ring-brand-300' : 'bg-white ring-line'
                    }`}
                  >
                    <CategoryIcon id={c.id} size={22} className={form.category === c.id ? 'text-brand-600' : 'text-muted'} />
                    <span className="text-[10.5px] font-semibold text-ink-soft">{c.label}</span>
                  </button>
                ))}
              </div>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Brand"><Input value={form.brand} onChange={(v) => set({ brand: v })} placeholder="Brand" /></Field>
              <Field label="Model"><Input value={form.model} onChange={(v) => set({ model: v })} placeholder="Model" /></Field>
            </div>
            <Field label="Description">
              <textarea
                value={form.description}
                onChange={(e) => set({ description: e.target.value })}
                placeholder="Describe condition, features and what's included…"
                rows={4}
                className="w-full rounded-xl bg-white px-3.5 py-3 text-[13px] text-ink ring-1 ring-line outline-none focus:ring-brand-300"
              />
            </Field>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <Field label="Cover image" hint="Tap a tile to set it as the cover">
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: form.photos }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => set({ coverIndex: i })}
                    className={`relative aspect-square overflow-hidden rounded-xl bg-gradient-to-br ${CATEGORY_GRADIENT[form.category]} ring-2 ${
                      form.coverIndex === i ? 'ring-brand-500' : 'ring-transparent'
                    }`}
                  >
                    <CategoryIcon id={form.category} size={40} className="absolute inset-0 m-auto text-white/80" />
                    {form.coverIndex === i && (
                      <span className="absolute left-1 top-1 rounded-md bg-brand-600 px-1.5 py-0.5 text-[8.5px] font-bold text-white">Cover</span>
                    )}
                  </button>
                ))}
                {form.photos < 6 && (
                  <button
                    onClick={() => set({ photos: form.photos + 1 })}
                    className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-line bg-slate-50 text-muted"
                  >
                    <Icon.upload size={20} />
                    <span className="text-[10px] font-semibold">Upload</span>
                  </button>
                )}
              </div>
            </Field>
            <div className="rounded-xl bg-brand-50 p-3 text-[11.5px] text-brand-700">
              <Icon.camera size={15} className="mr-1 inline" />
              Listings with 4+ clear photos get up to 2× more bookings.
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <Field label="Daily price">
              <Stepper value={form.pricePerDay} onChange={(v) => set({ pricePerDay: v })} prefix="€" step={1} min={1} />
            </Field>
            <Field label="Weekly discount" hint={`7-day price ≈ ${eur(weekPrice)}`}>
              <Chips options={[0, 10, 15, 20]} value={form.weekDiscount} onChange={(v) => set({ weekDiscount: v })} suffix="%" />
            </Field>
            <Field label="Monthly discount" hint={`30-day price ≈ ${eur(monthPrice)}`}>
              <Chips options={[0, 20, 30, 40]} value={form.monthDiscount} onChange={(v) => set({ monthDiscount: v })} suffix="%" />
            </Field>
            <Field label="Security deposit" hint="Held in escrow, refunded after return inspection">
              <Stepper value={form.deposit} onChange={(v) => set({ deposit: v })} prefix="€" step={5} min={0} />
            </Field>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <Field label="Availability">
              <MiniCalendar />
            </Field>
            <Toggle
              label="Seasonal pricing"
              desc="Automatically raise prices in peak summer weeks"
              on={form.seasonalPricing}
              onClick={() => set({ seasonalPricing: !form.seasonalPricing })}
            />
            <Field label="Block out dates" hint="Add a note for maintenance windows">
              <Input value={form.blockedNote} onChange={(v) => set({ blockedNote: v })} placeholder="e.g. Service week 11–12 Jun" />
            </Field>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-3">
            <p className="text-[12.5px] text-ink-soft">Choose how travellers can receive this item.</p>
            {DELIVERY_OPTIONS.map((d) => {
              const key = d.id
              const on = form.delivery[key]
              return (
                <button
                  key={d.id}
                  onClick={() => set({ delivery: { ...form.delivery, [key]: !on } })}
                  className={`flex w-full items-center gap-3 rounded-2xl p-3.5 text-left ring-1 ${
                    on ? 'bg-brand-50 ring-brand-300' : 'bg-white ring-line'
                  }`}
                >
                  <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${on ? 'bg-brand-100 text-brand-600' : 'bg-slate-100 text-muted'}`}>
                    {d.id === 'airport' ? <Icon.plane size={19} /> : d.id === 'hotel' ? <Icon.truck size={19} /> : <Icon.pin size={19} />}
                  </span>
                  <span className="flex-1">
                    <span className="block text-[13px] font-bold text-ink">{d.label}</span>
                    <span className="block text-[11px] text-muted">{d.desc} · {d.fee ? eur(d.fee) : 'Free'}</span>
                  </span>
                  <span className={`flex h-6 w-6 items-center justify-center rounded-full ${on ? 'bg-brand-600 text-white' : 'bg-slate-200 text-transparent'}`}>
                    <Icon.check size={14} />
                  </span>
                </button>
              )
            })}
            <div className="rounded-xl bg-slate-50 p-3 text-[11.5px] text-ink-soft">
              <Icon.globe size={14} className="mr-1 inline text-brand-500" />
              Coverage zones: {provider.serves.map((s) => LOCATIONS.find((l) => l.id === s)?.name).filter(Boolean).join(', ')}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <Field label="Serial number" hint="Used for equipment recall tracking">
              <Input value={form.serial} onChange={(v) => set({ serial: v })} placeholder="e.g. BG-2024-118734" />
            </Field>
            <UploadProof
              icon={Icon.doc}
              label="Proof of ownership"
              desc="Receipt or invoice"
              done={form.ownershipProof}
              onClick={() => set({ ownershipProof: !form.ownershipProof })}
            />
            <UploadProof
              icon={Icon.shield}
              label="Safety certification"
              desc="EN 1888 / i-Size / equivalent"
              done={form.safetyCert}
              onClick={() => set({ safetyCert: !form.safetyCert })}
            />
            <div className="rounded-xl bg-amber-50 p-3 text-[11.5px] text-amber-700">
              <Icon.alert size={14} className="mr-1 inline" />
              Verified items earn a trust badge and rank higher in search.
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-4">
            <div className="overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-line/70">
              <div className={`relative flex h-40 items-center justify-center bg-gradient-to-br ${CATEGORY_GRADIENT[form.category]}`}>
                <CategoryIcon id={form.category} size={64} className="text-white/85" />
              </div>
              <div className="p-4">
                <p className="text-[15px] font-extrabold text-ink">{form.title || `${form.brand} item`}</p>
                <p className="text-[11.5px] text-muted">{form.brand} {form.model !== '—' ? `· ${form.model}` : ''}</p>
                <p className="mt-2 text-[12.5px] text-ink-soft">{form.description || 'No description provided.'}</p>
              </div>
            </div>
            <ReviewRow label="Daily price" value={eur(form.pricePerDay)} />
            <ReviewRow label="Weekly price" value={`${eur(weekPrice)} (-${form.weekDiscount}%)`} />
            <ReviewRow label="Monthly price" value={`${eur(monthPrice)} (-${form.monthDiscount}%)`} />
            <ReviewRow label="Security deposit" value={eur(form.deposit)} />
            <ReviewRow label="Delivery" value={Object.entries(form.delivery).filter(([, v]) => v).map(([k]) => k).join(', ') || 'None'} />
            <ReviewRow label="Verification" value={form.ownershipProof && form.safetyCert ? 'Complete' : 'Incomplete'} ok={form.ownershipProof && form.safetyCert} />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 border-t border-line bg-white/95 px-4 py-3 backdrop-blur">
        {step < STEPS.length - 1 ? (
          <button
            disabled={!canNext()}
            onClick={() => setStep((s) => s + 1)}
            className="w-full rounded-2xl bg-brand-600 py-3.5 text-[14px] font-bold text-white transition active:scale-[0.99] disabled:opacity-40"
          >
            Continue
          </button>
        ) : (
          <button
            onClick={publish}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 py-3.5 text-[14px] font-bold text-white active:scale-[0.99]"
          >
            <Icon.check size={18} /> Publish listing
          </button>
        )}
      </div>
    </div>
  )
}

/* ---- small inputs ---- */
function Field({ label, hint, children }) {
  return (
    <div>
      <p className="text-[13px] font-bold text-ink">{label}</p>
      {hint && <p className="mb-2 mt-0.5 text-[11px] text-muted">{hint}</p>}
      <div className={hint ? '' : 'mt-2'}>{children}</div>
    </div>
  )
}

function Input({ value, onChange, placeholder }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-xl bg-white px-3.5 py-3 text-[13px] text-ink ring-1 ring-line outline-none focus:ring-brand-300"
    />
  )
}

function Stepper({ value, onChange, prefix = '', step = 1, min = 0 }) {
  return (
    <div className="flex items-center gap-3">
      <button onClick={() => onChange(Math.max(min, value - step))} className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-ink active:scale-95">
        <Icon.close size={16} className="rotate-45" />
      </button>
      <div className="flex-1 rounded-xl bg-white py-3 text-center text-[16px] font-extrabold text-ink ring-1 ring-line">
        {prefix}{value}
      </div>
      <button onClick={() => onChange(value + step)} className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white active:scale-95">
        <Icon.plus size={16} />
      </button>
    </div>
  )
}

function Chips({ options, value, onChange, suffix = '' }) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={`rounded-xl py-2.5 text-[13px] font-bold ${value === o ? 'bg-brand-600 text-white' : 'bg-white text-ink-soft ring-1 ring-line'}`}
        >
          {o}{suffix}
        </button>
      ))}
    </div>
  )
}

function Toggle({ label, desc, on, onClick }) {
  return (
    <button onClick={onClick} className="flex w-full items-center justify-between rounded-xl bg-white px-3.5 py-3 ring-1 ring-line">
      <span className="text-left">
        <span className="block text-[13px] font-bold text-ink">{label}</span>
        <span className="block text-[11px] text-muted">{desc}</span>
      </span>
      <span className={`relative h-6 w-10 rounded-full transition ${on ? 'bg-brand-500' : 'bg-line'}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${on ? 'left-[1.15rem]' : 'left-0.5'}`} />
      </span>
    </button>
  )
}

function UploadProof({ icon: IconCmp, label, desc, done, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-2xl border-2 border-dashed p-4 ${done ? 'border-teal-400 bg-teal-50' : 'border-line bg-white'}`}
    >
      <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${done ? 'bg-teal-500 text-white' : 'bg-slate-100 text-muted'}`}>
        {done ? <Icon.check size={20} /> : <IconCmp size={20} />}
      </span>
      <span className="flex-1 text-left">
        <span className="block text-[13px] font-bold text-ink">{label}</span>
        <span className="block text-[11px] text-muted">{done ? 'Uploaded (demo)' : desc}</span>
      </span>
      <Icon.upload size={18} className="text-muted" />
    </button>
  )
}

function ReviewRow({ label, value, ok }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-white px-3.5 py-3 ring-1 ring-line">
      <span className="text-[12.5px] text-ink-soft">{label}</span>
      <span className={`text-[12.5px] font-bold capitalize ${ok === false ? 'text-amber-700' : ok ? 'text-teal-600' : 'text-ink'}`}>{value}</span>
    </div>
  )
}

function MiniCalendar() {
  const days = Array.from({ length: 30 }, (_, i) => i + 1)
  const blocked = [11, 12]
  const booked = [3, 4, 5, 16, 17]
  return (
    <div className="rounded-xl bg-white p-3 ring-1 ring-line">
      <p className="mb-2 text-[11px] font-semibold text-muted">June 2026</p>
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((d) => {
          const isBlocked = blocked.includes(d)
          const isBooked = booked.includes(d)
          return (
            <div
              key={d}
              className={`flex aspect-square items-center justify-center rounded-md text-[10.5px] font-semibold ${
                isBlocked ? 'bg-slate-300 text-white' : isBooked ? 'bg-brand-500 text-white' : 'bg-teal-50 text-teal-700'
              }`}
            >
              {d}
            </div>
          )
        })}
      </div>
      <div className="mt-2.5 flex gap-3 text-[10px] text-muted">
        <Legend c="bg-teal-50" t="Available" /><Legend c="bg-brand-500" t="Booked" /><Legend c="bg-slate-300" t="Blocked" />
      </div>
    </div>
  )
}

function Legend({ c, t }) {
  return <span className="flex items-center gap-1"><span className={`h-2.5 w-2.5 rounded-[3px] ${c}`} /> {t}</span>
}
