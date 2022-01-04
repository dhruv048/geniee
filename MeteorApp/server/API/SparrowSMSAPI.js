import { Meteor } from "meteor/meteor";
import { HTTP } from 'meteor/http';

Meteor.methods({
    getOTPSMS: (mobileNumber, message) => {
        return Async.runSync(function (done) {
            HTTP.post('http://api.sparrowsms.com/v2/sms/',
                {
                    data: {
                        token: 'v2_W3RXKmhMIH4vzstomppdRcLLVxH.rLCW',
                        from: 'SajiloPay',
                        to: mobileNumber,
                        text: message,
                    }
                }, (error, result) => {
                    if (error){
                        console.log('Error from Sparrow SMS API '+ error);
                        done(error, null);
                    }
                    else {
                        done(null, result.statusCode);
                    }
                });
        });
        
    }
        
})