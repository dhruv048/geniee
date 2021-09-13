import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { FIREBASE_MESSAGING } from '../API/fire-base-admin';
const bcrypt = require("bcryptjs");
Meteor.methods({

    'registerUser': async (userInfo) => {
        var user = Meteor.user();
        var createdBy = null;
        if (user.profile.role === 1 || user.profile.role === 2) {
            createdBy = user._id;
        }
        else if (user.profile.role === 0) {
            createdBy = user.profile.createdBy
        }
        try {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);
            let userId = Accounts.createUser({
                password: userInfo.password,
                username: userInfo.contact,
                hashPassword: hash,
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
                },
                isMerchant: userInfo.isMerchant
            });
        }
        catch (e) {
            console.log(e.message);
            throw new Meteor.Error(401, e.message);

        }
    },

    'signUpUser': async (userInfo) => {
        console.log('This is userInfo '+ userInfo.password);
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(userInfo.password, salt);
        userInfo.hashPassword = hash;
        console.log(userInfo);
        let expiry = Date.now() + 60 * 1000 * 48 * 60; //48 hrs in ms
        try {
            let userId = Accounts.createUser(userInfo);
            if (userId) {
                // Accounts.sendVerificationEmail(userId);
                let user = Meteor.users.findOne({ _id: userId });
                var token = Random.secret();
                var tokenRecord = {
                    token: token,
                    address: user.emails[0].address,
                    when: new Date(),
                };
                //Update User's token info the user
                Meteor.users.update(
                    { _id: userId },
                    {
                        $push: { 'services.email.verificationTokens': tokenRecord },
                        $set: {
                            email: userInfo.email,
                            hashPassword: hash,
                            emailToken: token,
                            emailTokenExpires: new Date(expiry)
                        },
                        active: false,
                    }
                    , function (err) {
                        let url = Meteor.absoluteUrl() + 'verify-email/' + token;
                        // Email.send({
                        //     to: userInfo.email,
                        //     from: "Geniee",
                        //     cc: "",
                        //     bcc: "roshanshah.011@gmail.com;sushil.jakibanja@gmail.com",
                        //     subject: "Activate your account now!",
                        //     html: `<h4>Dear ${user.profile.hasOwnProperty('name') ? user.profile.name : `${user.profile.firstName}`},</h4><br>
                        //     <p>Thank you very much for signing up with Geniee.</p><br>
                        //     <p>Please <a href="${url}">Click here</a> to verify your email and complete the registration process.</p><br>
                        //     <p>Questions? Please visit our support system or email us at genieeinfo@gmail.com</p><br/>
                        //     Regards, <br/>
                        //     Geniee`,
                        // }, function (err) {
                        //     if (err != null) {
                        //         console.log(err.messsage);
                        //     }
                        // });
                    });

                //return userId;

                return Async.runSync(function (done) {
                    done(null, userId);
                })
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
        let expiry = Date.now() + 60 * 1000 * 48 * 60; // 48 hrs
        Meteor.users.update({ _id: user._id }, {
            $set: {
                'services.password.reset': tokenRecord,
                resetPasswordToken: token,
                resetPasswordExpires: expiry,
            }
        });

        // before passing to template, update user object with new token
        Meteor._ensure(user, 'services', 'password').reset = tokenRecord;

        return Email.send({
            to: email,
            from: "Geniee",
            bcc: "roshanshah.011@gmail.com;sushil.jakibanja@gmail.com",
            subject: "Password Reset Code:" + token,
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

    'setPasswordCustom': async (email, Token, newPassword) => {
        try {
            let user = Accounts.findUserByEmail(email);
            if (user && user.services.password.reset.token === Token) {
                const salt = await bcrypt.genSalt(10);
                const hash = await bcrypt.hash(newPassword, salt);
                try {
                    Accounts.setPassword(user._id, newPassword);
                    Meteor.users.update({ _id: user._id }, {
                        $set: {
                            'services.resume.loginTokens': [],
                            'services.password.reset': '',
                            hashPassword: hash[0],
                            resetPasswordToken: null,
                            resetPasswordExpires: ""
                        }
                    }, (err, res) => {
                        if (!err) {
                            FIREBASE_MESSAGING.sendTokenRefreshedMessage(user._id);
                            return 1;
                        }
                        else {
                            throw new Meteor.Error(500, err.reason);
                        }
                    });
                }
                catch (e) {
                    throw new Meteor.Error(500, e.message);
                }
            }
            else {
                throw new Meteor.Error(404, 'Invalid Token!!');
            }
        }
        catch (e) {
            console.log(e)
            throw new Meteor.Error(401, 'Something went wrong. Please send request for new code.');
        }
    },

    'addDeviceUniqueId': (uniqueId) => {
        Meteor.users.update({ _id: Meteor.userId() }, {
            $addToSet: { devices: uniqueId }
        });
    },

    'removeToken': (token) => {
        let loggedUser = Meteor.user();
        let devices = loggedUser.hasOwnProperty('devices') ? loggedUser.devices : [];
        let index = devices.indexOf(token);
        if (index > -1) {
            devices.splice(index, 1);
            Meteor.users.update({ _id: loggedUser._id }, {
                $set: { devices: devices }
            });
        }
    },

    'verifyAccount': async (code) => {

        // check(code, String)
        const user = await Meteor.users.findOne({ 'services.email.verificationTokens': { $elemMatch: { token: code } } });

        if (user) {
            Meteor.users.update(
                { _id: user._id },
                {
                    $set: {
                        'services.email.verificationTokens': [],
                        'emails.0.verified': true,
                        'active': true
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
            { _id: Meteor.userId() },
            {
                $set: {
                    'profile.name': profile.name,
                    'profile.location': profile.location,
                    'profile.email': profile.email,
                    'profile.contactNo': profile.contactNo
                }
            }
        )
    },

    getLoggedInUser: (token) => {
        // console.log(token)
        let logged = Meteor.userId();
        const user = Meteor.users.findOne({ 'services.resume.loginTokens': token });
        // console.log(user)
        if (logged || user)
            return Async.runSync(function (done) {
                done(null, user);
            });

    },

    'customLogin': function (loginRequest) {
        // console.log(loginRequest)
        var user = Meteor.users.findOne({ 'username': loginRequest.email });
        if (!user) {
            throw new Meteor.Error('', 'User not found.');
        }
        // var pass = crypto.createHash('sha256').update(loginRequest.password).digest('hex');  
        // console.log(user,loginRequest.password)
        var result = Accounts._checkPassword(user, loginRequest.password);
        if (!result)
            throw new Meteor.Error('', 'UnAuthorized');

        // if(user.code !== loginRequest.code) {
        //   return null;
        // }

        var stampedToken = Accounts._generateStampedLoginToken();
        var hashStampedToken = Accounts._hashStampedToken(stampedToken);

        Meteor.users.update(user._id,
            { $push: { 'services.resume.loginTokens': hashStampedToken } }
        );

        return {
            userId: user._id,
            token: stampedToken.token
        };
    },

});
const pluckAddresses = (emails = []) => emails.map(email => email.address);
const randomNum = () => {
    return Math.floor(100000 + Math.random() * 900000)
}




