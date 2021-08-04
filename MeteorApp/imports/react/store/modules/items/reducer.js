import { handleActions } from 'redux-actions';

import events from './events/reducer';
import general from './general/reducer';
import services from './services/reducer';

export default handleActions(
  {
    ...events,
    ...general,
    ...services,
  },
  {
    events: {},
    general: {},
    services: {},
  },
);
