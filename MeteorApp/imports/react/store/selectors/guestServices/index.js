import { createSelector } from 'reselect';

export const guestServicesContainer = ({ guestServices }) => guestServices;

export const guestServicesSelector = createSelector(
  [guestServicesContainer],
  (guestServices) => ({ guestServices }),
);
