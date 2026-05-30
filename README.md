# RentACot Go — Cyprus Baby Gear Rental Marketplace (Frontend Demo)

A mobile-first, clickable **frontend demo** of a Cyprus-based baby gear rental
marketplace where travellers rent strollers, car seats, cribs, travel beds,
high chairs and toy bundles from verified local providers.

This is **not just a rental app** — it is a *synchronised marketplace* with
geo-fenced availability, provider inventory, airport/hotel delivery
coordination, escrow-style payments, identity verification, handoff photo
verification, and dispute management.

> 100% frontend · mock data only · **no backend, no real Stripe, no real maps,
> no real APIs.** See [`BENCHMARK.md`](./BENCHMARK.md) for the competitive UX
> teardown that informed the design.

## Tech stack

- **React 18** + **Vite 5**
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- **React Router 6**
- Mobile-first responsive layout, rendered inside a phone frame on desktop.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
# or
npm run build && npm run preview
```

## Navigation (bottom tab bar)

`Home · Search · Bookings · Provider · Profile`

The mobile app is customer- and provider-facing. **Admin / Operations is
deliberately not in the bottom nav** — it lives at a hidden internal route
(`/internal/operations`, also `/admin`), representing a separate internal/web
staff dashboard. A discreet "Staff · internal operations" link is available at
the bottom of the Profile screen for the demo.

## Screens

1. **Onboarding / Home** — hero, categories, pickup zones, value props,
   instant-book rail, sleep essentials.
2. **Marketplace Search** — query, category chips, filter sheet (zone, price,
   instant), sort, geo-aware results.
3. **Item Detail** — specs, what's included, provider card, trust badges,
   delivery options, **geo-fenced availability**, reviews, price breakdown.
4. **Booking Flow / State Machine** — 4-step wizard (Dates → Delivery →
   Identity → Payment) that drives the booking into the lifecycle.
5. **Customer Booking Status** — live status, lifecycle steps, handoff photos,
   escrow strip, audit timeline, and actions to advance the machine.
6. **Provider Dashboard** — switchable provider, KPIs, action queue,
   inventory availability, escrow payout balance.
7. **Profile** (mobile tab) — user summary with verification status, role
   switcher (Customer / Provider), account & verification, travel preferences,
   saved items (wishlist, recently viewed, favourite providers), support &
   safety, and settings.

### Internal (not a mobile tab)

- **Admin / Operations View** (`/internal/operations`) — marketplace KPIs,
  bookings-by-state distribution, trust posture, **dispute management** with
  before/after photo evidence and resolution actions. Represents a separate
  internal/web staff dashboard.

## The booking state machine

Defined in [`src/lib/bookingMachine.js`](./src/lib/bookingMachine.js):

```
Draft → Pending Hold → Payment Authorized → Provider Accepted →
In Delivery → Active Rental → Return Inspection → Completed
```

Side branches: `Declined`, `Cancelled`, `Disputed`, `Refunded`.

Each transition declares the **actor** allowed to trigger it
(`customer` / `provider` / `admin` / `system`) and a plain-language note.
The same machine powers the customer status screen, the provider action queue,
and admin dispute resolution — state changes propagate live across all views
via a shared store ([`src/store/StoreContext.jsx`](./src/store/StoreContext.jsx)).

## Mock data

[`src/data/mockData.js`](./src/data/mockData.js): **10 items**, **6 providers**,
**8 bookings** (one in each lifecycle stage), Cyprus locations (Larnaca Airport,
Paphos Airport, Limassol, Ayia Napa, Protaras, Nicosia), and **2 dispute
cases** with before/after handoff photo placeholders.

## Try the full loop

1. **Search** → open an item → **Reserve** → complete the 4-step booking flow.
2. You land on **Booking Status** in `Payment Authorized`.
3. Switch to **Provider** → the new booking appears in *Needs your action* →
   **Accept** → **Start delivery** → **Confirm handoff**.
4. Advance to **Return Inspection** → **Flag damage** to open a dispute.
5. Go to **Admin → Disputes** → resolve it for traveller or provider.

## Project structure

```
src/
  lib/bookingMachine.js      # states, transitions, styling, helpers
  store/StoreContext.jsx     # shared bookings/disputes/draft store
  data/mockData.js           # all mock data
  components/                # Icons, ui primitives, nav, cards, lifecycle…
  screens/                   # the 7 app screens
  App.jsx                    # phone frame + routes + bottom nav
```

## Design direction

Premium travel-tech: clean white canvas, soft blue/teal-green accents, rounded
cards, professional marketplace tone — deliberately **not** a childish
baby-themed UI.
