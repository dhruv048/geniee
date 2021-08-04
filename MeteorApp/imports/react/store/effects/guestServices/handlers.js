import { dispatch } from 'store';

import {
  editGuestService,
  removeGuestService,
  updateGuestServices,
} from 'store/actions';

import { api } from '..';

const getAllServices = () => {
  api.get('/api/guest-service/fetchAllServices').then(({ data }) => {
    if (data.error) dispatch(updateGuestServices({}));
    else dispatch(updateGuestServices({ data: data.data }));
  });
};

const handleServiceCreate = (formData, cb) => {
  Promise
    .all(formData.guest.map((guestId) => new Promise((resolve, reject) => {
      api
        .post('api/guest-service/createService', { ...formData, guest: guestId })
        .then(({ data: { error, id } }) => {
          if (error) reject();
          else {
            const data = {
              [+id]: {
                id: +id,
                ...formData,
              },
            };
            dispatch(updateGuestServices({ data }));
            resolve({ error: false, id });
          }
        })
        .catch(() => reject());
    })))
    .then(() => cb(true))
    .catch(() => cb(false));
};

const handleServiceEdit = (formData, cb) => {
  api
    .post('/api/guest-service/editService', formData)
    .then(({ data: { error } }) => {
      if (error) cb({ error: true, done: false });
      else {
        dispatch(editGuestService({ data: formData }));
        cb({ error: false, done: true });
      }
    })
    .catch(() => cb({ error: true, done: false }));
};

const handleServiceRemove = ({ id, deletedAt, deletedBy }, cb) => {
  api.post('/api/guest-service/removeService', { id, deletedAt, deletedBy })
    .then(({ data: { error } }) => {
      if (error) cb({ error: true, done: false });
      else {
        dispatch(removeGuestService({ data: { id, deletedAt, deletedBy } }));
        cb({ error: false, done: true });
      }
    });
};

export default {
  getAllServices,
  handleServiceEdit,
  handleServiceCreate,
  handleServiceRemove,
};
