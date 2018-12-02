import { Meteor } from 'meteor/meteor';

Meteor.methods({

    'registerUser':  (userInfo)=> {
        console.log('register:::=>>>');
        try {
            Accounts.createUser({
                password: userInfo.password,
                username: userInfo.contact,
                email: userInfo.email,
                createdAt: new Date(),
                profile: {
                    role: userInfo.role,
                    // profileimage: null,
                    name: userInfo.name
                }
            });
        }
        catch (e) {
            console.log(e.message);

        }
    },

    'loginUser':(username,password)=> {
        // Meteor.loginWithPassword({email: username}, password, function(error) {
        //     console.log(error)
        // });
        //find user if exist from paramter email
        try {
            var user = null;
            Meteor.users.findOne({
                'emails.address': username
            }, function (err, res) {
                if (!err) {
                    user = res;
                }

            });
            if (user === null) {
                user = Meteor.users.findOne({
                    'username': username
                });
            }

            //if user is found
            if (user) {
                //authenticate user
                var result = Accounts._checkPassword(user, password);
                if (result.error) {
                    return result.error;
                } else {
                    return result;
                }
            } else {
                //if user is not found
                return {
                    error: "user not found"
                }
            }
        }
        catch (e) {
            console.log(e.message)
        }
    }
});





