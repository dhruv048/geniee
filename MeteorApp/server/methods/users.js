import { Meteor } from 'meteor/meteor';

Meteor.methods({

    'registerUser':  (userInfo)=> {
        var user= Meteor.user();
        var createdBy=null;
        if(user.profile.role===1 || user.profile.role===2   ){
          createdBy= user._id;
        }
        else if(user.profile.role===0){
         createdBy=user.profile.createdBy
        }
        try {
            Accounts.createUser({
                password: userInfo.password,
                username: userInfo.contact,
                email: userInfo.email,
                createdAt: new Date(),
                profile: {
                   // role: userInfo.role,
                    role: user.profile.role===2 ? 1:0,
                    // profileimage: null,
                    name: userInfo.name,
                    contactNo:userInfo.contact,
                    createdBy:createdBy,
                }
            });
        }
        catch (e) {
            console.log(e.message);
            throw new Meteor.Error(401,e.message);

        }
    },

    'signUpUser':  (userInfo)=> {
        try {
            Accounts.createUser(userInfo);
        }
        catch (e) {
            console.log(e.message);
            throw new Meteor.Error(401,e.message);

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
                throw new Meteor.Error(404, "user not found")
            }
        }
        catch (e) {
            console.log(e.message)
            throw new Meteor.Error(403, e.message);
        }
    }
});





