import { handleActions } from 'redux-actions';

import products from './products/reducer';
import inventory from './inventory/reducer';
import suppliers from './suppliers/reducer';
import protocols from './protocols/reducer';
import ingredients from './ingredients/reducer';
import guestProtocols from './guestProtocols/reducer';

export default handleActions(
  {
    ...products,
    ...inventory,
    ...protocols,
    ...suppliers,
    ...ingredients,
    ...guestProtocols,
  },
  {
    products: {},
    inventory: {},
    protocols: {},
    suppliers: {},
    ingredients: {},
    guestProtocols: {},
  },
);
