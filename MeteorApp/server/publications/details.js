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
            if (Meteor.user().profile.role === 0) {
                return Category.find({createdBy: Meteor.user().profile.createdBy});
            }
            else if (Meteor.user().profile.role === 1) {
                return Category.find({createdBy: Meteor.userId()});
            }
            else if (Meteor.user().profile.role === 2) {
                return Category.find();
            }
        }
        catch (e) {
            console.log(e.message)
        }
    });

    Meteor.publish('notifications-list',()=>{
        try {
          return Notifications.find({isActive:true})
        }
        catch (e) {

        }
    })


