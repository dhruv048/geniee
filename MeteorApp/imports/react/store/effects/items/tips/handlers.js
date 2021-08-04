import { dispatch } from 'store';

import {
  editTips,
  updateTips,
  removeTips,
  editTipsAtomic,
} from 'store/actions';

import { api } from '../..';

const getAllTips = () => {
  api.get('/api/tips/fetchAllTips').then(({ data }) => {
    if (data.error) dispatch(updateTips({}));
    else dispatch(updateTips({ data: data.data }));
  });
};

const handleTipsCreate = (formData, cb) => {
  api
    .post('api/tips/createTips', formData)
    .then(({ data: { error, id } }) => {
      if (error) cb({ error: true });
      else {
        const tips = {
          [+id]: {
            id: +id,
            ...formData,
          },
        };
        dispatch(updateTips({ data: tips }));
        cb({ error: false, id });
      }
    })
    .catch(() => cb({ error: true }));
};

const handleTipsEdit = (formData, cb) => {
  api
    .post('/api/tips/editTips', formData)
    .then(({ data: { error } }) => {
      if (error) cb({ error: true, done: false });
      else {
        dispatch(editTips({ data: formData }));
        cb({ error: false, done: true });
      }
    })
    .catch(() => cb({ error: true, done: false }));
};

const handleTipsRemove = ({ id, deletedAt, deletedBy }, cb) => {
  api.post('/api/tips/removeTips', { id, deletedAt, deletedBy })
    .then(({ data: { error } }) => {
      if (error) cb({ error: true, done: false });
      else {
        dispatch(removeTips({ data: { id, deletedAt, deletedBy } }));
        cb({ error: false, done: true });
      }
    });
};

const handleTipsEditAtomic = (formData) => {
  const { id, field, value, updatedAt, updatedBy } = formData;

  api.post('/api/tips/editTipsAtomic', { id, field, value, updatedAt, updatedBy })
    .then(({ data: { error } }) => {
      if (!error) {
        dispatch(editTipsAtomic({ id, field, value, updatedAt, updatedBy }));
      }
    });
};

export default {
  getAllTips,
  handleTipsEdit,
  handleTipsCreate,
  handleTipsRemove,
  handleTipsEditAtomic,
};
