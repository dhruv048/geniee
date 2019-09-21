import React from 'react';
import NetInfo from "@react-native-community/netinfo";
import Meteor, {createContainer} from "react-native-meteor";
import Loading from '../components/Loading/index';
import settings from '../config/settings'
import {colors} from "../config/styles";
import {StyleSheet, View, Text,AsyncStorage} from 'react-native';
import {UnAuthorized, MainNavigation} from "./Sapp";
import {initializeMeteorOffline} from "../lib/groundMeteor";
import Geolocation from 'react-native-geolocation-service';
import SplashScreen from "react-native-splash-screen";
Meteor.connect(settings.METEOR_URL);
initializeMeteorOffline({log: false});
const USER_TOKEN_KEY = 'USER_TOKEN_KEY_GENNIE';
class AuthLoadingScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: Meteor.status(),
            user: Meteor.user(),
            netConnected: false,
            connected: Meteor.status(),
            initialPosition: 'unknown',
            lastPosition: 'unknown',
        }

        this.watchID=  null;
        this.initialPosition={
            coords:{latitude:27.712020,longitude:85.312950}
        }
        this._bootstrapAsync();
        // Meteor.ddp.on('connected', connected => {
        //     console.log('alert' + connected);
        //     this.setState({connected: true})
        //     this._bootstrapAsync()
        // })
    }

    // Fetch the token from storage then navigate to our appropriate place
    _bootstrapAsync = async () => {
        const userToken = await AsyncStorage.getItem(USER_TOKEN_KEY);
        console.log(userToken)
        if (userToken) {
            if (userToken != Meteor.getData()._tokenIdSaved)
                Meteor._loginWithToken(userToken)
            this.props.navigation.navigate('App');
        }
        else
            this.props.navigation.navigate('UnAuthorized');

        // this.props.navigation.navigate(userToken ? 'App' : 'UnAuthorized');



        // else if (!this.state.netConnected) {
        //    // alert("You are Offline \n Please check your internet connection...");
        //     return ;
        // }
        // else if (!this.state.connected) {
        //     return ;
        // }
        // else {
        //     setTimeout(() => {
        //         console.log('wait for 2 sec')
        //     }, 2000)
        //     if (this.props.user !== null) {
        //         this.props.navigation.navigate('App')
        //     }
        //     else
        //         this.props.navigation.navigate('Auth')
        // }
    }

    _handleConnectivityChange = (isConnected) => {
        if (isConnected == true) {
            this.setState({
                netConnected: true,
                user: Meteor.user(),
            })
            this._bootstrapAsync();

        }
        else {
            this.setState({
                netConnected: false
            })
        }
        console.log('First change, type: ' + isConnected);

    }

    componentDidMount() {

        SplashScreen.hide();
     //   Meteor.subscribe('srvicesByLimit', {limit:100,coordinates:[this.initialPosition.coords.longitude||85.312950,this.initialPosition.coords.latitude||27.712020]})
        Meteor.subscribe('categories-list');
        NetInfo.isConnected.addEventListener(
            'connectionChange', this._handleConnectivityChange
        );
        NetInfo.isConnected.fetch().done((isConnected) => {

            if (isConnected == true) {
                this.setState({
                    netConnected: true
                })
            }
            console.log('Initial, type: ' + isConnected);
        });

        // Meteor.ddp.addEventListener('connected',()=> {
        //     alert('evetListened')
        //     this.setState({
        //         connected:Meteor.status().connected
        //     })
        //     this._bootstrapAsync
        // });

        Geolocation.getCurrentPosition(
            position => {
                const initialPosition = JSON.stringify(position);
                this.setState({initialPosition});
                console.log('initial'+initialPosition)
                this.initialPosition=initialPosition

            },
            error =>{
                console.log('Error', JSON.stringify(error))
               // Meteor.subscribe('srvicesByLimit', {limit:200,coordinates:[85.312950,27.712020]});
            },
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
        );

    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener(
            'connectionChange',
            //  this._handleConnectivityChange
        );

        this.watchID != null && Geolocation.clearWatch(this.watchID);
    }

    con

    // Render any loading content that you like here
    render() {
        // if (this.props.user !== null) {
        //     this.props.navigation.navigate('App')
        //  }
        if (!this.state.netConnected) {
            return (<View style={styles.container}>
                <View style={styles.logoContainer}>
                    <Text style={styles.headerText}>You are Offline</Text>
                    <Text style={styles.signupText}>Please check your internet connection...</Text>
                </View>
            </View>)
        }
        //  else if (!this.props.status.connected) {
        //      return <Loading />;
        //  }
        //  else {
        //      setTimeout(()=>{
        //          console.log('wait for 2 sec')
        //      },2000)
        //      if (this.props.user !== null) {
        //          this.props.navigation.navigate('App')
        //      }
        //      else
        //          this.props.navigation.navigate('Auth')
        //  }
        else {
            return(
           <Loading/>
            )
        }
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        padding: 25
    },
    signupText: {
        color: colors.primaryText,
        fontSize: 16,
        fontWeight: '700',
        paddingVertical: 2
    },
});

export default createContainer(() => {
    return {
        status: Meteor.status(),
        user: Meteor.user(),

    };
}, AuthLoadingScreen);