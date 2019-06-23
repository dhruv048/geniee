import {Meteor} from "meteor/meteor";
import {Accounts} from "meteor/accounts-base";
Meteor.startup(function () {
    Future = Npm.require('fibers/future');
    // chck if there is Super Admin, If not create one.
    if (Meteor.users.find().count() === 0) {
        if (!!Meteor.settings.private.defaultAccount) {
            Accounts.createUser({
                password: Meteor.settings.private.defaultAccount.password,
                username: Meteor.settings.private.defaultAccount.username,
                email: Meteor.settings.private.defaultAccount.email,
                createdAt: new Date(),
                createdBy:"SuperAdmin",
                profile: {
                    role: 2,
                    name: "Roshan",
                    contactNo: "9813798508",
                }
            });
        } else {
            console.log('No default user!  Please invoke meteor with a settings file.');
        }
    };

    if(Notifications.find().count()===0){
        Notifications.insert({
            title:"Updates",
            message:"A lot new features available now. Grab new App now",
            url:"http://.github.com",
            linkText:"App Store",
            isActive:false
        }
        )
    }

    if(MainCategories.find().count()===0){

        CSV.readCsvFileLineByLine(process.env.PWD + '/imports/categories.csv', {
            headers: true,
            delimiter: ";",
        }, Meteor.bindEnvironment(function (line, index, rawParsedLine) {
            // console.log(line);
            line.subCategories=[];
            MainCategories.insert(line);

        }));
        MainCategories.insert({ catId: '0', mainCategory: 'Others', subCategories:[] });
        MainCategories.insert({ catId: '19', mainCategory: 'Emergency', subCategories:[] });
    }
    else{
        CSV.readCsvFileLineByLine(process.env.PWD + '/imports/subcategories.csv', {
            headers: true,
            delimiter: ",",
        }, Meteor.bindEnvironment(function (line, index, rawParsedLine) {
            console.log(line);
            var data={
                subCatId:line.subCatId,
                subCategory:line.subCategory
            }
            MainCategories.update({catId:line.parentId
            },{
                $addToSet:{subCategories:data}
            })
        }));
    }

    if(Service.find().count()<100){
        CSV.readCsvFileLineByLine(process.env.PWD + '/imports/services.csv', {
            headers: true,
            delimiter: ",",
        }, Meteor.bindEnvironment(function (line, index, rawParsedLine) {
            console.log(line);
            var data={
                title : line.title,
                description : line.description,
                contact : line.contact,
                contact1:line.phone1,
                fax:line.fax,
                email:line.email,
                pobox:line.pobox,
                isPaid : line.isPaid,
                location : {
                    formatted_address :  line.add1+', '+line.city+', '+line.add2,
                    geometry : (line.lat!=null && line.lat !="NULL" && line.lat!=undefined && line.lat!='')? {
                        location : {
                            lat :parseFloat(line.lat),
                            lng :parseFloat(line.lng)
                        },
                    } : null,
                    website : line.webpage
                },
                radius : null,
                coverImage : null,
                homeDelivery : false,
                categoryId : line.subCatId,
                createdAt : new Date(),
                createdBy : null,
                ratings : [{count : 0}],
                website : line.webpage,
            };
            Service.insert(data);
        }));
    }

});
