import {
  editInventoryItem,
  removeInventoryItem,
  updateInventoryItems,
  updateInventoryNote,
  updateInventoryNotes,
  updateInventorySupplier,
  updateInventorySuppliers,
} from './actions';

export default {
  [editInventoryItem]: (state, { payload: { data } }) => {
    const { id, ...rest } = data;

    return {
      ...state,
      inventory: {
        ...state.inventory,
        [id]: {
          ...state.inventory[id],
          ...rest,
        },
      },
    };
  },
  [removeInventoryItem]: (state, { payload: { data: { id, deletedAt, deletedBy } } }) => ({
    ...state,
    inventory: {
      ...state.inventory,
      [id]: {
        ...state.inventory[id],
        deletedAt,
        deletedBy,
        archived: true,
      },
    },
  }),
  [updateInventoryItems]: (state, { payload: { data } }) => ({
    ...state,
    inventory: {
      ...state.inventory,
      ...data,
    },
  }),
  [updateInventorySupplier]: (state, { payload: { id, fields } }) => ({
    ...state,
    inventory: {
      ...state.inventory,
      [+fields.inventoryId]: {
        ...state.inventory[+fields.inventoryId],
        supplierInfo: {
          ...state.inventory[+fields.inventoryId].supplierInfo,
          [id]: fields,
        },
      },
    },
  }),
  [updateInventorySuppliers]: (state, { payload: { data } }) => Object
    .values(data)
    .reduce((res, info) => ({
      ...res,
      inventory: {
        ...res.inventory,
        [+info.inventoryId]: {
          ...res.inventory[+info.inventoryId],
          supplierInfo: {
            ...res.inventory[+info.inventoryId].supplierInfo,
            [+info.id]: info,
          },
        },
      },
    }), state),
  [updateInventoryNote]: (state, { payload: { id, fields } }) => ({
    ...state,
    inventory: {
      ...state.inventory,
      [+fields.inventoryId]: {
        ...state.inventory[+fields.inventoryId],
        notes: {
          ...state.inventory[+fields.inventoryId].notes,
          [id]: fields,
        },
      },
    },
  }),
  [updateInventoryNotes]: (state, { payload: { data } }) => Object
    .values(data)
    .reduce((res, note) => ({
      ...res,
      inventory: {
        ...res.inventory,
        [+note.inventoryId]: {
          ...res.inventory[+note.inventoryId],
          notes: {
            ...res.inventory[+note.inventoryId].notes,
            [+note.id]: note,
          },
        },
      },
    }), state),
};
