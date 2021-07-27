import { dispatch } from 'store';

import {
  editUser,
  removeUser,
  updateUsers,
  editUserAtomic,
  updateUserHistory,
} from 'store/actions';

import { api } from '..';
import { uploadFile } from '../admin/handlers';

const getUserSeqId = (cb) => {
  api.get('/api/user/getUserNextId').then(({ data: { id } }) => {
    cb(parseInt(id, 10) + 1);
  });
};

const getAllUsers = () => {
  api.get('/api/user/fetchAllUsers').then(({ data }) => {
    if (data.error) dispatch(updateUsers({}));
    else dispatch(updateUsers({ data: data.data }));
  });
};

const handleUserCreate = (formData, cb) => {
  const {
    firstName,
    middleName,
    lastName,
    email,
    status,
    role,
    userTypes,
    createdAt,
    createdBy,
    image,
  } = formData;

  const promise = new Promise((resolve, reject) => {
    if (image) {
      uploadFile(image)
        .then(({ imageUrl }) => resolve({ imageUrl }))
        .catch(() => reject());
    } else resolve({ imageUrl: null });
  });

  promise
    .then(({ imageUrl }) => {
      api.post('/api/user/createUser', { ...formData, imageUrl })
        .then(({ data: { error, id } }) => {
          if (error) cb({ error: true, done: false });
          else {
            const user = {
              [+id]: {
                userId: parseInt(id, 10),
                firstName,
                middleName,
                lastName,
                email,
                status,
                role,
                userTypes,
                createdAt,
                createdBy,
                imageUrl,
              },
            };
            dispatch(updateUsers({ data: user }));
            cb({ error: false, done: true });
          }
        })
        .catch(() => cb({ error: true, done: false }));
    })
    .catch(() => cb({ error: true, done: false }));
};

const handleUserEdit = (formData, cb) => {
  const {
    id,
    firstName,
    middleName,
    lastName,
    email,
    status,
    role,
    userTypes,
    updatedAt,
    updatedBy,
    image,
  } = formData;

  const promise = new Promise((resolve, reject) => {
    if (image) {
      uploadFile(image)
        .then(({ imageUrl }) => resolve({ imageUrl }))
        .catch(() => reject());
    } else resolve({ imageUrl: null });
  });

  promise
    .then(({ imageUrl }) => {
      api.post('/api/user/editUser', { ...formData, imageUrl })
        .then(({ data: { error } }) => {
          if (error) cb({ error: true, done: false });
          else {
            dispatch(editUser({ data: {
              id,
              firstName,
              middleName,
              lastName,
              email,
              status,
              role,
              userTypes,
              updatedAt,
              updatedBy,
              imageUrl,
            } }));
            cb({ error: false, done: true });
          }
        })
        .catch(() => cb({ error: true, done: false }));
    })
    .catch(() => cb({ error: true, done: false }));
};

const handleUserEditAtomic = (formData) => {
  const { id, field, value, updatedAt, updatedBy } = formData;

  api.post('/api/user/editUserAtomic', { id, field, value, updatedAt, updatedBy })
    .then(({ data: { error } }) => {
      if (!error) {
        dispatch(editUserAtomic({ data: { id, field, value, updatedAt, updatedBy } }));
      }
    });
};

const handleUserRemove = ({ id, deletedAt, deletedBy }, cb) => {
  api.post('/api/user/removeUser', { id, deletedAt, deletedBy })
    .then(({ data: { error } }) => {
      if (error) cb({ error: true, done: false });
      else {
        dispatch(removeUser({ data: { id, deletedAt, deletedBy } }));
        cb({ error: false, done: true });
      }
    });
};

const handleGetUserLoginHistory = (id, cb) => {
  api.post('/api/user/fetchUserLoginHistory', { id })
    .then(({ data: { error, data } }) => {
      if (error) cb({ error: true, done: false });
      else {
        dispatch(updateUserHistory({ id, data }));
        cb({ error: false, done: true });
      }
    });
};

export default {
  getUserSeqId,
  getAllUsers,
  handleUserCreate,
  handleUserEdit,
  handleUserEditAtomic,
  handleUserRemove,
  handleGetUserLoginHistory,
};
