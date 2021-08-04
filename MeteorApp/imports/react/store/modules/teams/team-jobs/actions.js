import { createActions } from 'redux-actions';

export const {
  editTeamJob,
  removeTeamJob,
  updateTeamJobs,
  editTeamJobAtomic,
} = createActions(
  'EDIT_TEAM_JOB',
  'REMOVE_TEAM_JOB',
  'UPDATE_TEAM_JOBS',
  'EDIT_TEAM_JOB_ATOMIC',
);
