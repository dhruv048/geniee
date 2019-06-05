/**
 * Created by Roshan on 6/20/2017.
 */

import { Meteor } from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';
import Grid from 'gridfs-stream';
import { MongoInternals } from 'meteor/mongo';

let gfs;
if (Meteor.isServer) {
    gfs = Grid(
        MongoInternals.defaultRemoteCollectionDriver().mongo.db,
        MongoInternals.NpmModule
    );
}



 ServiceImage = new FilesCollection({
    collectionName: 'serviceImages',
    allowClientCode: false,
    debug: Meteor.isServer && process.env.NODE_ENV === 'development',
    onBeforeUpload(file) {
        console.log('before upload',file)
    },

    onAfterUpload(image) {
        try {
            let fs=getFS();
            // Move file to GridFS
            Object.keys(image.versions).forEach(versionName => {
                const metadata = {versionName, imageId: image._id, storedAt: new Date()}; // Optional
                const writeStream = gfs.createWriteStream({filename: image.name, metadata});

                fs.createReadStream(image.versions[versionName].path).pipe(writeStream);

                writeStream.on('close', Meteor.bindEnvironment(file => {
                    const property = `versions.${versionName}.meta.gridFsFileId`;

                    // If we store the ObjectID itself, Meteor (EJSON?) seems to convert it to a
                    // LocalCollection.ObjectID, which GFS doesn't understand.
                    console.log('collection'+this.collection);
                    this.collection.update(image._id, {$set: {[property]: file._id.toString()}});
                    this.unlink(this.collection.findOne(image._id), versionName); // Unlink files from FS
                }));
            });
        }
        catch (e) {
            console.log(e.message)
        }
    },

    interceptDownload(http, image, versionName) {
        const _id = (image.versions[versionName].meta || {}).gridFsFileId;
        console.log("_id"+_id);
        if (_id) {
            const readStream = gfs.createReadStream({_id});
            try {

                console.log('readdStream'+readStream);
            }
            catch (e) {
                console.log('erroron createReadStream'+e.message)
            }
            readStream.on('error', err => {
                throw err;
            });
            readStream.pipe(http.response);
        }
        return Boolean(_id); // Serve file from either GridFS or FS if it wasn't uploaded yet
    },
    onAfterRemove(images) {
        // Remove corresponding file from GridFS
        images.forEach(image => {
            Object.keys(image.versions).forEach(versionName => {
                const _id = (image.versions[versionName].meta || {}).gridFsFileId;
                if (_id) gfs.remove({_id}, err => {
                    if (err) throw err;
                });
            });
        });
    }
});

if (Meteor.isServer) {
    ServiceImage.denyClient();
}