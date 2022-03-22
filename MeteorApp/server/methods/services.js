import { Meteor } from "meteor/meteor";
import { FIREBASE_MESSAGING } from "../API/fire-base-admin";
import { Ratings } from "../../lib/collections/genieeRepair/ratings";
import { EFProducts } from "../../lib/collections/eatFit/efProducts";
import { ProductOwner, NotificationTypes, BusinessType } from "../../lib/utils";
import { HTTP } from 'meteor/http';

const fs = require("fs");

const removeProductsByServiceId = (Id) => {
    let _products = Products.find({ service: Id }).fetch();
    _products.foreach((_product) => {
        Products.remove(_product._id);
        _product.images.foreach((item) => {
            ServiceImage.remove(item);
        });
    });
};

const handleImageUpload = (formData) => new Promise((resolve, reject) => {
    let jsonImage = { base64Data: formData };
    HTTP.post('http://139.59.59.117/api/upload', {
        headers: {
            'Content-Type': 'application/json'
        },
        data: jsonImage
    }
        , (error, result) => {
            if (error) reject({ target: 'handleImageUpload', error });
            else {
                resolve(result.data);
            }
        });
});

const handleBulkImageUpload = (formData, cb) => {
    let imageFileName = [];
    Promise.all(
        formData.map((imageData) => handleImageUpload(imageData).then((res) => {
            imageFileName.push(res.fileName);
        }),
        )).then(() => cb(imageFileName))
        .catch((err) => {
            console.log('error', err);
        })
};

