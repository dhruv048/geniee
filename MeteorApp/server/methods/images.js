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
    'uploadProfileImage':function(image){
        console.log(image.name)
        let userId=Meteor.userId();
        ProfilePhoto.write(new Buffer(image.data, 'base64'),
            {
                fileName: image.name,
                type: image.mime
            },
            (err, res) => {
                if (err) {
                    console.log(err)
                }
                else {
                    let Id=res._id;
                    console.log("imageId",Id)
                    Meteor.users.update({_id:userId},{
                        $set:{'profile.profileImage':Id}
                    })
                    return Id;
                }
            },proceedAfterUpload = true)
    }

})