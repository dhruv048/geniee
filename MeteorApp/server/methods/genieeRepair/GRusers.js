import {Meteor} from 'meteor/meteor';
import { GRusers } from '../../../lib/collections/genieeRepair/GRusers';


Meteor.methods({
    'addNewGRUser': (userInfo) => {
        try {
            console.log('addNewGRUser:::=>>>',userInfo);
            var currentUserId = Meteor.userId();
            userInfo.createdBy = currentUserId,
            userInfo.createDate = new Date(new Date().toUTCString())
            let imageIds = [];
            if (userInfo.image) {
                    let Id = moment().format('DDMMYYx');
                    GRuserpic.write(new Buffer(userInfo.image.data, 'base64'),
                        {
                            fileName: Id + '.jpg',
                            type: userInfo.image.mime
                        },
                        (err, res) => {
                            if (err) {
                                console.log('error',err)
                            }
                            else {
                                console.log('res:',res._id);
                                
                                    userInfo.image = null;
                                    userInfo.profilepic = res._id;
                                    console.log('insert')
                                    return GRusers.insert(userInfo);
            
                            }
                        }, proceedAfterUpload = true)
            }
            else {
                userInfo.profilepic = null;
                console.log('insert')
                return GRusers.insert(userInfo);
            }

        }
        catch (e) {
            console.log(e.message);
            throw new Meteor.Error(403, e.message)

        }
    },


    'getUserbyCatId':(catId)=>{
        return GRusers.find({category:catId}).fetch();
    }
})