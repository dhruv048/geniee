import { Meteor } from 'meteor/meteor';
Meteor.publish('get-channel',()=>{
   let user= Meteor.user();
   if(user && user.profile.role===2){
       return ChatChannel.find();
   }else {
       return ChatChannel.find({users: {"$in": [Meteor.userId()]}});
   }
});
Meteor.publish('chat-list',(id)=>{
   // return   ChatItem.find({"$or":[{From:Meteor.userId},{To:Meteor.userId}]}).sort({createdAt: 1});
    return ChatItem.find({channelId:id},{sort:{createdAt: -1}});
});

Meteor.publish('chatUsers',()=> {
    var users=[];
    users= Meteor.users.find({"profile.createdBy": Meteor.userId()},
        {fields: {'_id': 1,'profile':1}});
    console.log(users)
    if(users.count>0)
        return users
    else
        return [];
})