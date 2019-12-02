/**
 * Created by Roshan on 6/27/2017.
 */
Meteor.startup(function () {

    sAlert.config({
        effect: '',
        position: 'bottom-right',
        timeout: 7000,
        html: false,
        onRouteClose: true,
        stack: true,
        // or you can pass an object:
        // stack: {
        //     spacing: 10 // in px
        //     limit: 3 // when fourth alert appears all previous ones are cleared
        // }
        offset: 0, // in px - will be added to first alert (bottom or top - depends of the position in config)
        beep: false,
        onClose: _.noop //
        // examples:
        // onClose: function() {
        //     /* Code here will be executed once the alert closes. */
        // }
    });

    //if(Meteor.isClient) {
    //    window.fbAsyncInit = function() {
    //        FB.init({
    //            appId      : '1491949654199425',
    //            status     : true,
    //            xfbml      : true,
    //            version    : 'v2.5'
    //        });
    //    };
    //}

});