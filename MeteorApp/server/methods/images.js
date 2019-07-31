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


})