/* eslint-disable max-len */
import { handleActions } from 'redux-actions';

import {
  getBusinessType,
  getCategories,
} from './actions';

export default handleActions(
  {
    [getCategories]: (state, { payload: { data } }) => ({
      ...state,
      categories: data,
    })
  },
  {
    [getBusinessType]: (state, { payload: { data } }) => ({
      ...state,
      businessType: data,
    })
  },
  {
    categories: null,
    businessType: null,
  },
);
