import { createSelector } from 'reselect';
import { getProps } from 'helpers';

import { itemsContainer } from '../base';

export const professionalServicesSelector = createSelector(
  [itemsContainer],
  ({ professionalServices }) => ({ professionalServices }),
);

export const professionalServiceByIdSelector = createSelector(
  [itemsContainer, getProps],
  ({ professionalServices }, { id }) => ({ professionalService: professionalServices[id] }),
);
