import { createSelector } from 'reselect';
import { getProps } from 'helpers';

import { customProtocolsContainer } from '../base';

export const productsSelector = createSelector(
  [customProtocolsContainer],
  ({ products }) => ({ products }),
);

export const productByIdSelector = createSelector(
  [customProtocolsContainer, getProps],
  ({ products }, { id }) => ({ product: products[id] }),
);

export const productSuppliersByIdSelector = createSelector(
  [customProtocolsContainer, getProps],
  ({ products }, { product: { id } }) => ({
    productSuppliers: (products && products[id] && products[id].supplierInfo) || {} }),
);

export const productNotesByIdSelector = createSelector(
  [customProtocolsContainer, getProps],
  ({ products }, { product: { id } }) => ({
    productNotes: Object
      .values((products && products[id] && products[id].notes) || []),
  }),
);
