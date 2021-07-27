/* eslint-disable max-len */
import { handleActions } from 'redux-actions';

import user from './user/reducer';
import options from './options/reducer';
import userType from './userType/reducer';
import templates from './templates/reducer';
import fieldTypes from './fieldTypes/reducer';
import customFields from './customFields/reducer';
import fieldsMapping from './fieldsMapping/reducer';
import optionSources from './optionSources/reducer';
import customProtocolRules from './customProtocolRules/reducer';

export default handleActions(
  {
    ...user,
    ...options,
    ...userType,
    ...templates,
    ...fieldTypes,
    ...customFields,
    ...optionSources,
    ...fieldsMapping,
    ...customProtocolRules,
  },
  {
    users: {},
    options: {},
    userTypes: {},
    templates: {},
    loggedUser: {
      columnSettings: {},
    },
    fieldTypes: {},
    customFields: {},
    optionSources: {},
    fieldsMapping: {},
    passwordPolicy: {},
    customProtocolRules: {},
  },
);
