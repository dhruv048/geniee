/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
import { dispatch } from 'store';

import {
  editGuest,
  removeGuest,
  updateGuests,
  editGuestAtomic,
  updateGuestImage,
} from 'store/actions';

import { api } from '..';
import { uploadFile } from '../admin/handlers';

const getSeqId = (cb) => {
  api.get('/api/guest/getGuestNextId').then(({ data: { id } }) => {
    cb(parseInt(id, 10) + 1);
  });
};

const getAllGuests = () => {
  api.get('/api/guest/fetchAllGuests').then(({ data }) => {
    if (data.error) dispatch(updateGuests({}));
    else dispatch(updateGuests({ data: data.data }));
  });
};

const handleGuestCreate = (formData, cb) => {
  const {
    title,
    firstName,
    middleName,
    lastName,
    prefferedName,
    birthDate,
    gender,
    maritalStatus,
    timezone,
    image,
    streetAddress1,
    streetAddress2,
    city,
    provinceState,
    postalCode,
    country,
    phoneCell,
    phoneWork,
    phoneHome,
    phoneCellNotes,
    phoneWorkNotes,
    phoneHomeNotes,
    phonePreffered,
    emailPrimary,
    emailSecondary,
    emailPreffered,
    otherContacts,
    socialFacebook,
    socialLinkedIn,
    socialInstagram,
    socialTwitter,
    createdAt,
    createdBy,
  } = formData;

  const promise = new Promise((resolve, reject) => {
    if (image) {
      uploadFile(image)
        .then(({ imageUrl }) => resolve({ imageUrl }))
        .catch(() => reject());
    } else resolve({ imageUrl: null });
  });

  promise.then(({ imageUrl }) => api.post('api/guest/createGuest', { ...formData, imageUrl })
    .then(({ data: { error, id } }) => {
      if (error) cb({ error: true });
      else {
        const guest = {
          [+id]: {
            id: parseInt(id, 10),
            title,
            firstName,
            middleName,
            lastName,
            prefferedName,
            birthDate,
            gender,
            maritalStatus,
            timezone,
            imageUrl,
            streetAddress1,
            streetAddress2,
            city,
            provinceState,
            postalCode,
            country,
            phoneCell,
            phoneWork,
            phoneHome,
            phoneCellNotes,
            phoneWorkNotes,
            phoneHomeNotes,
            phonePreffered,
            emailPrimary,
            emailSecondary,
            emailPreffered,
            otherContacts,
            socialFacebook,
            socialLinkedIn,
            socialInstagram,
            socialTwitter,
            createdAt,
            createdBy,
          },
        };
        dispatch(updateGuests({ data: guest }));
        cb({ error: false, id });
      }
    }))
    .catch(() => cb({ error: true }));
};

const handleGuestEdit = (formData, cb) => {
  const {
    id,
    title,
    firstName,
    middleName,
    lastName,
    prefferedName,
    birthDate,
    gender,
    maritalStatus,
    timezone,
    image,
    streetAddress1,
    streetAddress2,
    city,
    provinceState,
    postalCode,
    country,
    phoneCell,
    phoneWork,
    phoneHome,
    phoneCellNotes,
    phoneWorkNotes,
    phoneHomeNotes,
    phonePreffered,
    emailPrimary,
    emailSecondary,
    emailPreffered,
    otherContacts,
    socialFacebook,
    socialLinkedIn,
    socialInstagram,
    socialTwitter,
    updatedAt,
    updatedBy,
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
      api.post('/api/guest/editGuest', { ...formData, imageUrl })
        .then(({ data: { error } }) => {
          if (error) cb({ error: true, done: false });
          else {
            dispatch(editGuest({ data: {
              id,
              title,
              firstName,
              middleName,
              lastName,
              prefferedName,
              birthDate,
              gender,
              maritalStatus,
              timezone,
              imageUrl,
              streetAddress1,
              streetAddress2,
              city,
              provinceState,
              postalCode,
              country,
              phoneCell,
              phoneWork,
              phoneHome,
              phoneCellNotes,
              phoneWorkNotes,
              phoneHomeNotes,
              phonePreffered,
              emailPrimary,
              emailSecondary,
              emailPreffered,
              otherContacts,
              socialFacebook,
              socialLinkedIn,
              socialInstagram,
              socialTwitter,
              updatedAt,
              updatedBy,
            } }));
            cb({ error: false, done: true });
          }
        })
        .catch(() => cb({ error: true, done: false }));
    })
    .catch(() => cb({ error: true, done: false }));
};

const handleGuestEditAtomic = (formData) => {
  const { id, field, value, updatedAt, updatedBy } = formData;

  api.post('/api/guest/editGuestAtomic', { id, field, value, updatedAt, updatedBy })
    .then(({ data: { error } }) => {
      if (!error) {
        dispatch(editGuestAtomic({ data: { id, field, value, updatedAt, updatedBy } }));
      }
    });
};

const handleGuestRemove = ({ id, deletedAt, deletedBy }, cb) => {
  api.post('/api/guest/removeGuest', { id, deletedAt, deletedBy })
    .then(({ data: { error } }) => {
      if (error) cb({ error: true, done: false });
      else {
        dispatch(removeGuest({ data: { id, deletedAt, deletedBy } }));
        cb({ error: false, done: true });
      }
    });
};

const updateImage = ({ id, file }, cb) => {
  const promise = new Promise((resolve, reject) => {
    if (file) {
      uploadFile(file)
        .then(({ imageUrl }) => resolve({ imageUrl }))
        .catch(() => reject());
    } else resolve({ imageUrl: null });
  });

  promise
    .then(({ imageUrl }) => {
      api.post('/api/guest/updateGuestImage', { id, imageUrl })
        .then(({ data: { error } }) => {
          if (error) cb(false);
          else {
            dispatch(updateGuestImage({ data: { id, imageUrl } }));
            cb(true);
          }
        })
        .catch(() => cb(false));
    })
    .catch(() => cb(false));
};

export default {
  getSeqId,
  getAllGuests,
  handleGuestCreate,
  handleGuestEdit,
  handleGuestEditAtomic,
  handleGuestRemove,
  updateImage,
};
