/* eslint-disable no-underscore-dangle */
import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './modules';
import AsyncStorage from '@react-native-community/async-storage';
import { persistStore, persistReducer } from 'redux-persist';

// const devtool = window.__REDUX_DEVTOOLS_EXTENSION__;
// const reduxDevTools = (devtool && devtool()) || compose;

// export const store = createStore(rootReducer, applyMiddleware(thunk));

const persistConfig = {
    key: 'root',
    storage: AsyncStorage
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer, applyMiddleware(thunk));
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
