import React, {useState, useEffect} from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import cookie from 'react-cookies';
import { ROUTES } from '../../settings/routes';

import {Nav} from './components';


const Admin = (props) => {
    const history = useHistory();
 const [loggedIn, updateLoggedIn] = useState(false);

useEffect(() => {
    const userId = cookie.load('genieeUserId');
    const isAuthorized = (cookie.load('authorized') && userId) || false;
    if (!isAuthorized || isAuthorized==0) {
        history.push(ROUTES.SIGNIN);
        return;
    }
});

return (
  <div id="wrapper">
  <main role="main">
  <Nav />
    <div id="page-wrapper">
    <div className="row">
      <div className="col-lg-12">
        <h1 className="page-header">Geniee</h1>
      </div>
      {/*  /.col-lg-12  --> */}
    </div>
    {/*  /.row  --> */}
    <div className="row">
      <div className="col-lg-3 col-md-6">
        <div className="panel panel-primary">
          <div className="panel-heading">
            <div className="row">
              <div className="col-xs-3">
                <i className="fa fa-comments fa-5x"></i>
              </div>
              <div className="col-xs-9 text-right">
                <div className="huge">26</div>
                <div>New Comments!</div>
              </div>
            </div>
          </div>
          <a >
            <div className="panel-footer">
              <span className="pull-left">View Details</span>
              <span className="pull-right"><i className="fa fa-arrow-circle-right"></i></span>
              <div className="clearfix"></div>
            </div>
          </a>
        </div>
      </div>
      <div className="col-lg-3 col-md-6">
        <div className="panel panel-green">
          <div className="panel-heading">
            <div className="row">
              <div className="col-xs-3">
                <i className="fa fa-tasks fa-5x"></i>
              </div>
              <div className="col-xs-9 text-right">
                <div className="huge">12</div>
                <div>New Tasks!</div>
              </div>
            </div>
          </div>
          <a >
            <div className="panel-footer">
              <span className="pull-left">View Details</span>
              <span className="pull-right"><i className="fa fa-arrow-circle-right"></i></span>
              <div className="clearfix"></div>
            </div>
          </a>
        </div>
      </div>
      <div className="col-lg-3 col-md-6">
        <div className="panel panel-yellow">
          <div className="panel-heading">
            <div className="row">
              <div className="col-xs-3">
                <i className="fa fa-shopping-cart fa-5x"></i>
              </div>
              <div className="col-xs-9 text-right">
                <div className="huge">124</div>
                <div>New Orders!</div>
              </div>
            </div>
          </div>
          <a >
            <div className="panel-footer">
              <span className="pull-left">View Details</span>
              <span className="pull-right"><i className="fa fa-arrow-circle-right"></i></span>
              <div className="clearfix"></div>
            </div>
          </a>
        </div>
      </div>
      <div className="col-lg-3 col-md-6">
        <div className="panel panel-red">
          <div className="panel-heading">
            <div className="row">
              <div className="col-xs-3">
                <i className="fa fa-support fa-5x"></i>
              </div>
              <div className="col-xs-9 text-right">
                <div className="huge">13</div>
                <div>Support Tickets!</div>
              </div>
            </div>
          </div>
          <a >
            <div className="panel-footer">
              <span className="pull-left">View Details</span>
              <span className="pull-right"><i className="fa fa-arrow-circle-right"></i></span>
              <div className="clearfix"></div>
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
  </main>
  </div>
);
};

export default Admin;