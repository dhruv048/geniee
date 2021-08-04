import { dispatch } from 'store';

import {
  editUserType,
  removeUserType,
  updateUserTypes,
  editUserTypeAtomic,
} from 'store/actions';

import { api } from '..';
import { uploadFile } from '../admin/handlers';

const getSeqId = (cb) => {
  api.get('/api/user-type/getUserTypeNextId').then(({ data: { id } }) => {
    cb(parseInt(id, 10) + 1);
  });
};

const getUserTypes = (cb) => {
  api.get('/api/user-type/getUserTypes').then(({ data }) => {
    if (data.error) {
      dispatch(updateUserTypes({ data: [] }));
      cb(false);
    } else {
      dispatch(updateUserTypes({ data: data.data }));
      cb(true);
    }
  });
};

const handleUserTypeCreate = (formData, cb) => {
  const { name, description, status, image, createdAt, createdBy } = formData;

  uploadFile(image)
    .then(({ imageUrl }) => {
      api.post('/api/user-type/createUserType', { name, description, status, imageUrl, createdAt, createdBy })
        .then(({ data: { error, id } }) => {
          if (error) cb({ error: true, done: false });
          else {
            dispatch(updateUserTypes({ data: [{
              id: parseInt(id, 10),
              name,
              description,
              status,
              createdAt,
              createdBy,
              imageUrl,
            }] }));
            cb({ error: false, done: true });
          }
        });
    })
    .catch(() => cb({ error: true, done: false }));
};

const handleUserTypeEdit = (formData, cb) => {
  const { id, name, description, status, updatedAt, updatedBy, image } = formData;

  if (image) {
    uploadFile(image)
      .then(({ imageUrl }) => {
        api.post('/api/user-type/editUserType', { id, name, description, status, updatedAt, updatedBy, imageUrl })
          .then(({ data: { error } }) => {
            if (error) cb({ error: true, done: false });
            else {
              dispatch(editUserType({ data: {
                id,
                name,
                description,
                status,
                updatedAt,
                updatedBy,
                imageUrl,
              } }));
              cb({ error: false, done: true });
            }
          });
      })
      .catch(() => cb({ error: true, done: false }));
  } else {
    api.post('/api/user-type/editUserType', { id, name, description, status, updatedAt, updatedBy })
      .then(({ data: { error } }) => {
        if (error) cb({ error: true, done: false });
        else {
          dispatch(editUserType({ data: {
            id,
            name,
            description,
            status,
            updatedAt,
            updatedBy,
          } }));
          cb({ error: false, done: true });
        }
      });
  }
};

const handleUserTypeEditAtomic = (formData) => {
  const { id, field, value, updatedAt, updatedBy } = formData;

  api.post('/api/user-type/editUserTypeAtomic', { id, field, value, updatedAt, updatedBy })
    .then(({ data: { error } }) => {
      if (!error) {
        dispatch(editUserTypeAtomic({ data: { id, field, value, updatedAt, updatedBy } }));
      }
    });
};

const handleUserTypeRemove = ({ id, deletedAt, deletedBy }, cb) => {
  api.post('/api/user-type/removeUserType', { id, deletedAt, deletedBy })
    .then(({ data: { error } }) => {
      if (error) cb({ error: true, done: false });
      else {
        dispatch(removeUserType({ data: { id, deletedAt, deletedBy } }));
        cb({ error: false, done: true });
      }
    });
};

export default {
  getSeqId,
  getUserTypes,
  handleUserTypeCreate,
  handleUserTypeEdit,
  handleUserTypeEditAtomic,
  handleUserTypeRemove,
};
