import { Meteor } from 'meteor/meteor';



Meteor.methods({

    'addNewCategory': (categoryInfo) => {
        console.log('addNewCategory:::=>>>');
        try {
            Category.insert({
                title: categoryInfo.title,
                name: categoryInfo.name,
                contact: categoryInfo.contact,
                createdAt: new Date(),
            });
        }
        catch (e) {
            console.log(e.message);

        }
    },

    'updateCategory': function (category) {
        if (Meteor.user().profile.role === 1) {
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
            }

        }
        else {
            throw new Meteor.Error(401, "", "Logged User is not Admin");
        }
    },

    'removeCategory': function (id) {
        if (Meteor.user().profile.role ===1) {
            try {
                Category.remove({_id:id});
            }
            catch (err) {
                console.log(err.message);
            }
        }
        else {
            throw new Meteor.Error(401,"", "Logged User is not Admin");
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
        }


    }
})