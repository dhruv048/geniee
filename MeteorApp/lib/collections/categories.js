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

Service = new Mongo.Collection('service');

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

MainCategories= new Mongo.Collection('MainCategories');
// Categories.schema== new SimpleSchema({
//     name: {type: String},
//     incompleteCount: {type: Number, defaultValue: 0},
//     userId: {type: String, regEx: SimpleSchema.RegEx.Id, optional: true}
// });
