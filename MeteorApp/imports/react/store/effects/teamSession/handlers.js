/* eslint-disable max-len */
import { dispatch } from 'store';

import {
  editTeamSession,
  removeTeamSession,
  updateTeamSessions,
  editTeamSessionAtomic,
  bulkRemoveTeamSessions,
  bulkCreateTeamSessions } from 'store/actions';

import { api } from '..';

const handleGetAllTeamSessions = () => {
  api.get('/api/team-session/fetchAllTeamSessions').then(({ data }) => {
    if (data.error) dispatch(updateTeamSessions({}));
    else dispatch(updateTeamSessions({ data: data.data }));
  });
};

const handleEditTeamSession = (formData, cb) => {
  api.post('/api/team-session/editTeamSession', { ...formData }).then(({ data }) => {
    if (data.error) cb(false);
    else {
      dispatch(editTeamSession({ data: formData }));
      cb(true);
    }
  });
};

const handleCreateTeamSession = (formData, cb) => {
  api.post('/api/team-session/createTeamSession', { ...formData }).then(({ data }) => {
    if (data.error) cb(false);
    else {
      const session = {
        [+data.id]: {
          id: +data.id,
          ...formData,
        },
      };
      dispatch(updateTeamSessions({ data: session }));
      cb(data.id);
    }
  });
};

const handleEditAtomicTeamSession = (formData) => {
  const { id, field, value, updatedAt, updatedBy } = formData;

  api.post('/api/team-session/editTeamSessionAtomic', { id, field, value, updatedAt, updatedBy })
    .then(({ data: { error } }) => {
      if (!error) {
        dispatch(editTeamSessionAtomic({ data: { id, field, value, updatedAt, updatedBy } }));
      }
    });
};

const handleRemoveTeamSession = ({ id, deletedAt, deletedBy }, cb) => {
  api.post('/api/team-session/removeTeamSession', { id, deletedAt, deletedBy })
    .then(({ data: { error } }) => {
      if (error) cb({ error: true, done: false });
      else {
        dispatch(removeTeamSession({ data: { id, deletedAt, deletedBy } }));
        cb({ error: false, done: true });
      }
    });
};

const handleBulkUpdateTeamSessions = (formData, cb) => {
  api.post('/api/team-session/bulkUpdateTeamSessions', formData)
    .then(({ data: { error, data } }) => {
      if (error) cb({ error: true, done: false });
      else {
        const { sessionId, teamsToRemove, createdAt, createdBy } = formData;
        dispatch(bulkRemoveTeamSessions({ data: { sessions: teamsToRemove, deletedAt: createdAt, deletedBy: createdBy } }));
        dispatch(bulkCreateTeamSessions({ data: { data, sessionId, createdAt, createdBy } }));
        cb({ error: false, done: true });
      }
    });
};

export default {
  handleGetAllTeamSessions,
  handleEditTeamSession,
  handleCreateTeamSession,
  handleRemoveTeamSession,
  handleEditAtomicTeamSession,
  handleBulkUpdateTeamSessions,
};
