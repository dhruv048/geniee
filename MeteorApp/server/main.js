import {Meteor} from "meteor/meteor";
import {Accounts} from "meteor/accounts-base";
Meteor.startup(function () {

    // chck if there is Super Admin, If not create one.
    if (Meteor.users.find().count() === 0) {
        if (!!Meteor.settings.private.defaultAccount) {
            Accounts.createUser({
                password: Meteor.settings.private.defaultAccount.password,
                username: Meteor.settings.private.defaultAccount.username,
                email: Meteor.settings.private.defaultAccount.email,
                createdAt: new Date(),
                profile: {
                    role: 1,
                    name: "Roshan",
                    contact: "9813798508",
                }
            });
        } else {
            console.log('No default user!  Please invoke meteor with a settings file.');
        }
    };
});
