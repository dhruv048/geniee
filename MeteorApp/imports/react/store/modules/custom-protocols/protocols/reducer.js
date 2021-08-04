import {
  editProtocol,
  removeProtocol,
  updateProtocols,
  editProtocolAtomic,
} from './actions';

export default {
  [editProtocol]: (state, { payload: { data } }) => {
    const { id, ...rest } = data;

    return {
      ...state,
      protocols: {
        ...state.protocols,
        [id]: {
          ...state.protocols[id],
          ...rest,
        },
      },
    };
  },
  [removeProtocol]: (state, { payload: { data: { id, deletedAt, deletedBy } } }) => ({
    ...state,
    protocols: {
      ...state.protocols,
      [id]: {
        ...state.protocols[id],
        deletedAt,
        deletedBy,
        archived: true,
      },
    },
  }),
  [updateProtocols]: (state, { payload: { data } }) => ({
    ...state,
    protocols: {
      ...state.protocols,
      ...data,
    },
  }),
  [editProtocolAtomic]: (state, { payload: { data: { id, field, value, updatedAt, updatedBy } } }) => ({
    ...state,
    protocols: {
      ...state.protocols,
      [id]: {
        ...state.protocols[id],
        [field]: value,
        updatedAt,
        updatedBy,
      },
    },
  }),
};
