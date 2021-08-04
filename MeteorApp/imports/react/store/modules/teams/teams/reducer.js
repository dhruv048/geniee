import {
  editTeam,
  removeTeam,
  updateTeams,
  editTeamAtomic,
  updateTeamImage,
} from './actions';

export default {
  [editTeam]: (state, { payload: { data } }) => {
    const { id, ...rest } = data;

    return {
      ...state,
      teams: {
        ...state.teams,
        [id]: {
          ...state.teams[id],
          ...rest,
        },
      },
    };
  },
  [removeTeam]: (state, { payload: { data: { id, deletedAt, deletedBy } } }) => ({
    ...state,
    teams: {
      ...state.teams,
      [id]: {
        ...state.teams[id],
        deletedAt,
        deletedBy,
        archived: true,
      },
    },
  }),
  [updateTeams]: (state, { payload: { data } }) => ({
    ...state,
    teams: {
      ...state.teams,
      ...data,
    },
  }),
  [editTeamAtomic]: (state, { payload: { data: { id, field, value } } }) => ({
    ...state,
    teams: {
      ...state.teams,
      [id]: {
        ...state.teams[id],
        [field]: value,
      },
    },
  }),
  [updateTeamImage]: (state, { payload: { data: { id, imageUrl } } }) => ({
    ...state,
    teams: {
      ...state.teams,
      [id]: {
        ...state.teams[id],
        imageUrl,
      },
    },
  }),
};
