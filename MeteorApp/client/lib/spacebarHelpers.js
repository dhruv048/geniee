/**
 * Created by Roshan on 6/21/2017.
 */

import { userType, PaymentType, OrderStatus, Urls } from "../../lib/utils";

Template.registerHelper("isChecked", function (value) {
    try {
        if (value) return true;
        else return "";
    } catch (ex) {}
});

Template.registerHelper("getImage", function (image) {
    try {
        if (image) {
            console.log(image)
            if (image.includes("https://")) 
                return image;
            else 
                return Urls.IMAGE_URL + image;
        } else {
            return "/img/duser.png";
        }
    } catch (ex) {
        console.log(ex.message)
    }
});

Template.registerHelper("getProductImage", function (images) {
    try {
        if (images) {
            return Urls.IMAGE_URL + images[0];
        }
        return "/img/duser.png";
    } catch (ex) {}
});
Template.registerHelper("profileImage", function (Id) {
    try {
        return Images.findOne({ _id: Id }).link();
    } catch (ex) {}
});
Template.registerHelper("getPaymentInfo", function (value) {
    try {
        if (value == 0) return "Cash on Delivery";
        else return "Payed through E-Sewa";
    } catch (ex) {}
});
Template.registerHelper("isEsewaPayment", function (value) {
    try {
        if (value == PaymentType.ESEWA) return true;
    } catch (ex) {}
});

Template.registerHelper("userImageByID", function (Id) {
    try {
        var imageId = Accounts.users.findOne({ _id: Id }).profile.profileimage;
        if (imageId) {
            return Images.findOne({ _id: imageId }).link();
        } else {
            return "/img/duser.png";
        }
    } catch (ex) {
        return "/img/duser.png";
    }
});
Template.registerHelper("getAuthorName", function (Id) {
    try {
        return Accounts.users.findOne({ _id: Id }).profile.name;
    } catch (ex) {
        return "Krishi Sansaar";
    }
});

Template.registerHelper("text", function (passedString, number) {
    var fooText = passedString.substring(0, number); //same as truncate.
    if (passedString.length > number) fooText = fooText + "...";
    return new Spacebars.SafeString(fooText);
});

Template.registerHelper("fromNow", function (date) {
    return moment(date).fromNow();
});
Template.registerHelper("articleDate", function (context, options) {
    if (context) return moment(context).format("ddd, MMM DD, YYYY");
});

Template.registerHelper("newsDate", function (context, options) {
    if (context) return moment(context).format("DD, MMMM ");
});
Template.registerHelper("hasSubCategoris", function (array) {
    if (array != null && array.length > 0) return true;
    else return false;
});

Template.registerHelper("selected", function (val1, val2) {
    return val1 == val2 ? "selected" : "";
});

Template.registerHelper("getRouteByGroup", (route, id) => {
    let groupName = FlowRouter.current().route.group.name;
    console.log(groupName);
    if (groupName === "admin") return "/admin/" + route + "/" + id;
    else return "/" + route + "/" + id;
});

Template.registerHelper("authenticateUser", (user) => {
    if (Meteor.userId() === user || Meteor.user().profile.role === "superAdmin")
        return true;
    else return false;
});

Template.registerHelper("getRole", (value) => {
    switch (value) {
        case userType.VISITOR:
            return "Visitor";
            break;
        case userType.DOCTOR:
            return "Doctor";
            break;
        case userType.HOSPITAL:
            return "Hospital";
            break;
        case userType.CLINIC:
            return "Clinic";
            break;
        case userType.LAB:
            return "Lab";
            break;
    }
});

Template.registerHelper("notVisitor", (value) => {
    return value != 0;
});

Template.registerHelper("isNewOrder", (value) => {
    if (value === OrderStatus.ORDER_REQUESTED) return true;
});

Template.registerHelper("isOrderDispatched", (value) => {
    if (value === OrderStatus.ORDER_DISPATCHED) return true;
});
Template.registerHelper("isOrderDelivered", (value) => {
    if (value === OrderStatus.ORDER_DELIVERED) return true;
});