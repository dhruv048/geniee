import React, {useState, useEffect} from 'react';
import { Redirect, Route, Switch, withRouter, useHistory, useRouteMatch } from 'react-router-dom';
import cookie from 'react-cookies';
import { ROUTES } from '../../settings/routes';
import adminHandlers from '../../store/effects/admin/handlers';

import {Nav, Dashboard, Orders} from './components';



const Admin = () => {
    const history = useHistory();
//  const [loggedIn, updateLoggedIn] = useState(false);

 let { path, url } = useRouteMatch();

 console.log(url, path)

useEffect(() => {
    const userId = cookie.load('genieeUserId');
    const isAuthorized = (cookie.load('authorized') && userId) || false;
    if (!isAuthorized || isAuthorized==0) {
        history.push(ROUTES.SIGNIN);
        return;
    }
    else{
      adminHandlers.getAllAdminData();
    }
});

return (
  <div id="wrapper">
  <main role="main">
  <Nav />
    <div id="page-wrapper">
    <Switch> 
        <Route path={ `${url}/${ROUTES.ADMIN_ORDERS}` } component={ Orders } />
        <Route path={ `${url}/${ROUTES.ADMIN_DASHBOARD}` } component={ Dashboard } />
        <Route render={ () => <Redirect to={ `${url}/${ROUTES.ADMIN_DASHBOARD}` } /> } />
      </Switch>
  </div>
  </main>
  </div>
);
};

export default withRouter(Admin);