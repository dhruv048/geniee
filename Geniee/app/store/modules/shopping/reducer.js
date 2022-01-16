/* eslint-disable max-len */
import { handleActions } from 'redux-actions';

import {
  getCartItems,
  addCartItems,
  removeCartItems
} from './actions';

export default handleActions(
  {
    [getCartItems]: (state) => ({
      ...state,
      cartItems: state.cartItems,
    }),

    [addCartItems]:(state, { payload: {data} }) =>({
      ...state,
      cartItems: state.cartItems.concat(data)
      //cartItems: [...state.cartItems, data]
    }),
    [removeCartItems]:(state, { payload: {data} }) =>({
      ...state,
      cartItems: state.cartItems.filter(item => item.id !== data.id)
    })
  },
  {
    cartItems: [],
    wishListItems: null,
    orderedItems: null,
  },
);
