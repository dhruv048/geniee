import { createSelector } from 'reselect';
import { getProps } from 'helpers';

export const guestsContainer = ({ guests }) => guests;

export const guestsSelector = createSelector(
  [guestsContainer],
  ({ guests }) => ({ guests }),
);

export const guestByIdSelector = createSelector(
  [guestsContainer, getProps],
  ({ guests }, { id }) => ({ guest: guests[id] }),
);

export const infusionGuestsSelector = createSelector(
  [guestsContainer],
  ({ infusionGuests }) => ({ infusionGuests }),
);
