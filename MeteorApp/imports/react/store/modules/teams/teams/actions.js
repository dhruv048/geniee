import { createActions } from 'redux-actions';

export const {
  editTeam,
  removeTeam,
  updateTeams,
  editTeamAtomic,
  updateTeamImage,
} = createActions(
  'EDIT_TEAM',
  'REMOVE_TEAM',
  'UPDATE_TEAMS',
  'EDIT_TEAM_ATOMIC',
  'UPDATE_TEAM_IMAGE',
);
