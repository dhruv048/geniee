/**
 * Created by Roshan on 8/14/2019.
 */

// FlowRouter.route('/adminn', {
//    action: function (params, queryParams) {
//        BlazeLayout.render("");
//        document.title = "Geniee-Home";
//        console.log("Yeah! We are on Home Page");
//    }
// });


var loggedIn = FlowRouter.group({
    triggersEnter: [function () {
        if (!(Meteor.loggingIn() || Meteor.userId())) {
            console.log('LoggedIn',Meteor.user());
            route = FlowRouter.current();

            if (!(route.route.name == 'login')) {
                Session.set('redirectAfterLogin', route.path)
            }
            FlowRouter.go('/admin/login');
        }
    }],

});


Accounts.onLogin(function () {
    console.log('OnLogin',Meteor.user());
    Session.set('loggedUserRole',Meteor.user().profile.role)
    redirect = Session.get("redirectAfterLogin");
    if (redirect != null) {
        if (redirect != '/admin/login')
            FlowRouter.go(redirect);
        else
            FlowRouter.go('/admin/');

    }
});


var adminRoutes = loggedIn.group({
    prefix: '/admin',
    name: 'admin',
    triggersEnter: [function (context, redirect) {
        console.log('running group triggers');
    }]
});


// handling /admin route
adminRoutes.route('/', {
    name: 'dashboard',
    action: function () {
        if (Session.get('loggedUserRole') == 111) {
            BlazeLayout.render('adminMainLayoutGR', {main: ""});
            document.title = "Geniee-Repair Dashboard";
        }
        else if (Session.get('loggedUserRole')== 2) {
            BlazeLayout.render('adminMainLayout', {main: "dashboard"});
            document.title = "Geniee-Admin Dashboard";
        }
        else if (Session.get('loggedUserRole')== 222) {
            BlazeLayout.render('adminMainLayoutEF', {main: ""});
            document.title = "Eat-Fit Dashboard";
        }
        else {
            Meteor.logout();
            FlowRouter.go('/admin/login');
        }
    },
    triggersEnter: [function (context, redirect) {
        Meteor.subscribe('all_users');
        Meteor.subscribe('all_products');
        Meteor.subscribe("all_Q&A");
    }]
});

adminRoutes.route('/login', {
    name: 'login',
    action: function (params, queryParams) {
        BlazeLayout.render("loginLayout");
        console.log("Yeah! We are on the Login Page");
    }
})
adminRoutes.route('/advertisements', {
    name: 'Advertisements',
    action: function () {
        BlazeLayout.render('adminMainLayout', {main: "Advertisements"});
        document.title = "Geniee-Admin Advertisements";
    },
    triggersEnter: [function (context, redirect) {
        Meteor.subscribe('adminGallery');
    }]
});
adminRoutes.route('/speciizations', {
    name: 'Specilizations',
    action: function (params, queryParams) {
        BlazeLayout.render('adminMainLayout', {main: 'specilizations'});
    },
    triggersEnter: [function () {
        Meteor.subscribe('commonUtils');
    }]
})

adminRoutes.route('/categories', {
    name: 'Categories',
    action: function (params, queryParams) {
        if(Session.get('loggedUserRole')==111) {
            BlazeLayout.render('adminMainLayoutGR', {main: 'categoriesGR'});
        }
        else if(Session.get('loggedUserRole')==2){
            BlazeLayout.render('adminMainLayout', {main: 'categories'});
        }
        else   if(Session.get('loggedUserRole')==222) {
            BlazeLayout.render('adminMainLayoutEF', {main: 'categoriesEF'});
        }
    },
    triggersEnter: [function () {
        Meteor.subscribe('storeCategory');
        Meteor.subscribe('allgrcategories');
        Meteor.subscribe('allgrcategoriesEF');
    }]
})

adminRoutes.route('/users', {
    name: 'Users',
    action: function (params, queryParams) {
        BlazeLayout.render('adminMainLayout', {main: 'Users'});
    },
    triggersEnter: [function () {
        Meteor.subscribe('allUsersforWeb');
    }]
})

