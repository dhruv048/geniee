import {Mongo} from 'meteor/mongo';

var service = {
    avgRate: function () {
        let sum = 0;
        this.ratings.forEach(item => {
            sum = sum + item.count;
        });
        var avg = sum / this.ratings.length;
        return avg;
    }
};

Business = new Mongo.Collection('business');
Service = new Mongo.Collection('service');
Products = new Mongo.Collection('product');

 // Service = new Mongo.Collection('service', {
 //  transform: function (doc) {
 //          doc.avgRate = function () {
 //              let sum = 0;
 //              doc.ratings.forEach(item => {
 //                  sum = sum + item.count;
 //              });
 //              var avg = sum / this.ratings.length;
 //              return avg;
 //          };
 //     return doc;
 // }});

Count = new Mongo.Collection('count');
Categories = new  Mongo.Collection('categories');
BusinessTypes = new  Mongo.Collection('businesstypes');
MainCategories= new Mongo.Collection('MainCategories');
// Categories.schema== new SimpleSchema({
//     name: {type: String},
//     incompleteCount: {type: Number, defaultValue: 0},
//     userId: {type: String, regEx: SimpleSchema.RegEx.Id, optional: true}
// });

