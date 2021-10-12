/* eslint-disable max-len */
import { handleActions } from 'redux-actions';

import {
  getCartItems,
} from './actions';

export default handleActions(
  {
    [getCartItems]: (state, { payload: { data } }) => ({
      ...state,
      cartItems: data,
    })
  },
  {
    cartItems: null,
    wishListItems: null,
    orderedItems: null,
  },
);
