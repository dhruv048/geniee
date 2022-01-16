import { dispatch } from '../../../store';

import {
  getCartItems,
  addCartItems,
  removeCartItems
} from '../../../store/actions';

import Meteor from '../../../react-native-meteor';

const getAllCartItems = () => {
  dispatch(getCartItems());
}

const addItemToCart = (items) =>{
  dispatch(addCartItems({data : items}));
}

const removeItemFromCart = (items) =>{
  dispatch(removeCartItems({data : items}));
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

const getAllWishList = () => {

}

const getMyOrders = () =>{

}

export default {
  addItemToCart,
  removeItemFromCart,
  addItemToWishList,
  addOrder,
  getAllCartItems,
  getAllWishList,
  getMyOrders
};
