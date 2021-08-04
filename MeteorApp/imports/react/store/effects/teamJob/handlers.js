import { dispatch } from 'store';

import {
  editTeamJob,
  removeTeamJob,
  updateTeamJobs,
  editTeamJobAtomic } from 'store/actions';

import { api } from '..';

const handleGetAllTeamJobs = () => {
  api.get('/api/team-job/fetchAllTeamJobs').then(({ data }) => {
    if (data.error) dispatch(updateTeamJobs({}));
    else dispatch(updateTeamJobs({ data: data.data }));
  });
};

const handleEditTeamJob = (formData, cb) => {
  api.post('/api/team-job/editTeamJob', { ...formData }).then(({ data }) => {
    if (data.error) cb(false);
    else {
      dispatch(editTeamJob({ data: formData }));
      cb(true);
    }
  });
};

const handleCreateTeamJob = (formData, cb) => {
  api.post('/api/team-job/createTeamJob', { ...formData }).then(({ data }) => {
    if (data.error) cb(false);
    else {
      const job = {
        [+data.id]: {
          id: +data.id,
          ...formData,
        },
      };
      dispatch(updateTeamJobs({ data: job }));
      cb(data.id);
    }
  });
};

const handleEditAtomicTeamJob = (formData) => {
  const { id, field, value, updatedAt, updatedBy } = formData;

  api.post('/api/team-job/editTeamJobAtomic', { id, field, value, updatedAt, updatedBy })
    .then(({ data: { error } }) => {
      if (!error) {
        dispatch(editTeamJobAtomic({ data: { id, field, value, updatedAt, updatedBy } }));
      }
    });
};

const handleRemoveTeamJob = ({ id, deletedAt, deletedBy }, cb) => {
  api.post('/api/team-job/removeTeamJob', { id, deletedAt, deletedBy })
    .then(({ data: { error } }) => {
      if (error) cb({ error: true, done: false });
      else {
        dispatch(removeTeamJob({ data: { id, deletedAt, deletedBy } }));
        cb({ error: false, done: true });
      }
    });
};

export default {
  handleGetAllTeamJobs,
  handleEditTeamJob,
  handleCreateTeamJob,
  handleRemoveTeamJob,
  handleEditAtomicTeamJob,
};
