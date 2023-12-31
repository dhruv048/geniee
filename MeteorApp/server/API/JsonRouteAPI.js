var Grid = require('gridfs-stream');
import {MongoInternals} from 'meteor/mongo';
import {Promise} from 'meteor/promise';
// Set up mongoose connection
const mongoose = require('mongoose');
Grid.mongo = mongoose.mongo;


if (Meteor.isServer) {
    let gfs = Grid(
        MongoInternals.defaultRemoteCollectionDriver().mongo.db,
        MongoInternals.NpmModule
    );

    JsonRoutes.add('get', '/api/images/:id', function (req, res, next) {
        try {
            gfs.files.find({'metadata.imageId': req.params.id}).toArray(function (err, files) {
                if (!files || files.length === 0) {
                    res.writeHead(400);
                    res.end('cannot find image with id=' + req.params.id);
                }

                try {
                    /** create read stream */
                  //  console.log(req.params.id,files[0])
                    var readstream = gfs.createReadStream({
                        filename: files[0].filename,
                    });


                    /** set the proper content type */
                    res.writeHead(200, {
                        'Content-Type': files[0].metadata.mime,
                    });

                    /** return response */
                    readstream.pipe(res);
                }
                catch(e){
                   // res.writeHead(500);
                   // console.log(e.message)
                    res.end(e.message);
                }
            });

        }
        catch (e) {
           // console.log(e.message);
        //    res.writeHead(500);
            res.end(e.message);
        }
    }),

        JsonRoutes.add('get', '/api/chatFiles/:id/:filename', function (req, res, next) {
            try {
                gfs.files.find({'metadata.imageId': req.params.id}).toArray(function (err, files) {
                    console.log(req.params)
                    if (!files || files.length === 0) {
                        res.writeHead(400);
                        res.end('cannot find image with id=' + req.params.id);
                    }


                    /** create read stream */
                    var readstream = gfs.createReadStream({
                        filename: files[0].filename,
                    });


                    /** set the proper content type */
                    res.writeHead(200, {
                        'Content-Type': files[0].metadata.mime,
                    });

                    /** return response */
                    readstream.pipe(res);
                });

            }
            catch (e) {
              //  console.log(e.message);
                //res.writeHead(500);
                res.end(e.message);
            }
        }),


        JsonRoutes.add('post', '/api/search', function (req, res, next) {
            console.log('called search', req.body.searchValue)
            try {
                res.writeHead(200, {
                    'Content-Type': 'application/json',
                });
                let Ids = req.body.Ids;
                let result = [];
                let searchValue = req.body.searchValue;
                //       if (!searchValue) {
                //           result = Service.find({}, {limit: 100}).fetch();
                //       }
                //       else {
                //           result = Service.find({$and:[
                //               {$text: {$search: searchValue}},{categoryId:{$in:req.body.subCatIds}}]},
                //               {
                //                   // `fields` is where we can add MongoDB projections. Here we're causing
                //                   // each document published to include a property named `score`, which
                //                   // contains the document's search rank, a numerical value, with more
                //                   // relevant documents having a higher score.
                //                   fields: {
                //                       titleScore: {$meta: "textScore"},
                //                   },
                //                   // This indicates that we wish the publication to be sorted by the
                //                   // `score` property specified in the projection fields above.
                //                   sort: {
                //                       titleScore: {$meta: "textScore"}
                //                   }
                //               },{limit:50}
                //           ).fetch();
                //       }
                //


                const defaultRating = {'id': '000', 'avgRate': 0, 'count': 0};
                const categoryLookup = {
                    from: "MainCategories",
                    let: {catId: "$categoryId"},
                    pipeline: [
                        {
                            $match: {
                                $expr: {

                                    $eq: ["$subCategories.subCatId", "$$catId"]
                                }
                            }
                        },
                    ],
                    "as": "categories"
                };

                const ServiceRatings = {
                    from: "ratings",
                    let: {serviceId: "$_id"},
                    pipeline: [
                        {$match: {$expr: {$eq: ["$serviceId", "$$serviceId"]}}},
                        {
                            $group: {
                                _id: '$_id',
                                avgRate: {$avg: "$rating.count"},
                                count: {$sum: 1}
                            }
                        },
                        {$project: {avgRate: 1, count: 1}}
                    ],
                    "as": "servRatings"
                };

                const addValues = {
                    Rating: {
                        $cond: {
                            if: {"$eq": ["$servRatings", []]}, then: defaultRating, else: {$arrayElemAt: ["$servRatings", 0]}
                        }
                    },
                    category: {$arrayElemAt: ['$categories', 0]}
                };
                var pipeline = [
                    {
                        $geoNear: {
                            near: {type: "Point", coordinates: req.body.coords},
                            distanceField: "dist.calculated",
                            query: {
                                $or: [
                                    {title: {$regex: ".*" + searchValue + ".*", $options: "i"}},
                                    {description: {$regex: ".*" + searchValue + ".*", $options: "i"}}],
                                categoryId: {$in: req.body.subCatIds}
                            },
                            spherical: true,
                            distanceMultiplier: 0.001
                        }
                    },
                    {$lookup: categoryLookup},
                    {$lookup: ServiceRatings},
                    {$addFields: addValues},
                ];

                let Service = MongoInternals.defaultRemoteCollectionDriver().mongo.db.collection('service');
                Service.aggregate(
                    pipeline, {cursor: {}}
                ).toArray(function (err, doc) {
                    if (doc) {
                        console.log('doc', doc.length)
                        res.end(JSON.stringify({data: doc}));
                        return false;
                    }
                });
                //  console.log('result',result)
                //  res.end(JSON.stringify({ data: result }));
            }
            catch (e) {
                console.log(e.message);
                // res.writeHead(500);
                // res.end(e.message);
            }

        });

    JsonRoutes.add('post', '/api/mainSearch', function (req, res, next) {
        console.log('called search', req.body.searchValue)
        try {
            res.writeHead(200, {
                'Content-Type': 'application/json',
            });
            // let Ids = req.body.Ids;
            let result = [];
            let searchValue = req.body.searchValue;
            // if (!searchValue) {
            //     result = Service.find({}, {limit: 100}).fetch();
            // }
            // else {
            result = Service.find(
                {$text: {$search: searchValue}},
                {
                    // `fields` is where we can add MongoDB projections. Here we're causing
                    // each document published to include a property named `score`, which
                    // contains the document's search rank, a numerical value, with more
                    // relevant documents having a higher score.
                    fields: {
                        titleScore: {$meta: "textScore"},
                    },
                    // This indicates that we wish the publication to be sorted by the
                    // `score` property specified in the projection fields above.
                    sort: {
                        titleScore: {$meta: "textScore"}
                    }
                }, {limit: 50}
            ).fetch();
            // }

            // var pipeline = [
            //     {
            //         $geoNear: {
            //             near: {type: "Point", coordinates: req.body.coords},
            //             distanceField: "dist.calculated",
            //             query: {
            //                 $or: [
            //                     {title: {$regex: ".*" + searchValue + ".*", $options: "i"}},
            //                     {description: {$regex: ".*" + searchValue + ".*", $options: "i"}}],
            //                 categoryId: {$in: req.body.subCatIds}
            //             },
            //             spherical: true,
            //             distanceMultiplier: 0.001
            //         }
            //     }
            // ];
            let products = Products.find(
                {$text: {$search: searchValue}},
                {
                    fields: {
                        titleScore: {$meta: "textScore"},
                    },
                    sort: {
                        titleScore: {$meta: "textScore"}
                    }
                }, {limit: 50}
            ).fetch();
            let categories = MainCategories.find(
                {$text: {$search: searchValue}},
                {
                    fields: {
                        titleScore: {$meta: "textScore"},
                    },
                    sort: {
                        titleScore: {$meta: "textScore"}
                    }
                }, {limit: 50}
            ).fetch();
           // console.log(products);
            // let Service = MongoInternals.defaultRemoteCollectionDriver().mongo.db.collection('service');
            // Service.aggregate(
            //     pipeline, {cursor: {}}
            // ).toArray(function (err, doc) {
            //     if (doc) {
            //         console.log('doc', doc.length)
            //         res.end(JSON.stringify({data: doc, products:products,categories:categories}));
            //         return false;
            //     }
            // });
           // console.log('result', result)
            res.end(JSON.stringify({
                services:result,
                products: products,
                categories: categories}));
        }
        catch (e) {
            console.log(e.message);
            // res.writeHead(500);
            // res.end(e.message);
        }

    });
}