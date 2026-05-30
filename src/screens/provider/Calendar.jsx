import { useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { useStore } from '../../store/StoreContext'
import { itemById } from '../../data/mockData'
import { Icon } from '../../components/Icons'
import { STATES, isTerminal } from '../../lib/bookingMachine'
import { providerBookings } from '../../lib/providerStats'
import { ProviderHeading, SectionCard } from './parts'

const MONTH = { year: 2026, month: 5, label: 'June 2026', days: 30, startWeekday: 0 } // June 1 2026 = Monday(0)

function iso(day) {
  return `2026-06-${String(day).padStart(2, '0')}`
}

export default function Calendar() {
  const navigate = useNavigate()
  const { provider } = useOutletContext()
  const { bookings, blockedDates, toggleBlockedDate } = useStore()
  const [selected, setSelected] = useState(null)

  const mine = providerBookings(bookings, provider.id)

  // Map each day to a status.
  const dayStatus = {}
  mine.forEach((b) => {
    if (isTerminal(b.state)) return
    const start = Number(b.startDate.slice(8, 10))
    const end = Number(b.endDate.slice(8, 10))
    const isPending = b.state === STATES.PAYMENT_AUTHORIZED
    for (let d = start; d <= end; d++) {
      if (b.startDate.slice(0, 7) !== '2026-06') continue
      if (!dayStatus[d] || dayStatus[d] === 'available') dayStatus[d] = isPending ? 'pending' : 'booked'
    }
  })
  blockedDates.forEach((bd) => {
    if (bd.startsWith('2026-06')) dayStatus[Number(bd.slice(8, 10))] = 'maintenance'
  })

  const styleFor = (status) => {
    switch (status) {
      case 'booked': return 'bg-brand-500 text-white'
      case 'pending': return 'bg-amber-soft text-white'
      case 'maintenance': return 'bg-slate-400 text-white'
      default: return 'bg-teal-50 text-teal-700'
    }
  }

  const counts = {
    booked: Object.values(dayStatus).filter((s) => s === 'booked').length,
    pending: Object.values(dayStatus).filter((s) => s === 'pending').length,
    maintenance: Object.values(dayStatus).filter((s) => s === 'maintenance').length,
  }
  const available = MONTH.days - counts.booked - counts.pending - counts.maintenance

  const selectedStatus = selected ? (dayStatus[selected] || 'available') : null

  return (
    <div className="space-y-4 px-4 pb-6 pt-4">
      <ProviderHeading sub="Tap a date to block it for maintenance">Availability calendar</ProviderHeading>

      <div className="grid grid-cols-4 gap-2">
        <Mini label="Available" value={available} c="bg-teal-500" />
        <Mini label="Booked" value={counts.booked} c="bg-brand-500" />
        <Mini label="Pending" value={counts.pending} c="bg-amber-soft" />
        <Mini label="Blocked" value={counts.maintenance} c="bg-slate-400" />
      </div>

      <SectionCard
        title={MONTH.label}
        action={<div className="flex gap-1 text-muted"><Icon.chevronLeft size={18} /><Icon.chevron size={18} /></div>}
      >
        <div className="mb-2 grid grid-cols-7 gap-1.5">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
            <span key={i} className="text-center text-[10px] font-bold text-muted">{d}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {Array.from({ length: MONTH.startWeekday }).map((_, i) => <div key={`pad${i}`} />)}
          {Array.from({ length: MONTH.days }, (_, i) => i + 1).map((d) => {
            const status = dayStatus[d] || 'available'
            return (
              <button
                key={d}
                onClick={() => setSelected(d)}
                className={`relative flex aspect-square items-center justify-center rounded-lg text-[11.5px] font-bold ${styleFor(status)} ${
                  selected === d ? 'ring-2 ring-ink ring-offset-1' : ''
                }`}
              >
                {d}
              </button>
            )
          })}
        </div>
        <div className="mt-3 flex flex-wrap gap-3 text-[10.5px] text-muted">
          <Legend c="bg-teal-50" t="Available" /><Legend c="bg-brand-500" t="Booked" />
          <Legend c="bg-amber-soft" t="Pending" /><Legend c="bg-slate-400" t="Maintenance" />
        </div>
      </SectionCard>

      {/* Selected day actions */}
      {selected && (
        <SectionCard title={`${MONTH.label.split(' ')[0]} ${selected}`}>
          <p className="mb-3 text-[12.5px] capitalize text-ink-soft">
            Status: <span className="font-bold">{selectedStatus}</span>
          </p>
          {selectedStatus === 'booked' || selectedStatus === 'pending' ? (
            <p className="text-[12px] text-muted">This date has a booking and can't be blocked.</p>
          ) : (
            <button
              onClick={() => toggleBlockedDate(iso(selected))}
              className={`w-full rounded-xl py-3 text-[13px] font-bold ${
                selectedStatus === 'maintenance' ? 'bg-slate-100 text-ink' : 'bg-ink text-white'
              }`}
            >
              {selectedStatus === 'maintenance' ? 'Unblock this date' : 'Block for maintenance'}
            </button>
          )}
        </SectionCard>
      )}

      {/* Pending requests needing calendar decisions */}
      <SectionCard title="Pending on calendar" action={<button onClick={() => navigate('/provider/bookings')} className="text-[12px] font-semibold text-brand-600">Review</button>}>
        {mine.filter((b) => b.state === STATES.PAYMENT_AUTHORIZED).length === 0 ? (
          <p className="py-1 text-center text-[12.5px] text-muted">No pending requests.</p>
        ) : (
          <div className="space-y-2">
            {mine.filter((b) => b.state === STATES.PAYMENT_AUTHORIZED).map((b) => (
              <button
                key={b.id}
                onClick={() => navigate(`/provider/bookings/${b.id}`)}
                className="flex w-full items-center gap-2 rounded-xl bg-amber-50 p-2.5 text-left"
              >
                <Icon.clock size={16} className="text-amber-700" />
                <span className="flex-1 text-[12px] font-semibold text-ink">{itemById(b.itemId)?.name}</span>
                <span className="text-[11px] text-amber-700">{b.startDate.slice(5)}</span>
              </button>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  )
}

function Mini({ label, value, c }) {
  return (
    <div className="rounded-2xl bg-white p-2.5 text-center shadow-soft ring-1 ring-line/70">
      <span className={`mx-auto mb-1 block h-2 w-2 rounded-full ${c}`} />
      <p className="text-[16px] font-extrabold leading-none text-ink">{value}</p>
      <p className="mt-1 text-[10px] font-semibold text-muted">{label}</p>
    </div>
  )
}

function Legend({ c, t }) {
  return <span className="flex items-center gap-1"><span className={`h-2.5 w-2.5 rounded-[3px] ${c}`} /> {t}</span>
}
