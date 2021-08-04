import { handleActions } from 'redux-actions';

import sessions from './sessions/reducer';
import teamSessions from './team-sessions/reducer';
import guestSessions from './guest-sessions/reducer';
import infusionSessions from './infusion-sessions/reducer';

export default handleActions(
  {
    ...sessions,
    ...teamSessions,
    ...guestSessions,
    ...infusionSessions,
  },
  {
    sessions: {},
    teamSessions: {},
    guestSessions: {},
    infusionSessions: {},
  },
);
