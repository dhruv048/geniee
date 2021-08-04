import {
  editTeamEmployment,
  removeTeamEmployment,
  updateTeamEmployments,
  editTeamEmploymentAtomic,
} from './actions';

export default {
  [editTeamEmployment]: (state, { payload: { data } }) => {
    const { id, ...rest } = data;

    return {
      ...state,
      teamEmployments: {
        ...state.teamEmployments,
        [id]: {
          ...state.teamEmployments[id],
          ...rest,
        },
      },
    };
  },
  [removeTeamEmployment]: (state, { payload: { data: { id, deletedAt, deletedBy } } }) => ({
    ...state,
    teamEmployments: {
      ...state.teamEmployments,
      [id]: {
        ...state.teamEmployments[id],
        deletedAt,
        deletedBy,
        archived: true,
      },
    },
  }),
  [updateTeamEmployments]: (state, { payload: { data } }) => ({
    ...state,
    teamEmployments: {
      ...state.teamEmployments,
      ...data,
    },
  }),
  [editTeamEmploymentAtomic]: (state, { payload: { data: { id, field, value, updatedAt, updatedBy } } }) => ({
    ...state,
    teamEmployments: {
      ...state.teamEmployments,
      [id]: {
        ...state.teamEmployments[id],
        [field]: value,
        updatedAt,
        updatedBy,
      },
    },
  }),
};
