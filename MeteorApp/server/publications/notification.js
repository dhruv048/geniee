import { Meteor } from 'meteor/meteor';

Meteor.publish('notifications-list',()=>{
    return Notifications.find({isActive:true})
    });