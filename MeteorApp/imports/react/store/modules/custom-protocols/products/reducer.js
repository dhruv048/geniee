import {
  editProduct,
  removeProduct,
  updateProducts,
  editProductAtomic,
  updateProductImage,
  updateProductNote,
  updateProductsNotes,
  updateProductSupplierInfo,
  updateProductsSupplierInfo,
} from './actions';

export default {
  [editProduct]: (state, { payload: { data } }) => {
    const { id, ...rest } = data;

    return {
      ...state,
      products: {
        ...state.products,
        [id]: {
          ...state.products[id],
          ...rest,
        },
      },
    };
  },
  [removeProduct]: (state, { payload: { data: { id, deletedAt, deletedBy } } }) => ({
    ...state,
    products: {
      ...state.products,
      [id]: {
        ...state.products[id],
        deletedAt,
        deletedBy,
        archived: true,
      },
    },
  }),
  [updateProducts]: (state, { payload: { data } }) => ({
    ...state,
    products: {
      ...state.products,
      ...data,
    },
  }),
  [editProductAtomic]: (state, { payload: { data: { id, field, value, updatedAt, updatedBy } } }) => ({
    ...state,
    products: {
      ...state.products,
      [id]: {
        ...state.products[id],
        [field]: value,
        updatedAt,
        updatedBy,
      },
    },
  }),
  [updateProductImage]: (state, { payload: { data: { id, imageUrl } } }) => ({
    ...state,
    products: {
      ...state.products,
      [id]: {
        ...state.products[id],
        imageUrl,
      },
    },
  }),
  [updateProductSupplierInfo]: (state, { payload: { id, fields } }) => ({
    ...state,
    products: {
      ...state.products,
      [+fields.productId]: {
        ...state.products[+fields.productId],
        supplierInfo: {
          ...state.products[+fields.productId].supplierInfo,
          [id]: fields,
        },
      },
    },
  }),
  [updateProductsSupplierInfo]: (state, { payload: { data } }) => Object
    .values(data)
    .reduce((res, info) => ({
      ...res,
      products: {
        ...res.products,
        [+info.productId]: {
          ...res.products[+info.productId],
          supplierInfo: {
            ...res.products[+info.productId].supplierInfo,
            [+info.id]: info,
          },
        },
      },
    }), state),
  [updateProductNote]: (state, { payload: { id, fields } }) => ({
    ...state,
    products: {
      ...state.products,
      [+fields.productId]: {
        ...state.products[+fields.productId],
        notes: {
          ...state.products[+fields.productId].notes,
          [id]: fields,
        },
      },
    },
  }),
  [updateProductsNotes]: (state, { payload: { data } }) => Object
    .values(data)
    .reduce((res, note) => ({
      ...res,
      products: {
        ...res.products,
        [+note.productId]: {
          ...res.products[+note.productId],
          notes: {
            ...res.products[+note.productId].notes,
            [+note.id]: note,
          },
        },
      },
    }), state),
};
