import {ContactUs} from "../../lib/collections/contactUs";

Meteor.methods({
    'addContactUsMessage': function (contactUSInfo) {
        ContactUs.insert({
            name: contactUSInfo.name,
            message: contactUSInfo.message,
            phone: contactUSInfo.phone,
            email: contactUSInfo.email,
            createDate: new Date()
        });
        Meteor.call('sendMail',contactUSInfo);
    },

    'sendMail': function (contactUSInfo) {
        Meteor.defer(() => {
            try {
                Email.send({
                    to: "roshanshah.011@gmail.com",
                    from: "contact_us@geniee.com",
                    cc: "roshanshah.011@gmail.com",
                    subject: "Contact Me from:" + contactUSInfo.name,
                    html: "<label>Phone:</label> " + contactUSInfo.phone + "<br> <label>emaill : </label>" + contactUSInfo.email + "<br>" + contactUSInfo.message,
                }, function (err) {
                    if (err != null) {
                        console.log(err.messsage);
                    }
                });
            }
            catch(err){
                console.log(err.message);
            }
        });
    }
});

