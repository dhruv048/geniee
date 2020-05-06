import {Meteor} from 'meteor/meteor';
import {Notification} from '../../lib/collections/notification';
Meteor.methods({
    'addNotification': (notification) => {
        try {
            let loggedUser = Meteor.user();
            notification.createdAt = new Date(new Date().toUTCString());
            notification.seenBy = [];
            if (!notification.owner)
                notification.owner = loggedUser._id;
            Notification.insert(notification);

        }
        catch (e) {
            console.log(e.message)
        }
    },

    'updateNotificationSeen': function (notificationId) {
        try {
            Notification.update({_id: {$in: notificationId}},
                {
                    $addToSet: {seenBy: Meteor.userId()}
                },
                {multi: true});
        }
        catch (e) {
            Meteor.Error(500, e.message)
        }
    },

    'removeNotification': function (notificationId) {
        try {
            const logged = Meteor.userId();
            let notification = Notification.findOne({_id: notificationId});
            if (notification.receiver.length == 1) {
                Notification.remove(notificationId);
            }
            else {
                let removedBy=notification.removedBy ||[];
                removedBy.push(logged);
                Notification.update({_id: notificationId}, {
                    $set: {removedBy:removedBy}
                });
            }
        }
        catch (e) {
            Meteor.Error(500, e.message)
        }
    }
})