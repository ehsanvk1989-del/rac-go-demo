import { Routes, Route, useLocation } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import Home from './screens/Home'
import Search from './screens/Search'
import ItemDetail from './screens/ItemDetail'
import BookingFlow from './screens/BookingFlow'
import Bookings from './screens/Bookings'
import BookingStatus from './screens/BookingStatus'
import ProviderDashboard from './screens/ProviderDashboard'
import AdminView from './screens/AdminView'

export default function App() {
  const location = useLocation()

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
          key={location.pathname}
          className="animate-rise flex-1 overflow-y-auto overscroll-contain pb-24"
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/item/:id" element={<ItemDetail />} />
            <Route path="/book/:id" element={<BookingFlow />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/bookings/:id" element={<BookingStatus />} />
            <Route path="/provider" element={<ProviderDashboard />} />
            <Route path="/admin" element={<AdminView />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </div>
  )
}
