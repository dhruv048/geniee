import { combineReducers } from 'redux';

import auth from './auth/reducer';
import categories from './categories/reducer';
import cart from './shopping/reducer';

export default combineReducers({
  auth,
  categories,
  cart,
});
