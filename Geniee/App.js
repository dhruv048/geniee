/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component, useEffect} from 'react';
import {StyleSheet, ActivityIndicator} from 'react-native';

import {colors} from './app/config/styles';
import {goToDashboard, goToRoute} from './app/Navigation';
import {Container} from 'native-base';
import settings, {getProfileImage} from './app/config/settings';
import Meteor from './app/react-native-meteor';
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import MyFunctions from './app/lib/MyFunctions';
import AsyncStorage from '@react-native-community/async-storage';
import DeviceInfo from 'react-native-device-info';
import {Provider as PaperProvider} from 'react-native-paper';
import {customPaperTheme} from './app/config/themes';
import notifee, {EventType, AndroidStyle} from '@notifee/react-native';



class App extends Component {
    constructor(props) {
        super(props);
        Meteor.connect(settings.METEOR_URL);
    }

    componentDidMount() {
        const deviceId = DeviceInfo.getUniqueId();
        messaging().subscribeToTopic('newPoductStaging');
        messaging().subscribeToTopic('newServiceStaging');
        messaging().subscribeToTopic('allGenieeStaging');

        if(!Meteor.getData()._tokenIdSaved) {
            console.log('notLogged');
            Meteor.subscribe('newNotificationCount', deviceId);
        }

        this.messageListener().catch(e => {
            console.log(e);
        });
        //   Meteor.subscribe('srvicesByLimit', {limit:100,coordinates:[this.initialPosition.coords.longitude||85.312950,this.initialPosition.coords.latitude||27.712020]})
        Meteor.subscribe('categories-list');

        Meteor.Accounts.onLogin(async cd => {
            console.log('onLogin');
            Meteor.subscribe('newNotificationCount', deviceId);
            this.checkPermission().catch(e => {
                console.log(e);
            });
            this.getFcmToken;
            AsyncStorage.setItem('loggedUser', JSON.stringify(Meteor.user()));
            Meteor.call('geOwnServiceList', (err, res) => {
                if (!err) {
                    // console.log('MyServices', res);
                    AsyncStorage.setItem('myServices', JSON.stringify(res));
                }
            });
        });
        goToDashboard();
    }

    checkPermission = async () => {
         const authStatus = await messaging().requestPermission();
         const enabled =
           authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
           authStatus === messaging.AuthorizationStatus.PROVISIONAL;
         console.log(enabled)
         if (enabled) {
            this.getFcmToken();
        } else {
            this.requestPermission();
        }
    };

    getFcmToken = async () => {
        const fcmToken = await messaging().getToken();
         console.log(fcmToken);
        if (fcmToken && Meteor.user()) {
            // this.showAlert('Your Firebase Token is:', fcmToken);
            let oldToken = await AsyncStorage.getItem('FCM_TOKEN');
            if (fcmToken && oldToken != fcmToken) {
                MyFunctions._saveDeviceUniqueId(fcmToken);
                if (oldToken) {
                    Meteor.call('removeToken', oldToken);
                }
            }
        } else {
            console.log('Failed', 'No token received or User Not Logged In');
        }
    };

