import { createActions } from 'redux-actions';

export const {
  editGuestSession,
  removeGuestSession,
  updateGuestSessions,
  editGuestSessionAtomic,
  updateGuestSessionData,
  updateGuestSessionsData,
  editGuestSessionDataAtomic,
  removeGuestSessionSpending,
  updateGuestSessionsSpendings,
} = createActions(
  'EDIT_GUEST_SESSION',
  'REMOVE_GUEST_SESSION',
  'UPDATE_GUEST_SESSIONS',
  'EDIT_GUEST_SESSION_ATOMIC',
  'UPDATE_GUEST_SESSION_DATA',
  'UPDATE_GUEST_SESSIONS_DATA',
  'EDIT_GUEST_SESSION_DATA_ATOMIC',
  'REMOVE_GUEST_SESSION_SPENDING',
  'UPDATE_GUEST_SESSIONS_SPENDINGS',
);
