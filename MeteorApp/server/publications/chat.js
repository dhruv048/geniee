import {ChatChannels, TypingList, ChatItems} from '../../lib/collections/chat';
import {ReactiveAggregate} from 'meteor/tunguska:reactive-aggregate';

Meteor.publish('chatChannels', () => {
    return ChatChannels.find({users: {$elemMatch: {userId: Meteor.userId()}}})
})

Meteor.publish('aggChatChannels', function () {
    let userId= Meteor.userId();
    ReactiveAggregate(this, ChatChannels, [
        {$match:{users: userId}},
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
                    // {"$limit": 1},
                    {"$project": {_id: 0, messageData: 1, messageOn: 1, seen: 1,from:1,to:1}}
                ],
                "as": "allMessage"
            }
        },
        {"$unwind": "$Users"},
        // Group back to arrays
        {
            $group: {
                _id: "$_id",
                users: {$push: "$users"},
                Users: {$push: "$Users"},
                business: {$first: "$business"},
                creator: {$first: "$creator"},
                createDate: {$first: "$createDate"},
                latest: {$first: "$allMessage"},
                allMessage: {$first: "$allMessage"},
            }
        },
        {
            $addFields: {
                latestMessage: {
                    $arrayElemAt: ["$allMessage", 0]
                },
                unreadMessages:{  "$filter" : {
                        "input" : "$allMessage",
                        "as" : "allMessage",
                        "cond" : {
                            "$and" : [
                                { $in :[userId,"$$allMessage.to"]},
                                { $eq : [ "$$allMessage.seen",false ] }
                            ]
                        }
                    }
                },

            }
        },
        {"$sort": {"latestMessage.messageOn": -1}},

        {
            "$project": {
                "_id": 1,
                "users": 1,
                "business":1,
                "creator": 1,
                "createDate": 1,
                "Users._id": 1,
                "Users.profile.name": 1,
                "Users.profile.profileImage": 1,
                latestMessage: 1,
                unreadMessagesCount:{$size: "$unreadMessages"},
                unreadMessages:1

            }
        }], {
        // debounceCount: 100,
        // debounceDelay: 100,
        observers: [
            ChatChannels.find({users: Meteor.userId()}),
            ChatItems.find({$or:[{from: Meteor.userId()},{to:Meteor.userId()}]})
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
                $sort: {messageOn: 1}
            },
            {
                $group: {
                    _id: {
                        $dateToString: {format: "%Y-%m-%d", date: "$messageOn", timezone: "Asia/Kathmandu"}
                    },
                    messages: {$push: "$$ROOT"},
                    nepaliDate:{$first:"$messageOn"}
                }
            },
            // {
            //     $addFields: {
            //         nepaliDate: {
            //             $dateFromString: {
            //                 dateString: {
            //                     $dateToString: {
            //                         format: "%Y-%m-%d",
            //                         date: "$messageOn",
            //                         timezone: "Asia/Kathmandu"
            //                     }
            //                 }
            //             }
            //         },
            //     }
            // },
            {$sort: {nepaliDate: -1}},
            {
                $project: {
                    // an id can be added here, but when omitted,
                    // it is created automatically on the fly for you
                    _id: 1,
                    messages: 1,
                    nepaliDate:1,
                }
            }
        ], {clientCollection: 'chatMessages'});
    }
});

Meteor.publish('chatUsers', (channelId) => {
     let Channel = ChatChannels.findOne({_id:channelId});
     return Meteor.users.find({_id:{$in:Channel.users}});
});

Meteor.publish('typerList', (channelId)=>{
    let Channel = ChatChannels.findOne({_id:channelId});
    let users= Channel.users
    users=users.filter(item=>{return (item!= Meteor.userId())});
    return TypingList.find({channelId:channelId, typer:{$in:users}})
});
Meteor.publish('unreadMessageCount',function () {
    return ChatItems.find({$and:[{to: Meteor.userId()},{seen:false}]}, {fields:{_id:1, from:1,to:1,seen:1}})
});