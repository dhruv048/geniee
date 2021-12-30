import { dispatch } from '../../../store';

import {
  getCartItems
} from '../../../store/actions';

import Meteor from '../../../react-native-meteor';

const addItemToCart = () =>{
  
}

const addItemToWishList = () =>{
  
}

const addOrder = (itemList ,cb) =>{
  Meteor.call('addOrder', itemList, (err, res) => {
    if(err){
      console.log('Please contact an adminsitrator'+err);
    }else{
      cb(res);
    }
  })
}

const getAllCartItems = () => {

}

const getAllWishList = () => {

}

const getMyOrders = () =>{

}

export default {
  addItemToCart,
  addItemToWishList,
  addOrder,
  getAllCartItems,
  getAllWishList,
  getMyOrders
};
