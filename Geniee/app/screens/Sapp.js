import {
    createDrawerNavigator,
    DrawerItems,
    createAppContainer,
    createStackNavigator,
    createSwitchNavigator
} from 'react-navigation';
import {StyleSheet, View, Image, Alert, TouchableOpacity, StatusBar} from 'react-native'
import Home from '../screens/Home';
import Settings, {userType} from '../screens/Settings';
import ServiceDetail from '../screens/ServiceDetail';
import Details from '../screens/Details';
import AddService from './services/AddService';
import ChatList from './chat/ChatList';
import {Container, Content, Header, Body} from 'native-base';
import React from 'react';
import {colors} from '../config/styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import Meteor from "react-native-meteor";
import Chat from "./chat/Chat";
import LogOut from "./LogOut"
import SignIn from "./SignIn";
import Register from "./Register";
import AuthLoadingScreen from "./AuthLoading";
import Dashboard from "./Dashboard";
import UploadProfilePic from '../components/UploadProfilePic/UploadProfilePic';
import ForgotPassword from './ForgotPassword';
import ContactUs from "./ContactUs";
import MessageCount from "../components/MessageCount/MessageCount";
import AddProduct from "./store/AddProduct";
import ProductDetail from "./store/ProductDetail";
import ImageGallery from "./store/ImageGallery";
import MyServices from "./services/MyServices";
import LandingPageEF from "./EatFit/LandingPageEF";
import ProductsEF from "./EatFit/ProductsEF";
import ProductDetailEF from "./EatFit/ProductDetailEF";
import CheckoutEF from "./EatFit/CheckoutEF";
import WishListEF from "./EatFit/WishListEF";
import CartEF from "./EatFit/CartEF";
import OrderListEF from "./EatFit/OrderListEF";
import OrderDetailEF from "./EatFit/OrderDetailEF";
import LocationPicker from "./LocationPicker";
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
    ForgotPassword: {
        screen: ForgotPassword
    }
}, {
    initialRoute: SignIn,
    headerMode: 'none',
});


export const ChatStack = createStackNavigator({
    ChatList: {
        screen: ChatList,
    },
    Message: {
        screen: Chat,
    }
}, {
    headerMode: 'none'
});

export const ServiceStack = createStackNavigator({
    Home: {
        screen: Home,
    },

}, {
    headerMode: 'none',
    initialRouteName:'Home'
});
export const OrderStack = createStackNavigator({
    OrderList: {
        screen: OrderListEF,
    },
    OrderDetail:{
        screen:OrderDetailEF,
    }
}, {
    headerMode: 'none',
    initialRouteName:'OrderList'
});

export const MyServiceStack = createStackNavigator({
    MyServices: {
        screen: MyServices,
    },
    MyService: {
        screen: ServiceDetail,
    },
    ProductDetail:{
        screen:ProductDetail,
    },
    ImageGallery: {
        screen: ImageGallery
    },
}, {
    headerMode: 'none',
    initialRouteName:'MyServices'
});
export const EatFitStack = createStackNavigator({
    CategoriesEF: {
        screen: LandingPageEF,
    },
    ProductsEF:{
        screen:ProductsEF,
    },
    ProductDetailEF:{
        screen:ProductDetailEF,
    },
    CheckoutEF:{
        screen:CheckoutEF,
    },
    WishListEF:{
        screen:WishListEF,
    },
    CartEF:{
        screen:CartEF,
    },
    PickLocation:{
      screen:LocationPicker,
    }
}, {
    headerMode: 'none',
    initialRouteName:'CategoriesEF'
});



export const HomeStack = createStackNavigator({
    Dashboard: {
        screen: Dashboard,
    },
    Home: {
        screen: ServiceStack,
    },
    Details: {
        screen: Details,

    },
    Chat: {
        screen: Chat,
    },
    Service: {
        screen: ServiceDetail,
    },
    ProductDetail:{
        screen:ProductDetail,
    },
    ImageGallery: {
        screen: ImageGallery
    },
    EateFit:{
        screen:EatFitStack
    }
    // signIn:{
    //     screen:AuthStack,
    // },
}, {
    headerMode: 'none',
    initialRouteName: 'Dashboard'
});

