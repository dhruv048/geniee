import { createActions } from 'redux-actions';

export const {
  editGuestService,
  removeGuestService,
  updateGuestServices,
} = createActions(
  'EDIT_GUEST_SERVICE',
  'REMOVE_GUEST_SERVICE',
  'UPDATE_GUEST_SERVICES',
);
