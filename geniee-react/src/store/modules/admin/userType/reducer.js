/* eslint-disable no-param-reassign */
import {
  editUserType,
  removeUserType,
  updateUserTypes,
  editUserTypeAtomic,
} from '../actions';

export default {
  [updateUserTypes]: (state, { payload: { data } }) => ({
    ...state,
    userTypes: {
      ...state.userTypes,
      ...data,
    },
  }),
  [editUserType]: (state, { payload: { data } }) => {
    const { id, ...rest } = data;

    return {
      ...state,
      userTypes: {
        ...state.userTypes,
        [id]: {
          ...state.userTypes[id],
          ...rest,
        },
      },
    };
  },
  [editUserTypeAtomic]: (state, { payload: { data: { id, field, value, updatedAt, updatedBy } } }) => ({
    ...state,
    userTypes: {
      ...state.userTypes,
      [id]: {
        ...state.userTypes[id],
        [field]: value,
        updatedAt,
        updatedBy,
      },
    },
  }),
  [removeUserType]: (state, { payload: { data: { id, deletedAt, deletedBy } } }) => ({
    ...state,
    userTypes: {
      ...state.userTypes,
      [id]: {
        ...state.userTypes[id],
        deletedAt,
        deletedBy,
        archived: true,
      },
    },
  }),
};
