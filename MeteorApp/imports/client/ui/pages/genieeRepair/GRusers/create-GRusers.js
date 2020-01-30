/**
 * Created by Roshan on 6/20/2017.
 */

//import {Products, Category} from "../../../../../lib/collections/eCommerce";
import {GRusers} from "../../../../../../lib/collections/genieeRepair/GRusers";
import {Meteor} from 'meteor/meteor';

let usercoverImage = null;
let filee = [];
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
                    collection: Service,
                    field: "title",
                    template: Template.GRcategories,
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
    'change #userCoverImage': function (event, template) {
        if (usercoverImage != null) {
            usercoverImageToRemoveAfterEdit = usercoverImage;
        }
        let FileList = event.currentTarget.files;
        if (event.currentTarget.files && event.currentTarget.files[0]) {
            console.log(event.currentTarget.files);
            handleFileSelect(event)
            // for (const [key, file] of Object.entries( event.currentTarget.files.FileList)) {
            //     console.log(key, file);
            //     let reader = new FileReader();
            //     reader.onload = function (e) {
            //         file.key=key;
            //         file.uri = e.target.result;
            //         filee.push(file);
            //         Session.set("files", filee);
            //         console.log(file)
            //     }
            //     reader.readAsArrayBuffer(file);
            // }
            // for( var i=0; i<FileList.length;i++)
            // {
            //     let reader = new FileReader();
            //     reader.onload = function (e) {
            //         var file=FileList[i];
            //        // file.key=i;
            //         file.uri = e.target.result;
            //         filee.push(file);
            //         Session.set("files", filee);
            //         console.log(file)
            //     }
            //     reader.readAsArrayBuffer(FileList[i]);
            // }
            // event.currentTarget.files.FileList.forEach(file => {
            //     let reader = new FileReader();
            //     reader.onload = function (e) {
            //         file.uri = e.target.result;
            //         filee.push(file);
            //         Session.set("files", filee);
            //         console.log(file)
            //     }
            //     reader.readAsArrayBuffer(file);
            // });
        }
    },
    'submit #userCreateForm': function (event, t) {

        event.preventDefault();

        var fullname = $('#userFullname').val();
        var description = $('#userDescription').val();
        var contact = $('#userContact').val();
        var category = selectedCategory._id;
        var Category = selectedCategory.title;
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
        if (!userID && !filee) {
            sAlert.error("Please Upload Image");
            return;
        }

        var user = {
            _id: userID,
            fullname: fullname,
            description: description,
            images: [],
            service: category,
            userContent: content,
            createBy: Meteor.userId(),
            contact: contact
        };

        if (filee) {
            filee.forEach(item => {
                let file = item.uri;
                var mime = file.substr(file.indexOf('data:') + 5, file.indexOf(';bas') - 5);
//                 console.log(file);
                var data = file.substr(file.indexOf('base64,') + 7);


                let Item = {
                    data: data,
                    mime: mime,
                };
                console.log(Item);
                user.images.push(Item);
            })

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
                    FlowRouter.go('/admin/GRusers/' + userID);
                }
            });
        } else {
            Meteor.call('addNewUser', user, function (err) {
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
                    FlowRouter.go('/admin/GRusers');

                }
            });
        }

    },
    "autocompleteselect input": function (event, template, doc) {
        console.log("selected ", doc);
        alert(doc._id);
        selectedCategory = doc;
    },
    'select .btn-file :file': function (event, label) {
        var input = $(this).parents('.input-group').find(':text'),
            log = label;

        if (input.length) {
            input.val(log);
        } else {
          //  if (log) alert(log);
        }

    },
    'change .btn-file :file': function (event, ele) {
        var filename = ele.find('#userCoverImage').value.split('\\').pop();
        ele.$('#imgName').val(filename);
    }
});


removeUserCoverImage = (userImage) => {

    if (userImage !== null) {
        Meteor.call('removeAWSObject', userImage, (err, res) => {
            if (err) {
                sAlert.error(err.reason);
            }
        })
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