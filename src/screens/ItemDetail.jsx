import { useNavigate, useParams } from 'react-router-dom'
import { itemById, providerById, locationById, categoryById, DELIVERY_OPTIONS, LOCATIONS } from '../data/mockData'
import { GearImage, Stars, Badge, ProviderAvatar, eur } from '../components/ui'
import { Icon, CategoryIcon } from '../components/Icons'
import { ScreenHeader } from '../components/ScreenHeader'

const BADGE_ICON = {
  'ID Verified': Icon.id,
  'Insured Fleet': Icon.shield,
  'Sanitised+': Icon.spark,
  'Top Rated': Icon.star,
}

const REVIEWS = [
  { name: 'Emma · UK', rating: 5, text: 'Spotless stroller waiting at arrivals. Handoff photos gave us real peace of mind.' },
  { name: 'Lukas · DE', rating: 5, text: 'Provider messaged before the flight landed. Super smooth, returned with zero fuss.' },
  { name: 'Sofia · ES', rating: 4, text: 'Great condition, delivery to the hotel was 20 min late but they kept us updated.' },
]

export default function ItemDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const item = itemById(id)

  if (!item) {
    return (
      <div className="p-8 text-center text-muted">
        Item not found. <button onClick={() => navigate('/search')} className="font-semibold text-brand-600">Back to search</button>
      </div>
    )
  }

  const provider = providerById(item.providerId)
  const cat = categoryById(item.category)
  const serveLocs = item.serves.map((s) => locationById(s) || LOCATIONS.find((l) => l.id === s)).filter(Boolean)

  return (
    <div>
      <ScreenHeader title={cat?.label || 'Item'} subtitle={provider.name} />

      <GearImage item={item} className="mx-4 mt-3 h-56" />

      <div className="px-4 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-[19px] font-extrabold leading-tight text-ink">{item.name}</h1>
            <p className="mt-1 flex items-center gap-2 text-[12px] text-muted">
              <Stars value={item.rating} count={item.reviews} /> · {item.ageRange}
            </p>
          </div>
          {item.instantBook && <Badge tone="brand" icon={Icon.bolt}>Instant</Badge>}
        </div>

        <p className="mt-3 text-[13px] leading-relaxed text-ink-soft">{item.blurb}</p>

        {/* Quick specs */}
        <div className="mt-4 grid grid-cols-3 gap-2.5">
          <Spec icon={Icon.scale} label="Weight" value={`${item.weightKg} kg`} />
          <Spec icon={Icon.users} label="Age" value={item.ageRange} />
          <Spec icon={Icon.spark} label="Cleaned" value="Sanitised" />
        </div>

        {/* Feature list */}
        <div className="mt-4 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-line/70">
          <p className="mb-2.5 text-[13px] font-bold text-ink">What's included</p>
          <ul className="grid grid-cols-2 gap-y-2.5">
            {item.specs.map((s) => (
              <li key={s} className="flex items-center gap-2 text-[12.5px] text-ink-soft">
                <Icon.checkCircle size={16} className="text-teal-500" /> {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Provider card */}
        <button
          onClick={() => navigate('/provider')}
          className="mt-4 flex w-full items-center gap-3 rounded-2xl bg-white p-4 text-left shadow-soft ring-1 ring-line/70 active:scale-[0.99]"
        >
          <ProviderAvatar provider={provider} size={48} />
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 text-[14px] font-bold text-ink">
              {provider.name}
            </p>
            <p className="text-[11.5px] text-muted">
              {provider.rating}★ · {provider.reviews} reviews · responds in ~{provider.responseMins} min
            </p>
          </div>
          <Icon.chevron size={18} className="text-muted" />
        </button>

        {/* Trust badges */}
        <div className="mt-3 flex flex-wrap gap-2">
          {provider.badges.map((b) => (
            <Badge key={b} tone="teal" icon={BADGE_ICON[b] || Icon.check}>{b}</Badge>
          ))}
        </div>

        {/* Delivery options */}
        <h2 className="mt-6 text-[14px] font-bold text-ink">Delivery & handoff</h2>
        <div className="mt-2 space-y-2.5">
          {DELIVERY_OPTIONS.map((d) => (
            <div key={d.id} className="flex items-start gap-3 rounded-2xl bg-white p-3.5 shadow-soft ring-1 ring-line/70">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                {d.id === 'airport' ? <Icon.plane size={18} /> : d.id === 'hotel' ? <Icon.truck size={18} /> : <Icon.pin size={18} />}
              </span>
              <div className="flex-1">
                <p className="text-[13px] font-bold text-ink">{d.label}</p>
                <p className="text-[11.5px] text-muted">{d.desc}</p>
                <p className="mt-0.5 text-[11px] font-semibold text-teal-600">{d.eta}</p>
              </div>
              <span className="text-[13px] font-bold text-ink">{d.fee ? eur(d.fee) : 'Free'}</span>
            </div>
          ))}
        </div>

        {/* Coverage / geo-fence */}
        <div className="mt-4 rounded-2xl bg-gradient-to-br from-brand-50 to-teal-50 p-4 ring-1 ring-brand-100">
          <p className="flex items-center gap-2 text-[13px] font-bold text-ink">
            <Icon.globe size={17} className="text-brand-600" /> Geo-fenced availability
          </p>
          <p className="mt-1 text-[11.5px] text-ink-soft">
            This item is available for handoff within these zones only:
          </p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {serveLocs.map((l) => (
              <span key={l.id} className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-brand-700">
                {l.type === 'airport' ? <Icon.plane size={12} /> : <Icon.pin size={12} />} {l.name}
              </span>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <h2 className="mt-6 flex items-center justify-between text-[14px] font-bold text-ink">
          Traveller reviews
          <Stars value={item.rating} count={item.reviews} />
        </h2>
        <div className="mt-2 space-y-2.5">
          {REVIEWS.map((r) => (
            <div key={r.name} className="rounded-2xl bg-white p-3.5 shadow-soft ring-1 ring-line/70">
              <div className="flex items-center justify-between">
                <p className="text-[12.5px] font-bold text-ink">{r.name}</p>
                <span className="flex">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Icon.star key={i} size={12} className="text-amber-soft" />
                  ))}
                </span>
              </div>
              <p className="mt-1 text-[12px] leading-snug text-ink-soft">{r.text}</p>
            </div>
          ))}
        </div>

        {/* Price breakdown preview */}
        <div className="mt-6 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-line/70">
          <Row label={`${eur(item.pricePerDay)} × 7 days`} value={eur(item.pricePerDay * 7)} />
          <Row label="7-day bundle saving" value={`–${eur(item.pricePerDay * 7 - item.weekPrice)}`} tone="teal" />
          <Row label="Refundable deposit (held in escrow)" value={eur(item.deposit)} muted />
          <div className="my-2 border-t border-line" />
          <Row label="Weekly rate" value={eur(item.weekPrice)} bold />
        </div>
      </div>

      {/* Sticky book bar */}
      <div className="sticky bottom-0 z-20 mt-5 border-t border-line bg-white/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-[18px] font-extrabold leading-none text-ink">
              {eur(item.weekPrice)}<span className="text-[12px] font-medium text-muted"> /week</span>
            </p>
            <p className="text-[11px] text-muted">+ {eur(item.deposit)} refundable deposit</p>
          </div>
          <button
            onClick={() => navigate(`/book/${item.id}`)}
            className="ml-auto flex-1 rounded-2xl bg-brand-600 py-3.5 text-center text-[14px] font-bold text-white active:scale-[0.99]"
          >
            {item.instantBook ? 'Reserve instantly' : 'Request to book'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Spec({ icon: IconCmp, label, value }) {
  return (
    <div className="rounded-2xl bg-white p-3 text-center shadow-soft ring-1 ring-line/70">
      <IconCmp size={18} className="mx-auto text-brand-500" />
      <p className="mt-1 text-[10px] uppercase tracking-wide text-muted">{label}</p>
      <p className="text-[12px] font-bold text-ink">{value}</p>
    </div>
  )
}

function Row({ label, value, bold, muted, tone }) {
  return (
    <div className="flex items-center justify-between py-1 text-[12.5px]">
      <span className={muted ? 'text-muted' : 'text-ink-soft'}>{label}</span>
      <span className={`font-${bold ? 'extrabold' : 'semibold'} ${tone === 'teal' ? 'text-teal-600' : 'text-ink'}`}>{value}</span>
    </div>
  )
}
