import { Meteor } from 'meteor/meteor';
import { ReactiveAggregate } from 'meteor/tunguska:reactive-aggregate';

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

Meteor.publish('nearByService',function(obj){
    console.log('nearByService')
   ReactiveAggregate(this, Service, [
        {
            $geoNear: {
                near: { type: "Point", coordinates: obj.coords },
                distanceField: "dist.calculated",
                query:{categoryId:{$in: obj.subCatIds}},
                spherical: true,
                distanceMultiplier : 0.001
            }
        },{$limit:obj.limit}
    ], { clientCollection: 'serviceReact' },{allowDiskUse: true}
    )
});

Meteor.publish('myServices', function () {
    const logged=Meteor.userId();
  return  Service.find({createdBy:logged});
})

Meteor.publish('allServices',function(){
    return Service.find(
        {},{$fields:{
        _id:1,
            title:1
        }}
        )
});
Meteor.publish('allProducts',function(){
    return Products.find({},{sort:{views:1}})
});
Meteor.publish('singleProduct',function(id){
    return Products.find({_id:id})
});
// }
Meteor.publish('loggedUser',function () {
    console.log('subscribed')
    return Meteor.users.find({_id:this.userId});
})
