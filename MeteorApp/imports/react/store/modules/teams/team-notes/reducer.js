import {
  editTeamNote,
  removeTeamNote,
  updateTeamNotes,
  editTeamNoteAtomic,
} from './actions';

export default {
  [editTeamNote]: (state, { payload: { data } }) => {
    const { id, ...rest } = data;

    return {
      ...state,
      teamNotes: {
        ...state.teamNotes,
        [id]: {
          ...state.teamNotes[id],
          ...rest,
        },
      },
    };
  },
  [removeTeamNote]: (state, { payload: { data: { id, deletedAt, deletedBy } } }) => ({
    ...state,
    teamNotes: {
      ...state.teamNotes,
      [id]: {
        ...state.teamNotes[id],
        deletedAt,
        deletedBy,
        archived: true,
      },
    },
  }),
  [updateTeamNotes]: (state, { payload: { data } }) => ({
    ...state,
    teamNotes: {
      ...state.teamNotes,
      ...data,
    },
  }),
  [editTeamNoteAtomic]: (state, { payload: { data: { id, field, value, updatedAt, updatedBy } } }) => ({
    ...state,
    teamNotes: {
      ...state.teamNotes,
      [id]: {
        ...state.teamNotes[id],
        [field]: value,
        updatedAt,
        updatedBy,
      },
    },
  }),
};
