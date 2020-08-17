import {check} from 'meteor/check';
import {Meteor} from 'meteor/meteor';
import {FilesCollection} from 'meteor/ostrio:files';
import Grid from 'gridfs-stream';
import { MongoInternals } from 'meteor/mongo';

let gfs;
if (Meteor.isServer) {
    gfs = Grid(
        MongoInternals.defaultRemoteCollectionDriver().mongo.db,
        MongoInternals.NpmModule
    );
}

var fs = Npm.require('fs');
getFS=function(){
    return fs;
};


//import fs from 'fs-extra';

const bound = Meteor.bindEnvironment((callback) => {
    return callback();
});

// createThumbnails = (collection, fileRef, cb) => {
//     check(fileRef, Object);
//
//     fs.exists(fileRef.path, (exists) => {
//         bound(() => {
//             if (!exists) {
//                 throw Meteor.log.error('File ' + fileRef.path + ' not found in [createThumbnails] Method');
//             }
//
//             const image = gm(fileRef.path);
//
//             image.size((error, features) => {
//                 bound(() => {
//                     if (error) {
//                         console.error('[_app.createThumbnails] [_.each sizes]', error);
//                         cb && cb(Meteor.Error('[_app.createThumbnails] [image.size]', error));
//                         return;
//                     }
//
//                     // Update meta data if original image
//                     collection.collection.update(fileRef._id, {
//                         $set: {
//                             'meta.width': features.width,
//                             'meta.height': features.height,
//                             'versions.original.meta.width': features.width,
//                             'versions.original.meta.height': features.height
//                         }
//                     });
//
//                     const path = (collection.storagePath(fileRef)) + '/thumbnail-' + fileRef._id + '.' + fileRef.extension;
//                     const img = gm(fileRef.path)
//                         .quality(70)
//                         .define('filter:support=2')
//                         .define('jpeg:fancy-upsampling=false')
//                         .define('jpeg:fancy-upsampling=off')
//                         .define('png:compression-filter=5')
//                         .define('png:compression-level=9')
//                         .define('png:compression-strategy=1')
//                         .define('png:exclude-chunk=all')
//                         .autoOrient()
//                         .noProfile()
//                         .strip()
//                         .dither(false)
//                         .interlace('Line')
//                         .filter('Triangle');
//
//                     // Change width and height proportionally
//                     img.resize(250).interlace('Line').write(path, (resizeError) => {
//                         bound(() => {
//                             if (resizeError) {
//                                 console.error('[createThumbnails] [img.resize]', resizeError);
//                                 cb && cb(resizeError);
//                                 return;
//                             }
//
//                             fs.stat(path, (fsStatError, stat) => {
//                                 bound(() => {
//                                     if (fsStatError) {
//                                         console.error('[_app.createThumbnails] [img.resize] [fs.stat]', fsStatError);
//                                         cb && cb(fsStatError);
//                                         return;
//                                     }
//
//                                     gm(path).size((gmSizeError, imgInfo) => {
//                                         bound(() => {
//                                             if (gmSizeError) {
//                                                 console.error('[_app.createThumbnails] [_.each sizes] [img.resize] [fs.stat] [gm(path).size]', gmSizeError);
//                                                 cb && cb(gmSizeError);
//                                                 return;
//                                             }
//
//                                             fileRef.versions.thumbnail = {
//                                                 path: path,
//                                                 size: stat.size,
//                                                 type: fileRef.type,
//                                                 extension: fileRef.extension,
//                                                 meta: {
//                                                     width: imgInfo.width,
//                                                     height: imgInfo.height
//                                                 }
//                                             };
//
//                                             const upd = {$set: {}};
//                                             upd['$set']['versions.thumbnail'] = fileRef.versions.thumbnail;
//
//                                             collection.collection.update(fileRef._id, upd, (colUpdError) => {
//                                                 if (cb) {
//                                                     if (colUpdError) {
//                                                         cb(colUpdError);
//                                                     } else {
//                                                         cb(void 0, fileRef);
//                                                     }
//                                                 }
//                                             });
//                                         });
//                                     });
//                                 });
//                             });
//                         });
//                     });
//                 });
//             });
//         });
//     });
//     return true;
// };
//
//
// if (Meteor.isServer) {
//     Meteor.startup(function () {
//
//         // Global configuration
//         Api = new Restivus({
//             useDefaultAuth: false,
//             prettyJson: true
//         });
//
//         // Generates: GET/POST on /api/v1/users, and GET/PUT/DELETE on /api/v1/users/:id
//         // for Meteor.users collection (works on any Mongo collection)
//         Api.addCollection(Images);
//         // That's it! Many more options are available if needed...
//
//         // Maps to: POST /api/v1/articles/:id
//         Api.addRoute('image/:id', {authRequired: false}, {
//             get: {
//                 action: function () {
//                     var image = Images.findOne(this.urlParams.id).cursor;
//                     console.log('image' + image);
//                     console.log('url' + Images.link(image));
//                     if (image) {
//                         return {status: "success", data: Images.link(image)};
//                     }
//                     return {
//                         statusCode: 400,
//                         body: {status: "fail", message: "Unable to find image"}
//                     };
//                 }
//             }
//         });
//     });
// }
//
// getFS=function(){
//     return fs;
// }
//
// OnAfterUpload = (image,ref) => {
//
//     // createThumbnails(this, image, (error, image) => {
//     //     if (error) {
//     //         console.error(error);
//     //     }
//     //     else {
//     //         console.log(image)
//     //     }
//     // });
//
//
// // Move file to GridFS
//     Object.keys(image.versions).forEach(versionName => {
//         const metadata = {versionName, imageId: image._id, storedAt: new Date()}; // Optional
//         const writeStream = gfs.createWriteStream({filename: image.name, metadata});
//
//         fs.createReadStream(image.versions[versionName].path).pipe(writeStream);
//
//         writeStream.on('close', Meteor.bindEnvironment(file => {
//             const property = `versions.${versionName}.meta.gridFsFileId`;
//
//             // If we store the ObjectID itself, Meteor (EJSON?) seems to convert it to a
//             // LocalCollection.ObjectID, which GFS doesn't understand.
//             ref.collection.update(image._id, {$set: {[property]: file._id.toString()}});
//             ref.unlink(ref.collection.findOne(image._id), versionName); // Unlink files from FS
//         }));
//     });
// },
//     InterceptDownload = (http, image, versionName) => {
//         // Serve file from GridFS
//         const _id = (image.versions[versionName].meta || {}).gridFsFileId;
//         console.log("_id"+_id);
//         if (_id) {
//             const readStream = gfs.createReadStream({_id});
//             try {
//
//                 console.log('readdStream'+readStream);
//             }
//             catch (e) {
//                 console.log('erroron createReadStream'+e.message)
//             }
//             readStream.on('error', err => {
//                 throw err;
//             });
//             readStream.pipe(http.response);
//         }
//         return Boolean(_id); // Serve file from either GridFS or FS if it wasn't uploaded yet
//     },
//     OnAfterRemove = (images) => {
//         // Remove corresponding file from GridFS
//         images.forEach(image => {
//             Object.keys(image.versions).forEach(versionName => {
//                 const _id = (image.versions[versionName].meta || {}).gridFsFileId;
//                 if (_id) gfs.remove({_id}, err => {
//                     if (err) throw err;
//                 });
//             });
//         });
//     }
//
