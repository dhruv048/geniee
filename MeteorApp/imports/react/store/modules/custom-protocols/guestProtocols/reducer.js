import {
  editGuestProtocol,
  updateProtocolDays,
  removeGuestProtocol,
  updateGuestProtocols,
  updateProtocolsFocus,
  updateProtocolInstructions,
} from './actions';

export default {
  [editGuestProtocol]: (state, { payload: { data } }) => {
    const { id, ...rest } = data;

    return {
      ...state,
      guestProtocols: {
        ...state.guestProtocols,
        [id]: {
          ...state.guestProtocols[id],
          ...rest,
        },
      },
    };
  },
  [removeGuestProtocol]: (state, { payload: { data: { id, deletedAt, deletedBy } } }) => ({
    ...state,
    guestProtocols: {
      ...state.guestProtocols,
      [id]: {
        ...state.guestProtocols[id],
        deletedAt,
        deletedBy,
        archived: true,
      },
    },
  }),
  [updateGuestProtocols]: (state, { payload: { data } }) => ({
    ...state,
    guestProtocols: {
      ...state.guestProtocols,
      ...data,
    },
  }),
  [updateProtocolDays]: (state, { payload: { id, days, protocolStarts } }) => ({
    ...state,
    guestProtocols: {
      ...state.guestProtocols,
      [id]: {
        ...state.guestProtocols[id],
        days,
        protocolStarts,
      },
    },
  }),
  [updateProtocolInstructions]: (state, { payload: { id, label, smallLabel, largeLabel } }) => ({
    ...state,
    guestProtocols: {
      ...state.guestProtocols,
      [id]: {
        ...state.guestProtocols[id],
        label,
        smallLabel,
        largeLabel,
      },
    },
  }),
  [updateProtocolsFocus]: (state, { payload: { protocolIds, mainHealthFocus } }) => {
    const updatedProtocols = protocolIds.reduce((res, id) => ({
      ...res,
      [id]: {
        ...state.guestProtocols[id],
        mainHealthFocus,
      },
    }), {});

    return {
      ...state,
      guestProtocols: {
        ...state.guestProtocols,
        ...updatedProtocols,
      },
    };
  },
};
