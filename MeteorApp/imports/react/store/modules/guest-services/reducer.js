import { handleActions } from 'redux-actions';

import {
  editGuestService,
  removeGuestService,
  updateGuestServices,
} from './actions';

export default handleActions(
  {
    [editGuestService]: (state, { payload: { data } }) => {
      const { id, ...rest } = data;

      return {
        ...state,
        [id]: {
          ...state[id],
          ...rest,
        },
      };
    },
    [removeGuestService]: (state, { payload: { data: { id, deletedAt, deletedBy } } }) => ({
      ...state,
      [id]: {
        ...state[id],
        deletedAt,
        deletedBy,
        archived: true,
      },
    }),
    [updateGuestServices]: (state, { payload: { data } }) => ({
      ...state,
      ...data,
    }),
  },
  {},
);
