import {
  editSupplier,
  removeSupplier,
  updateSuppliers,
  editSupplierAtomic,
  updateSupplierImage,
  updateSupplierSection,
  fetchSupplierSections,
} from './actions';

export default {
  [editSupplier]: (state, { payload: { data } }) => {
    const { id, ...rest } = data;

    return {
      ...state,
      suppliers: {
        ...state.suppliers,
        [id]: {
          ...state.suppliers[id],
          ...rest,
        },
      },
    };
  },
  [removeSupplier]: (state, { payload: { data: { id, deletedAt, deletedBy } } }) => ({
    ...state,
    suppliers: {
      ...state.suppliers,
      [id]: {
        ...state.suppliers[id],
        deletedAt,
        deletedBy,
        archived: true,
      },
    },
  }),
  [updateSuppliers]: (state, { payload: { data } }) => ({
    ...state,
    suppliers: {
      ...state.suppliers,
      ...data,
    },
  }),
  [editSupplierAtomic]: (state, { payload: { data: { id, field, value, updatedAt, updatedBy } } }) => ({
    ...state,
    suppliers: {
      ...state.suppliers,
      [id]: {
        ...state.suppliers[id],
        [field]: value,
        updatedAt,
        updatedBy,
      },
    },
  }),
  [updateSupplierImage]: (state, { payload: { data: { id, imageUrl } } }) => ({
    ...state,
    suppliers: {
      ...state.suppliers,
      [id]: {
        ...state.suppliers[id],
        imageUrl,
      },
    },
  }),
  [updateSupplierSection]: (state, { payload: { section, item } }) => ({
    ...state,
    suppliers: {
      ...state.suppliers,
      [item.supplierId]: {
        ...state.suppliers[item.supplierId],
        [section]: {
          ...state.suppliers[item.supplierId][section],
          [item.id]: {
            ...state.suppliers[item.supplierId][section][item.id],
            ...item,
          },
        },
      },
    },
  }),
  [fetchSupplierSections]: (state, { payload: { data, section } }) => Object
    .values(data)
    .reduce((res, contact) => ({
      ...res,
      suppliers: {
        ...res.suppliers,
        [contact.supplierId]: {
          ...res.suppliers[contact.supplierId],
          [section]: {
            ...res.suppliers[contact.supplierId][section],
            [contact.id]: { ...contact },
          },
        },
      },
    }), state),
};
