import Meteor from 'react-native-meteor';
import { createStore, applyMiddleware } from 'redux';
import {createLogger} from 'redux-logger';
import _ from 'lodash';
import { persistStore,  } from 'redux-persist';

import { AsyncStorage } from 'react-native';

// Actions
const ADDED = 'ddp/added';
const CHANGED  = 'ddp/changed';
const REMOVED = 'ddp/removed';

// Reducer
const reducer = (state = {}, action) => {
    const { collection, id, fields } = action.payload || {};

    switch (action.type) {
        case ADDED:
            if (!state[collection]) {
                state[collection] = {};
                return {
                    ...state,
                    [collection]: {
                        [id]: fields,
                    },
                };
            } else if (!state[collection][id]) {
                return {
                    ...state,
                    [collection]: {
                        ...state[collection],
                        [id]: fields,
                    },
                }
            } else {
                return {
                    ...state,
                    [collection]: {
                        ...state[collection],
                        [id]: { ...fields, ...state[collection][id] },
                    }
                };
            }
        case CHANGED:
            return {
                ...state,
                [collection]: {
                    ...state[collection],
                    [id]: _.merge(state[collection][id], fields),
                },
            };
        case REMOVED:
            if (state[collection] && state[collection][id] && state[collection]!=="MainCategories"  ) {
                console.log("removing"+state[collection])
                return {
                    ...state,
                    [collection]: _.omit(state[collection], id),
                };
            }
        default:
            return state;
    }
};

const onRehydration = (store) => {
    const data = Meteor.getData();
    const db = data && data.db;
    if (db) {
        _.each(store.getState(), (collectionData, collectionName) => {
            if (!db[collectionName]){
                db.addCollection(collectionName);
            }

            const collectionArr = _.map(collectionData, (doc, _id) => {
                doc._id = _id;
                return doc;
            });

            db[collectionName].upsert(collectionArr);
        });
    }
};

export const initializeMeteorOffline = (opts = {}) => {
    const logger = createLogger({ predicate: () => opts.log || false });
    const store = createStore(reducer, applyMiddleware(logger), );
    persistStore(store, () => onRehydration(store));

    Meteor.ddp.on('added', (payload) => {
        store.dispatch({ type: ADDED, payload });
    });

    Meteor.ddp.on('changed', (payload) => {
        store.dispatch({ type: CHANGED, payload });
    });

    Meteor.ddp.on('removed', (payload) => {
        store.dispatch({ type: REMOVED, payload });
    });
};