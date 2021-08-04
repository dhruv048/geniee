import { createActions } from 'redux-actions';

export const {
  editTeamSession,
  removeTeamSession,
  updateTeamSessions,
  editTeamSessionAtomic,
  bulkRemoveTeamSessions,
  bulkCreateTeamSessions,
} = createActions(
  'EDIT_TEAM_SESSION',
  'REMOVE_TEAM_SESSION',
  'UPDATE_TEAM_SESSIONS',
  'EDIT_TEAM_SESSION_ATOMIC',
  'BULK_REMOVE_TEAM_SESSIONS',
  'BULK_CREATE_TEAM_SESSIONS',
);
