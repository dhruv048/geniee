import Meteor from "../../../react-native-meteor";
import { dispatch } from "../../../store";
import { getCategories } from "../../../store/actions";

const getAllCategories = () =>{
  debugger;
    Meteor.call('getAllCategories',(err, res) =>{
        if(err){
            console.log('Please contact administrator.')
          }else{
            dispatch(getCategories({ data : res}))
          }
    })
};

const addBusiness = ({businessModel}, callBack) =>{
    Meteor.call('addNewService',businessModel,(err, res) =>{
        if(err){
            console.log('Please contact administrator.')
          }else{
            callBack(true);
          }
    })
};

export default {
    getAllCategories,
    addBusiness
}