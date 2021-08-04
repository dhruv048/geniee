import { createSelector } from 'reselect';
import { getProps } from 'helpers';

export const adminContainer = ({ admin }) => admin;

export const usersSelector = createSelector(
  [adminContainer],
  ({ users }) => ({ users }),
);

export const userByIdSelector = createSelector(
  [adminContainer, getProps],
  ({ users }, { id }) => ({ user: users[id] }),
);

export const loggedUserSelector = createSelector(
  [adminContainer],
  ({ loggedUser }) => ({ loggedUser }),
);

export const passwordPolicySelector = createSelector(
  [adminContainer],
  ({ passwordPolicy }) => ({ passwordPolicy }),
);

export const userTypesSelector = createSelector(
  [adminContainer],
  ({ userTypes }) => ({ userTypes }),
);

export const userTypeByIdSelector = createSelector(
  [adminContainer, getProps],
  ({ userTypes }, { id }) => ({ userType: userTypes[id] }),
);

export const optionsSelector = createSelector(
  [adminContainer],
  ({ options }) => ({ options }),
);

export const fieldsMappingSelector = createSelector(
  [adminContainer],
  ({ fieldsMapping }) => ({ fieldsMapping }),
);

export const fieldTypesSelector = createSelector(
  [adminContainer],
  ({ fieldTypes }) => ({ fieldTypes }),
);

export const infusionFieldsSelector = createSelector(
  [adminContainer],
  ({ infusionFields }) => ({ infusionFields }),
);

export const customFieldsSelector = createSelector(
  [adminContainer],
  ({ customFields }) => ({ customFields }),
);

export const optionSourcesSelector = createSelector(
  [adminContainer],
  ({ optionSources }) => ({ optionSources }),
);

export const customProtocolRulesSelector = createSelector(
  [adminContainer],
  ({ customProtocolRules }) => ({ customProtocolRules }),
);

export const reportTemplatesSelector = createSelector(
  [adminContainer],
  ({ templates }) => ({ reports: (templates && templates.reports) || null }),
);

export const checkoutTemplatesSelector = createSelector(
  [adminContainer],
  ({ templates }) => ({ templates: (templates && templates.checkout) || null }),
);
