import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage, NetInfo,
    Text,
    StyleSheet,
    View,
} from 'react-native';
import Meteor, {createContainer} from "react-native-meteor";
import Loading from '../components/Loading/index';
import settings from '../config/settings'
import {colors} from "../config/styles";

try {
    Meteor.connect(settings.METEOR_URL);
}
catch(e){
    console.log("error"+e)
}

class AuthLoadingScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: Meteor.status(),
            user: Meteor.user(),
            netConnected: false
        }
        this._bootstrapAsync();
    }

    // Fetch the token from storage then navigate to our appropriate place
    _bootstrapAsync = async () => {
        if (Meteor.user() !== null) {
            this.props.navigation.navigate('App')
        }
        else if (!this.state.netConnected) {
            alert("You are Offline \n Please check your internet connection...");
            return ;
        }
        // else if (!this.state.status.connected) {
        //     return ;
        // }
        else {
            setTimeout(() => {
                console.log('wait for 2 sec')
            }, 2000)
            if (Meteor.user() !== null) {
                this.props.navigation.navigate('App')
            }
            else
                this.props.navigation.navigate('Auth')
        }
    }

    _handleConnectivityChange = (isConnected) => {
        if (isConnected == true) {
            this.setState({
                netConnected: true,
                user: Meteor.user(),
            })

        }
        else {
            this.setState({
                netConnected: false
            })
        }
        console.log('First change, type: ' + isConnected);
        this._bootstrapAsync();

    }

    componentDidMount() {
        Meteor.connect(settings.METEOR_URL);
        NetInfo.isConnected.addEventListener(
            'connectionChange',
            this._handleConnectivityChange
        );
        NetInfo.isConnected.fetch().done((isConnected) => {

            if (isConnected == true) {
                this.setState({
                    netConnected: true
                })
            }
            console.log('Initial, type: ' + isConnected);
        });


    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener(
            'connectionChange',
            this._handleConnectivityChange
        );
    }

    // Render any loading content that you like here
    render() {

        // if (this.props.user !== null) {
        //     this.props.navigation.navigate('App')
        //  }
        //  else   if(!this.state.netConnected){
        //      return ( <View style={styles.container}>
        //          <View style={styles.logoContainer}>
        //              <Text style={styles.headerText}>You are Offline</Text>
        //              <Text style={styles.subHeaderText} >Please check your internet connection...</Text>
        //          </View>
        //      </View>)
        //  }
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

        return (<Loading />);
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
        padding:25
    },
    headerText: {
        fontSize: 30,
        color: colors.headerText,
        fontWeight: '600',
        fontStyle: 'italic',
    },
    subHeaderText: {
        fontSize: 20,
        color: colors.headerText,
        fontWeight: '400',
        fontStyle: 'italic',
    },
})


export default createContainer(() => {
    return {
        status :Meteor.status(),
        user: Meteor.user(),

    };
}, AuthLoadingScreen);