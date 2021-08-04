import { createActions } from 'redux-actions';

export const {
  editGuestProtocol,
  removeGuestProtocol,
  updateGuestProtocols,
  updateProtocolDays,
  updateProtocolsFocus,
  updateProtocolInstructions,
} = createActions(
  'EDIT_GUEST_PROTOCOL',
  'REMOVE_GUEST_PROTOCOL',
  'UPDATE_GUEST_PROTOCOLS',
  'UPDATE_PROTOCOL_DAYS',
  'UPDATE_PROTOCOLS_FOCUS',
  'UPDATE_PROTOCOL_INSTRUCTIONS',
);
