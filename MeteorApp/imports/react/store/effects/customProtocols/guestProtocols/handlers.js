import { getState, dispatch } from 'store';
import moment from 'moment';

import {
  updateProtocols,
  editGuestProtocol,
  removeGuestProtocol,
  updateProtocolDays,
  updateProtocolsFocus,
  updateGuestProtocols,
  updateProtocolInstructions,
} from 'store/actions';

import { api } from '../..';
import { updateLabel, updateDescription, getOptionValueById } from './helpers';

const getAllGuestProtocols = () => {
  api.get('/api/guest-protocol/fetchAllProtocols').then(({ data }) => {
    if (data.error) dispatch(updateGuestProtocols({}));
    else {
      dispatch(updateGuestProtocols({ data: data.data }));
    }
  });
};

const getCurrentSessionProtocols = (sessionId, protocolId) => {
  api
    .get('/api/guest-protocol/fetchCurrentSessionProtocolsById', { params: { sessionId, protocolId } })
    .then(({ data: { error, data } }) => {
      if (!error) dispatch(updateGuestProtocols({ data }));
    });
};

const getCurrentProtocolById = (protocolId) => {
  api.get('/api/protocol/fetchProtocol', { params: { protocolId } }).then(({ data: { error, data } }) => {
    if (!error) dispatch(updateProtocols({ data }));
  });
};

const handleGuestProtocolCreatePerGuest = (formData, cb) => {
  const { customProtocols: { protocols }, admin: { options } } = getState();

  Promise
    .all(formData.servingTime.map((time, index) => new Promise((resolve, reject) => {
      const { labelTemplate, descriptionTemplate, protocolStarts, servingTime, servingType, ...rest } = formData;

      const servingTimeText = getOptionValueById({ data: options, field: 'servingTimes', id: time.id });

      const protocol = protocols[formData.protocolId];
      let protocolDays = formData.days;
      let protocolStartDate = protocolStarts;

      if (!protocol.itemIsProduct && ['8:00 AM', '8:30 AM', '9:00 AM'].includes(servingTimeText)) {
        protocolDays = 3;
      }
      if (['8:00 AM', '8:30 AM', '9:00 AM'].includes(servingTimeText)) {
        protocolStartDate = moment(protocolStarts).day(5).format('YYYY-MM-DD');
      }

      const protocolTotal = formData.protocolRate * formData.qty * protocolDays;

      const data = {
        ...rest,
        servingTime: time.id,
        servingType: servingType[index].id,
        days: protocolDays,
        protocolStarts: protocolStartDate,
        protocolTotal,
        label: updateLabel({
          data: {
            qty: formData.qty,
            servingTime: time.id,
          },
          options,
          template: labelTemplate,
        }),
        description: updateDescription({
          data: {
            ffu: formData.protocolFFU,
            qty: formData.qty,
            days: formData.days,
            servingTime: time.id,
            protocolUnit: formData.protocolUnit,
          },
          options,
          template: descriptionTemplate,
        }),
      };
      api
        .post('/api/guest-protocol/createProtocol', data)
        .then(({ data: { error, id } }) => {
          if (error) reject();
          else {
            const guestProtocol = {
              [+id]: {
                id: +id,
                ...data,
              },
            };
            dispatch(updateGuestProtocols({ data: guestProtocol }));
            resolve(+id);
          }
        });
    })))
    .then((data) => cb({ error: false, id: data[0] }))
    .catch(() => cb({ error: true }));
};

const handleGuestProtocolClonePerGuest = (formData, cb) => api
  .post('/api/guest-protocol/createProtocol', formData)
  .then(({ data: { error, id } }) => {
    if (error) cb({ error: true });
    else {
      const guestProtocol = {
        [+id]: {
          id: +id,
          ...formData,
        },
      };
      dispatch(updateGuestProtocols({ data: guestProtocol }));
      cb({ error: false });
    }
  });

