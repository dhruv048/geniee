import React, {PureComponent} from 'react';
import {Body, Container, Content, Header, Icon, Item, Right, Text} from "native-base";
import {colors} from "../config/styles";
import {StatusBar, StyleSheet, Alert, TouchableNativeFeedback, View, Image, TouchableOpacity} from "react-native";
import {Navigation} from "react-native-navigation/lib/dist/index";
import {goBack, goToRoute, navigateToRoutefromSideMenu} from "../Navigation";
import ContactUs from "./ContactUs";
import ForgotPassword from "./ForgotPassword";
import Meteor from "../react-native-meteor";
import {EventRegister} from 'react-native-event-listeners';
import AsyncStorage from "@react-native-community/async-storage";
import MessageCount from "../components/MessageCount/MessageCount";
import settings , {getProfileImage} from "../config/settings";
import DeviceInfo from 'react-native-device-info';

const USER_TOKEN_KEY = 'USER_TOKEN_KEY_GENNIE';

class SideMenu extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isLogged: Meteor.user() ? true : false,
            currentRoute: 'Dashboard',
            user: ''
        }
    }

    async componentDidMount() {
        let Token=await AsyncStorage.getItem(USER_TOKEN_KEY)
        Navigation.events().bindComponent(this);
        this.setState({isLogged: Token ? true : false, user: this.props.loggedUser})
        this.listener = EventRegister.addEventListener('routeChanged', (data) => {
            console.log('routeChanged', data)
            this.setState({
                currentRoute: data
            })
        })
    }

    componentWillReceiveProps(newProps) {
        this.setState({isLogged: newProps.loggedUser ? true : false})
       // if (newProps.loggedUser)
            this.setState({user: newProps.loggedUser})
    }

    navigateToRoute(route) {
        navigateToRoutefromSideMenu(this.props.componentId, route)
    }

    _signOut() {
        Alert.alert(
            'SignOut',
            'Do you want to SignOut?',
            [
                {
                    text: 'Yes SignOut', onPress: () => Meteor.logout((err) => {
                        if (!err) {
                            console.log('logout');
                            AsyncStorage.setItem(USER_TOKEN_KEY, '');
                            navigateToRoutefromSideMenu(this.props.componentId, 'Dashboard');
                        }
                        else
                            goBack(this.props.componentId)
                    })
                },
                {text: 'Cancel', onPress: () => navigateToRoutefromSideMenu(this.props.componentId, 'Dashboardd')}
            ],
            {cancelable: false}
        );

        // Meteor.logout((err) => {
        //     if (!err){
        //         console.log('logout')
        //         AsyncStorage.setItem(USER_TOKEN_KEY, '');
        //         this.props.navigation.navigate('UnAuthorized');
        //     }
        //     else
        //         goBack(this.props.componentId)
        // })
    }

    render() {
        return (
            <Container>
                <Header androidStatusBarColor={colors.statusBar}
                        style={{height: 220, backgroundColor: colors.inputBackground}}>
                    <Body style={{justifyContent: 'center', alignItems: 'center'}}>
                    {this.state.user ?
                        <TouchableOpacity onPress={this.navigateToRoute.bind(this,'Profile')}>
                            <>
                                <Image style={{
                                    width: 147,
                                    height: 147,
                                    borderRadius: 15,
                                    borderWidth: 3,
                                    // height: 150,
                                    justifyContent: `center`,
                                    alignSelf: 'center',
                                    borderColor: `rgba(87, 150, 252, 1)`
                                }}
                                       source={this.state.user.profile.profileImage ? {uri: getProfileImage(this.state.user.profile.profileImage)} : require('../images/duser.png')}/>
                                {/*{this.state.user?*/}
                                {/*<Icon name="edit" color="#4F8EF7" size={25} style={{ position: 'absolute', bottom: 0, left: 60 }} />:null}*/}
                            </>
                        </TouchableOpacity> :
                        <Image style={{width: 150, height: 150}}
                               source={require('../images/logo2-trans-640X640.png')}/>}
                    <Text style={{fontSize: 16, fontWeight: "400", color: 'white'}}>WELLCOME</Text>
                    {this.state.user ?
                        <Text style={{
                            fontSize: 14,
                            fontWeight: "200",
                            color: 'white'
                        }}>{this.state.user.profile.name}</Text> : null}

                    <Text note style={{color:'white'}}>[ Version: {DeviceInfo.getVersion()} ]</Text>
                    </Body>


                </Header>
                <Content style={{flex: 1, marginTop: 1}}>
                    <TouchableNativeFeedback onPress={() => this.navigateToRoute("Dashboard")}>
                        <View style={[style.screenStyle]}>
                            <Text
                                style={[this.state.currentRoute == 'Dashboard' ? style.selectedTextStyle : style.screenTextStyle]}>Home</Text>
                        </View>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback onPress={() => this.navigateToRoute("Orders")}>
                        <View style={[style.screenStyle]}>
                            <Text
                                style={[this.state.currentRoute == 'Orders' ? style.selectedTextStyle : style.screenTextStyle]}>My
                                Orders</Text>
                        </View>
                    </TouchableNativeFeedback>
                    {this.state.isLogged ?
                        <>
                            <TouchableNativeFeedback onPress={() => this.navigateToRoute("Chat")}>
                                <View style={[style.screenStyle]}>
                                    <Text
                                        style={[this.state.currentRoute == 'Chat' ? style.selectedTextStyle : style.screenTextStyle]}>Chat</Text>
                                    <Right style={{marginRight: 10}}>
                                        <MessageCount/>
                                    </Right>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback onPress={() => this.navigateToRoute("MyServices")}>
                                <View style={[style.screenStyle]}>
                                    <Text
                                        style={[this.state.currentRoute == 'MyServices' ? style.selectedTextStyle : style.screenTextStyle]}>My
                                        Services</Text>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback onPress={() => this.navigateToRoute("AddService")}>
                                <View style={[style.screenStyle]}>
                                    <Text
                                        style={[this.state.currentRoute == 'AddService' ? style.selectedTextStyle : style.screenTextStyle]}>Add
                                        Service</Text>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback onPress={() => this.navigateToRoute("AddProduct")}>
                                <View style={[style.screenStyle]}>
                                    <Text
                                        style={[this.state.currentRoute == 'AddProduct' ? style.selectedTextStyle : style.screenTextStyle]}>Add
                                        Product</Text>
                                </View>
                            </TouchableNativeFeedback></> : null}

                    <TouchableNativeFeedback onPress={() => this.navigateToRoute("ContactUs")}>
                        <View style={[style.screenStyle]}>
                            <Text
                                style={[this.state.currentRoute == 'ContactUs' ? style.selectedTextStyle : style.screenTextStyle]}>Contact
                                Us</Text>
                        </View>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback onPress={() => this.navigateToRoute("ForgotPassword")}>
                        <View style={[style.screenStyle]}>
                            <Text
                                style={[this.state.currentRoute == 'ForgotPassword' ? style.selectedTextStyle : style.screenTextStyle]}>Forgot
                                Password</Text>
                        </View>
                    </TouchableNativeFeedback>

                    {this.state.isLogged ?
                        <TouchableNativeFeedback onPress={() => this._signOut()}>
                            <View style={[style.screenStyle]}>
                                <Text
                                    style={[this.state.currentRoute == 'SignOut' ? style.selectedTextStyle : style.screenTextStyle]}>SignOut</Text>
                            </View>
                        </TouchableNativeFeedback> :
                        <TouchableNativeFeedback onPress={() => this.navigateToRoute("SignIn")}>
                            <View style={[style.screenStyle]}>
                                <Text
                                    style={[this.state.currentRoute == 'SignIn' ? style.selectedTextStyle : style.screenTextStyle]}>Sign
                                    In</Text>
                            </View>
                        </TouchableNativeFeedback>}

                    {/*<View style={[styles.screenStyle, {paddingLeft: 28}]}>*/}
                        {/*<MaterialIcons name='get-app' size={20}/>*/}
                        {/*<Text*/}
                            {/*style={[styles.screenTextStyle, {paddingLeft: 20}]}>V: {DeviceInfo.getVersion()}</Text>*/}
                    {/*</View>*/}

                </Content>
            </Container>
        )
    }
}

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

export default Meteor.withTracker(() => {
    return {
        loggedUser: Meteor.user()
    }
})(SideMenu);