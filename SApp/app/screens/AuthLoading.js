import React from 'react';
import NetInfo from "@react-native-community/netinfo";
import Meteor, {createContainer} from "react-native-meteor";
import Loading from '../components/Loading/index';
import settings from '../config/settings'
import {colors} from "../config/styles";
import {StyleSheet, View, Text} from 'react-native';
import {UnAuthorized, MainNavigation} from "./Sapp";
import {initializeMeteorOffline} from "../lib/groundMeteor";
import Geolocation from '@react-native-community/geolocation';

try {
    Meteor.connect(settings.METEOR_URL);
    initializeMeteorOffline({log: true});
}
catch (e) {
    console.log("error" + e)
}

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
        this._bootstrapAsync();
        Meteor.ddp.on('connected', connected => {
            console.log('alert' + connected);
            this.setState({connected: true})
            this._bootstrapAsync()
        })
        this.watchID=  null;
    }

    // Fetch the token from storage then navigate to our appropriate place
    _bootstrapAsync = async () => {
        //this.props.navigation.navigate('App')
        if (this.props.user !== null) {
            this.props.navigation.navigate('App')
        }
        else {
            this.props.navigation.navigate('UnAuthorized')
        }
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
        Meteor.connect(settings.METEOR_URL);

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
                Meteor.subscribe('srvicesByLimit', {limit:100,coordinates:[initialPosition.coords.longitude||85.312950,initialPosition.coords.latitude||27.712020]});
            },
            error =>{
                console.log('Error', JSON.stringify(error))
                Meteor.subscribe('srvicesByLimit', {limit:50,coordinates:[85.312950,27.712020]});
            },
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
        );
        this.watchID = Geolocation.watchPosition(position => {
            const lastPosition = JSON.stringify(position);
            console.log(lastPosition);
            this.setState({lastPosition});
        });


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
            if (this.props.user !== null && this.props.user !== undefined) {
                return <MainNavigation/>
            }
            else
                return <UnAuthorized/>;
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