const handleGuestProtocolEditPerGuest = (formData, cb) => api
  .post('/api/guest-protocol/editProtocol', formData)
  .then(({ data: { error } }) => {
    if (error) cb({ error: true });
    else {
      const { id, ...rest } = formData;
      const guestProtocol = {
        id: +id,
        ...rest,
      };
      dispatch(editGuestProtocol({ data: guestProtocol }));
      if (formData.update.updateCP || formData.update.updateCPAndSession) {
        getCurrentProtocolById(formData.protocolId);
      }
      if (formData.update.updateCPAndSession) {
        getCurrentSessionProtocols(formData.sessionId, formData.protocolId);
      }
      cb({ error: false });
    }
  });

const handleGuestProtocolCreatePerProtocol = (formData, cb) => {
  const { guests, ...rest } = formData;

  Promise
    .all(guests.map((guestId) => new Promise((resolve, reject) => {
      const guestFormData = { guestId, ...rest };

      api
        .post('/api/guest-protocol/createProtocol', guestFormData)
        .then(({ data: { error, id } }) => {
          if (error) reject();
          else {
            const guestProtocol = {
              [+id]: {
                id: +id,
                ...rest,
              },
            };
            dispatch(updateGuestProtocols({ data: guestProtocol }));
            resolve(+id);
          }
        });
    })))
    .then(() => {
      cb({ error: false, done: true });
    })
    .catch(() => {
      cb({ error: true, done: false });
    });
};

const handleUpdateProtocolDays = ({ id, days, protocolStarts }, cb) => {
  api.post('/api/guest-protocol/updateProtocolDates', { id, days, protocolStarts })
    .then(({ data: { error } }) => {
      if (error) cb({ error: true, done: false });
      else {
        dispatch(updateProtocolDays({ id, days, protocolStarts }));
        cb({ error: false, done: true });
      }
    });
};

const handleUpdateHealthFocus = ({ protocolIds, mainHealthFocus }, cb) => {
  api.post('/api/guest-protocol/updateHealthFocus', { protocolIds, mainHealthFocus })
    .then(({ data: { error } }) => {
      if (error) cb({ error: true, done: false });
      else {
        dispatch(updateProtocolsFocus({ protocolIds, mainHealthFocus }));
        cb({ error: false, done: true });
      }
    });
};

const handleUpdateInstructions = (formData) => {
  const { id, label } = formData;

  api.post('/api/guest-protocol/updateInstructions', formData)
    .then(({ data: { error } }) => {
      if (!error) {
        dispatch(updateProtocolInstructions({ id, label }));
      }
    });
};

const handleProtocolRemove = ({ id, deletedAt, deletedBy }, cb) => {
  api.post('/api/guest-protocol/removeProtocol', { id, deletedAt, deletedBy })
    .then(({ data: { error } }) => {
      if (error) cb({ error: true, done: false });
      else {
        dispatch(removeGuestProtocol({ data: { id, deletedAt, deletedBy } }));
        cb({ error: false, done: true });
      }
    });
};

const handleGuestProtocolCreate = (formData, cb) => {
  api
    .post('/api/guest-protocol/createProtocol', formData)
    .then(({ data: { error, id } }) => {
      if (error) cb({ error: true });
      else {
        const guestProtocol = {
          [+id]: {
            id: +id,
            ...formData,
          },
        };
        dispatch(updateGuestProtocols({ data: guestProtocol }));
        cb({ error: false });
      }
    });
};

const handleGuestProtocolEdit = (formData, cb) => api
  .post('/api/guest-protocol/editProtocol', formData)
  .then(({ data: { error } }) => {
    if (error) cb({ error: true });
    else {
      dispatch(editGuestProtocol({ data: formData }));
      cb({ error: false });
    }
  });

export default {
  getAllGuestProtocols,
  handleProtocolRemove,
  handleGuestProtocolEdit,
  handleUpdateHealthFocus,
  handleUpdateProtocolDays,
  handleUpdateInstructions,
  handleGuestProtocolCreate,
  getCurrentSessionProtocols,
  handleGuestProtocolEditPerGuest,
  handleGuestProtocolClonePerGuest,
  handleGuestProtocolCreatePerGuest,
  handleGuestProtocolCreatePerProtocol,
};
