import { dispatch } from 'store';

import {
  editProfessionalService,
  removeProfessionalService,
  updateProfessionalServices,
  editProfessionalServiceAtomic,
} from 'store/actions';

import { api } from '../..';

const getAllProfessionalServices = () => {
  api.get('/api/professional-service/fetchAllProfessionalServices').then(({ data }) => {
    if (data.error) dispatch(updateProfessionalServices({}));
    else dispatch(updateProfessionalServices({ data: data.data }));
  });
};

const handleProfessionalServiceCreate = (formData, cb) => {
  api
    .post('api/professional-service/createProfessionalService', formData)
    .then(({ data: { error, id } }) => {
      if (error) cb({ error: true });
      else {
        const data = {
          [+id]: {
            id: +id,
            ...formData,
          },
        };
        dispatch(updateProfessionalServices({ data }));
        cb({ error: false, id });
      }
    })
    .catch(() => cb({ error: true }));
};

const handleProfessionalServiceEdit = (formData, cb) => {
  api
    .post('/api/professional-service/editProfessionalService', formData)
    .then(({ data: { error } }) => {
      if (error) cb({ error: true, done: false });
      else {
        dispatch(editProfessionalService({ data: formData }));
        cb({ error: false, done: true });
      }
    })
    .catch(() => cb({ error: true, done: false }));
};

const handleProfessionalServiceRemove = ({ id, deletedAt, deletedBy }, cb) => {
  api.post('/api/professional-service/removeProfessionalService', { id, deletedAt, deletedBy })
    .then(({ data: { error } }) => {
      if (error) cb({ error: true, done: false });
      else {
        dispatch(removeProfessionalService({ data: { id, deletedAt, deletedBy } }));
        cb({ error: false, done: true });
      }
    });
};

const handleProfessionalServiceEditAtomic = (formData) => {
  const { id, field, value, updatedAt, updatedBy } = formData;

  api.post('/api/professional-service/editProfessionalServiceAtomic', { id, field, value, updatedAt, updatedBy })
    .then(({ data: { error } }) => {
      if (!error) {
        dispatch(editProfessionalServiceAtomic({ id, field, value, updatedAt, updatedBy }));
      }
    });
};

export default {
  getAllProfessionalServices,
  handleProfessionalServiceEdit,
  handleProfessionalServiceCreate,
  handleProfessionalServiceRemove,
  handleProfessionalServiceEditAtomic,
};
