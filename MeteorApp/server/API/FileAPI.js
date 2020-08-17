//
// var Grid = require('gridfs-stream');
// var fs = require('fs');
// // var sharp = require('sharp');
// var gfs;
//
// // Set up mongoose connection
// const mongoose = require('mongoose');
// Grid.mongo = mongoose.mongo;
// const options = {
//     autoIndex: false, // Don't build indexes
//     reconnectTries: 30, // Retry up to 30 times
//     reconnectInterval: 500, // Reconnect every 500ms
//     poolSize: 10, // Maintain up to 10 socket connections
//     // If not connected, return errors immediately rather than waiting for reconnect
//     bufferMaxEntries: 0,
//     useNewUrlParser: true
// }
//
//
// let dev_db_url = 'mongodb://localhost:27017/ks';
// const mongoDB = process.env.MONGODB_URI || dev_db_url;
//
//
// if (Meteor.isServer) {
//
//     // Global API configuration
//     var Api = new Restivus({
//         useDefaultAuth: false,
//         prettyJson: true
//     });
//
//     mongoose.connect(mongoDB, options);
//     mongoose.Promise = global.Promise;
//     const db = mongoose.connection;
//
//     db.on('connected', () => {
//         console.log('MongoDB is connected')
//         gfs=Grid(db.db)
//     })
//
//
//     Api.addRoute('serviceImage/:id', {authRequired: false}, {
//         get: function () {
//             try {
//                 gfs.files.find({'metadata.imageId':this.urlParams.id}).toArray(function(err, files){
//                     if(!files || files.length === 0){
//                         return {
//                             statusCode: 404,
//                             body: {status: 'fail', message: 'Image not found'}
//                         };
//                     }
//                     /** create read stream */
//                     var readstream = gfs.createReadStream({
//                         filename: files[0].filename,
//                     });
//                     /** set the proper content type */
//                     //res.set('Content-Type', files[0].contentType)
//                     this.response= {
//                         statusCode: 200,
//                         headers: {
//                             'Content-Type': 'text/plain',
//
//                         }
//                     }
//                         /** return response */
//                     //return  fs.createReadStream(readstream).pipe(res);
//                   return   readstream.pipe(this.response);
//                     // fs.on('end',function () {
//                     //     this.done();
//                     // })
//                 });
//             }
//             catch (e) {
//                 console.log(e.message)
//             }
//         },
//         delete: {
//             roleRequired: ['author', 'admin'],
//             action: function () {
//                 if (ServiceImage.remove(this.urlParams.id)) {
//                     return {status: 'success', data: {message: 'Article removed'}};
//                 }
//                 return {
//                     statusCode: 404,
//                     body: {status: 'fail', message: 'Article not found'}
//                 };
//             }
//         }
//     });
//     };