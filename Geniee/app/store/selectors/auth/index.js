import { createSelector } from 'reselect';

export const authContainer = ({ auth }) => auth;

export const authCurrentUserSelector = createSelector(
  [authContainer],
  ({ userId }) => ({ userId }),
);

export const authActionsSelector = createSelector(
  [authContainer],
  ({ actions }) => ({ actions }),
);

export const authTokenSelector = createSelector(
  [authContainer],
  ({ token }) => ({ token }),
);

export const loggedUserSelector = createSelector(
  [authContainer],
  ({ loggedUser }) => ({ loggedUser }),
);
