import {Meteor} from 'meteor/meteor';
import {EFProducts} from "../../../lib/collections/eatFit/efProducts";

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
})