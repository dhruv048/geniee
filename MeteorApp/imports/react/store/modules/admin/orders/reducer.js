import {
  updateOrders,
} from './actions';

export default {
  [updateOrders]: (state, { payload: { data } }) => {
    return {
      ...state,
      orders: data,
    };
  },
};
