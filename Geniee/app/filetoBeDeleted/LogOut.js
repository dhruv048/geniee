import React, { Component } from 'react';
import Meteor from 'react-native-meteor';
import Loading from "../components/Loading/Loading";
const USER_TOKEN_KEY = 'USER_TOKEN_KEY_GENNIE';
import { AsyncStorage } from 'react-native';


const LogOut = () => {
    _handleSignout = () => {
        Meteor.logout((err) => {
            if (!err) {
                console.log('logout')
                AsyncStorage.setItem(USER_TOKEN_KEY, '');
                this.props.navigation.navigate('UnAuthorized');
            }
            else
                this.props.navigation.goBack()
        })
    }


    rerender = () => this.forceUpdate()

    { this._handleSignout() }
    const { navigate } = this.props.navigation;
    return (
        <Loading />
    );
}



export default LogOut;
