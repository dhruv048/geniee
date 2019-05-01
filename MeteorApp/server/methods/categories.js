import {Meteor} from 'meteor/meteor';


Meteor.methods({

    'addNewService': (serviceInfo) => {
        console.log('addNewCategory:::=>>>');
        var currentUserId = Meteor.userId();
        let CategoryId = serviceInfo.Category._id !== null ? serviceInfo.Category._id : Categories.findOne({'name': serviceInfo.Category.name})._id;
        try {
            var res = Service.insert({
                title: serviceInfo.title,
                description: serviceInfo.description,
                contact: serviceInfo.contact,
                location: serviceInfo.location,
                radius: serviceInfo.radius,
                coverImage: serviceInfo.coverImage,
                homeDelivery: serviceInfo.homeDelivery,
                categoryId: CategoryId,
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