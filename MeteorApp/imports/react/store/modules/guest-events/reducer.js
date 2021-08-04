import { handleActions } from 'redux-actions';

import {
  editGuestEvent,
  removeGuestEvent,
  updateGuestEvents,
} from './actions';

export default handleActions(
  {
    [editGuestEvent]: (state, { payload: { data } }) => {
      const { id, ...rest } = data;

      return {
        ...state,
        [id]: {
          ...state[id],
          ...rest,
        },
      };
    },
    [removeGuestEvent]: (state, { payload: { data: { id, deletedAt, deletedBy } } }) => ({
      ...state,
      [id]: {
        ...state[id],
        deletedAt,
        deletedBy,
        archived: true,
      },
    }),
    [updateGuestEvents]: (state, { payload: { data } }) => ({
      ...state,
      ...data,
    }),
  },
  {},
);
