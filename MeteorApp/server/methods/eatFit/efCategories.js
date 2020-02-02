import {Meteor} from 'meteor/meteor';
import {EFCategories} from '../../../lib/collections/eatFit/efCategories';

Meteor.methods({
    'addNewEFCategory': (category) => {
        category.createdAt = new Date(new Date().toUTCString);
        return  EFCategories.insert(category)
    },

    'removeEFCategory': (id) => {
        EFCategories.remove(id);
    },
    'GetEFCategories': () => {
        const collection = EFCategories.rawCollection()
        const aggregate = Meteor.wrapAsync(collection.aggregate, collection);
        const productLookup = {
            from: "efProducts",
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
            "as": "products"
        };
        const project = {
            _id: 1,
            "products": {$arrayElemAt: ["$products", 0]},
            createDate: 1,
            title: 1,
            description: 1,
        };
        //  return Category.find().fetch();
        return Async.runSync(function (done) {
            aggregate([
                {$lookup: productLookup},
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