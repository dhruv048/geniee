/**
 * Created by Roshan on 6/21/2017.
 */
// import {Products} from "../../../../../lib/collections/eCommerce";
import { GRusers } from "../../../../../../lib/collections/genieeRepair/GRusers";

Template.GRusers_List.onRendered(function () {
    $("#grid").masonry({
        itemSelector: '.item',
        columnWidth: '.item'
    });
});

Template.GRusers_List.helpers({
    grusers: function () {
        console.log(GRusers.find().fetch())
        return GRusers.find();
    }

})

Template.GRusers_List.events({
    'click .removeGRuser': function (e, t) {
        e.preventDefault();
        new Confirmation({
            message: "Are you sure, you want to remove this user ?",
            title: "Confirmation",
            cancelText: "Cancel",
            okText: "Ok",
            success: true, // whether the button should be green or red
            focus: "cancel" // which button to autofocus, "cancel" (default) or "ok", or "none"
        }, function (ok) {
            // // ok is true if the user clicked on "ok", false otherwise
            if (ok) {
                let id = e.currentTarget.id;
                console.log('_id:' + e.currentTarget.id);
                Meteor.call('removeGRuser', id, function (err) {
                    if (err) {
                        sAlert.error(err.message);
                    }
                    else
                        sAlert.success('User deleted successfully!!!');
                })
            }
        });

    },
});
