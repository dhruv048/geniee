import { createActions } from 'redux-actions';

export const {
  editOption,
  removeOption,
  updateOptions,
  updatePasswordPolicy,
} = createActions(
  'EDIT_OPTION',
  'REMOVE_OPTION',
  'UPDATE_OPTIONS',
  'UPDATE_PASSWORD_POLICY',
);