adminRoutes.route('/articles', {
    name: 'Articles',
    action() {
        BlazeLayout.render('adminMainLayout', {main: 'Articles'});
        document.title = "Geniee-Admin Articles";
    },
    triggersEnter: [function (context, redirect) {
        Meteor.subscribe("articlesByVisitorUser");
    }]
});

adminRoutes.route('/products', {
    name: 'Products',
    action() {
        if(Session.get('loggedUserRole')==222) {
            BlazeLayout.render('adminMainLayoutEF', {main: 'ProductsEF'});
            document.title = "Eat-Fit Products";
        }
        else if (Session.get('loggedUserRole')==2) {
            BlazeLayout.render('adminMainLayoutEF', {main: 'ProductsEF'});
            document.title = "Geniee-Admin Products";
        }
        else
            FlowRouter.go("/");

    },
    triggersEnter: [function (context, redirect) {
        Meteor.subscribe("allProducts");
        Meteor.subscribe("allProductsEF");
    }]
});


adminRoutes.route('/create-article', {
    name: 'createArticle',
    action() {
        BlazeLayout.render('adminMainLayout', {main: 'Create_Article'});
        document.title = "Geniee-Admin Add article";
    },
    triggersEnter: [function (context, redirect) {
        Meteor.subscribe('usersforArticleCreate');
    }]
});
adminRoutes.route('/create-product', {
    name: 'createProduct',
    action() {
        if(Session.get('loggedUserRole')==222) {
            BlazeLayout.render('adminMainLayoutEF', {main: 'Create_ProductEF'});
            document.title = "Eat-Fit Add product";
        }
        else if(Session.get('loggedUserRole')==2){
            BlazeLayout.render('adminMainLayout', {main: 'Create_Product'});
            document.title = "Geniee-Admin Add product";
        }
        else
            FlowRouter.go("/");
    },
    triggersEnter: [function (context, redirect) {
        Meteor.subscribe('allServices');
        Meteor.subscribe('allcategoriesEF');
    }]
});

adminRoutes.route('/product/:productId', {
    triggersEnter: [function (context, redirect) {
        console.log("param:" + FlowRouter.getParam("productId"));
        Meteor.subscribe("singleProduct", context.params.productId);
        Meteor.subscribe("singleProductEF", context.params.productId);
    }],
    name: 'Article',
    action: (params) => {
        if(Session.get('loggedUserRole')==222) {
            console.log("param:" + params.productId);
            Meteor.subscribe("singleProductEF", params.productId);
            BlazeLayout.render('adminMainLayoutEF', {main: 'Product_DetailEF'});
            document.title = "Eat-Fit Product";
        }
        else if(Session.get('loggedUserRole')==2){
            console.log("param:" + params.productId);
            Meteor.subscribe("singleProduct", params.productId);
            BlazeLayout.render('adminMainLayout', {main: 'Product_Detail'});
            document.title = "Geniee-Admin Product";
        }

    }
});
adminRoutes.route('/edit-article/:articleId', {
    name: 'Edit Article',
    action() {
        BlazeLayout.render('adminMainLayout', {main: 'Create_Article'});
        document.title = "Geniee-Admin Edit article";
    },
    triggersEnter: [function (context, redirect) {
        Meteor.subscribe('menuItems');
        Meteor.subscribe('articles');
        Meteor.subscribe('files.images.all');
    }]
});

adminRoutes.route('/create-news', {
    name: 'createNews',
    action() {
        BlazeLayout.render('adminMainLayout', {main: 'Create_News'});
        document.title = "Geniee-Admin Add News";
    },
    triggersEnter: [function (context, redirect) {
        Meteor.subscribe('doctorsToAdd');
    }]
});

adminRoutes.route('/upload-image', {
    name: 'uploadImage',
    action() {
        BlazeLayout.render('adminMainLayout', {main: 'UploadImage'});
        document.title = "Geniee-Admin Upload Image";
    },
    triggersEnter: [function () {
        Meteor.subscribe('files.images.all');
    }]
});

