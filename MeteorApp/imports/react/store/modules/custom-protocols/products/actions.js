import { createActions } from 'redux-actions';

export const {
  editProduct,
  removeProduct,
  updateProducts,
  editProductAtomic,
  updateProductImage,
  updateProductNote,
  updateProductsNotes,
  updateProductSupplierInfo,
  updateProductsSupplierInfo,
} = createActions(
  'EDIT_PRODUCT',
  'REMOVE_PRODUCT',
  'UPDATE_PRODUCTS',
  'EDIT_PRODUCT_ATOMIC',
  'UPDATE_PRODUCT_IMAGE',
  'UPDATE_PRODUCT_NOTE',
  'UPDATE_PRODUCTS_NOTES',
  'UPDATE_PRODUCT_SUPPLIER_INFO',
  'UPDATE_PRODUCTS_SUPPLIER_INFO',
);