const CustomDrawerContentComponent = (props) => (
    <Container>
        <StatusBar
            backgroundColor={colors.statusBar}
            barStyle='light-content'
        />
        <Header style={{height: 220, backgroundColor: '#4d94ff'}}>
            <Body style={{justifyContent: 'center', alignItems: 'center'}}>
            <UploadProfilePic/>
            </Body>
        </Header>
        <Content style={{backgroundColor: colors.appBackground}}>
            <DrawerItems {...props}/>
            {/*<TouchableOpacity style={{marginLeft:17, flexDirection: 'row'}} onPress={()=>{this.handleSignout()}}>*/}
            {/*<Icon size={25} name='sign-out' style={{fontWeight:'100'}}  ></Icon>*/}
            {/*<Text style={{marginLeft:30,fontWeight:'500'}} >LOG OUT</Text>*/}
            {/*</TouchableOpacity>*/}
        </Content>
    </Container>
)
handleSignout = () => {
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

export const MainNavigation = createDrawerNavigator({
    Home: {
        screen: HomeStack,
        navigationOptions: {
            drawerLabel: 'HOME',
            drawerIcon: (
                <Icon name='home' size={24}/>
            )
        }
    },
    Orders:{
        screen: OrderStack,
        navigationOptions: {
            drawerLabel: 'ORDERS',
            drawerIcon: (
                <Icon name='shopping-basket' size={24}/>
            )
        }
    },
    AddService: {
        screen: AddService,
        navigationOptions: {
            drawerLabel: "ADD SERVICE",
            drawerIcon: (
                <Icon name='plus' size={24}/>
            )
        }
    },

    AddProduct: {
        screen: AddProduct,
        navigationOptions: {
            drawerLabel: "ADD PRODUCT",
            drawerIcon: (
                <Icon name='plus' size={24}/>
            )
        }
    },

    MyServices: {
        screen: MyServiceStack,
        navigationOptions: {
            drawerLabel: "MY SERVICES",
            drawerIcon: (
                <Icon name='tasks' size={24}/>
            )
        }
    },

    CHAT: {
        screen: ChatStack,
        navigationOptions: {
            drawerLabel: 'MESSAGE',
            drawerIcon: (
                <View>
                <Icon name='comment' size={24}/>
                <MessageCount />
                </View>
            )
        }
    },

    // ForgotPass: {
    //     screen: ForgotPassword,
    //     navigationOptions: {
    //         drawerLabel: 'FORGOT PASSWORD',
    //         drawerIcon: (
    //             <Icon name='key' size={24}/>
    //         )
    //     }
    // },
    ContactUs:{
        screen: ContactUs,
        navigationOptions: {
            drawerLabel: 'CONTACT US',
            drawerIcon: (
                <Icon name='envelope' size={24}/>
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
    LogOut: {
        screen: LogOut,
        navigationOptions: {
            drawerLabel: 'SIGN-OUT',
            drawerIcon: (
                <Icon name='sign-out' size={24}/>
            )
        }
    },
}, {
    initialRoute: Home,
    contentComponent: CustomDrawerContentComponent
});

export const UnAuthorized = createDrawerNavigator({
        Home: {
            screen: HomeStack,
            navigationOptions: {
                drawerLabel: 'HOME',
                drawerIcon: (
                    <Icon name='home' size={24}/>
                )
            }
        },
        Orders:{
            screen: OrderStack,
            navigationOptions: {
                drawerLabel: 'ORDERS',
                drawerIcon: (
                    <Icon name='shopping-basket' size={24}/>
                )
            }
        },
        ForgotPass: {
            screen: ForgotPassword,
            navigationOptions: {
                drawerLabel: 'FORGOT PASSWORD',
                drawerIcon: (
                    <Icon name='key' size={24}/>
                )
            }
        },
        ContactUs:{
            screen: ContactUs,
            navigationOptions: {
                drawerLabel: 'CONTACT US',
                drawerIcon: (
                    <Icon name='envelope' size={24}/>
                )
            }
        },

        Login: {
            screen: AuthStack,
            navigationOptions: {
                drawerLabel: 'LOGIN',
                drawerIcon: (
                    <Icon name='sign-in' size={24}/>
                )
            }
        },
    },
    {
        initialRoute: Home,
        contentComponent: CustomDrawerContentComponent
    });


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background
    },
    drawerImage: {
        height: 150,
        width: 150,
        borderRadius: 75,

    }
});
const Sapp = createAppContainer(createSwitchNavigator(
    {
        AuthLoading: AuthLoadingScreen,
        //Splash: {
        //screen: SplashStack,
        //},
        App: MainNavigation,
        Auth: AuthStack,
        UnAuthorized: UnAuthorized
    },
    {
        initialRouteName: 'AuthLoading',
        //initialRoute:Splash,
    }));
export default (Sapp);

