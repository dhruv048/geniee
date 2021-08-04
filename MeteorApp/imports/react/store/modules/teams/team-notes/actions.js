import { createActions } from 'redux-actions';

export const {
  editTeamNote,
  removeTeamNote,
  updateTeamNotes,
  editTeamNoteAtomic,
} = createActions(
  'EDIT_TEAM_NOTE',
  'REMOVE_TEAM_NOTE',
  'UPDATE_TEAM_NOTES',
  'EDIT_TEAM_NOTE_ATOMIC',
);
