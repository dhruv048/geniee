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
            gfs.files.find({'metadata.imageId':req.params.id}).toArray(function(err, files){
                if(!files || files.length === 0){
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
    });

}