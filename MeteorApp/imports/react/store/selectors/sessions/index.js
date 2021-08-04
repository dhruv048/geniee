import { createSelector } from 'reselect';
import { getProps } from 'helpers';
import moment from 'moment';

import { adminContainer } from '../admin';
import { itemsContainer } from '../items/base';
import { customProtocolsContainer } from '../custom-protocols/base';

export const sessionsContainer = ({ sessions }) => sessions;

export const sessionsSelector = createSelector(
  [sessionsContainer],
  ({ sessions }) => ({ sessions }),
);

export const sessionByIdSelector = createSelector(
  [sessionsContainer, getProps],
  ({ sessions }, { id }) => ({ session: sessions[id] }),
);

export const teamSessionsSelector = createSelector(
  [sessionsContainer],
  ({ teamSessions }) => ({ teamSessions }),
);

export const teamSessionByIdSelector = createSelector(
  [sessionsContainer, getProps],
  ({ teamSessions }, { id }) => ({ teamSession: teamSessions[id] }),
);

export const teamSessionsByTeamIdSelector = createSelector(
  [sessionsContainer, getProps],
  ({ teamSessions }, { teamId }) => ({ teamSessions: Object
    .values(teamSessions)
    .filter((ts) => ts.teamId === teamId) }),
);

export const guestSessionsSelector = createSelector(
  [sessionsContainer],
  ({ guestSessions }) => ({ guestSessions }),
);

export const guestSessionByIdSelector = createSelector(
  [sessionsContainer, getProps],
  ({ guestSessions }, { id }) => ({ guestSession: guestSessions[id] }),
);

export const guestsByGuestSessionId = createSelector(
  [sessionsContainer, getProps],
  ({ guestSessions }, { sessionId }) => ({ sessionGuests: Object
    .values(guestSessions)
    .filter((gs) => gs.sessionId === sessionId && !gs.archived)
    .map((gs) => ({ id: gs.id, guestId: gs.guestId }))
    .filter(({ guestId }, pos, self) => self.findIndex((item) => item.guestId === guestId) === pos),
  }),
);

export const guestSessionsByGuestIdSelector = createSelector(
  [sessionsContainer, getProps],
  ({ guestSessions }, { guestId }) => ({ guestSessions: Object
    .values(guestSessions)
    .filter((gs) => gs.guestId === guestId) }),
);

export const guestSessionByGuestAndSessionIdSelector = createSelector(
  [sessionsContainer, getProps],
  ({ guestSessions }, { guestId, sessionId }) => ({ guestSession: Object
    .values(guestSessions)
    .find((gs) => gs.guestId === guestId && gs.sessionId === sessionId) }),
);

export const spendingsByGuestAndWeekAndTypeSelector = createSelector(
  [sessionsContainer, customProtocolsContainer, adminContainer, getProps],
  ({ guestSessions }, { guestProtocols }, { options }, { spendingType, weekNo, guestId, guestSessionId }) => {
    const guestSession = guestSessions[guestSessionId] || {};
    const customProtocolsCategory = options.spendingCategories.find((c) => c.option === 'Custom Protocols');
    const guestSpendings = Object
      .values(guestSession.spendings || {})
      .filter((sp) => sp.spendingWeek === weekNo && sp.spendingType === spendingType && !sp.archived);
    const protocols = Object
      .values(guestProtocols || {})
      .filter((gp) => gp.guestId === guestId && gp.week === weekNo && gp.package === spendingType && !gp.archived)
      .map((gp) => ({ ...gp, spendingCategory: +customProtocolsCategory.id }));
    return { spendings: [...guestSpendings, ...protocols] };
  },
);

export const spendingsByGuestSessionIdSelector = createSelector(
  [sessionsContainer, getProps],
  ({ guestSessions }, { id }) => {
    const guestSession = guestSessions[id] || {};
    const guestSpendings = Object
      .values(guestSession.spendings || {})
      .filter((sp) => !sp.archived);
    return { spendings: guestSpendings };
  },
);

export const spendingsByGuestSelector = createSelector(
  [sessionsContainer, customProtocolsContainer, adminContainer, getProps],
  ({ guestSessions }, { guestProtocols }, { options }, { guestId, guestSessionId }) => {
    const guestSession = guestSessions[guestSessionId] || {};
    const arrivalDate = guestSession.travel ? guestSession.travel.arrivalDate : null;
    const departureDate = guestSession.travel ? guestSession.travel.departureDate : null;
    const customProtocolsCategory = options.spendingCategories.find((c) => c.option === 'Custom Protocols');
    const guestSpendings = Object
      .values(guestSession.spendings || {})
      .filter((sp) => !sp.archived);
    let protocols = Object
      .values(guestProtocols || {})
      .filter((gp) => gp.guestId === guestId && gp.sessionId === guestSession.sessionId && !gp.archived)
      .map((gp) => ({ ...gp, spendingCategory: +customProtocolsCategory.id }));
    if (arrivalDate && departureDate) {
      protocols = protocols.filter((gp) => moment(gp.protocolStarts).isSameOrAfter(moment(arrivalDate))
        && moment(gp.protocolStarts).isSameOrBefore(moment(departureDate)));
    }
    return { spendings: [...guestSpendings, ...protocols] };
  },
);

export const spendingItemByCategoryAndIdSelector = createSelector(
  [adminContainer, itemsContainer, customProtocolsContainer, getProps],
  ({ options }, items, protocols, { data: { spendingCategory, itemId, protocolId } }) => {
    const category = options.spendingCategories.find((o) => +o.id === +spendingCategory);
    if (!category) return null;
    if (category.option === 'Professional Services') return { spendingItem: items.professionalServices ? items.professionalServices[itemId] : null };
    if (category.option === 'Service Credit') return { spendingItem: items.serviceCredits ? items.serviceCredits[itemId] : null };
    if (category.option === 'Tips') return { spendingItem: items.tips ? items.tips[itemId] : null };
    if (category.option === 'Custom Protocols') return { spendingItem: protocols.protocols ? protocols.protocols[protocolId] : null };
    if (category.option === 'Products') return { spendingItem: protocols.products ? protocols.products[itemId] : null };
  },
);

export const infusionSessionsSelector = createSelector(
  [sessionsContainer],
  ({ infusionSessions }) => ({ infusionSessions }),
);
