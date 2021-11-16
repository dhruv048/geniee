import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { LogBox } from 'react-native';
import settings, { getProfileImage } from './app/config/settings';
import Meteor from './app/react-native-meteor';
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import MyFunctions from './app/lib/MyFunctions';
import AsyncStorage from '@react-native-community/async-storage';
import DeviceInfo from 'react-native-device-info';
import { Provider as PaperProvider } from 'react-native-paper';
import { customPaperTheme } from './app/config/themes';
import notifee, { EventType, AndroidStyle } from '@notifee/react-native';
import { ButtomTabs } from './app/screens/Navigations';
import Home from './app/screens/Home';
import ContactUs from './app/screens/ContactUs';
import MyServices from './app/screens/services/MyServices';
import AddProduct from './app/screens/store/AddProduct';
import AddService from './app/screens/services/AddService';
import ForgotPassword from './app/componentsG/Auth/components/ForgotPassword';
import SignIn from './app/componentsG/Auth/components/SignIn';
//import SignIn from './app/screens/SignIn';
import Register from './app/componentsG/Auth/components/Register';
//import ProductDetail from './app/screens/store/ProductDetail';
import ProductDetail from './app/componentsG/ProductInfo/components/ProductDetail';
import ServiceDetail from './app/screens/ServiceDetail';
import LandingPageEF from './app/screens/EatFit/LandingPageEF';
import Chat from './app/screens/chat/Chat';
import ImageGallery from './app/screens/store/ImageGallery';
import OrderDetailEF from './app/screens/EatFit/OrderDetailEF';
import WishListEF from './app/screens/EatFit/WishListEF';
import CartEF from './app/screens/EatFit/CartEF';
import ProductsEF from './app/screens/EatFit/ProductsEF';
import ProductDetailEF from './app/screens/EatFit/ProductDetailEF';
import CheckoutEF from './app/screens/EatFit/CheckoutEF';
import ProductsBB from './app/screens/BaadshahBiryani/ProductsBB';
import ProductDetailBB from './app/screens/BaadshahBiryani/ProductDetailBB';
import ImageGalleryBB from './app/screens/BaadshahBiryani/ImageGalleryBB';
import Orders from './app/screens/store/Orders';
import OrderDetailIn from './app/screens/store/OrderDetailIn';
import OrderDetailOut from './app/screens/store/OrderDetailOut';
import Profile from './app/screens/Profile/Profile';
import Notification from './app/screens/Notification/Notification';
import ServiceRatings from './app/screens/services/ServiceRatings';
import MyProducts from './app/screens/store/MyProducts';
import SearchResult from './app/screens/SearchResult';
import AllProducts from './app/screens/store/AllProducts';
import { Provider } from 'react-redux';
import { store, persistor } from './app/store';
import { PersistGate } from 'redux-persist/integration/react';
import categoryHandlers from './app/store/services/categories/handlers';
import AddressDetail from './app/componentsG/Auth/components/AddressDetail';
import RegisterCompleted from './app/componentsG/Auth/components/RegisterCompleted';
import BusinessForm from './app/componentsG/Merchant/component/BusinessForm';
import BusinessDocument from './app/componentsG/Merchant/component/BusinessDocument';
import BusinessCompleted from './app/componentsG/Merchant/component/BusinessCompleted';
import MyCart from './app/componentsG/Shopping/components/MyCart';
import Checkout from './app/componentsG/Shopping/components/Checkout';
import PaymentMethod from './app/componentsG/Shopping/components/PaymentMethod';
import OrdersCompleted from './app/componentsG/Shopping/components/OrdersCompleted';
import MyOrders from './app/componentsG/Shopping/components/MyOrders';
import ProductInfo from './app/componentsG/ProductInfo/components/ProductInfo';
import ProductPreview from './app/componentsG/ProductInfo/components/ProductPreview';
import ProductCompleted from './app/componentsG/ProductInfo/components/ProductCompleted';
import MyAccount from './app/componentsG/Auth/components/MyAccount';
import MerchantDashboard from './app/componentsG/Merchant/component/MerchantDashboard';
import StoreList from './app/componentsG/stores/StoreList';
import StoreDetail from './app/componentsG/stores/StoreDetail';
import Inventory from './app/componentsG/Merchant/component/Inventory';
import Earnings from './app/componentsG/Merchant/component/Earnings';

