import { createSelector } from 'reselect';
import { getProps } from 'helpers';

import { customProtocolsContainer } from '../base';

export const ingredientsSelector = createSelector(
  [customProtocolsContainer],
  ({ ingredients }) => ({ ingredients }),
);

export const ingredientByIdSelector = createSelector(
  [customProtocolsContainer, getProps],
  ({ ingredients }, { id }) => ({ ingredient: ingredients[id] }),
);

export const ingredietSuppliersByIdSelector = createSelector(
  [customProtocolsContainer, getProps],
  ({ ingredients }, { ingredient: { id } }) => ({
    ingredientSuppliers: (ingredients && ingredients[id] && ingredients[id].supplierInfo) || {} }),
);

export const ingredientNotesByIdSelector = createSelector(
  [customProtocolsContainer, getProps],
  ({ ingredients }, { ingredient: { id } }) => ({
    ingredientNotes: Object
      .values((ingredients && ingredients[id] && ingredients[id].notes) || []),
  }),
);
