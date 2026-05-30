/*
  Derived provider business metrics for the provider console.
  Pure functions over the store's bookings/items, padded with light mock
  data so the dashboard feels like a real operating business.
*/

import { itemById } from '../data/mockData'
import { STATES, isTerminal } from './bookingMachine'

const PLATFORM_FEE = 0.15 // 15% marketplace take rate

export function providerBookings(bookings, providerId) {
  return bookings.filter((b) => b.providerId === providerId)
}

export function providerItems(items, providerId) {
  return items.filter((i) => i.providerId === providerId)
}

export function bookingRevenue(b) {
  const item = itemById(b.itemId)
  if (!item) return 0
  return item.weekPrice
}

export function computeStats(bookings, items, providerId) {
  const mine = providerBookings(bookings, providerId)
  const myItems = providerItems(items, providerId)

  const active = mine.filter((b) => b.state === STATES.ACTIVE_RENTAL)
  const pending = mine.filter((b) => b.state === STATES.PAYMENT_AUTHORIZED)
  const inDelivery = mine.filter((b) => b.state === STATES.IN_DELIVERY)
  const accepted = mine.filter((b) => b.state === STATES.PROVIDER_ACCEPTED)
  const settled = mine.filter((b) =>
    [STATES.ACTIVE_RENTAL, STATES.RETURN_INSPECTION, STATES.COMPLETED].includes(b.state),
  )
  const completed = mine.filter((b) => b.state === STATES.COMPLETED)

  const grossEarnings = settled.reduce((s, b) => s + bookingRevenue(b), 0)
  const platformFees = Math.round(grossEarnings * PLATFORM_FEE)
  const netEarnings = grossEarnings - platformFees
  const escrowHeld = mine
    .filter((b) => !isTerminal(b.state))
    .reduce((s, b) => s + (itemById(b.itemId)?.deposit || 0), 0)
  const pendingPayout = completed.reduce((s, b) => s + Math.round(bookingRevenue(b) * (1 - PLATFORM_FEE)), 0)

  // Monthly earnings figure padded so it reads like a real month.
  const monthlyEarnings = netEarnings + 1240

  const ratedItems = myItems.filter((i) => i.rating > 0)
  const avgRating = ratedItems.length
    ? (ratedItems.reduce((s, i) => s + i.rating, 0) / ratedItems.length).toFixed(2)
    : '—'

  return {
    mine,
    myItems,
    counts: {
      active: active.length,
      pending: pending.length,
      inDelivery: inDelivery.length,
      accepted: accepted.length,
      upcomingDeliveries: accepted.length + inDelivery.length,
      items: myItems.length,
    },
    active,
    pending,
    inDelivery,
    accepted,
    completed,
    grossEarnings,
    platformFees,
    netEarnings,
    monthlyEarnings,
    escrowHeld,
    pendingPayout,
    avgRating,
    responseRate: 98,
    acceptanceRate: 94,
    occupancy: Math.min(96, 48 + myItems.length * 6),
    utilization: Math.min(92, 40 + settled.length * 9),
  }
}

// Per-item performance for inventory & analytics.
export function itemPerformance(item, bookings) {
  const rel = bookings.filter((b) => b.itemId === item.id)
  const earnings = rel
    .filter((b) => [STATES.ACTIVE_RENTAL, STATES.RETURN_INSPECTION, STATES.COMPLETED].includes(b.state))
    .reduce((s) => s + item.weekPrice, 0)
  // Pad bookings count with historical (mock) volume keyed off review count.
  const lifetimeBookings = rel.length + Math.round(item.reviews / 6)
  const revenuePerItem = earnings + Math.round(item.reviews * item.pricePerDay * 0.8)
  const utilization = Math.min(98, 35 + (item.reviews % 50) + rel.length * 8)
  return { earnings, lifetimeBookings, revenuePerItem, utilization, activeNow: rel.some((b) => b.state === STATES.ACTIVE_RENTAL) }
}

// 7-month revenue series for the earnings chart (mock, deterministic).
export function revenueSeries(monthlyEarnings) {
  const base = [62, 48, 71, 83, 90, 76]
  const labels = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May']
  const scale = monthlyEarnings / 100
  return labels.map((label, i) => ({ label, value: Math.round(base[i] * scale) }))
}

export function weekdayDemand() {
  return [
    { label: 'Mon', value: 32 },
    { label: 'Tue', value: 28 },
    { label: 'Wed', value: 41 },
    { label: 'Thu', value: 55 },
    { label: 'Fri', value: 78, highlight: true },
    { label: 'Sat', value: 92, highlight: true },
    { label: 'Sun', value: 64 },
  ]
}

export function demandHeatmap() {
  return [
    [1, 1, 2, 2, 3, 4, 3],
    [1, 2, 2, 3, 4, 4, 3],
    [2, 2, 3, 3, 4, 4, 4],
    [1, 1, 2, 3, 3, 4, 3],
  ]
}
