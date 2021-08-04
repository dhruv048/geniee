import { dispatch } from 'store';

import { updateProtocolRules } from 'store/actions';

import { api } from '../..';

const fetchProtocolRules = () => {
  api.get('/api/protocol-rule/fetchProtocolRules').then(({ data }) => {
    if (data.error) dispatch(updateProtocolRules({}));
    else dispatch(updateProtocolRules({ data: data.data }));
  });
};

const handleUpdateProtocolRules = (formData, cb) => {
  api
    .post('/api/protocol-rule/updateProtocolRules', formData)
    .then(({ data: { error } }) => {
      if (error) cb({ error: true, done: false });
      else {
        dispatch(updateProtocolRules({ data: formData }));
        cb({ error: false, done: true });
      }
    })
    .catch(() => cb({ error: true, done: false }));
};

export default {
  fetchProtocolRules,
  handleUpdateProtocolRules,
};
