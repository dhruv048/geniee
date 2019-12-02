/**
 * Created by Roshan on 6/20/2017.
 */

// import {Products, Category} from "../../../../../lib/collections/eCommerce";
import {Meteor} from 'meteor/meteor';

let productcoverImage = null;
let filee = [];
let productID = null;
let productcoverImageToRemoveAfterEdit = null;
let selectedCategory = null;


Template.Create_Product.helpers({
    Product: () => {
        return Session.get('producttoEdit');
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
                    template: Template.category,
                    matchAll: true,
                }
            ]
        };
    }
});
Template.Create_Product.onCreated = () => {
    Session.set("files", []);
};
Template.Create_Product.rendered = () => {
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
    $(".summernote").summernote("code", Session.get('producttoEdit').productContent);
    Session.set("files", []);
};
Template.Create_Product.events({
    'change #productCoverImage': function (event, template) {
        if (productcoverImage != null) {
            productcoverImageToRemoveAfterEdit = productcoverImage;
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
    'submit #productCreateForm': function (event, t) {

        event.preventDefault();

        // var img = $('#img-upload');
        // var canvas = img.cropper('getCroppedCanvas');
        // var canvaURL = canvas.toDataURL('image/jpeg');
        // $('#croppedImage').attr('src', canvaURL);

        var title = $('#productTitle').val();
        var unit = $('#productUnit').val();
        var price = $('#productPrice').val();
        var contact = $('#productContact').val();
        var quantity = $('#productQuantity').val();
        var sizes = $('#productSizes').val();
        var colors = $('#productColors').val();
        var description = $('#productDescription').val();
        // var owner = $('#productOwner').val();
        var category = selectedCategory._id;
        var Category = selectedCategory.title;
        //$('#content').val($('#editor').html());
        var content = $('#summernote').summernote('code');

        if (!selectedCategory) {
            sAlert.error("Please Select Category");
            return;
        }
        if (title.length < 4) {
            sAlert.error("Please Type Title");
            return;
        }
        if (description.length < 4) {
            sAlert.error("Please Type Description");
            return;
        }
        if (!productID && !filee) {
            sAlert.error("Please Upload Image");
            return;
        }

        var product = {
            _id: productID,
            title: title,
            description: description,
            images: [],
            service: category,
            productContent: content,
            createBy: Meteor.userId(),
            unit: unit,
            price: price,
            contact: contact,
            quantity: quantity,
            sizes: sizes ? (sizes.includes(';') ? sizes.split(';') : [sizes]) : [],
            colors: colors ? (colors.includes(';') ? colors.split(';') : [colors]) : []
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
                product.images.push(Item);
            })

        }

        if (productID != null) {
            Meteor.call('updateProduct', product, function (err) {
                if (err) {
                    sAlert.error(err.message);
                    removeProductCoverImage(product.productImage);
                }
                else {
                    removeProductCoverImage(productcoverImage);
                    Session.set("subCategory", null);
                    sAlert.success("Product '" + product.title + "' Updated Successfully!!!");
                    t.find("form").reset();
                    $(".summernote").summernote("code", "");
                    $('#img-upload').attr('src', '');
                    filee = [];
                    FlowRouter.go('/admin/product/' + productID);
                }
            });
        } else {
            Meteor.call('addNewProduct', product, function (err) {
                if (err) {
                    sAlert.error(err.message);
                    removeProductCoverImage(product.productImage);
                }
                else {
                    sAlert.success("Product '" + product.title + "' Added Successfully!!!")
                    t.find("form").reset();
                    $(".summernote").summernote("code", "");
                    $('#img-upload').attr('src', '');
                    filee = [];
                    FlowRouter.go('/admin/products');

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
        var filename = ele.find('#productCoverImage').value.split('\\').pop();
        ele.$('#imgName').val(filename);
    }
});


removeProductCoverImage = (productImage) => {

    if (productImage !== null) {
        Meteor.call('removeAWSObject', productImage, (err, res) => {
            if (err) {
                sAlert.error(err.reason);
            }
        })
    }
}


Template.Create_Product.onCreated(() => {


    productID = FlowRouter.getParam('productId');

    if (productID != null) {
        var interval = Meteor.setInterval(function () {
            var producttoEdit = Products.findOne({_id: productID});
            if (producttoEdit != null) {
                productcoverImage = producttoEdit.productImage;
                Session.set('producttoEdit', producttoEdit);
                //  $('.trumbowyg-editor').val(producttoEdit.content);
                $(".summernote").summernote("code", producttoEdit.productContent);
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
