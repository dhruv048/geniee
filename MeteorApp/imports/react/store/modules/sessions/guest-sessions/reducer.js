/* eslint-disable max-len */
import {
  editGuestSession,
  removeGuestSession,
  updateGuestSessions,
  editGuestSessionAtomic,
  updateGuestSessionData,
  updateGuestSessionsData,
  editGuestSessionDataAtomic,
  removeGuestSessionSpending,
  updateGuestSessionsSpendings,
} from './actions';

export default {
  [editGuestSession]: (state, { payload: { data } }) => {
    const { id, ...rest } = data;

    return {
      ...state,
      guestSessions: {
        ...state.guestSessions,
        [id]: {
          ...state.guestSessions[id],
          ...rest,
        },
      },
    };
  },
  [removeGuestSession]: (state, { payload: { data: { id, deletedAt, deletedBy } } }) => ({
    ...state,
    guestSessions: {
      ...state.guestSessions,
      [id]: {
        ...state.guestSessions[id],
        deletedAt,
        deletedBy,
        archived: true,
      },
    },
  }),
  [updateGuestSessions]: (state, { payload: { data } }) => Object
    .values(data)
    .reduce((res, session) => ({
      ...res,
      guestSessions: {
        ...res.guestSessions,
        [session.id]: {
          ...res.guestSessions[session.id],
          ...session,
        },
      },
    }), state),
  [editGuestSessionAtomic]: (state, { payload: { data: { id, field, value, updatedAt, updatedBy } } }) => ({
    ...state,
    guestSessions: {
      ...state.guestSessions,
      [id]: {
        ...state.guestSessions[id],
        [field]: value,
        updatedAt,
        updatedBy,
      },
    },
  }),
  [editGuestSessionDataAtomic]: (state, { payload: { data: { id, section, field, value, updatedAt, updatedBy } } }) => ({
    ...state,
    guestSessions: {
      ...state.guestSessions,
      [id]: {
        ...state.guestSessions[id],
        [section]: {
          ...state.guestSessions[id][section],
          [field]: value,
        },
        updatedAt,
        updatedBy,
      },
    },
  }),
  [updateGuestSessionData]: (state, { payload: { id, fields, section } }) => ({
    ...state,
    guestSessions: {
      ...state.guestSessions,
      [id]: {
        ...state.guestSessions[id],
        [section]: {
          ...state.guestSessions[id][section],
          ...fields,
        },
      },
    },
  }),
  [updateGuestSessionsData]: (state, { payload: { data, section } }) => Object
    .values(data)
    .reduce((res, session) => ({
      ...res,
      guestSessions: {
        ...res.guestSessions,
        [+session.id]: {
          ...res.guestSessions[+session.id],
          [section]: session,
        },
      },
    }), state),
  [updateGuestSessionsSpendings]: (state, { payload: { data } }) => Object
    .values(data)
    .reduce((res, item) => {
      const curSessions = res.guestSessions || {};
      const curGuestSession = curSessions[+item.guestSessionId] || {};
      const curSpendings = curGuestSession.spendings || {};

      return {
        ...res,
        guestSessions: {
          ...curSessions,
          [+item.guestSessionId]: {
            ...curGuestSession,
            spendings: {
              ...curSpendings,
              [+item.id]: {
                ...curSpendings[+item.id],
                ...item,
              },
            },
          },
        },
      };
    }, state),
  [removeGuestSessionSpending]: (state, { payload: { data: { id, guestSessionId, deletedAt, deletedBy } } }) => ({
    ...state,
    guestSessions: {
      ...state.guestSessions,
      [guestSessionId]: {
        ...state.guestSessions[guestSessionId],
        spendings: {
          ...state.guestSessions[guestSessionId].spendings,
          [id]: {
            ...state.guestSessions[guestSessionId].spendings[id],
            deletedAt,
            deletedBy,
            archived: true,
          },
        },
      },
    },
  }),
};
