/* eslint-disable max-len */
import Meteor from 'meteor-react-js';
import { handleActions } from 'redux-actions';

import {
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
  setToken,
  setRequirePasswordChange,
} from './actions';

export default handleActions(
  {
    [wrongEmailPassword]: (state) => ({
      ...state,
      email: null,
      password: null,
      actions: {
        ...state.actions,
        loginError: true,
      },
    }),
    [emailNotFound]: (state) => ({
      ...state,
      email: null,
      actions: {
        ...state.actions,
        emailNotFound: true,
      },
    }),
    [emailExists]: (state) => ({
      ...state,
      password: null,
      actions: {
        ...state.actions,
        emailExists: true,
      },
    }),
    [resetEmailSent]: (state) => ({
      ...state,
      actions: {
        ...state.actions,
        emailSent: true,
      },
    }),
    [resetActions]: (state, { payload: { action } }) => ({
      ...state,
      actions: {
        ...state.actions,
        [action]: false,
      },
    }),
    [setSignedIn]: (state,{ payload: { userId } }) => ({
      ...state,
      actions: {
        ...state.actions,
        signedIn: true,
      },
      userId: userId,
    }),
    [setToken]: (state, { payload: { token } }) => ({
      ...state,
      token: token,
    }),
    [setSignedOut]: (state) => ({
      ...state,
      actions: {
        emailNotFound: false,
        emailExists: false,
        emailSent: false,
        loginError: false,
        signedIn: false,
        signedUp: false,
        passwordsMatch: false,
        passwordUpdated: false,
        tokenError: false,
      },
    }),
    [setSignedUp]: (state) => ({
      ...state,
      actions: {
        ...state.actions,
        signedUp: true,
      },
    }),
    [setPasswordChanged]: (state, { payload: { isSuccess } }) => ({
      ...state,
      actions: {
        ...state.actions,
        passwordUpdated: isSuccess,
        passwordChangeError: !isSuccess,
      },
    }),
    [setTokenValidated]: (state, { payload: { isValidToken, userId = null } }) => ({
      ...state,
      userId,
      actions: {
        ...state.actions,
        tokenError: !isValidToken,
      },
      token: {
        isTokenValidated: true,
        isValidToken,
      },
    }),
    [setRequirePasswordChange]: (state) => ({
      ...state,
      actions: {
        ...state.actions,
        requiresPasswordChange: true,
      },
    }),
  },
  {
    userId: null,
    user:null,
    actions: {
      emailNotFound: false,
      emailExists: false,
      emailSent: false,
      loginError: false,
      signedIn: false,
      signedUp: false,
      passwordsMatch: false,
      passwordUpdated: false,
      tokenError: false,
      requiresPasswordChange: false,
    },
    token: {
      isTokenValidated: false,
      isValidToken: false,
    },
  },
);
