import axios from 'axios';
import { dispatch } from '../../../store';
import AsyncStorage from '@react-native-community/async-storage';

import {
  setSignedIn,
  wrongEmailPassword,
  setSignedOut,
  setLoggedInUser,
} from '../../../store/actions';

import { apiUrl } from 'settings';
import { getExpireDate } from 'helpers';
import Meteor from '../../../react-native-meteor';

const handleSignIn = ({ email, password }, callBack) => {
  // Validate email/password
  //new Promise((resolve, reject) => {
  Meteor.loginWithPassword(email, password, (err, res) => {
    if (err) {
      dispatch(wrongEmailPassword());
      callBack(err);
    } else {
      dispatch(setSignedIn());
      //AsyncStorage.setItem('userToken', Meteor.getData()._tokenIdSaved);
      //AsyncStorage.setItem('loggedInUser', JSON.stringify(Meteor.user()));
      dispatch(setLoggedInUser({ user : Meteor.user() }))
      callBack(true);
    }
  })
  //})
};


const handleSignOut = (callBack) => {
  Meteor.logout((res,err)=>{
      console.log('This is result from handler '+res);
      dispatch(setSignedOut());
      callBack(true);
  })
  
  //AsyncStorage.removeItem('loggedInUser');
  //AsyncStorage.removeItem('userToken');
};

// axios({
//   method: 'post',
//   url: `${apiUrl}/api/auth/signin`,
//   data: { email, password },
// }).then(({ data }) => {
//   if (data.error) dispatch(wrongEmailPassword());
//   else if (data.data.requiresPasswordChange) {
//     // Authorize
//     const expireSignIn = getExpireDate(60 * 12);
//     cookie.save('userId', data.data.userId, { path: '/', expires: expireSignIn });
//     cookie.save('authorized', true, { path: '/', expires: expireSignIn });
//     // Redux
//     dispatch(setRequirePasswordChange());
//   } else {
//     // Save cookies
//     if (rememberMe) {
//       const expireAuth = getExpireDate(60 * 24 * 30);
//       cookie.save('email', email, { path: '/', expires: expireAuth });
//       cookie.save('password', password, { path: '/', expires: expireAuth });
//     }
//     // Authorize
//     const expireSignIn = getExpireDate(60 * 12);
//     cookie.save('authorized', true, { path: '/', expires: expireSignIn });
//     cookie.save('userId', data.data.userId, { path: '/', expires: expireSignIn });
//     // Redux
//     dispatch(setSignedIn());
//   }
// });

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
// const handleValidateToken = ({ token }) => axios({
//   method: 'post',
//   url: `${apiUrl}/api/auth/validateToken`,
//   data: { token },
// }).then(({ data }) => {
//   if (data.error) dispatch(setTokenValidated({ isValidToken: false }));
//   else dispatch(setTokenValidated({ isValidToken: true, userId: data.id }));
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

export default {
  handleSignIn,
  handleSignOut,
  // handleSignUp,
  //handleValidateToken,
  // handleResetActions,
  // handleResetPassword,
  // handleSetPassword,
  // handleSetupPassword,
  // handleChangePassword,
};