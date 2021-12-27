import React, { createRef, useEffect, useState } from 'react';
import {
    Alert,
    Animated,
    StyleSheet,
    TouchableOpacity,
    View,
    Text
} from 'react-native';
import { CurvedBottomBar } from 'react-native-curved-bottom-bar';
import AIcon from 'react-native-vector-icons/AntDesign';
import { colors, customStyle } from '../../../config/styles';
import Meteor from '../../../react-native-meteor';
import Chat from '../../../screens/chat/Chat';
import MyAccount from '../../Auth/components/MyAccount';
import MerchantDashboard from '../../Merchant/component/MerchantDashboard';
import merchantHandlers from "../../../store/services/merchant/handlers";
import ChatList from '../../../screens/chat/ChatList';
import MyCart from '../../Shopping/components/MyCart';
import FooterTab from '../../../components/FooterTab';
import Home from '../../Home/components/Home';
import CartIcon from '../../../components/HeaderIcons/CartIcon';
import { customPaperTheme } from '../../../config/themes';
import SignIn from '../../Auth/components/SignIn';

export const BottomTab = (props) => {

    const [loggedUser, setLoggedUser] = useState();
    const [merchantUser, setMerchantUser] = useState(false);
    const actionSheetRef = createRef();
    const userLogged = Meteor.user();

    useEffect(() => {

        if (!props.loggedUser) {
            setLoggedUser(userLogged);
        } else {
            setLoggedUser(props.loggedUser);
        }

        merchantHandlers.getBusinessInfo(loggedUser, (res) => {
            if (res) {
                setMerchantUser(true);
            } else {
                setMerchantUser(false);
            }
        })
    })

    const getIndex = (routeName) => {
        return props.state.routes.findIndex(route => route.name == routeName)
    }

    const handleAccount = () => {
        if (loggedUser)
            props.navigation.navigate('MyAccount');
        else
            props.navigation.navigate('SignIn')
    }

    const handleDashboard = () => {
        if (merchantUser) {
            props.navigation.navigate('MerchantDashboard')
        } else {
            props.navigation.navigate('Home')
        }
    }

    const handleSearch = () => {
        if (merchantUser) {
            props.navigation.navigate('ProductInfo')
        } else {
            props.navigation.navigate('SearchResult')
        }
    }

    const handleCartOrder = () => {
        props.navigation.navigate('MerchantOrder');
    }

    const _renderIcon = (routeName, selectedTab) => {
        let icon = '';

        switch (routeName) {
            case 'Home':
                icon = 'home';
                break;
            case 'Chat':
                icon = 'message1';
                break;
            case 'MyCart':
                icon = 'shoppingcart';
                break;
            case 'MyAccount':
                icon = 'user';
                break;
        }

        return (
            <AIcon
                name={icon}
                size={25}
                color={routeName === selectedTab ? customPaperTheme.GenieeColor.primaryColor : 'gray'}
            />
        );
    };
    const renderTabBar = ({ routeName, selectedTab, navigate }) => {
        return (
            <TouchableOpacity
                onPress={() => navigate(routeName)}
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                {_renderIcon(routeName, selectedTab)}
            </TouchableOpacity>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <CurvedBottomBar.Navigator
                style={styles.bottomBar}
                strokeWidth={0.5}
                height={55}
                circleWidth={55}
                bgColor="white"
                initialRouteName="Home"
                borderTopLeftRight
                renderCircle={({ selectedTab, navigate }) => (
                    <Animated.View style={styles.btnCircle}>
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                            }}
                            onPress={() => handleSearch()}>
                            {merchantUser ? <AIcon name={'plus'} color='white' size={25} /> :
                                <AIcon name={'search1'} color='white' size={25} />}
                        </TouchableOpacity>
                    </Animated.View>
                )}
                tabBar={renderTabBar}>
                <CurvedBottomBar.Screen
                    name="Home"
                    position="left"
                    component={() => 
                        <View style={{ flex: 1 }}>
                             {merchantUser ? <View style={{ flex: 1 }}><MerchantDashboard /></View>
                             :<View style={{ flex: 1 }}><Home /></View>}
                        </View>
                    }
                />
                <CurvedBottomBar.Screen
                    name="Chat"
                    position="left"
                    component={() => <View ><ChatList /></View>}
                />
                <CurvedBottomBar.Screen
                    name="MyCart"
                    position="right"
                    component={() => <View style={{ flex: 1 }}>
                        <CartIcon navigation={props.navigation}
                            style={customStyle.actionIcon} />
                    </View>}
                />
                <CurvedBottomBar.Screen
                    name="MyAccount"
                    component={() => <View style={{ flex: 1 }}>
                        {loggedUser ? <View style={{ flex: 1 }}><MyAccount /></View>:
                        <View style={{ flex: 1 }}><SignIn navigation={props.navigation}/></View>}
                    </View>}
                    position="right"
                />
            </CurvedBottomBar.Navigator>
        </View>
    );
};

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    button: {
        marginVertical: 5,
    },
    bottomBar: {},
    btnCircle: {
        width: 60,
        height: 60,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        padding: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 0.5,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 1,
        bottom: 30,
        backgroundColor: customPaperTheme.GenieeColor.primaryColor
    },
    imgCircle: {
        width: 30,
        height: 30,
        tintColor: 'gray',
    },
    img: {
        width: 30,
        height: 30,
    },
});