/**
 * Created by Roshan on 6/20/2017.
 */

import {News} from "../../../../../lib/collections/news";
import {Meteor} from 'meteor/meteor';

let newscoverImage = null;
let filee;
let newsID = null;
let newscoverImageToRemoveAfterEdit = null;
let selectedDoctor = null;


Template.Create_News.helpers({
    News: () => {
        return Session.get('newstoEdit');
    },
    doctors: () => {
        return Meteor.users.find({'profile.role': 1});
    },

    settings: function () {
        return {
            position: "",
            limit: 5,
            rules: [
                {
                    collection: Meteor.users,
                    field: "profile.name",
                    template: Template.doctor,
                    matchAll: true,
                }
            ]
        };
    }
});
Template.Create_News.rendered = () => {
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
    $(".summernote").summernote("code", Session.get('newstoEdit').newsContent);
};
Template.Create_News.events({
    'change #newsCoverImage': function (event, template) {
        if (newscoverImage != null) {
            newscoverImageToRemoveAfterEdit = newscoverImage;
        }
        if (event.currentTarget.files && event.currentTarget.files[0]) {
            Session.set("file", event.currentTarget.files[0]);
            filee = event.currentTarget.files[0];
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#img-upload').cropper('destroy');
                $('#img-upload').attr('src', e.target.result);
                $('#img-upload').cropper({
                    aspectRatio: 7 / 4,
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
    'submit #newsCreateForm': function (event, t) {

        event.preventDefault();

        // var img = $('#img-upload');
        // var canvas = img.cropper('getCroppedCanvas');
        // var canvaURL = canvas.toDataURL('image/jpeg');
        // $('#croppedImage').attr('src', canvaURL);

        var title = $('#newsTitle').val();
        //    var description = $('#newsDescription').val();
        // var owner = $('#newsOwner').val();
        var owner = selectedDoctor;
        //$('#content').val($('#editor').html());
        var content = $('#summernote').summernote('code');

        // if (!selectedDoctor) {
        //     sAlert.error("Please Select Doctor");
        //     return;
        // }
        if (title.length < 4) {
            sAlert.error("Please Type Title");
            return;
        }
        // if (description.length < 4) {
        //     sAlert.error("Please Type Description");
        //     return;
        // }
        if (!newsID && !filee) {
            sAlert.error("Please Upload Image");
            return;
        }

        var news = {
            _id: newsID,
            newsTitle: title,
            //   newsDescription: description,
            newsImage: newscoverImage,
            owner: owner,
            newsContent: content,
            createBy: Meteor.userId()
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
            news.newsImage = "NewsImage/" + name;
            Meteor.call('uploadImage', file, 'NewsImage', (err, res) => {
                if (err) {
                    console.log(err.reason)

                }
                else {
                    news.newsImage = "NewsImage/" + name;
                }
            });
        }

        if (newsID != null) {
            Meteor.call('updateNews', news, function (err) {
                if (err) {
                    sAlert.error(err.message);
                    removeNewsCoverImage(news.newsImage);
                }
                else {
                    removeNewsCoverImage(newscoverImage);
                    Session.set("subCategory", null);
                    sAlert.success("News '" + news.title + "' Updated Successfully!!!");
                    t.find("form").reset();
                    $(".summernote").summernote("code", "");
                    $('#img-upload').attr('src', '');
                    FlowRouter.go('/admin/news/' + newsID);
                }
            });
        } else {
            Meteor.call('AddNewss', news, function (err) {
                if (err) {
                    sAlert.error(err.message);
                    removeNewsCoverImage(news.newsImage);
                }
                else {
                    sAlert.success("News '" + news.newsTitle + "' Added Successfully!!!")
                    t.find("form").reset();
                    $(".summernote").summernote("code", "");
                    $('#img-upload').attr('src', '');
                    FlowRouter.go('/admin/news-all');
                }
            });
        }

    },
    "autocompleteselect input": function (event, template, doc) {
        console.log("selected ", doc);
        alert(doc._id);
        selectedDoctor = doc._id;
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
        var filename = ele.find('#newsCoverImage').value.split('\\').pop();
        ele.$('#imgName').val(filename);
    }
});


removeNewsCoverImage = (newsImage) => {

    if (newsImage !== null) {
        Meteor.call('removeAWSObject', newsImage, (err, res) => {
            if (err) {
                sAlert.error(err.reason);
            }
        })
    }
}


Template.Create_News.onCreated(() => {


    newsID = FlowRouter.getParam('newsId');

    if (newsID != null) {
        var interval = Meteor.setInterval(function () {
            var newstoEdit = News.findOne({_id: newsID});
            if (newstoEdit != null) {
                newscoverImage = newstoEdit.newsImage;
                Session.set('newstoEdit', newstoEdit);
                //  $('.trumbowyg-editor').val(newstoEdit.content);
                $(".summernote").summernote("code", newstoEdit.newsContent);
                Meteor.clearInterval(interval);
            }
        }, 500)
    }


});


