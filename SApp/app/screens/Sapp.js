import {createDrawerNavigator, DrawerItems,createAppContainer,createStackNavigator,createSwitchNavigator} from 'react-navigation';
import {StyleSheet,Text, Image, Alert,TouchableOpacity} from 'react-native'
import Home from '../screens/Home';
import Settings,{userType} from '../screens/Settings';
import ServiceDetail from '../screens/ServiceDetail';
import Details from '../screens/Details';
import AddService from '../screens/AddService';
import ChatList from './chat/ChatList';
import {Container, Content, Header,Body} from 'native-base';
import React from 'react';
import { colors } from '../config/styles';
import Icon  from 'react-native-vector-icons/FontAwesome';
import Meteor from "react-native-meteor";
import Chat from "./chat/Chat";
import LogOut from "./LogOut"
import SignIn from "./SignIn";
import Register from "./Register";
import AuthLoadingScreen from "./AuthLoading";
import Dashboard from "./Dashboard";

//import Splash from '../screens/Splash';

//export const SplashStack = createStackNavigator({
    //Splash: {
        //screen: Splash,
    //}
//}, {
    //headerMode: 'none',
//});

export const AuthStack = createStackNavigator({
    SignIn: {
        screen: SignIn,
    },
    Register: {
        screen: Register,
    },
}, {
    initialRoute:Register,
    headerMode: 'none',
});


export const ChatStack = createStackNavigator({
    ChatList: {
        screen: ChatList,
    },
    Message:{
        screen: Chat,
    }
},{
    headerMode:'none'
});


export const HomeStack = createStackNavigator({
    Dashboard:{
        screen:Dashboard,
    },
    Home: {
        screen: Home,
    },
    Details: {
        screen: Details,

    },
    Chat:{
        screen:Chat,
    },
    Service:{
        screen: ServiceDetail,
    },

    // signIn:{
    //     screen:AuthStack,
    // },
},{
    headerMode: 'none',
    initialRouteName:'Dashboard'
});

const CustomDrawerContentComponent=(props)=>(
    <Container>
        <Header style={{height:200, backgroundColor: '#094c6b'}}>
            <Body style={{justifyContent:'center',alignItems:'center'}}>
            <Image
                style={styles.drawerImage}
                source={require('../images/duser.png')}/>
            </Body>
        </Header>
        <Content style={{backgroundColor:colors.appBackground}}>
            <DrawerItems {...props}/>
            {/*<TouchableOpacity style={{marginLeft:17, flexDirection: 'row'}} onPress={()=>{this.handleSignout()}}>*/}
                {/*<Icon size={25} name='sign-out' style={{fontWeight:'100'}}  ></Icon>*/}
                {/*<Text style={{marginLeft:30,fontWeight:'500'}} >LOG OUT</Text>*/}
            {/*</TouchableOpacity>*/}
        </Content>
    </Container>
)
handleSignout= () => {
    Alert.alert(
        'SignOut',
        'Do you want to SignOut?',
        [
            {
                text: 'Yes SignOut', onPress: () => Meteor.logout((err) => {
                        // if (!err)
                        //    this.props.navigation.navigate('Auth')
                })
            },
            {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'}
        ],
        {cancelable: false}
    )
}

export  const MainNavigation= createDrawerNavigator({
    Home:{
        screen : HomeStack,
        navigationOptions:{
            drawerLabel: 'HOME',
            drawerIcon: (
                <Icon name='home' size={24} />
            )
        }
    },

    AddService: {
        screen: AddService,
        navigationOptions:{
            drawerLabel: "ADD SERVICE",
            drawerIcon: (
                <Icon name='plus' size={24} />
            )
        }
    },

    CHAT:{
        screen:ChatStack,
        navigationOptions:{
            drawerLabel: 'MESSAGE',
            drawerIcon: (
                <Icon name='comment' size={24} />
            )
        }
    },
    // Login:{
    //     screen: AuthStack,
    //     navigationOptions:{
    //         drawerLabel: 'Login',
    //         drawerIcon: (
    //             <Icon name='sign-in' size={24} />
    //         )
    //     }
    // },
    LogOut:{
        screen: LogOut,
        navigationOptions:{
            drawerLabel: 'SIGN-OUT',
            drawerIcon: (
                <Icon name='sign-out' size={24} />
            )
        }
    },
},{
    initialRoute:Home,
    contentComponent:CustomDrawerContentComponent
});

export  const UnAuthorized= createDrawerNavigator({
    Home:{
        screen : HomeStack,
        navigationOptions:{
            drawerLabel: 'HOME',
            drawerIcon: (
                <Icon name='home' size={24} />
            )
        }
    },

    // AddService: {
    //     screen: AddService,
    //     navigationOptions:{
    //         drawerLabel: "ADD SERVICE",
    //         drawerIcon: (
    //             <Icon name='plus' size={24} />
    //         )
    //     }
    // },
    //
    // Message:{
    //     screen:ChatStack,
    //     navigationOptions:{
    //         drawerLabel: 'MESSAGE',
    //         drawerIcon: (
    //             <Icon name='comment' size={24} />
    //         )
    //     }
    // },
    Login:{
        screen: AuthStack,
        navigationOptions:{
            drawerLabel: 'Login',
            drawerIcon: (
                <Icon name='sign-in' size={24} />
            )
        }
    },
    // LogOut:{
    //     screen: LogOut,
    //     navigationOptions:{
    //         drawerLabel: 'SIGN-OUT',
    //         drawerIcon: (
    //             <Icon name='sign-out' size={24} />
    //         )
    //     }
    // },
},{
    initialRoute:Home,
    contentComponent:CustomDrawerContentComponent
});


const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:colors.background
    },
    drawerImage:{
        height:150,
        width:150,
         borderRadius:75,

    }
});
const Sapp=createAppContainer(createSwitchNavigator(
    {
        AuthLoading:AuthLoadingScreen,
        //Splash: {
            //screen: SplashStack,
        //},
        App: MainNavigation,
        Auth: AuthStack,
        UnAuthorized:UnAuthorized
    },
    {
        initialRouteName: 'AuthLoading',
        //initialRoute:Splash,
    }));
export  default (Sapp);

