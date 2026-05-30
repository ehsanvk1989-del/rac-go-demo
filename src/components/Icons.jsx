/* Lightweight inline SVG icon set — no external icon dependency. */

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

function svg(children, props) {
  const { size = 22, ...rest } = props || {}
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} {...base} {...rest}>
      {children}
    </svg>
  )
}

export const Icon = {
  home: (p) => svg(<><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V20h14V9.5" /><path d="M9.5 20v-5h5v5" /></>, p),
  search: (p) => svg(<><circle cx="11" cy="11" r="7" /><path d="m20 20-3.2-3.2" /></>, p),
  bookings: (p) => svg(<><rect x="4" y="3.5" width="16" height="17" rx="2.5" /><path d="M8 3.5v3M16 3.5v3M8 12h8M8 16h5" /></>, p),
  provider: (p) => svg(<><path d="M3 9.5 12 4l9 5.5" /><path d="M5 9v10h14V9" /><path d="M9 19v-5h6v5" /><path d="M3 9.5h18" /></>, p),
  admin: (p) => svg(<><path d="M12 3 4 6v5c0 4.5 3.3 7.7 8 9 4.7-1.3 8-4.5 8-9V6l-8-3Z" /><path d="m9 12 2 2 4-4" /></>, p),
  star: (p) => svg(<path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17l-5.2 2.7 1-5.8L3.5 9.7l5.9-.9L12 3.5Z" fill="currentColor" stroke="none" />, p),
  shield: (p) => svg(<><path d="M12 3 5 5.5V11c0 4 2.9 7.2 7 8.5 4.1-1.3 7-4.5 7-8.5V5.5L12 3Z" /><path d="m9 11.5 2 2 4-4" /></>, p),
  pin: (p) => svg(<><path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></>, p),
  plane: (p) => svg(<path d="M10.5 13.5 3 11l1-2 6.5 1L15 4.5a1.6 1.6 0 0 1 2.6 1.8L14 12l1 7-2 .8-2.5-6.3-3 2.5.2 2.5-1.5.6-1.7-3.3L1.7 15" />, p),
  truck: (p) => svg(<><rect x="2.5" y="6.5" width="11" height="9" rx="1.5" /><path d="M13.5 9.5H18l3 3v3h-7.5" /><circle cx="7" cy="17.5" r="1.8" /><circle cx="17" cy="17.5" r="1.8" /></>, p),
  clock: (p) => svg(<><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>, p),
  check: (p) => svg(<path d="m5 12.5 4.5 4.5L19 7" />, p),
  checkCircle: (p) => svg(<><circle cx="12" cy="12" r="8.5" /><path d="m8.5 12 2.3 2.3L16 9" /></>, p),
  bolt: (p) => svg(<path d="M13 3 5 13h5l-1 8 8-10h-5l1-8Z" />, p),
  lock: (p) => svg(<><rect x="5" y="10.5" width="14" height="9.5" rx="2" /><path d="M8 10.5V8a4 4 0 1 1 8 0v2.5" /></>, p),
  camera: (p) => svg(<><path d="M4 8.5h3l1.3-2h7.4L18 8.5h2a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 20 19.5H4A1.5 1.5 0 0 1 2.5 18v-8A1.5 1.5 0 0 1 4 8.5Z" /><circle cx="12" cy="13.5" r="3.2" /></>, p),
  id: (p) => svg(<><rect x="3" y="5" width="18" height="14" rx="2.5" /><circle cx="8.5" cy="11" r="2" /><path d="M5.5 16c.5-1.6 1.7-2.3 3-2.3s2.5.7 3 2.3M14 9.5h4M14 13h4M14 16h2.5" /></>, p),
  chevron: (p) => svg(<path d="m9 6 6 6-6 6" />, p),
  chevronLeft: (p) => svg(<path d="m15 6-6 6 6 6" />, p),
  filter: (p) => svg(<path d="M3 6h18M6 12h12M10 18h4" />, p),
  close: (p) => svg(<path d="m6 6 12 12M18 6 6 18" />, p),
  calendar: (p) => svg(<><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M4 9h16M8 3v4M16 3v4" /></>, p),
  scale: (p) => svg(<><path d="M12 4v16M7 20h10M5 8h14" /><path d="M5 8 2.5 13a2.5 2.5 0 0 0 5 0L5 8ZM19 8l-2.5 5a2.5 2.5 0 0 0 5 0L19 8Z" /></>, p),
  wallet: (p) => svg(<><rect x="3" y="6" width="18" height="13" rx="2.5" /><path d="M3 10h18M16.5 14h1.5" /></>, p),
  spark: (p) => svg(<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />, p),
  users: (p) => svg(<><circle cx="9" cy="9" r="3" /><path d="M3.5 19c.6-3 3-4.5 5.5-4.5S14 16 14.5 19" /><path d="M15.5 6.2a3 3 0 0 1 0 5.6M17 14.6c2 .6 3.2 2 3.5 4.4" /></>, p),
  box: (p) => svg(<><path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5v-9Z" /><path d="M3.5 7.5 12 12l8.5-4.5M12 12v9" /></>, p),
  doc: (p) => svg(<><path d="M6 3h8l4 4v14H6V3Z" /><path d="M14 3v4h4M9 12h6M9 16h6" /></>, p),
  globe: (p) => svg(<><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17M12 3.5c2.5 2.3 2.5 14.7 0 17M12 3.5c-2.5 2.3-2.5 14.7 0 17" /></>, p),
  alert: (p) => svg(<><path d="M12 4 3 19h18L12 4Z" /><path d="M12 10v4M12 16.5v.5" /></>, p),
}

export function CategoryIcon({ id, size = 30, className = '' }) {
  const map = {
    stroller: <><circle cx="7" cy="19" r="2" /><circle cx="17" cy="19" r="2" /><path d="M4 5h2l2.5 9h8l2-6H8" /></>,
    'car-seat': <><path d="M7 4h7l1.5 7H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3Z" /><path d="M7 11v5a2 2 0 0 0 2 2h6M9 8h3" /></>,
    crib: <><path d="M4 6v13M20 6v13M4 9h16M4 15h16" /><path d="M7 6v9M11 6v9M15 6v9M18.5 6v9" /></>,
    'travel-bed': <><rect x="3" y="9" width="18" height="7" rx="2" /><path d="M3 16v3M21 16v3M6 9V7M18 9V7" /></>,
    'high-chair': <><path d="M7 4h7l-1 8H8L7 4Z" /><path d="M8 12 6 20M13 12l2 8M7 16h7" /></>,
    toys: <><circle cx="9" cy="9" r="4" /><rect x="13" y="12" width="7" height="7" rx="1.5" /><path d="M4 19h6" /></>,
  }
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} {...base}>
      {map[id] || map.toys}
    </svg>
  )
}
