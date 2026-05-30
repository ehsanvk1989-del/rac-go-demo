import { useOutletContext } from 'react-router-dom'
import { useStore } from '../../store/StoreContext'
import { GearImage, eur } from '../../components/ui'
import { Icon } from '../../components/Icons'
import { BarChart, Ring, Heatmap } from '../../components/Charts'
import { computeStats, itemPerformance, weekdayDemand, demandHeatmap } from '../../lib/providerStats'
import { ProviderHeading, SectionCard, KpiCard } from './parts'

export default function Analytics() {
  const { provider } = useOutletContext()
  const { bookings, items } = useStore()
  const s = computeStats(bookings, items, provider.id)

  const ranked = [...s.myItems]
    .map((i) => ({ item: i, perf: itemPerformance(i, bookings) }))
    .sort((a, b) => b.perf.revenuePerItem - a.perf.revenuePerItem)
  const topItem = ranked[0]

  return (
    <div className="space-y-4 px-4 pb-6 pt-4">
      <ProviderHeading sub="Demand, utilization & revenue insights">Analytics</ProviderHeading>

      <div className="grid grid-cols-2 gap-2.5">
        <KpiCard icon={Icon.trend} label="Utilization rate" value={`${s.utilization}%`} sub="fleet in use" tone="brand" delta={6} />
        <KpiCard icon={Icon.grid} label="Occupancy" value={`${s.occupancy}%`} sub="calendar filled" tone="teal" delta={4} />
      </div>

      {/* Top item */}
      {topItem && (
        <SectionCard title="Most rented item">
          <div className="flex items-center gap-3">
            <GearImage item={topItem.item} className="h-16 w-16" rounded="rounded-xl" overlay={false} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13.5px] font-bold text-ink">{topItem.item.name}</p>
              <p className="text-[11.5px] text-muted">{topItem.perf.lifetimeBookings} bookings · {topItem.perf.utilization}% utilization</p>
            </div>
            <div className="text-right">
              <p className="text-[15px] font-extrabold text-teal-600">{eur(topItem.perf.revenuePerItem)}</p>
              <p className="text-[10px] text-muted">revenue</p>
            </div>
          </div>
        </SectionCard>
      )}

      {/* Revenue per item */}
      <SectionCard title="Revenue per item">
        <div className="space-y-2.5">
          {ranked.slice(0, 5).map(({ item, perf }) => {
            const max = ranked[0].perf.revenuePerItem || 1
            return (
              <div key={item.id} className="flex items-center gap-2.5">
                <span className="w-24 shrink-0 truncate text-[11px] font-semibold text-ink-soft">{item.name.split(' ').slice(0, 2).join(' ')}</span>
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-gradient-to-r from-brand-400 to-teal-500" style={{ width: `${(perf.revenuePerItem / max) * 100}%` }} />
                </div>
                <span className="w-12 text-right text-[11px] font-bold text-ink">{eur(perf.revenuePerItem)}</span>
              </div>
            )
          })}
        </div>
      </SectionCard>

      {/* Weekday demand */}
      <SectionCard title="Demand by day" action={<span className="text-[11px] font-semibold text-teal-600">Weekends peak</span>}>
        <BarChart data={weekdayDemand()} height={120} />
      </SectionCard>

      {/* Occupancy ring + seasonal */}
      <div className="grid grid-cols-2 gap-2.5">
        <SectionCard title="Occupancy">
          <div className="flex justify-center py-1">
            <Ring value={s.occupancy} size={92} stroke={10} color="stroke-teal-500" sublabel="this month" />
          </div>
        </SectionCard>
        <SectionCard title="Seasonal trend">
          <div className="space-y-1.5 pt-1">
            {[['Spring', 62], ['Summer', 96], ['Autumn', 54], ['Winter', 28]].map(([s2, v]) => (
              <div key={s2} className="flex items-center gap-2">
                <span className="w-12 text-[10.5px] font-semibold text-muted">{s2}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-brand-500" style={{ width: `${v}%` }} />
                </div>
                <span className="w-7 text-right text-[10px] font-bold text-ink">{v}%</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Demand heatmap */}
      <SectionCard title="Demand heatmap" action={<span className="text-[11px] font-semibold text-muted">Last 4 weeks</span>}>
        <Heatmap grid={demandHeatmap()} />
      </SectionCard>
    </div>
  )
}
