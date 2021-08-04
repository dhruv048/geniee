import { updateProtocolRules } from './actions';

export default {
  [updateProtocolRules]: (state, { payload: { data } }) => ({
    ...state,
    customProtocolRules: {
      ...state.customProtocolRules,
      ...data,
    },
  }),
};
