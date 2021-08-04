import { createSelector } from 'reselect';

export const guestEventsContainer = ({ guestEvents }) => guestEvents;

export const guestEventsSelector = createSelector(
  [guestEventsContainer],
  (guestEvents) => ({ guestEvents }),
);
