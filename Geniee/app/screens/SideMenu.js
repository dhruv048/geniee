import React, {PureComponent,Fragment, useEffect, useState,} from 'react';
import {connect} from 'react-redux';
import {Body, Container, Content, Header, Icon, Item, Right, Text} from "native-base";
import {colors} from "../config/styles";
import {StatusBar, StyleSheet, Alert, View, Image, TouchableOpacity,SafeAreaView,BackHandler} from "react-native";
import ContactUs from "./ContactUs";
import ForgotPassword from "./ForgotPassword";
import Meteor from "../react-native-meteor";
import AsyncStorage from "@react-native-community/async-storage";
import MessageCount from "../components/MessageCount/MessageCount";
import settings , {getProfileImage} from "../config/settings";
import DeviceInfo from 'react-native-device-info';
import FooterTabs from '../components/FooterTab';
import {loggedUserSelector} from '../store/selectors/auth';
import authHandlers from '../../../store/services/auth/handlers'

const USER_TOKEN_KEY = 'USER_TOKEN_KEY_GENNIE';

const SideMenu = ({navigation, loggedUser}) => {

    const [isLogged, setIsLogged] = useState(loggedUser ? true : false);
    const [currentRoute, setCurrentRoute] =useState('Dashboard');
    const [user, setUser] = useState('');

    useEffect(async () => {
        setIsLogged(loggedUser? true:false);
        setUser(loggedUser);
    },[loggedUser])
    
    const handleBack=()=>{
            console.log('handlebackpress')
            navigation.navigate('Dashboard');
            return true;
    }

    const navigateToRoute = (route) =>{
        navigation.navigate(route)
    }

    const _signOut = () => {
        Alert.alert(
            'SignOut',
            'Do you want to SignOut?',
            [
                {
                    text: 'Yes SignOut',
                    onPress: () => authHandlers.handleSignOut((res)=>{
                        if(res === true){
                            setIsLogged(false);
                            setUser('');
                            navigation.navigate( 'Dashboard');
                        }else{
                            console.log('Please contact administrator.')
                        }
                    })
                },
                {text: 'Cancel', onPress: () => {}}
            ],
            {cancelable: false}
        );
    }
    const _signOut1 = () => {
        Alert.alert(
            'SignOut',
            'Do you want to SignOut?',
            [
                {
                    text: 'Yes SignOut', onPress: () => Meteor.logout((err) => {
                        // if (!err) {
                            console.log('logout',err);
                            AsyncStorage.setItem(USER_TOKEN_KEY, '');
                            AsyncStorage.setItem('loggedUser', '');
                            //this.setState({isLogged: false,user:''});
                            setIsLogged(false);
                            setUser('');
                            navigation.navigate( 'Dashboard');
                        // }
                        // else
                        //     props.navigation.goBack()
                    })
                },
                {text: 'Cancel', onPress: () => {}}
            ],
            {cancelable: false}
        );
    }

        return (
            <Fragment>
            <SafeAreaView style={{ flex: 0,  }} />
                <Header androidStatusBarColor={colors.statusBar}
                        style={{height: 220,backgroundColor: '#daecf2' }} >
                    <View style={{justifyContent: 'center', alignItems: 'center'}}>

                    {user ?
                        <TouchableOpacity onPress={navigateToRoute.bind(this,'Profile')}>
                            <>
                                <Image style={{
                                    width: 147,
                                    height: 147,
                                    borderRadius: 15,
                                    borderWidth: 3,
                                    // height: 150,
                                    justifyContent: `center`,
                                    alignSelf: 'center',
                                    borderColor: `rgba(87, 150, 252, 1)`,
                                    backgroundColor:'white',
                                }}
                                       source={user.profile.profileImage ? {uri: getProfileImage(user.profile.profileImage)} : require('../images/user-icon.png')}/>
                                {/*{user?*/}
                                {/*<Icon name="edit" color="#4F8EF7" size={25} style={{ position: 'absolute', bottom: 0, left: 60 }} />:null}*/}
                            </>
                        </TouchableOpacity> :
                        <Image style={{width: 150, height: 150}}
                               source={require('../images/logo2-trans-640X640.png')}/>}
                    <Text style={{fontSize: 16, fontWeight: "400", color: colors.appLayout}}>WELCOME</Text>
                    {user ?
                        <Text style={{
                            fontSize: 14,
                            fontWeight: "200",
                            color: colors.appLayout
                        }}>{user.profile.name}</Text> : null}

                    <Text note style={{color:colors.appLayout}}>[ Version: {DeviceInfo.getVersion()} ]</Text>
                    </View>


                </Header>
                <Content style={{flex: 1, marginTop: 1, backgroundColor:'white'}}>
                    <TouchableOpacity onPress={() => navigateToRoute("Dashboard")}>
                        <View style={[style.screenStyle]}>
                            <Text
                                style={[currentRoute == 'Dashboard' ? style.selectedTextStyle : style.screenTextStyle]}>Home</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigateToRoute("Orders")}>
                        <View style={[style.screenStyle]}>
                            <Text
                                style={[currentRoute == 'Orders' ? style.selectedTextStyle : style.screenTextStyle]}>Orders</Text>
                        </View>
                    </TouchableOpacity>
                    {isLogged ?
                        <>
                            <TouchableOpacity onPress={() => navigateToRoute("Chat")}>
                                <View style={[style.screenStyle]}>
                                    <Text
                                        style={[currentRoute == 'Chat' ? style.selectedTextStyle : style.screenTextStyle]}>Message</Text>
                                    <Right style={{marginRight: 10}}>
                                        <MessageCount/>
                                    </Right>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigateToRoute("MyServices")}>
                                <View style={[style.screenStyle]}>
                                    <Text style={[currentRoute == 'MyServices' ? style.selectedTextStyle : style.screenTextStyle]}>My Business</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.navigateToRoute("AddService")}>
                                <View style={[style.screenStyle]}>
                                    <Text
                                        style={[currentRoute == 'AddService' ? style.selectedTextStyle : style.screenTextStyle]}>Create Business/Store</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigateToRoute("MyProducts")}>
                                <View style={[style.screenStyle]}>
                                    <Text style={[currentRoute == 'MyProducts' ? style.selectedTextStyle : style.screenTextStyle]}>My Products/Services</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.navigateToRoute("AddProduct")}>
                                <View style={[style.screenStyle]}>
                                    <Text
                                        style={[currentRoute == 'AddProduct' ? style.selectedTextStyle : style.screenTextStyle]}>Create Product/Service</Text>
                                </View>
                            </TouchableOpacity></> : null}

                    <TouchableOpacity onPress={() => navigateToRoute("ContactUs")}>
                        <View style={[style.screenStyle]}>
                            <Text
                                style={[currentRoute == 'ContactUs' ? style.selectedTextStyle : style.screenTextStyle]}>Contact
                                Us</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigateToRoute("ForgotPassword")}>
                        <View style={[style.screenStyle]}>
                            <Text
                                style={[currentRoute == 'ForgotPassword' ? style.selectedTextStyle : style.screenTextStyle]}>Forgot
                                Password</Text>
                        </View>
                    </TouchableOpacity>

                    {isLogged ?
                        <TouchableOpacity onPress={_signOut}>
                            <View style={[style.screenStyle]}>
                                <Text
                                    style={[currentRoute == 'SignOut' ? style.selectedTextStyle : style.screenTextStyle]}>SignOut</Text>
                            </View>
                        </TouchableOpacity> :
                        <TouchableOpacity onPress={() => navigateToRoute("SignIn")}>
                            <View style={[style.screenStyle]}>
                                <Text
                                    style={[currentRoute == 'SignIn' ? style.selectedTextStyle : style.screenTextStyle]}>Sign
                                    In</Text>
                            </View>
                        </TouchableOpacity>}

                    {/*<View style={[styles.screenStyle, {paddingLeft: 28}]}>*/}
                        {/*<MaterialIcons name='get-app' size={20}/>*/}
                        {/*<Text*/}
                            {/*style={[styles.screenTextStyle, {paddingLeft: 20}]}>V: {DeviceInfo.getVersion()}</Text>*/}
                    {/*</View>*/}

                </Content>
                {/* <FooterTabs route={'More'} componentId={this.props.componentId}/> */}
            </Fragment>
        )
}

export default connect(loggedUserSelector)(SideMenu);

const style = StyleSheet.create({
    activeRoute: {
        backgroundColor: colors.appLayout,
        height: 50,
        padding: 2
    },
    normalRoute: {
        backgroundColor: 'white',
        height: 50,
        padding: 2
    },
    activeText: {
        color: '#ffffff',
        fontSize: 22,
        marginLeft: 30,
        fontWeight: '700'
    },
    normalText: {
        color: colors.appLayout,
        fontSize: 20,
        marginLeft: 30,
        fontWeight: '600'
    },
    screenStyle: {
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%'
    },
    screenTextStyle: {
        fontSize: 17,
        paddingHorizontal: 30,
        color: colors.gray_200,
    },
    selectedTextStyle: {
        fontSize: 19,
        paddingHorizontal: 30,
        color: colors.primary,
        fontWeight: 'bold'
    },

    imageView: {
        alignItems: `center`,
        borderColor: colors.inputBackground,
        borderRadius: 10,
        borderWidth: 3,
        height: 150,
        justifyContent: `center`,
        marginTop: 0,
        width: '100%',
    },
})
