import { createActions } from 'redux-actions';

export const {
  getCategories,
  getBusinessType
} = createActions(
  'GET_CATEGORIES',
  'GET_BUSINESS_TYPE'
);
