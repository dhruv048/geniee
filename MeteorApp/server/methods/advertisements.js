import {Advertisements} from '../../lib/collections/advertisements'
import {Meteor} from 'meteor/meteor';


Meteor.methods({
    'addImageToGallery': (image, isActive) => {
     //   console.log(image, moment().format('DDMMYYx') + '.'+image.mime.substring(image.mime.indexOf('/') + 1));
        const logged= Meteor.userId();
        AdvertisementImages.write(new Buffer(image.data, 'base64'),
            {
                fileName:  moment().format('DDMMYYx') + '.'+image.mime.substring(image.mime.indexOf('/') + 1),
                type: image.mime
            },
            (err, res) => {
                if (err) {
                    console.log('error',err)
                }
                else {
                    console.log('res:',res._id);
                    let Item = {
                        type: 'image',
                        src: res._id,
                        owner: logged,
                        uploaded: new Date(),
                    };
                    if (isActive != null || isActive != undefined) {
                        Item.isActive = isActive;
                    }
                    return Advertisements.insert(Item);
                }
            }, proceedAfterUpload = true)
    },
    'addVideoToGallery': (id) => {
        try {
            let Item = {
                type: 'video',
                Id: id,
                owner: Meteor.userId(),
                uploaded: new Date()
            };
            let LoggedUser = Meteor.user();
            let Items = Advertisements.find({type: 'video', owner: LoggedUser._id}).count();
                return Advertisements.insert(Item);
        }
        catch (e) {
            throw new Meteor.Error(403, e.message);
        }
    },

    'removeGalleryItems': (items) => {
        items.forEach(item => {
            try {
                var data = Advertisements.findOne({_id: item});
                if (data.owner === Meteor.userId())
                    if (data.hasOwnProperty('src')) {
                        Meteor.call('removeAWSObject', data.src, function (err, res) {
                            if (!err) {
                                Advertisements.remove(item);
                            }
                            else {
                                throw new Meteor.Error(403, err.message);
                            }
                        })
                    }
                    else {
                        Advertisements.remove(item);
                    }
                else {
                    throw new Meteor.Error(500, "UnAuthorized!!!");
                }
            }
            catch (e) {
                throw new Meteor.Error(403, e.message);
            }
        })
    },

    'updateStatusImage': (Id, Val) => {
        Advertisements.update({_id: Id}, {
            $set: {
                isActive: Val
            }
        })
    }
});

