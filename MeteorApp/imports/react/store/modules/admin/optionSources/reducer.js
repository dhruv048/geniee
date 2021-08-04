import { updateOptionSources } from './actions';

export default {
  [updateOptionSources]: (state, { payload: { data } }) => ({
    ...state,
    optionSources: {
      ...state.optionSources,
      ...data,
    },
  }),
};
