import {Meteor} from 'meteor/meteor';
import {GRcategories} from '../../../lib/collections/genieeRepair/GRcategories';
import {EFCategories} from "../../../lib/collections/eatFit/efCategories";

Meteor.methods({
    'addNewGRCategory': (category) => {
        category.createdAt = new Date(new Date().toUTCString);
        return  GRcategories.insert(category)
    },

    'removeGRCategory': (id) => {
        GRcategories.remove(id);
    },

    'getCategoriesGR': () => {
        const collection = GRcategories.rawCollection()
        const aggregate = Meteor.wrapAsync(collection.aggregate, collection);
        const userLookup = {
            from: "grusers",
            let: {catId: "$_id"},
            pipeline: [
                {$match: {$expr: {$eq: ["$category", "$$catId"]}}},
                {
                    $group: {
                        _id: '$category',
                        count: {$sum: 1}
                    }
                },
                {$project: {count: 1}}
            ],
            "as": "users"
        };
        const project = {
            _id: 1,
            "users": {$arrayElemAt: ["$users", 0]},
            createDate: 1,
            title: 1,
            description: 1,
        };
        //  return Category.find().fetch();
        return Async.runSync(function (done) {
            aggregate([
                {$lookup: userLookup},
                {$project: project}
            ], {cursor: {}}).toArray(function (err, doc) {
                if (doc) {
                    // console.log('doc', doc.length,doc)
                }
                done(err, doc);
            });
        });
    },
});