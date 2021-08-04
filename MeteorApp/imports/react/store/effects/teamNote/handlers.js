import { dispatch } from 'store';

import {
  editTeamNote,
  removeTeamNote,
  updateTeamNotes,
  editTeamNoteAtomic } from 'store/actions';

import { api } from '..';

const handleGetAllTeamNotes = () => {
  api.get('/api/team-note/fetchAllTeamNotes').then(({ data }) => {
    if (data.error) dispatch(updateTeamNotes({}));
    else dispatch(updateTeamNotes({ data: data.data }));
  });
};

const handleEditTeamNote = (formData, cb) => {
  api.post('/api/team-note/editTeamNote', { ...formData }).then(({ data }) => {
    if (data.error) cb(false);
    else {
      dispatch(editTeamNote({ data: formData }));
      cb(true);
    }
  });
};

const handleCreateTeamNote = (formData, cb) => {
  api.post('/api/team-note/createTeamNote', { ...formData }).then(({ data }) => {
    if (data.error) cb(false);
    else {
      const note = {
        [+data.id]: {
          id: +data.id,
          ...formData,
          note: JSON.stringify(formData.note),
        },
      };
      dispatch(updateTeamNotes({ data: note }));
      cb(data.id);
    }
  });
};

const handleEditAtomicTeamNote = (formData) => {
  const { id, field, value, updatedAt, updatedBy } = formData;

  api.post('/api/team-note/editTeamNoteAtomic', { id, field, value, updatedAt, updatedBy })
    .then(({ data: { error } }) => {
      if (!error) {
        dispatch(editTeamNoteAtomic({ data: { id, field, value, updatedAt, updatedBy } }));
      }
    });
};

const handleRemoveTeamNote = ({ id, deletedAt, deletedBy }, cb) => {
  api.post('/api/team-note/removeTeamNote', { id, deletedAt, deletedBy })
    .then(({ data: { error } }) => {
      if (error) cb({ error: true, done: false });
      else {
        dispatch(removeTeamNote({ data: { id, deletedAt, deletedBy } }));
        cb({ error: false, done: true });
      }
    });
};

export default {
  handleGetAllTeamNotes,
  handleEditTeamNote,
  handleCreateTeamNote,
  handleRemoveTeamNote,
  handleEditAtomicTeamNote,
};
