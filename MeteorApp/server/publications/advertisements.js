import {Advertisements} from "../../lib/collections/advertisements";

Meteor.publish('galleryItems', (Id) => {
    return Advertisements.find({owner: Id ? Id : this.userId});
});
Meteor.publish('adminGallery', () => {
    return Advertisements.find({isActive: {$exists: true}})
});
Meteor.publish('activeBanners', () => {
    return Advertisements.find({isActive: {$exists: true, $eq: true}})
});