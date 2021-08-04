import { createActions } from 'redux-actions';

export const {
  editSession,
  removeSession,
  updateSessions,
  editSessionAtomic,
} = createActions(
  'EDIT_SESSION',
  'REMOVE_SESSION',
  'UPDATE_SESSIONS',
  'EDIT_SESSION_ATOMIC',
);
