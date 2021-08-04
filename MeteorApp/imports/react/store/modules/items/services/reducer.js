import {
  editService,
  removeService,
  updateServices,
} from './actions';

export default {
  [editService]: (state, { payload: { data } }) => {
    const { id, ...rest } = data;

    return {
      ...state,
      services: {
        ...state.services,
        [id]: {
          ...state.services[id],
          ...rest,
        },
      },
    };
  },
  [removeService]: (state, { payload: { data: { id, deletedAt, deletedBy } } }) => ({
    ...state,
    services: {
      ...state.services,
      [id]: {
        ...state.services[id],
        deletedAt,
        deletedBy,
        archived: true,
      },
    },
  }),
  [updateServices]: (state, { payload: { data } }) => ({
    ...state,
    services: {
      ...state.services,
      ...data,
    },
  }),
};
