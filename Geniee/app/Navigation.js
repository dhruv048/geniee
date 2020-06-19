import {Navigation} from 'react-native-navigation';
import {EventRegister} from 'react-native-event-listeners';
import {colors} from './config/styles';

import Dashboard from './screens/Dashboard';
import SideMenu from './screens/SideMenu';
import ChatList from './screens/chat/ChatList';
import ContactUs from './screens/ContactUs';
import MyServices from './screens/services/MyServices';
import AddProduct from './screens/store/AddProduct';
import AddService from './screens/services/AddService';
import ForgotPassword from './screens/ForgotPassword';
import SignIn from './screens/SignIn';
import Register from './screens/Register';
import ProductDetail from './screens/store/ProductDetail';
import Home from './screens/Home';
import ServiceDetail from './screens/ServiceDetail';
import LandingPageEF from './screens/EatFit/LandingPageEF';
import Chat from './screens/chat/Chat';
import ImageGallery from './screens/store/ImageGallery';
import OrderDetailEF from './screens/EatFit/OrderDetailEF';
import WishListEF from './screens/EatFit/WishListEF';
import CartEF from './screens/EatFit/CartEF';
import ProductsEF from './screens/EatFit/ProductsEF';
import ProductDetailEF from './screens/EatFit/ProductDetailEF';
import CheckoutEF from './screens/EatFit/CheckoutEF';
import ProductsBB from './screens/BaadshahBiryani/ProductsBB';
import ProductDetailBB from './screens/BaadshahBiryani/ProductDetailBB';
import ImageGalleryBB from './screens/BaadshahBiryani/ImageGalleryBB';
import Orders from './screens/store/Orders';
import OrderDetailIn from './screens/store/OrderDetailIn';
import OrderDetailOut from './screens/store/OrderDetailOut';
import Profile from './screens/Profile/Profile';
import Notification from './screens/Notification/Notification';
import ServiceRatings from './screens/services/ServiceRatings';
import MyProducts from './screens/store/MyProducts';
import SearchResult from './screens/SearchResult';
import AllProducts from './screens/store/AllProducts';

Navigation.registerComponent('Dashboard', () => Dashboard);
Navigation.registerComponent('SideMenu', () => SideMenu);
Navigation.registerComponent('Chat', () => ChatList);
Navigation.registerComponent('Message', () => Chat);
Navigation.registerComponent('AddService', () => AddService);
Navigation.registerComponent('AddProduct', () => AddProduct);
Navigation.registerComponent('ProductDetail', () => ProductDetail);
Navigation.registerComponent('MyServices', () => MyServices);
Navigation.registerComponent('MyProducts', () => MyProducts);
Navigation.registerComponent('ServiceList', () => Home);
Navigation.registerComponent('ServiceDetail', () => ServiceDetail);
Navigation.registerComponent('LandingPageEF', () => LandingPageEF);
Navigation.registerComponent('Orders', () => Orders);
Navigation.registerComponent('OrderDetailEF', () => OrderDetailEF);
Navigation.registerComponent('OrderDetailIn', () => OrderDetailIn);
Navigation.registerComponent('OrderDetailOut', () => OrderDetailOut);
Navigation.registerComponent('WishListEF', () => WishListEF);
Navigation.registerComponent('CartEF', () => CartEF);
Navigation.registerComponent('CheckoutEF', () => CheckoutEF);
Navigation.registerComponent('ProductsEF', () => ProductsEF);
Navigation.registerComponent('ProductDetailEF', () => ProductDetailEF);
Navigation.registerComponent('ProductsBB', () => ProductsBB);
Navigation.registerComponent('ProductDetailBB', () => ProductDetailBB);
Navigation.registerComponent('AllProducts', () => AllProducts);
Navigation.registerComponent('ContactUs', () => ContactUs);
Navigation.registerComponent('ForgotPassword', () => ForgotPassword);
Navigation.registerComponent('SignIn', () => SignIn);
Navigation.registerComponent('Register', () => Register);
Navigation.registerComponent('ImageGallery', () => ImageGallery);
Navigation.registerComponent('ImageGalleryBB', () => ImageGalleryBB);
Navigation.registerComponent('Profile', () => Profile);
Navigation.registerComponent('Notification', () => Notification);
Navigation.registerComponent('ServiceRatings', () => ServiceRatings);
Navigation.registerComponent('SearchResult', () => SearchResult);

let currentRoute = '';

Navigation.setDefaultOptions({
	statusBar: {
		style: 'light',
		backgroundColor:colors.statusBar,
	},

	animations: {
		setRoot: {
			enabled: 'true',
			alpha: {
				from: 0,
				to: 1,
				duration: 400,
				startDelay: 100,
				interpolation: 'accelerate',
			},
		},
	},
});

export const goToDashboard = () =>
	Navigation.setRoot({
		root: {
			sideMenu: {
				left: {
					id: 'sideMenu',
					component: {
						name: 'SideMenu',
						options:{
							statusBar: {
							//drawBehind: true,
							backgroundColor: colors.statusBar,
						},
						}
					},
					 
				},
				center: {
					stack: {
						id: 'DASHBOARD_STACK',
						options: {
							topBar: {
								visible: false,
							},
							statusBar: {
								style: 'light',
								drawBehind: true,
								backgroundColor:colors.statusBar,
							},
						},
						children: [
							{
								component: {name: 'Dashboard'},
							},
						],
					},
				},
				options: {
					sideMenu: {
						left: {
							width: 280,
						},
					},
				},
			},
		},
	});

export const navigateToRoutefromSideMenu = (componentId, route) => {
	console.log(componentId, route);
	try {
		Navigation.mergeOptions(componentId, {
			sideMenu: {
				left: {
					visible: false,
				},
			},
		});
	} catch (e) {
		console.log(e.message);
	}
	if (route == 'Dashboard') {
		// currentRoute='';
		Navigation.setStackRoot('DASHBOARD_STACK', {
			component: {
				name: route,
				options: {
					animations: {
						setStackRoot: {
							enabled: true,
						},
					},
				},
			},
		});
		EventRegister.emit('routeChanged', 'Dashboard');
		currentRoute = 'Dashboard';
	} else {
		if (currentRoute != route) {
			EventRegister.emit('routeChanged', route);
			currentRoute = route;
			Navigation.push('DASHBOARD_STACK', {
				component: {
					name: route,
				},
			});
		}
	}
};

// export const goToChat = (props) => {
//     Navigation.setStackRoot('DASHBOARD_STACK', {
//         stack: {
//             id: 'CHAT_STACK',
//             options: {
//                 topBar: {
//                     visible: false
//                 }
//             },
//             children: [{
//                 component: {name: 'Chat'},
//                 component: {name: 'Message', passProps: props},
//             }]
//         }
//     });
// }

export const goBack = componentId => {
	Navigation.pop(componentId);
};

export const backToRoot = componentId => {
	Navigation.popToRoot(componentId);
	EventRegister.emit('routeChanged', 'Dashboard');
	currentRoute = 'Dashboard';
};

export const goToRoute = (compId, route, param) => {
	Navigation.push(compId, {
		component: {
			name: route,
			passProps: param,
		},
	});
};