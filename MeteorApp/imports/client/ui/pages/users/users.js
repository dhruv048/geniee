
import {Session} from 'meteor/session';
import {Tracker} from 'meteor/tracker';
//Session.set('users',Meteor.users.find({'profile.role': {$nin: [101]}}, {sort: {createdAt: -1}}));
let allUsers = [];
let role = 'all';
Tracker.autorun(() => {
    allUsers = Meteor.users.find({'profile.role': {$nin: [101]}}, {sort: {createdAt: -1}}).fetch()
    if (role == 'all' || !role)
        Session.set('users', Meteor.users.find({'profile.role': {$nin: [101]}}, {sort: {createdAt: -1}}).fetch());
    else
        Session.set('users', Meteor.users.find({'profile.role': role}, {sort: {createdAt: -1}}).fetch());
});
Template.Users.onCreated(function () {
    // $('#dataTable').DataTable();
    allUsers = Meteor.users.find({'profile.role': {$nin: [101]}}, {sort: {createdAt: -1}}).fetch();
    Session.set("users", Meteor.users.find({'profile.role': {$nin: [101]}}, {sort: {createdAt: -1}}).fetch());
});

Template.Users.helpers({
    users: () => {
        console.log(Meteor.users.find({'profile.role': {$nin: [101]}}).fetch())
        return Session.get("users");
    }
})

Template.Users.events({
    'click .approveUser': (e) => {
        console.log(e.currentTarget.id)
        e.preventDefault();
        Meteor.call('approveDeclineUser', true, e.currentTarget.id, function (err, result) {
            if (err) {
                console.log(err.reason);
            }
        });
    },
    'click .cancelApprove': (e) => {
        console.log(e.currentTarget.id)
        e.preventDefault();
        Meteor.call('approveDeclineUser', false, e.currentTarget.id, function (err, result) {
            if (err) {
                console.log(err.reason);
            }
        });
    },

    "change #userRole": function (evt) {
        let newValue = $(evt.target).val();
        role = newValue;
        let newUsers = allUsers;
        if (newValue == 'all')
            Session.set('users', Meteor.users.find({'profile.role': {$nin: [101]}}, {sort: {createdAt: -1}}).fetch());
        else {
            newUsers = newUsers.filter(user => user.profile.role == newValue);
            Session.set("users", newUsers);
        }
    },

    "input  #userSearch": function (evt) {
        let textData = $(evt.target).val();
        if (textData === "") {
            Session.set("users", allUsers);
            return;
        }
        let SearchText=textData.toUpperCase();
        let newData = allUsers;
        // if (role != 'all')
        //     newData.filter(user => user.profile.role == role);
        newData = newData.filter(item => {
            if (!item.profile.hasOwnProperty('email'))
                item.profile.email = "";
            if (!item.profile.hasOwnProperty('contact'))
                item.profile.contact = "";
            // console.log(item)
            return (item.profile.name.toUpperCase().includes(SearchText) || item.profile.contact.toUpperCase().includes(SearchText) || item.profile.email.toUpperCase().includes(SearchText));
        });
        Session.set("users", newData);
    }
})
