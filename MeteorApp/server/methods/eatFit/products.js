import { Meteor } from 'meteor/meteor';
import { EFProducts, EFOrder } from "../../../lib/collections/eatFit/efProducts";
import { ProductOwner, Product } from "../../../lib/utils";
import { FIREBASE_MESSAGING } from "../../API/fire-base-admin";

Meteor.methods({
    'addNewProductEF': (productInfo) => {
        try {
            productInfo.productOwner = ProductOwner.EAT_FIT;
            console.log('addNewProduEF:::=>>>', productInfo._id);
            var currentUserId = Meteor.userId();
            productInfo.createdBy = currentUserId,
                productInfo.createDate = new Date(new Date().toUTCString())
            let imageIds = [];
            if (productInfo.images) {
                productInfo.images.forEach(image => {
                    // console.log(image.name,image.type,image.data)
                    let Id = moment().format('DDMMYYx');
                    EFProductImages.write(new Buffer(image.data, 'base64'),
                        {
                            fileName: image.name,
                            type: image.type
                        },
                        (err, res) => {
                            if (err) {
                                console.log('error', err)
                            }
                            else {
                                const imageId = res._id.toString()
                                console.log('res:', imageId);

                                imageIds.push(imageId);
                                if (productInfo.images.length === imageIds.length) {
                                    productInfo.images = imageIds;
                                    console.log('insert');
                                    let Id = EFProducts.insert(productInfo);
                                    const notification = {
                                        title: 'New Product by- EAT-FIT',
                                        description: productInfo.title,
                                        owner: currentUserId,
                                        productOwner: ProductOwner.EAT_FIT,
                                        navigateId: Id,
                                        receiver: [],
                                        removedBy: [],
                                        type: NotificationTypes.ADD_PRODUCT
                                    };
                                    Meteor.call('addNotification', notification);
                                    try {
                                        FIREBASE_MESSAGING.notificationToAll("newPoductStaging", `New Product by - EAT-FIT`, productInfo.title, {
                                            Id: Id,
                                            navigate: "true",
                                            route: "ProductDetailEF",
                                            image: productInfo.images[0],
                                            //  icon:_service.coverImage
                                        })
                                    } catch (e) {
                                        throw new Meteor.Error(403, e.message);
                                    }
                                    return Id;
                                }
                            }
                        }, proceedAfterUpload = true)
                })
            }
            else {
                productInfo.images = [];
                console.log('insert');
                let Id = EFProducts.insert(productInfo);
                const notification = {
                    title: 'New Product by- EAT-FIT',
                    description: productInfo.title,
                    owner: Meteor.userId(),
                    productOwner: ProductOwner.EAT_FIT,
                    navigateId: Id,
                    receiver: [],
                    removedBy: [],
                    type: NotificationTypes.ADD_PRODUCT
                };
                Meteor.call('addNotification', notification);
                try {
                    FIREBASE_MESSAGING.notificationToAll("newPoductStaging", `New Product by - EAT-FIT`, productInfo.title, {
                        Id: Id,
                        navigate: "true",
                        route: "ProductDetailEF",
                    })
                } catch (e) {
                    throw new Meteor.Error(403, e.message);
                }
                return Id;
            }

        }
        catch (e) {
            console.log(e.message);
            throw new Meteor.Error(403, e.message)

        }
    },

    'EFProductsByCategory': (_categoryId) => {
        return EFProducts.find({ category: _categoryId }, { sort: { views: -1 } }).fetch();
    },

    'getSingleProductEF': (Id) => {
        return EFProducts.findOne({ _id: Id });
    },
    'getSimilarProductEF': (Id) => {
        let cat = EFProducts.findOne({ _id: Id }).category;
        return EFProducts.find({ category: cat, _id: { $ne: Id } }, { sort: { views: -1 } }).fetch();
    },

    'updateViewCountEF': (productId) => {
        let _product = EFProducts.findOne(productId);
        if (_product) {
            let views = _product.views || 0;
            EFProducts.update({ _id: productId }, {
                $set: {
                    views: views + 1
                }
            });
        }
    },
    'addOrderEF': (order, isOrder) => {
        order.orderDate = new Date(new Date().toUTCString());
        order.owner = Meteor.userId();
        order.productOwner = ProductOwner.EAT_FIT;
        order.status = 0;
        let itemsUpdated = [];
        return Async.runSync(function (done) {
            order.items.forEach(async (item, index) => {
                let product = await EFProducts.findOne({ _id: item.productId });
                // if (product.availabeQuantity >= item.quantity) {
                //   //  await Products.update({_id: item.productId}, {$set: {'availabeQuantity': product.availabeQuantity - item.quantity}});
                //     if (isOrder === 0) {
                //         await Cart.remove({_id: item.cartItem});
                //     }
                //     itemsUpdated.push(item);
                // }
                // else {
                //     console.log('No sufficient Available Quantity for product:' + item.title);
                // }
                console.log('this is index ' + index);
                if (index === order.items.length - 1) {
                    order.items = order.items;
                    let loggedUser = Meteor.user();
                    order.owner = loggedUser ? loggedUser._id : null;
                    EFOrder.insert(order, (err, res) => {
                        if (res) {
                            // let notification = {
                            //     title: 'Order is placed ',
                            //     description: product.productTitle,
                            //     owner: order.owner ? order.owner : loggedUser._id,
                            //     navigateId: res,
                            //     receiver: product.owner,
                            //     type: NotificationTypes.ORDER_PRODUCT
                            // }
                            // Meteor.call('addNotification', notification);
                            //return res;
                            done(err, res);
                        } else {
                            return err;
                        }
                    })
                }
            });

        });

    },

    'WishListItemsEF': (wishList) => {
        try {
            let EFProductss = EFProducts.find({ _id: { $in: wishList } }, { $sort: { views: -1 } }).fetch();

            const collection = Products.rawCollection();
            const aggregate = Meteor.wrapAsync(collection.aggregate, collection);
            const BusinessLookup = {
                from: "business",
                localField: "businessType",
                foreignField: "businessTypes",
                as: "business",
            };

            return Async.runSync(function (done) {
                aggregate(
                    [
                        { $match: {_id : { $in: wishList }}},
                        // { $match: { $expr: { $in: ["$serviceId", "$$serviceId"] } } },
                        { $sort: { views: -1 } },
                        { $lookup: BusinessLookup },
                    ],
                    { cursor: {} }
                ).toArray(function (err, doc) {
                    if (doc) {
                        //   console.log('doc', doc.length,doc)
                    }
                    done(err, EFProductss.concat(doc));
                });
            });
            // let RProducts = Products.find({ _id: { $in: wishList } }, { $sort: { views: -1 } }).fetch();
            // return Async.runSync(function (done) {
            //     done(null, EFProductss.concat(RProducts));
            // });

        }
        catch (e) {
            console.log(e.message);
        }
    },

    'getOrdersEF': (deviceId) => {
        let userId = Meteor.userId() ? Meteor.userId() : undefined;
        return EFOrder.find({ $or: [{ owner: userId }, { deviceId: deviceId }] }).fetch()
    },


    'getEFProductOrderForAdmin': () => {
        const collection = EFOrder.rawCollection();
        const aggregate = Meteor.wrapAsync(collection.aggregate, collection);
        const pipeline = [
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "orderedBy"
                }
            },
            {
                $addFields: {
                    OrderBy: {
                        $arrayElemAt: ["$orderedBy", 0]
                    },
                },
            },
            { $sort: { "orderDate": -1 } },
            {
                $project: {
                    _id: 1,
                    contact: 1,
                    totalPrice: 1,
                    items: 1,
                    PaymentType: 1,
                    orderDate: 1,
                    owner: 1,
                    status: 1,
                    transactionId: 1,
                    OrderBy: 1,
                    esewaDetail: 1,
                }
            }

        ];
        return Async.runSync(function (done) {
            aggregate(pipeline, { cursor: {} }).toArray(function (err, doc) {
                if (doc) {
                    // console.log(doc)
                }
                done(err, doc);
            });
        });
    },
    'updateOrderStatusEF': (Id, status) => {
        let loggedUser = Meteor.user();
        let order = EFOrder.findOne({ _id: Id });
        EFOrder.update({ _id: Id },
            {
                $set: { status: status }
            }, (err, res) => {
                if (err) {
                    return err
                } else {
                    // let notification = {
                    //     title: 'Order Status Change By ' + loggedUser.profile.name,
                    //     description: order._id,
                    //     owner: loggedUser._id,
                    //     navigateId: order._id,
                    //     receiver: order.owner,
                    //     type: status
                    // }
                    // Meteor.call('addNotification', notification);
                }
            })
    },

    'removeProductEF': (Id) => {
        EFProducts.remove(Id);
    },

    'getStoreCategoriesWise': (categoryId) => {
        try {
            let subCategoryId = [];
            let category = Categories.findOne({ _id: categoryId });
            category.subCategories.forEach((item) => {
                subCategoryId.push(item._id);
            });

            let business = Business.find({ selectedCategory: { $in: subCategoryId } }).fetch();

            return business;

        }
        catch (e) {
            console.log(e.message);
        }
    },

    'getproductStoreWise': (id) => {
        let product = Product.find({ owner: id }).fetch();
        return product;
    }
})