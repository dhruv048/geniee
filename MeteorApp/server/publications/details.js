import { Meteor } from 'meteor/meteor';
// import { Details } from '/lib/collections';


// export default () => {
//   Meteor.publish('details-list', () => {
//     return Details.find();
//   });
// }

    Meteor.publish('categories-list', () => {
        return Category.find();
    });

