import { useNavigate } from 'react-router-dom'
import { providerById, locationById } from '../data/mockData'
import { GearImage, Stars, eur } from './ui'
import { Icon } from './Icons'

export default function ItemCard({ item, variant = 'grid' }) {
  const navigate = useNavigate()
  const provider = providerById(item.providerId)
  const firstLoc = locationById(item.serves[0])

  if (variant === 'rail') {
    return (
      <button
        onClick={() => navigate(`/item/${item.id}`)}
        className="w-44 shrink-0 overflow-hidden rounded-2xl bg-white text-left shadow-soft ring-1 ring-line/70 active:scale-[0.98] transition"
      >
        <GearImage item={item} className="h-28 w-full" rounded="rounded-none" />
        <div className="p-3">
          <p className="line-clamp-1 text-[13px] font-bold text-ink">{item.name}</p>
          <p className="mt-0.5 line-clamp-1 text-[11px] text-muted">{provider.name}</p>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[13px] font-bold text-brand-700">
              {eur(item.pricePerDay)}<span className="text-[11px] font-medium text-muted">/day</span>
            </span>
            <Stars value={item.rating} size={12} />
          </div>
        </div>
      </button>
    )
  }

  return (
    <button
      onClick={() => navigate(`/item/${item.id}`)}
      className="flex w-full overflow-hidden rounded-2xl bg-white text-left shadow-soft ring-1 ring-line/70 active:scale-[0.99] transition"
    >
      <GearImage item={item} className="w-28 shrink-0 self-stretch" rounded="rounded-none" overlay={false} />
      <div className="flex flex-1 flex-col p-3">
        <div className="flex items-start justify-between gap-2">
          <p className="line-clamp-2 text-[13.5px] font-bold leading-tight text-ink">{item.name}</p>
          {item.instantBook && (
            <span className="flex shrink-0 items-center gap-0.5 rounded-full bg-brand-50 px-1.5 py-0.5 text-[9.5px] font-bold text-brand-700">
              <Icon.bolt size={11} /> Instant
            </span>
          )}
        </div>
        <p className="mt-1 flex items-center gap-1 text-[11px] text-muted">
          <Icon.pin size={12} /> {firstLoc?.name} · {provider.name}
        </p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <Stars value={item.rating} count={item.reviews} size={12} />
          <span className="text-[14px] font-bold text-brand-700">
            {eur(item.pricePerDay)}<span className="text-[11px] font-medium text-muted">/day</span>
          </span>
        </div>
      </div>
    </button>
  )
}
