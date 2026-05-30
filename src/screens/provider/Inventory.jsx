import { useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { useStore } from '../../store/StoreContext'
import { GearImage, Stars, eur } from '../../components/ui'
import { Icon } from '../../components/Icons'
import { Sheet } from '../../components/ui'
import { itemPerformance, providerItems } from '../../lib/providerStats'
import { ProviderHeading, StatusDot, EmptyState } from './parts'

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'paused', label: 'Paused' },
  { id: 'archived', label: 'Archived' },
]

export default function Inventory() {
  const navigate = useNavigate()
  const { provider } = useOutletContext()
  const { items, bookings, setItemStatus, duplicateItem } = useStore()
  const [filter, setFilter] = useState('all')
  const [menuItem, setMenuItem] = useState(null)

  const mine = providerItems(items, provider.id)
  const list = mine.filter((i) => filter === 'all' || i.status === filter)

  const act = (fn) => {
    fn()
    setMenuItem(null)
  }

  return (
    <div>
      <ProviderHeading sub={`${mine.length} listings in your fleet`}>Inventory</ProviderHeading>

      {/* Summary chips */}
      <div className="no-scrollbar mt-3 flex gap-2 px-4">
        {FILTERS.map((f) => {
          const count = f.id === 'all' ? mine.length : mine.filter((i) => i.status === f.id).length
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`rounded-full px-3.5 py-2 text-[12.5px] font-semibold ${
                filter === f.id ? 'bg-ink text-white' : 'bg-white text-ink-soft ring-1 ring-line'
              }`}
            >
              {f.label} <span className="opacity-60">{count}</span>
            </button>
          )
        })}
      </div>

      {/* Add CTA */}
      <div className="px-4 pt-4">
        <button
          onClick={() => navigate('/provider/inventory/add')}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-brand-200 bg-brand-50 py-3.5 text-[13px] font-bold text-brand-700 active:scale-[0.99]"
        >
          <Icon.plus size={18} /> Add new item
        </button>
      </div>

      <div className="space-y-3 px-4 pb-6 pt-4">
        {list.length === 0 && <EmptyState title="No items here" hint="Try a different filter or add a new listing." />}
        {list.map((item) => {
          const perf = itemPerformance(item, bookings)
          return (
            <div key={item.id} className="overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-line/70">
              <div className="flex gap-3 p-3">
                <GearImage item={item} className="h-20 w-20" rounded="rounded-xl" overlay={false} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="line-clamp-2 text-[13.5px] font-bold leading-tight text-ink">{item.name}</p>
                    <button onClick={() => setMenuItem(item)} className="-mr-1 -mt-1 p-1 text-muted">
                      <Icon.cog size={18} />
                    </button>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <StatusDot status={item.status} />
                    {item.rating > 0 && <Stars value={item.rating} count={item.reviews} size={11} />}
                  </div>
                  <p className="mt-1 text-[12px] font-bold text-brand-700">{eur(item.pricePerDay)}<span className="text-[10.5px] font-medium text-muted">/day · {eur(item.weekPrice)}/wk</span></p>
                </div>
              </div>

              {/* Performance strip */}
              <div className="grid grid-cols-3 divide-x divide-line border-t border-line bg-slate-50/60">
                <Perf label="Earnings" value={eur(perf.revenuePerItem)} />
                <Perf label="Bookings" value={perf.lifetimeBookings} />
                <Perf label="Utilization" value={`${perf.utilization}%`} />
              </div>

              <div className="flex divide-x divide-line border-t border-line">
                <RowBtn icon={Icon.edit} label="Edit" onClick={() => setMenuItem(item)} />
                <RowBtn icon={Icon.chart} label="Performance" onClick={() => navigate('/provider/analytics')} />
                <RowBtn
                  icon={item.status === 'paused' ? Icon.play : Icon.pause}
                  label={item.status === 'paused' ? 'Resume' : 'Pause'}
                  onClick={() => setItemStatus(item.id, item.status === 'paused' ? 'active' : 'paused')}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Manage sheet */}
      <Sheet open={!!menuItem} onClose={() => setMenuItem(null)} title={menuItem?.name || 'Manage item'}>
        {menuItem && (
          <div className="space-y-2">
            <SheetRow icon={Icon.edit} label="Edit listing" desc="Update details, pricing & photos" onClick={() => act(() => navigate('/provider/inventory/add'))} />
            <SheetRow icon={Icon.copy} label="Duplicate listing" desc="Create a paused copy to edit" onClick={() => act(() => duplicateItem(menuItem.id))} />
            <SheetRow
              icon={menuItem.status === 'paused' ? Icon.play : Icon.pause}
              label={menuItem.status === 'paused' ? 'Resume listing' : 'Pause listing'}
              desc={menuItem.status === 'paused' ? 'Make bookable again' : 'Hide from search temporarily'}
              onClick={() => act(() => setItemStatus(menuItem.id, menuItem.status === 'paused' ? 'active' : 'paused'))}
            />
            <SheetRow icon={Icon.chart} label="View performance" desc="Earnings, bookings & utilization" onClick={() => act(() => navigate('/provider/analytics'))} />
            <SheetRow
              icon={Icon.archive}
              label="Archive listing"
              desc="Remove from your active fleet"
              danger
              onClick={() => act(() => setItemStatus(menuItem.id, 'archived'))}
            />
          </div>
        )}
      </Sheet>
    </div>
  )
}

function Perf({ label, value }) {
  return (
    <div className="px-2 py-2.5 text-center">
      <p className="text-[13px] font-extrabold text-ink">{value}</p>
      <p className="text-[9.5px] font-semibold text-muted">{label}</p>
    </div>
  )
}

function RowBtn({ icon: IconCmp, label, onClick }) {
  return (
    <button onClick={onClick} className="flex flex-1 items-center justify-center gap-1.5 py-2.5 text-[11.5px] font-semibold text-ink-soft active:bg-slate-50">
      <IconCmp size={15} className="text-brand-600" /> {label}
    </button>
  )
}

function SheetRow({ icon: IconCmp, label, desc, onClick, danger }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 rounded-xl p-3 text-left active:bg-slate-50">
      <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${danger ? 'bg-rose-50 text-rose-600' : 'bg-brand-50 text-brand-600'}`}>
        <IconCmp size={18} />
      </span>
      <span className="flex-1">
        <span className={`block text-[13px] font-bold ${danger ? 'text-rose-600' : 'text-ink'}`}>{label}</span>
        <span className="block text-[11px] text-muted">{desc}</span>
      </span>
      <Icon.chevron size={16} className="text-muted" />
    </button>
  )
}
