import { createActions } from 'redux-actions';

export const {
  editGuest,
  removeGuest,
  updateGuests,
  editGuestAtomic,
  updateGuestImage,
} = createActions(
  'EDIT_GUEST',
  'REMOVE_GUEST',
  'UPDATE_GUESTS',
  'EDIT_GUEST_ATOMIC',
  'UPDATE_GUEST_IMAGE',
);
