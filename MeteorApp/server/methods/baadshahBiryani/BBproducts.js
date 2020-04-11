import {Meteor} from 'meteor/meteor';
import {EFProducts} from "../../../lib/collections/eatFit/efProducts";
const fs = require('fs');
Meteor.methods({
    'getProductsBB': () => {
        let JsonPath=process.env.NODE_ENV === "production"? Assets.absoluteFilePath('bbItems.json') :process.env.PWD + '/private/bbItems.json';
        //const products =JSON.parse(Assets.getText("bbItems.json"));
        // const products =JSON.parse(Assets.getText(JsonPath));
        // console.log(JsonPath,products)


        let rawdata = fs.readFileSync(JsonPath);
        let products = JSON.parse(rawdata);
      //  console.log(JsonPath,products);
        return products;
    },

    'getSingleProductBB': (Id) => {
        return EFProducts.findOne({_id: Id});
    },

    'getSimilarProductBB': (Id) => {
        let products = JSON.parse(Assets.getText("bbItems.json"));
        let similarProd=products.filter(item=> item._id!==Id);
        return similarProd;
    }

})

