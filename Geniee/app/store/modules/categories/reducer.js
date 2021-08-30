/* eslint-disable max-len */
import { handleActions } from 'redux-actions';

import {
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
    categories: null,
  },
);
