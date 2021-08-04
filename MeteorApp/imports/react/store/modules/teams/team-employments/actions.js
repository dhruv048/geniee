import { createActions } from 'redux-actions';

export const {
  editTeamEmployment,
  removeTeamEmployment,
  updateTeamEmployments,
  editTeamEmploymentAtomic,
} = createActions(
  'EDIT_TEAM_EMPLOYMENT',
  'REMOVE_TEAM_EMPLOYMENT',
  'UPDATE_TEAM_EMPLOYMENTS',
  'EDIT_TEAM_EMPLOYMENT_ATOMIC',
);
