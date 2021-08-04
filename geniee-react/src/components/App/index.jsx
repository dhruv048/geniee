import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ROUTES } from '../../settings/routes';
import Admin from '../Admin';
import  {Login} from '../Auth';
import Dashboard from '../../pages/Dashboard';
// import Meteor from 'meteor-react-js';
// import '../../App.css';

  // Meteor.connect('ws://139.59.59.117/websocket',{autoConnect :true, autoReconnect : true, reconnectInterval : 10000});
  // Meteor.connect('ws://192.168.1.67:3002/websocket',{autoConnect :true, autoReconnect : true, reconnectInterval : 10000})
const App = () => (
  <Router>
    <Switch>
      <Route path={ ROUTES.SIGNIN } component={ Login } />y
      <Route  path={ ROUTES.ADMIN } component={ Admin } />
      {/* <Route path={ ROUTES.SIGNUP } component={ SignUp } />
      <Route path={ ROUTES.FORGOT_PASSWORD } component={ ForgotPassword } />
      <Route path={ ROUTES.SET_PASSWORD } component={ SetPassword } />
      <Route path={ ROUTES.RESET_PASSWORD } component={ ResetPassword } />
      <Route path={ ROUTES.SETUP_PASSWORD } component={ SetupPassword } /> */}
      <Route exact path={ ROUTES.DASHBOARD } component={ Dashboard } />
    </Switch>
  </Router>
);

export default App;
