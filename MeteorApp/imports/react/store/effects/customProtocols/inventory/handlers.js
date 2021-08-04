import { dispatch } from 'store';

import {
  updateInventoryItems,
  updateInventoryNote,
  updateInventoryNotes,
} from 'store/actions';

import { api } from '../..';

const handleGetAllInventoryNotes = () => new Promise((resolve, reject) => {
  api.get('/api/inventory-note/fetchAllInventoryNotes').then(({ data }) => {
    if (data.error) reject();
    else {
      dispatch(updateInventoryNotes({ data: data.data }));
      resolve();
    }
  });
});

const getAllInventory = () => {
  api.get('/api/inventory/fetchAllInventory').then(({ data }) => {
    if (data.error) dispatch(updateInventoryItems({}));
    else {
      dispatch(updateInventoryItems({ data: data.data }));
      Promise.all([
        handleGetAllInventoryNotes(),
      ]);
    }
  });
};

const handleInventoryCreate = (formData, cb) => {
  api
    .post('api/inventory/createInventory', { ...formData })
    .then(({ data: { error, id } }) => {
      if (error) cb({ error: true });
      else {
        const { purchaseDetails: { disposables, linens, equipment }, ...rest } = formData;
        const inventory = {
          [+id]: {
            id: +id,
            ...rest,
            disposables,
            linens,
            equipment,
          },
        };
        dispatch(updateInventoryItems({ data: inventory }));
        cb({ error: false, id });
      }
    })
    .catch(() => cb({ error: true }));
};

const handleInventoryEdit = (formData, cb) => {
  cb();
};

const handleInventoryRemove = (formData, cb) => {
  cb({ error: false, done: true });
};

const handleInventoryPostCreate = (formData, cb) => {
  api
    .post('/api/inventory-note/createInventoryNote', { ...formData })
    .then(({ data: { error, id } }) => {
      if (error) cb(false);
      else {
        dispatch(updateInventoryNote({ id: +id, fields: { ...formData, id: +id } }));
        cb(true);
      }
    })
    .catch(() => cb(false));
};

export default {
  getAllInventory,
  handleInventoryEdit,
  handleInventoryCreate,
  handleInventoryRemove,
  handleInventoryPostCreate,
};
