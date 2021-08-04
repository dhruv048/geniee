import { dispatch } from 'store';

import {
  editGuestEvent,
  removeGuestEvent,
  updateGuestEvents,
} from 'store/actions';

import { api } from '..';

const getAllEvents = () => {
  api.get('/api/guest-event/fetchAllEvents').then(({ data }) => {
    if (data.error) dispatch(updateGuestEvents({}));
    else dispatch(updateGuestEvents({ data: data.data }));
  });
};

const handleEventCreate = (formData, cb) => {
  Promise
    .all(formData.guest.map((guestId) => new Promise((resolve, reject) => {
      api
        .post('api/guest-event/createEvent', { ...formData, guest: guestId })
        .then(({ data: { error, id } }) => {
          if (error) reject();
          else {
            const data = {
              [+id]: {
                id: +id,
                ...formData,
              },
            };
            dispatch(updateGuestEvents({ data }));
            resolve({ error: false, id });
          }
        })
        .catch(() => reject());
    })))
    .then(() => cb(true))
    .catch(() => cb(false));
};

const handleEventEdit = (formData, cb) => {
  api
    .post('/api/guest-event/editEvent', formData)
    .then(({ data: { error } }) => {
      if (error) cb({ error: true, done: false });
      else {
        dispatch(editGuestEvent({ data: formData }));
        cb({ error: false, done: true });
      }
    })
    .catch(() => cb({ error: true, done: false }));
};

const handleEventRemove = ({ id, deletedAt, deletedBy }, cb) => {
  api.post('/api/guest-event/removeEvent', { id, deletedAt, deletedBy })
    .then(({ data: { error } }) => {
      if (error) cb({ error: true, done: false });
      else {
        dispatch(removeGuestEvent({ data: { id, deletedAt, deletedBy } }));
        cb({ error: false, done: true });
      }
    });
};

export default {
  getAllEvents,
  handleEventEdit,
  handleEventCreate,
  handleEventRemove,
};
