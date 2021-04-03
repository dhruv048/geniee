import React, { ToastAndroid } from 'react-native';
import { AccessToken } from 'react-native-fbsdk';
import Meteor from '../react-native-meteor';
import AsyncStorage from '@react-native-community/async-storage';

const USER_TOKEN_KEY = 'USER_TOKEN_KEY_GENNIE';
const USER_TOKEN_TYPE = 'USER_TOKEN_TYPE';

export const loginWithTokens = (compId,needReturn) => {
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
                        Meteor._loginWithToken(result.token);
                       // MyFunctions._saveDeviceUniqueId();
                        ToastAndroid.showWithGravityAndOffset(
                            "Logged In Successfully",
                            ToastAndroid.LONG,
                            ToastAndroid.TOP,
                            0,
                            50,
                        );
                        if(needReturn){
                           this.props.navigation.goBack();
                        }
                        else {
                           this.props.navigation.navigate('Home');
                        }

                    };
                });
            }
        })
};

export const onLoginFinished = (result,compId,needReturn) => {
    if (result.isCancelled) {
        console.log('login cancelled');
    } else {
        loginWithTokens(compId,needReturn);
    }
};