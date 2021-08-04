import { createActions } from 'redux-actions';

export const {
  editEvent,
  removeEvent,
  updateEvents,
} = createActions(
  'EDIT_EVENT',
  'REMOVE_EVENT',
  'UPDATE_EVENTS',
);
