import { createActions } from 'redux-actions';

export const {
  editProtocol,
  removeProtocol,
  updateProtocols,
  editProtocolAtomic,
} = createActions(
  'EDIT_PROTOCOL',
  'REMOVE_PROTOCOL',
  'UPDATE_PROTOCOLS',
  'EDIT_PROTOCOL_ATOMIC',
);
