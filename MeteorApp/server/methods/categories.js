import {Meteor} from 'meteor/meteor';
import Moment from 'moment';

Meteor.methods({

    'addNewService': (serviceInfo) => {
        try {
            console.log('addNewCategory:::=>>>');
            var currentUserId = Meteor.userId();
            let Id = Moment().format('DDMMYYx');
            let CategoryId = serviceInfo.Category.subCatId !== null ? serviceInfo.Category.subCatId : Id;
            MainCategories.update(
                {catId: "0"},
                {
                    $addToSet:
                        {
                            subCategories: {subCatId: Id, subCategory: serviceInfo.Category.subCategory}
                        }
                }
            )
            let location = {
                geometry: {
                    coordinates: [serviceInfo.location.geometry.location.lng, serviceInfo.location.geometry.location.lat],
                    type: 'Point',
                    location: {
                        lat: serviceInfo.location.geometry.location.lat,
                        lng: serviceInfo.location.geometry.location.lng
                    }
                },
                formatted_address: serviceInfo.location.formatted_address,
            }
            //     serviceInfo.location.geometry.coordinates=[serviceInfo.location.geometry.location.lng,serviceInfo.location.geometry.location.lat]
            serviceInfo.location = location;
            if (serviceInfo.Image) {
                ServiceImage.write(new Buffer(serviceInfo.Image.data, 'base64'),
                    {
                        fileName: serviceInfo.Image.modificationDate + '.jpg',
                        type: serviceInfo.Image.mime
                    },
                    (err, res) => {
                        if (err) {
                            console.log(err)
                        }
                        else {
                            console.log(res._id)
                            serviceInfo.createdAt = new Date(new Date().toUTCString());
                            serviceInfo.createdBy = currentUserId;
                            serviceInfo.coverImage = res._id;
                            serviceInfo.categoryId = CategoryId;
                            serviceInfo.ratings = [{count: 0}];
                            var res = Service.insert(serviceInfo);
                            return res;
                        }
                    }, proceedAfterUpload = true)
            }
            else {

                var res = Service.insert({
                    title: serviceInfo.title,
                    description: serviceInfo.description,
                    contact: serviceInfo.contact,
                    location: serviceInfo.location,
                    radius: serviceInfo.radius,
                    coverImage: null,
                    homeDelivery: serviceInfo.homeDelivery,
                    categoryId: CategoryId,
                    createdAt: new Date(),
                    createdBy: currentUserId,
                    ratings: [{count: 0}],
                });

                return res;
            }

        }
        catch (e) {
            console.log(e.message);
            throw new Meteor.Error(403, e.message)

        }
    },

    'addCategory': (name) => {
        console.log('addCategory:::=>>>');
        var currentUserId = Meteor.userId();
        try {
            var res = Categories.insert({
                name: name,
                createdAt: new Date(),
                createdBy: currentUserId,
            });
            return res;
        }
        catch (e) {
            console.log(e.message);
            throw new Meteor.Error(403, e.message)

        }
    },


    'updateCategory': function (category) {
        var cat = Service.findOne({_id: category._id});
        if (cat.createdBy === Meteor.userId() || Meteor.user().profile.role === 2) {
            try {

                Category.update({_id: category._id}, {
                    $set: {
                        title: category.title,
                        name: category.name,
                        contact: category.contact,
                    }
                });
            }
            catch (err) {
                console.log(err.message);
                throw new Meteor.Error(403, e.message)
            }

        }
        else {
            console.log("Permission Denied")
            throw new Meteor.Error(401, "Permission Denied");
        }
    },

    'removeCategory': function (id) {
        var category = Service.findOne({_id: id});
        if (Meteor.userId() === category.createdBy || Meteor.user().profile.role === 2) {
            try {
                Category.remove({_id: id});
            }
            catch (err) {
                console.log(err.message);
                throw new Meteor.Error(403, err.message);
            }
        }
        else {
            throw new Meteor.Error(401, "Permission Denied");
        }
    },

    'updateCallCount': function () {
        try {

            if (Count.find().count() > 0) {
                var count = Count.findOne();
                Count.update({_id: count._id}, {
                    $set: {
                        callCount: count.callCount + 1
                    }
                });
            }

            else {
                Count.insert({callCount: 1})
            }
        }
        catch (err) {
            console.log(err.message);
            throw new Meteor.Error(403, err.message)
        }


    },

    'SearchService': function (searchText) {
        try {
            // check(searchText, String);
            // this.unblock();
            var searchExp = new RegExp(RexExp.escape(searchText), 'i');
            return Service.find({$or: [{title: searchExp}, {description: searchText}]}).fetch();
        }
        catch (e) {
            console.log('from search' + e.message)
        }
    },

    'updateRating': function (Id, rating) {
        try {
            let user = Meteor.user();
            rating.ratedBy = {_id: Meteor.userId(), name: user.profile.name, coverImage: user.profile.profileImage};
            rating.rateDate = new Date();
            let service = Service.findOne({_id: Id});
            let Ratings = service.ratings;
            let avg = service.hasOwnProperty('avgRate') ? service.avgRate : 0;
            avg = avg + rating.count;
            Ratings.push(rating);
            Service.update({_id: Id}, {
                $set: {
                    ratings: Ratings,
                    avgRate: avg
                }
            });
        }
        catch (err) {
            console.log(err.message);
            throw new Meteor.Error(403, err.message)
        }
    },
    'addNewProduct': (productInfo) => {
        try {
            console.log('addNewProducr:::=>>>');
            var currentUserId = Meteor.userId();
            productInfo.createdBy = currentUserId,
                productInfo.createDate = new Date(new Date().toUTCString())
            let imageIds = [];
            if (productInfo.images) {
                productInfo.images.forEach(image => {
                    let Id = Moment().format('DDMMYYx');
                    ServiceImage.write(new Buffer(image.data, 'base64'),
                        {
                            fileName: Id + '.jpg',
                            type: image.mime
                        },
                        (err, res) => {
                            if (err) {
                                console.log('error',err)
                            }
                            else {
                                console.log('res:',res._id);
                                imageIds.push(res._id);
                                if(productInfo.images.length===imageIds.length){
                                    productInfo.images = imageIds;
                                    console.log('insert')
                                    return Products.insert(productInfo);
                                }
                            }
                        }, proceedAfterUpload = true)
                })
            }
            else {
                productInfo.images = [];
                console.log('insert')
                return Products.insert(productInfo);
            }

        }
        catch (e) {
            console.log(e.message);
            throw new Meteor.Error(403, e.message)

        }
    },
})