import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/StoreContext'
import { ITEMS, CATEGORIES, LOCATIONS, PROVIDERS, itemById } from '../data/mockData'
import { Icon, CategoryIcon } from '../components/Icons'
import { Badge, ProviderAvatar, Stars, eur } from '../components/ui'
import { TabHeader } from '../components/ScreenHeader'
import ItemCard from '../components/ItemCard'

/* The signed-in demo user. Frontend-only mock identity. */
const USER = {
  name: 'Elena Petrou',
  initials: 'EP',
  tone: 'from-brand-500 to-teal-500',
  email: 'elena.petrou@example.com',
  phone: '+357 99 •• 412',
  emailVerified: true,
  phoneVerified: true,
  memberSince: '2024',
  trips: 6,
  trustScore: 92,
  child: { name: 'Sofia', age: '14 months' },
  homeAirport: 'lca',
  savedHotels: ['Amathus Beach Hotel, Limassol', 'Nissi Beach Resort, Ayia Napa'],
  savedAirports: ['lca', 'pfo'],
  favCategories: ['stroller', 'car-seat', 'travel-bed'],
}

export default function Profile() {
  const navigate = useNavigate()
  const { role, setRole, bookings, disputes } = useStore()
  const isProvider = role === 'provider'

  const wishlist = ITEMS.slice(0, 3)
  const recentlyViewed = ITEMS.slice(4, 7)
  const favProviders = PROVIDERS.slice(0, 2)
  const myDisputes = disputes // demo: surface all dispute cases as history

  return (
    <div className="pb-4">
      {/* ---- Profile summary hero ---- */}
      <section className="relative overflow-hidden rounded-b-[2rem] bg-gradient-to-br from-brand-600 via-brand-500 to-teal-500 px-5 pb-6 pt-7 text-white">
        <div className="absolute -right-12 -top-10 h-40 w-40 rounded-full bg-white/10" />
        <div className="relative flex items-center gap-4">
          <div className="relative shrink-0">
            <div className={`flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br ${USER.tone} text-[26px] font-extrabold ring-4 ring-white/25`}>
              {USER.initials}
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-white text-brand-600 ring-2 ring-brand-500">
              <Icon.check size={16} />
            </span>
          </div>
          <div className="min-w-0">
            <h1 className="flex items-center gap-2 text-[20px] font-extrabold leading-tight">{USER.name}</h1>
            <p className="text-[12px] text-white/85">Member since {USER.memberSince} · {USER.trips} trips</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-[10.5px] font-bold backdrop-blur">
                <Icon.shield size={12} /> Verified traveller
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-[10.5px] font-bold backdrop-blur">
                <Icon.star size={12} /> Trust {USER.trustScore}
              </span>
            </div>
          </div>
        </div>

        {/* Verification status pills */}
        <div className="relative mt-4 grid grid-cols-2 gap-2.5">
          <VerifyPill icon={Icon.mail} label="Email" value={USER.email} ok={USER.emailVerified} />
          <VerifyPill icon={Icon.phone} label="Phone" value={USER.phone} ok={USER.phoneVerified} />
        </div>
      </section>

      {/* ---- Role switcher ---- */}
      <section className="px-4 pt-5">
        <div className="rounded-2xl bg-white p-3.5 shadow-soft ring-1 ring-line/70">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] font-bold text-ink">Current role</p>
              <p className="text-[11px] text-muted">Switch how you use RentACot Go</p>
            </div>
            <div className="flex rounded-full bg-slate-100 p-1">
              {['customer', 'provider'].map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`rounded-full px-3.5 py-1.5 text-[12px] font-bold capitalize transition ${
                    role === r ? 'bg-brand-600 text-white shadow-soft' : 'text-ink-soft'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          {isProvider && (
            <button
              onClick={() => navigate('/provider')}
              className="mt-3 flex w-full items-center justify-between rounded-xl bg-brand-50 px-3.5 py-2.5 text-[12.5px] font-semibold text-brand-700"
            >
              <span className="flex items-center gap-2"><Icon.provider size={16} /> Open provider dashboard</span>
              <Icon.chevron size={16} />
            </button>
          )}
        </div>
      </section>

      {/* ---- Account & Verification ---- */}
      <Group title="Account & verification">
        <Row icon={Icon.id} label="Identity verification" valueBadge={<Badge tone="teal" icon={Icon.check}>Verified</Badge>} />
        <Row icon={Icon.wallet} label="Payment method" value="Visa •••• 4242" />
        {isProvider && <Row icon={Icon.cash} label="Payout account" value="Bank of Cyprus ••• 8841" valueBadge={<Badge tone="teal">Active</Badge>} />}
        <Row icon={Icon.pin} label="Address verification" valueBadge={<Badge tone="teal" icon={Icon.check}>Confirmed</Badge>} />
        <Row
          icon={Icon.star}
          label={isProvider ? 'Trusted provider score' : 'Trusted traveller score'}
          value={`${USER.trustScore}/100`}
          last
        />
        <div className="px-4 pb-3">
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-gradient-to-r from-brand-400 to-teal-500" style={{ width: `${USER.trustScore}%` }} />
          </div>
          <p className="mt-1.5 text-[10.5px] text-muted">
            High scores unlock instant-book, lower deposits and priority handoff windows.
          </p>
        </div>
      </Group>

      {/* ---- Travel preferences ---- */}
      <Group title="Travel preferences">
        <Row icon={Icon.user} label="Child" value={`${USER.child.name} · ${USER.child.age}`} />
        <Row icon={Icon.plane} label="Home airport" value={locName(USER.homeAirport)} />
        <div className="px-4 py-3">
          <p className="mb-1.5 text-[11px] font-semibold text-ink-soft">Preferred delivery locations</p>
          <div className="flex flex-wrap gap-1.5">
            {LOCATIONS.slice(0, 4).map((l) => (
              <span key={l.id} className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-ink-soft">
                {l.type === 'airport' ? <Icon.plane size={12} /> : <Icon.pin size={12} />} {l.name}
              </span>
            ))}
          </div>
        </div>
        <div className="px-4 py-3">
          <p className="mb-1.5 text-[11px] font-semibold text-ink-soft">Saved hotels</p>
          <div className="space-y-1.5">
            {USER.savedHotels.map((h) => (
              <p key={h} className="flex items-center gap-2 text-[12px] text-ink">
                <Icon.box size={14} className="text-brand-500" /> {h}
              </p>
            ))}
          </div>
        </div>
        <div className="px-4 py-3">
          <p className="mb-1.5 text-[11px] font-semibold text-ink-soft">Saved airports</p>
          <div className="flex flex-wrap gap-1.5">
            {USER.savedAirports.map((a) => (
              <span key={a} className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-semibold text-brand-700">
                <Icon.plane size={12} /> {locName(a)}
              </span>
            ))}
          </div>
        </div>
        <div className="px-4 pb-4">
          <p className="mb-1.5 text-[11px] font-semibold text-ink-soft">Favourite categories</p>
          <div className="flex flex-wrap gap-2">
            {USER.favCategories.map((c) => {
              const cat = CATEGORIES.find((x) => x.id === c)
              return (
                <button
                  key={c}
                  onClick={() => navigate(`/search?cat=${c}`)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[12px] font-semibold text-ink-soft ring-1 ring-line"
                >
                  <CategoryIcon id={c} size={15} className="text-brand-600" /> {cat?.label}
                </button>
              )
            })}
          </div>
        </div>
      </Group>

      {/* ---- Saved items ---- */}
      <section className="px-4 pt-6">
        <h2 className="mb-2.5 flex items-center gap-2 text-[15px] font-bold text-ink">
          <Icon.heart size={17} className="text-rose-500" /> Wishlist
        </h2>
        <div className="space-y-3">
          {wishlist.map((i) => <ItemCard key={i.id} item={i} />)}
        </div>
      </section>

      <section className="pt-5">
        <div className="px-4">
          <h2 className="mb-2.5 flex items-center gap-2 text-[15px] font-bold text-ink">
            <Icon.clock size={17} className="text-brand-500" /> Recently viewed
          </h2>
        </div>
        <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-2">
          {recentlyViewed.map((i) => <ItemCard key={i.id} item={i} variant="rail" />)}
        </div>
      </section>

      <section className="px-4 pt-4">
        <h2 className="mb-2.5 flex items-center gap-2 text-[15px] font-bold text-ink">
          <Icon.bookmark size={16} className="text-teal-500" /> Favourite providers
        </h2>
        <div className="space-y-2.5">
          {favProviders.map((p) => (
            <div key={p.id} className="flex items-center gap-3 rounded-2xl bg-white p-3.5 shadow-soft ring-1 ring-line/70">
              <ProviderAvatar provider={p} size={42} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-bold text-ink">{p.name}</p>
                <p className="text-[11px] text-muted">{p.base}</p>
              </div>
              <Stars value={p.rating} count={p.reviews} size={12} />
            </div>
          ))}
        </div>
      </section>

      {/* ---- Support & safety ---- */}
      <Group title="Support & safety">
        <Row icon={Icon.life} label="Help center" chevron />
        <Row icon={Icon.phone} label="Emergency support" value="24/7" valueBadge={<Badge tone="rose">SOS</Badge>} chevron />
        <Row icon={Icon.alert} label="Report an issue" chevron />
        <Row
          icon={Icon.doc}
          label="Dispute history"
          value={`${myDisputes.length} case${myDisputes.length === 1 ? '' : 's'}`}
          chevron
          onClick={() => navigate('/internal/operations')}
          last
        />
      </Group>

      {/* ---- Settings ---- */}
      <Group title="Settings">
        <Row icon={Icon.globe} label="Language" value="English" chevron />
        <Row icon={Icon.cash} label="Currency" value="EUR (€)" chevron />
        <Row icon={Icon.bell} label="Notifications" value="On" chevron />
        <Row icon={Icon.lock} label="Privacy" chevron last />
      </Group>

      {/* Logout */}
      <div className="px-4 pt-5">
        <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-3.5 text-[14px] font-bold text-rose-600 shadow-soft ring-1 ring-line/70 active:scale-[0.99]">
          <Icon.logout size={18} /> Log out
        </button>
      </div>

      {/* Discreet internal operations link (not a customer feature) */}
      <button
        onClick={() => navigate('/internal/operations')}
        className="mt-5 flex w-full items-center justify-center gap-1.5 text-[10.5px] font-medium text-muted"
      >
        <Icon.shield size={12} /> Staff · internal operations dashboard
      </button>

      <p className="px-4 pt-3 text-center text-[10.5px] leading-relaxed text-muted">
        RentACot Go · demo profile · mock data only.
      </p>
    </div>
  )
}

function locName(id) {
  return LOCATIONS.find((l) => l.id === id)?.name || id
}

function VerifyPill({ icon: IconCmp, label, value, ok }) {
  return (
    <div className="rounded-2xl bg-white/15 p-3 backdrop-blur">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[11px] font-bold text-white/90">
          <IconCmp size={14} /> {label}
        </span>
        {ok ? (
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-teal-600">
            <Icon.check size={11} />
          </span>
        ) : (
          <span className="text-[10px] font-bold text-amber-200">Verify</span>
        )}
      </div>
      <p className="mt-1 truncate text-[11.5px] font-medium text-white">{value}</p>
    </div>
  )
}

function Group({ title, children }) {
  return (
    <section className="px-4 pt-6">
      <h2 className="mb-2.5 text-[15px] font-bold text-ink">{title}</h2>
      <div className="overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-line/70">
        {children}
      </div>
    </section>
  )
}

function Row({ icon: IconCmp, label, value, valueBadge, chevron, onClick, last }) {
  const interactive = chevron || onClick
  return (
    <button
      onClick={onClick}
      disabled={!interactive}
      className={`flex w-full items-center gap-3 px-4 py-3.5 text-left ${last ? '' : 'border-b border-line'} ${
        interactive ? 'active:bg-slate-50' : ''
      }`}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
        <IconCmp size={18} />
      </span>
      <span className="flex-1 text-[13px] font-semibold text-ink">{label}</span>
      {valueBadge}
      {value && <span className="text-[12.5px] font-medium text-muted">{value}</span>}
      {chevron && <Icon.chevron size={16} className="text-muted" />}
    </button>
  )
}
