import { createSelector } from 'reselect';

export const categoryContainer = ({ categories }) => categories;

export const categorySelector = createSelector(
  [categoryContainer],
  ({ categories,businessType }) => ({ categories,businessType }),
);