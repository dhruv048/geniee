/* eslint-disable max-len */
import { handleActions } from 'redux-actions';
import Meteor from '../../../react-native-meteor';

import {
  setSignedIn,
  wrongEmailPassword,
  setSignedOut,
  setLoggedInUser,
} from './actions';

export default handleActions(
  {
    [setSignedIn]: (state) => ({
      ...state,
      actions: {
        ...state.actions,
        signedIn: true,
      },
    }),
    [wrongEmailPassword]: (state) => ({
      ...state,
      actions: {
        ...state.actions,
        loginError: true,
        signedIn: false,
      },
    }),
    [setSignedOut]: (state) => ({
      ...state,
      loggedUser:'',
      actions: {
        loginError: false,
        signedIn: false,
        signedUp: false,
        tokenError: false,
      },
    }),
    [setLoggedInUser]: (state, {payload:{user}}) => ({
      ...state,
      loggedUser: user,
    }),
  },
  {
    userId: null,
    email: '',
    password: '',
    loggedUser:'',
    actions: {
      loading: false,
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
