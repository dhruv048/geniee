import { Meteor } from "meteor/meteor";
import { HTTP } from 'meteor/http';

const fs = require("fs");

const handleImageUpload = (formData) => new Promise((resolve, reject) => {
    let jsonImage = { base64Data: formData };
    HTTP.post('http://139.59.59.117/api/upload', {
        headers: {
            'Content-Type': 'application/json'
        },
        data: jsonImage
    }
        , (error, result) => {
            if (error) reject({ target: 'handleImageUpload', error });
            else {
                resolve(result.data);
            }
        });
});

Meteor.methods({
    'uploadImage': (image) => {
        console.log('uploadImage')
        var res = ServiceImage.insert({
            file: image.data,
            isBase64: true, // <— Mandatory
            fileName: image.modificationDate, // <— Mandatory
            type: image.mime // <— Mandatory
        });
        console.log(re);
        return res
    },

    'uploadProfileImage':  async (image) => {
        let userId = Meteor.userId();
        const imageUploaded =  await handleImageUpload(image);
        console.log(imageUploaded+' This PP file name '+imageUploaded.fileName);
        const imageName = imageUploaded ? imageUploaded.fileName : '';
        Meteor.users.update({ _id: userId }, {
            $set: { 'profile.profileImage': imageName }
        })
        console.log(imageUploaded+' This PP file name '+imageUploaded.fileName);
        return imageName;

    }

    // 'uploadProfileImage':function(image){
    //     console.log(image.name)
    //     let userId=Meteor.userId();
    //     ProfilePhoto.write(new Buffer(image.data, 'base64'),
    //         {
    //             fileName: image.name,
    //             type: image.mime
    //         },
    //         (err, res) => {
    //             if (err) {
    //                 console.log(err)
    //             }
    //             else {
    //                 let Id=res._id;
    //                 console.log("imageId",Id)
    //                 Meteor.users.update({_id:userId},{
    //                     $set:{'profile.profileImage':Id}
    //                 })
    //                 return Id;
    //             }
    //         },proceedAfterUpload = true)
    // }

})