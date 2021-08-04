import { createSelector } from 'reselect';
import { getProps } from 'helpers';

import { customProtocolsContainer } from '../base';

export const protocolsSelector = createSelector(
  [customProtocolsContainer],
  ({ protocols }) => ({ protocols }),
);

export const protocolByIdSelector = createSelector(
  [customProtocolsContainer, getProps],
  ({ protocols }, { id }) => ({ protocol: protocols[id] }),
);
