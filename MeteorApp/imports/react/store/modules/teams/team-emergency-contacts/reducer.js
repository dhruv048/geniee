import {
  editTeamEmergencyContact,
  removeTeamEmergencyContact,
  updateTeamEmergencyContacts,
  editTeamEmergencyContactAtomic,
} from './actions';

export default {
  [editTeamEmergencyContact]: (state, { payload: { data } }) => {
    const { id, ...rest } = data;

    return {
      ...state,
      teamEmergencyContacts: {
        ...state.teamEmergencyContacts,
        [id]: {
          ...state.teamEmergencyContacts[id],
          ...rest,
        },
      },
    };
  },
  [removeTeamEmergencyContact]: (state, { payload: { data: { id, deletedAt, deletedBy } } }) => ({
    ...state,
    teamEmergencyContacts: {
      ...state.teamEmergencyContacts,
      [id]: {
        ...state.teamEmergencyContacts[id],
        deletedAt,
        deletedBy,
        archived: true,
      },
    },
  }),
  [updateTeamEmergencyContacts]: (state, { payload: { data } }) => ({
    ...state,
    teamEmergencyContacts: {
      ...state.teamEmergencyContacts,
      ...data,
    },
  }),
  [editTeamEmergencyContactAtomic]: (state, { payload: { data: { id, field, value, updatedAt, updatedBy } } }) => ({
    ...state,
    teamEmergencyContacts: {
      ...state.teamEmergencyContacts,
      [id]: {
        ...state.teamEmergencyContacts[id],
        [field]: value,
        updatedAt,
        updatedBy,
      },
    },
  }),
};
