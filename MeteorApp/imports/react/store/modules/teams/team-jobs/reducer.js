import {
  editTeamJob,
  removeTeamJob,
  updateTeamJobs,
  editTeamJobAtomic,
} from './actions';

export default {
  [editTeamJob]: (state, { payload: { data } }) => {
    const { id, ...rest } = data;

    return {
      ...state,
      teamJobs: {
        ...state.teamJobs,
        [id]: {
          ...state.teamJobs[id],
          ...rest,
        },
      },
    };
  },
  [removeTeamJob]: (state, { payload: { data: { id, deletedAt, deletedBy } } }) => ({
    ...state,
    teamJobs: {
      ...state.teamJobs,
      [id]: {
        ...state.teamJobs[id],
        deletedAt,
        deletedBy,
        archived: true,
      },
    },
  }),
  [updateTeamJobs]: (state, { payload: { data } }) => ({
    ...state,
    teamJobs: {
      ...state.teamJobs,
      ...data,
    },
  }),
  [editTeamJobAtomic]: (state, { payload: { data: { id, field, value, updatedAt, updatedBy } } }) => ({
    ...state,
    teamJobs: {
      ...state.teamJobs,
      [id]: {
        ...state.teamJobs[id],
        [field]: value,
        updatedAt,
        updatedBy,
      },
    },
  }),
};
