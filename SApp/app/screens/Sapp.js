import {DrawerNavigator, DrawerItems} from 'react-navigation';
import {StyleSheet,Text, Image, Alert,TouchableOpacity} from 'react-native'
import Home from '../screens/Home';
import Settings from '../screens/Settings';
import Profile from '../screens/Profile';
import Details from '../screens/Details';
import ChatList from '../screens/ChatList';
import {Container, Content, Header,Body} from 'native-base';
import React from 'react';
import { colors } from '../config/styles';
import Icon  from 'react-native-vector-icons/FontAwesome';
import { StackNavigator, TabNavigator } from 'react-navigation';
import Meteor from "react-native-meteor";
import Chat from "./Chat";
import {AuthStack} from "../config/routes";


export const ChatStack = StackNavigator({
    ChatList: {
        screen: ChatList,
    },
    Chat:{
        screen: Chat,
    }
},{
    headerMode:'none'
});


export const HomeStack = StackNavigator({
    Home: {
        screen: Home,
    },
    Details: {
        screen: Details,

    },
    Chat:{
        screen:Chat,
    },

    // signIn:{
    //     screen:AuthStack,
    // },
},{
    headerMode: 'none',
});

const CustomDrawerContentComponent=(props)=>(
    <Container>
        <Header style={{height:200,backgroundColor:'white'}}>
            <Body style={{justifyContent:'center',alignItems:'center'}}>
            <Image
                style={styles.drawerImage}
                source={require('../images/RoshanShah.jpg')}/>
            </Body>
        </Header>
        <Content>
            <DrawerItems {...props}/>
            <TouchableOpacity style={{marginLeft:17, flexDirection: 'row'}} onPress={()=>{this.handleSignout()}}>
                <Icon size={25} name='sign-out' style={{fontWeigh:100}}  ></Icon>
                <Text style={{marginLeft:30}} >LOG OUT</Text>
            </TouchableOpacity>
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
                    //     if (!err)
                    //         this.props.navigation.navigate('signIn')
                })
            },
            {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'}
        ],
        {cancelable: false}
    )
}

export  const Sapp= DrawerNavigator({
    Home:{
        screen : HomeStack,
        navigationOptions:{
            drawerLabel: 'HOME',
            drawerIcon: (
                <Icon name='home' size={24} />
            )
        }
    },
    Profile:{
        screen: Profile, navigationOptions:{
            drawerLabel: 'PROFILE',
            drawerIcon: (
                <Icon name='user' size={24} />
            )
        }
    },
    Details: {
        screen: Details,
        navigationOptions:{
            drawerLabel: 'Details',
            drawerIcon: (
                <Icon name='info' size={24} />
            )
        }
    },
    Message:{
        screen:ChatStack,
        navigationOptions:{
            drawerLabel: 'MESSAGE',
            drawerIcon: (
                <Icon name='comment' size={24} />
            )
        }
    },
    Settings:{
        screen: Settings,
        navigationOptions:{
            drawerLabel: 'SETTINGS',
            drawerIcon: (
                <Icon name='cog' size={24} />
            )
        }
    },
},{
    initialRoute:HomeStack,
    contentComponent:CustomDrawerContentComponent,
    drawerOpenRoute:'DrawerOpen',
    drawerCloseRoute:'DrawerClose',
    drawerToggleRoute:'DrawerToggle'
})


 styles = StyleSheet.create({
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
export  default Sapp;

