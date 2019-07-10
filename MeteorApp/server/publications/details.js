import { Meteor } from 'meteor/meteor';
// import { Details } from '/lib/collections';


// export default () => {
//   Meteor.publish('details-list', () => {
//     return Details.find();
//   });
// }

    Meteor.publish('categories-list', function() {
        try {
            // console.log("list:"+Meteor.user().profile.createdBy)
            // if (Meteor.user().profile.role === 1) {
            //     return Category.find({createdBy: Meteor.userId()});
            // }
            // else {
                return MainCategories.find({});
            // }

         //    var data = Service.find({}, {
         //        transform(doc) {
         //            let sum = 0;
         //            doc.ratings.forEach(item => {
         //                sum = sum + item.count;
         //            });
         //            var avg = sum / doc.ratings.length;
         //            doc.avgRate = avg;
         //            return doc;
         //        }
         //    });
         //
         // console.log(data.fetch()[0]);
         // return data;
        }
        catch (e) {
            console.log(e.message)
        }
    });

    Meteor.publish('categories',()=>{
    return Categories.find({},{fields: {'name':1}});
    });


     Meteor.publish('srvicesByLimit', function(obj) {
         console.log(obj);
         // try {
             return Service.find({
                 "location.geometry": {
                     $near: {
                         $geometry: {
                             type: "Point",
                             coordinates: obj.coordinates
                         },
                     }
                 }
             }, {limit: obj.limit});
         // }
         // catch(e){
         //     console.log(e.message)
         // }
     });



// }

