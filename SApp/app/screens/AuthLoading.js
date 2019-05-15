import React from 'react';
import NetInfo from "@react-native-community/netinfo";
import Meteor, {createContainer} from "react-native-meteor";
import Loading from '../components/Loading/index';
import settings from '../config/settings'
import {colors} from "../config/styles";
import {StyleSheet, View,Text} from 'react-native';

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
            netConnected: false,
            connected:Meteor.status()
        }
        this._bootstrapAsync();
        Meteor.ddp.on('connected',connected=>{
            console.log('alert'+connected);
            this.setState({connected:true})
            this._bootstrapAsync()
        })
    }

    // Fetch the token from storage then navigate to our appropriate place
    _bootstrapAsync = async () => {
       // this.props.navigation.navigate('App')
        if (this.props.user !== null) {
            this.props.navigation.navigate('App')
        }
        // else
        //     this.props.navigation.navigate('Auth')
        else if (!this.state.netConnected) {
           // alert("You are Offline \n Please check your internet connection...");
            return ;
        }
        else if (!this.state.connected) {
            return ;
        }
        else {
            setTimeout(() => {
                console.log('wait for 2 sec')
            }, 2000)
            if (this.props.user !== null) {
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

    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener(
            'connectionChange',
          //  this._handleConnectivityChange
        );
    }

    // Render any loading content that you like here
    render() {
        // if (this.props.user !== null) {
        //     this.props.navigation.navigate('App')
        //  }
            if(!this.state.netConnected){
             return ( <View style={styles.container}>
                 <View style={styles.logoContainer}>
                     <Text style={styles.headerText}>You are Offline</Text>
                     <Text style={styles.subHeaderText} >Please check your internet connection...</Text>
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

                return (<Loading/>);
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
        padding:25
    }
});

export default createContainer(() => {
    return {
        status :Meteor.status(),
        user: Meteor.user(),

    };
}, AuthLoadingScreen);