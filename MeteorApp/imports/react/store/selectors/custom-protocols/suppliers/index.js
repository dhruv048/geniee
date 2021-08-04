import { createSelector } from 'reselect';
import { getProps } from 'helpers';

import { customProtocolsContainer } from '../base';

export const suppliersSelector = createSelector(
  [customProtocolsContainer],
  ({ suppliers }) => ({ suppliers }),
);

export const supplierByIdSelector = createSelector(
  [customProtocolsContainer, getProps],
  ({ suppliers }, { id }) => ({ supplier: suppliers[id] }),
);

export const supplierContactsSelector = createSelector(
  [customProtocolsContainer, getProps],
  ({ suppliers }, { supplierId }) => ({
    supplierContacts: (suppliers && suppliers[supplierId] && suppliers[supplierId].contacts) || {} }),
);

export const supplierNotesBySupplierIdSelector = createSelector(
  [customProtocolsContainer, getProps],
  ({ suppliers }, { supplierId }) => ({
    supplierNotes: Object
      .values((suppliers && suppliers[supplierId] && suppliers[supplierId].notes) || []),
  }),
);
