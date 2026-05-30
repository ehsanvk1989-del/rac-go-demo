import { createContext, useContext, useMemo, useReducer, useCallback } from 'react'
import { BOOKINGS, DISPUTES } from '../data/mockData'
import { STATES } from '../lib/bookingMachine'

const StoreContext = createContext(null)

function nowStamp() {
  // Stable-ish stamp for the demo timeline.
  const d = new Date('2026-05-30T12:00:00')
  return d.toISOString().slice(0, 16).replace('T', ' ')
}

const initialState = {
  bookings: BOOKINGS,
  disputes: DISPUTES,
  // The in-progress booking the customer is building in the Booking Flow.
  draft: null,
  // Which actor "lens" the demo is viewed through (affects allowed actions).
  role: 'customer',
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_ROLE':
      return { ...state, role: action.role }

    case 'START_DRAFT':
      return { ...state, draft: action.draft }

    case 'UPDATE_DRAFT':
      return { ...state, draft: { ...state.draft, ...action.patch } }

    case 'CLEAR_DRAFT':
      return { ...state, draft: null }

    case 'COMMIT_DRAFT': {
      // Turn the working draft into a real booking in Draft state.
      const draft = state.draft
      if (!draft) return state
      const id = action.id
      const booking = {
        id,
        itemId: draft.itemId,
        providerId: draft.providerId,
        customer: 'You (demo traveller)',
        locationId: draft.locationId,
        delivery: draft.delivery,
        startDate: draft.startDate,
        endDate: draft.endDate,
        days: draft.days,
        flightNo: draft.flightNo || null,
        hotel: draft.hotel || null,
        state: STATES.DRAFT,
        isYours: true,
        history: [{ state: STATES.DRAFT, at: nowStamp(), actor: 'customer' }],
      }
      return { ...state, bookings: [booking, ...state.bookings], draft: null }
    }

    case 'TRANSITION': {
      const { bookingId, to, actor } = action
      const bookings = state.bookings.map((b) => {
        if (b.id !== bookingId) return b
        const history = [...b.history, { state: to, at: nowStamp(), actor }]
        const patch = { state: to, history }
        // Capturing handoff photos as we hit active rental.
        if (to === STATES.ACTIVE_RENTAL) patch.handoffPhotos = true
        return { ...b, ...patch }
      })
      // Opening a dispute creates a case record.
      let disputes = state.disputes
      if (to === STATES.DISPUTED) {
        const b = state.bookings.find((x) => x.id === bookingId)
        if (b && !disputes.some((d) => d.bookingId === bookingId)) {
          disputes = [
            {
              id: `DSP-${String(20 + disputes.length).padStart(3, '0')}`,
              bookingId,
              itemId: b.itemId,
              providerId: b.providerId,
              customer: b.customer,
              openedAt: nowStamp(),
              status: 'Under review',
              amountHeld: 0,
              reason: 'Issue raised from the booking timeline.',
              customerClaim: 'Awaiting details from the traveller.',
              providerClaim: 'Awaiting details from the provider.',
              before: { label: 'Handoff photo', tone: 'from-teal-100 to-brand-200', note: 'On file' },
              after: { label: 'Return photo', tone: 'from-rose-100 to-amber-100', note: 'On file' },
            },
            ...disputes,
          ]
        }
      }
      return { ...state, bookings, disputes }
    }

    default:
      return state
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const transition = useCallback((bookingId, to, actor) => {
    dispatch({ type: 'TRANSITION', bookingId, to, actor })
  }, [])

  const value = useMemo(
    () => ({
      ...state,
      setRole: (role) => dispatch({ type: 'SET_ROLE', role }),
      startDraft: (draft) => dispatch({ type: 'START_DRAFT', draft }),
      updateDraft: (patch) => dispatch({ type: 'UPDATE_DRAFT', patch }),
      clearDraft: () => dispatch({ type: 'CLEAR_DRAFT' }),
      commitDraft: (id) => dispatch({ type: 'COMMIT_DRAFT', id }),
      transition,
    }),
    [state, transition],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
