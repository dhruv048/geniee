import {ServiceConfiguration} from 'meteor/service-configuration';
import {Meteor} from 'meteor/meteor';

const settings = Meteor.settings.oauth.facebook;

const init = () => {
    if (!settings) return;
    ServiceConfiguration.configurations.upsert(
        {service: "facebook"},
        {
            $set: {
                appId: settings.appId,
                secret: settings.secret
            }
        }
    );
    registerHandler();
}
const registerHandler = () => {
    Accounts.registerLoginHandler('facebook', function (params) {
        // console.log(params)
        if (params.hasOwnProperty('data') && params.data.type === 'meteor') {
            let user = Accounts.findUserByEmail(params.data.email);
            if (user && user.profile.role == 1) {
                var res= Accounts._checkPassword(user,params.data.password)
                // console.log(res);
                return res
            }
        }
        else {
            const data = params.facebook;
          //  console.log('facebook.data:', data)
            // If this isn't facebook login then we don't care about it. No need to proceed.
            if (!data) {
                return undefined;
            }

            // The fields we care about (same as Meteor's)
            // const whitelisted = ['id', 'email', 'name', 'first_name',
            //     'last_name', 'link', 'gender', 'locale', 'age_range'];

            const whitelisted = 'id,email,name,first_name,last_name, gender, age_range,picture';

            // Get our user's identifying information. This also checks if the accessToken
            // is valid. If not it will error out.
            const identity = getIdentity(data.accessToken, data.userID, whitelisted);
          //  console.log('identity:', identity)

            // Build our actual data object.
            const serviceData = {
                accessToken: data.accessToken,
                expiresAt: (+new Date) + (1000 * data.expirationTime)
            };
            const fields = Object.assign({}, serviceData, identity);

            // Search for an existing user with that facebook id
            const existingUser = Meteor.users.findOne({'services.facebook.id': identity.id});
            const existingMeteorUser = Accounts.findUserByEmail(identity.email);

            let userId;
            if (existingUser) {
                userId = existingUser._id;

                // Update our data to be in line with the latest from Facebook
                const prefixedData = {};
                _.each(fields, (val, key) => {
                    prefixedData[`services.facebook.${key}`] = val;
                });

                Meteor.users.update({_id: userId}, {
                    $set: prefixedData,
                    $addToSet: {emails: {address: identity.email, verified: true}}
                });

            }

            else if (existingMeteorUser) {
               // console.log(existingMeteorUser)
                userId = existingMeteorUser._id;
                // Update our data to be in line with the latest from Facebook
                const prefixedData = {};
                _.each(fields, (val, key) => {
                    prefixedData[`services.facebook.${key}`] = val;
                });
                // existingUser.profile.name=identity.name;
                //  existingUser.profile.profileImage=identity.picture.data.url;
                Meteor.users.update({_id: userId}, {
                    $set: prefixedData,
                    $addToSet: {emails: {address: identity.email, verified: true}}
                });
            }
            else {

                // Create our user
                userId = Meteor.users.insert({
                    services: {
                        facebook: fields
                    },
                    profile: {name: identity.name, profileImage: identity.picture.data.url},
                    emails: [{
                        address: identity.email,
                        verified: true
                    }]
                });
            }

            return {userId: userId};
        }
    });
};

// Gets the identity of our user and by extension checks if
// our access token is valid.
const getIdentity = (accessToken, userId, fields) => {
    try {
        return HTTP.get("https://graph.facebook.com/"+userId+"/", {
            params: {
                access_token: accessToken,
                fields: fields
            }
        }).data;
    } catch (err) {
        throw _.extend(new Error("Failed to fetch identity from Facebook. " + err.message),
            {response: err.response});
    }
};


export default init;