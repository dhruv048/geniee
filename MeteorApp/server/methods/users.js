import {Meteor} from 'meteor/meteor';
import {Random} from 'meteor/random';
Meteor.methods({

    'registerUser': (userInfo) => {
        var user = Meteor.user();
        var createdBy = null;
        if (user.profile.role === 1 || user.profile.role === 2) {
            createdBy = user._id;
        }
        else if (user.profile.role === 0) {
            createdBy = user.profile.createdBy
        }
        try {
           let userId= Accounts.createUser({
                password: userInfo.password,
                username: userInfo.contact,
                email: userInfo.email,
                createdAt: new Date(),
                profile: {
                    // role: userInfo.role,
                    role: user.profile.role === 2 ? 1 : 0,
                    // profileimage: null,
                    name: userInfo.name,
                    contactNo: userInfo.contact,
                    createdBy: createdBy,
                    primaryEmail: userInfo.email,
                    email: userInfo.email
                }
            });
        }
        catch (e) {
            console.log(e.message);
            throw new Meteor.Error(401, e.message);

        }
    },

    'signUpUser': (userInfo) => {
        try {
            let userId =Accounts.createUser(userInfo);
            if (userId) {
                // Accounts.sendVerificationEmail(userId);
                let user = Meteor.users.findOne({_id: userId});
                var token = Random.secret();
                var tokenRecord = {
                    token: token,
                    address: user.emails[0].address,
                    when: new Date(),
                };
                //Update User's token info the user
                Meteor.users.update(
                    {_id: userId},
                    {$push: {'services.email.verificationTokens': tokenRecord}}
                    , function (err) {
                        let url = Meteor.absoluteUrl() + 'verify-email/' + token;
                        Email.send({
                            to: userInfo.email,
                            from: "Geniee",
                            cc: "",
                            bcc: "roshanshah.011@gmail.com;sushil.jakibanja@gmail.com",
                            subject: "Activate your account now!",
                            html: `<h4>Dear ${user.profile.name},</h4><br>
                <p>Thank you very much for signing up with Geniee.</p><br>
                    <p>Please <a href="${url}">Click here</a> to verify your email and complete the registration process.</p><br>
                    <p>Questions? Please visit our support system or email us at genieeinfo@gmail.com</p><br/>
                    Regards, <br/>
                    Geniee`,
                        }, function (err) {
                            if (err != null) {
                                console.log(err.messsage);
                            }
                        });
                    });

                return userId;
            }
        }
        catch (e) {
            console.log(e.message);
            throw new Meteor.Error(500, e.reason);

        }
    },


    'loginUser': (username, password) => {
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
            from: "Geniee",
            bcc: "roshanshah.011@gmail.com;sushil.jakibanja@gmail.com",
            subject: "Password Reset Code:"+token,
            html: "Please use code to Set New Password : " + token,
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

    'verifyAccount': async (code) => {

        // check(code, String)
        const user = await Meteor.users.findOne({'services.email.verificationTokens': {$elemMatch: {token: code}}});

        if (user) {
            Meteor.users.update(
                {_id: user._id},
                {
                    $set: {
                        'services.email.verificationTokens': [],
                        'emails.0.verified': true
                    }
                }
            )
            return true;
        }
        else {
            throw new Meteor.Error(401, "couldn't verify Token");
        }
    },

    'updateProfile': (profile) => {
        Meteor.users.update(
            {_id: Meteor.userId()},
            {
                $set: {
                    'profile.name': profile.name,
                    'profile.location': profile.location,
                    'profile.email': profile.email,
                    'profile.contactNo': profile.contactNo
                }
            }
        )
    }
});
const pluckAddresses = (emails = []) => emails.map(email => email.address);
const randomNum = () => {
    return Math.floor(100000 + Math.random() * 900000)
}




