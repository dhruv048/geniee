import React, { AsyncStorage } from 'react-native';
import { AccessToken } from 'react-native-fbsdk';
import Meteor from '../react-native-meteor';
import {MyFunctions} from "../lib/MyFunctions";
import {goToDashboard,goBack} from "../Navigation";
import {EventRegister} from "react-native-event-listeners";

const USER_TOKEN_KEY = 'USER_TOKEN_KEY_GENNIE';
const USER_TOKEN_TYPE = 'USER_TOKEN_TYPE';

export const loginWithTokens = (compId) => {
    const Data = Meteor.getData();
    AccessToken.getCurrentAccessToken()
        .then((res) => {
            if (res) {
                Meteor.call('login', {facebook: res}, (err, result) => {
                    if (!err) {//save user id and token
                        console.log(res, result)
                        AsyncStorage.setItem(USER_TOKEN_KEY, result.token);
                        AsyncStorage.setItem(USER_TOKEN_TYPE, 'FACEBOOK');
                        Data._tokenIdSaved = result.token;
                        Meteor._userIdSaved = result.id;
                        Meteor._loginWithToken(result.token)
                        EventRegister.emit('siggnedIn',true)
                       // MyFunctions._saveDeviceUniqueId();
                        goToDashboard();
                       // goBack(compId)
                    };
                });
            }
        })
};

export const onLoginFinished = (result,compId) => {
    if (result.isCancelled) {
        console.log('login cancelled');
    } else {
        loginWithTokens(compId);
    }
};