import {
  editGuest,
  removeGuest,
  updateGuests,
  editGuestAtomic,
  updateGuestImage,
} from './actions';

export default {
  [editGuest]: (state, { payload: { data } }) => {
    const { id, ...rest } = data;

    return {
      ...state,
      guests: {
        ...state.guests,
        [id]: {
          ...state.guests[id],
          ...rest,
        },
      },
    };
  },
  [removeGuest]: (state, { payload: { data: { id, deletedAt, deletedBy } } }) => ({
    ...state,
    guests: {
      ...state.guests,
      [id]: {
        ...state.guests[id],
        archived: true,
        deletedAt,
        deletedBy,
      },
    },
  }),
  [updateGuests]: (state, { payload: { data } }) => ({
    ...state,
    guests: {
      ...state.guests,
      ...data,
    },
  }),
  [editGuestAtomic]: (state, { payload: { data: { id, field, value } } }) => ({
    ...state,
    guests: {
      ...state.guests,
      [id]: {
        ...state.guests[id],
        [field]: value,
      },
    },
  }),
  [updateGuestImage]: (state, { payload: { data: { id, imageUrl } } }) => ({
    ...state,
    guests: {
      ...state.guests,
      [id]: {
        ...state.guests[id],
        imageUrl,
      },
    },
  }),
};
