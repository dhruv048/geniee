import { dispatch } from 'store';

import {
  editTeamEmergencyContact,
  removeTeamEmergencyContact,
  updateTeamEmergencyContacts,
  editTeamEmergencyContactAtomic } from 'store/actions';

import { api } from '..';

const handleGetAllTeamEmergencyContacts = () => {
  api.get('/api/team-emergency-contact/fetchAllTeamEmergencyContacts').then(({ data }) => {
    if (data.error) dispatch(updateTeamEmergencyContacts({}));
    else dispatch(updateTeamEmergencyContacts({ data: data.data }));
  });
};

const handleEditTeamEmergencyContact = (formData, cb) => {
  api.post('/api/team-emergency-contact/editTeamEmergencyContact', { ...formData }).then(({ data }) => {
    if (data.error) cb(false);
    else {
      dispatch(editTeamEmergencyContact({ data: formData }));
      cb(true);
    }
  });
};

const handleCreateTeamEmergencyContact = (formData, cb) => {
  api.post('/api/team-emergency-contact/createTeamEmergencyContact', { ...formData }).then(({ data }) => {
    if (data.error) cb(false);
    else {
      const employment = {
        [+data.id]: {
          id: +data.id,
          ...formData,
        },
      };
      dispatch(updateTeamEmergencyContacts({ data: employment }));
      cb(data.id);
    }
  });
};

const handleEditAtomicTeamEmergencyContact = (formData) => {
  const { id, field, value, updatedAt, updatedBy } = formData;

  api.post('/api/team-emergency-contact/editTeamEmergencyContactAtomic', { id, field, value, updatedAt, updatedBy })
    .then(({ data: { error } }) => {
      if (!error) {
        dispatch(editTeamEmergencyContactAtomic({ data: { id, field, value, updatedAt, updatedBy } }));
      }
    });
};

const handleRemoveTeamEmergencyContact = ({ id, deletedAt, deletedBy }, cb) => {
  api.post('/api/team-emergency-contact/removeTeamEmergencyContact', { id, deletedAt, deletedBy })
    .then(({ data: { error } }) => {
      if (error) cb({ error: true, done: false });
      else {
        dispatch(removeTeamEmergencyContact({ data: { id, deletedAt, deletedBy } }));
        cb({ error: false, done: true });
      }
    });
};

export default {
  handleGetAllTeamEmergencyContacts,
  handleEditTeamEmergencyContact,
  handleCreateTeamEmergencyContact,
  handleRemoveTeamEmergencyContact,
  handleEditAtomicTeamEmergencyContact,
};
