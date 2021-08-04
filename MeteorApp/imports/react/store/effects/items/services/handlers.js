import { dispatch } from 'store';

import {
  editService,
  removeService,
  updateServices,
} from 'store/actions';

import { api } from '../..';

const getServiceNextId = (cb) => {
  api.get('/api/service/getServiceNextId').then(({ data: { error, id } }) => {
    if (error) cb(null);
    else if (id) cb(id);
  });
};

const getAllServices = () => {
  api.get('/api/service/fetchAllServices').then(({ data }) => {
    if (data.error) dispatch(updateServices({}));
    else dispatch(updateServices({ data: data.data }));
  });
};

const handleServiceCreate = (formData, cb) => {
  api
    .post('api/service/createService', formData)
    .then(({ data: { error, id } }) => {
      if (error) cb({ error: true });
      else {
        const data = {
          [+id]: {
            id: +id,
            ...formData,
          },
        };
        dispatch(updateServices({ data }));
        cb({ error: false, id });
      }
    })
    .catch(() => cb({ error: true }));
};

const handleServiceEdit = (formData, cb) => {
  api
    .post('/api/service/editService', formData)
    .then(({ data: { error } }) => {
      if (error) cb({ error: true, done: false });
      else {
        dispatch(editService({ data: formData }));
        cb({ error: false, done: true });
      }
    })
    .catch(() => cb({ error: true, done: false }));
};

const handleServiceRemove = ({ id, deletedAt, deletedBy }, cb) => {
  api.post('/api/service/removeService', { id, deletedAt, deletedBy })
    .then(({ data: { error } }) => {
      if (error) cb({ error: true, done: false });
      else {
        dispatch(removeService({ data: { id, deletedAt, deletedBy } }));
        cb({ error: false, done: true });
      }
    });
};

export default {
  getAllServices,
  getServiceNextId,
  handleServiceEdit,
  handleServiceCreate,
  handleServiceRemove,
};
