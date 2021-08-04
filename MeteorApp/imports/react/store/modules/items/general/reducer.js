import {
  editGeneralItem,
  removeGeneralItem,
  updateGeneralItems,
  editGeneralItemAtomic,
} from './actions';

export default {
  [editGeneralItem]: (state, { payload: { data } }) => {
    const { id, ...rest } = data;

    return {
      ...state,
      general: {
        ...state.general,
        [id]: {
          ...state.general[id],
          ...rest,
        },
      },
    };
  },
  [removeGeneralItem]: (state, { payload: { data: { id, deletedAt, deletedBy } } }) => ({
    ...state,
    general: {
      ...state.general,
      [id]: {
        ...state.general[id],
        deletedAt,
        deletedBy,
        archived: true,
      },
    },
  }),
  [updateGeneralItems]: (state, { payload: { data } }) => ({
    ...state,
    general: {
      ...state.general,
      ...data,
    },
  }),
  [editGeneralItemAtomic]: (state, { payload: { id, field, value, updatedAt, updatedBy } }) => ({
    ...state,
    general: {
      ...state.general,
      [id]: {
        ...state.general[id],
        [field]: value,
        updatedAt,
        updatedBy,
      },
    },
  }),
};
