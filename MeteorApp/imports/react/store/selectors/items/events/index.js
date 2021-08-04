import { createSelector } from 'reselect';
import { getProps } from 'helpers';

import { itemsContainer } from '../base';

export const eventsSelector = createSelector(
  [itemsContainer],
  ({ events }) => ({ events }),
);

export const eventByIdSelector = createSelector(
  [itemsContainer, getProps],
  ({ events }, { id }) => ({ event: events[id] }),
);
