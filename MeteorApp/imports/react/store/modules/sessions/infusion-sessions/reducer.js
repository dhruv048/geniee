import { updateInfusionSessions } from './actions';

export default {
  [updateInfusionSessions]: (state, { payload: { data } }) => ({
    ...state,
    infusionSessions: {
      ...state.infusionSessions,
      ...data,
    },
  }),
};
