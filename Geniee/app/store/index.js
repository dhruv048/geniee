/* eslint-disable no-underscore-dangle */
import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './modules';
import AsyncStorage from '@react-native-community/async-storage';
import { persistStore, persistReducer } from 'redux-persist';
import logger from 'redux-logger';
import {composeWithDevTools} from 'redux-devtools-extension';

let composeEnhancers = compose;
if(__DEV__){
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}
//const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// export const store = createStore(rootReducer, applyMiddleware(thunk));

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whiteList:[]
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer, composeEnhancers(applyMiddleware(logger)));
export const persistor = persistStore(store);
// export default () => {
//     let store = createStore(persistedReducer, applyMiddleware(thunk));
//     let persistor = persistStore(store);
//     return {
//         store,
//         persistor
//     }
// }

export const { dispatch, getState } = store;
