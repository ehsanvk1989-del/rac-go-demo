import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ITEMS, CATEGORIES, LOCATIONS } from '../data/mockData'
import { CategoryIcon, Icon } from '../components/Icons'
import { Sheet } from '../components/ui'
import ItemCard from '../components/ItemCard'
import { TabHeader } from '../components/ScreenHeader'

const SORTS = [
  { id: 'recommended', label: 'Recommended' },
  { id: 'price-low', label: 'Price · low to high' },
  { id: 'price-high', label: 'Price · high to low' },
  { id: 'rating', label: 'Top rated' },
]

export default function Search() {
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const cat = params.get('cat') || ''
  const loc = params.get('loc') || ''
  const instant = params.get('instant') === '1'
  const sort = params.get('sort') || 'recommended'
  const maxPrice = Number(params.get('max') || 0)

  const setParam = (key, value) => {
    const next = new URLSearchParams(params)
    if (!value) next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  const results = useMemo(() => {
    let list = ITEMS.filter((i) => {
      if (cat && i.category !== cat) return false
      if (loc && !i.serves.includes(loc)) return false
      if (instant && !i.instantBook) return false
      if (maxPrice && i.pricePerDay > maxPrice) return false
      if (query) {
        const q = query.toLowerCase()
        const cl = CATEGORIES.find((c) => c.id === i.category)?.label.toLowerCase() || ''
        if (!i.name.toLowerCase().includes(q) && !cl.includes(q)) return false
      }
      return true
    })
    if (sort === 'price-low') list = [...list].sort((a, b) => a.pricePerDay - b.pricePerDay)
    if (sort === 'price-high') list = [...list].sort((a, b) => b.pricePerDay - a.pricePerDay)
    if (sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating)
    return list
  }, [cat, loc, instant, maxPrice, query, sort])

  const activeLoc = LOCATIONS.find((l) => l.id === loc)
  const filterCount = [cat, loc, instant ? '1' : '', maxPrice ? '1' : ''].filter(Boolean).length

  return (
    <div>
      <TabHeader eyebrow="Marketplace" title="Find your gear" />

      {/* Search bar */}
      <div className="sticky top-0 z-20 mt-3 bg-canvas/95 px-4 pb-3 pt-1 backdrop-blur">
        <div className="flex gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-2xl bg-white px-3.5 py-3 shadow-soft ring-1 ring-line/70">
            <Icon.search size={18} className="text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search strollers, car seats…"
              className="w-full bg-transparent text-[13px] font-medium text-ink outline-none placeholder:text-muted"
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-muted">
                <Icon.close size={16} />
              </button>
            )}
          </div>
          <button
            onClick={() => setFiltersOpen(true)}
            className="relative flex items-center gap-1.5 rounded-2xl bg-ink px-4 text-[13px] font-semibold text-white active:scale-95"
          >
            <Icon.filter size={17} />
            {filterCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold ring-2 ring-canvas">
                {filterCount}
              </span>
            )}
          </button>
        </div>

        {/* Category chips */}
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
          <button
            onClick={() => setParam('cat', '')}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-semibold ${
              !cat ? 'bg-brand-600 text-white' : 'bg-white text-ink-soft ring-1 ring-line'
            }`}
          >
            All
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setParam('cat', cat === c.id ? '' : c.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-semibold ${
                cat === c.id ? 'bg-brand-600 text-white' : 'bg-white text-ink-soft ring-1 ring-line'
              }`}
            >
              <CategoryIcon id={c.id} size={15} />
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Active location banner */}
      {activeLoc && (
        <div className="mx-4 mt-1 flex items-center gap-2 rounded-xl bg-teal-50 px-3 py-2 text-[12px] font-semibold text-teal-700">
          {activeLoc.type === 'airport' ? <Icon.plane size={15} /> : <Icon.pin size={15} />}
          Showing gear available around {activeLoc.name}
          <button onClick={() => setParam('loc', '')} className="ml-auto text-teal-600">
            <Icon.close size={15} />
          </button>
        </div>
      )}

      {/* Results */}
      <div className="px-4 pt-3">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[12px] font-semibold text-muted">{results.length} results</p>
          <p className="text-[11px] text-muted">
            Sorted by {SORTS.find((s) => s.id === sort)?.label}
          </p>
        </div>
        <div className="space-y-3">
          {results.map((i) => (
            <ItemCard key={i.id} item={i} />
          ))}
          {results.length === 0 && (
            <div className="rounded-2xl bg-white p-8 text-center shadow-soft ring-1 ring-line/70">
              <Icon.search size={28} className="mx-auto text-muted" />
              <p className="mt-2 text-[13px] font-semibold text-ink">No matches</p>
              <p className="mt-1 text-[12px] text-muted">Try widening your filters or dates.</p>
            </div>
          )}
        </div>
      </div>

      {/* Filters sheet */}
      <Sheet open={filtersOpen} onClose={() => setFiltersOpen(false)} title="Filters & sort">
        <div className="space-y-5">
          <div>
            <p className="mb-2 text-[12px] font-bold text-ink">Pickup zone</p>
            <div className="flex flex-wrap gap-2">
              {LOCATIONS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setParam('loc', loc === l.id ? '' : l.id)}
                  className={`rounded-full px-3 py-1.5 text-[12px] font-semibold ${
                    loc === l.id ? 'bg-brand-600 text-white' : 'bg-slate-100 text-ink-soft'
                  }`}
                >
                  {l.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-[12px] font-bold text-ink">Max price / day</p>
            <div className="flex flex-wrap gap-2">
              {[6, 9, 12, 0].map((p) => (
                <button
                  key={p}
                  onClick={() => setParam('max', maxPrice === p ? '' : p ? String(p) : '')}
                  className={`rounded-full px-3 py-1.5 text-[12px] font-semibold ${
                    (p === 0 && !maxPrice) || maxPrice === p ? 'bg-brand-600 text-white' : 'bg-slate-100 text-ink-soft'
                  }`}
                >
                  {p ? `Up to €${p}` : 'Any'}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setParam('instant', instant ? '' : '1')}
            className="flex w-full items-center justify-between rounded-xl bg-slate-50 px-3.5 py-3"
          >
            <span className="flex items-center gap-2 text-[13px] font-semibold text-ink">
              <Icon.bolt size={16} className="text-brand-500" /> Instant book only
            </span>
            <span className={`relative h-6 w-10 rounded-full transition ${instant ? 'bg-brand-500' : 'bg-line'}`}>
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${instant ? 'left-[1.15rem]' : 'left-0.5'}`} />
            </span>
          </button>

          <div>
            <p className="mb-2 text-[12px] font-bold text-ink">Sort by</p>
            <div className="grid grid-cols-2 gap-2">
              {SORTS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setParam('sort', s.id)}
                  className={`rounded-xl px-3 py-2.5 text-[12px] font-semibold ${
                    sort === s.id ? 'bg-brand-50 text-brand-700 ring-1 ring-brand-200' : 'bg-slate-50 text-ink-soft'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setFiltersOpen(false)}
            className="w-full rounded-2xl bg-brand-600 py-3.5 text-[14px] font-bold text-white active:scale-[0.99]"
          >
            Show {results.length} results
          </button>
        </div>
      </Sheet>
    </div>
  )
}
