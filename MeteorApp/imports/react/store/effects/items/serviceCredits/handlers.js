import { dispatch } from 'store';

import {
  editServiceCredit,
  updateServiceCredits,
  removeServiceCredit,
  editServiceCreditAtomic,
} from 'store/actions';

import { api } from '../..';

const getAllServiceCredits = () => {
  api.get('/api/service-credit/fetchAllServiceCredits').then(({ data }) => {
    if (data.error) dispatch(updateServiceCredits({}));
    else dispatch(updateServiceCredits({ data: data.data }));
  });
};

const handleServiceCreditCreate = (formData, cb) => {
  api
    .post('api/service-credit/createServiceCredit', formData)
    .then(({ data: { error, id } }) => {
      if (error) cb({ error: true });
      else {
        const data = {
          [+id]: {
            id: +id,
            ...formData,
          },
        };
        dispatch(updateServiceCredits({ data }));
        cb({ error: false, id });
      }
    })
    .catch(() => cb({ error: true }));
};

const handleServiceCreditEdit = (formData, cb) => {
  api
    .post('/api/service-credit/editServiceCredit', formData)
    .then(({ data: { error } }) => {
      if (error) cb({ error: true, done: false });
      else {
        dispatch(editServiceCredit({ data: formData }));
        cb({ error: false, done: true });
      }
    })
    .catch(() => cb({ error: true, done: false }));
};

const handleServiceCreditRemove = ({ id, deletedAt, deletedBy }, cb) => {
  api.post('/api/service-credit/removeServiceCredit', { id, deletedAt, deletedBy })
    .then(({ data: { error } }) => {
      if (error) cb({ error: true, done: false });
      else {
        dispatch(removeServiceCredit({ data: { id, deletedAt, deletedBy } }));
        cb({ error: false, done: true });
      }
    });
};

const handleServiceCreditEditAtomic = (formData) => {
  const { id, field, value, updatedAt, updatedBy } = formData;

  api.post('/api/service-credit/editServiceCreditAtomic', { id, field, value, updatedAt, updatedBy })
    .then(({ data: { error } }) => {
      if (!error) {
        dispatch(editServiceCreditAtomic({ id, field, value, updatedAt, updatedBy }));
      }
    });
};

export default {
  getAllServiceCredits,
  handleServiceCreditEdit,
  handleServiceCreditCreate,
  handleServiceCreditRemove,
  handleServiceCreditEditAtomic,
};
