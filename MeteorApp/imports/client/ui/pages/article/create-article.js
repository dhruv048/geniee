/**
 * Created by Roshan on 6/20/2017.
 */

import {Article} from "../../../../../lib/collections/article";
import {Meteor} from 'meteor/meteor';

let articlecoverImage = null;
let filee;
let articleID = null;
let articlecoverImageToRemoveAfterEdit = null;
let selectedDoctor = null;


Template.Create_Article.helpers({
    Article: () => {
        return Session.get('articletoEdit');
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
Template.Create_Article.rendered = () => {
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
    $(".summernote").summernote("code", Session.get('articletoEdit').articleContent);
};
Template.Create_Article.events({
    'change #articleCoverImage': function (event, template) {
        if (articlecoverImage != null) {
            articlecoverImageToRemoveAfterEdit = articlecoverImage;
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
    'submit #articleCreateForm': function (event, t) {

        event.preventDefault();

        // var img = $('#img-upload');
        // var canvas = img.cropper('getCroppedCanvas');
        // var canvaURL = canvas.toDataURL('image/jpeg');
        // $('#croppedImage').attr('src', canvaURL);

        var title = $('#articleTitle').val();
        //   var description = $('#articleDescription').val();
        // var owner = $('#articleOwner').val();
        var owner = selectedDoctor;
        //$('#content').val($('#editor').html());
        var content = $('#summernote').summernote('code');

        if (!selectedDoctor) {
            sAlert.error("Please Select Doctor");
            return;
        }
        if (title.length < 4) {
            sAlert.error("Please Type Title");
            return;
        }
        // if (description.length < 4) {
        //     sAlert.error("Please Type Description");
        //     return;
        // }
        if (!articleID && !filee) {
            sAlert.error("Please Upload Image");
            return;
        }

        var article = {
            _id: articleID,
            articleTitle: title,
            //     articleDescription: description,
            articleImage: articlecoverImage,
            owner: owner,
            articleContent: content,
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
            article.articleImage = "ArticleImage/" + name;
            Meteor.call('uploadImage', file, 'ArticleImage', (err, res) => {
                if (err) {
                    console.log(err.reason)

                }
                else {
                    article.articleImage = "ArticleImage/" + name;
                }
            });
        }

        if (articleID != null) {
            Meteor.call('updateArticle', article, function (err) {
                if (err) {
                    sAlert.error(err.message);
                    removeArticleCoverImage(article.articleImage);
                }
                else {
                    removeArticleCoverImage(articlecoverImage);
                    Session.set("subCategory", null);
                    sAlert.success("Article '" + article.title + "' Updated Successfully!!!");
                    t.find("form").reset();
                    $(".summernote").summernote("code", "");
                    $('#img-upload').attr('src', '');
                    FlowRouter.go('/admin/article/' + articleID);
                }
            });
        } else {
            Meteor.call('AddArticles', article, function (err) {
                if (err) {
                    sAlert.error(err.message);
                    removeArticleCoverImage(article.articleImage);
                }
                else {
                    sAlert.success("Article '" + article.title + "' Added Successfully!!!")
                    t.find("form").reset();
                    $(".summernote").summernote("code", "");
                    $('#img-upload').attr('src', '');
                    FlowRouter.go('/admin/articles');
                }
            });
        }

    },
    "autocompleteselect input": function (event, template, doc) {
        console.log("selected ", doc);
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
        var filename = ele.find('#articleCoverImage').value.split('\\').pop();
        ele.$('#imgName').val(filename);
    }
});


removeArticleCoverImage = (articleImage) => {

    if (articleImage !== null) {
        Meteor.call('removeAWSObject', articleImage, (err, res) => {
            if (err) {
                sAlert.error(err.reason);
            }
        })
    }
}


Template.Create_Article.onCreated(() => {


    articleID = FlowRouter.getParam('articleId');

    if (articleID != null) {
        var interval = Meteor.setInterval(function () {
            var articletoEdit = Article.findOne({_id: articleID});
            if (articletoEdit != null) {
                articlecoverImage = articletoEdit.articleImage;
                Session.set('articletoEdit', articletoEdit);
                //  $('.trumbowyg-editor').val(articletoEdit.content);
                $(".summernote").summernote("code", articletoEdit.articleContent);
                Meteor.clearInterval(interval);
            }
        }, 500)
    }


});


