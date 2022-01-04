import { Meteor } from "meteor/meteor";
import { ProductOwner, OrderStatus, NotificationTypes } from "../../lib/utils";
import { EFProducts, EFOrder } from "../../lib/collections/eatFit/efProducts";
import { ROrder } from "../../lib/collections/orders";

Meteor.methods({
    addOrder: (order) => {
        order.orderDate = new Date(new Date().toUTCString());
        order.owner = Meteor.userId();
        order.status = 0;
        order.orderId = moment().format("YYMMDDHHmmss");
        let itemsUpdated = [];
        let EFTotal = 0;
        let RTotal = 0;
        let EFItems = [];
        let RegularItems = [];
        let ServiceProviders = [];
        let searchTextEF = order.orderId + " " + Meteor.user().profile.name;
        let searchText = order.orderId + " " + Meteor.user().profile.name;
        return Async.runSync(function (done) {
            order.items.forEach(async (item, index) => {
                let product = null;

                //Seperate items based on Product Owner
                if (item.productOwner === ProductOwner.EAT_FIT) {
                    product = await EFProducts.findOne({ _id: item.productId });
                    EFItems.push(item);
                    searchText = searchTextEF + " " + product.title
                    EFTotal = EFTotal + item.finalPrice * item.quantity;
                } else {
                    product = await Products.findOne({ _id: item.productId });
                    RegularItems.push(item);
                    searchText = searchText + " " + product.title
                    ServiceProviders.push(product.serviceOwner);
                    RTotal = RTotal + item.finalPrice * item.quantity;
                }

                if (product.productOwner !== ProductOwner.EAT_FIT) {
                    // if (product.availabeQuantity >= item.quantity) {
                    if (item.quantity) {
                        await Products.update(
                            { _id: item.productId },
                            {
                                $set: {
                                    availabeQuantity:
                                        product.availabeQuantity -
                                        item.quantity,
                                },
                            }
                        );
                        // if (isOrder === 0) {
                        //     //  await Cart.remove({_id: item.cartItem});
                        // }
                        itemsUpdated.push(item);
                    } else {
                        resetOrderQty(itemsUpdated);
                        // throw new Meteor.Error(
                        //     "",
                        //     "Insufficient Available Quantity for product:" +
                        //         item.title +
                        //         ". Available Quantity=" +
                        //         product.availabeQuantity +
                        //         " " +
                        //         product.unit +
                        //         ". Please re-adjust quantity"
                        // );
                        done({
                            message: "Insufficient Available Quantity for product:" +
                                item.title +
                                ". Available Quantity=" +
                                product.availabeQuantity +
                                " " +
                                product.unit +
                                ". Please re-adjust quantity"
                        }, null);
                        console.log(
                            "No sufficient Available Quantity for product:" +
                            item.title
                        );
                    }
                }
                if (index === order.items.length - 1) {
                    let orderIds = [];
                    let loggedUser = Meteor.user();
                    order.owner = loggedUser ? loggedUser._id : null;
                    if (EFItems.length > 0) {
                        order.items = EFItems;
                        order.totalPrice = EFTotal;
                        order.productOwner = ProductOwner.EAT_FIT;
                        order.searchText = searchTextEF;
                        EFOrder.insert(order, (err, res) => {
                            if (res) {
                                // let notification = {
                                //     title: 'Order is placed ',
                                //     description: product.productTitle,
                                //     owner: order.owner ? order.owner : loggedUser._id,
                                //     navigateId: res,
                                //     receiver:ServiceProviders,
                                //     type: NotificationTypes.ORDER_REQUESTED,
                                //     receiver: [],
                                //     removedBy: [],
                                // }
                                // Meteor.call('addNotification', notification);
                                orderIds.push(res);
                                console.log('This is order Ids' + orderIds);
                                return res;
                            } else {
                                resetOrderQty(itemsUpdated);
                                return err;
                            }
                        });
                    }
                    if (RegularItems.length > 0) {
                        order.items = RegularItems;
                        order.totalPrice = RTotal;
                        order.productOwner = ProductOwner.REGULAR_USERS;
                        order.searchText = searchText;
                        ROrder.insert(order, (err, res) => {
                            if (res) {
                                let notification = {
                                    title: 'Order is placed ',
                                    description: product.productTitle,
                                    owner: order.owner ? order.owner : loggedUser._id,
                                    navigateId: res,
                                    receiver: ServiceProviders,
                                    type: NotificationTypes.ORDER_REQUESTED,
                                    receiver: [],
                                    removedBy: [],
                                }
                                Meteor.call('addNotification', notification);
                                orderIds.push(res);
                            } else {
                                resetOrderQty(itemsUpdated);
                                return err;
                            }
                        });
                    }
                    //done(null, orderIds);
                    return Async.runSync(function (done) {
                        done(null, orderIds);
                    })
                }
            });
        });
    },

    removeOrder: (orderIds) => {
        let EFOrders = EFOrder.find({ _id: { $in: orderIds } }).fetch();
        let ROrders = ROrder.find({ _id: { $in: orderIds } }).fetch();

        EFOrders.forEach((order) => {
            //  resetOrderQty(order.items);
            EFOrder.remove({ _id: order._id });
        });

        ROrders.forEach((order) => {
            resetOrderQty(order.items);
            ROrder.remove({ _id: order._id });
        });

        // const order = Order.findOne({_id: Id})
        // resetOrderQty(order.items);
        // Order.remove({_id: Id})
    },

    getOrders: (deviceId) => {
        let userId = Meteor.userId() ? Meteor.userId() : undefined;
        try {
            let EFOrderss = EFOrder.find({
                $or: [{ owner: userId }, { deviceId: deviceId }],
            }).fetch();
            let ROrders = ROrder.find({
                $or: [{ owner: userId }, { deviceId: deviceId }],
            }).fetch();
            return Async.runSync(function (done) {
                done(null, EFOrderss.concat(ROrders));
            });
        } catch (e) {
            console.log(e.message);
        }
    },

    getMyOrders: () => {
        let userId = Meteor.userId();
        try {
            return ROrder.find({ "items.serviceOwner": userId }).fetch();
        } catch (e) {
            console.log(e.message);
            //   return new Meteor.Error('',e.reason)
        }
    },

    getSingleOrder(id) {
        const collection = ROrder.rawCollection();
        const aggregate = Meteor.wrapAsync(collection.aggregate, collection);

        const pipeline = [
            {
                $match: { _id: id },
            },
            {
                $lookup: {
                    from: "service",
                    localField: "items.service",
                    foreignField: "_id",
                    as: "Services",
                },
            },
        ];
        return Async.runSync(function (done) {
            aggregate(pipeline, { cursor: {} }).toArray(function (err, doc) {
                if (doc) {
                    //   console.log('doc', doc.length,doc)
                }
                done(err, doc[0]);
            });
        });

        // return ROrder.findOne({_id:id});
    },

    updateOrderStatus: (Id, status) => {
        let loggedUser = Meteor.user();
        let order = ROrder.findOne({ _id: Id });
        order.items.forEach((item) => {
            if (item.serviceOwner === loggedUser._id) {
                item.status = status;
                item.lastUpdated = new Date(new Date().toUTCString());
            }
        });
        ROrder.update(
            { _id: Id },
            {
                $set: { items: order.items, status: status },
            },
            (err, res) => {
                if (err) {
                    return err;
                } else {
                    if (
                        status == OrderStatus.ORDER_CANCELLED ||
                        status == OrderStatus.ORDER_DECLINED
                    ) {
                        resetOrderQty(order.items);
                    }
                    let notification = {
                        title:
                            "Order Status Change By " + loggedUser.profile.name,
                        description: order._id,
                        owner: loggedUser._id,
                        navigateId: order._id,
                        receiver: [order.owner],
                        type: status,
                        removedBy: [],
                        seenBy: [],
                    };
                    Meteor.call("addNotification", notification);
                }
            }
        );
    },

    cancelOrder: (Id, productOwner, deviceId) => {
        console.log(Id, productOwner, deviceId);
        let loggedUser = Meteor.user() ? Meteor.user() : { _id: null };
        let success = false;
        let ServiceOwners = [];
        if (productOwner == ProductOwner.EAT_FIT) {
            EFOrder.update(
                { _id: Id },
                { $set: { status: OrderStatus.ORDER_CANCELLED } }
            );
        } else {
            let order = ROrder.findOne({ _id: Id });
            if (order.deviceId === deviceId || order.owner === loggedUser._id) {
                order.items.forEach((item) => {
                    item.status = OrderStatus.ORDER_CANCELLED;
                    ServiceOwners.push(item.serviceOwner)
                    item.lastUpdated = new Date(new Date().toUTCString());
                });
            } else {
                throw new Meteor.Error("", "Un-Authorized");
            }
            ROrder.update(
                { _id: Id },
                {
                    $set: {
                        items: order.items,
                        status: OrderStatus.ORDER_CANCELLED,
                    },
                },
                (err, res) => {
                    if (err) {
                        return err;
                    } else {
                        resetOrderQty(order.items);
                        let notification = {
                            title:
                                "Order Cancelled By " + loggedUser.profile.name,
                            description: Id,
                            owner: loggedUser._id,
                            navigateId: order._id,
                            receiver: ServiceOwners,
                            type: status,
                            removedBy: [],
                            seenBy: [],
                        };
                        Meteor.call("addNotification", notification);
                    }
                }
            );
        }
    },


    searchOrder: (_search, deviceId) => {
        let userId = Meteor.userId() ? Meteor.userId() : undefined;
        try {
            let EFOrderss = EFOrder.find({
                $and: [
                    { $or: [{ owner: userId }, { deviceId: deviceId }] },
                    { searchText: { $regex: _search, $options: 'i' } }
                ],
            }).fetch();
            let ROrders = ROrder.find({
                $and: [
                    { $or: [{ owner: userId }, { deviceId: deviceId }] },
                    { ordersearchTextId: { $regex: _search, $options: 'i' } }
                ]
            }).fetch();
            return Async.runSync(function (done) {
                done(null, EFOrderss.concat(ROrders));
            });
        } catch (e) {
            console.log(e.message);
        }
    },

    searchMyOrders: (_searchText) => {
        let userId = Meteor.userId();
        try {
            return ROrder.find({ $and: [{ "items.serviceOwner": userId }, { searchText: { $regex: _search, $options: 'i' } }] }).fetch();
        } catch (e) {
            console.log(e.message);
            //   return new Meteor.Error('',e.reason)
        }
    },

    getProductOrderForAdmin: () => {
        console.log(Meteor.userId());
        const collection = ROrder.rawCollection();
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
                    Id: 1,
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
                    shippingCharge: 1
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


});

resetOrderQty = (Items) => {
    let userId = Meteor.userId();
    Items.forEach(async (item) => {
        // if (item.productOwner === ProductOwner.EAT_FIT) {
        //     let prod = await EFProducts.findOne({_id: item.productId});
        //     await  EFProducts.update({_id: item.productId}, {
        //         $set: {
        //             'availabeQuantity': prod.availabeQuantity + item.quantity
        //         }
        //     })
        // }
        // else {
        let prod = await Products.findOne({ _id: item.productId });
        if (prod.serviceOwner === userId) {
            await Products.update(
                { _id: item.productId },
                {
                    $set: {
                        availabeQuantity: prod.availabeQuantity + item.quantity,
                    },
                }
            );
        }
        // }
    });


};