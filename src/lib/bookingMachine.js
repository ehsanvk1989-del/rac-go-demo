/*
  Booking lifecycle state machine.

  This is the heart of what makes RentACot Go a *synchronised marketplace*
  rather than a simple rental app. A booking is a coordinated escrow-backed
  agreement between a traveller and a provider, moving through inspected,
  auditable states.

  Draft → Pending Hold → Payment Authorized → Provider Accepted →
  In Delivery → Active Rental → Return Inspection → Completed

  Side branches: Declined, Cancelled, Disputed, Refunded.
*/

export const STATES = {
  DRAFT: 'Draft',
  PENDING_HOLD: 'Pending Hold',
  PAYMENT_AUTHORIZED: 'Payment Authorized',
  PROVIDER_ACCEPTED: 'Provider Accepted',
  IN_DELIVERY: 'In Delivery',
  ACTIVE_RENTAL: 'Active Rental',
  RETURN_INSPECTION: 'Return Inspection',
  COMPLETED: 'Completed',
  DECLINED: 'Declined',
  CANCELLED: 'Cancelled',
  DISPUTED: 'Disputed',
  REFUNDED: 'Refunded',
}

// The "happy path" ordering, used for progress bars & timelines.
export const HAPPY_PATH = [
  STATES.DRAFT,
  STATES.PENDING_HOLD,
  STATES.PAYMENT_AUTHORIZED,
  STATES.PROVIDER_ACCEPTED,
  STATES.IN_DELIVERY,
  STATES.ACTIVE_RENTAL,
  STATES.RETURN_INSPECTION,
  STATES.COMPLETED,
]

/*
  Each transition declares:
  - to:     resulting state
  - label:  the action button text
  - actor:  who is allowed to trigger it (customer | provider | system | admin)
  - note:   plain-language explanation of what happens (shown in UI)
*/
export const TRANSITIONS = {
  [STATES.DRAFT]: [
    {
      to: STATES.PENDING_HOLD,
      label: 'Request availability hold',
      actor: 'customer',
      note: 'Geo-fenced inventory is checked against your dates and a soft hold is placed on the item.',
    },
    { to: STATES.CANCELLED, label: 'Discard draft', actor: 'customer', danger: true },
  ],
  [STATES.PENDING_HOLD]: [
    {
      to: STATES.PAYMENT_AUTHORIZED,
      label: 'Authorize payment (escrow)',
      actor: 'customer',
      note: 'Funds are authorized and held in escrow — not captured until the provider accepts and the item is handed over.',
    },
    { to: STATES.CANCELLED, label: 'Release hold', actor: 'customer', danger: true },
  ],
  [STATES.PAYMENT_AUTHORIZED]: [
    {
      to: STATES.PROVIDER_ACCEPTED,
      label: 'Accept booking',
      actor: 'provider',
      note: 'Provider confirms the item, blocks the dates on their inventory calendar, and commits to the delivery window.',
    },
    {
      to: STATES.DECLINED,
      label: 'Decline booking',
      actor: 'provider',
      danger: true,
      note: 'Escrow authorization is voided and the traveller is refunded in full.',
    },
  ],
  [STATES.PROVIDER_ACCEPTED]: [
    {
      to: STATES.IN_DELIVERY,
      label: 'Start delivery',
      actor: 'provider',
      note: 'Driver is dispatched to the airport/hotel handoff point. Live coordination begins.',
    },
    { to: STATES.CANCELLED, label: 'Cancel booking', actor: 'customer', danger: true },
  ],
  [STATES.IN_DELIVERY]: [
    {
      to: STATES.ACTIVE_RENTAL,
      label: 'Confirm handoff + photos',
      actor: 'provider',
      note: 'Both parties capture handoff photos. Escrow funds are captured. Identity verification is matched at the door.',
    },
    { to: STATES.DISPUTED, label: 'Raise handoff issue', actor: 'customer', danger: true },
  ],
  [STATES.ACTIVE_RENTAL]: [
    {
      to: STATES.RETURN_INSPECTION,
      label: 'Begin return inspection',
      actor: 'provider',
      note: 'Item is collected. Return photos are compared against the handoff set to assess condition.',
    },
    { to: STATES.DISPUTED, label: 'Report a problem', actor: 'customer', danger: true },
  ],
  [STATES.RETURN_INSPECTION]: [
    {
      to: STATES.COMPLETED,
      label: 'Approve return & settle',
      actor: 'provider',
      note: 'Condition matches handoff. Deposit released, provider paid out, booking closed.',
    },
    {
      to: STATES.DISPUTED,
      label: 'Flag damage / discrepancy',
      actor: 'provider',
      danger: true,
      note: 'A dispute case is opened with the before/after photo evidence for admin review.',
    },
  ],
  [STATES.DISPUTED]: [
    {
      to: STATES.COMPLETED,
      label: 'Resolve in provider favour',
      actor: 'admin',
      note: 'Admin reviews handoff vs return photos and settles the claim.',
    },
    {
      to: STATES.REFUNDED,
      label: 'Resolve in traveller favour',
      actor: 'admin',
      note: 'Admin issues a refund from escrow to the traveller.',
    },
  ],
  [STATES.COMPLETED]: [],
  [STATES.DECLINED]: [],
  [STATES.CANCELLED]: [],
  [STATES.REFUNDED]: [],
}

// Visual treatment per state (Tailwind tokens).
export const STATE_STYLES = {
  [STATES.DRAFT]: { dot: 'bg-muted', chip: 'bg-slate-100 text-slate-600' },
  [STATES.PENDING_HOLD]: { dot: 'bg-amber-soft', chip: 'bg-amber-50 text-amber-700' },
  [STATES.PAYMENT_AUTHORIZED]: { dot: 'bg-brand-400', chip: 'bg-brand-50 text-brand-700' },
  [STATES.PROVIDER_ACCEPTED]: { dot: 'bg-brand-500', chip: 'bg-brand-50 text-brand-700' },
  [STATES.IN_DELIVERY]: { dot: 'bg-brand-600', chip: 'bg-brand-100 text-brand-700' },
  [STATES.ACTIVE_RENTAL]: { dot: 'bg-teal-500', chip: 'bg-teal-50 text-teal-600' },
  [STATES.RETURN_INSPECTION]: { dot: 'bg-teal-600', chip: 'bg-teal-50 text-teal-600' },
  [STATES.COMPLETED]: { dot: 'bg-teal-600', chip: 'bg-teal-100 text-teal-600' },
  [STATES.DECLINED]: { dot: 'bg-rose-500', chip: 'bg-rose-50 text-rose-600' },
  [STATES.CANCELLED]: { dot: 'bg-slate-400', chip: 'bg-slate-100 text-slate-500' },
  [STATES.DISPUTED]: { dot: 'bg-rose-500', chip: 'bg-rose-50 text-rose-600' },
  [STATES.REFUNDED]: { dot: 'bg-slate-500', chip: 'bg-slate-100 text-slate-600' },
}

export function transitionsFor(state) {
  return TRANSITIONS[state] || []
}

export function isTerminal(state) {
  return transitionsFor(state).length === 0
}

export function progressIndex(state) {
  const i = HAPPY_PATH.indexOf(state)
  return i // -1 for side states
}
