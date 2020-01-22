import {Gallery} from '../../lib/collections/gallery'
import {Meteor} from 'meteor/meteor';


Meteor.methods({
    'addImageToGallery': (image, isActive) => {
        GalleryImages.write(new Buffer(image.data, 'base64'),
            {
                fileName:  moment().format('DDMMYYx') + '.'+image.mime.indexOf('/') + 1,
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
                        owner: Meteor.userId(),
                        uploaded: new Date(),
                    };
                    if (isActive != null || isActive != undefined) {
                        Item.isActive = isActive;
                    }
                    return Gallery.insert(Item);
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
            let Items = Gallery.find({type: 'video', owner: LoggedUser._id}).count();
            if (LoggedUser.profile.hasOwnProperty('subscription') && (LoggedUser.profile.subscription.VIDEOUPLOADS === 'Unlimited' || LoggedUser.profile.subscription.VIDEOUPLOADS > Items)) {
                return Gallery.insert(Item);
            }
            else if (Items < 10) {
                return Gallery.insert(Item);
            }
            else {
                throw new Meteor.Error(500, "Limit Reached, Please Subscribe for more uploads!");
            }
        }
        catch (e) {
            throw new Meteor.Error(403, e.message);
        }
    },

    'removeGalleryItems': (items) => {
        items.forEach(item => {
            try {
                var data = Gallery.findOne({_id: item});
                if (data.owner === Meteor.userId())
                    if (data.hasOwnProperty('src')) {
                        Meteor.call('removeAWSObject', data.src, function (err, res) {
                            if (!err) {
                                Gallery.remove(item);
                            }
                            else {
                                throw new Meteor.Error(403, err.message);
                            }
                        })
                    }
                    else {
                        Gallery.remove(item);
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
        Gallery.update({_id: Id}, {
            $set: {
                isActive: Val
            }
        })
    }
});

