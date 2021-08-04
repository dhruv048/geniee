/* eslint-disable no-console */
import { dispatch } from '../../../store';
import {
  updateLoggedUser,
  updateOrders,
  setSignedOut,
} from '../../actions';


 

const getLoggedUser = () => {  
  Meteor.call('getLoggedInUser',(err, res)=>{
    // console.log(err, res);
    if(!err){
      dispatch(updateLoggedUser({ data: res.result }));
    }
    else{
      dispatch(setSignedOut());
    }
  })
};

const fetchOrders = () => {
  Meteor.call('getProductOrderForAdmin', (err, res) => {
    // console.log(err, res)
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
