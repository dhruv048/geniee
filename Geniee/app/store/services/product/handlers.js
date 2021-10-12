import { countBy } from "underscore";
import Meteor from "../../../react-native-meteor"

const saveProduct = (product, cb) => {
        Meteor.call('addNewProduct', product, (err, res) => {
            if(err){
                console.log('Please contact administrator.')
                cb(err);
              }else{
                cb(true);
              }
        })
}

const updateProduct = (product,productId,imageTobeRemove, cb) => {
    Meteor.call('updateProduct', product, (err, res) => {
        if(err){
            console.log('Please contact administrator.')
            cb(err);
          }else{
            cb(true);
          }
    })

}

export default {
    saveProduct,
    updateProduct,
}