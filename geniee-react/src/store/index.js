/* eslint-disable no-underscore-dangle */
import { createStore, compose } from 'redux';
import rootReducer from './modules';

const devtool = window.__REDUX_DEVTOOLS_EXTENSION__;
const reduxDevTools = (devtool && devtool()) || compose;

const store = createStore(rootReducer, reduxDevTools);

export default store;
export const { dispatch, getState } = store;
