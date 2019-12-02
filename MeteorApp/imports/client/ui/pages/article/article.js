/**
 * Created by Roshan on 6/30/2017.
 */
import {Article} from "../../../../../lib/collections/article";

Template.Article_Detail.helpers({

    Article: () => {
        var articleId = FlowRouter.getParam("articleId");
        return Article.findOne({_id: articleId});
    },
    urll: () => {
        return FlowRouter.url();
    }
});

Template.Article_Detail.rendered = function () {
    // try {
    //     FB.XFBML.parse();
    // }catch(e) {
    //     console.log(e.message);
    // }
};

