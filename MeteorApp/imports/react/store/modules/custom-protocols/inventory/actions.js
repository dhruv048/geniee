import { createActions } from 'redux-actions';

export const {
  editInventoryItem,
  removeInventoryItem,
  updateInventoryItems,
  updateInventoryNote,
  updateInventoryNotes,
  updateInventorySupplier,
  updateInventorySuppliers,
} = createActions(
  'EDIT_INVENTORY_ITEM',
  'REMOVE_INVENTORY_ITEM',
  'UPDATE_INVENTORY_ITEMS',
  'UPDATE_INVENTORY_NOTE',
  'UPDATE_INVENTORY_NOTES',
  'UPDATE_INVENTORY_SUPPLIER',
  'UPDATE_INVENTORY_SUPPLIERS',
);
