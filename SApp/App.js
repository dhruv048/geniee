

import React, {Component} from 'react';
import {NetInfo, Text, View, StyleSheet} from 'react-native';
import Meteor, {createContainer} from 'react-native-meteor';
import { AuthStack, HomeStack } from './app/config/routes';
import Loading from './app/components/Loading/index';
import settings from './app/config/settings'
import {colors} from "./app/config/styles";

// const instructions = Platform.select({
//   ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
//   android:
//     'Double tap R on your keyboard to reload,\n' +
//     'Shake or press menu button for dev menu',
// });
//
// type Props = {};
try {
    Meteor.connect(settings.METEOR_URL);
}
catch(e){
    console.log("error"+e)
}
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
class App extends Component {
     constructor(props)
     {
         super(props);
         this.state = {
             status :Meteor.status(),
             user: Meteor.user(),
             netConnected:false
         }
         // this._handleConnectivityChange = this._handleConnectivityChange.bind(this);
         // setInterval(() => (
         //      console.log(settings.METEOR_URL+""+ Meteor.status().connected),
         //     this.setState(
         //         {
         //             user: Meteor.user(),
         //             status: Meteor.status(),
         //         }
         //     )
         // ), 1000);
     };
     _handleConnectivityChange=(isConnected)=> {
         if(isConnected == true) {
             this.setState({
                 netConnected: true,
                 user:Meteor.user(),
             })
         }
         else{
             this.setState({
                 netConnected: false
             })
         }
         console.log('First change, type: ' + isConnected);

     }
     componentDidMount() {
         Meteor.connect(settings.METEOR_URL);
         NetInfo.isConnected.addEventListener(
             'connectionChange',
             this._handleConnectivityChange
         );
         NetInfo.isConnected.fetch().done((isConnected) => {

             if(isConnected == true) {
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

     render() {
         if (this.props.user !== null) {
             return <HomeStack />;
         }
         else   if(!this.state.netConnected){
             return ( <View style={styles.container}>
                 <View style={styles.logoContainer}>
                     <Text style={styles.headerText}>You are Offline</Text>
                     <Text style={styles.subHeaderText} >Please check your internet connection...</Text>
                 </View>
             </View>)
         }
         else if (!this.props.status.connected) {
             return <Loading />;
         }
         else {
             setTimeout(()=>{
                 console.log('wait for 2 sec')
             },2000)
             if (this.props.user !== null) {
                 return <HomeStack />;
             }
             else
                 return <AuthStack/>;
         }
     }
}
export default createContainer(() => {
    return {
        status :Meteor.status(),
        user: Meteor.user(),

    };
}, App);





