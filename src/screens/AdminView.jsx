import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/StoreContext'
import { PROVIDERS, ITEMS, itemById, providerById } from '../data/mockData'
import { ProviderAvatar, StateChip, Badge, eur } from '../components/ui'
import { Icon } from '../components/Icons'
import { TabHeader } from '../components/ScreenHeader'
import { PhotoPair } from '../components/HandoffPhotos'
import TransitionActions from '../components/TransitionActions'
import { HAPPY_PATH, STATE_STYLES, STATES, isTerminal } from '../lib/bookingMachine'

const TABS = ['Overview', 'Disputes', 'Providers']

export default function AdminView() {
  const navigate = useNavigate()
  const { bookings, disputes } = useStore()
  const [tab, setTab] = useState('Overview')

  const gmv = bookings.reduce((s, b) => s + itemById(b.itemId).weekPrice, 0)
  const escrowHeld = bookings
    .filter((b) => !isTerminal(b.state))
    .reduce((s, b) => s + itemById(b.itemId).deposit, 0)
  const openDisputes = disputes.filter((d) => d.status !== 'Resolved').length

  // Distribution across lifecycle states (happy path + side states present).
  const stateCounts = {}
  bookings.forEach((b) => {
    stateCounts[b.state] = (stateCounts[b.state] || 0) + 1
  })
  const allStates = [...HAPPY_PATH, STATES.DISPUTED, STATES.REFUNDED, STATES.CANCELLED, STATES.DECLINED].filter(
    (s) => stateCounts[s],
  )
  const maxCount = Math.max(1, ...Object.values(stateCounts))

  return (
    <div>
      <TabHeader eyebrow="Operations" title="Admin">
        <p className="mt-1 text-[13px] text-ink-soft">Marketplace health, escrow & dispute resolution.</p>
      </TabHeader>

      {/* Tabs */}
      <div className="mt-4 flex gap-2 px-4">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-2 text-[12.5px] font-semibold ${
              tab === t ? 'bg-ink text-white' : 'bg-white text-ink-soft ring-1 ring-line'
            }`}
          >
            {t}
            {t === 'Disputes' && openDisputes > 0 && (
              <span className="ml-1.5 rounded-full bg-rose-500 px-1.5 text-[10px] font-bold text-white">{openDisputes}</span>
            )}
          </button>
        ))}
      </div>

      {tab === 'Overview' && (
        <div className="px-4 pt-4">
          {/* KPIs */}
          <div className="grid grid-cols-2 gap-2.5">
            <BigStat label="Gross booking value" value={eur(gmv)} sub="all-time (demo)" icon={Icon.wallet} tone="brand" />
            <BigStat label="Held in escrow" value={eur(escrowHeld)} sub="across live rentals" icon={Icon.lock} tone="teal" />
            <BigStat label="Live bookings" value={bookings.filter((b) => !isTerminal(b.state)).length} sub={`${bookings.length} total`} icon={Icon.bolt} />
            <BigStat label="Open disputes" value={openDisputes} sub="need resolution" icon={Icon.alert} tone="rose" />
          </div>

          {/* Lifecycle distribution */}
          <div className="mt-4 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-line/70">
            <p className="mb-3 text-[13px] font-bold text-ink">Bookings by lifecycle state</p>
            <div className="space-y-2.5">
              {allStates.map((s) => {
                const c = stateCounts[s] || 0
                const style = STATE_STYLES[s]
                return (
                  <div key={s} className="flex items-center gap-2.5">
                    <span className="w-32 shrink-0 text-[11px] font-semibold text-ink-soft">{s}</span>
                    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div className={`h-full rounded-full ${style.dot}`} style={{ width: `${(c / maxCount) * 100}%` }} />
                    </div>
                    <span className="w-5 text-right text-[11px] font-bold text-ink">{c}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Verification & trust posture */}
          <div className="mt-4 grid grid-cols-3 gap-2.5">
            <TrustStat label="ID-verified providers" value={`${PROVIDERS.filter((p) => p.verified).length}/${PROVIDERS.length}`} icon={Icon.id} />
            <TrustStat label="Sanitised fleet" value={`${PROVIDERS.filter((p) => p.sanitisedBadge).length}/${PROVIDERS.length}`} icon={Icon.spark} />
            <TrustStat label="Live items" value={ITEMS.length} icon={Icon.box} />
          </div>

          {/* Recent activity */}
          <div className="mt-4 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-line/70">
            <p className="mb-3 text-[13px] font-bold text-ink">Recent bookings</p>
            <div className="space-y-2">
              {bookings.slice(0, 6).map((b) => (
                <button
                  key={b.id}
                  onClick={() => navigate(`/bookings/${b.id}`)}
                  className="flex w-full items-center gap-2 text-left text-[12px]"
                >
                  <span className="font-semibold text-ink">{b.id}</span>
                  <span className="truncate text-muted">{itemById(b.itemId).name}</span>
                  <span className="ml-auto"><StateChip state={b.state} /></span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'Disputes' && (
        <div className="px-4 pt-4 space-y-4">
          {disputes.map((d) => {
            const booking = bookings.find((b) => b.id === d.bookingId)
            const item = itemById(d.itemId)
            const provider = providerById(d.providerId)
            return (
              <div key={d.id} className="rounded-2xl bg-white p-4 shadow-soft ring-1 ring-line/70">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[13.5px] font-bold text-ink">{d.id}</p>
                    <p className="text-[11px] text-muted">{d.bookingId} · {item?.name}</p>
                  </div>
                  <Badge tone={d.status === 'Resolved' ? 'teal' : 'rose'} icon={Icon.alert}>{d.status}</Badge>
                </div>

                <p className="mt-2.5 text-[12.5px] font-semibold text-ink">{d.reason}</p>

                {/* Evidence */}
                <div className="mt-3">
                  <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-muted">Photo evidence</p>
                  <PhotoPair before={d.before} after={d.after} />
                </div>

                {/* Claims */}
                <div className="mt-3 space-y-2">
                  <Claim who="Traveller" avatar={<Icon.users size={14} />} text={d.customerClaim} tone="brand" />
                  <Claim who={provider?.name || 'Provider'} avatar={<Icon.provider size={14} />} text={d.providerClaim} tone="slate" />
                </div>

                <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-[12px]">
                  <span className="font-semibold text-ink-soft">Amount held in escrow</span>
                  <span className="font-bold text-ink">{eur(d.amountHeld)}</span>
                </div>

                {/* Resolution actions drive the booking state machine */}
                {booking && booking.state === STATES.DISPUTED ? (
                  <div className="mt-3">
                    <p className="mb-2 text-[12px] font-bold text-ink">Resolve case</p>
                    <TransitionActions booking={booking} as="admin" />
                  </div>
                ) : (
                  <div className="mt-3 rounded-xl bg-teal-50 px-3 py-2.5 text-center text-[12px] font-semibold text-teal-700">
                    {booking ? `Linked booking now ${booking.state}` : 'Awaiting evidence upload'}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {tab === 'Providers' && (
        <div className="px-4 pt-4 space-y-2.5">
          {PROVIDERS.map((p) => {
            const itemCount = ITEMS.filter((i) => i.providerId === p.id).length
            return (
              <div key={p.id} className="rounded-2xl bg-white p-3.5 shadow-soft ring-1 ring-line/70">
                <div className="flex items-center gap-3">
                  <ProviderAvatar provider={p} size={44} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] font-bold text-ink">{p.name}</p>
                    <p className="text-[11px] text-muted">{p.base} · {itemCount} items · {p.rating}★ ({p.reviews})</p>
                  </div>
                  <span className="flex items-center gap-1 rounded-full bg-teal-50 px-2 py-1 text-[10.5px] font-bold text-teal-600">
                    <Icon.shield size={12} /> Verified
                  </span>
                </div>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {p.badges.map((b) => (
                    <Badge key={b} tone="slate">{b}</Badge>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function BigStat({ label, value, sub, icon: IconCmp, tone = 'brand' }) {
  const tones = {
    brand: 'text-brand-600 bg-brand-50',
    teal: 'text-teal-600 bg-teal-50',
    rose: 'text-rose-600 bg-rose-50',
  }
  return (
    <div className="rounded-2xl bg-white p-3.5 shadow-soft ring-1 ring-line/70">
      <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${tones[tone] || tones.brand}`}>
        <IconCmp size={18} />
      </span>
      <p className="mt-2.5 text-[20px] font-extrabold leading-none text-ink">{value}</p>
      <p className="mt-1 text-[11.5px] font-semibold text-ink-soft">{label}</p>
      <p className="text-[10.5px] text-muted">{sub}</p>
    </div>
  )
}

function TrustStat({ label, value, icon: IconCmp }) {
  return (
    <div className="rounded-2xl bg-white p-3 text-center shadow-soft ring-1 ring-line/70">
      <IconCmp size={18} className="mx-auto text-brand-500" />
      <p className="mt-1.5 text-[15px] font-extrabold text-ink">{value}</p>
      <p className="text-[10px] font-semibold leading-tight text-muted">{label}</p>
    </div>
  )
}

function Claim({ who, avatar, text, tone }) {
  return (
    <div className={`rounded-xl p-2.5 ${tone === 'brand' ? 'bg-brand-50' : 'bg-slate-50'}`}>
      <p className="flex items-center gap-1.5 text-[11px] font-bold text-ink">
        <span className={tone === 'brand' ? 'text-brand-600' : 'text-ink-soft'}>{avatar}</span>
        {who}
      </p>
      <p className="mt-0.5 text-[11.5px] leading-snug text-ink-soft">{text}</p>
    </div>
  )
}
