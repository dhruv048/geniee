/**
 * Created by Roshan on 6/21/2017.
 */
import {News} from "../../../../../lib/collections/news";

Template.Newss.onRendered(function () {
    $("#grid").masonry({
        itemSelector: '.item',
        columnWidth: '.item'
    });
});

Template.Newss.helpers({
    newss: function () {
        return News.find();
    }

})

Template.Newss.events({
    'click .removeNews': function (e, t) {
        new Confirmation({
            message: "Are you sure, you want to remove this news ?",
            title: "Confirmation",
            cancelText: "Cancel",
            okText: "Ok",
            success: true, // whether the button should be green or red
            focus: "cancel" // which button to autofocus, "cancel" (default) or "ok", or "none"
        }, function (ok) {
            // ok is true if the user clicked on "ok", false otherwise
            let id = e.currentTarget.id;
            console.log('_id:' + e.currentTarget.id);
            Meteor.call('removeNews', id, function (err) {
                if (err != null) {
                    sAlert.error(err.message);
                }
                else
                    sAlert.success('News removed successfully!!!');
            })
        });

    },
});

