import { useStore } from '../store/StoreContext'
import { transitionsFor } from '../lib/bookingMachine'
import { Icon } from './Icons'

const ACTOR_LABEL = {
  customer: 'Traveller',
  provider: 'Provider',
  admin: 'Admin',
  system: 'System',
}

/*
  Renders the valid next transitions for a booking's current state.
  `as` restricts which actor's actions are shown (e.g. provider dashboard
  only shows provider/system actions). Omit to show all (admin/demo view).
*/
export default function TransitionActions({ booking, as }) {
  const { transition } = useStore()
  let options = transitionsFor(booking.state)
  if (as) options = options.filter((o) => o.actor === as || o.actor === 'system')

  if (options.length === 0) {
    return (
      <div className="rounded-2xl bg-slate-50 p-4 text-center text-[12.5px] font-semibold text-muted">
        {booking.state} · no further actions
      </div>
    )
  }

  return (
    <div className="space-y-2.5">
      {options.map((o) => (
        <button
          key={o.to}
          onClick={() => transition(booking.id, o.to, o.actor)}
          className={`w-full rounded-2xl p-3.5 text-left transition active:scale-[0.99] ${
            o.danger
              ? 'bg-white ring-1 ring-rose-200'
              : 'bg-brand-600 text-white shadow-soft'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`flex items-center gap-2 text-[13.5px] font-bold ${o.danger ? 'text-rose-600' : 'text-white'}`}>
              {o.danger ? <Icon.alert size={16} /> : <Icon.chevron size={16} />}
              {o.label}
            </span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${o.danger ? 'bg-rose-50 text-rose-500' : 'bg-white/20 text-white'}`}>
              {ACTOR_LABEL[o.actor]}
            </span>
          </div>
          {o.note && (
            <p className={`mt-1.5 text-[11px] leading-snug ${o.danger ? 'text-muted' : 'text-white/85'}`}>
              {o.note}
            </p>
          )}
        </button>
      ))}
    </div>
  )
}
