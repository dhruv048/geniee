import { Meteor } from 'meteor/meteor';

Meteor.methods({
    'addChatItem':(Mesage)=>{
        try{
            ChatItem.insert({
                From:Meteor.userId(),
                To:Mesage.To,
                createdAt: new Date(),
                chat:Mesage.chat,
                channelId:Mesage.channelId,
            })
            let channel=ChatChannel.findOne({_id:Mesage.channelId});
            if(channel.createUser._id===Mesage.To){
                channel.createUser.newMessage++;
            }
            else{
                channel.otherUser.newMessage++;
            }
            ChatChannel.update({_id: channel._id}, {
                $set: {
                   createUser:channel.createUser,
                    otherUser:channel.otherUser
                }
            });
        }
        catch (e) {
            console.log(e.message);
            throw new Meteor.Error(403,e.message)

        }
    },

    'createChatChannel':(Channel)=>{
        try{
            var user = Meteor.user();
            console.log(user)
           // var otherUserName=user.profile.role===0?Category.findOne({_id:Channel.To}).name : Meteor.users.findOne({_id:Channel.To}).profile.name;
            var otherUser=Category.findOne({_id:Channel.To});
            console.log(Channel.To+'channel:','usr:'+user._id)
            var users=[otherUser.createdBy,user._id]
          return  ChatChannel.insert({
              users:users,
              createdAt: new Date(),
              isActive:true,
              createdBy:user._id,
              createUser:{_id:user._id,name:user.profile.name,newMessage:0,contact:user.profile.contactNo},
              otherUser:{_id:Channel.To, name:otherUser.name, title:otherUser.title,newMessage:0}
          });
        }
        catch (e) {
            console.log(e.message);
            // throw new Meteor.Error(403,e.message)

        }
    },

    'removeMessageCount':(channelId)=>{
        let channel=ChatChannel.findOne({_id:channelId});
        if(channel.createUser._id===Meteor.userId()){
            channel.createUser.newMessage=0;
        }
        else{
            channel.otherUser.newMessage=0;
        }
        ChatChannel.update({_id: channel._id}, {
            $set: {
                createUser:channel.createUser,
                otherUser:channel.otherUser
            }
        });
    },
    // async getMessageCount() {
    //    let getcount=async()=>{
    //        let user= await Meteor.user();
    //        let channels= await ChatChannel.find();
    //        var count=0;
    //        channels.map((itm) => {
    //                 count = user.profile.role !== 2 ? (itm.otherUser._id === user._id ? count + itm.otherUser.newMessage : count + 0) : count + itm.otherUser.newMessage;
    //             })
    //         return count;
    //     }
    //
    //     let countt= await getcount();
    //    return await countt;
    // }
});

