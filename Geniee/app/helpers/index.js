import { createSelector } from 'reselect';

// TODO: make a possibility to work not only with objects as a result of the selector
export default function combineSelectors(...selectors) {
    return createSelector(selectors, (...args) => args.reduce((o, cur) => ({ ...o, ...cur }), {}));
  }