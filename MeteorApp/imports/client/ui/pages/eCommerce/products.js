/**
 * Created by Roshan on 6/21/2017.
 */
// import {Products} from "../../../../../lib/collections/eCommerce";

Template.Products.onRendered(function () {
    $("#grid").masonry({
        itemSelector: '.item',
        columnWidth: '.item'
    });
});

Template.Products.helpers({
    products: function () {
        console.log(Products.find().fetch())
        return Products.find();
    }

})

Template.Products.events({
    'click .removeProduct': function (e, t) {
        new Confirmation({
            message: "Are you sure, you want to remove this product ?",
            title: "Confirmation",
            cancelText: "Cancel",
            okText: "Ok",
            success: true, // whether the button should be green or red
            focus: "cancel" // which button to autofocus, "cancel" (default) or "ok", or "none"
        }, function (ok) {
            // ok is true if the user clicked on "ok", false otherwise
            let id = e.currentTarget.id;
            console.log('_id:' + e.currentTarget.id);
            Meteor.call('removeProduct', id, function (err) {
                if (err != null) {
                    sAlert.error(err.message);
                }
                else
                    sAlert.success('Product removed successfully!!!');
            })
        });

    },
});

