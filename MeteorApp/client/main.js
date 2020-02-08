import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import "./css/main.css";
import "../imports/client/js/jquery.min";
import "./bootstrap/js/bootstrap.bundle.min";
import "../imports/client/js/jquery.easing.min";
import "../imports/client/js/sb-admin-2.min";
import "../imports/client/ui/Layout/clientMainLayout.html";
import "../imports/client/ui/Layout/eatFit/eFLayout.html";
import "../imports/client/ui/Layout/eatFit/eFLayout";
import "./lib/spacebarHelpers";
import "./lib/summernote";
import "../imports/client/ui/pages/VerifyEmail/emailVerifySuccess.html";
import "../imports/routes";
import "../imports/client/ui/Layout/loginLayout.html";
import "../imports/client/ui/Layout/loginLayout";
import "../imports/client/ui/Layout/adminMainLayout.html";
import "../imports/client/ui/Layout/genieeRepair/gRLayout.html";
import "../imports/client/ui/Layout/genieeRepair/gRLayout";
import "../imports/client/ui/Layout/adminMainLayout";
import "../imports/client/ui/pages/adminDashBoard/adminDashboard.html";
import "../imports/client/ui/pages/adminDashBoard/adminDashboard";
import "../imports/client/ui/pages/users/users.html";
import "../imports/client/ui/pages/users/users";


//Gr Categories
import "../imports/client/ui/pages/genieeRepair/category/category.html";
import "../imports/client/ui/pages/genieeRepair/category/category";
//Gr Users
import "../imports/client/ui/pages/genieeRepair/GRusers/create-GRusers.html";
import "../imports/client/ui/pages/genieeRepair/GRusers/create-GRusers";

//Eat Fit

import "../imports/client/ui/pages/eatFit/category/category.html";
import "../imports/client/ui/pages/eatFit/category/category";
import "../imports/client/ui/pages/eatFit/foodItem/create-product.html";
import "../imports/client/ui/pages/eatFit/foodItem/create-product";
import "../imports/client/ui/pages/eatFit/foodItem/products.html";
import "../imports/client/ui/pages/eatFit/foodItem/products";
import "../imports/client/ui/pages/eatFit/foodItem/product.html";
import "../imports/client/ui/pages/eatFit/foodItem/product";
import "../imports/client/ui/pages/eatFit/order/orders.html";
import "../imports/client/ui/pages/eatFit/order/orders";


//
// Template.hello.onCreated(function helloOnCreated() {
//   // counter starts at 0
//   this.counter = new ReactiveVar(0);
// });
//
// Template.hello.helpers({
//   counter() {
//     return Template.instance().counter.get();
//   },
// });
//
// Template.hello.events({
//   'click button'(event, instance) {
//     // increment the counter when button is clicked
//     instance.counter.set(instance.counter.get() + 1);
//   },
// });

// FlowRouter.wait();
// Meteor.startup(function () {
//     FlowRouter.initialize({hashbang: true});
// });
Meteor.subscribe('loggedUser');
FlowRouter.wait();
Tracker.autorun(() => {
    let handle=Meteor.subscribe('loggedUser');
    console.log('autorun',Meteor.user(),handle.ready());
    // wait on roles to intialise so we can check is use is in proper role
    if ((handle.ready()|| Meteor.user()) && !FlowRouter._initialized) {
        if(Meteor.user())
        Session.set('loggedUserRole',Meteor.user().profile.role)
        else{
            Session.set('loggedUserRole',null)
        }
        FlowRouter.initialize()
    }else{
        Meteor.subscribe('loggedUser');
    }
});