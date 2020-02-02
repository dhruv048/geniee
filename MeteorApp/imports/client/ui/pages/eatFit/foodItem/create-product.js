/**
 * Created by Roshan on 6/20/2017.
 */
import {Meteor} from 'meteor/meteor';
import {Random} from 'meteor/random';
 import {EFCategories} from "../../../../../../lib/collections/eatFit/efCategories";
 import {EFProducts} from "../../../../../../lib/collections/eatFit/efProducts";

let productcoverImage = null;
let filee = [];
let productID = null;
let productcoverImageToRemoveAfterEdit = null;
let selectedCategory = null;
let Nutritions=[{id:Random.id([5]), label:'',value:''}];


Template.Create_ProductEF.helpers({
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
                    collection: EFCategories,
                    field: "title",
                    template: Template.categoryEF,
                    matchAll: true,
                }
            ]
        };
    },
    Nutritions:function () {
      return  Session.get("nutritions");
    }
});
Template.Create_ProductEF.onCreated = () => {
    Session.set("files", []);
    Session.set('nutritions',Nutritions);
};
Template.Create_ProductEF.rendered = () => {
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
    if( Session.get('producttoEdit')) {
        $(".summernote").summernote("code", Session.get('producttoEdit').productContent);
    }
    Session.set("files", []);
    Session.set('nutritions',Nutritions);
};
Template.Create_ProductEF.events({
    'change #productCoverImage': function (event, template) {
        if (productcoverImage != null) {
            productcoverImageToRemoveAfterEdit = productcoverImage;
        }
        let FileList = event.currentTarget.files;
        if (event.currentTarget.files && event.currentTarget.files[0]) {
            console.log(event.currentTarget.files);
            handleFileSelect(event)
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
        var discount = $('#productDiscount').val();
        var contact = $('#productContact').val();
        var quantity = $('#productQuantity').val();
        var sizes = $('#productSizes').val();
        var colors = $('#productColors').val();
        var description = $('#productDescription').val();
        var isVeg = event.target.radioisVeg.value;
        var isActive=$('.checkbox').is(":checked");
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
            title: title,
            description: description,
            images: [],
            category: category,
            createBy: Meteor.userId(),
            unit: unit,
            price: price,
            discount:discount,
            content: content,
            // quantity: quantity,
            // sizes: sizes ? (sizes.includes(';') ? sizes.split(';') : [sizes]) : [],
            // colors: colors ? (colors.includes(';') ? colors.split(';') : [colors]) : [],
            isActive:isActive,
            isVeg :isVeg,
            nutritions:Nutritions,
        };
        if(productID){
            product._id= productID;
        }

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
            console.log(product);
            Meteor.call('addNewProductEF', product, function (err) {
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
        // alert(doc._id);
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
    },

    'click  #addMore':function(event,label){
        event.preventDefault();
        Nutritions.push({id:Random.id([5]),label:'',value:''});
        Session.set('nutritions',Nutritions)
    },
    'change .NutritionLabel':function (event,ele) {
       let id=event.currentTarget.getAttribute('data-id');
       console.log(event.currentTarget.value,id)
       Nutritions.forEach(item=>{
           if(item.id==id){
               item.label=event.currentTarget.value;
           }
       })
    },
    'change .NutritionValue':function (event,ele) {
        let id=event.currentTarget.getAttribute('data-id');
        console.log(event.currentTarget.value,id)
        Nutritions.forEach(item=>{
            if(item.id==id){
                item.value=event.currentTarget.value;
            }
        })
    }
});


removeProductCoverImage = (productImage) => {

    if (productImage !== null) {
        // Meteor.call('removeAWSObject', productImage, (err, res) => {
        //     if (err) {
        //         sAlert.error(err.reason);
        //     }
        // })
    }
}


Template.Create_ProductEF.onCreated(() => {
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
                console.log('file:',file);
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
