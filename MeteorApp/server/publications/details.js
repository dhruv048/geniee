import { Meteor } from 'meteor/meteor';
// import { Details } from '/lib/collections';


// export default () => {
//   Meteor.publish('details-list', () => {
//     return Details.find();
//   });
// }

    Meteor.publish('categories-list', () => {
        try {
            // console.log("list:"+Meteor.user().profile.createdBy)
            // if (Meteor.user().profile.role === 1) {
            //     return Category.find({createdBy: Meteor.userId()});
            // }
            // else {
                return Category.find();
            // }
        }
        catch (e) {
            console.log(e.message)
        }
    });



