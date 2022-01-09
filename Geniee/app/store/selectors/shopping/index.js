import { createSelector } from 'reselect';

export const cartContainer = ({ cart }) => cart;

export const cartSelector = createSelector(
  [cartContainer],
  ({ cartItems }) => ({ cartItems }),
);

export const cartItemSelector = createSelector(
  [cartContainer],
  ({ cartItems }) => ({ cartItems }),
);