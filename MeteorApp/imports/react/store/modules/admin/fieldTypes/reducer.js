import { updateFieldTypes } from './actions';

export default {
  [updateFieldTypes]: (state, { payload: { data } }) => ({
    ...state,
    fieldTypes: {
      ...state.fieldTypes,
      ...data,
    },
  }),
};
