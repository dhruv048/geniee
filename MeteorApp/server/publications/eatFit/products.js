
import {EFProducts} from "../../../lib/collections/eatFit/efProducts";
import {EFCategories} from "../../../lib/collections/eatFit/efCategories";

Meteor.publish('allcategoriesEF',function(){
    return EFCategories.find()
});

Meteor.publish('productsEF',(Id)=>{
    return EFProducts.find({category:Id});
});

Meteor.publish('all_productsEF', function () {
    Counts.publish(this, "productsCountEF", EFProducts.find());
});

Meteor.publish('allProductsEF', function (skip, Id) {
    return EFProducts.find()
});
Meteor.publish('singleProductEF', function (Id) {
    return EFProducts.find({_id: Id});
});

