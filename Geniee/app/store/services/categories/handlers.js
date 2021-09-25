import Meteor from "../../../react-native-meteor";
import { dispatch } from "../..";
import { getBusinessType, getCategories } from "../../actions";

const getAllCategories = () =>{
    Meteor.call('getAllCategories',(err, res) =>{
        if(err){
            console.log('Please contact administrator.')
          }else{
            dispatch(getCategories({ data : res}))
          }
    })
};

const getAllBusinessType = (callBack) =>{
  Meteor.call('getBusinessType',(err, res) =>{
      if(err){
          console.log('Please contact administrator.')
        }else{
          dispatch(getBusinessType({ data : res}));
        }
  })
};

export default {
    getAllCategories,
    getAllBusinessType
}