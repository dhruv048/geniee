import {ReactiveAggregate} from 'meteor/tunguska:reactive-aggregate';
import {Notification} from "../../lib/collections/notification";
import {NotificationTypes} from "../../lib/utils";

Meteor.publish('getNotification', () => {
    return Notification.find({receiver: Meteor.userId});
})

Meteor.publish('notificationWithLimit', function (skip) {
    let logged = this.userId;
    let _skip = skip ? skip : 0;
    ReactiveAggregate(this, Notification, [
        {
            $match: {
                $and: [
                    {
                        $or: [
                            {receiver: logged},
                            {type: {$in: [NotificationTypes.ADD_SERVICE]}}
                        ]
                    },
                    {removedBy: {$nin: [logged]}}
                ]
            }
        },
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
        {$sort: {"createdAt": -1}},
        {$limit: _skip + 20},
        {$skip: _skip},
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

Meteor.publish('newNotificationCount', function () {
    ReactiveAggregate(this, Notification, [
            {
                $match: {
                    $and: [
                        {
                            $or: [
                                {receiver: this.userId},
                                {type: {$in: [NotificationTypes.ADD_SERVICE]}}
                            ]
                        },
                        {seen: false},
                        {removedBy: {$nin: [this.userId]}}
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