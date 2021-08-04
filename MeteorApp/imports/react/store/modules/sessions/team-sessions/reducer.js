import {
  editTeamSession,
  removeTeamSession,
  updateTeamSessions,
  editTeamSessionAtomic,
  bulkRemoveTeamSessions,
  bulkCreateTeamSessions,
} from './actions';

export default {
  [editTeamSession]: (state, { payload: { data } }) => {
    const { id, ...rest } = data;

    return {
      ...state,
      teamSessions: {
        ...state.teamSessions,
        [id]: {
          ...state.teamSessions[id],
          ...rest,
        },
      },
    };
  },
  [removeTeamSession]: (state, { payload: { data: { id, deletedAt, deletedBy } } }) => ({
    ...state,
    teamSessions: {
      ...state.teamSessions,
      [id]: {
        ...state.teamSessions[id],
        deletedAt,
        deletedBy,
        archived: true,
      },
    },
  }),
  [updateTeamSessions]: (state, { payload: { data } }) => ({
    ...state,
    teamSessions: {
      ...state.teamSessions,
      ...data,
    },
  }),
  [editTeamSessionAtomic]: (state, { payload: { data: { id, field, value, updatedAt, updatedBy } } }) => ({
    ...state,
    teamSessions: {
      ...state.teamSessions,
      [id]: {
        ...state.teamSessions[id],
        [field]: value,
        updatedAt,
        updatedBy,
      },
    },
  }),
  [bulkRemoveTeamSessions]: (state, { payload: { data: { sessions, deletedAt, deletedBy } } }) => {
    const removedTeams = sessions.reduce((res, teamSessionId) => ({
      ...res,
      [+teamSessionId]: {
        ...state.teamSessions[+teamSessionId],
        deletedAt,
        deletedBy,
        archived: true,
      },
    }), {});

    return {
      ...state,
      teamSessions: {
        ...state.teamSessions,
        ...removedTeams,
      },
    };
  },
  [bulkCreateTeamSessions]: (state, { payload: { data: { data, sessionId, createdAt, createdBy } } }) => {
    const newTeams = data.reduce((res, { id, teamId }) => ({
      ...res,
      [+id]: {
        id: +id,
        teamId: +teamId,
        sessionId: +sessionId,
        createdAt,
        createdBy,
        updatedAt: null,
        updatedBy: null,
        deletedAt: null,
        deletedBy: null,
        archived: null,
      },
    }), {});

    return {
      ...state,
      teamSessions: {
        ...state.teamSessions,
        ...newTeams,
      },
    };
  },
};
