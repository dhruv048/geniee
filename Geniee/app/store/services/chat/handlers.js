import Meteor from '../../../react-native-meteor';

const getAllChatItems = (loggedUser,callBack) => {
  Meteor.call('getAllChatItems', loggedUser ,(err,res)=>{
    if(err){
      console.log('Please contact administrator.')
    }else{
      callBack(res);
    }
  })
};

export default {
    getAllChatItems
};
