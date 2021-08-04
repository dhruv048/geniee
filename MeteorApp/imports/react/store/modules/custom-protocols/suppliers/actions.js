import { createActions } from 'redux-actions';

export const {
  editSupplier,
  removeSupplier,
  updateSuppliers,
  editSupplierAtomic,
  updateSupplierImage,
  updateSupplierSection,
  fetchSupplierSections,
} = createActions(
  'EDIT_SUPPLIER',
  'REMOVE_SUPPLIER',
  'UPDATE_SUPPLIERS',
  'EDIT_SUPPLIER_ATOMIC',
  'UPDATE_SUPPLIER_IMAGE',
  'UPDATE_SUPPLIER_SECTION',
  'FETCH_SUPPLIER_SECTIONS',
);
