import { createSelector } from 'reselect';
import { getProps } from 'helpers';
import moment from 'moment';

import { customProtocolsContainer } from '../base';
import { guestSessionsSelector } from '../../sessions';

export const guestProtocolsSelector = createSelector(
  [customProtocolsContainer],
  ({ guestProtocols }) => ({ guestProtocols }),
);

export const guestProtocolByIdSelector = createSelector(
  [customProtocolsContainer, getProps],
  ({ guestProtocols }, { id }) => ({ guestProtocol: guestProtocols[id] }),
);

export const guestProtocolsBySessionIdSelector = createSelector(
  [customProtocolsContainer, getProps],
  ({ guestProtocols }, { sessionId }) => ({ sessionProtocols: Object
    .values(guestProtocols)
    .filter((gs) => gs.sessionId === sessionId) }),
);

export const guestProtocolsByGuestAndSessionSelector = createSelector(
  [customProtocolsContainer, getProps],
  ({ guestProtocols }, { guestId, sessionId }) => ({
    guestProtocols: Object
      .values(guestProtocols)
      .filter((gp) => gp.guestId === guestId && gp.sessionId === sessionId && !gp.archived),
  }),
);

export const guestProtocolsByGuestSessionIdSelector = createSelector(
  [customProtocolsContainer, guestSessionsSelector, getProps],
  ({ guestProtocols }, { guestSessions }, { id, guestId, sessionId }) => {
    const guestSession = guestSessions[id];
    const travel = guestSession.travel || {};
    const { arrivalDate, departureDate } = travel;
    const protocols = Object
      .values(guestProtocols)
      .filter((gp) => gp.guestId === guestId
        && gp.sessionId === sessionId
        && moment(gp.protocolStarts).isSameOrAfter(moment(arrivalDate))
        && moment(gp.protocolStarts).isSameOrBefore(moment(departureDate))
        && !gp.archived);
    return { guestProtocols: protocols };
  },
);
