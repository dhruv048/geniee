import axios from 'axios';
import { dispatch } from '../../../store';
import AsyncStorage from '@react-native-community/async-storage';

import {
  setSignedIn,
  wrongEmailPassword,
  setSignedOut,
  setLoggedInUser,
  setSignedUp,
  emailSent,
} from '../../../store/actions';

import { apiUrl } from 'settings';
import { getExpireDate } from 'helpers';
import Meteor from '../../../react-native-meteor';
import {OTPConfig} from '../../../config/settings';

const handleSignIn = (email, password, callBack) => {
  Meteor.loginWithPassword(email, password, (err, res) => {
    console.log('This is an error '+err);
    if (err) {
      dispatch(wrongEmailPassword());
      callBack(err);
    } else {
      dispatch(setSignedIn());
      dispatch(setLoggedInUser({ user : Meteor.user() }))
      callBack(true);
    }
  })
  //})
};


const handleSignOut = (callBack) => {
  Meteor.logout((err,res)=>{
    if(err){
      console.log('Please contact administrator.')
      callBack(err);
    }else{
      dispatch(setSignedOut());
      callBack(true);
    }
  })
};

const handleSignUp = (user, callBack) => {
  Meteor.call('signUpUser',user, (error,res) =>{
    if (res.error) {
      console.log('Please contact administrator.')
      callBack(res.error);
    } else {
      console.log('SignedUp successfully' + res.result);
      dispatch(setSignedUp());
      callBack(res.result);
    }
  })
};

const forgetPassword = (email,callBack) => {
  Meteor.call('forgotPasswordCustom', email,(err,res)=>{
    if(err){
      console.log('Please contact administrator.')
    }else{
      callBack(true);
    }
  })
};

const changeNewPassword = (email, confirmationcode, password,callBack) => {
  Meteor.call('setPasswordCustom',email,confirmationcode,password,(err,res)=>{
    if(err){
      console.log('Please contact administrator.')
    }else{
      callBack(true);
    }
  })
};

const PostSendSMS = (mobileNumber,message,cb) =>{
  axios({
    method :'post',
    url: OTPConfig.SMS_URL,
    data:{from:'Geniee', token:OTPConfig.SMS_TOKEN, to:mobileNumber, text:message}
  }).then((response)=>{
    cb(response);
  })
}


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
  handleSignUp,
  forgetPassword,
  changeNewPassword,
  PostSendSMS,
  //handleValidateToken,
  // handleResetActions,
  // handleResetPassword,
  // handleSetPassword,
  // handleSetupPassword,
  // handleChangePassword,
};
