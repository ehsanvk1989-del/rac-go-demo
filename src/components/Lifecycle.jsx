import { HAPPY_PATH, STATE_STYLES, progressIndex } from '../lib/bookingMachine'
import { Icon } from './Icons'

const STEP_ICON = {
  Draft: Icon.doc,
  'Pending Hold': Icon.clock,
  'Payment Authorized': Icon.lock,
  'Provider Accepted': Icon.checkCircle,
  'In Delivery': Icon.truck,
  'Active Rental': Icon.spark,
  'Return Inspection': Icon.camera,
  Completed: Icon.check,
}

/* Compact horizontal progress rail for the happy path. */
export function ProgressRail({ state }) {
  const idx = progressIndex(state)
  const pct = idx < 0 ? 0 : (idx / (HAPPY_PATH.length - 1)) * 100
  const sideState = idx < 0
  return (
    <div>
      <div className="relative mx-1 h-1.5 rounded-full bg-line">
        <div
          className={`absolute left-0 top-0 h-full rounded-full ${sideState ? 'bg-rose-400' : 'bg-gradient-to-r from-brand-400 to-teal-500'}`}
          style={{ width: sideState ? '100%' : `${pct}%` }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between px-0.5">
        {HAPPY_PATH.map((s, i) => {
          const done = idx >= 0 && i <= idx
          return (
            <span
              key={s}
              className={`h-2 w-2 rounded-full ${done ? 'bg-brand-500' : 'bg-line'}`}
              title={s}
            />
          )
        })}
      </div>
    </div>
  )
}

/* Full vertical lifecycle showing completed, current and upcoming steps. */
export function LifecycleSteps({ state }) {
  const idx = progressIndex(state)
  return (
    <ol className="relative ml-1">
      {HAPPY_PATH.map((s, i) => {
        const StepIcon = STEP_ICON[s] || Icon.doc
        const status = idx < 0 ? (i === 0 ? 'done' : 'todo') : i < idx ? 'done' : i === idx ? 'current' : 'todo'
        const isLast = i === HAPPY_PATH.length - 1
        return (
          <li key={s} className="relative flex gap-3 pb-4 last:pb-0">
            {!isLast && (
              <span
                className={`absolute left-[15px] top-8 h-[calc(100%-1.5rem)] w-0.5 ${
                  status === 'done' ? 'bg-brand-300' : 'bg-line'
                }`}
              />
            )}
            <span
              className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                status === 'done'
                  ? 'bg-brand-500 text-white'
                  : status === 'current'
                    ? 'bg-white text-brand-600 ring-2 ring-brand-500'
                    : 'bg-slate-100 text-muted'
              }`}
            >
              {status === 'done' ? <Icon.check size={16} /> : <StepIcon size={16} />}
            </span>
            <div className="pt-1">
              <p
                className={`text-[13px] font-semibold ${
                  status === 'todo' ? 'text-muted' : 'text-ink'
                }`}
              >
                {s}
              </p>
              {status === 'current' && (
                <p className="mt-0.5 text-[11px] font-medium text-brand-600">Current stage</p>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

/* Chronological event log from a booking's history array. */
export function HistoryLog({ history }) {
  return (
    <ul className="space-y-2.5">
      {history.map((h, i) => {
        const style = STATE_STYLES[h.state] || STATE_STYLES.Draft
        return (
          <li key={i} className="flex items-center gap-3 text-[12px]">
            <span className={`h-2 w-2 shrink-0 rounded-full ${style.dot}`} />
            <span className="font-semibold text-ink">{h.state}</span>
            <span className="ml-auto text-muted">{h.at}</span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold capitalize text-slate-500">
              {h.actor}
            </span>
          </li>
        )
      })}
    </ul>
  )
}
