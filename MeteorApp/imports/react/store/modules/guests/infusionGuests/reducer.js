import { updateInfusionGuests } from './actions';

export default {
  [updateInfusionGuests]: (state, { payload: { data } }) => ({
    ...state,
    infusionGuests: {
      ...data,
    },
  }),
};
