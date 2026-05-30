import { NavLink } from 'react-router-dom'
import { Icon } from './Icons'

const TABS = [
  { to: '/', label: 'Home', icon: Icon.home, end: true },
  { to: '/search', label: 'Search', icon: Icon.search },
  { to: '/bookings', label: 'Bookings', icon: Icon.bookings },
  { to: '/provider', label: 'Provider', icon: Icon.provider },
  { to: '/admin', label: 'Admin', icon: Icon.admin },
]

export default function BottomNav() {
  return (
    <nav className="absolute inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 backdrop-blur">
      <div className="flex items-stretch justify-between px-2 pb-[max(env(safe-area-inset-bottom),0.4rem)] pt-1.5">
        {TABS.map((t) => {
          const IconCmp = t.icon
          return (
            <NavLink
              key={t.to}
              to={t.to}
              end={t.end}
              className={({ isActive }) =>
                `flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5 text-[10.5px] font-semibold transition-colors ${
                  isActive ? 'text-brand-600' : 'text-muted'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`flex h-7 w-12 items-center justify-center rounded-full transition-colors ${
                      isActive ? 'bg-brand-50' : 'bg-transparent'
                    }`}
                  >
                    <IconCmp size={21} />
                  </span>
                  {t.label}
                </>
              )}
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
