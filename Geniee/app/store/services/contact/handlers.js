import { dispatch } from '../..';
import {
  setSignedIn,
} from '../../actions';

import Meteor from '../../../react-native-meteor';

const contactUs = (contactInfo,callBack) => {
  Meteor.call('addContactUsMessage', contactInfo,(err,res)=>{
    if(err){
      console.log('Please contact administrator.')
    }else{
      callBack(true);
    }
  })
};

export default {
  contactUs
};
