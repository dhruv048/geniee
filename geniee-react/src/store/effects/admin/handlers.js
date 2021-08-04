/* eslint-disable no-console */
import { dispatch } from '../../../store';
import {
  updateLoggedUser,
  updateOrders,
  setSignedOut,
} from '../../actions';
import Meteor from 'meteor/meteor';

 

const getLoggedUser = () => {  
  console.log(Meteor.getAuthToken(),localStorage.getItem('authToken'))
  Meteor._loginWithToken(localStorage.getItem('authToken'),(err,res)=>{
    console.log(err, res);
  });
  Meteor.call('getLoggedInUser', localStorage.getItem('authToken'),(err, res)=>{
    console.log(err, res);
    if(!err){
      dispatch(updateLoggedUser({ data: res }));
    }
    else{
      dispatch(setSignedOut());
    }
  })
};

const fetchOrders = () => {
  Meteor.call('getProductOrderForAdmin', (err, res) => {
    console.log(err, res)
   if(!err && !res.erroe)
    dispatch(updateOrders({data: res.result}))
})
};

const getAllAdminData = (userId) => {
  fetchOrders();
  getLoggedUser();
};

export default {
  getAllAdminData,
};
