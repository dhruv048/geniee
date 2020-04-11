Meteor.publish('products',(Id)=>{
    return Products.find({service:Id},{sort:{views:1}});
});

Meteor.publish('all_products', function () {
    Counts.publish(this, "productsCount", Products.find());
});