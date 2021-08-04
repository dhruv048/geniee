import { createSelector } from 'reselect';
import { getProps } from 'helpers';

export const teamsContainer = ({ teams }) => teams;

export const teamsSelector = createSelector(
  [teamsContainer],
  ({ teams }) => ({ teams }),
);

export const teamByIdSelector = createSelector(
  [teamsContainer, getProps],
  ({ teams }, { id }) => ({ team: teams[id] }),
);

export const teamJobsSelector = createSelector(
  [teamsContainer],
  ({ teamJobs }) => ({ teamJobs }),
);

export const teamJobsByTeamIdSelector = createSelector(
  [teamsContainer, getProps],
  ({ teamJobs }, { teamId }) => ({ teamJobs: Object
    .values(teamJobs)
    .filter((t) => t.teamId === teamId) }),
);

export const teamEmploymentsSelector = createSelector(
  [teamsContainer],
  ({ teamEmployments }) => ({ teamEmployments }),
);

export const teamEmploymentsByTeamIdSelector = createSelector(
  [teamsContainer, getProps],
  ({ teamEmployments }, { teamId }) => ({ teamEmployments: Object
    .values(teamEmployments)
    .filter((t) => t.teamId === teamId) }),
);

export const teamEmergencySelector = createSelector(
  [teamsContainer],
  ({ teamEmergencyContacts }) => ({ teamEmergencyContacts }),
);

export const teamEmergencyByTeamIdSelector = createSelector(
  [teamsContainer, getProps],
  ({ teamEmergencyContacts }, { teamId }) => ({ teamEmergency: Object
    .values(teamEmergencyContacts)
    .filter((t) => t.teamId === teamId) }),
);

export const teamNotesSelector = createSelector(
  [teamsContainer],
  ({ teamNotes }) => ({ teamNotes }),
);

export const teamNoteByTeamIdSelector = createSelector(
  [teamsContainer, getProps],
  ({ teamNotes }, { teamId }) => ({ teamNotes: Object
    .values(teamNotes)
    .filter((t) => t.teamId === teamId) }),
);
