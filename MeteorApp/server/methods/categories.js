import { Meteor } from 'meteor/meteor';



Meteor.methods({

    'addNewCategory': (categoryInfo) => {
        console.log('addNewCategory:::=>>>');
        var currentUserId = Meteor.userId();
        try {
            Category.insert({
                title: categoryInfo.title,
                name: categoryInfo.name,
                contact: categoryInfo.contact,
                createdAt: new Date(),
                createdBy:currentUserId,
            });
        }
        catch (e) {
            console.log(e.message);
            throw new Meteor.Error(403,e.message)

        }
    },

    'addCategory': (name) => {
    console.log('addCategory:::=>>>');
    var currentUserId = Meteor.userId();
    try {
        Categories.insert({
            name: name,
            createdAt: new Date(),
            createdBy:currentUserId,
        });
    }
    catch (e) {
        console.log(e.message);
        throw new Meteor.Error(403,e.message)

    }
},


    'updateCategory': function (category) {
        var cat= Category.findOne({_id:category._id});
        if (cat.createdBy===Meteor.userId() || Meteor.user().profile.role === 2) {
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
                throw new Meteor.Error(403,e.message)
            }

        }
        else {
            console.log("Permission Denied")
            throw new Meteor.Error(401, "Permission Denied");
        }
    },

    'removeCategory': function (id) {
        var category= Category.findOne({_id:id});
        if  (Meteor.userId()===category.createdBy || Meteor.user().profile.role === 2)  {
            try {
                Category.remove({_id:id});
            }
            catch (err) {
                console.log(err.message);
                throw new Meteor.Error(403,err.message);
            }
        }
        else {
            throw new Meteor.Error(401,"Permission Denied");
        }
    },

    'updateCallCount':function () {
        try{

            if(Count.find().count()>0){
                var count = Count.findOne();
                Count.update({_id: count._id}, {
                    $set: {
                        callCount: count.callCount+1
                    }
                });
            }

            else{
                Count.insert({callCount:1})
            }
        }
        catch (err){
            console.log(err.message);
            throw new Meteor.Error(403,err.message)
        }


    }
})