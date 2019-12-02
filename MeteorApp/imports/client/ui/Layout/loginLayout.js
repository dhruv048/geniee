let currentUserMessage;
Template.loginLayout.events({
    'click #login-button'(e, t) {
        e.preventDefault();
        Session.set('loginErrorMessage', false);
        let email = t.find('#exampleInputEmail').value;
        let password = t.find('#exampleInputPassword').value;
        console.log("going to Sign In")
        Meteor.loginWithPassword({username: email}, password, function (err) {
            if (err) {
                console.log('Error on login ' + err.reason);
                return Session.set('loginErrorMessage', err.reason);


            } else {
                // FlowRouter.go('/notFound')
                console.log("Login Success." + Meteor.user())
                FlowRouter.go('/admin');
            }
        });

    },

    // 'click #sign-up-button'() {
    //      Router.go('/sign-up');
    // }
});


Template.loginLayout.helpers({
        errorMessage() {
            return Session.get('loginErrorMessage');
        }
    },

    (currentUserMessage = function () {
        if (Meteor.user()) {
            return `Logged in as: ${Meteor.user().emails[0].address}`;
        } else {
            return false;
        }
    })
);

