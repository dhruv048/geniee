var Grid = require('gridfs-stream');
import { MongoInternals } from 'meteor/mongo';

// Set up mongoose connection
const mongoose = require('mongoose');
Grid.mongo = mongoose.mongo;




if (Meteor.isServer) {
  let  gfs = Grid(
        MongoInternals.defaultRemoteCollectionDriver().mongo.db,
        MongoInternals.NpmModule
    );

    JsonRoutes.add('get', '/api/images/:id', function(req, res, next) {
        try {
            gfs.files.find({'metadata.imageId': req.params.id}).toArray(function (err, files) {
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
                    'Content-Type': 'image/png',
                });

                /** return response */
                readstream.pipe(res);
            });

        }
        catch (e) {
            console.log(e.message);
            res.writeHead(500);
            res.end(e.message);
        }
    }),
        JsonRoutes.add('post', '/api/search/:searchValue', function (req, res, next) {
            console.log('called search')
            // try {
                res.writeHead(200, {
                    'Content-Type': 'application/json',
                });
                let Ids= req.body.Ids;
                let result = [];
                let searchValue =  req.body.searchValue;
                if (!searchValue) {
                    result = Service.find({}, {limit: 100}).fetch();
                }
                else {
                    result = Service.find({$and:[
                        {$text: {$search: searchValue}},{categoryId:{$in:Ids}}]},
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
                        },{limit:50}
                    ).fetch();
                }
            res.end(JSON.stringify({ data: result }));
        // }
            // catch (e) {
            //     console.log(e.message);
            //     // res.writeHead(500);
            //     // res.end(e.message);
            // }

        });


}