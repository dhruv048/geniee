import { createSelector } from 'reselect';

export const businessContainer = (categories) => categories;

export const getCategoriesSelector = createSelector(
  [businessContainer],
  (categories) => (categories),
);
