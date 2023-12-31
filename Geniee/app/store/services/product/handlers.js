import { countBy } from "underscore";
import Meteor from "../../../react-native-meteor"

const saveProduct = (product, cb) => {
  Meteor.call('addNewProduct', product, (err, res) => {
    if (err) {
      console.log('Please contact administrator.')
      cb(err);
    } else {
      cb(true);
    }
  })
}

const updateProduct = (productId, product, imageTobeRemove, cb) => {
  Meteor.call('updateProduct',productId, product, imageTobeRemove,(err, res) => {
    if (err) {
      console.log('Please contact administrator.')
      cb(err);
    } else {
      cb(true);
    }
  })

}

const getBusinessList = (loggedUser, callBack) => {
  Meteor.call('getBusinessList', loggedUser, (err, res) => {
    if (err) {
      console.log('Please contact administrator.')
      callBack(err);
    } else {
      callBack(res);
    }
  })
}

const getMyProducts = (loggedUser, callBack) => {
  Meteor.call('getMyProducts', loggedUser, (err, res) => {
    if (err) {
      console.log('Please contact administrator.')
      callBack(err);
    } else {
      callBack(res.result);
    }
  })
}

const getStoreCategoriesWise = (categoryId, callBack) => {
  Meteor.call('getStoreCategoriesWise', categoryId, (err, res) => {
    if (err) {
      console.log('Please contact administrator.')
      callBack(err);
    } else {
      callBack(res);
    }
  })
}

const getAllProducts = (callBack) => {
  Meteor.call('getPopularProducts', (err, res) => {
    if (err) {
      console.log('Please contact administrator.')
      callBack(err);
    } else {
      callBack(res);
    }
  })
}

const getAllStores = (callBack) => {
  Meteor.call('getPopularStores', (err, res) => {
    if (err) {
      console.log('Please contact administrator.')
      callBack(err);
    } else {
      callBack(res);
    }
  })
}

export default {
  saveProduct,
  updateProduct,
  getBusinessList,
  getMyProducts,
  getStoreCategoriesWise,
  getAllProducts,
  getAllStores
}