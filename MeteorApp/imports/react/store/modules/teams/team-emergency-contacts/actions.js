import { createActions } from 'redux-actions';

export const {
  editTeamEmergencyContact,
  removeTeamEmergencyContact,
  updateTeamEmergencyContacts,
  editTeamEmergencyContactAtomic,
} = createActions(
  'EDIT_TEAM_EMERGENCY_CONTACT',
  'REMOVE_TEAM_EMERGENCY_CONTACT',
  'UPDATE_TEAM_EMERGENCY_CONTACTS',
  'EDIT_TEAM_EMERGENCY_CONTACT_ATOMIC',
);
