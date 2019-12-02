// import details from './details';
//
// export default function (){
//   details();
// }

Meteor.publish('allUsersforWeb',function () {
  return  Meteor.users.find({'profile.role':{$ne:2}})
})