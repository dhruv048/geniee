import { createSelector } from 'reselect';
import { getProps } from 'helpers';

import { itemsContainer } from '../base';

export const servicesSelector = createSelector(
  [itemsContainer],
  ({ services }) => ({ services }),
);

export const serviceByIdSelector = createSelector(
  [itemsContainer, getProps],
  ({ services }, { id }) => ({ service: services[id] }),
);
