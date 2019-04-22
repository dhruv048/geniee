import {Meteor} from 'meteor/meteor';

Meteor.methods({
    'createNotification': (notification) => {
        console.log('addNewNotification:::=>>>');
        var currentUserId = Meteor.userId();
        notification.createdAt=new Date();
        notification.createdBy=currentUserId;

        try {
        return    Notifications.insert(notification);
        }
        catch (e) {
            console.log(e.message);
            throw new Meteor.Error(403,e.message)

        }
    },

    'updateNotification': function (notification) {
        var not= Notifications.findOne({_id:notification._id});
        if (not.createdBy===Meteor.userId() || Meteor.user().profile.role === 2) {
            try {

                Category.update({_id: notification._id}, {
                    $set: {
                        title: notification.title,
                        message: notification.message,
                        url: notification.url,
                        isActive: notification.isActive,
                        linkText:notification.linkText
                    }
                });
            }
            catch (err) {
                console.log(err.message);
                throw new Meteor.Error(403,e.message)
            }

        }
        else {
            console.log("Permission Denied")
            throw new Meteor.Error(401, "Permission Denied");
        }
    },

    'removeNotification': function (id) {
        var notification= Notifications.findOne({_id:id});
        if  (Meteor.userId()===notification.createdBy || Meteor.user().profile.role === 2)  {
            try {
                Notifications.remove({_id:id});
            }
            catch (err) {
                console.log(err.message);
                throw new Meteor.Error(403,err.message);
            }
        }
        else {
            throw new Meteor.Error(401,"Permission Denied");
        }
    },

})