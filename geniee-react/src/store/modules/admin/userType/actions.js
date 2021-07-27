import { createActions } from 'redux-actions';

export const {
  editUserType,
  editUserTypeAtomic,
  removeUserType,
  updateUserTypes,
} = createActions(
  'EDIT_USER_TYPE',
  'EDIT_USER_TYPE_ATOMIC',
  'REMOVE_USER_TYPE',
  'UPDATE_USER_TYPES',
);
