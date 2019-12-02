/**
 * Created by Roshan on 6/21/2017.
 */
import {Article} from "../../../../../lib/collections/article";

Template.Articles.onRendered(function () {
    $("#grid").masonry({
        itemSelector: '.item',
        columnWidth: '.item'
    });
});

Template.Articles.helpers({
    articles: function () {
        return Article.find();
    }

})

Template.Articles.events({
    'click .removeArticle': function (e, t) {
        new Confirmation({
            message: "Are you sure, you want to remove this article ?",
            title: "Confirmation",
            cancelText: "Cancel",
            okText: "Ok",
            success: true, // whether the button should be green or red
            focus: "cancel" // which button to autofocus, "cancel" (default) or "ok", or "none"
        }, function (ok) {
            // ok is true if the user clicked on "ok", false otherwise
            let id = e.currentTarget.id;
            console.log('_id:' + e.currentTarget.id);
            Meteor.call('removeArticle', id, function (err) {
                if (err != null) {
                    sAlert.error(err.message);
                }
                else
                    sAlert.success('Article removed successfully!!!');
            })
        });

    },
});

