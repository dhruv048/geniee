import {Navigation} from "react-native-navigation";
import {EventRegister} from 'react-native-event-listeners';


import Dashboard from "./screens/Dashboard";
import SideMenu from "./screens/SideMenu";
import ChatList from "./screens/chat/ChatList";
import ContactUs from "./screens/ContactUs";
import OrderListEF from "./screens/EatFit/OrderListEF";
import MyServices from "./screens/services/MyServices";
import AddProduct from "./screens/store/AddProduct";
import AddService from "./screens/services/AddService";
import ForgotPassword from "./screens/ForgotPassword";
import SignIn from "./screens/SignIn";
import Register from "./screens/Register";
import ProductDetail from "./screens/store/ProductDetail";
import Home from "./screens/Home";
import ServiceDetail from "./screens/ServiceDetail";
import LandingPageEF from "./screens/EatFit/LandingPageEF";
import Chat from "./screens/chat/Chat";
import ImageGallery from "./screens/store/ImageGallery";
import OrderDetailEF from "./screens/EatFit/OrderDetailEF";
import WishListEF from "./screens/EatFit/WishListEF";
import CartEF from "./screens/EatFit/CartEF";
import ProductsEF from "./screens/EatFit/ProductsEF";
import ProductDetailEF from "./screens/EatFit/ProductDetailEF";
import CheckoutEF from "./screens/EatFit/CheckoutEF";

Navigation.registerComponent('Dashboard', () => Dashboard);
Navigation.registerComponent('SideMenu', () => SideMenu);
Navigation.registerComponent('Chat', () => ChatList);
Navigation.registerComponent('Message', () => Chat);
Navigation.registerComponent('AddService', () => AddService);
Navigation.registerComponent('AddProduct', () => AddProduct);
Navigation.registerComponent('ProductDetail', () => ProductDetail);
Navigation.registerComponent('MyServices', () => MyServices);
Navigation.registerComponent('ServiceList', () => Home);
Navigation.registerComponent('ServiceDetail', () => ServiceDetail);
Navigation.registerComponent('LandingPageEF', () => LandingPageEF);
Navigation.registerComponent('Orders', () => OrderListEF);
Navigation.registerComponent('OrderDetailEF', () => OrderDetailEF);
Navigation.registerComponent('WishListEF', () => WishListEF);
Navigation.registerComponent('CartEF', () => CartEF);
Navigation.registerComponent('CheckoutEF', () => CheckoutEF);
Navigation.registerComponent('ProductsEF', () => ProductsEF);
Navigation.registerComponent('ProductDetailEF', () => ProductDetailEF);
Navigation.registerComponent('ContactUs', () => ContactUs);
Navigation.registerComponent('ForgotPassword', () => ForgotPassword);
Navigation.registerComponent('SignIn', () => SignIn);
Navigation.registerComponent('Register', () => Register);
Navigation.registerComponent('ImageGallery', () => ImageGallery);
let currentRoute = '';
Navigation.setDefaultOptions({
    animations: {
        setRoot: {
            enabled: 'true',
            alpha: {
                from: 0,
                to: 1,
                duration: 400,
                startDelay: 100,
                interpolation: 'accelerate'
            }
        }
    }
});


export const goToDashboard = () =>
    Navigation.setRoot({
        root: {
            sideMenu: {
                left: {
                    id: 'sideMenu',
                    component:
                        {
                            name: 'SideMenu',
                        },
                },
                center: {
                    stack: {
                        id: 'DASHBOARD_STACK',
                        options: {
                            topBar: {
                                visible: false
                            }
                        },
                        children: [{
                            component: {name: 'Dashboard'}
                        }]
                    }
                }
            }
        }
    });

export const navigateToRoutefromSideMenu = (componentId, route) => {
    console.log(componentId, route);
    Navigation.mergeOptions(componentId, {
        sideMenu: {
            left: {
                visible: false,
            },
        },
    });
    if (route == "Dashboard") {
        // currentRoute='';
            Navigation.setStackRoot('DASHBOARD_STACK', {
                component: {
                    name: route,
                    options: {
                        animations: {
                            setStackRoot: {
                                enabled: true
                            }
                        }
                    }
                }
            });
        EventRegister.emit('routeChanged', 'Dashboard');
        currentRoute = 'Dashboard';
    }
    else {
        if (currentRoute != route) {
            EventRegister.emit('routeChanged', route)
            currentRoute = route;
            Navigation.push('DASHBOARD_STACK', {
                component: {
                    name: route,
                }
            });
        }
    }
}

export const goToChat = (props) => {
    Navigation.setStackRoot('DASHBOARD_STACK', {
        stack: {
            id: 'CHAT_STACK',
            options: {
                topBar: {
                    visible: false
                }
            },
            children: [{
                component: {name: 'Chat'},
                component: {name: 'Message', passProps: props},
            }]
        }
    });
}

export const goBack = (componentId) => {
    Navigation.pop(componentId);
};

export const backToRoot = (componentId) => {
    Navigation.popToRoot(componentId);
    EventRegister.emit('routeChanged', 'Dashboard');
    currentRoute = 'Dashboard';
};

export const goToRoute = (compId, route, param) => {
    Navigation.push(compId, {
        component: {
            name: route,
            passProps: param
        }
    });
}