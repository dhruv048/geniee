import {ReactiveAggregate} from 'meteor/tunguska:reactive-aggregate';


// import details from './details';
//
// export default function (){
//   details();
// }

import {NotificationTypes} from "../../lib/utils";
import {Notification} from "../../lib/collections/notification";

Meteor.publish('allUsersforWeb',function () {
  return  Meteor.users.find({'profile.role':{$ne:2}})
});


// Meteor.publish('usersCount', function (deviceId) {
//     let logged = this.userId?this.userId:"NA";
//     ReactiveAggregate(this, Meteor.users, [
//             {
//                 $match: {'profile.role':0}
//             },
//             {
//                 $group: {
//                     _id: '123456', totalCount:
//                         {
//                             $sum: 1
//                         }
//                 }
//             }
//             ,
//             {
//                 $project: {
//                     _id: 1,
//                     totalCount: 1
//                 }
//             }
//         ],
//         {
//             allowDiskUse: true,
//             observers:
//                 [
//                     //Notification.find({to: this.userId}, {sort: {messageOn: -1}, limit: 10}),
//                 ]
//         }
//     )
// });

Meteor.publish('all_users', function () {
    // return Meteor.users.find({'profile.role': {$nin: [101]}})
    Counts.publish(this, "usersCount", Meteor.users.find({'profile.role': {$in:[0]}}));
});