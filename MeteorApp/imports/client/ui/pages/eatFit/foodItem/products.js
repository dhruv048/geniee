/**
 * Created by Roshan on 6/21/2017.
 */
 import {EFProducts} from "../../../../../../lib/collections/eatFit/efProducts";

Template.ProductsEF.onRendered(function () {
    $("#grid").masonry({
        itemSelector: '.item',
        columnWidth: '.item'
    });
});

Template.ProductsEF.helpers({
    products: function () {
        console.log(EFProducts.find().fetch())
        return EFProducts.find();
    }

})

Template.ProductsEF.events({
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
            Meteor.call('removeProductEF', id, function (err) {
                if (err != null) {
                    sAlert.error(err.message);
                }
                else
                    sAlert.success('Product removed successfully!!!');
            })
        });

    },
});

