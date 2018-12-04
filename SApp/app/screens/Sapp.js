import {DrawerNavigator, DrawerItems} from 'react-navigation';
import {StyleSheet,Image} from 'react-native'
import Home from '../screens/Home';
import Settings from '../screens/Settings';
import Profile from '../screens/Profile';
import Details from '../screens/Details';
import {Container, Content, Header,Body,Icon} from 'native-base';
import React, {Component} from 'react';


const CustomDrawerContentComponent=(props)=>(
    <Container>
        <Header style={{height:200,backgroundColor:'white'}}>
            <Body>
            <Image
                style={styles.drawerImage}
                source={require('../images/avatar-placeholder.png')}/>
            </Body>
        </Header>
        <Content>
            <DrawerItems {...props}/>
        </Content>
    </Container>
)

export  const Sapp= DrawerNavigator({
    Home:{
        screen : Home
    },
    Profile:{
        screen: Profile
    },
    Details: {
        screen: Details
    },
    Settings
    :{
        screen: Settings
    }
},{
    initialRoute:Home,
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
    },
    drawerImage:{
        height:150,
        width:150,
         borderRadius:75,

    }
});
export  default Sapp;

