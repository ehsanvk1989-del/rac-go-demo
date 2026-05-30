import { useNavigate } from 'react-router-dom'
import { ITEMS, CATEGORIES, LOCATIONS } from '../data/mockData'
import { CategoryIcon, Icon } from '../components/Icons'
import { SectionTitle } from '../components/ui'
import ItemCard from '../components/ItemCard'

const VALUE_PROPS = [
  { icon: Icon.globe, title: 'Geo-fenced availability', text: 'Live inventory matched to your exact resort, city or airport zone.' },
  { icon: Icon.plane, title: 'Airport & hotel handoff', text: 'Coordinated meet-and-greet timed to your flight and check-in.' },
  { icon: Icon.lock, title: 'Escrow-style payments', text: 'Funds held safely and only released after a verified handoff.' },
  { icon: Icon.camera, title: 'Photo-verified condition', text: 'Before/after handoff photos protect both you and the provider.' },
]

export default function Home() {
  const navigate = useNavigate()
  const popular = ITEMS.filter((i) => i.instantBook).slice(0, 6)
  const cribs = ITEMS.filter((i) => ['crib', 'travel-bed'].includes(i.category))

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden rounded-b-[2rem] bg-gradient-to-br from-brand-600 via-brand-500 to-teal-500 px-5 pb-7 pt-7 text-white">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-white/10" />
        <div className="relative">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/80">
                RentACot Go · Cyprus
              </p>
              <h1 className="mt-1 text-[26px] font-extrabold leading-tight">
                Baby gear,<br />delivered to your holiday.
              </h1>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
              <Icon.shield size={24} />
            </div>
          </div>
          <p className="mt-2 max-w-[18rem] text-[13px] text-white/85">
            A verified provider marketplace — rent strollers, car seats & cribs from trusted locals across the island.
          </p>

          {/* Search trigger */}
          <button
            onClick={() => navigate('/search')}
            className="mt-5 flex w-full items-center gap-3 rounded-2xl bg-white px-4 py-3.5 text-left text-ink shadow-soft active:scale-[0.99]"
          >
            <Icon.search size={20} className="text-brand-500" />
            <span className="flex-1">
              <span className="block text-[13px] font-bold">Where are you staying?</span>
              <span className="block text-[11px] text-muted">Airport, resort or city · dates · gear</span>
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-brand-600">
              <Icon.chevron size={16} />
            </span>
          </button>

          <div className="mt-4 flex items-center gap-4 text-[11px] text-white/85">
            <span className="inline-flex items-center gap-1"><Icon.star size={13} /> 4.8 avg rating</span>
            <span className="inline-flex items-center gap-1"><Icon.users size={14} /> 6 verified providers</span>
            <span className="inline-flex items-center gap-1"><Icon.box size={14} /> 10 items live</span>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 pt-6">
        <SectionTitle action={<button onClick={() => navigate('/search')} className="text-[12px] font-semibold text-brand-600">See all</button>}>
          Browse by category
        </SectionTitle>
        <div className="grid grid-cols-3 gap-3">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => navigate(`/search?cat=${c.id}`)}
              className="flex flex-col items-center gap-2 rounded-2xl bg-white py-4 shadow-soft ring-1 ring-line/70 active:scale-95 transition"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <CategoryIcon id={c.id} size={24} />
              </span>
              <span className="text-[11.5px] font-semibold text-ink-soft">{c.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Destinations */}
      <section className="pt-6">
        <div className="px-4">
          <SectionTitle>Popular pickup zones</SectionTitle>
        </div>
        <div className="no-scrollbar flex gap-2.5 overflow-x-auto px-4 pb-1">
          {LOCATIONS.map((l) => (
            <button
              key={l.id}
              onClick={() => navigate(`/search?loc=${l.id}`)}
              className="flex shrink-0 items-center gap-2 rounded-full border border-line bg-white px-3.5 py-2 text-[12.5px] font-semibold text-ink-soft active:scale-95"
            >
              {l.type === 'airport' ? <Icon.plane size={15} className="text-brand-500" /> : <Icon.pin size={15} className="text-teal-500" />}
              {l.name}
            </button>
          ))}
        </div>
      </section>

      {/* Why us / synchronized marketplace */}
      <section className="px-4 pt-6">
        <SectionTitle>More than a rental — a synced marketplace</SectionTitle>
        <div className="grid grid-cols-2 gap-3">
          {VALUE_PROPS.map((v) => {
            const IconCmp = v.icon
            return (
              <div key={v.title} className="rounded-2xl bg-white p-3.5 shadow-soft ring-1 ring-line/70">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                  <IconCmp size={19} />
                </span>
                <p className="mt-2.5 text-[12.5px] font-bold text-ink">{v.title}</p>
                <p className="mt-1 text-[11px] leading-snug text-muted">{v.text}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Instant book rail */}
      <section className="pt-6">
        <div className="px-4">
          <SectionTitle action={<button onClick={() => navigate('/search')} className="text-[12px] font-semibold text-brand-600">View all</button>}>
            Instant book near you
          </SectionTitle>
        </div>
        <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-2">
          {popular.map((i) => (
            <ItemCard key={i.id} item={i} variant="rail" />
          ))}
        </div>
      </section>

      {/* Sleep essentials list */}
      <section className="px-4 pt-4">
        <SectionTitle>Sleep essentials</SectionTitle>
        <div className="space-y-3">
          {cribs.map((i) => (
            <ItemCard key={i.id} item={i} />
          ))}
        </div>
      </section>

      <p className="px-4 pt-6 text-center text-[10.5px] leading-relaxed text-muted">
        Demo only · mock data · no real payments, maps or APIs.<br />
        Inspired by leading baby-gear rental UX — original design.
      </p>
    </div>
  )
}
