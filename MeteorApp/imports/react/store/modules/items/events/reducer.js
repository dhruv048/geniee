import {
  editEvent,
  removeEvent,
  updateEvents,
} from './actions';

export default {
  [editEvent]: (state, { payload: { data } }) => {
    const { id, ...rest } = data;

    return {
      ...state,
      events: {
        ...state.events,
        [id]: {
          ...state.events[id],
          ...rest,
        },
      },
    };
  },
  [removeEvent]: (state, { payload: { data: { id, deletedAt, deletedBy } } }) => ({
    ...state,
    events: {
      ...state.events,
      [id]: {
        ...state.events[id],
        deletedAt,
        deletedBy,
        archived: true,
      },
    },
  }),
  [updateEvents]: (state, { payload: { data } }) => ({
    ...state,
    events: {
      ...state.events,
      ...data,
    },
  }),
};
