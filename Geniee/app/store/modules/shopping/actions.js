import { createActions } from 'redux-actions';

export const {
  getCartItems,
  addCartItems,
  removeCartItems,
} = createActions(
  'GET_CART_ITEMS',
  'ADD_CART_ITEMS',
  'REMOVE_CART_ITEMS'
);
