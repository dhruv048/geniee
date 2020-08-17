// // import {Category} from "../../../../../lib/collections/eCommerce";
//
//
// Template.categories.onRendered(function () {
//     // $('#dataTable').DataTable();
// });
//
// Template.categories.helpers({
//     categories: () => {
//         console.log(Category.find().fetch())
//         return Category.find().fetch();
//     }
// })
//
// Template.categories.events({
//     'click #addNewCategory': () => {
//         return $("#categoryModal").modal('show');
//     },
//     'submit #add-category-form': function (e, t) {
//         e.preventDefault();
//         let label = $('#categoryTitle').val();
//         let description = $('#categoryDescription').val();
//         let type = $('#categoryType').val();
//         if (label.length == 0) {
//             sAlert.error('Please Enter Title');
//         }
//         else if (description.length == 0) {
//             sAlert.error('Please Enter Description');
//         }
//         else {
//             let category = {
//                 title: label,
//                 description: description,
//                 type: parseInt(type)
//             }
//             Meteor.call("addNewCategory", category, function (err) {
//                 if (err != null) {
//                     sAlert.error(err.reason);
//                 }
//                 else {
//                     $('#categoryModal').modal('hide');
//                     t.find("form").reset();
//                     sAlert.success("Category added successfully!!")
//                 }
//             })
//         }
//     },
//
//     'click .removeCategory': function (e, t) {
//         e.preventDefault();
//         // new Confirmation({
//         //     message: "Are you sure, you want to remove this news ?",
//         //     title: "Confirmation",
//         //     cancelText: "Cancel",
//         //     okText: "Ok",
//         //     success: true, // whether the button should be green or red
//         //     focus: "cancel" // which button to autofocus, "cancel" (default) or "ok", or "none"
//         // }, function (ok) {
//         //     // ok is true if the user clicked on "ok", false otherwise
//         let id = e.currentTarget.id;
//         console.log('_id:' + e.currentTarget.id);
//         Meteor.call('removeCategory', id, function (err) {
//             if (err != null) {
//                 sAlert.error(err.message);
//             }
//             else
//                 sAlert.success('News removed successfully!!!');
//         })
//         // });
//
//     }
// })
