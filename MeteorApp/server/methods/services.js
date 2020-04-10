import {Meteor} from 'meteor/meteor';
import {FIREBASE_MESSAGING} from '../API/fire-base-admin';
import {Ratings} from "../../lib/collections/genieeRepair/ratings";
import {EFProducts} from "../../lib/collections/eatFit/efProducts";

Meteor.methods({

    'addNewService': (serviceInfo) => {
        try {
            console.log('addNewCategory:::=>>>');
            var currentUserId = Meteor.userId();
            let Id = moment().format('DDMMYYx');
            let CategoryId = serviceInfo.Category.subCatId !== null ? serviceInfo.Category.subCatId : Id;
            if (!serviceInfo.Category.subCatId) {
                MainCategories.update(
                    {catId: "0"},
                    {
                        $addToSet:
                            {
                                subCategories: {subCatId: CategoryId, subCategory: serviceInfo.Category.subCategory}
                            }
                    }
                )
            }
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
                        fileName: serviceInfo.Image.modificationDate + '.JPEG',
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
                            try {
                                FIREBASE_MESSAGING.notificationToAll("newServiceStaging", `New Service Provider - ${serviceInfo.title}`, serviceInfo.description, {
                                    Id: res,
                                    navigate: "true",
                                    route: "ServiceDetail",
                                    image: serviceInfo.coverImage
                                })
                            } catch (e) {
                                throw new Meteor.Error(403, e.message);
                            }
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
                try {
                    FIREBASE_MESSAGING.notificationToAll("newServiceStaging", `New Service Provider - ${serviceInfo.title}`, serviceInfo.description, {
                        Id: res,
                        navigate: "true",
                        route: "ServiceDetail",
                    })
                } catch (e) {
                    throw new Meteor.Error(403, e.message);
                }
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
            // rating.ratedBy = {_id: Meteor.userId(), name: user.profile.name, coverImage: user.profile.profileImage};
            // rating.rateDate = new Date();
            // let service = Service.findOne({_id: Id});
            // let Ratings = service.ratings;
            // let avg = service.hasOwnProperty('avgRate') ? service.avgRate : 0;
            // avg = avg + rating.count;
            // Ratings.push(rating);
            // Service.update({_id: Id}, {
            //     $set: {
            //         ratings: Ratings,
            //         avgRate: avg
            //     }
            // });

            let Rating = {
                serviceId: Id,
                ratedBy: user._id,
                rateDate: new Date(new Date().toUTCString()),
                rating: rating
            };

            Ratings.upsert({ratedBy: user._id, serviceId: Id}, {
                $set: Rating
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
                    let Id = moment().format('DDMMYYx');
                    ServiceImage.write(new Buffer(image.data, 'base64'),
                        {
                            fileName: image.name,
                            type: image.type
                        },
                        (err, res) => {
                            if (err) {
                                console.log('error', err)
                            }
                            else {
                                console.log('res:', res._id);
                                imageIds.push(res._id);
                                if (productInfo.images.length === imageIds.length) {
                                    productInfo.images = imageIds;
                                    console.log('insert')
                                    try {
                                        FIREBASE_MESSAGING.notificationToAll("newPoductStaging", `New Product Available - ${productInfo.title}`, productInfo.description, {
                                            Id: Id,
                                            navigate: "true",
                                            route: "ProductDetail",
                                            image: productInfo.images[0]
                                        })
                                    } catch (e) {
                                        throw new Meteor.Error(403, e.message);
                                    }
                                    return Products.insert(productInfo);
                                }
                            }
                        }, proceedAfterUpload = true)
                })
            }
            else {
                productInfo.images = [];
                console.log('insert');
                try {
                    FIREBASE_MESSAGING.notificationToAll("newPoductStaging", `New Product Available - ${productInfo.title}`, productInfo.description, {
                        Id: Id,
                        navigate: "true",
                        route: "ProductDetail",
                    })
                } catch (e) {
                    throw new Meteor.Error(403, e.message);
                }
                return Products.insert(productInfo);
            }

        }
        catch (e) {
            console.log(e.message);
            throw new Meteor.Error(403, e.message)

        }
    },

    'getSingleService': (Id) => {
        //   return Service.findOne(Id);

        const collection = Service.rawCollection()
        const aggregate = Meteor.wrapAsync(collection.aggregate, collection);
        const defaultRating = {'id': '000', 'avgRate': 0, 'count': 0};
        const categoryLookup = {
            from: "MainCategories",
            let: {catId: "$categoryId"},
            pipeline: [
                {
                    $match: {
                        $expr: {

                            $eq: ["$subCategories.subCatId", "$$catId"]
                        }
                    }
                },
            ],
            "as": "categories"
        };
        const ServiceRatings = {
            from: "ratings",
            let: {serviceId: Id},
            pipeline: [
                {$match: {$expr: {$eq: ["$serviceId", "$$serviceId"]}}},
                {
                    $group: {
                        _id: '$_id',
                        avgRate: {$avg: "$rating.count"},
                        count: {$sum: 1}
                    }
                },
                {$project: {avgRate: 1, count: 1}}
            ],
            "as": "servRatings"
        };

        const addValues = {
            Rating: {
                $cond: {
                    if: {"$eq": ["$servRatings", []]}, then: defaultRating, else: {$arrayElemAt: ["$servRatings", 0]}
                }
            },
            category: {$arrayElemAt: ['$categories', 0]}
        };

        // const project = {
        //     _id: 1,
        //     "products": {$arrayElemAt: ["$products", 0]},
        //     createDate: 1,
        //     title: 1,
        //     description: 1,
        // };
        //  return Category.find().fetch();
        return Async.runSync(function (done) {
            aggregate([
                {$match: {_id: Id}},
                {$lookup: categoryLookup},
                {$lookup: ServiceRatings},
                {$addFields: addValues},
                // {$project: project}
            ], {cursor: {}}).toArray(function (err, doc) {
                if (doc) {
                    //   console.log('doc', doc.length,doc)
                }
                done(err, doc);
            });
        });
    },

    'getSingleProduct': Id => {
        return Products.findOne({
            _id: Id
        });
    },

    'updateViewCount': (productId) => {
        let _product = Products.findOne(productId);
        if (_product) {
            let views = _product.views || 0;
            Products.update({_id: productId}, {
                $set: {
                    views: views + 1
                }
            });
        }
    },

    'getSimilarProduct': Id => {
        let product = Products.findOne({_id: Id});
        return Products.find({
            service: product.service,
            _id: {
                $ne: Id
            }
        }).fetch();
    },

    'getServicesNearBy': (obj) => {
        const collection = Service.rawCollection()
        const aggregate = Meteor.wrapAsync(collection.aggregate, collection);
        const defaultRating = {'id': '000', 'avgRate': 0, 'count': 0};
        const categoryLookup = {
            from: "MainCategories",
            let: {catId: "$categoryId"},
            pipeline: [
                {
                    $match: {
                        $expr: {

                            $eq: ["$subCategories.subCatId", "$$catId"]
                        }
                    }
                },
            ],
            "as": "categories"
        };

        const ServiceRatings = {
            from: "ratings",
            let: {serviceId: "$_id"},
            pipeline: [
                {$match: {$expr: {$eq: ["$serviceId", "$$serviceId"]}}},
                {
                    $group: {
                        _id: '$_id',
                        avgRate: {$avg: "$rating.count"},
                        count: {$sum: 1}
                    }
                },
                {$project: {avgRate: 1, count: 1}}
            ],
            "as": "servRatings"
        };

        const addValues = {
            Rating: {
                $cond: {
                    if: {"$eq": ["$servRatings", []]}, then: defaultRating, else: {$arrayElemAt: ["$servRatings", 0]}
                }
            },
            category: {$arrayElemAt: ['$categories', 0]}
        };
        // const project = {
        //     _id: 1,
        //     "products": {$arrayElemAt: ["$products", 0]},
        //     createDate: 1,
        //     title: 1,
        //     description: 1,
        // };
        //  return Category.find().fetch();
        return Async.runSync(function (done) {
            aggregate([
                {
                    $geoNear: {
                        near: {type: "Point", coordinates: obj.coords},
                        distanceField: "dist.calculated",
                        query: {categoryId: {$in: obj.subCatIds}},
                        spherical: true,
                        distanceMultiplier: 0.001
                    }
                },
                {$lookup: categoryLookup},
                {$lookup: ServiceRatings},
                {$addFields: addValues},
                {$limit: obj.skip + obj.limit},
                {$skip: obj.skip},
                // {$project: project}
            ], {cursor: {}}).toArray(function (err, doc) {
                if (doc) {
                    //   console.log('doc', doc.length,doc)
                }
                done(err, doc);
            });
        });
    },

    'getMyServices':()=>{
        const collection = Service.rawCollection()
        const aggregate = Meteor.wrapAsync(collection.aggregate, collection);
        const defaultRating = {'id': '000', 'avgRate': 0, 'count': 0};
        const categoryLookup = {
            from: "MainCategories",
            let: {catId: "$categoryId"},
            pipeline: [
                {
                    $match: {
                        $expr: {

                            $eq: ["$subCategories.subCatId", "$$catId"]
                        }
                    }
                },
            ],
            "as": "categories"
        };

        const ServiceRatings = {
            from: "ratings",
            let: {serviceId: "$_id"},
            pipeline: [
                {$match: {$expr: {$eq: ["$serviceId", "$$serviceId"]}}},
                {
                    $group: {
                        _id: '$_id',
                        avgRate: {$avg: "$rating.count"},
                        count: {$sum: 1}
                    }
                },
                {$project: {avgRate: 1, count: 1}}
            ],
            "as": "servRatings"
        };

        const addValues = {
            Rating: {
                $cond: {
                    if: {"$eq": ["$servRatings", []]}, then: defaultRating, else: {$arrayElemAt: ["$servRatings", 0]}
                }
            },
            category: {$arrayElemAt: ['$categories', 0]}
        };
        // const project = {
        //     _id: 1,
        //     "products": {$arrayElemAt: ["$products", 0]},
        //     createDate: 1,
        //     title: 1,
        //     description: 1,
        // };
        //  return Category.find().fetch();
        return Async.runSync(function (done) {
            aggregate([
                {
                   $match:{owner:Meteor.userId()}
                },
                {$lookup: categoryLookup},
                {$lookup: ServiceRatings},
                {$addFields: addValues},
                // {$limit: obj.skip + obj.limit},
                // {$skip: obj.skip},
                // {$project: project}
            ], {cursor: {}}).toArray(function (err, doc) {
                if (doc) {
                    //   console.log('doc', doc.length,doc)
                }
                done(err, doc);
            });
        });
    },

    'updateServiceViewCount':(serviceId)=>{
        let _service=Service.findOne(serviceId);
        if(_service) {
            let views = _service.views || 0;
            Service.update({_id: serviceId}, {
                $set: {
                    views: views + 1
                }
            });
        }
    },


})