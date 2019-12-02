/**
 * Created by Roshan on 6/30/2017.
 */
import {News} from "../../../../../lib/collections/news";

Template.News_Detail.helpers({

    News: () => {
        var newsId = FlowRouter.getParam("newsId");
        return News.findOne({_id: newsId});
    },
    urll: () => {
        return FlowRouter.url();
    }
});

Template.News_Detail.rendered = function () {
    // try {
    //     FB.XFBML.parse();
    // }catch(e) {
    //     console.log(e.message);
    // }
};

