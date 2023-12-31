import {Meteor} from "meteor/meteor";
import {Accounts} from "meteor/accounts-base";
import FacebookOAuthInit from "./oauth-facebook";
import {FIREBASE_MESSAGING} from './API/fire-base-admin';
const bcrypt = require("bcryptjs");
const path = require('path')

process.env.MAIL_URL = "smtps://genieeinfo:icmjzpofzjbsywvy@smtp.gmail.com:465";
var admin = require("firebase-admin");
var serviceAccount = process.env.NODE_ENV === "production" ? Assets.absoluteFilePath('geniee-e9e27-firebase-adminsdk-vecjf-9f72cf3f05.json') : Assets.absoluteFilePath('geniee-e9e27-firebase-adminsdk-vecjf-9f72cf3f05.json');


Meteor.startup(async function () {
    // Initialize firebase admin
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        //   databaseURL: ""
    });


     FIREBASE_MESSAGING.sendTestMessage();


    FacebookOAuthInit();
    Future = Npm.require('fibers/future');


    Accounts.config({sendVerificationEmail: true});
    Accounts.emailTemplates.siteName = 'Geniee';
    Accounts.emailTemplates.from = 'Info@Geniee<genieeinfo@gmail.com>';


    Accounts.validateLoginAttempt((options) => {
        if (!options.allowed) {
            // console.log(options);
            return false;
        }
        try {
            let methodName = options.methodName;
            let methodtYPE = options.type;
            let methodArguments = options.methodArguments[1];

            if (methodtYPE == 'password') {
                if (!(options.user.emails[0].verified || options.users.active))
                    throw new Meteor.Error('', 'You Email has not yet verified. Please check your email.');

                // if (methodArguments) {
                //     if (methodName == "login" && methodArguments.hasOwnProperty("isVisitor")) {
                //         if (methodArguments.isVisitor) {
                //             if (options.user.profile.role !== userType.VISITOR)
                //                 throw new Meteor.Error('', 'UnAuthorized');
                //         }
                //         else {
                //             if (options.user.profile.role == userType.VISITOR)
                //                 throw new Meteor.Error('', 'UnAuthorized');
                //         }
                //     }
                // }
                //
                // if ([userType.HOSPITAL, userType.CLINIC, userType.LAB].includes(options.user.profile.role)) {
                //     let subscription = options.user.profile.subscription;
                //     let count = 0;
                //     if (options.user.services.hasOwnProperty('resume') && options.user.services.resume.loginTokens) {
                //         count = count + options.user.services.resume.loginTokens.length;
                //     }
                //     // if(options.user.services.hasOwnProperty('facebook')){
                //     //     count=count+1;
                //     // }
                //     console.log(count);
                //     if (count < subscription.USERLOGIN)
                //         return true;
                //     else {
                //         throw new Meteor.Error('', 'You have reached maximum login!! please Log Out from other devices');
                //     }
                // }
            }
            return true;
        }
        catch (e) {
            console.log(e.message)
            throw new Meteor.Error('', e.reason);
        }
    });


   
    // chck if there is Super Admin, If not create one.
    if (Meteor.users.find().count() === 0) {
        if (!!Meteor.settings.private.defaultAccount) {
          let userId=  Accounts.createUser({
                password: Meteor.settings.private.defaultAccount.password,
                username: Meteor.settings.private.defaultAccount.username,
                email: Meteor.settings.private.defaultAccount.email,
                createdAt: new Date(),
                createdBy: "SuperAdmin",
                profile: {
                    role: 101,
                    name: "Roshan",
                    contactNo: "9813798508",
                }
            });
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);

            Meteor.users.update(
                { _id: userId },
                { $set: { hashPassword: hash, active : true }});
        } else {
            console.log('No default user!  Please invoke meteor with a settings file.');
        }
    };
    
    // if (!Meteor.users.findOne({'profile.role': 111})) {
    //     if (!!Meteor.settings.private.GRAccount) {
    //         Accounts.createUser({
    //             password: Meteor.settings.private.GRAccount.password,
    //             username: Meteor.settings.private.GRAccount.username,
    //             email: Meteor.settings.private.GRAccount.email,
    //             createdAt: new Date(),
    //             createdBy: "SuperAdmin",
    //             profile: {
    //                 role: 111,
    //                 name: "Geniee Repair",
    //                 contactNo: "9858974585",
    //             }
    //         });
    //     } else {
    //         console.log('No GRAccount user!  Please invoke meteor with a settings file.');
    //     }
    // }
    // if (!Meteor.users.findOne({'profile.role': 222})) {
    //     if (!!Meteor.settings.private.EFAccount) {
    //         Accounts.createUser({
    //             password: Meteor.settings.private.EFAccount.password,
    //             username: Meteor.settings.private.EFAccount.username,
    //             email: Meteor.settings.private.EFAccount.email,
    //             createdAt: new Date(),
    //             createdBy: "SuperAdmin",
    //             profile: {
    //                 role: 222,
    //                 name: "Eat Fit",
    //                 contactNo: "9858974585",
    //             }
    //         });
    //     } else {
    //         console.log('No EFAccount user!  Please invoke meteor with a settings file.');
    //     }
    // }

    // console.log('Users',Meteor.users.find({'profile.role':{$in : [111,222]}}).fetch())
    // Meteor.users.update({'profile.role':{$in : [111,222]}},{$set:{'emails.$.verified': true}}, { "multi": true });

    // if(Notifications.find().count()===0){
    //     Notifications.insert({
    //         title:"Updates",
    //         message:"A lot new features available now. Grab new App now",
    //         url:"http://.github.com",
    //         linkText:"App Store",
    //         isActive:false
    //     }
    //     )
    // }

    if (MainCategories.find().count() < 1) {

        CSV.readCsvFileLineByLine(process.env.NODE_ENV === "production" ? Assets.absoluteFilePath('csvFiles/newCategories.csv') : Assets.absoluteFilePath('csvFiles/newCategories.csv'), {
            headers: true,
            delimiter: ",",
        }, Meteor.bindEnvironment(function (line, index, rawParsedLine) {
            //  console.log(line);
            line.subCategories = [];
            MainCategories.insert(line);

        }));
        // var categories= Meteor.settings.public.categories;
        // console.log(categories)
        // categories.forEach(item=>{
        //      let cat ={
        //          catId:item[0],
        //          mainCategory:item[1],
        //          icon:item[2],
        //          subCategories:[]
        //      }
        //      console.log(cat)
        //      MainCategories.insert(cat);
        //  });

        CSV.readCsvFileLineByLine((process.env.NODE_ENV === "production" ? Assets.absoluteFilePath('csvFiles/subcategories.csv') : Assets.absoluteFilePath('csvFiles/subcategories.csv')), {
            headers: true,
            delimiter: ",",
        }, Meteor.bindEnvironment(function (line, index, rawParsedLine) {
            console.log(line);
            var data = {
                subCatId: line.subCatId,
                subCategory: line.subCategory
            }
            MainCategories.update({
                catId: line.parentId
            }, {
                $addToSet: {subCategories: data}
            })
        }));
        CSV.readCsvFileLineByLine((process.env.NODE_ENV === "production" ? Assets.absoluteFilePath('csvFiles/emergency.csv') : Assets.absoluteFilePath('csvFiles/emergency.csv')), {
            headers: true,
            delimiter: ",",
        }, Meteor.bindEnvironment(function (line, index, rawParsedLine) {
            console.log(line);
            var data = {
                subCatId: line.subCatId,
                subCategory: line.subCategory
            }
            MainCategories.update({
                catId: 19
            }, {
                $addToSet: {subCategories: data}
            })
        }));
    }
    else {

    }

    // if (Service.find().count() < 100) {
    //     CSV.readCsvFileLineByLine(process.env.NODE_ENV === "production" ? Assets.absoluteFilePath('csvFiles/Allservices.csv') : 'D:/Projects/sapp/MeteorApp' + '/private/csvFiles/services.csv', {
    //         headers: true,
    //         delimiter: ",",
    //     }, Meteor.bindEnvironment(function (line, index, rawParsedLine) {
    //         console.log(line);
    //         var data = {
    //             title: line.title,
    //             description: line.description,
    //             contact: line.contact,
    //             contact1: line.phone1,
    //             fax: line.fax,
    //             email: line.email,
    //             pobox: line.pobox,
    //             isPaid: line.isPaid,
    //             location: {
    //                 formatted_address: line.add1 + ', ' + line.city + ', ' + line.add2,
    //                 geometry: (line.lat != null && line.lat != "NULL" && line.lat != undefined && line.lat != '') ? {
    //                     location: {
    //                         lat: parseFloat(line.lat? line.lat: 0),
    //                         lng: parseFloat(line.lng? line.lng:0)
    //                     },
    //                     type: 'Point',
    //                     coordinates: [parseFloat(line.lng? line.lng:0), parseFloat(line.lat? line.lat: 0)]
    //                 } : null,
    //                 website: line.webpage
    //             },
    //             radius: null,
    //             coverImage: null,
    //             homeDelivery: false,
    //             categoryId: line.subCatId,
    //             createdAt: new Date(),
    //             createdBy: null,
    //             ratings: [{count: 0}],
    //             website: line.webpage,

    //         };
    //         Service.insert(data);
    //     }));
    // }
    Service._ensureIndex({
        "title": "text",
        "description": "text",
    });
    Service._ensureIndex({
        "location.geometry": "2dsphere"
    })

    Products._ensureIndex({
        "title": "text",
        "description": "text",
    })
    MainCategories._ensureIndex({
        "mainCategory": "text",
        "subCategories.subCategory": "text",
    })
    // Accounts.ensureIndex( { "profile.location" : "2dsphere" })
});



