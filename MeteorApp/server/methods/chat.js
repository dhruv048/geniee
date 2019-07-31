import {ChatChannels} from "../../lib/collections/chat";
import {ChatItems} from "../../lib/collections/chat";




Meteor.methods({
    'addChatChannel': (ServiceId) => {
        try {
            let service=Service.findOne({_id:ServiceId});
            let logged = Meteor.user();
            let channel = ChatChannels.findOne({$and: [{'service.Id': ServiceId}, {users: logged._id}]});
            if (channel) {
                return channel._id;
            }
            else {
                let ChatChannel = {
                    users: [service.createdBy, logged._id],
                    service:{Id:ServiceId,title:service.title},
                    creator: logged._id,
                    createDate: new Date(new Date().toUTCString()),
                    lastMessage: null,
                }
                return ChatChannels.insert(ChatChannel);
            }
        }
        catch (e) {
            throw new Meteor.Error(500, e.message);
        }
    },

    'addChatMessage': (Message,from) => {
        try {
            let chatChanel = ChatChannels.findOne({_id: Message.channelId});
            let ChatItem = {
                from: from? from :Meteor.userId(),
                messageOn: new Date(new Date().toUTCString()),
                messageData: Message.data,
                channelId: Message.channelId,
                seen: false
            }
            return ChatItems.insert(ChatItem);
        }
        catch (e) {
            throw new Meteor.Error(500, e.message);
        }
    },

    'updateMessageSeen': function (messagesList) {
        try {
            ChatItems.update({_id: {$in: messagesList}},
                {
                    $set: {seen: true}
                },
                {multi: true});

        }
        catch (e) {
            Meteor.Error(500, e.message)
        }
    },

    'uploadChatFile':function  (file,channelId) {
        let from=Meteor.userId()
        ChatFiles.write(new Buffer(file.data, 'base64'),
            {
                fileName: file.name,
                type: file.mime
            },
            (err, res) => {
                if (err) {
                   throw new Meteor.Error(err)
                }
                else {
                    console.log('res',res._id)
                    let Message = {
                        channelId: channelId,
                        data:{
                            src: res._id,
                            type: file.mime,
                            fileName: file.fileName
                        }
                    };

                    Meteor.call('addChatMessage',Message,from)
                }
            }, proceedAfterUpload = true)
    },

    'uploadProfileImage':function(image){
        console.log(image.name)
        let userId=Meteor.userId();
        ProfilePhoto.write(new Buffer(image.data, 'base64'),
            {
                fileName: image.name,
                type: image.mime
            },
            (err, res) => {
                if (err) {
                    console.log(err)
                }
                else {
                    console.log("imageId",res._id)
                    Meteor.users.update({_id:userId},{
                        $set:{'profile.profileImage':res._id}
                    })
                    return res._id;
                }
            },proceedAfterUpload = true)
    }
})