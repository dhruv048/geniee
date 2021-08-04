import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ROUTES } from '../../settings/routes';
import Admin from '../Admin';
import  {Login} from '../Auth';
import Dashboard from '../../pages/Dashboard';
import './styles.css';

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
