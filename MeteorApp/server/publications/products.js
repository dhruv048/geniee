Meteor.publish('products',(Id)=>{
    return Products.find({service:Id});
});

Meteor.publish('all_products', function () {
    Counts.publish(this, "productsCount", Products.find());
});