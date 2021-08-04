import { createSelector } from 'reselect';
import { getProps } from 'helpers';

import { itemsContainer } from '../base';

export const serviceCreditsSelector = createSelector(
  [itemsContainer],
  ({ serviceCredits }) => ({ serviceCredits }),
);

export const serviceCreditByIdSelector = createSelector(
  [itemsContainer, getProps],
  ({ serviceCredits }, { id }) => ({ serviceCredit: serviceCredits[id] }),
);
