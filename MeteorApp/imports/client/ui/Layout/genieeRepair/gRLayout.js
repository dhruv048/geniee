
import {Meteor} from "meteor/meteor"
Template.verifyEmail.onCreated(function () {
    console.log("token", FlowRouter.getParam('token'));
    // Accounts.verifyEmail(FlowRouter.getParam('token'), function () {
    //     Router.go('/verified');
    // });
});

Template.topBarGR.helpers({
    loggedUser: () => {
        return Meteor.user();
    }
});

Template.sideBarGR.events({
    'click #sidebarToggle ': function (event, t) {
        event.preventDefault();
        $("body").toggleClass("sidebar-toggled");
        $(".sidebar").toggleClass("toggled");
        if ($(".sidebar").hasClass("toggled")) {
            $('.sidebar .collapse').collapse('hide');
        }
        ;
    }
})

Template.adminMainLayoutGR.events({
    'click  #sidebarToggleTop': function (event, t) {
        event.preventDefault();
        $("body").toggleClass("sidebar-toggled");
        $(".sidebar").toggleClass("toggled");
        if ($(".sidebar").hasClass("toggled")) {
            $('.sidebar .collapse').collapse('hide');
        }
        ;
    }
});

Template.topBarGR.events({
    'click #logOutButton': (e, t) => {
        e.preventDefault();
        return Meteor.logout(function (err) {
            if (err) {
                // !TODO: I should add a section for dismissable and timeout notifications... or maybe Growl-style notifications
                return console.log(err);
            }
            else {
                $('#logoutModal').modal('hide');
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();
                FlowRouter.go('/admin/login');
            }
        });
    }
});
