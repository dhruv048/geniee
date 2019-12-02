import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import "./css/main.css";
import "../imports/client/js/jquery.min";
import "./bootstrap/js/bootstrap.bundle.min";
import "../imports/client/js/jquery.easing.min";
import "../imports/client/js/sb-admin-2.min";
import "../imports/client/ui/Layout/clientMainLayout.html";
import "./lib/spacebarHelpers";
import "./lib/summernote";
import "../imports/client/ui/pages/VerifyEmail/emailVerifySuccess.html";
import "../imports/routes";
import "../imports/client/ui/Layout/loginLayout.html";
import "../imports/client/ui/Layout/loginLayout";
import "../imports/client/ui/Layout/adminMainLayout.html";
import "../imports/client/ui/Layout/adminMainLayout";
import "../imports/client/ui/pages/adminDashBoard/adminDashboard.html";
import "../imports/client/ui/pages/adminDashBoard/adminDashboard";
// import "../imports/client/ui/pages/specilizations/specilizations.html";
// import "../imports/client/ui/pages/specilizations/specilizations";
import "../imports/client/ui/pages/users/users.html";
import "../imports/client/ui/pages/users/users";
// import "../imports/client/ui/pages/article/articles.html";
// import "../imports/client/ui/pages/article/articles";
// import "../imports/client/ui/pages/article/article.html";
// import "../imports/client/ui/pages/article/article";
// import "../imports/client/ui/pages/article/create-article.html";
// import "../imports/client/ui/pages/article/create-article";
// import "../imports/client/ui/pages/news/create-news.html";
// import "../imports/client/ui/pages/news/create-news";
// import "../imports/client/ui/pages/news/news.html";
// import "../imports/client/ui/pages/news/news";
// import "../imports/client/ui/pages/news/news-all.html";
// import "../imports/client/ui/pages/news/news-all";
import "../imports/client/ui/pages/eCommerce/category.html";
import "../imports/client/ui/pages/eCommerce/category";
import "../imports/client/ui/pages/eCommerce/create-product.html";
import "../imports/client/ui/pages/eCommerce/create-product";
import "../imports/client/ui/pages/eCommerce/product.html";
import "../imports/client/ui/pages/eCommerce/product";
import "../imports/client/ui/pages/eCommerce/products.html";
import "../imports/client/ui/pages/eCommerce/products";
import "../imports/client/ui/pages/gallery/gallery.html";
import "../imports/client/ui/pages/gallery/gallery";


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

FlowRouter.wait();
Meteor.startup(function () {
    FlowRouter.initialize({hashbang: true});
});
