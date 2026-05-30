import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useStore } from '../../store/StoreContext'
import { PROVIDERS } from '../../data/mockData'
import { ProviderAvatar } from '../../components/ui'
import { Icon } from '../../components/Icons'

const SUB_TABS = [
  { to: '/provider', label: 'Dashboard', end: true },
  { to: '/provider/bookings', label: 'Bookings' },
  { to: '/provider/inventory', label: 'Inventory' },
  { to: '/provider/calendar', label: 'Calendar' },
  { to: '/provider/deliveries', label: 'Deliveries' },
  { to: '/provider/earnings', label: 'Earnings' },
  { to: '/provider/analytics', label: 'Analytics' },
  { to: '/provider/trust', label: 'Trust' },
]

export default function ProviderShell() {
  const navigate = useNavigate()
  const { activeProviderId, setActiveProvider } = useStore()
  const provider = PROVIDERS.find((p) => p.id === activeProviderId) || PROVIDERS[0]

  return (
    <div className="min-h-full bg-canvas">
      {/* Provider identity header */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur">
        <div className="flex items-center gap-3 px-4 pb-2 pt-4">
          <ProviderAvatar provider={provider} size={42} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-extrabold leading-tight text-ink">{provider.name}</p>
            <p className="flex items-center gap-1 text-[11px] text-muted">
              <Icon.pin size={12} /> {provider.base} · {provider.rating}★ business
            </p>
          </div>
          <button
            onClick={() => navigate('/provider/inventory/add')}
            className="flex items-center gap-1 rounded-full bg-brand-600 px-3 py-2 text-[12px] font-bold text-white active:scale-95"
          >
            <Icon.plus size={15} /> Add
          </button>
        </div>

        {/* Provider switcher (demo convenience) */}
        <div className="no-scrollbar flex gap-1.5 px-4 pb-2">
          {PROVIDERS.map((p) => (
            <button
              key={p.id}
              onClick={() => setActiveProvider(p.id)}
              className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                activeProviderId === p.id ? 'bg-ink text-white' : 'bg-slate-100 text-ink-soft'
              }`}
            >
              {p.name.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Section sub-navigation */}
        <nav className="no-scrollbar flex gap-1 overflow-x-auto border-b border-line px-3 pb-2">
          {SUB_TABS.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              end={t.end}
              className={({ isActive }) =>
                `shrink-0 rounded-full px-3 py-1.5 text-[12.5px] font-semibold transition-colors ${
                  isActive ? 'bg-brand-50 text-brand-700' : 'text-muted'
                }`
              }
            >
              {t.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <Outlet context={{ provider }} />
    </div>
  )
}
