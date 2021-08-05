import { createActions } from 'redux-actions';

export const {
  setSignedIn,
  wrongEmailPassword,
  setSignedOut,
  setLoggedInUser,
} = createActions(
  'SET_SIGNED_IN',
  'WRONG_EMAIL_PASSWORD',
  'SET_SIGNED_OUT',
  'SET_LOGGED_IN_USER',
);
