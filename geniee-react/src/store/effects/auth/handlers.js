// import Meteor  from 'meteor-react-js';
import cookie from 'react-cookies';
import { dispatch } from '../../../store';
import { hashPassword } from '../../../../node_modules/meteor-react-js/dist/lib/utils';
import {
  wrongEmailPassword,
  emailNotFound,
  emailExists,
  resetEmailSent,
  resetActions,
  setSignedIn,
  setSignedOut,
  setSignedUp,
  setTokenValidated,
  setPasswordChanged,
  setRequirePasswordChange,
  setToken,
} from '../../actions';

import { getExpireDate } from '../../../helpers';
import Meteor from 'meteor-react-js';

const handleResetActions = ({ action }) => dispatch(resetActions({ action }));

const handleSignIn = ({ email, password, rememberMe }) => {
  // Validate email/password
  // Meteor.loginWithPassword({username: email}, password, function (err,res) {
    Meteor.call('customLogin',{email, password:hashPassword(password)}, function (err,res) {
    console.log(err,res)
    if (err) dispatch(wrongEmailPassword());
  
    // else if (data.data.requiresPasswordChange) {
    //   // Authorize
    //   const expireSignIn = getExpireDate(60 * 12);
    //   cookie.save('userId', data.data.userId, { path: '/', expires: expireSignIn });
    //   cookie.save('authorized', true, { path: '/', expires: expireSignIn });
    //   // Redux
    //   dispatch(setRequirePasswordChange());
    // } 
    else {
      // Save cookies
      if (rememberMe) {
        const expireAuth = getExpireDate(60 * 24 * 30);
        cookie.save('email', email, { path: '/', expires: expireAuth });
        cookie.save('password', password, { path: '/', expires: expireAuth });
      }
      // Authorize
      const expireSignIn = getExpireDate(60 * 12);
      cookie.save('authorized', true, { path: '/', expires: expireSignIn });
      cookie.save('genieeUserId', res.uesrId, { path: '/', expires: expireSignIn });
      // Redux
      dispatch(setSignedIn({userId: res.userId}));
      dispatch(setToken({token: res.token}));
      localStorage.setItem('authToken', res.token);
    }
  });
};

// const handleSignUp = ({ username, email, password }) => {
//   // Validate user (server)
//   axios({
//     method: 'post',
//     url: `${apiUrl}/api/auth/signup`,
//     data: {
//       username,
//       email,
//       password,
//     },
//   }).then(({ data }) => {
//     if (data.error) dispatch(emailExists);
//     else {
//       const expireAuth = getExpireDate(60 * 24 * 30);
//       // Save cookies
//       cookie.save('email', email, { path: '/', expires: expireAuth });
//       cookie.save('password', password, { path: '/', expires: expireAuth });
//       // Redux
//       dispatch(setSignedUp());
//     }
//   });
// };

// const handleValidateToken = ({ token }) => axios({
//   method: 'post',
//   url: `${apiUrl}/api/auth/validateToken`,
//   data: { token },
// }).then(({ data }) => {
//   if (data.error) dispatch(setTokenValidated({ isValidToken: false }));
//   else dispatch(setTokenValidated({ isValidToken: true, userId: data.id }));
// });

// const handleResetPassword = ({ email }) => axios({
//   method: 'post',
//   url: `${apiUrl}/api/auth/forgotPassword`,
//   data: { email },
// }).then(({ data }) => {
//   if (data.error) dispatch((emailNotFound()));
//   else dispatch(resetEmailSent());
// });

// const handleChangePassword = ({ userId, password }) => axios({
//   method: 'post',
//   url: `${apiUrl}/api/auth/updatePassword`,
//   data: {
//     id: userId,
//     password,
//   },
// }).then(({ data }) => {
//   if (data.error) {
//     dispatch(setPasswordChanged({ isSuccess: false }));
//   } else {
//     dispatch(setPasswordChanged({ isSuccess: true }));
//   }
// });

// const handleSetPassword = ({ password }, cb) => axios({
//   method: 'post',
//   url: `${apiUrl}/api/auth/updatePassword`,
//   data: {
//     id: parseInt(cookie.load('userId'), 10),
//     password,
//   },
// }).then(({ data }) => {
//   if (data.error) cb(false);
//   else cb(true);
// });

// const handleSetupPassword = ({ email, password }, cb) => axios({
//   method: 'post',
//   url: `${apiUrl}/api/auth/setupPassword`,
//   data: {
//     email,
//     password,
//   },
// }).then(({ data }) => {
//   if (data.error) cb(false);
//   else {
//     // Authorize
//     const expireSignIn = getExpireDate(60 * 12);
//     cookie.save('authorized', true, { path: '/', expires: expireSignIn });
//     cookie.save('userId', data.data.userId, { path: '/', expires: expireSignIn });
//     // Redux
//     dispatch(setSignedIn());
//     cb(true);
//   }
// });

const handleSignOut = () => {
  dispatch(setSignedOut());
  cookie.save('authorized', false, { path: '/', expires: null });
  cookie.save('genieeUserId', 0, { path: '/', expires: null });
};

export default {
  handleSignIn,
  handleSignOut,
  // handleSignUp,
  // handleValidateToken,
  handleResetActions,
  // handleResetPassword,
  // handleSetPassword,
  // handleSetupPassword,
  // handleChangePassword,
};
