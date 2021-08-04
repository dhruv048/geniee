import { createActions } from 'redux-actions';

export const {
  editGuestEvent,
  removeGuestEvent,
  updateGuestEvents,
} = createActions(
  'EDIT_GUEST_EVENT',
  'REMOVE_GUEST_EVENT',
  'UPDATE_GUEST_EVENTS',
);