    requestPermission = async () => {
        try {
            await messaging().requestPermission();
            // User has authorised
        } catch (error) {
            // User has rejected permissions
        }
    };
    messageListener = async () => {

        this.notificationListener =  messaging()
             .getInitialNotification()
             .then(notification => {
                const {title, body} = notification;
                // this.showAlert(title, body);
                console.log('onNotification', notification);
                if (notification.data.title == 'REMOVE_AUTH_TOKEN') {
                    try {
                        AsyncStorage.setItem(settings.USER_TOKEN_KEY, '');
                        Meteor.logout();
                        // goToRoute(this.props.componentId,'Auth');
                    } catch (e) {
                        console.log(e.message);
                        //  goToRoute(this.props.componentId,'Auth');
                    }
                }
                const channelId = new firebase.notifications.Android.Channel(
                    'Default',
                    'Default',
                    firebase.notifications.Android.Importance.High,
                );
                firebase.notifications().android.createChannel(channelId);

                let notification_to_be_displayed = new firebase.notifications.Notification(
                    {
                        data: notification.data,
                        sound: 'default',
                        show_in_foreground: true,
                        title: notification.title,
                    },
                );

                if (Platform.OS == 'android') {
                    notification_to_be_displayed.android
                        .setPriority(firebase.notifications.Android.Priority.High)
                        .android.setChannelId('Default')
                        .android.setColor(colors.primary)
                        .android.setAutoCancel(true)
                        .android.setVibrate(1000);
                    if (notification.data.image)
                        notification_to_be_displayed.android.setBigPicture(
                            settings.IMAGE_URL + notification.data.image,
                            getProfileImage(notification.data.icon),
                            notification.title,
                            notification.body,
                        );
                    else
                        notification_to_be_displayed.android.setBigText(notification.body);

                    // console.log(notification_to_be_displayed)
                }

                firebase
                    .notifications()
                    .displayNotification(notification_to_be_displayed);
            });
        // this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
        //     const {title, body} = notificationOpen.notification;
        //     // this.showAlert(title, body);
        //     console.log('onNotificationOpened', notificationOpen)
        //     // if (notificationOpen.notification.data.title == "REMOVE_AUTH_TOKEN") {
        //     //     try {
        //     //         AsyncStorage.setItem(USER_TOKEN_KEY, '');
        //     //         Meteor.logout();
        //     //         goToRoute(this.props.componentId'Auth');
        //     //     }
        //     //     catch (e) {
        //     //         console.log(e.message)
        //     //         goToRoute(this.props.componentId'Auth');
        //     //     }
        //     // }
        //     if (notificationOpen.notification.data.navigate) {
        //         console.log("subscribe & Navigate");
        //         // Meteor.subscribe(notificationOpen.notification.data.subscription, notificationOpen.notification.data.Id, (err) => {
        //         goToRoute(this.props.componentId,notificationOpen.notification.data.route, {Id: notificationOpen.notification.data.Id})
        //         // });
        //     }
        // });
        //
        // const notificationOpen = await firebase.notifications().getInitialNotification();
        // if (notificationOpen) {
        //
        //     const {title, body} = notificationOpen.notification;
        //     //  this.showAlert(title, body);
        //     console.log('notificationOpen', notificationOpen.notification);
        //     if (notificationOpen.notification.data.title == "REMOVE_AUTH_TOKEN") {
        //         try {
        //             AsyncStorage.setItem(USER_TOKEN_KEY, '');
        //             Meteor.logout();
        //             goToRoute(this.props.componentId,'Auth');
        //         }
        //         catch (e) {
        //             console.log(e.message)
        //             goToRoute(this.props.componentId,'Auth');
        //         }
        //     }
        //     if (notificationOpen.notification.data.navigate && Meteor.user()) {
        //         console.log("subscribe & Navigate");
        //         goToRoute(this.props.componentId,notificationOpen.notification.data.route, {Id: notificationOpen.notification.data.Id})
        //     }
        //
        // }

        this.messageListener =  messaging().onMessage(async message => {
            console.log('onMessage', message);
            console.log(JSON.stringify(message));
            let notification = message.notification;
            if (message.data.title == 'REMOVE_AUTH_TOKEN') {
                // try {
                //     AsyncStorage.setItem(USER_TOKEN_KEY, '');
                //     Meteor.logout();
                //     goToRoute(this.props.componentId,'Auth');
                // }
                // catch (e) {
                //     console.log(e.message)
                //     goToRoute(this.props.componentId,'Auth');
                // }
            }
            // Create a channel
            const channelId = await notifee.createChannel({
                id: 'default',
                name: 'Default Channel',
            });

            // Display a notification
            if (Platform.OS == 'android') {
                await notifee.displayNotification({
                    title: notification.title,
                    subtitle: 'subtitle',
                    body: notification.body,
                    android: {
                        channelId,
                        color: colors.primary,
                        smallIcon: 'cicon',
                        largeIcon:message.data.icon? getProfileImage(message.data.icon):null,
                        style: message.data.image ?
                            {type: AndroidStyle.BIGPICTURE, picture: settings.IMAGE_URL + message.data.image} :
                            {type: AndroidStyle.BIGTEXT, text: message.data.body},
                    },
                });
            }
            else{
                await notifee.displayNotification({
                    title: notification.title,
                    body: notification.body,
                });
            }
        });

        notifee.onForegroundEvent(({ type, detail }) => {
            switch (type) {
                case EventType.DISMISSED:
                    console.log('User dismissed notification', detail.notification);

                    break;
                case EventType.PRESS:
                    console.log('User pressed notification', detail.notification);
                    const notificationOpen=detail;
                    // if (notificationOpen.notification.data.title == "REMOVE_AUTH_TOKEN") {
                    //     try {
                    //         AsyncStorage.setItem(USER_TOKEN_KEY, '');
                    //         Meteor.logout();
                    //         goToRoute(this.props.componentId'Auth');
                    //     }
                    //     catch (e) {
                    //         console.log(e.message)
                    //         goToRoute(this.props.componentId'Auth');
                    //     }
                    // }
                    if (notificationOpen.notification.data.navigate) {
                        console.log('subscribe & Navigate');
                        // Meteor.subscribe(notificationOpen.notification.data.subscription, notificationOpen.notification.data.Id, (err) => {
                        goToRoute(
                            this.props.componentId,
                            notificationOpen.notification.data.route,
                            {Id: notificationOpen.notification.data.Id},
                        );
                        // });
                    }
                    break;
            }
            });
    };

    componentWillUnmount() {
    }

    render() {
        return (
            <PaperProvider theme={customPaperTheme}>
                <Container>
                    <ActivityIndicator size="large" color={colors.primary}/>
                </Container>
            </PaperProvider>
        );
    }
}

export default App;
