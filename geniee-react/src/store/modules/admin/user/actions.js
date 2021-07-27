import { createActions } from 'redux-actions';

export const {
  editUser,
  removeUser,
  updateUsers,
  editUserAtomic,
  updateLoggedUser,
  updateUserHistory,
  updateColumnSettings,
} = createActions(
  'EDIT_USER',
  'REMOVE_USER',
  'UPDATE_USERS',
  'EDIT_USER_ATOMIC',
  'UPDATE_LOGGED_USER',
  'UPDATE_USER_HISTORY',
  'UPDATE_COLUMN_SETTINGS',
);
