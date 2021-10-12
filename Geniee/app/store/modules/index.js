import { combineReducers } from 'redux';

import auth from './auth/reducer';
import category from './categories/reducer';
import cart from './shopping/reducer';

export default combineReducers({
  auth,
  category,
  cart,
});
