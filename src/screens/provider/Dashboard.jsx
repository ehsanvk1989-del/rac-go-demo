import { useNavigate, useOutletContext } from 'react-router-dom'
import { useStore } from '../../store/StoreContext'
import { itemById, locationById } from '../../data/mockData'
import { GearImage, StateChip, eur } from '../../components/ui'
import { Icon } from '../../components/Icons'
import { AreaChart, Ring } from '../../components/Charts'
import { computeStats, revenueSeries } from '../../lib/providerStats'
import { STATES } from '../../lib/bookingMachine'
import { KpiCard, SectionCard } from './parts'

export default function Dashboard() {
  const navigate = useNavigate()
  const { provider } = useOutletContext()
  const { bookings, items } = useStore()
  const s = computeStats(bookings, items, provider.id)

  const todays = s.mine.filter((b) =>
    [STATES.IN_DELIVERY, STATES.ACTIVE_RENTAL, STATES.PROVIDER_ACCEPTED].includes(b.state),
  )
  const series = revenueSeries(s.monthlyEarnings)

  return (
    <div className="space-y-5 px-4 pb-6 pt-4">
      {/* Earnings banner */}
      <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-ink to-slate-700 p-4 text-white">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[12px] font-semibold text-white/75">This month's earnings</p>
            <p className="mt-1 text-[28px] font-extrabold leading-none">{eur(s.monthlyEarnings)}</p>
            <p className="mt-1.5 flex items-center gap-1 text-[11px] text-teal-300">
              <Icon.trend size={13} /> +18% vs last month
            </p>
          </div>
          <button
            onClick={() => navigate('/provider/earnings')}
            className="rounded-full bg-white/15 px-3 py-1.5 text-[11.5px] font-bold backdrop-blur"
          >
            Details
          </button>
        </div>
        <div className="mt-2 -mx-1">
          <AreaChart data={series} height={96} />
        </div>
      </div>

      {/* Pending requests alert */}
      {s.pending.length > 0 && (
        <button
          onClick={() => navigate('/provider/bookings')}
          className="flex w-full items-center gap-3 rounded-2xl bg-amber-50 p-3.5 text-left ring-1 ring-amber-100 active:scale-[0.99]"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
            <Icon.bell size={19} />
          </span>
          <div className="flex-1">
            <p className="text-[13px] font-bold text-ink">{s.pending.length} booking request{s.pending.length > 1 ? 's' : ''} waiting</p>
            <p className="text-[11.5px] text-amber-700">Respond fast to protect your acceptance rate</p>
          </div>
          <Icon.chevron size={18} className="text-amber-700" />
        </button>
      )}

      {/* KPI grid */}
      <div>
        <h2 className="mb-2.5 text-[14px] font-bold text-ink">Business at a glance</h2>
        <div className="grid grid-cols-2 gap-2.5">
          <KpiCard icon={Icon.calendar} label="Today's bookings" value={todays.length} sub="deliveries & active" tone="brand" />
          <KpiCard icon={Icon.truck} label="Upcoming deliveries" value={s.counts.upcomingDeliveries} sub="accepted + en route" tone="teal" />
          <KpiCard icon={Icon.spark} label="Active rentals" value={s.counts.active} sub="out with guests" tone="brand" />
          <KpiCard icon={Icon.bell} label="Pending requests" value={s.counts.pending} sub="need a decision" tone="amber" />
          <KpiCard icon={Icon.wallet} label="Monthly earnings" value={eur(s.monthlyEarnings)} delta={18} tone="teal" />
          <KpiCard icon={Icon.lock} label="Escrow balance" value={eur(s.escrowHeld)} sub="deposits held" tone="ink" />
        </div>
      </div>

      {/* Performance rings */}
      <SectionCard title="Performance">
        <div className="flex items-center justify-around">
          <div className="text-center">
            <Ring value={Math.round(Number(s.avgRating) * 20)} label={s.avgRating} sublabel="rating" color="stroke-amber-400" />
            <p className="mt-1.5 text-[11px] font-semibold text-ink-soft">Avg rating</p>
          </div>
          <div className="text-center">
            <Ring value={s.responseRate} color="stroke-brand-500" />
            <p className="mt-1.5 text-[11px] font-semibold text-ink-soft">Response rate</p>
          </div>
          <div className="text-center">
            <Ring value={s.acceptanceRate} color="stroke-teal-500" />
            <p className="mt-1.5 text-[11px] font-semibold text-ink-soft">Acceptance</p>
          </div>
        </div>
      </SectionCard>

      {/* Today's schedule */}
      <SectionCard
        title="Today's schedule"
        action={
          <button onClick={() => navigate('/provider/deliveries')} className="text-[12px] font-semibold text-brand-600">
            All deliveries
          </button>
        }
      >
        {todays.length === 0 ? (
          <p className="py-2 text-center text-[12.5px] text-muted">Nothing scheduled today.</p>
        ) : (
          <div className="space-y-2.5">
            {todays.map((b) => {
              const item = itemById(b.itemId)
              const loc = locationById(b.locationId)
              return (
                <button
                  key={b.id}
                  onClick={() => navigate(`/provider/bookings/${b.id}`)}
                  className="flex w-full items-center gap-3 rounded-xl bg-slate-50 p-2.5 text-left active:bg-slate-100"
                >
                  <GearImage item={item} className="h-11 w-11" rounded="rounded-lg" overlay={false} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12.5px] font-bold text-ink">{item.name}</p>
                    <p className="flex items-center gap-1 text-[11px] text-muted">
                      {b.flightNo ? <Icon.plane size={11} /> : <Icon.truck size={11} />}
                      {loc?.name} · {b.customer.split(' ')[0]}
                    </p>
                  </div>
                  <StateChip state={b.state} />
                </button>
              )
            })}
          </div>
        )}
      </SectionCard>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-2.5">
        <QuickAction icon={Icon.plus} label="Add new item" onClick={() => navigate('/provider/inventory/add')} />
        <QuickAction icon={Icon.calendar} label="Block dates" onClick={() => navigate('/provider/calendar')} />
        <QuickAction icon={Icon.chart} label="View analytics" onClick={() => navigate('/provider/analytics')} />
        <QuickAction icon={Icon.shield} label="Trust center" onClick={() => navigate('/provider/trust')} />
      </div>
    </div>
  )
}

function QuickAction({ icon: IconCmp, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2.5 rounded-2xl bg-white p-3.5 text-left shadow-soft ring-1 ring-line/70 active:scale-[0.98]"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
        <IconCmp size={18} />
      </span>
      <span className="text-[12.5px] font-bold text-ink">{label}</span>
    </button>
  )
}
