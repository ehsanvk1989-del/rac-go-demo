import { useNavigate } from 'react-router-dom'
import { Icon } from './Icons'

/* Sticky top bar used on detail/flow screens. */
export function ScreenHeader({ title, subtitle, onBack, right }) {
  const navigate = useNavigate()
  return (
    <header className="sticky top-0 z-20 flex items-center gap-2 border-b border-line bg-white/95 px-3 py-3 backdrop-blur">
      <button
        onClick={onBack || (() => navigate(-1))}
        className="flex h-9 w-9 items-center justify-center rounded-full text-ink hover:bg-slate-100 active:scale-95"
        aria-label="Back"
      >
        <Icon.chevronLeft size={22} />
      </button>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-bold leading-tight text-ink">{title}</p>
        {subtitle && <p className="truncate text-[11px] text-muted">{subtitle}</p>}
      </div>
      {right}
    </header>
  )
}

/* Big page heading for the primary tab screens. */
export function TabHeader({ eyebrow, title, children }) {
  return (
    <div className="px-4 pt-5">
      {eyebrow && (
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-500">{eyebrow}</p>
      )}
      <h1 className="mt-1 text-[22px] font-extrabold leading-tight tracking-tight text-ink">{title}</h1>
      {children}
    </div>
  )
}
