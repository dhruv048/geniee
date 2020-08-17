var admin = require("firebase-admin");

export const FIREBASE_MESSAGING = {
    'sendTestMessage': function () {

        // These registration tokens come from the client FCM SDKs.
        const registrationTokens = [
            'dvN3mCHuuWY:APA91bHkG0D4QFJ4vjTJ-c_41UTKAJ7mlvWTnCVUhN6W0INqwveJJUSj-P1cHeIbiXeHO_iR9m8M1X5LkEtJfORjP1ahh3MTDZhtnU5yoYC7Di-ZrwAKG7B9rIf2adA9TKq7e5XndJhR',
        ];

        const message = {
            notification: {
                title: 'Test Notification..',
                body: 'This is to test Push Notification from server.'
            },
           // data: {score: '850', time: '2:45', image:"https://api.krishisansaar.com/img/gr.jpg", icon:"https://api.krishisansaar.com/img/gr-icon.jpg"},
            data: {score: '850', time: '2:45', image:"fWLQk2Ef6cxgsJxjC", icon:"https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=10218369691369366&height=200&width=200&ext=1596357554&hash=AeT7qBsCqmudFwF9"},
            tokens: registrationTokens,
        };

        try {
            admin.messaging().sendMulticast(message)
                .then((response) => {
                    if (response.failureCount > 0) {
                        const failedTokens = [];
                        response.responses.forEach((resp, idx) => {
                            if (!resp.success) {
                                failedTokens.push(registrationTokens[idx]);
                            }
                        });
                        console.log('List of tokens that caused failures: ' + failedTokens);
                    }
                });
        }
        catch (e) {
            console.log(e.message)
            throw new Meteor.Error(403, e.message);
        }
    },

    'sendTokenRefreshedMessage': function (userId) {
        const registrationTokens = Meteor.users.findOne(userId).devices;

        const message = {
            notification: {
                title: 'Password Changed',
                body: 'Password Change Successfully.'
            },
            data: {title: 'REMOVE_AUTH_TOKEN'},
            tokens: registrationTokens,
        };

        admin.messaging().sendMulticast(message)
            .then((response) => {
                console.log(response.successCount + ' messages were sent successfully');
            });
    },

    'notificationToAll': (topic, title, body, data) => {
        // let users = Meteor.users.find().fetch();
        // users.forEach(user => {
        //     if (user.hasOwnProperty('devices')) {
        //  const registrationTokens = user.devices;

                const message = {
                    notification: {
                        title: title,
                        body: body
                    },
                    data: data,
                    // tokens: registrationTokens,
                    topic: topic
                }
        try {

            admin.messaging().send(message)
                .then((response) => {
                    // if (response.failureCount > 0) {
                    //     const failedTokens = [];
                    //     response.responses.forEach((resp, idx) => {
                    //         if (!resp.success) {
                    //             failedTokens.push(registrationTokens[idx]);
                    //         }
                    //     });
                    //     console.log('List of tokens that caused failures: ' + failedTokens);
                    // }

                    console.log('Response on Message to Topic ' + response);
                });
        }
        catch (e) {
            console.log(e.message)
            throw new Meteor.Error(403, e.message);
        }
        // }

        // })
    },
    "notificationToList": (tokens, title, body, data) => {
        const registrationTokens = tokens || [];
        const message = {
            notification: {
                title: title,
                body: body
            },
            data: data,
            tokens: registrationTokens,
        }
        if (registrationTokens.length > 0) {
            try {
                admin.messaging().sendMulticast(message)
                    .then((response) => {
                        if (response.failureCount > 0) {
                            const failedTokens = [];
                            response.responses.forEach((resp, idx) => {
                                if (!resp.success) {
                                    failedTokens.push(registrationTokens[idx]);
                                }
                            });
                            console.log('List of tokens that caused failures: ' + failedTokens);
                        }
                    });
            }
            catch (e) {
                console.log(e.message)
                throw new Meteor.Error(403, e.message);
            }
        }
    }
}