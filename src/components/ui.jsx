import { CATEGORY_GRADIENT, categoryById } from '../data/mockData'
import { CategoryIcon, Icon } from './Icons'
import { STATE_STYLES } from '../lib/bookingMachine'

export const eur = (n) => `€${n}`

/*
  Gradient "photo" placeholder for an item, branded by category.

  `overlay` controls the floating category chip + "Instant" pill. These are
  sized for large images (hero / cards) and would overflow small thumbnails,
  so thumbnails pass overlay={false} and instead show a clean centered icon
  that scales with the box.
*/
export function GearImage({ item, className = '', rounded = 'rounded-2xl', label = true, overlay = true }) {
  const grad = CATEGORY_GRADIENT[item.category] || 'from-brand-100 to-brand-300'
  const cat = categoryById(item.category)
  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br ${grad} ${rounded} ${className}`}
    >
      {overlay ? (
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.18]">
          <CategoryIcon id={item.category} size={120} className="text-white" />
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-white/85">
          <CategoryIcon id={item.category} className="h-1/2 w-1/2" />
        </div>
      )}

      {overlay && (
        <>
          <div className="absolute left-2.5 top-2.5 flex max-w-[calc(100%-1.25rem)] items-center gap-1.5 rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-semibold text-ink-soft backdrop-blur">
            <CategoryIcon id={item.category} size={14} className="shrink-0 text-brand-600" />
            {label && <span className="truncate">{cat?.label || 'Gear'}</span>}
          </div>
          {item.instantBook && (
            <div className="absolute right-2.5 top-2.5 flex items-center gap-1 rounded-full bg-ink/80 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur">
              <Icon.bolt size={12} /> Instant
            </div>
          )}
        </>
      )}
    </div>
  )
}

/* Coloured lifecycle state chip. */
export function StateChip({ state, size = 'sm' }) {
  const s = STATE_STYLES[state] || STATE_STYLES.Draft
  const pad = size === 'lg' ? 'px-3 py-1.5 text-xs' : 'px-2.5 py-1 text-[11px]'
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${pad} ${s.chip}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {state}
    </span>
  )
}

export function Badge({ children, tone = 'slate', icon: IconCmp }) {
  const tones = {
    slate: 'bg-slate-100 text-slate-600',
    brand: 'bg-brand-50 text-brand-700',
    teal: 'bg-teal-50 text-teal-600',
    amber: 'bg-amber-50 text-amber-700',
    rose: 'bg-rose-50 text-rose-600',
  }
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${tones[tone]}`}>
      {IconCmp && <IconCmp size={13} />}
      {children}
    </span>
  )
}

export function Stars({ value, count, size = 13 }) {
  return (
    <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-ink">
      <Icon.star size={size} className="text-amber-soft" />
      {value}
      {count != null && <span className="font-medium text-muted">({count})</span>}
    </span>
  )
}

export function SectionTitle({ children, action }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-[15px] font-bold tracking-tight text-ink">{children}</h2>
      {action}
    </div>
  )
}

/* Provider avatar disc with verified tick. */
export function ProviderAvatar({ provider, size = 40 }) {
  const initials = provider.name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <div
        className={`flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br ${provider.avatarTone} text-white font-bold`}
        style={{ fontSize: size * 0.36 }}
      >
        {initials}
      </div>
      {provider.verified && (
        <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-600 text-white ring-2 ring-white">
          <Icon.check size={10} />
        </span>
      )}
    </div>
  )
}

export function Sheet({ open, onClose, title, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
      />
      <div className="animate-sheet relative w-full max-w-md rounded-t-3xl bg-white p-5 pb-7 shadow-float">
        <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-line" />
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-bold text-ink">{title}</h3>
          <button onClick={onClose} className="rounded-full p-1 text-muted hover:bg-slate-100">
            <Icon.close size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
