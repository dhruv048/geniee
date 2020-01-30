/**
 * Created by Roshan on 6/30/2017.
 */

 import {EFProducts} from "../../../../../../lib/collections/eatFit/efProducts";

Template.Product_DetailEF.helpers({

    Product: () => {
        var productId = FlowRouter.getParam("productId");
        console.log( EFProducts.findOne({_id: productId}))
        return EFProducts.findOne({_id: productId});
    },
    urll: () => {
        return FlowRouter.url();
    }
});

Template.Product_DetailEF.rendered = function () {
    // try {
    //     FB.XFBML.parse();
    // }catch(e) {
    //     console.log(e.message);
    // }
};

