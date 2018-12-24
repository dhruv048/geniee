import { Meteor } from 'meteor/meteor';



Meteor.methods({
    'addChatItem':(Mesage)=>{
        try{
            ChatItem.insert({
                From:Meteor.userId(),
                To:Mesage.To,
                createdAt: new Date(),
                chat:Mesage.chat,
                channelId:Mesage.channelId

            })
        }
        catch (e) {
            console.log(e.message);
            throw new Meteor.Error(403,e.message)

        }
    },

    'createChatChannel':(Channel)=>{
        var future=new Future();
        try{
            var user = Meteor.user();
            console.log(user)
           // var otherUserName=user.profile.role===0?Category.findOne({_id:Channel.To}).name : Meteor.users.findOne({_id:Channel.To}).profile.name;
            var otherUser=Category.findOne({_id:Channel.To});
            console.log(Channel.To+'channel:','usr:'+user._id)
            var users=[otherUser.createdBy,user._id]
            ChatChannel.insert({
                users:users,
                createdAt: new Date(),
                isActive:true,
                createdBy:user._id,
                createUser:{_id:user._id,name:user.profile.name},
                otherUser:{_id:Channel.To, name:otherUser.name}})
        }
        catch (e) {
            console.log(e.message);
            // throw new Meteor.Error(403,e.message)

        }
    }
});