adminRoutes.route('/edit-news/:newsId', {
    name: 'Edit News',
    action() {
        BlazeLayout.render('adminMainLayout', {main: 'Create_News'});
        document.title = "Geniee-Admin Edit News";
    },
    triggersEnter: [function (context, redirect) {
        Meteor.subscribe('news');
        Meteor.subscribe('files.images.all');
    }]
});

adminRoutes.route('/news/:newsId', {
    triggersEnter: [function (context, redirect) {
        console.log("param:" + FlowRouter.getParam("newsId"));
        Meteor.subscribe("singleNews", context.params.newsId);
    }],
    name: 'News',
    action: (params) => {
        console.log("param:" + params.newsId);
        Meteor.subscribe("singleNews", params.articleId);
        BlazeLayout.render('adminMainLayout', {main: 'News_Detail'});
        document.title = "Geniee-Admin News";
    }
});
adminRoutes.route('/news-all', {
    name: 'News',
    action() {
        BlazeLayout.render('adminMainLayout', {main: 'Newss'});
        document.title = "Geniee-Admin News";
    },
    triggersEnter: [function (context, redirect) {
        Meteor.subscribe("NewsList");
    }]
});

adminRoutes.route('/create-advertisement', {
    name: 'createNews',
    action() {
        BlazeLayout.render('adminMainLayout', {main: 'Create_Advertisement'});
        document.title = "Geniee-Admin Add Advertisement";
    },
    triggersEnter: [function () {
        Meteor.subscribe('files.images.all');
    }]
});

adminRoutes.route('/edit-advertisement/:addId', {
    name: 'Edit News',
    action() {
        BlazeLayout.render('adminMainLayout', {main: 'Create_Advertisement'});
        document.title = "Geniee-Admin Edit News";
    },
    triggersEnter: [function (context, redirect) {
        // Meteor.subscribe('adds');
        Meteor.subscribe('files.images.all');
    }]
});

adminRoutes.route('/advertisement/:addId', {
    triggersEnter: [function (context, redirect) {
        //console.log("param:"+context.Params);
        Meteor.subscribe("adds");
        Meteor.subscribe('files.images.all');
    }],
    name: 'News',
    action: (params) => {
        console.log("param:" + params);
        BlazeLayout.render('adminMainLayout', {main: 'advertisement'});
        document.title = "Updated Krishi";
    }
});


adminRoutes.route('/advertisement-all', {
    name: 'Advertisement',
    action() {
        BlazeLayout.render('adminMainLayout', {main: 'Advertisement_All'});
        document.title = "Geniee-";
    },
    triggersEnter: [function (context, redirect) {
        Meteor.subscribe("adds");
        Meteor.subscribe('files.images.all');
    }]
});


adminRoutes.route('/create-notification', {
    name: 'createNotification',
    action() {
        BlazeLayout.render('adminMainLayout', {main: 'Create_Notification'});
        document.title = "Geniee-Admin Add Notification";
    },
    triggersEnter: [function () {
        Meteor.subscribe('files.images.all');
    }]
});

adminRoutes.route('/edit-notification/:notificationId', {
    name: 'Edit Notification',
    action() {
        BlazeLayout.render('adminMainLayout', {main: 'Create_Notification'});
        document.title = "Geniee-Admin Edit Notification";
    },
    triggersEnter: [function (context, redirect) {
        Meteor.subscribe('notification');
        Meteor.subscribe('files.images.all');
    }]
});

adminRoutes.route('/notification/:notificationId', {
    triggersEnter: [function (context, redirect) {
        //console.log("param:"+context.Params);
        Meteor.subscribe("notification");
        Meteor.subscribe('files.images.all');
    }],
    name: 'Notification',
    action: (params) => {
        console.log("param:" + params);
        BlazeLayout.render('adminMainLayout', {main: 'notification'});
        document.title = "Updated Krishi-Admin Notification";
    }
});
adminRoutes.route('/notification-all', {
    name: 'Notification',
    action() {
        BlazeLayout.render('adminMainLayout', {main: 'Notification_All'});
        document.title = "Geniee-Admin Notification";
    },
    triggersEnter: [function (context, redirect) {
        Meteor.subscribe("notification");
        Meteor.subscribe('files.images.all');
    }]
});



