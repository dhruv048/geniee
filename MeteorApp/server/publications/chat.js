import {ChatChannels} from '../../lib/collections/chat';
import {ChatItems} from '../../lib/collections/chat';
import {ReactiveAggregate} from 'meteor/tunguska:reactive-aggregate';

Meteor.publish('chatChannels', () => {
    return ChatChannels.find({users: {$elemMatch: {userId: Meteor.userId()}}})
})

Meteor.publish('aggChatChannels', function () {
    ReactiveAggregate(this, ChatChannels, [
        {"$unwind": "$users"},
        {
            $lookup: {
                from: "users",
                localField: "users",
                foreignField: "_id",
                as: "Users"
            }
        },
        {
            "$lookup": {
                from: "chatItems",
                let: {channelId: "$_id"},
                pipeline: [
                    {$match: {$expr: {$eq: ["$channelId", "$$channelId"]}}},
                    {"$sort": {messageOn: -1}},
                    {"$limit": 1},
                    {"$project": {_id: 0, messageData: 1, messageOn: 1, seen: 1}}
                ],
                "as": "latest"
            }
        },
        {"$unwind": "$Users"},
        // Group back to arrays
        {
            $group: {
                _id: "$_id",
                users: {$push: "$users"},
                Users: {$push: "$Users"},
                lastMessage: {$first: "$lastMessage"},
                creator: {$first: "$creator"},
                createDate: {$first: "$createDate"},
                latest: {$first: "$latest"},
                service:{$first: "$service"}
            }
        },
        {
            "$addFields": {
                "latestMessage": {
                    $arrayElemAt: ["$latest", 0]
                }
            }
        },
        {"$sort": {"latestMessage.messageOn": -1}},

        {
            "$project": {
                "_id": 1,
                "users": 1,
                "creator": 1,
                "createDate": 1,
                "Users._id": 1,
                "Users.profile.name": 1,
                "Users.profile.profileImage": 1,
                latestMessage: 1,
                service:1
            }
        }], {
        noAutomaticObserver: true,
        debounceCount: 100,
        debounceDelay: 100,
        observers: [
            ChatChannels.find({users: Meteor.userId()})
        ]
    });
});


Meteor.publish('chatItems', (channelId) => {
    if (ChatChannels.find({$and: [{_id: channelId}, {users: Meteor.userId()}]}).count() > 0)
        return ChatItems.find({channelId: channelId})
});

Meteor.publish('chatItemsGroupByDate', function (channelId) {
    if (ChatChannels.find({$and: [{_id: channelId}, {users: Meteor.userId()}]}).count() > 0) {
        ReactiveAggregate(this, ChatItems, [
            {$match: {channelId: channelId}},
            {
                $project: {
                    nepalDateTime: {
                        $dateToString: {
                            format: "%Y-%m-%d-%H:%M:%S",
                            date: "$messageOn",
                            timezone: "Asia/Kathmandu"
                        }
                    },
                    _id: 1,
                    from: 1,
                    messageOn: 1,
                    messageData: 1,
                    seen: 1
                }
            },
            {
                $sort: {nepalDateTime: 1}
            },
            {
                $group: {
                    _id: {
                        $dateToString: {format: "%Y-%m-%d", date: "$messageOn", timezone: "Asia/Kathmandu"}
                    },
                    messages: {$push: "$$ROOT"},
                }
            },
            {$sort: {_id: -1}},
            {
                $project: {
                    // an id can be added here, but when omitted,
                    // it is created automatically on the fly for you
                    _id: 1,
                    messages: 1,
                }
            }
        ]);
    }
});

Meteor.publish('chatUsers', (channelId) => {
     let Channel = ChatChannels.findOne({_id:channelId});
     return Meteor.users.find({_id:{$in:Channel.users}});
});