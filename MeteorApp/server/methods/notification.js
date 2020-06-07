import { Meteor } from "meteor/meteor";
import { Notification } from "../../lib/collections/notification";
import { NotificationTypes } from "../../lib/utils";

removeNotification = (notification, logged) => {
    console.log(notification, logged);
    if (Meteor.userId() && notification.receiver.length == 1) {
        Notification.remove(notification._id);
    } else {
        let removedBy = notification.removedBy || [];
        removedBy.push(logged);
        Notification.update(
            { _id: notification._id },
            {
                $set: { removedBy: removedBy },
            }
        );
    }
};
Meteor.methods({
    addNotification: (notification) => {
        try {
            let loggedUser = Meteor.user();
            notification.createdAt = new Date(new Date().toUTCString());
            notification.seenBy = [];
            if (!notification.owner) notification.owner = loggedUser._id;
            Notification.insert(notification);
        } catch (e) {
            console.log(e.message);
        }
    },

    updateNotificationSeen: function (notificationId, deviceId) {
        try {
            let userId = Meteor.userId() ? Meteor.userId() : deviceId;
            Notification.update(
                { _id: { $in: notificationId } },
                {
                    $addToSet: { seenBy: userId },
                },
                { multi: true }
            );
        } catch (e) {
            Meteor.Error(500, e.message);
        }
    },

    removeNotification: function (notificationId, deviceId) {
        try {
            const logged = Meteor.userId() ? Meteor.userId() : deviceId;
            let notification = Notification.findOne({ _id: notificationId });
            if (Meteor.userId() && notification.receiver.length == 1) {
                Notification.remove(notification._id);
            } else {
                let removedBy = notification.removedBy || [];
                removedBy.push(logged);
                Notification.update(
                    { _id: notification._id },
                    {
                        $set: { removedBy: removedBy },
                    }
                );
            }
        } catch (e) {
            Meteor.Error(500, e.message);
        }
    },

    removeAllNotification: function (deviceId) {
        const logged = Meteor.userId() ? Meteor.userId() : deviceId;
        let _notifications = Notification.find({
            $and: [
                { owner: { $ne: logged } },
                {
                    $or: [
                        {
                            type: {
                                $in: [
                                    NotificationTypes.ADD_SERVICE,
                                    NotificationTypes.ADD_PRODUCT,
                                    21,
                                    22,
                                ],
                            },
                        },
                        { receiver: { $in: [logged] } },
                    ],
                },
                { removedBy: { $nin: [logged, deviceId] } },
            ],
        }).fetch();

        _notifications.forEach((_notification) => {
            if (Meteor.userId() && _notification.receiver.length == 1) {
                Notification.remove(_notification._id);
            } else {
                let removedBy = _notification.removedBy || [];
                removedBy.push(logged);
                Notification.update(
                    { _id: _notification._id },
                    {
                        $set: { removedBy: removedBy },
                    }
                );
            }
        });
    },
});