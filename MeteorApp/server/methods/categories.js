import {Meteor} from 'meteor/meteor';


Meteor.methods({

    'addNewService': (serviceInfo) => {
        try {
            console.log('addNewCategory:::=>>>');
            var currentUserId = Meteor.userId();
            let CategoryId = serviceInfo.Category._id !== null ? serviceInfo.Category._id : Categories.insert(
                {  name: serviceInfo.Category.name,
                createdAt: new Date(),
                createdBy: Meteor.userId()});
            if (serviceInfo.Image) {
                ServiceImage.write(new Buffer(serviceInfo.Image.data, 'base64'),
                    {
                        fileName: serviceInfo.Image.modificationDate+'.jpg',
                        type: serviceInfo.Image.mime
                    },
                    (err, res) => {
                        if (err) {
                            console.log(err)
                        }
                        else {
                            console.log(res._id)
                            var res = Service.insert({
                                title: serviceInfo.title,
                                description: serviceInfo.description,
                                contact: serviceInfo.contact,
                                location: serviceInfo.location,
                                radius: serviceInfo.radius,
                                coverImage: res._id,
                                homeDelivery: serviceInfo.homeDelivery,
                                categoryId: CategoryId,
                                createdAt: new Date(),
                                createdBy: currentUserId,
                            });

                            return res;
                        }
                    }, proceedAfterUpload = true)
            }
            else{

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


    }
})