import { updateCustomFields } from './actions';

export default {
  [updateCustomFields]: (state, { payload: data }) => ({
    ...state,
    customFields: {
      ...state.customFields,
      ...data,
    },
  }),
};
