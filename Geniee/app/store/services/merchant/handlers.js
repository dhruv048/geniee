import axios from 'axios';
import { dispatch } from '../../../store';
import AsyncStorage from '@react-native-community/async-storage';

import {
    setSignedIn,
} from '../../../store/actions';
import { getExpireDate } from 'helpers';
import Meteor from '../../../react-native-meteor';

const apiUrl = 'http://139.59.59.117';

// const handleImageUpload = (imageData) => {
//     // Validate user (server)
//     axios({
//         method: 'post',
//         url: `${apiUrl}/api/upload`,
//         data: { imageData },
//     }).then((response) => response.json())
//         .then((response) => {
//             console.log('response', response);
//         })
//         .catch((error) => {
//             console.log('error', error);
//         });
// };

const addBusiness = (businessModel, callBack) => {
    Meteor.call('addNewBusiness', businessModel, (err, res) => {
        if (err) {
            console.log('Please contact administrator.')
            callBack(err);
        } else {
            callBack(true);
        }
    })
};

const getBusinessInfo = (loggedUser, callBack) => {
    Meteor.call('getBusinessInfo', loggedUser, (err, res) => {
        if (res) {
            callBack(true);
        } else {           
            console.log('Please contact administrator.')
            callBack(false);
        }
    })
}

export default {
    //handleImageUpload,
    addBusiness,
    getBusinessInfo,
};