Meteor.methods({
    addNewBusiness: async (businessInfo) => {
        try {
            var currentUserId = Meteor.userId();
            var existingMerchantTitle = Business.findOne({ businessName: businessInfo.businessName });
            if (existingMerchantTitle) {
                throw new Meteor.Error('This business is already exist. Please try with other business');
            }
            const merchantImage = await handleImageUpload(businessInfo.merchantImage);
            const PANImage = await handleImageUpload(businessInfo.PANImage);
            const registrationImage = await handleImageUpload(businessInfo.registrationImage);
            // let location = {
            //     geometry: {
            //         coordinates: [
            //             serviceInfo.location.geometry.location.lng,
            //             serviceInfo.location.geometry.location.lat,
            //         ],
            //         type: "Point",
            //         location: {
            //             lat: serviceInfo.location.geometry.location.lat,
            //             lng: serviceInfo.location.geometry.location.lng,
            //         },
            //     },
            //     formatted_address: serviceInfo.location.formatted_address,
            // };
            let Owner = Meteor.users.findOne({ _id: businessInfo.owner });

            businessInfo.merchantImage = merchantImage ? merchantImage.fileName : '';
            businessInfo.PANImage = PANImage ? PANImage.fileName : '';
            businessInfo.registrationImage = registrationImage ? registrationImage.fileName : '';

            businessInfo.createdAt = new Date(new Date().toUTCString());
            businessInfo.createdBy = currentUserId;
            businessInfo.coverImage = registrationImage ? registrationImage.fileName : '';;
            businessInfo.categoryId = businessInfo.selectedCategory;
            businessInfo.ratings = [{ count: 0 }];
            businessInfo.Image = registrationImage ? registrationImage.fileName : '';;
            businessInfo.isApproved = false;
            businessInfo.approvedBy = null;
            businessInfo.approvedDate = null;

            var res = Business.insert(businessInfo);
            try {
                FIREBASE_MESSAGING.notificationToAll(
                    "newBusinessStaging",
                    `New Business Provider - ${businessInfo.merchantName}`,
                    businessInfo.merchantName,
                    {
                        Id: res,
                        navigate: "true",
                        route: "ServiceDetail",
                    }
                );
            } catch (e) {
                throw new Meteor.Error(403, e.message);
            }
            const notification = {
                title: `New Service by- ${Owner.profile.name}`,
                description: businessInfo.merchantName,
                owner: businessInfo.owner,
                navigateId: res,
                receiver: [],
                removedBy: [],
                type: NotificationTypes.ADD_SERVICE,
                image: businessInfo.coverImage
            };
            Meteor.call("addNotification", notification);
            return res;
            // }
        } catch (e) {
            console.log(e.message);
            throw new Meteor.Error(403, e.message);
        }
    },

    updateBusiness: (businessId, businessInfo) => {
        businessInfo.updatedAt = new Date(new Date().toUTCString());
        Service.update({ _id: businessId }, { $set: businessInfo });
        // }
    },

    updateBusinessViewCount: (businessId) => {
        let _business = Business.findOne(businessId);
        if (_business) {
            let views = _business.views || 0;
            Business.update(
                { _id: businessId },
                {
                    $set: {
                        views: views + 1,
                    },
                }
            );
        }
    },

    getBusinessInfo: (loggedUser) => {
        try {
            if (loggedUser != null) {
                let user = Business.find({ owner: loggedUser }).fetch();

                return Async.runSync(function (done) {
                    done(null, user);
                })
            }
            else {
                return false;
            }
        } catch (e) {
            throw new Meteor.Error(403, e.message);
        }
    },

    addNewService: (serviceInfo) => {
        try {
            console.log("addNewCategory:::=>>>");
            var currentUserId = Meteor.userId();
            let Id = moment().format("DDMMYYx");
            let CategoryId =
                serviceInfo.Category.subCatId !== null
                    ? serviceInfo.Category.subCatId
                    : Id;
            if (!serviceInfo.Category.subCatId) {
                MainCategories.update(
                    { catId: "0" },
                    {
                        $addToSet: {
                            subCategories: {
                                subCatId: CategoryId,
                                subCategory: serviceInfo.Category.subCategory,
                            },
                        },
                    }
                );
            }
            let location = {
                geometry: {
                    coordinates: [
                        serviceInfo.location.geometry.location.lng,
                        serviceInfo.location.geometry.location.lat,
                    ],
                    type: "Point",
                    location: {
                        lat: serviceInfo.location.geometry.location.lat,
                        lng: serviceInfo.location.geometry.location.lng,
                    },
                },
                formatted_address: serviceInfo.location.formatted_address,
            };
            //     serviceInfo.location.geometry.coordinates=[serviceInfo.location.geometry.location.lng,serviceInfo.location.geometry.location.lat]
            serviceInfo.location = location;
            let Owner = Meteor.users.findOne({ _id: serviceInfo.owner });
            // if (serviceInfo.Image) {
            //     ServiceImage.write(
            //         new Buffer(serviceInfo.Image.data, "base64"),
            //         {
            //             fileName: serviceInfo.Image.modificationDate + ".JPEG",
            //             type: serviceInfo.Image.mime,
            //         },
            //         (err, res) => {
            //             if (err) {
            //                 console.log(err);
            //             } else {
            //                 console.log(res._id);
            //                 serviceInfo.createdAt = new Date(
            //                     new Date().toUTCString()
            //                 );
            //                 serviceInfo.createdBy = currentUserId;
            //                 serviceInfo.coverImage = res._id;
            //                 serviceInfo.categoryId = CategoryId;
            //                 serviceInfo.ratings = [{count: 0}];
            //                 serviceInfo.Image = null;
            //                 var res = Service.insert(serviceInfo);
            //                 try {
            //                     FIREBASE_MESSAGING.notificationToAll(
            //                         "newServiceStaging",
            //                         `New Service by- ${Owner.profile.name}`,
            //                         serviceInfo.title,
            //                         {
            //                             Id: res,
            //                             navigate: "true",
            //                             route: "ServiceDetail",
            //                             image: serviceInfo.coverImage,
            //                             icon: Owner.profile.profileImage
            //                                 ? Owner.profile.profileImage
            //                                 : "",
            //                         }
            //                     );
            //                 } catch (e) {
            //                     throw new Meteor.Error(403, e.message);
            //                 }
            //                 const notification = {
            //                     title: `New Service by- ${Owner.profile.name}`,
            //                     description: serviceInfo.title,
            //                     owner: serviceInfo.owner,
            //                     navigateId: res,
            //                     receiver: [],
            //                     removedBy: [],
            //                     type: NotificationTypes.ADD_SERVICE,
            //                 };
            //                 Meteor.call("addNotification", notification);
            //                 return res;
            //             }
            //         },
            //         (proceedAfterUpload = true)
            //     );
            // } else {
            serviceInfo.createdAt = new Date(new Date().toUTCString());
            serviceInfo.createdBy = currentUserId;
            serviceInfo.coverImage = null;
            serviceInfo.categoryId = CategoryId;
            serviceInfo.ratings = [{ count: 0 }];
            serviceInfo.Image = null;
            var res = Service.insert(serviceInfo);
            try {
                FIREBASE_MESSAGING.notificationToAll(
                    "newServiceStaging",
                    `New Service Provider - ${serviceInfo.title}`,
                    serviceInfo.description,
                    {
                        Id: res,
                        navigate: "true",
                        route: "ServiceDetail",
                    }
                );
            } catch (e) {
                throw new Meteor.Error(403, e.message);
            }
            const notification = {
                title: `New Service by- ${Owner.profile.name}`,
                description: serviceInfo.title,
                owner: serviceInfo.owner,
                navigateId: res,
                receiver: [],
                removedBy: [],
                type: NotificationTypes.ADD_SERVICE,
            };
            Meteor.call("addNotification", notification);
            return res;
            // }
        } catch (e) {
            console.log(e.message);
            throw new Meteor.Error(403, e.message);
        }
    },

    updateService: (servId, serviceInfo) => {
        let Id = moment().format("DDMMYYx");
        let CategoryId =
            serviceInfo.Category.subCatId !== null
                ? serviceInfo.Category.subCatId
                : Id;
        if (!serviceInfo.Category.subCatId) {
            MainCategories.update(
                { catId: "0" },
                {
                    $addToSet: {
                        subCategories: {
                            subCatId: CategoryId,
                            subCategory: serviceInfo.Category.subCategory,
                        },
                    },
                }
            );
        }
        let location = {
            geometry: {
                coordinates: [
                    serviceInfo.location.geometry.location.lng,
                    serviceInfo.location.geometry.location.lat,
                ],
                type: "Point",
                location: {
                    lat: serviceInfo.location.geometry.location.lat,
                    lng: serviceInfo.location.geometry.location.lng,
                },
            },
            formatted_address: serviceInfo.location.formatted_address,
        };
        //     serviceInfo.location.geometry.coordinates=[serviceInfo.location.geometry.location.lng,serviceInfo.location.geometry.location.lat]
        serviceInfo.location = location;
        // if (serviceInfo.Image) {
        //     ServiceImage.write(
        //         new Buffer(serviceInfo.Image.data, "base64"),
        //         {
        //             fileName: serviceInfo.Image.modificationDate + ".JPEG",
        //             type: serviceInfo.Image.mime,
        //         },
        //         (err, res) => {
        //             if (err) {
        //                 console.log(err);
        //             } else {
        //                 console.log(res._id);
        //                 ServiceImage.remove(serviceInfo.coverImage);
        //                 serviceInfo.updatedAt = new Date(
        //                     new Date().toUTCString()
        //                 );
        //                 serviceInfo.coverImage = res._id;
        //                 serviceInfo.categoryId = CategoryId;
        //                 serviceInfo.Image = null;
        //                 Service.update({ _id: servId }, { $set: serviceInfo });
        //             }
        //         },
        //         (proceedAfterUpload = true)
        //     );
        // } else {
        serviceInfo.updatedAt = new Date(new Date().toUTCString());
        serviceInfo.categoryId = CategoryId;
        serviceInfo.Image = null;
        Service.update({ _id: servId }, { $set: serviceInfo });
        // }
    },

    addCategory: (name) => {
        console.log("addCategory:::=>>>");
        var currentUserId = Meteor.userId();
        try {
            var res = Categories.insert({
                name: name,
                createdAt: new Date(),
                createdBy: currentUserId,
            });
            return res;
        } catch (e) {
            console.log(e.message);
            throw new Meteor.Error(403, e.message);
        }
    },

    updateCategory: function (category) {
        var cat = Service.findOne({ _id: category._id });
        if (
            cat.createdBy === Meteor.userId() ||
            Meteor.user().profile.role === 2
        ) {
            try {
                Category.update(
                    { _id: category._id },
                    {
                        $set: {
                            title: category.title,
                            name: category.name,
                            contact: category.contact,
                        },
                    }
                );
            } catch (err) {
                console.log(err.message);
                throw new Meteor.Error(403, e.message);
            }
        } else {
            console.log("Permission Denied");
            throw new Meteor.Error(401, "Permission Denied");
        }
    },

    removeCategory: function (id) {
        var category = Service.findOne({ _id: id });
        if (
            Meteor.userId() === category.createdBy ||
            Meteor.user().profile.role === 2
        ) {
            try {
                Category.remove({ _id: id });
            } catch (err) {
                console.log(err.message);
                throw new Meteor.Error(403, err.message);
            }
        } else {
            throw new Meteor.Error(401, "Permission Denied");
        }
    },

    getAllCategories: function () {
        var data = Categories.find().fetch();
        return data;
    },

    getBusinessType: function () {
        var data = BusinessTypes.find().fetch();
        return data;
    },

    getBusinessList: function (userId) {
        try {
            var currentUserId = userId != null ? userId : Meteor.userId();
            var data = Business.find({ owner: currentUserId }).fetch();
            return data;
        } catch (error) {
            throw new Meteor.Error('Please first add your business Type');
        }

    },

    getPopularStores: function () {
        var data = Business.find({ businessTypes: { $in: [1, 2, 4] } }, { sort: { views: -1 } }).fetch();
        return data;
    },

    updateCallCount: function () {
        try {
            if (Count.find().count() > 0) {
                var count = Count.findOne();
                Count.update(
                    { _id: count._id },
                    {
                        $set: {
                            callCount: count.callCount + 1,
                        },
                    }
                );
            } else {
                Count.insert({ callCount: 1 });
            }
        } catch (err) {
            console.log(err.message);
            throw new Meteor.Error(403, err.message);
        }
    },

    SearchService: function (searchText) {
        try {
            // check(searchText, String);
            // this.unblock();
            var searchExp = new RegExp(RexExp.escape(searchText), "i");
            return Service.find({
                $or: [{ title: searchExp }, { description: searchText }],
            }).fetch();
        } catch (e) {
            console.log("from search" + e.message);
        }
    },

    updateRating: function (Id, rating) {
        try {
            let user = Meteor.user();
            const service = Service.findOne({ _id: Id });

            let Rating = {
                serviceId: Id,
                ratedBy: user._id,
                rateDate: new Date(new Date().toUTCString()),
                rating: rating,
            };

            Ratings.upsert(
                { ratedBy: user._id, serviceId: Id },
                {
                    $set: Rating,
                }
            );

            const notification = {
                title: `Rating provided by- ${user.profile.name}`,
                description: service.title,
                owner: user._id,
                navigateId: Id,
                receiver: [service.owner],
                removedBy: [],
                type: NotificationTypes.RATE_SERVICE,
            };
            Meteor.call("addNotification", notification);
            try {
                const tokens =
                    Meteor.users.findOne({ _id: service.owner }).devices || [];
                FIREBASE_MESSAGING.notificationToList(
                    tokens,
                    "New Service Review",
                    `${user.profile.name} has reviewd your service '${service.title}. "${rating.comment}"`,
                    {
                        Id: Id,
                        navigate: "true",
                        route: "ServiceRatings",
                        image: service.coverImage || "",
                        icon: user.profile.profileImage || "",
                    }
                );
            }
            catch (err) {
                console.log(err.message);
                // throw new Meteor.Error(403, err.message);
            }

        } catch (err) {
            console.log(err.message);
            throw new Meteor.Error(403, err.message);
        }
    },

    getMyRating: (servId) => {
        return Ratings.findOne({ serviceId: servId, ratedBy: Meteor.userId() });
    },

    getRatings: (servId, skip) => {
        let _skip = skip ? skip : 0;
        const collection = Ratings.rawCollection();
        const aggregate = Meteor.wrapAsync(collection.aggregate, collection);
        const pipeline = [
            { $match: { serviceId: servId } },
            {
                $lookup: {
                    from: "users",
                    as: "users",
                    localField: "ratedBy",
                    foreignField: "_id",
                    as: "Users",
                },
            },
            {
                $addFields: {
                    RatedBy: { $arrayElemAt: ["$Users", 0] },
                },
            },
            { $sort: { rateDate: -1 } },
            { $limit: _skip + 20 },
            { $skip: _skip },
            {
                $project: {
                    _id: 1,
                    ratedBy: 1,
                    rateDate: 1,
                    rating: 1,
                    "RatedBy.profile.name": 1,
                    "RatedBy.profile.profileImage": 1,
                },
            },
        ];
        return Async.runSync(function (done) {
            aggregate(pipeline, { cursor: {} }).toArray(function (err, doc) {
                if (doc) {
                    //   console.log('doc', doc.length,doc)
                }
                done(err, doc);
            });
        });
    },

    addNewProduct: (productInfo) => {
        try {
            console.log("addNewProducr:::=>>>");
            let imageIds = [];
            productInfo.productOwner = ProductOwner.REGULAR_USERS;
            var currentUserId = Meteor.userId();
            productInfo.createdBy = currentUserId;
            //productInfo.qty = parseInt(productInfo.qty);
            //productInfo.availabeQuantity = parseInt(productInfo.qty);
            productInfo.price = parseInt(productInfo.price);
            productInfo.discount = parseInt(productInfo.discount);
            //productInfo.radius = parseInt(productInfo.radius);
            productInfo.createDate = new Date(new Date().toUTCString());
            let _service = Service.findOne({ _id: productInfo.service });

            if (productInfo.images) {
                // productInfo.images.forEach(async (image) => {
                //     let Id = await imageUploadWithExternalAPI(image);
                //     imageIds.push(Id.fileName);
                // })
                handleBulkImageUpload(productInfo.images, (res) => {
                    imageIds = res;

                    productInfo.images = imageIds;
                    console.log('filename ' + productInfo.images);
                    let pId = Products.insert(productInfo);
                    try {
                        FIREBASE_MESSAGING.notificationToAll(
                            "newPoductStaging",
                            // `New Product by - ${_service.title}`,
                            `New Product Added - ${productInfo.productTitle}`,
                            productInfo.productTitle,
                            {
                                Id: pId,
                                navigate: "true",
                                route: "ProductDetail",
                                image:
                                    productInfo.images[0] || "",
                                // icon: _service.coverImage || "",
                            }
                        );
                    } catch (e) {
                        throw new Meteor.Error(403, e.message);
                    }
                    const notification = {
                        // title: `New Product by- ${_service.title}`,
                        title: `New Product Added - ${productInfo.productTitle}`,
                        description: productInfo.description,
                        owner: productInfo.owner,
                        navigateId: pId,
                        productOwner:
                            ProductOwner.REGULAR_USERS,
                        receiver: [],
                        removedBy: [],
                        type: NotificationTypes.ADD_PRODUCT,
                        image: imageIds
                    };
                    Meteor.call(
                        "addNotification",
                        notification
                    );
                    return pId;
                });
            } else {
                productInfo.images = [];
                console.log("insert");
                let pId = Products.insert(productInfo);
                try {
                    FIREBASE_MESSAGING.notificationToAll(
                        "newPoductStaging",
                        // `New Product by - ${_service.title}`,
                        `New Product Added - ${productInfo.productTitle}`,
                        productInfo.productTitle,
                        {
                            Id: pId,
                            navigate: "true",
                            route: "ProductDetail",
                        }
                    );
                } catch (e) {
                    throw new Meteor.Error(403, e.message);
                }
                const notification = {
                    // title: `New Product by- ${_service.title}`,
                    title: `New Product by- ${productInfo.productTitle}`,
                    description: productInfo.description,
                    owner: productInfo.owner,
                    navigateId: pId,
                    productOwner: ProductOwner.REGULAR_USERS,
                    receiver: [],
                    removedBy: [],
                    type: NotificationTypes.ADD_PRODUCT,
                    image: imageIds
                };
                Meteor.call("addNotification", notification);
                return pId;
            }
        } catch (e) {
            console.log(e.message);
            throw new Meteor.Error(403, e.message);
        }
    },

    updateProduct: (productId, productInfo, imagesToRemove) => {
        //productInfo.qty = parseInt(productInfo.qty);
        //productInfo.availabeQuantity = parseInt(productInfo.qty);
        productInfo.price = parseInt(productInfo.price);
        productInfo.discount = parseInt(productInfo.discount);
        //productInfo.radius = parseInt(productInfo.radius);
        productInfo.updateDate = new Date(new Date().toUTCString());
        let imageIds = [];
        productInfo.images.forEach(async (image) => {
            let Id = await uploadImage(image);
            imageIds.push(Id.fileName);
        });
        productInfo.images = imageIds;
        // if (productInfo.images.length < 1) {
        console.log("imagesToRemove", imagesToRemove);
        Products.update(
            { _id: productId },
            { $set: productInfo },
            (err, res) => {
                ServiceImage.remove({ _id: { $in: imagesToRemove } });
            }
        );
        return;
        // }
        // productInfo.images.forEach((image) => {
        //     if (!image.hasOwnProperty("_id")) {
        //         let Id =
        //             moment().format("DDMMYYx") +
        //             "." +
        //             image.mime.substr(image.mime.indexOf("/") + 1);
        //         ServiceImage.write(
        //             new Buffer(image.data, "base64"),
        //             {
        //                 fileName: Id,
        //                 type: image.mime,
        //             },
        //             (err, res) => {
        //                 if (err) {
        //                     console.log("error", err);
        //                 } else {
        //                     let imageId = res._id;
        //                     console.log("res:", imageId);
        //                     imageIds.push(imageId);
        //                     if (productInfo.images.length == imageIds.length) {
        //                         productInfo.images = imageIds;
        //                         console.log("update", Id, imageIds);
        //                         Products.update(
        //                             { _id: productId },
        //                             {
        //                                 $set: productInfo,
        //                                 // $set: {
        //                                 //     title: productInfo.title,
        //                                 //     description: productInfo.description,
        //                                 //     contact: productInfo.contact,
        //                                 //     radius: productInfo.radius,
        //                                 //     homeDelivery: productInfo.homeDelivery,
        //                                 //     price: productInfo.price,
        //                                 //     discount: productInfo.discount,
        //                                 //     unit: productInfo.unit,
        //                                 //     website: productInfo.unit,
        //                                 //     sizes: productInfo.unit,
        //                                 //     colors: productInfo.unit,
        //                                 //     qty: productInfo.qty,
        //                                 //     images: imageIds,
        //                                 //     service: productInfo.service,
        //                                 //     serviceOwner: productInfo.serviceOwner,
        //                                 //     availabeQuantity: productInfo.availabeQuantity,
        //                                 //     updateDate: productInfo.updateDate
        //                                 // }
        //                             },
        //                             (err, res) => {
        //                                 if (err) {
        //                                     console.log(err);
        //                                 } else {
        //                                     ServiceImage.remove({
        //                                         _id: { $in: imagesToRemove },
        //                                     });
        //                                     return res;
        //                                 }
        //                             }
        //                         );
        //                     }
        //                 }
        //             },
        //             (proceedAfterUpload = true)
        //         );
        //     } else {
        //         imageIds.push(image._id);
        //         if (productInfo.images.length == imageIds.length) {
        //             productInfo.images = imageIds;
        //             console.log("update existing");
        //             Products.update(
        //                 { _id: productId },
        //                 {
        //                     $set: productInfo,
        //                 },
        //                 (err, res) => {
        //                     ServiceImage.remove({
        //                         _id: { $in: imagesToRemove },
        //                     });
        //                     return res;
        //                 }
        //             );
        //         }
        //     }
        // });
    },

    getSingleService: (Id) => {
        //   return Service.findOne(Id);

        const collection = Service.rawCollection();
        const aggregate = Meteor.wrapAsync(collection.aggregate, collection);
        const defaultRating = { id: "000", avgRate: 1, count: 0 };
        const categoryLookup = {
            from: "MainCategories",
            let: { catId: "$categoryId" },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $eq: ["$subCategories.subCatId", "$$catId"],
                        },
                    },
                },
            ],
            as: "categories",
        };
        const ServiceRatings = {
            from: "ratings",
            let: { serviceId: Id },
            pipeline: [
                { $match: { $expr: { $eq: ["$serviceId", "$$serviceId"] } } },
                {
                    $group: {
                        _id: "$_id",
                        avgRate: { $avg: "$rating.count" },
                        count: { $sum: 1 },
                    },
                },
                { $project: { avgRate: 1, count: 1 } },
            ],
            as: "servRatings",
        };

        const addValues = {
            Rating: {
                $cond: {
                    if: { $eq: ["$servRatings", []] },
                    then: defaultRating,
                    else: { $arrayElemAt: ["$servRatings", 0] },
                },
            },
            category: { $arrayElemAt: ["$categories", 0] },
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
            aggregate(
                [
                    { $match: { _id: Id } },
                    { $lookup: categoryLookup },
                    { $lookup: ServiceRatings },
                    { $addFields: addValues },
                    // {$project: project}
                ],
                { cursor: {} }
            ).toArray(function (err, doc) {
                if (doc) {
                    //   console.log('doc', doc.length,doc)
                }
                done(err, doc);
            });
        });
    },

    getSingleProduct: (Id) => {
        return Products.findOne({
            _id: Id,
        });
    },

    updateViewCount: (productId) => {
        let _product = Products.findOne(productId);
        if (_product) {
            let views = _product.views || 0;
            Products.update(
                { _id: productId },
                {
                    $set: {
                        views: views + 1,
                    },
                }
            );
        }
    },

    getSimilarProduct: (Id) => {
        let product = Products.findOne({ _id: Id });
        return Products.find({
            //service: product.service,
            businessType: product.businessType,
            _id: {
                $ne: Id,
            },
        }).fetch();
    },

    getBusinessNearBy: (obj) => {
        const collection = Business.rawCollection();
        const aggregate = Meteor.wrapAsync(collection.aggregate, collection);
        const defaultRating = { id: "000", avgRate: 1, count: 0 };
        const defaultUser = {
            id: "000",
            profile: { name: "", profileImage: null },
        };

        const OwnerLookup = {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "users",
        };

        const addValues = {
            Owner: {
                $cond: {
                    if: { $eq: ["$users", []] },
                    then: defaultUser,
                    else: { $arrayElemAt: ["$users", 0] },
                },
            },
        };
        const project = {
            _id: 1,
            createdAt: 1,
            createdBy: 1,
            Owner: 1,
            owner: 1,
            businessName: 1,
            description: 1,
            dist: 1,
            email: 1,
            fax: 1,
            isPaid: 1,
            location: 1,
            contact: 1,
            contact1: 1,
            pbox: 1,
            radius: 1,
            website: 1,
            coverImage: 1,
        };
        //  return Category.find().fetch();
        return Async.runSync(function (done) {
            aggregate(
                [
                    {
                        $geoNear: {
                            near: { type: "Point", coordinates: obj.coords },
                            distanceField: "dist.calculated",
                            spherical: true,
                            distanceMultiplier: 0.001,
                        },
                    },
                    { $limit: obj.skip + obj.limit },
                    { $skip: obj.skip },
                    { $lookup: OwnerLookup },
                    { $addFields: addValues },
                    { $project: project }
                ],
                { cursor: {} }
            ).toArray(function (err, doc) {
                if (doc) {
                    //   console.log('doc', doc.length,doc)
                }
                done(err, doc);
            });
        });
    },

    getServicesNearBy: (obj) => {
        const collection = Service.rawCollection();
        const aggregate = Meteor.wrapAsync(collection.aggregate, collection);
        const defaultRating = { id: "000", avgRate: 1, count: 0 };
        const defaultUser = {
            id: "000",
            profile: { name: "", profileImage: null },
        };

        const categoryLookup = {
            from: "MainCategories",
            localField: "categoryId",
            foreignField: "subCategories.subCatId",
            as: "categories",
        };
        const OwnerLookup = {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "users",
        };
        const ServiceRatings = {
            from: "ratings",
            let: { serviceId: "$_id" },
            pipeline: [
                { $match: { $expr: { $eq: ["$serviceId", "$$serviceId"] } } },
                {
                    $group: {
                        _id: "$_id",
                        avgRate: { $avg: "$rating.count" },
                        count: { $sum: 1 },
                    },
                },
                { $project: { avgRate: 1, count: 1 } },
            ],
            as: "servRatings",
        };

        const addValues = {
            Rating: {
                $cond: {
                    if: { $eq: ["$servRatings", []] },
                    then: defaultRating,
                    else: { $arrayElemAt: ["$servRatings", 0] },
                },
            },
            Owner: {
                $cond: {
                    if: { $eq: ["$users", []] },
                    then: defaultUser,
                    else: { $arrayElemAt: ["$users", 0] },
                },
            },
            category: { $arrayElemAt: ["$categories", 0] },
            subCategories: {
                $arrayElemAt: ["$categories.subCategories", 0],
            },
        };
        const project = {
            _id: 1,
            createdAt: 1,
            createdBy: 1,
            Rating: 1,
            Owner: 1,
            owner: 1,
            categoryId: 1,
            title: 1,
            description: 1,
            "category.mainCategory": 1,
            "category.catId": 1,
            "category._id": 1,
            dist: 1,
            email: 1,
            fax: 1,
            isPaid: 1,
            location: 1,
            contact: 1,
            contact1: 1,
            pbox: 1,
            radius: 1,
            website: 1,
            coverImage: 1,
            subCategory: {
                $arrayElemAt: [
                    {
                        $filter: {
                            input: "$subCategories",
                            as: "item",
                            cond: { $eq: ["$$item.subCatId", "$categoryId"] },
                        },
                    },
                    0,
                ],
            },
        };
        //  return Category.find().fetch();
        const query = obj.subCatIds
            ? { categoryId: { $in: obj.subCatIds } }
            : {};
        return Async.runSync(function (done) {
            aggregate(
                [
                    {
                        $geoNear: {
                            near: { type: "Point", coordinates: obj.coords },
                            distanceField: "dist.calculated",
                            query: query,
                            spherical: true,
                            distanceMultiplier: 0.001,
                        },
                    },
                    { $limit: obj.skip + obj.limit },
                    { $skip: obj.skip },
                    { $lookup: categoryLookup },
                    { $lookup: ServiceRatings },
                    { $lookup: OwnerLookup },
                    { $addFields: addValues },
                    { $project: project }
                ],
                { cursor: {} }
            ).toArray(function (err, doc) {
                if (doc) {
                    //   console.log('doc', doc.length,doc)
                }
                done(err, doc);
            });
        });
    },

    getRandomServices: (cordinates, KM, sampleSize) => {
        const match = { 'location.geometry.location': { $geoWithin: { $centerSphere: [cordinates, ((KM * 0.62137119) / 3963.2)] } } };
        const collection = Service.rawCollection();
        const aggregate = Meteor.wrapAsync(collection.aggregate, collection);
        const defaultRating = { id: "000", avgRate: 1, count: 0 };
        const defaultUser = {
            id: "000",
            profile: { name: "", profileImage: null },
        };
        const categoryLookup = {
            from: "MainCategories",
            localField: "categoryId",
            foreignField: "subCategories.subCatId",
            as: "categories",
        };
        const OwnerLookup = {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "users",
        };
        const ServiceRatings = {
            from: "ratings",
            let: { serviceId: "$_id" },
            pipeline: [
                { $match: { $expr: { $eq: ["$serviceId", "$$serviceId"] } } },
                {
                    $group: {
                        _id: "$_id",
                        avgRate: { $avg: "$rating.count" },
                        count: { $sum: 1 },
                    },
                },
                { $project: { avgRate: 1, count: 1 } },
            ],
            as: "servRatings",
        };

        const addValues = {
            Rating: {
                $cond: {
                    if: { $eq: ["$servRatings", []] },
                    then: defaultRating,
                    else: { $arrayElemAt: ["$servRatings", 0] },
                },
            },
            Owner: {
                $cond: {
                    if: { $eq: ["$users", []] },
                    then: defaultUser,
                    else: { $arrayElemAt: ["$users", 0] },
                },
            },
            category: { $arrayElemAt: ["$categories", 0] },
            subCategories: {
                $arrayElemAt: ["$categories.subCategories", 0],
            },
        };
        const project = {
            _id: 1,
            createdAt: 1,
            createdBy: 1,
            Rating: 1,
            Owner: 1,
            owner: 1,
            categoryId: 1,
            title: 1,
            description: 1,
            "category.mainCategory": 1,
            "category.catId": 1,
            "category._id": 1,
            dist: 1,
            email: 1,
            fax: 1,
            isPaid: 1,
            location: 1,
            contact: 1,
            contact1: 1,
            pbox: 1,
            radius: 1,
            website: 1,
            coverImage: 1,
            subCategory: {
                $arrayElemAt: [
                    {
                        $filter: {
                            input: "$subCategories",
                            as: "item",
                            cond: { $eq: ["$$item.subCatId", "$categoryId"] },
                        },
                    },
                    0,
                ],
            },
        };
        //  return Category.find().fetch();
        // const query = obj.subCatIds
        //     ? {categoryId: {$in: obj.subCatIds}}
        //     : {};
        return Async.runSync(function (done) {
            aggregate(
                [
                    // {$match:match},
                    {
                        $geoNear: {
                            near: { type: "Point", coordinates: cordinates },
                            distanceField: "dist.calculated",
                            query: {},
                            spherical: true,
                            distanceMultiplier: 0.001,
                        },
                    },
                    { $limit: 100 },
                    { $sample: { size: sampleSize } },
                    { $lookup: categoryLookup },
                    { $lookup: ServiceRatings },
                    { $lookup: OwnerLookup },
                    { $addFields: addValues },
                    { $project: project }
                ],
                { cursor: {} }
            ).toArray(function (err, doc) {
                if (doc) {
                    //   console.log('doc', doc.length,doc)
                }
                done(err, doc);
            });
        });
    },

    getMyServices: () => {
        const collection = Service.rawCollection();
        const aggregate = Meteor.wrapAsync(collection.aggregate, collection);
        const defaultRating = { id: "000", avgRate: 1, count: 0 };
        const categoryLookup = {
            from: "MainCategories",
            let: { catId: "$categoryId" },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $eq: ["$subCategories.subCatId", "$$catId"],
                        },
                    },
                },
            ],
            as: "categories",
        };

        const ServiceRatings = {
            from: "ratings",
            let: { serviceId: "$_id" },
            pipeline: [
                { $match: { $expr: { $eq: ["$serviceId", "$$serviceId"] } } },
                {
                    $group: {
                        _id: "$_id",
                        avgRate: { $avg: "$rating.count" },
                        count: { $sum: 1 },
                    },
                },
                { $project: { avgRate: 1, count: 1 } },
            ],
            as: "servRatings",
        };

        const addValues = {
            Rating: {
                $cond: {
                    if: { $eq: ["$servRatings", []] },
                    then: defaultRating,
                    else: { $arrayElemAt: ["$servRatings", 0] },
                },
            },
            category: { $arrayElemAt: ["$categories", 0] },
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
            let loggedUser = Meteor.userId() || "NA";
            aggregate(
                [
                    {
                        $match: { owner: loggedUser },
                    },
                    { $lookup: categoryLookup },
                    { $lookup: ServiceRatings },
                    { $addFields: addValues },
                    // {$limit: obj.skip + obj.limit},
                    // {$skip: obj.skip},
                    // {$project: project}
                ],
                { cursor: {} }
            ).toArray(function (err, doc) {
                if (doc) {
                    //   console.log('doc', doc.length,doc)
                }
                done(err, doc);
            });
        });
    },

    // 'getMyProducts': () => {
    //     let loggedUser = Meteor.userId() || "NA";
    //     return Products.find({serviceOwner: loggedUser}, {sort: {createDate: -1}}).fetch();
    // },

    // getPopularProducts(_skip = 0, _limit = 0) {
    //     return Products.find({}, {sort: {views: -1}, skip: _skip, limit: _limit}).fetch();
    // },

    getPopularProducts(_skip = 0, _limit = 0) {
        let loggedUser = Meteor.userId();
        const collection = Products.rawCollection();
        const aggregate = Meteor.wrapAsync(collection.aggregate, collection);

        // const OwnerLookup = {
        //     from: "service",
        //     localField: "service",
        //     foreignField: "_id",
        //     as: "services",
        // };
        const BusinessLookup = {
            from: "business",
            localField: "businessType",
            foreignField: "businessTypes",
            as: "business",
        };
        const addValues = {
            Service: { $arrayElemAt: ["$services", 0] },
        };
        return Async.runSync(function (done) {
            aggregate(
                [
                    { $sort: { views: -1 } },
                    { $lookup: BusinessLookup },
                    { $addFields: addValues },
                    { $limit: _skip + _limit },
                    { $skip: _skip },
                ],
                { cursor: {} }
            ).toArray(function (err, doc) {
                if (doc) {
                    //   console.log('doc', doc.length,doc)
                }
                done(err, doc);
            });
        });
    },

    getMyProducts(userId) {
        let loggedUser = userId === null ? Meteor.userId() || "NA" : userId;
        const collection = Products.rawCollection();
        const aggregate = Meteor.wrapAsync(collection.aggregate, collection);

        // const OwnerLookup = {
        //     from: "users",
        //     localField: "owner",
        //     foreignField: "_id",
        //     as: "users",
        // };
        const BusinessLookup = {
            from: "business",
            localField: "businessType",
            foreignField: "businessTypes",
            as: "business",
        };
        const addValues = {
            Owner: { $arrayElemAt: ["$users", 0] },
        };
        return Async.runSync(function (done) {
            aggregate(
                [
                    // {
                    //     $match: { ServiceOwner: loggedUser },
                    // },
                    { $lookup: BusinessLookup },
                    { $addFields: addValues },
                    { $sort: { createDate: -1 } },
                ],
                { cursor: {} }
            ).toArray(function (err, doc) {
                if (doc) {
                    //   console.log('doc', doc.length,doc)
                }
                done(err, doc);
            });
        });
    },

    geOwnServiceList: () => {
        let loggedUser = Meteor.userId() || "NA";
        return Service.find(
            { owner: loggedUser },
            {
                sort: { createDate: -1 },
                fields: { _id: 1, title: 1, owner: 1, businessType: 1, location: 1, Category: 1 },
            }
        ).fetch();
    },

    getPopularResturants: () => {
        return Service.find({ businessType: BusinessType.RESTURANT }, { sort: { views: -1 }, limit: 3 }).fetch();
    },
    updateServiceViewCount: (serviceId) => {
        let _service = Service.findOne(serviceId);
        if (_service) {
            let views = _service.views || 0;
            Service.update(
                { _id: serviceId },
                {
                    $set: {
                        views: views + 1,
                    },
                }
            );
        }
    },

    removeService: (Id) => {
        let _service = Service.findOne(Id);
        Service.remove(Id);
        removeProductsByServiceId(Id);
        ServiceImage.remove(_service.coverImage);
    },

    removeProduct: (Id) => {
        let _product = Products.findOne(Id);
        Products.remove(Id);
        _product.images.foreach((item) => {
            ServiceImage.remove(item);
        });
    },


    searchService: (obj) => {
        console.log(obj);
        const collection = Service.rawCollection();
        const aggregate = Meteor.wrapAsync(collection.aggregate, collection);
        const defaultRating = { id: "000", avgRate: 1, count: 0 };
        const defaultUser = {
            id: "000",
            profile: { name: "", profileImage: null },
        };
        const categoryLookup = {
            from: "MainCategories",
            localField: "categoryId",
            foreignField: "subCategories.subCatId",
            as: "categories",
        };
        const OwnerLookup = {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "users",
        };
        const ServiceRatings = {
            from: "ratings",
            let: { serviceId: "$_id" },
            pipeline: [
                { $match: { $expr: { $eq: ["$serviceId", "$$serviceId"] } } },
                {
                    $group: {
                        _id: "$_id",
                        avgRate: { $avg: "$rating.count" },
                        count: { $sum: 1 },
                    },
                },
                { $project: { avgRate: 1, count: 1 } },
            ],
            as: "servRatings",
        };

        const addValues = {
            Rating: {
                $cond: {
                    if: { $eq: ["$servRatings", []] },
                    then: defaultRating,
                    else: { $arrayElemAt: ["$servRatings", 0] },
                },
            },
            Owner: {
                $cond: {
                    if: { $eq: ["$users", []] },
                    then: defaultUser,
                    else: { $arrayElemAt: ["$users", 0] },
                },
            },
            category: { $arrayElemAt: ["$categories", 0] },
            subCategories: {
                $arrayElemAt: ["$categories.subCategories", 0],
            },
        };
        const project = {
            _id: 1,
            createdAt: 1,
            createdBy: 1,
            Rating: 1,
            Owner: 1,
            owner: 1,
            categoryId: 1,
            title: 1,
            description: 1,
            "category.mainCategory": 1,
            "category.catId": 1,
            "category._id": 1,
            dist: 1,
            email: 1,
            fax: 1,
            isPaid: 1,
            location: 1,
            contact: 1,
            contact1: 1,
            pbox: 1,
            radius: 1,
            website: 1,
            coverImage: 1,
            subCategory: {
                $arrayElemAt: [
                    {
                        $filter: {
                            input: "$subCategories",
                            as: "item",
                            cond: { $eq: ["$$item.subCatId", "$categoryId"] },
                        },
                    },
                    0,
                ],
            },
        };
        //  return Category.find().fetch();
        const query = obj.subCatIds
            ? { $text: { $search: obj.searchValue }, categoryId: { $in: obj.subCatIds } }
            : { $text: { $search: obj.searchValue } };
        return Async.runSync(function (done) {
            aggregate(
                [
                    { $match: query },
                    { $sort: { titleScore: { $meta: "textScore" } } },
                    { $limit: 20 },
                    { $skip: 0 },
                    { $lookup: categoryLookup },
                    { $lookup: ServiceRatings },
                    { $lookup: OwnerLookup },
                    { $addFields: addValues },
                    { $project: project }
                ],
                {
                    cursor: {}
                }
            ).toArray(function (err, doc) {
                if (doc) {
                    //   console.log('doc', doc.length,doc)
                }
                done(err, doc);
            });
        });
    },

    searchBusiness: (obj) => {
        const collection = Business.rawCollection();
        const aggregate = Meteor.wrapAsync(collection.aggregate, collection);
        const defaultRating = { id: "000", avgRate: 1, count: 0 };
        const defaultUser = {
            id: "000",
            profile: { name: "", profileImage: null },
        };

        const OwnerLookup = {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "users",
        };
        const ServiceRatings = {
            from: "ratings",
            let: { serviceId: "$_id" },
            pipeline: [
                { $match: { $expr: { $eq: ["$serviceId", "$$serviceId"] } } },
                {
                    $group: {
                        _id: "$_id",
                        avgRate: { $avg: "$rating.count" },
                        count: { $sum: 1 },
                    },
                },
                { $project: { avgRate: 1, count: 1 } },
            ],
            as: "servRatings",
        };

        const addValues = {
            Rating: {
                $cond: {
                    if: { $eq: ["$servRatings", []] },
                    then: defaultRating,
                    else: { $arrayElemAt: ["$servRatings", 0] },
                },
            },
            Owner: {
                $cond: {
                    if: { $eq: ["$users", []] },
                    then: defaultUser,
                    else: { $arrayElemAt: ["$users", 0] },
                },
            },
        };
        const project = {
            _id: 1,
            createdAt: 1,
            createdBy: 1,
            Rating: 1,
            Owner: 1,
            owner: 1,
            businessName: 1,
            description: 1,
            dist: 1,
            email: 1,
            fax: 1,
            isPaid: 1,
            location: 1,
            contact: 1,
            contact1: 1,
            pbox: 1,
            radius: 1,
            website: 1,
            coverImage: 1,
        };
        //  return Category.find().fetch();
        const query = { $text: { $search: obj.searchValue } };
        return Async.runSync(function (done) {
            aggregate(
                [
                    { $match: query },
                    { $sort: { titleScore: { $meta: "textScore" } } },
                    { $limit: 20 },
                    { $skip: 0 },
                    { $lookup: ServiceRatings },
                    { $lookup: OwnerLookup },
                    { $addFields: addValues },
                    { $project: project }
                ],
                {
                    cursor: {}
                }
            ).toArray(function (err, doc) {
                if (doc) {
                    //   console.log('doc', doc.length,doc)
                }
                done(err, doc);
            });
        });
    },

    searchProducts: (searchValue) => {
        const collection = Products.rawCollection();
        const aggregate = Meteor.wrapAsync(collection.aggregate, collection);

        const OwnerLookup = {
            from: "business",
            localField: "businessType",
            foreignField: "businessTypes",
            as: "business",
        };
        const addValues = {
            Business: { $arrayElemAt: ["$business", 0] },
        };
        return Async.runSync(function (done) {
            aggregate(
                [
                    { $match: { $text: { $search: searchValue } } },
                    { $sort: { titleScore: { $meta: "textScore" } } },
                    { $limit: 20 },
                    { $skip: 0 },
                    { $lookup: OwnerLookup },
                    { $addFields: addValues },

                ],
                { cursor: {} }
            ).toArray(function (err, doc) {
                if (doc) {
                    //   console.log('doc', doc.length,doc)
                }
                done(err, doc);
            });
        });
    },


    searchCategories: (searchValue) => {
        const collection = Categories.rawCollection();
        const aggregate = Meteor.wrapAsync(collection.aggregate, collection);

        const OwnerLookup = {
            from: "service",
            localField: "service",
            foreignField: "_id",
            as: "services",
        };
        const addValues = {
            Service: { $arrayElemAt: ["$services", 0] },
        };
        return Async.runSync(function (done) {
            aggregate(
                [
                    { $match: { $text: { $search: searchValue } } },
                    { $sort: { titleScore: { $meta: "textScore" } } },
                    { $limit: 20 },
                    { $skip: 0 },
                    { $lookup: OwnerLookup },
                    { $addFields: addValues },

                ],
                { cursor: {} }
            ).toArray(function (err, doc) {
                if (doc) {
                    //   console.log('doc', doc.length,doc)
                }
                done(err, doc);
            });
        });
    }
})
    ;