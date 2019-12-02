// import {Common} from "../../../../../lib/collections/common";
//
//
// Template.specilizations.onRendered(function () {
//     // $('#dataTable').DataTable();
// });
//
// Template.specilizations.helpers({
//     specilizations: () => {
//         console.log(Common.find({title: 'Specialization'}).fetch())
//         return Common.find({title: 'Specialization'}).fetch();
//     }
// })
//
// Template.specilizations.events({
//     'click #addNewSecilization': () => {
//         return $("#speclModal").modal('show');
//     },
//     'submit #add-specl-form': function (e, t) {
//         e.preventDefault();
//         let label = $('#spclTitle').val();
//         let description = $('#spclDescription').val();
//         let type = $('#spclType').val();
//         if (label.length == 0) {
//             sAlert.error('Please Enter Title');
//         }
//         else if (description.length == 0) {
//             sAlert.error('Please Enter Description');
//             label
//         }
//         else {
//             let spectilization = {
//                 label: label,
//                 description: description,
//                 type: parseInt(type)
//             }
//             Meteor.call("addNewSpecilization", spectilization, function (err) {
//                 if (err != null) {
//                     sAlert.error(err.reason);
//                 }
//                 else {
//                     $('#speclModal').modal('hide');
//                     t.find("form").reset();
//                     sAlert.success("Spectilization added successfully!!")
//                 }
//             })
//         }
//     },
//
//     'click .removeSpecl': function (e, t) {
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
//         Meteor.call('removeSpecl', id, function (err) {
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
