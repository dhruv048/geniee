import { GRcategories } from "../../../../../../lib/collections/genieeRepair/GRcategories";


Template.GRcategories.onRendered(function () {
    // $('#dataTable').DataTable();
});

Template.GRcategories.helpers({
    categories: () => {
        console.log(GRcategories.find().fetch())

        return GRcategories.find().fetch();
    }
})

Template.GRcategories.events({
    'click #addNewCategory': () => {
        return $("#categoryModal").modal('show');
    },

    'submit #add-category-form': function (e, t) {
        e.preventDefault();
        let label = $('#categoryTitle').val();
        let description = $('#categoryDescription').val();
        let type = $('#categoryType').val();
        if (label.length == 0) {
            sAlert.error('Please Enter Title');
        }
        else if (description.length == 0) {
            sAlert.error('Please Enter Description');
            label
        }
        else {
            let category = {
                title: label,
                description: description,
            }
            Meteor.call("addNewGRCategory", category, function (err) {
                if (err != null) {
                    sAlert.error(err.reason);
                }
                else {
                    $('#categoryModal').modal('hide');
                    t.find("form").reset();
                    sAlert.success("Category added successfully!!")
                }
            })
        }
    },

    'click .removeCategory': function (e, t) {
        e.preventDefault();
        new Confirmation({
            message: "Are you sure, you want to remove this category ?",
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
                Meteor.call('removeGRCategory', id, function (err) {
                    if (err) {
                        sAlert.error(err.message);
                    }
                    else
                        sAlert.success('Category removed successfully!!!');
                })
            }
        });

    }
})