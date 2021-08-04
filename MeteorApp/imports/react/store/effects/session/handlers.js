import { dispatch } from 'store';

import {
  editSession,
  removeSession,
  updateSessions,
  editSessionAtomic } from 'store/actions';

import { api } from '..';

const handleEditSession = (formData, cb) => {
  api.post('/api/session/editSession', { ...formData }).then(({ data }) => {
    if (data.error) cb(false);
    else {
      dispatch(editSession({ data: formData }));
      cb(true);
    }
  });
};

const handleCreateSession = (formData, cb) => {
  api.post('/api/session/createSession', { ...formData }).then(({ data }) => {
    if (data.error) cb(false);
    else {
      const session = {
        [+data.id]: {
          ...formData,
          id: +data.id,
          days: +formData.days,
          number: +formData.number,
          location: +formData.location,
        },
      };
      dispatch(updateSessions({ data: session }));
      cb(data.id);
    }
  });
};

const handleGetAllSessions = () => {
  api.get('/api/session/fetchAllSessions').then(({ data }) => {
    if (data.error) dispatch(updateSessions({}));
    else dispatch(updateSessions({ data: data.data }));
  });
};

const handleEditAtomicSession = (formData) => {
  const { id, field, value, updatedAt, updatedBy } = formData;

  api.post('/api/session/editSessionAtomic', { id, field, value, updatedAt, updatedBy })
    .then(({ data: { error } }) => {
      if (!error) {
        dispatch(editSessionAtomic({ data: { id, field, value, updatedAt, updatedBy } }));
      }
    });
};

const handleSessionRemove = ({ id, deletedAt, deletedBy }, cb) => {
  api.post('/api/session/removeSession', { id, deletedAt, deletedBy })
    .then(({ data: { error } }) => {
      if (error) cb({ error: true, done: false });
      else {
        dispatch(removeSession({ data: { id, deletedAt, deletedBy } }));
        cb({ error: false, done: true });
      }
    });
};

export default {
  handleEditSession,
  handleCreateSession,
  handleGetAllSessions,
  handleEditAtomicSession,
  handleSessionRemove,
};
