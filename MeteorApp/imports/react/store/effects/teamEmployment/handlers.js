import { dispatch } from 'store';

import {
  editTeamEmployment,
  removeTeamEmployment,
  updateTeamEmployments,
  editTeamEmploymentAtomic } from 'store/actions';

import { api } from '..';

const handleGetAllTeamEmployments = () => {
  api.get('/api/team-employment/fetchAllTeamEmployments').then(({ data }) => {
    if (data.error) dispatch(updateTeamEmployments({}));
    else dispatch(updateTeamEmployments({ data: data.data }));
  });
};

const handleEditTeamEmployment = (formData, cb) => {
  api.post('/api/team-employment/editTeamEmployment', { ...formData }).then(({ data }) => {
    if (data.error) cb(false);
    else {
      dispatch(editTeamEmployment({ data: formData }));
      cb(true);
    }
  });
};

const handleCreateTeamEmployment = (formData, cb) => {
  api.post('/api/team-employment/createTeamEmployment', { ...formData }).then(({ data }) => {
    if (data.error) cb(false);
    else {
      const employment = {
        [+data.id]: {
          id: +data.id,
          ...formData,
        },
      };
      dispatch(updateTeamEmployments({ data: employment }));
      cb(data.id);
    }
  });
};

const handleEditAtomicTeamEmployment = (formData) => {
  const { id, field, value, updatedAt, updatedBy } = formData;

  api.post('/api/team-employment/editTeamEmploymentAtomic', { id, field, value, updatedAt, updatedBy })
    .then(({ data: { error } }) => {
      if (!error) {
        dispatch(editTeamEmploymentAtomic({ data: { id, field, value, updatedAt, updatedBy } }));
      }
    });
};

const handleRemoveTeamEmployment = ({ id, deletedAt, deletedBy }, cb) => {
  api.post('/api/team-employment/removeTeamEmployment', { id, deletedAt, deletedBy })
    .then(({ data: { error } }) => {
      if (error) cb({ error: true, done: false });
      else {
        dispatch(removeTeamEmployment({ data: { id, deletedAt, deletedBy } }));
        cb({ error: false, done: true });
      }
    });
};

export default {
  handleGetAllTeamEmployments,
  handleEditTeamEmployment,
  handleCreateTeamEmployment,
  handleRemoveTeamEmployment,
  handleEditAtomicTeamEmployment,
};
