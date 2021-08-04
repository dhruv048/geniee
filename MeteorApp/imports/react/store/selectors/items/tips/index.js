import { createSelector } from 'reselect';
import { getProps } from 'helpers';

import { itemsContainer } from '../base';

export const tipsSelector = createSelector(
  [itemsContainer],
  ({ tips }) => ({ tips }),
);

export const tipsByIdSelector = createSelector(
  [itemsContainer, getProps],
  ({ tips }, { id }) => ({ tips: tips[id] }),
);
