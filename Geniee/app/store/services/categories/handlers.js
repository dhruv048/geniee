import Meteor from "../../../react-native-meteor";
import { dispatch } from "../..";
import { getCategories } from "../../actions";

const getAllCategories = () =>{
    Meteor.call('getAllCategories',(err, res) =>{
        if(err){
            console.log('Please contact administrator.')
          }else{
            dispatch(getCategories({ data : res}))
          }
    })
};

export default {
    getAllCategories
}