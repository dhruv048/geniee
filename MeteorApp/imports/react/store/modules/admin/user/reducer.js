import {
  editUser,
  removeUser,
  updateUsers,
  editUserAtomic,
  updateLoggedUser,
  updateUserHistory,
  updateColumnSettings,
} from './actions';

export default {
  [updateUsers]: (state, { payload: { data } }) => ({
    ...state,
    users: {
      ...state.users,
      ...data,
    },
  }),
  [editUser]: (state, { payload: { data } }) => {
    const { id, ...rest } = data;

    return {
      ...state,
      users: {
        ...state.users,
        [id]: {
          ...state.users[id],
          ...rest,
        },
      },
    };
  },
  [editUserAtomic]: (state, { payload: { data: { id, field, value, updatedAt, updatedBy } } }) => ({
    ...state,
    users: {
      ...state.users,
      [id]: {
        ...state.users[id],
        [field]: value,
        updatedAt,
        updatedBy,
      },
    },
  }),
  [removeUser]: (state, { payload: { data: { id, deletedAt, deletedBy } } }) => ({
    ...state,
    users: {
      ...state.users,
      [id]: {
        ...state.users[id],
        deletedAt,
        deletedBy,
        archived: true,
      },
    },
  }),
  [updateLoggedUser]: (state, { payload: { data } }) => ({
    ...state,
    loggedUser: {
      ...state.loggedUser,
      ...data,
    },
  }),
  [updateUserHistory]: (state, { payload: { data, id } }) => ({
    ...state,
    users: {
      ...state.users,
      [id]: {
        ...state.users[id],
        history: data,
      },
    },
  }),
  [updateColumnSettings]: (state, { payload: { data } }) => {
    const settings = data
      .reduce((total, curr) => ({ ...total, [curr.table_name]: curr.cols }), {});

    return {
      ...state,
      loggedUser: {
        ...state.loggedUser,
        columnSettings: {
          ...state.loggedUser.columnSettings,
          ...settings,
        },
      },
    };
  },
};
