import {Meteor} from 'meteor/meteor';
import {ProductOwner, OrderStatus} from "../../lib/utils";
import {EFProducts, EFOrder} from "../../lib/collections/eatFit/efProducts";
import {ROrder} from "../../lib/collections/orders";

Meteor.methods({
    'addOrder': (order) => {
        order.orderDate = new Date(new Date().toUTCString());
        order.owner = Meteor.userId();
        order.status = 0;
        let itemsUpdated = [];
        let EFTotal = 0;
        let RTotal = 0;
        let EFItems = [];
        let RegularItems = [];
        return Async.runSync(function (done) {
            order.items.forEach(async (item, index) => {
                let product = null;

                //Seperate items based on Product Owner
                if (item.productOwner === ProductOwner.EAT_FIT) {
                    product = await EFProducts.findOne({_id: item.productId});
                    EFItems.push(item);
                    EFTotal = EFTotal + item.finalPrice;
                }
                else {
                    product = await Products.findOne({_id: item.productId});
                    RegularItems.push(item)
                    RTotal = RTotal + item.finalPrice;
                }

                if (product.productOwner !== ProductOwner.EAT_FIT) {
                    if (product.availabeQuantity >= item.quantity) {
                        await Products.update({_id: item.productId}, {$set: {'availabeQuantity': product.availabeQuantity - item.quantity}});
                        // if (isOrder === 0) {
                        //     //  await Cart.remove({_id: item.cartItem});
                        // }
                        itemsUpdated.push(item);
                    }
                    else {
                        resetOrderQty(itemsUpdated);
                        throw new Meteor.Error('', "Insufficient Available Quantity for product:" + item.title + ". Available Quantity=" + product.availabeQuantity + " " + product.unit + ". Please re-adjust quantity");
                        console.log('No sufficient Available Quantity for product:' + item.title);
                    }
                }
                console.log('this is index ' + index);
                if (index === order.items.length - 1) {
                    let orderIds = [];
                    let loggedUser = Meteor.user();
                    order.owner = loggedUser ? loggedUser._id : null;
                    if (EFItems.length > 0) {
                        order.items = EFItems;
                        order.totalPrice = EFTotal;
                        order.productOwner = ProductOwner.EAT_FIT;
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
                                orderIds.push(res)
                            } else {
                                resetOrderQty(itemsUpdated);
                                return err;
                            }
                        })
                    }

                    if (RegularItems.length > 0) {
                        order.items = RegularItems;
                        order.totalPrice = RTotal;
                        order.productOwner = ProductOwner.REGULAR_USERS;
                        ROrder.insert(order, (err, res) => {
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
                                // done(err, res);
                                orderIds.push(res)
                            } else {
                                resetOrderQty(itemsUpdated);
                                return err;
                            }
                        })
                    }
                    done(null, orderIds);
                }
            });

        });
    },


    'removeOrder': (orderIds) => {
        let EFOrders = EFOrder.find({_id: {$in: orderIds}}).fetch();
        let ROrders = ROrder.find({_id: {$in: orderIds}}).fetch();

        EFOrders.forEach(order => {
            //  resetOrderQty(order.items);
            EFOrder.remove({_id: order._id})
        });

        ROrders.forEach(order => {
            resetOrderQty(order.items);
            ROrder.remove({_id: order._id})
        })

        // const order = Order.findOne({_id: Id})
        // resetOrderQty(order.items);
        // Order.remove({_id: Id})
    },

    'getOrders': (deviceId) => {
        let userId = Meteor.userId() ? Meteor.userId() : undefined;
        try {
            let EFOrderss = EFOrder.find({$or: [{owner: userId}, {deviceId: deviceId}]}).fetch();
            let ROrders = ROrder.find({$or: [{owner: userId}, {deviceId: deviceId}]}).fetch();
            return Async.runSync(function (done) {
                done(null, EFOrderss.concat(ROrders));
            });

        }
        catch (e) {
            console.log(e.message);
        }
    },

    'getMyOrders': () => {
        let userId = Meteor.userId();
        try {
            return ROrder.find({'items.serviceOwner': userId}).fetch();
        }
        catch (e) {
            console.log(e.message);
            //   return new Meteor.Error('',e.reason)
        }
    },

    getSingleOrder(id) {
        return ROrder.findOne(id);
    },

    'updateOrderStatus': (Id, status) => {
        let loggedUser = Meteor.user();
        let order = ROrder.findOne({_id: Id});
        order.items.forEach(item => {
            if (item.serviceOwner === userId) {
               item.status=status;
               item.lastUpdated=new Date(new Date().toUTCString());
            }
        });

        ROrder.update({_id: Id},
            {
                $set: {items: order.items,status:status}
            }, (err, res) => {
                if (err) {
                    return err
                } else {
                    if (status == OrderStatus.ORDER_CANCELLED) {
                        resetOrderQty(order.items);
                    }
                    let notification = {
                        title: 'Order Status Change By ' + loggedUser.profile.name,
                        description: order._id,
                        owner: loggedUser._id,
                        navigateId: order._id,
                        receiver: order.owner,
                        type: status
                    }
                    //  Meteor.call('addNotification', notification);
                }
            })
    },
}),


    resetOrderQty = (Items) => {
        let userId = Meteor.userId();
        Items.forEach(async item => {

            // if (item.productOwner === ProductOwner.EAT_FIT) {
            //     let prod = await EFProducts.findOne({_id: item.productId});
            //     await  EFProducts.update({_id: item.productId}, {
            //         $set: {
            //             'availabeQuantity': prod.availabeQuantity + item.quantity
            //         }
            //     })
            // }
            // else {
            let prod = await Products.findOne({_id: item.productId});
            if (product.serviceOwner === userId) {
                await  Products.update({_id: item.productId}, {
                    $set: {
                        'availabeQuantity': prod.availabeQuantity + item.quantity
                    }
                })
            }
        // }
    })
    }