import { createSelector } from 'reselect';

export const categoryContainer = ({ categories }) => categories;

export const categorySelector = createSelector(
  [categoryContainer],
  ({ categories }) => ({ categories }),
);