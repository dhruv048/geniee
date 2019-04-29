import {Mongo} from 'meteor/mongo';

 Category = new Mongo.Collection('category');

Count = new Mongo.Collection('count');
Categories = new  Mongo.Collection('categories');
// Categories.schema== new SimpleSchema({
//     name: {type: String},
//     incompleteCount: {type: Number, defaultValue: 0},
//     userId: {type: String, regEx: SimpleSchema.RegEx.Id, optional: true}
// });