/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React,{Component} from 'react';
import {
    StyleSheet,
    ActivityIndicator,
} from 'react-native';

import { colors} from './app/config/styles';
import {goToDashboard, goToRoute} from "./app/Navigation";
import {Container} from "native-base";
import settings, {getProfileImage} from "./app/config/settings";
import Meteor from './app/react-native-meteor';
import firebase from "react-native-firebase";
import MyFunctions from "./app/lib/MyFunctions";
import AsyncStorage from "@react-native-community/async-storage";
import DeviceInfo from "react-native-device-info";
import { Provider as PaperProvider } from 'react-native-paper';
import {customPaperTheme} from "./app/config/themes";
class App extends Component {
    constructor(props){
        super(props)
        Meteor.connect(settings.METEOR_URL);
    };
    componentDidMount(){
        const deviceId = DeviceInfo.getUniqueId();
        firebase.messaging().subscribeToTopic('newPoductStaging');
        firebase.messaging().subscribeToTopic('newServiceStaging');
        firebase.messaging().subscribeToTopic('allGenieeStaging');

        Meteor.subscribe('newNotificationCount',deviceId);

        this.messageListener()
            .catch(e => {
                console.log(e)
            });
        //   Meteor.subscribe('srvicesByLimit', {limit:100,coordinates:[this.initialPosition.coords.longitude||85.312950,this.initialPosition.coords.latitude||27.712020]})
        Meteor.subscribe('categories-list');

        Meteor.Accounts.onLogin(async cd => {
            console.log('onLogin');
            this.checkPermission().catch(e => {
                console.log(e)
            });
            this.getFcmToken;
            // Meteor.call('getSingleUser', Meteor._userIdSaved, (err, res) => {
            //     if (!err) {
            //         // console.log(res)
                    //AsyncStorage.setItem('loggedUser', JSON.stringify(Meteor.collection('userDetails').findOne({_id:  Meteor._userIdSaved})));
                    AsyncStorage.setItem('loggedUser', JSON.stringify(Meteor.user()));
                // }
            //Store own Services
            Meteor.call('geOwnServiceList', (err,res)=>{
                if(!err){
                    console.log('myServices',res)
                    AsyncStorage.setItem('myServices',JSON.stringify(res))
                }
            })

            });
        goToDashboard();
    }
    checkPermission = async () => {
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            this.getFcmToken();
        } else {
            this.requestPermission();
        }
    };

    getFcmToken = async () => {
        const fcmToken = await firebase.messaging().getToken();
        console.log(fcmToken);
        if (fcmToken && Meteor.user()) {
            // this.showAlert('Your Firebase Token is:', fcmToken);
            let oldToken = await AsyncStorage.getItem("FCM_TOKEN");
            if(fcmToken && oldToken!=fcmToken) {
                MyFunctions._saveDeviceUniqueId(fcmToken);
                if (oldToken) {
                    Meteor.call('removeToken', oldToken)
                }
            }
        } else {
            console.log('Failed', 'No token received or User Not Logged In');
        }
    };

    requestPermission = async () => {
        try {
            await firebase.messaging().requestPermission();
            // User has authorised
        } catch (error) {
            // User has rejected permissions
        }
    }
    messageListener = async () => {
        this.notificationListener = firebase.notifications().onNotification((notification) => {
            const {title, body} = notification;
            // this.showAlert(title, body);
            console.log('onNotification', notification)
            if (notification.data.title == "REMOVE_AUTH_TOKEN") {
                try {
                    AsyncStorage.setItem(settings.USER_TOKEN_KEY, '');
                    Meteor.logout();
                   // goToRoute(this.props.componentId,'Auth');
                }
                catch (e) {
                    console.log(e.message)
                  //  goToRoute(this.props.componentId,'Auth');
                }
            }
            const channelId = new firebase.notifications.Android.Channel("Default", "Default", firebase.notifications.Android.Importance.High);
            firebase.notifications().android.createChannel(channelId);

            let notification_to_be_displayed = new firebase.notifications.Notification({
                data: notification.data,
                sound: 'default',
                show_in_foreground: true,
                title: notification.title,
            });

            if (Platform.OS == "android") {
                notification_to_be_displayed
                    .android.setPriority(firebase.notifications.Android.Priority.High)
                    .android.setChannelId("Default")
                    .android.setColor(colors.primary)
                    .android.setAutoCancel(true)
                    .android.setVibrate(1000);
                if(notification.data.image)
                 notification_to_be_displayed.android.setBigPicture(settings.IMAGE_URL+notification.data.image,getProfileImage(notification.data.icon), notification.title, notification.body);
                else
                    notification_to_be_displayed.android.setBigText(notification.body);

               // console.log(notification_to_be_displayed)
            }

            firebase.notifications().displayNotification(notification_to_be_displayed);
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

        this.messageListener = firebase.messaging().onMessage((message) => {
            console.log(JSON.stringify(message));
            console.log('onMessage', message);
            if (message.data.title == "REMOVE_AUTH_TOKEN") {
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
        });
    }
    componentWillUnmount() {
    }
    render() {
        return(
            <PaperProvider theme={customPaperTheme}>
            <Container>
                <ActivityIndicator size="large" color={colors.primary} />
            </Container>
            </PaperProvider>
        );
    }
};

export default App;
