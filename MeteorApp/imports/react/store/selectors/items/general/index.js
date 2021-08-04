import { createSelector } from 'reselect';
import { getProps } from 'helpers';

import { itemsContainer } from '../base';

export const generalItemsSelector = createSelector(
  [itemsContainer],
  ({ general }) => ({ generalItems: general }),
);

export const generalItemByIdSelector = createSelector(
  [itemsContainer, getProps],
  ({ general }, { id }) => ({ generalItem: general[id] }),
);
