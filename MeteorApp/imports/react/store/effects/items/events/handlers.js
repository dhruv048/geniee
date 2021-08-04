import { dispatch } from 'store';

import {
  editEvent,
  removeEvent,
  updateEvents,
} from 'store/actions';

import { api } from '../..';

const getEventNextId = (cb) => {
  api.get('/api/event/getEventNextId').then(({ data: { error, id } }) => {
    if (error) cb(null);
    else if (id) cb(id);
  });
};

const getAllEvents = () => {
  api.get('/api/event/fetchAllEvents').then(({ data }) => {
    if (data.error) dispatch(updateEvents({}));
    else dispatch(updateEvents({ data: data.data }));
  });
};

const handleEventCreate = (formData, cb) => {
  api
    .post('api/event/createEvent', formData)
    .then(({ data: { error, id } }) => {
      if (error) cb({ error: true });
      else {
        const data = {
          [+id]: {
            id: +id,
            ...formData,
          },
        };
        dispatch(updateEvents({ data }));
        cb({ error: false, id });
      }
    })
    .catch(() => cb({ error: true }));
};

const handleEventEdit = (formData, cb) => {
  api
    .post('/api/event/editEvent', formData)
    .then(({ data: { error } }) => {
      if (error) cb({ error: true, done: false });
      else {
        dispatch(editEvent({ data: formData }));
        cb({ error: false, done: true });
      }
    })
    .catch(() => cb({ error: true, done: false }));
};

const handleEventRemove = ({ id, deletedAt, deletedBy }, cb) => {
  api.post('/api/service/removeEvent', { id, deletedAt, deletedBy })
    .then(({ data: { error } }) => {
      if (error) cb({ error: true, done: false });
      else {
        dispatch(removeEvent({ data: { id, deletedAt, deletedBy } }));
        cb({ error: false, done: true });
      }
    });
};

export default {
  getAllEvents,
  getEventNextId,
  handleEventEdit,
  handleEventCreate,
  handleEventRemove,
};
