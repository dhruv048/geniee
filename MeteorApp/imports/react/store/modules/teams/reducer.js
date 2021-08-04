import { handleActions } from 'redux-actions';

import teams from './teams/reducer';
import teamJobs from './team-jobs/reducer';
import teamNotes from './team-notes/reducer';
import teamEmployments from './team-employments/reducer';
import teamEmergencyContacts from './team-emergency-contacts/reducer';

export default handleActions(
  {
    ...teams,
    ...teamJobs,
    ...teamNotes,
    ...teamEmployments,
    ...teamEmergencyContacts,
  },
  {
    teams: {},
    teamJobs: {},
    teamNotes: {},
    teamEmployments: {},
    teamEmergencyContacts: {},
  },
);
