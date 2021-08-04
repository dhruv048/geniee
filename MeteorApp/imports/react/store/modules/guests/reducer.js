import { handleActions } from 'redux-actions';

import guests from './guests/reducer';
import infusionGuests from './infusionGuests/reducer';

export default handleActions(
  {
    ...guests,
    ...infusionGuests,
  },
  {
    guests: {},
    infusionGuests: {},
  },
);
