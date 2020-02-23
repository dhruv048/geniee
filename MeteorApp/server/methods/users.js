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
    },

    'forgotPasswordCustom': (email) => {
        console.log(email)
        let user = Accounts.findUserByEmail(email);
        // try {
        if (!user) {
            throw new Meteor.Error("User not found");
        }

        const emails = pluckAddresses(user.emails);
        const caseSensitiveEmail = emails.find(
            email => email.toLowerCase() === email.toLowerCase()
        );
        // const {email: realEmail, userr, token} =
        //  Accounts.generateResetToken(user._id, email, 'resetPassword');
        const token = randomNum().toString();
        const tokenRecord = {
            token,
            email,
            when: new Date()
        };
        tokenRecord.reason = 'reset';
        Meteor.users.update({_id: user._id}, {
            $set: {
                'services.password.reset': tokenRecord
            }
        });

        // before passing to template, update user object with new token
        Meteor._ensure(user, 'services', 'password').reset = tokenRecord;

        return Email.send({
            to: email,
            from: "contact_us@gennie.com",
            cc: "roshanshah.011@gmail.com",
            subject: "Code to set your new Password",
            html: "Pleas use code to Set New Password : " + token,
        }, function (err) {
            if (err != null) {
                console.log(err.messsage);
            }
        });
        // }
        // catch (e) {
        //     console.log(e.message)
        //     throw new Meteor.Error(401,e.message);
        // }

    },


    'addDeviceUniqueId': (uniqueId) => {
        Meteor.users.update({_id: Meteor.userId()}, {
            $addToSet: {devices: uniqueId}
        });
    },

    'removeToken': (token) => {
        let loggedUser = Meteor.user();
        let devices = loggedUser.hasOwnProperty('devices') ? loggedUser.devices : [];
        let index = devices.indexOf(token);
        if (index > -1) {
            devices.splice(index, 1);
            Meteor.users.update({_id: loggedUser._id}, {
                $set: {devices: devices}
            });
        }
    },
});
const pluckAddresses = (emails = []) => emails.map(email => email.address);
const randomNum=()=>{
    return   Math.floor(100000 + Math.random() * 900000)
}




