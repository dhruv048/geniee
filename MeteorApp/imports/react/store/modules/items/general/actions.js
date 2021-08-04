import { createActions } from 'redux-actions';

export const {
  editGeneralItem,
  removeGeneralItem,
  updateGeneralItems,
  editGeneralItemAtomic,
} = createActions(
  'EDIT_GENERAL_ITEM',
  'REMOVE_GENERAL_ITEM',
  'UPDATE_GENERAL_ITEMS',
  'EDIT_GENERAL_ITEM_ATOMIC',
);
