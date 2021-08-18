import { combineReducers } from 'redux';

import auth from './auth/reducer';
import categories from './business/reducer'

export default combineReducers({
  auth,
  categories,
});
