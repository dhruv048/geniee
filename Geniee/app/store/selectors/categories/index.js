import { createSelector } from 'reselect';

export const categoryContainer = ({category}) => category;
export const categorySelector = createSelector(
  [categoryContainer],
  ({ categories }) => ({ categories}),
);

export const businessTypesSelector = createSelector(
  [categoryContainer],
  ({ businessTypes }) => ({ businessTypes}),
);
