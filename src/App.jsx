import { Routes, Route, useLocation } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import Home from './screens/Home'
import Search from './screens/Search'
import ItemDetail from './screens/ItemDetail'
import BookingFlow from './screens/BookingFlow'
import Bookings from './screens/Bookings'
import BookingStatus from './screens/BookingStatus'
import Profile from './screens/Profile'
import AdminView from './screens/AdminView'
import ProviderShell from './screens/provider/ProviderShell'
import Dashboard from './screens/provider/Dashboard'
import ProviderBookings from './screens/provider/Bookings'
import ProviderBookingDetail from './screens/provider/BookingDetail'
import Inventory from './screens/provider/Inventory'
import AddItem from './screens/provider/AddItem'
import Calendar from './screens/provider/Calendar'
import Deliveries from './screens/provider/Deliveries'
import Earnings from './screens/provider/Earnings'
import Analytics from './screens/provider/Analytics'
import TrustCenter from './screens/provider/TrustCenter'

export default function App() {
  const location = useLocation()
  // Key the page transition on the top-level section so navigating *within*
  // the provider console doesn't remount/re-animate its sticky shell.
  const section = '/' + (location.pathname.split('/')[1] || '')

  return (
    <div className="min-h-screen w-full bg-slate-200 lg:py-8">
      {/* Desktop framing copy */}
      <div className="mx-auto hidden max-w-md px-6 pb-4 text-center lg:block">
        <h1 className="text-xl font-bold text-ink">RentACot&nbsp;Go</h1>
        <p className="text-sm text-ink-soft">
          Cyprus baby-gear marketplace — mobile demo. Use the bottom tabs to explore.
        </p>
      </div>

      {/* Phone frame */}
      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col bg-canvas shadow-float lg:min-h-[860px] lg:max-h-[860px] lg:overflow-hidden lg:rounded-[2.5rem] lg:ring-8 lg:ring-ink/90">
        <main
          key={section}
          className="animate-rise flex-1 overflow-y-auto overscroll-contain pb-24"
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/item/:id" element={<ItemDetail />} />
            <Route path="/book/:id" element={<BookingFlow />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/bookings/:id" element={<BookingStatus />} />

            {/* Full-screen provider flows (own header, no sub-nav chrome) */}
            <Route path="/provider/bookings/:id" element={<ProviderBookingDetail />} />
            <Route path="/provider/inventory/add" element={<AddItem />} />

            {/* Provider business console — nested under a shared shell */}
            <Route path="/provider" element={<ProviderShell />}>
              <Route index element={<Dashboard />} />
              <Route path="bookings" element={<ProviderBookings />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="calendar" element={<Calendar />} />
              <Route path="deliveries" element={<Deliveries />} />
              <Route path="earnings" element={<Earnings />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="trust" element={<TrustCenter />} />
            </Route>

            <Route path="/profile" element={<Profile />} />
            {/*
              Admin / Operations is intentionally NOT in the mobile bottom nav.
              It lives at a hidden internal route, representing a separate
              internal/web operations dashboard reachable only by staff who
              know the URL (or via the discreet link on the Profile screen).
            */}
            <Route path="/admin" element={<AdminView />} />
            <Route path="/internal/operations" element={<AdminView />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </div>
  )
}
