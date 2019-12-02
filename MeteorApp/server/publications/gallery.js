import {Gallery} from "../../lib/collections/gallery";

Meteor.publish('galleryItems', (Id) => {
    return Gallery.find({owner: Id ? Id : this.userId});
});
Meteor.publish('adminGallery', () => {
    return Gallery.find({isActive: {$exists: true}})
});
Meteor.publish('activeBanners', () => {
    return Gallery.find({isActive: {$exists: true, $eq: true}})
});