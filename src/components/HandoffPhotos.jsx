import { Icon } from './Icons'

/* Before/after photo placeholder pair used in handoff & disputes. */
export function PhotoPair({ before, after }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <PhotoTile {...before} fallbackLabel="Handoff photo" />
      <PhotoTile {...after} fallbackLabel="Return photo" />
    </div>
  )
}

export function PhotoTile({ label, tone = 'from-teal-100 to-brand-200', note, fallbackLabel }) {
  return (
    <div className="overflow-hidden rounded-xl bg-white ring-1 ring-line/70">
      <div className={`relative flex h-24 items-center justify-center bg-gradient-to-br ${tone}`}>
        <Icon.camera size={26} className="text-white/80" />
        <span className="absolute bottom-1.5 left-1.5 rounded-md bg-white/85 px-1.5 py-0.5 text-[9px] font-bold text-ink-soft">
          {label || fallbackLabel}
        </span>
      </div>
      {note && <p className="px-2 py-1.5 text-[10px] leading-tight text-muted">{note}</p>}
    </div>
  )
}
