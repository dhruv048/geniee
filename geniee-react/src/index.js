import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import store from './store';
import { App } from './components';
// import Meteor from 'meteor-react-js';
import './App.css';
//  Meteor.connect('ws://192.168.1.228:3000/websocket',{autoConnect :true, autoReconnect : true, reconnectInterval : 10000});
ReactDOM.render(
  <Provider store={ store }>
    <App />
  </Provider>,
  document.getElementById('root'),
);