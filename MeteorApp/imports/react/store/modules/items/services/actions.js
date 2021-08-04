import { createActions } from 'redux-actions';

export const {
  editService,
  removeService,
  updateServices,
} = createActions(
  'EDIT_SERVICE',
  'REMOVE_SERVICE',
  'UPDATE_SERVICES',
);
