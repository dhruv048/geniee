import {Advertisements} from "../../../../../lib/collections/advertisements";

let ImageFile;

Template.Advertisements.helpers({
    Images: () => {
        return Advertisements.find();
    }
});

Template.Advertisements.rendered = () => {
    $(".image-checkbox").each(function () {
        if ($(this).find('input[type="checkbox"]').first().attr("checked")) {
            $(this).addClass('image-checkbox-checked');
        } else {
            $(this).removeClass('image-checkbox-checked');
        }
    });
};


Template.Advertisements.events({
    'click #addNewGalleryItem': () => {
        return $("#imageModal").modal('show');
    },

    'change #galleryImage': function (event, template) {
        if (event.currentTarget.files && event.currentTarget.files[0]) {
            Session.set("file", event.currentTarget.files[0]);
            ImageFile = event.currentTarget.files[0];
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#img-upload').cropper('destroy');
                $('#img-upload').attr('src', e.target.result);
                $('#img-upload').cropper({
                    aspectRatio: 7 / 3,
                    zoomable: true,
                });
                var canvas = $('#img-upload').cropper('getCroppedCanvas');
                var canvaURL = canvas.toDataURL('image/jpeg');
                $('#croppedImage').attr('src', canvaURL);
            }

            reader.readAsDataURL(event.currentTarget.files[0]);
            // var cropper =  $('#img-upload').data('cropper');
        }
    },

    'submit #uploadImageForm': function (event, t) {
        event.preventDefault();
        if (!ImageFile) {
            sAlert.error("Please Upload Image");
            return;
        }
        var status = $('#imageStatus').is(":checked");

        var img = $('#img-upload');
        var canvas = img.cropper('getCroppedCanvas');

        var canvaURL = canvas.toDataURL('image/jpeg');
        var data = canvaURL.substr(canvaURL.indexOf('base64,') + 7);
        ImageFile.mime = ImageFile.type;
        let time = moment().format('DDMMYYx');
        var name = time + "." + ImageFile.mime.substr(ImageFile.mime.indexOf('/') + 1);
        var file = {
            data: data,
            mime: ImageFile.type,
            name: name,
            isActive: status,
        }
        console.log(file);

        Meteor.call('addImageToGallery', file, status, (err, res) => {
            if (err) {
                alert(err.reason)
            }
            else {
                $('#imageModal').modal('hide');
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();
            }
        });
    },
    'change .btn-file :file': function (event, ele) {
        var filename = ele.find('#galleryImage').value.split('\\').pop();
        ele.$('#imgName').val(filename);
    },

    'click input': function (event) {
        var x = $(event.target).is(":checked");
        var Id = event.target.id;
        console.log(x, Id);
        Meteor.call('updateStatusImage', Id, x, (error, res) => {
            if (error) {
                console.log(error)
            }
            else {
                sAlert.success('Status Updated Successfully');
            }
        })
    }
});