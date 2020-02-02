/**
 * Created by Roshan on 6/20/2017.
 */

//import {Products, Category} from "../../../../../lib/collections/eCommerce";
import {GRusers} from "../../../../../../lib/collections/genieeRepair/GRusers";
import {GRcategories} from "../../../../../../lib/collections/genieeRepair/GRcategories";
import {Meteor} from 'meteor/meteor';

let usercoverImage = null;
let filee ;
let userID = null;
let usercoverImageToRemoveAfterEdit = null;
let selectedCategory = null;


Template.Create_GRuser.helpers({
    GRuser: () => {
        return Session.get('usertoEdit');
    },
    // categories: () => {
    //     return Services.find();
    // },
    files: () => {
        return Session.get("files");
    },
    settings: function () {
        return {
            position: "",
            limit: 5,
            rules: [
                {
                    collection: GRcategories,
                    field: "title",
                    template: Template.GRcategoriesAutocomplete,
                    matchAll: true,
                }
            ]
        };
    }
});
Template.Create_GRuser.onCreated = () => {
    Session.set("files", []);
};
Template.Create_GRuser.rendered = () => {
    // $('#img-upload').cropper({
    //     aspectRatio: 16 / 9,
    //     zoomable:true,
    //     });
    $('#summernote').summernote(
        {
            placeholder: 'Place your content here',
            tabsize: 3,
            height: 200
        }
    );
    $(".summernote").summernote("code", Session.get('usertoEdit').userContent);
    Session.set("files", []);
};
Template.Create_GRuser.events({
    'change #userProfilePic': function (event, template) {
        if (usercoverImage != null) {
            usercoverImageToRemoveAfterEdit = usercoverImage;
        }
       
        if (event.currentTarget.files && event.currentTarget.files[0]) {
            Session.set("file", event.currentTarget.files[0]);
            filee = event.currentTarget.files[0];
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#img-upload').cropper('destroy');
                $('#img-upload').attr('src', e.target.result);
                $('#img-upload').cropper({
                    aspectRatio: 1 / 1,
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
    'submit #userCreateForm': function (event, t) {

        event.preventDefault();

        var fullname = $('#userFullname').val();
        var description = $('#userDescription').val();
        var contact = $('#userContact').val();
        var category = selectedCategory._id;
        var content = $('#summernote').summernote('code');

        if (!selectedCategory) {
            sAlert.error("Please Select Category");
            return;
        }
        if (fullname.length < 4) {
            sAlert.error("Please enter Full Name");
            return;
        }
        if (description.length < 4) {
            sAlert.error("Please enter Description");
            return;
        }
        if (!filee) {
            sAlert.error("Please Upload Image");
            return;
        }

        var user = {
            fullname: fullname,
            description: description,
            category: category,
            userContent: content,
            createBy: Meteor.userId(),
            contact: contact
        };

        if (filee) {
            var img = $('#img-upload');
            var canvas = img.cropper('getCroppedCanvas');

            var canvaURL = canvas.toDataURL('image/jpeg');
            var data = canvaURL.substr(canvaURL.indexOf('base64,') + 7);
            filee.mime = filee.type;
            let time = moment().format('DDMMYYx');
            var name = time + "." + filee.mime.substr(filee.mime.indexOf('/') + 1);
            var file = {
                data: data,
                mime: filee.type,
                name: name,
            }
            console.log(file);
            user.image = file

        }

        if (userID != null) {
            Meteor.call('updateUser', user, function (err) {
                if (err) {
                    sAlert.error(err.message);
                    removeUserCoverImage(user.userImage);
                }
                else {
                    removeUserCoverImage(usercoverImage);
                    Session.set("subCategory", null);
                    sAlert.success("User '" + user.fullname + "' Updated Successfully!!!");
                    t.find("form").reset();
                    $(".summernote").summernote("code", "");
                    $('#img-upload').attr('src', '');
                    filee = [];
                    FlowRouter.go('/admin/users/' + userID);
                }
            });
        } else {
            console.log(user)
            Meteor.call('addNewGRUser', user, function (err) {
                if (err) {
                    sAlert.error(err.message);
                    removeUserCoverImage(user.userImage);
                }
                else {
                    sAlert.success("User '" + user.title + "' Added Successfully!!!")
                    t.find("form").reset();
                    $(".summernote").summernote("code", "");
                    $('#img-upload').attr('src', '');
                    filee = [];
                    FlowRouter.go('/admin/users');

                }
            });
        }

    },
    "autocompleteselect input": function (event, template, doc) {
        console.log("selected ", doc);
        //alert(doc._id);
        selectedCategory = doc;
    },
    'select .btn-file :file': function (event, label) {
        var input = $(this).parents('.input-group').find(':text'),
            log = label;

        if (input.length) {
            input.val(log);
        } else {
            if (log) alert(log);
        }

    },
    'change .btn-file :file': function (event, ele) {
        var filename = ele.find('#userProfilePic').value.split('\\').pop();
        ele.$('#imgName').val(filename);
    }
});


removeUserCoverImage = (userImage) => {

    if (userImage !== null) {
       /* Meteor.call('removeAWSObject', userImage, (err, res) => {
            if (err) {
                sAlert.error(err.reason);
            }
        })*/
    }
}


Template.Create_GRuser.onCreated(() => {


    userID = FlowRouter.getParam('userId');

    if (userID != null) {
        var interval = Meteor.setInterval(function () {
            var usertoEdit = Users.findOne({_id: userID});
            if (usertoEdit != null) {
                usercoverImage = usertoEdit.userImage;
                Session.set('usertoEdit', usertoEdit);
                //  $('.trumbowyg-editor').val(producttoEdit.content);
                $(".summernote").summernote("code", usertoEdit.userContent);
                Meteor.clearInterval(interval);
            }
        }, 500)
    }


});

function handleFileSelect(event) {
    //Check File API support
    if (window.File && window.FileList && window.FileReader) {

        var files = event.target.files; //FileList object
        var output = document.getElementById("result");

        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            //Only pics
            if (!file.type.match('image')) continue;

            var picReader = new FileReader();
            picReader.addEventListener("load", function (event) {
                var picFile = event.target;
                // var div = document.createElement("div");
                // div.innerHTML = "<img class='thumbnail' src='" + picFile.result + "'" + "title='" + file.name + "'/>";
                // output.insertBefore(div, null);
                file.uri = picFile.result;
                filee.push({uri: picFile.result});
                Session.set("files", filee);
                //  console.log(picFile)
            });
            //Read the image
            picReader.readAsDataURL(file);
        }
    } else {
        console.log("Your browser does not support File API");
    }
}