adminRoutes.route('/typography', {
    name: 'Typography',
    action() {
        BlazeLayout.render('adminMainLayout', {main: 'typography'});
        document.title = "Geniee-Admin Typography";
    }

});

adminRoutes.route('/article/:articleId', {
    triggersEnter: [function (context, redirect) {
        console.log("param:" + FlowRouter.getParam("articleId"));
        Meteor.subscribe("singleArticle", context.params.articleId);
    }],
    name: 'Article',
    action: (params) => {
        console.log("param:" + params.articleId);
        Meteor.subscribe("singleArticle", params.articleId);
        BlazeLayout.render('adminMainLayout', {main: 'Article_Detail'});
        document.title = "Geniee-Admin Article";
    }
});



adminRoutes.route('/tables', {
    triggersEnter: [function (context, redirect) {
        ////console.log("param:"+context.Params);
        //Meteor.subscribe("profileImages");
        //Meteor.subscribe("users");
    }],
    name: 'Tables',
    action: (params) => {
        BlazeLayout.render('adminMainLayout', {main: 'Admin_Tables'});
        document.title = "Geniee-Admin Tables";
    }
});

adminRoutes.notFound = {
    name: '404',
    action() {
        BlazeLayout.render('adminMainLayout', {main: 'notFound'});
        document.title = "Geniee-Admin 404";
    },
};


var clientRoutes = FlowRouter.group({
    prefix: '',
    name: 'Client',
    triggersEnter: [function (context, redirect) {
        console.log('running client group triggers');
    }]
});

clientRoutes.route('/news-all', {
    name: 'News',
    action() {
        BlazeLayout.render('Client_Layout', {main: 'News_All'});
        document.title = "Geniee-Admin News";
    },
    triggersEnter: [function (context, redirect) {

    }]
});

clientRoutes.notFound = {
    name: '404',
    action() {
        BlazeLayout.render('Client_Layout', {main: 'notFound'});
        document.title = "Geniee-Admin 404";
    },
};


clientRoutes.route('/', {
    name: 'dashboard',
    action: function () {
        BlazeLayout.render('ClientMainLayout');
        document.title = "Welcome to Geniee";
    },
    triggersEnter: [function (context, redirect) {
        console.log('running /client trigger');
    }]
});


clientRoutes.route('/#/verify-email/:token', {
    name: 'dashboard',
    action: function () {
        var token = FlowRouter.getParam("token");
        console.log(token);
        Meteor.call('verifyAccount', token, function (err, res) {
            if (!err) {
                FlowRouter.go("/verified");
            }
            else {
                console.log(res);
                BlazeLayout.render('main_Layout', {main: 'verifyEmail'})
            }
        });

    },
    triggersEnter: [function (context, redirect) {
        console.log('running /verifyEmail trigger');
    }]
});
clientRoutes.route('/verified', {
    name: 'dashboard',
    action: function () {
        BlazeLayout.render('main_Layout', {main: 'emailVerifySuccess'})
    }
});
clientRoutes.route("/article/:articleId", {
    name: 'Article',
    action: () => {
        BlazeLayout.render('Client_Layout', {main: 'article'});
        document.title = "Geniee Article";
    },
    triggersEnter: [function () {
        Meteor.subscribe("articles");
        Meteor.subscribe('files.images.all');
    }]
});


clientRoutes.route("/contact-us", {
    name: 'Contact Us',
    action: () => {
        BlazeLayout.render('Client_Layout', {main: 'Contact_Us'});
        document.title = "Geniee Contact Us";
    },
    triggersEnter: [function () {

    }]


});

/* ------
Geniee Repair : Admin Categories
*/
adminRoutes.route('/GRcategories', {
    name: 'GRCategories',
    action: function (params, queryParams) {
        BlazeLayout.render('adminMainLayout', {main: 'GRcategories'});
    },
    triggersEnter: [function () {
        Meteor.subscribe('allgrcategories');
    }]
})
