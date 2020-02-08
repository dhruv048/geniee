
import {Session} from 'meteor/session';
import {OrderStatus} from "../../../../../../lib/utils";


let allOrders = [];
let role = 'all';

Template.OrdersEF.onCreated(function () {
    Session.set('allOrders',[]);
    Meteor.call('getProductOrderForAdmin',(err,res)=>{
        console.log(res.result);
        Session.set('allOrders',res.result);
        allOrders=res.result;
    })
});

Template.OrdersEF.onRendered(function () {
    Meteor.call('getEFProductOrderForAdmin',(err,res)=>{
        console.log(res.result)
        Session.set('allOrders',res.result);
        allOrders=res.result;
    })
})

Template.OrdersEF.helpers({
    allOrders: () => {
        return Session.get("allOrders");
    }
});

Template.OrdersEF.events({
    'click .cancelOrder': (e) => {
        let Id = e.currentTarget.id
        e.preventDefault();
        updateOrderStatus(Id, OrderStatus.ORDER_CANCELLED);
    },
    'click .dispatchOrder': (e) => {
        let Id = e.currentTarget.id
        e.preventDefault();
        updateOrderStatus(Id, OrderStatus.ORDER_DISPATCHED);
    },
    'click .deliverOrder': (e) => {
        let Id = e.currentTarget.id
        e.preventDefault();
        updateOrderStatus(Id, OrderStatus.ORDER_DELIVERED);
    },
//     'click .cancelApprove': (e) => {
//         console.log(e.currentTarget.id)
//         e.preventDefault();
//         Meteor.call('approveDeclineUser', false, e.currentTarget.id, function (err, result) {
//             if (err) {
//                 console.log(err.reason);
//             }
//         });
//     },
//
//     "change #userRole": function (evt) {
//         let newValue = $(evt.target).val();
//         role = newValue;
//         let newOrders = allOrders;
//         if (newValue == 'all')
//             Session.set('allOrders', Meteor.allOrders.find({'profile.role': {$nin: [101]}}, {sort: {createdAt: -1}}).fetch());
//         else {
//             newOrders = newOrders.filter(user => user.profile.role == newValue);
//             Session.set("allOrders", newOrders);
//         }
//     },
//
//     "input  #userSearch": function (evt) {
//         let textData = $(evt.target).val();
//         if (textData === "") {
//             Session.set("allOrders", allOrders);
//             return;
//         }
//
//         let newData = allOrders;
//         if (role != 'all')
//             newData.filter(user => user.profile.role == role);
//         newData = newData.filter(item => {
//             if (!item.profile.hasOwnProperty('nmc'))
//                 item.profile.nmc = "";
//             if (!item.profile.hasOwnProperty('email'))
//                 item.profile.email = "";
//             // console.log(item)
//             return (item.profile.name.includes(textData) || item.profile.contact.includes(textData) || item.profile.email.includes(textData) || item.profile.nmc.includes(textData));
//         });
//         Session.set("allOrders", newData);
//     }
});

updateOrderStatus = (Id, status) => {
    Meteor.call('updateOrderStatusEF', Id, status, function (err, result) {
        if (err) {
            console.log(err.reason);
        }
        else {
            Meteor.call('getEFProductOrderForAdmin', (err, res) => {
                console.log(res.result);
                Session.set('allOrders', res.result);
                allOrders = res.result;
            })
        }
    });
}
