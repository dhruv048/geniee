import { dispatch } from 'store';

import {
  editTeam,
  removeTeam,
  updateTeams,
  editTeamAtomic,
  updateTeamImage,
} from 'store/actions';

import { api } from '..';
import { uploadFile } from '../admin/handlers';

const getSeqId = (cb) => {
  api.get('/api/team/getTeamNextId').then(({ data: { id } }) => {
    cb(parseInt(id, 10) + 1);
  });
};

const getAllTeams = () => {
  api.get('/api/team/fetchAllTeams').then(({ data }) => {
    if (data.error) dispatch(updateTeams({}));
    else dispatch(updateTeams({ data: data.data }));
  });
};

const handleTeamCreate = (formData, cb) => {
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
    canBeAdded,
    streetAddress1,
    streetAddress2,
    city,
    provinceState,
    postalCode,
    country,
    phoneCell,
    phoneWork,
    phoneHome,
    phonePreffered,
    emailPrimary,
    emailSecondary,
    emailPreffered,
    otherContacts,
    socialFacebook,
    socialLinkedIn,
    socialInstagram,
    socialTwitter,
    sin,
    companyName,
    companyType,
    businessNumber,
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

  promise.then(({ imageUrl }) => api.post('/api/team/createTeam', { ...formData, imageUrl })
    .then(({ data: { error, id } }) => {
      if (error) cb({ error: true, done: false });
      else {
        const guest = {
          [+id]: {
            id: +id,
            title,
            firstName,
            middleName,
            lastName,
            prefferedName,
            birthDate,
            gender,
            maritalStatus,
            timezone,
            canBeAdded,
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
            phonePreffered,
            emailPrimary,
            emailSecondary,
            emailPreffered,
            otherContacts,
            socialFacebook,
            socialLinkedIn,
            socialInstagram,
            socialTwitter,
            sin,
            companyName,
            companyType,
            businessNumber,
            createdAt,
            createdBy,
          },
        };
        dispatch(updateTeams({ data: guest }));
        cb({ error: false, id });
      }
    }))
    .catch(() => cb({ error: true, done: false }));
};

const handleTeamEdit = (formData, cb) => {
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
    canBeAdded,
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
    phonePreffered,
    emailPrimary,
    emailSecondary,
    emailPreffered,
    otherContacts,
    socialFacebook,
    socialLinkedIn,
    socialInstagram,
    socialTwitter,
    sin,
    companyName,
    companyType,
    businessNumber,
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
      api.post('/api/team/editTeam', { ...formData, imageUrl })
        .then(({ data: { error } }) => {
          if (error) cb({ error: true, done: false });
          else {
            dispatch(editTeam({ data: {
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
              canBeAdded,
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
              phonePreffered,
              emailPrimary,
              emailSecondary,
              emailPreffered,
              otherContacts,
              socialFacebook,
              socialLinkedIn,
              socialInstagram,
              socialTwitter,
              sin,
              companyName,
              companyType,
              businessNumber,
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

const handleTeamEditAtomic = (formData) => {
  const { id, field, value, updatedAt, updatedBy } = formData;

  api.post('/api/team/editTeamAtomic', { id, field, value, updatedAt, updatedBy })
    .then(({ data: { error } }) => {
      if (!error) {
        dispatch(editTeamAtomic({ data: { id, field, value, updatedAt, updatedBy } }));
      }
    });
};

const handleTeamRemove = ({ id, deletedAt, deletedBy }, cb) => {
  api.post('/api/team/removeTeam', { id, deletedAt, deletedBy })
    .then(({ data: { error } }) => {
      if (error) cb({ error: true, done: false });
      else {
        dispatch(removeTeam({ data: { id, deletedAt, deletedBy } }));
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
      api.post('/api/team/updateTeamImage', { id, imageUrl })
        .then(({ data: { error } }) => {
          if (error) cb(false);
          else {
            dispatch(updateTeamImage({ data: { id, imageUrl } }));
            cb(true);
          }
        })
        .catch(() => cb(false));
    })
    .catch(() => cb(false));
};

export default {
  getSeqId,
  getAllTeams,
  handleTeamCreate,
  handleTeamEdit,
  handleTeamEditAtomic,
  handleTeamRemove,
  updateImage,
};