export default function Appp({ navigation }) {
    const routeNameRef = React.useRef();
    const navigationRef = React.useRef();
    const Stack = createStackNavigator();
    LogBox.ignoreAllLogs(['warnings']);
    React.useEffect(() => {
        LogBox.ignoreLogs(['warnings']);
        const deviceId = DeviceInfo.getUniqueId();
        messaging().subscribeToTopic('newPoductStaging');
        messaging().subscribeToTopic('newServiceStaging');
        messaging().subscribeToTopic('allGenieeStaging');

        if (!Meteor.getData()._tokenIdSaved) {
            console.log('notLogged');
            Meteor.subscribe('newNotificationCount', deviceId);
        }

        messageListener().catch(e => {
            console.log(e);
        });
        //   Meteor.subscribe('srvicesByLimit', {limit:100,coordinates:[this.initialPosition.coords.longitude||85.312950,this.initialPosition.coords.latitude||27.712020]})
        Meteor.subscribe('categories-list');
        // getting data when app start
        categoryHandlers.getAllCategories();
        categoryHandlers.getAllBusinessType();
        Meteor.Accounts.onLogin(async cd => {
            console.log('onLogin');
            Meteor.subscribe('newNotificationCount', deviceId);
            checkPermission().catch(e => {
                console.log(e);
            });
            getFcmToken();
            AsyncStorage.setItem('loggedUser', JSON.stringify(Meteor.user()));
            Meteor.call('geOwnServiceList', (err, res) => {
                if (!err) {
                    // console.log('MyServices', res);
                    AsyncStorage.setItem('myServices', JSON.stringify(res));
                }
            });
        });


    }, [])


    const checkPermission = async () => {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        console.log(enabled)
        if (enabled) {
            getFcmToken();
        } else {
            requestPermission();
        }
    };

    const getFcmToken = async () => {
        const fcmToken = await messaging().getToken();
        // console.log(fcmToken);
        if (fcmToken && Meteor.user()) {
            // this.showAlert('Your Firebase Token is:', fcmToken);
            let oldToken = await AsyncStorage.getItem('FCM_TOKEN');
            if (fcmToken && oldToken != fcmToken) {
                MyFunctions._saveDeviceUniqueId(fcmToken);
                if (oldToken) {
                    Meteor.call('removeToken', oldToken);
                }
            }
        } else {
            console.log('Failed', 'No token received or User Not Logged In');
        }
    };

    const requestPermission = async () => {
        try {
            await messaging().requestPermission();
            // User has authorised
        } catch (error) {
            // User has rejected permissions
        }
    };

    const messageListener = async () => {
        this.notificationListener = messaging()
            .getInitialNotification()
            .then(notification => {
                const { title, body } = notification;
                // this.showAlert(title, body);
                console.log('onNotification', notification);
                if (notification.data.title == 'REMOVE_AUTH_TOKEN') {
                    try {
                        AsyncStorage.setItem(settings.USER_TOKEN_KEY, '');
                        Meteor.logout();
                        // goToRoute(this.props.componentId,'Auth');
                    } catch (e) {
                        console.log(e.message);
                        //  goToRoute(this.props.componentId,'Auth');
                    }
                }
                const channelId = new firebase.notifications.Android.Channel(
                    'Default',
                    'Default',
                    firebase.notifications.Android.Importance.High,
                );
                firebase.notifications().android.createChannel(channelId);
                let notification_to_be_displayed = new firebase.notifications.Notification(
                    {
                        data: notification.data,
                        sound: 'default',
                        show_in_foreground: true,
                        title: notification.title,
                    },
                );

                if (Platform.OS == 'android') {
                    notification_to_be_displayed.android
                        .setPriority(firebase.notifications.Android.Priority.High)
                        .android.setChannelId('Default')
                        .android.setColor(colors.primary)
                        .android.setAutoCancel(true)
                        .android.setVibrate(1000);
                    if (notification.data.image) {
                        const image = settings.IMAGE_URL + notification.data.image;
                        notification_to_be_displayed.android.setBigPicture(
                            image,
                            getProfileImage(notification.data.icon),
                            notification.title,
                            notification.body,
                        );
                    }
                    else
                        notification_to_be_displayed.android.setBigText(notification.body);

                    // console.log(notification_to_be_displayed)
                }
                firebase
                    .notifications()
                    .displayNotification(notification_to_be_displayed);
            });
        this.messageListener = messaging().onMessage(async message => {
            console.log('onMessage', message);
            console.log(JSON.stringify(message));
            let notification = message.notification;
            if (message.data.title == 'REMOVE_AUTH_TOKEN') {

            }
            // Create a channel
            const channelId = await notifee.createChannel({
                id: 'default',
                name: 'Default Channel',
            });

            // Display a notification
            if (Platform.OS == 'android') {
                const image = settings.IMAGE_URL + message.data.image;
                await notifee.displayNotification({
                    title: notification.title,
                    subtitle: 'subtitle',
                    body: notification.body,
                    android: {
                        channelId,
                        color: colors.primary,
                        smallIcon: 'ic_small_icon',
                        largeIcon: message.data.icon ? getProfileImage(message.data.icon) : null,
                        style: message.data.image ?
                            { type: AndroidStyle.BIGPICTURE, picture: image } :
                            { type: AndroidStyle.BIGTEXT, text: message.data.body },
                    },
                });
            }
            else {
                await notifee.displayNotification({
                    title: notification.title,
                    body: notification.body,
                });
            }
        });

        notifee.onForegroundEvent(({ type, detail }) => {
            switch (type) {
                case EventType.DISMISSED:
                    console.log('User dismissed notification', detail.notification);

                    break;
                case EventType.PRESS:
                    console.log('User pressed notification', detail.notification);
                    const notificationOpen = detail;

                    if (notificationOpen.notification.data.navigate) {
                        console.log('subscribe & Navigate');
                        // Meteor.subscribe(notificationOpen.notification.data.subscription, notificationOpen.notification.data.Id, (err) => {
                        this.props.navigation.navigate(
                            notificationOpen.notification.data.route,
                            { Id: notificationOpen.notification.data.Id },
                        );
                        // });
                    }
                    break;
            }
        });
    };

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <NavigationContainer ref={navigationRef}
                    onReady={() => routeNameRef.current = navigationRef.current.getCurrentRoute().name}
                    onStateChange={() => {
                        const previousRouteName = routeNameRef.current;
                        const currentRouteName = navigationRef.current.getCurrentRoute().name

                        if (previousRouteName !== currentRouteName) {
                            // The line below uses the expo-firebase-analytics tracker
                            // https://docs.expo.io/versions/latest/sdk/firebase-analytics/
                            // Change this line to use another Mobile analytics SDK
                            //Analytics.setCurrentScreen(currentRouteName);
                        }

                        // Save the current route name for later comparision
                        routeNameRef.current = currentRouteName;
                    }}
                >
                    <PaperProvider theme={customPaperTheme}>
                        <Stack.Navigator initialRouteName={'Dashboard'} screenOptions={{ headerShown: false }}>
                            <Stack.Screen name='Dashboard' component={ButtomTabs} ></Stack.Screen>
                            <Stack.Screen name='Message' component={Chat} ></Stack.Screen>
                            <Stack.Screen name='AddService' component={AddService} ></Stack.Screen>
                            <Stack.Screen name='AddProduct' component={AddProduct} ></Stack.Screen>
                            <Stack.Screen name='ProductDetail' component={ProductDetail} ></Stack.Screen>
                            <Stack.Screen name='MyServices' component={MyServices} ></Stack.Screen>
                            <Stack.Screen name='MyProducts' component={MyProducts} ></Stack.Screen>
                            <Stack.Screen name='ServiceList' component={Home} ></Stack.Screen>
                            <Stack.Screen name='ServiceDetail' component={ServiceDetail} ></Stack.Screen>
                            <Stack.Screen name='LandingPageEF' component={LandingPageEF} ></Stack.Screen>
                            <Stack.Screen name='Orders' component={Orders} ></Stack.Screen>
                            <Stack.Screen name='OrderDetailEF' component={OrderDetailEF} ></Stack.Screen>
                            <Stack.Screen name='OrderDetailIn' component={OrderDetailIn} ></Stack.Screen>
                            <Stack.Screen name='OrderDetailOut' component={OrderDetailOut} ></Stack.Screen>
                            <Stack.Screen name='WishListEF' component={WishListEF} ></Stack.Screen>
                            <Stack.Screen name='CartEF' component={CartEF} ></Stack.Screen>
                            <Stack.Screen name='CheckoutEF' component={CheckoutEF} ></Stack.Screen>
                            <Stack.Screen name='ProductsEF' component={ProductsEF} ></Stack.Screen>
                            <Stack.Screen name='ProductDetailEF' component={ProductDetailEF} ></Stack.Screen>
                            <Stack.Screen name='ProductsBB' component={ProductsBB} ></Stack.Screen>
                            <Stack.Screen name='ProductDetailBB' component={ProductDetailBB} ></Stack.Screen>
                            <Stack.Screen name='AllProducts' component={AllProducts} ></Stack.Screen>
                            <Stack.Screen name='ContactUs' component={ContactUs} ></Stack.Screen>
                            <Stack.Screen name='ForgotPassword' component={ForgotPassword} ></Stack.Screen>
                            <Stack.Screen name='SignIn' component={SignIn} ></Stack.Screen>
                            <Stack.Screen name='Register' component={Register} ></Stack.Screen>
                            <Stack.Screen name='ImageGallery' component={ImageGallery} ></Stack.Screen>
                            <Stack.Screen name='ImageGalleryBB' component={ImageGalleryBB} ></Stack.Screen>
                            <Stack.Screen name='Profile' component={Profile} ></Stack.Screen>
                            <Stack.Screen name='Notification' component={Notification} ></Stack.Screen>
                            <Stack.Screen name='ServiceRatings' component={ServiceRatings} ></Stack.Screen>
                            <Stack.Screen name='SearchResult' component={SearchResult} ></Stack.Screen>
                            <Stack.Screen name='AddressDetail' component={AddressDetail} ></Stack.Screen>
                            <Stack.Screen name='RegisterCompleted' component={RegisterCompleted} ></Stack.Screen>
                            <Stack.Screen name='BecomeSeller' component={BusinessForm} ></Stack.Screen>
                            <Stack.Screen name='BusinessDocument' component={BusinessDocument}></Stack.Screen>
                            <Stack.Screen name='BusinessCompleted' component={BusinessCompleted}></Stack.Screen>
                            <Stack.Screen name='MyCart' component={MyCart} ></Stack.Screen>
                            <Stack.Screen name='Checkout' component={Checkout} ></Stack.Screen>
                            <Stack.Screen name='PaymentMethod' component={PaymentMethod} ></Stack.Screen>
                            <Stack.Screen name='OrdersCompleted' component={OrdersCompleted} ></Stack.Screen>
                            <Stack.Screen name='MyOrders' component={MyOrders} ></Stack.Screen>
                            <Stack.Screen name='ProductInfo' component={ProductInfo} ></Stack.Screen>
                            <Stack.Screen name='ProductPreview' component={ProductPreview} ></Stack.Screen>
                            <Stack.Screen name='ProductCompleted' component={ProductCompleted} ></Stack.Screen>
                            <Stack.Screen name='MyAccount' component={MyAccount} ></Stack.Screen>
                            <Stack.Screen name='MerchantDashboard' component={MerchantDashboard} ></Stack.Screen>
                            <Stack.Screen name='StoreList' component={StoreList} ></Stack.Screen>
                            <Stack.Screen name='StoreDetail' component={StoreDetail} ></Stack.Screen>
                            <Stack.Screen name ='Inventory' component={Inventory}></Stack.Screen>
                            <Stack.Screen name='Earnings' component={Earnings}></Stack.Screen>
                        </Stack.Navigator>
                    </PaperProvider>
                </NavigationContainer>
            </PersistGate>
        </Provider>
    );
};

