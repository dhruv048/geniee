import {ChatChannels,TypingList,ChatItems} from "../../lib/collections/chat";




Meteor.methods({
    'addChatChannel': (businessId) => {
        try {
            let business=Business.findOne({_id:businessId});
            let logged = Meteor.user();
            let channel = ChatChannels.findOne({$and: [{'business.Id': businessId}, {users: logged._id}]});
            if (channel) {
                return channel._id;
            }
            else {
                let ChatChannel = {
                    users: [business.createdBy, logged._id],
                    business:{Id:businessId,title:business.businessName},
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

    'addChatChannel_old': (ServiceId) => {
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
                seen: false,
                to:chatChanel.users.filter(item=>{return item!=Meteor.userId()})
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
    'addRemoveTyper':(channelId,type)=>{
        try {
            let item = {
                channelId: channelId,
                typer: Meteor.userId()
            }
            let itemInCollection = TypingList.findOne({channelId: channelId, typer: Meteor.userId()});
            if (itemInCollection && type === 'remove') {
                TypingList.remove(itemInCollection._id);
            }
            else if (!itemInCollection && type === 'add') {
                TypingList.insert(item);
            }
        }
        catch (e) {
            throw new Meteor.Error('500', e.message)
        }
    },

    'getAllChatItems' : (user) => {
        try {
            var currentUserId = user!= null ? user._id : Meteor.userId();
            var data = ChatItems.find({ to: currentUserId }).fetch();
            return data;
        } catch(error){
            throw new Meteor.Error('Please contact administrator');
        }
    }
})