import { createSelector } from 'reselect';
import { getProps } from 'helpers';

import { customProtocolsContainer } from '../base';

export const inventorySelector = createSelector(
  [customProtocolsContainer],
  ({ inventory }) => ({ inventory }),
);

export const inventoryItemByIdSelector = createSelector(
  [customProtocolsContainer, getProps],
  ({ inventory }, { id }) => ({ inventoryItem: inventory[id] }),
);

export const inventorySuppliersByIdSelector = createSelector(
  [customProtocolsContainer, getProps],
  ({ inventory }, { inventoryItem: { id } }) => ({
    inventorySuppliers: (inventory && inventory[id] && inventory[id].supplierInfo) || {} }),
);

export const inventoryNotesByIdSelector = createSelector(
  [customProtocolsContainer, getProps],
  ({ inventory }, { inventoryItem: { id } }) => ({
    inventoryNotes: Object
      .values((inventory && inventory[id] && inventory[id].notes) || []),
  }),
);
