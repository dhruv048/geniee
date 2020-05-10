import {ReactiveAggregate} from 'meteor/tunguska:reactive-aggregate';
import {Notification} from "../../lib/collections/notification";
import {NotificationTypes} from "../../lib/utils";

Meteor.publish('getNotification', () => {
    return Notification.find({receiver: Meteor.userId});
})

Meteor.publish('notificationWithLimit', function (skip,deviceId) {
    let logged = this.userId;
    let _skip = skip ? skip : 0;
    ReactiveAggregate(this, Notification, [
        {
            $match: {
                $and: [
                    {
                        $or: [
                            {type: {$in: [NotificationTypes.ADD_SERVICE,NotificationTypes.ADD_PRODUCT,21,22]}},
                            {receiver: logged}
                        ]
                    },
                    {removedBy: {$nin: [logged,deviceId]}}
                ]
            }
        },
        {$sort: {"createdAt": -1}},
        {$limit: _skip + 20},
        {$skip: _skip},
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "Users"
            }
        },
        {
            "$addFields": {
                "Owner": {$arrayElemAt: ["$Users", 0]}
            }
        },

        {
            $project: {
                _id: 1,
                "Owner.profile.name": 1,
                "Owner.profile.profileImage": 1,
                "Owner.profile.role": 1,
                title: 1,
                description: 1,
                navigateId: 1,
                type: 1,
                screen: 1,
                appointmentId: 1,
                seenBy: 1,
                createdAt: 1,
            }
        }], {clientCollection: 'notificationDetail', allowDiskUse: true});
});

Meteor.publish('newNotificationCount', function (deviceId) {
    ReactiveAggregate(this, Notification, [
            {
                $match: {
                    $and: [
                        {
                            $or: [
                                {type: {$in: [NotificationTypes.ADD_SERVICE,NotificationTypes.ADD_PRODUCT,21,22]}},
                                {receiver: this.userId}

                            ]
                        },
                        {seenBy: {$nin: [this.userId,deviceId]}},
                        {removedBy: {$nin: [this.userId,deviceId]}}
                    ]
                }
            },
            {
                $group: {
                    _id: '123456', totalCount:
                        {
                            $sum: 1
                        }
                }
            }
            ,
            {
                $project: {
                    _id: 1,
                    totalCount: 1
                }
            }
        ],
        {
            clientCollection: 'newNotificationCount', allowDiskUse:
                true,
            observers:
                [
                    //Notification.find({to: this.userId}, {sort: {messageOn: -1}, limit: 10}),
                ]
        }
    )
});