import {Meteor} from 'meteor/meteor';
import {EFProducts,EFOrder} from "../../../lib/collections/eatFit/efProducts";

Meteor.methods({
    'addNewProductEF': (productInfo) => {
        try {
            console.log('addNewProduEF:::=>>>',productInfo._id);
            var currentUserId = Meteor.userId();
            productInfo.createdBy = currentUserId,
                productInfo.createDate = new Date(new Date().toUTCString())
            let imageIds = [];
            if (productInfo.images) {
                productInfo.images.forEach(image => {
                    console.log(image.name,image.type,image.data)
                    let Id = moment().format('DDMMYYx');
                    EFProductImages.write(new Buffer(image.data, 'base64'),
                        {
                            fileName:  image.name,
                            type: image.type
                        },
                        (err, res) => {
                            if (err) {
                                console.log('error',err)
                            }
                            else {
                                const imageId=res._id.toString()
                                console.log('res:',imageId);

                                imageIds.push(imageId);
                                if(productInfo.images.length===imageIds.length){
                                    productInfo.images = imageIds;
                                    console.log('insert')
                                  return  EFProducts.insert(productInfo);
                                }
                            }
                        }, proceedAfterUpload = true)
                })
            }
            else {
                productInfo.images = [];
                console.log('insert')
                return EFProducts.insert(productInfo);
            }

        }
        catch (e) {
            console.log(e.message);
            throw new Meteor.Error(403, e.message)

        }
    },

    'EFProductsByCategory': (_categoryId) => {
        return EFProducts.find({category: _categoryId}).fetch();
    },

    'getSingleProductEF': (Id) => {
        return EFProducts.findOne({_id: Id});
    },
    'getSimilarProductEF': (Id) => {
        let cat = EFProducts.findOne({_id: Id}).category;
        return EFProducts.find({category: cat,_id:{$ne:Id}}).fetch();
    },

    'addOrderEF': (order, isOrder) => {
        order.orderDate = new Date(new Date().toUTCString());
        order.owner = Meteor.userId();
        order.status = 0;
        let itemsUpdated = [];
        return Async.runSync(function (done) {
            order.items.forEach(async (item, index) => {
                let product = await EFProducts.findOne({_id: item.productId});
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
                    order.items = itemsUpdated;
                    let loggedUser = Meteor.user();
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
            return EFProducts.find({_id: {$in: wishList}}).fetch();
        }
        catch (e) {
            console.log(e.message);
        }
    },

})