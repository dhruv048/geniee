import { createSelector } from 'reselect';

export const cartContainer = ({ cart }) => cart;

export const categorySelector = createSelector(
  [cartContainer],
  ({ cartItems }) => ({ cartItems }),
);