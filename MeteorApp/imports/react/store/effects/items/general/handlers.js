import { dispatch } from 'store';

import {
  editGeneralItem,
  removeGeneralItem,
  updateGeneralItems,
  editGeneralItemAtomic,
} from 'store/actions';

import { api } from '../..';

const getAllGeneralItems = () => {
  api.get('/api/general/fetchAllGeneralItems').then(({ data }) => {
    if (data.error) dispatch(updateGeneralItems({}));
    else dispatch(updateGeneralItems({ data: data.data }));
  });
};

const handleGeneralItemCreate = (formData, cb) => {
  api
    .post('api/general/createGeneralItem', formData)
    .then(({ data: { error, id } }) => {
      if (error) cb({ error: true });
      else {
        const data = {
          [+id]: {
            id: +id,
            ...formData,
          },
        };
        dispatch(updateGeneralItems({ data }));
        cb({ error: false, id });
      }
    })
    .catch(() => cb({ error: true }));
};

const handleGeneralItemEdit = (formData, cb) => {
  api
    .post('/api/general/editGeneralItem', formData)
    .then(({ data: { error } }) => {
      if (error) cb({ error: true, done: false });
      else {
        dispatch(editGeneralItem({ data: formData }));
        cb({ error: false, done: true });
      }
    })
    .catch(() => cb({ error: true, done: false }));
};

const handleGeneralItemRemove = ({ id, deletedAt, deletedBy }, cb) => {
  api.post('/api/general/removeGeneralItem', { id, deletedAt, deletedBy })
    .then(({ data: { error } }) => {
      if (error) cb({ error: true, done: false });
      else {
        dispatch(removeGeneralItem({ data: { id, deletedAt, deletedBy } }));
        cb({ error: false, done: true });
      }
    });
};

const handleGeneralItemEditAtomic = (formData) => {
  const { id, field, value, updatedAt, updatedBy } = formData;

  api.post('/api/general/editGeneralItemAtomic', { id, field, value, updatedAt, updatedBy })
    .then(({ data: { error } }) => {
      if (!error) {
        dispatch(editGeneralItemAtomic({ id, field, value, updatedAt, updatedBy }));
      }
    });
};

export default {
  getAllGeneralItems,
  handleGeneralItemEdit,
  handleGeneralItemCreate,
  handleGeneralItemRemove,
  handleGeneralItemEditAtomic,
};
