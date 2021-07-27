import { createActions } from 'redux-actions';

export const {
  wrongEmailPassword,
  emailNotFound,
  emailExists,
  resetEmailSent,
  resetActions,
  setSignedIn,
  setSignedOut,
  setSignedUp,
  setPasswordChanged,
  setTokenValidated,
  setRequirePasswordChange,
} = createActions(
  'WRONG_EMAIL_PASSWORD',
  'EMAIL_NOT_FOUND',
  'EMAIL_EXISTS',
  'RESET_EMAIL_SENT',
  'RESET_ACTIONS',
  'SET_SIGNED_IN',
  'SET_SIGNED_OUT',
  'SET_SIGNED_UP',
  'SET_PASSWORD_CHANGED',
  'SET_TOKEN_VALIDATED',
  'SET_REQUIRE_PASSWORD_CHANGE',
);
