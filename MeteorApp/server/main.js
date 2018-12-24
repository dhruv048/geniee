import {Meteor} from "meteor/meteor";
import {Accounts} from "meteor/accounts-base";
Meteor.startup(function () {
    Future = Npm.require('fibers/future');
    // chck if there is Super Admin, If not create one.
    if (Meteor.users.find().count() === 0) {
        if (!!Meteor.settings.private.defaultAccount) {
            Accounts.createUser({
                password: Meteor.settings.private.defaultAccount.password,
                username: Meteor.settings.private.defaultAccount.username,
                email: Meteor.settings.private.defaultAccount.email,
                createdAt: new Date(),
                createdBy:"SuperAdmin",
                profile: {
                    role: 2,
                    name: "Roshan",
                    contactNo: "9813798508",
                }
            });
        } else {
            console.log('No default user!  Please invoke meteor with a settings file.');
        }
    };

    if(Notifications.find().count()===0){
        Notifications.insert({
            title:"Updates",
            message:"A lot new features available now. Grab new App now",
            url:"http://.github.com",
            linkText:"App Store",
            isActive:false
        }
        )
    }
});
