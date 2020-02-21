import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,Dimensions
} from 'react-native';
import settings from "../config/settings";
import {colors} from "../config/styles";
import Icon from 'react-native-vector-icons/Feather';
import AutoHeightWebView from "react-native-autoheight-webview";
import {Navigation} from "react-native-navigation";
import {Button} from "native-base";
import call from 'react-native-phone-call'

export default class Profile extends Component {
    _callPhone(number){
        // let res=  this.onEsewaComplete();
        // alert(res);
        // console.log(number)
        // if (!number) {
        //     Alert.alert('Contact No. Unavailable for the Service')
        // }

        const args = {
            number: settings.PHONE, // String value with the number to call
            prompt: false // Optional boolean property. Determines if the user should be prompt prior to the call
        }
        call(args).catch(console.error)
    }
    render() {
        const { User } = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Button style={{marginLeft:15,marginTop:10}} transparent onPress={()=>{Navigation.pop(this.props.componentId)}}>
                        <Icon name={'arrow-left'} size={29} color={'white'}/>
                    </Button>
                </View>
                <Image style={styles.avatar} source={{uri: settings.IMAGE_URL+User.profilepic}}/>
                <View style={styles.body}>
                    <View style={styles.bodyContent}>
                        <Text style={styles.name}>{User.fullname}</Text>
                        <Text style={styles.info}>{User.description}</Text>
                        {/*<Text style={styles.description}>Lorem ipsum dolor sit amet, saepe sapientem eu nam. Qui ne assum electram expetendis, omittam deseruisse consequuntur ius an,</Text>*/}
                        <AutoHeightWebView
                            style={{
                                width: Dimensions.get('window').width - 33,
                                marginHorizontal: 15,
                                marginVertical: 20
                            }}

                            customStyle={''}
                            // either height or width updated will trigger this
                            onSizeUpdated={size => console.log(size.height)}

                            source={{html: User.userContent}}
                           // scalesPageToFit={true}
                        />
                        <TouchableOpacity style={styles.buttonContainer} onPress={()=>this._callPhone()}>
                            <Text style={{color:'white'}}>Call Now</Text>
                        </TouchableOpacity>
                        {/*<TouchableOpacity style={styles.buttonContainer}>*/}
                            {/*<Text>Opcion 2</Text>*/}
                        {/*</TouchableOpacity>*/}
                    </View>

                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
      flex:1
    },
    header:{
        backgroundColor: colors.appLayout,
        height:200,
    },
    avatar: {
        width: 130,
        height: 130,
        borderRadius: 63,
        borderWidth: 4,
        borderColor: "white",
        marginBottom:10,
        alignSelf:'center',
        position: 'absolute',
        marginTop:130
    },
    name:{
        fontSize:22,
        color:"#FFFFFF",
        fontWeight:'600',
    },
    body:{
        marginTop:40,
        flex:1,
        width:'100%'
    },
    bodyContent: {
        flex: 1,
        alignItems: 'center',
        padding:30,
        width:'100%'
    },
    name:{
        fontSize:28,
        color: "#696969",
        fontWeight: "600"
    },
    info:{
        fontSize:16,
        color: "#00BFFF",
        marginTop:10
    },
    description:{
        fontSize:16,
        color: "#696969",
        marginTop:10,
        textAlign: 'center'
    },
    buttonContainer: {
       // marginTop:5,
        height:35,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
   //     marginBottom:5,
        width:250,
        borderRadius:30,
        backgroundColor: colors.appLayout,
    },
});
