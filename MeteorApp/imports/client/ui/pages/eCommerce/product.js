/**
 * Created by Roshan on 6/30/2017.
 */
// import {Products} from "../../../../lib/collections/c";

Template.Product_Detail.helpers({

    Product: () => {
        var productId = FlowRouter.getParam("productId");
        return Products.findOne({_id: productId});
    },
    urll: () => {
        return FlowRouter.url();
    }
});

Template.Product_Detail.rendered = function () {
    // try {
    //     FB.XFBML.parse();
    // }catch(e) {
    //     console.log(e.message);
    // }
};

