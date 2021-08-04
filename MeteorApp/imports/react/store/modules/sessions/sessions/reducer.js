import {
  editSession,
  removeSession,
  updateSessions,
  editSessionAtomic,
} from './actions';

export default {
  [editSession]: (state, { payload: { data } }) => {
    const { id, ...rest } = data;

    return {
      ...state,
      sessions: {
        ...state.sessions,
        [id]: {
          ...state.sessions[id],
          ...rest,
        },
      },
    };
  },
  [removeSession]: (state, { payload: { data: { id, deletedAt, deletedBy } } }) => ({
    ...state,
    sessions: {
      ...state.sessions,
      [id]: {
        ...state.sessions[id],
        deletedAt,
        deletedBy,
        archived: true,
      },
    },
  }),
  [updateSessions]: (state, { payload: { data } }) => ({
    ...state,
    sessions: {
      ...state.sessions,
      ...data,
    },
  }),
  [editSessionAtomic]: (state, { payload: { data: { id, field, value, updatedAt, updatedBy } } }) => ({
    ...state,
    sessions: {
      ...state.sessions,
      [id]: {
        ...state.sessions[id],
        [field]: value,
        updatedAt,
        updatedBy,
      },
    },
  }),
};
