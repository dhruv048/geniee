import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Dashboard from './Dashboard';
import ChatList from './chat/ChatList';
import WishListEF from './EatFit/WishListEF';
import FooterTab from '../components/FooterTab';
import SideMenu from '../componentsG/Auth/components/SideMenu';
import Home from '../componentsG/Home/components/Home';
import MyAccount from '../componentsG/Auth/components/MyAccount';
import SearchResult from './SearchResult';
import MyOrders from '../componentsG/Shopping/components/MyOrders';
import MerchantDashboard from '../componentsG/Merchant/component/MerchantDashboard';
import MyCart from '../componentsG/Shopping/components/MyCart';
import MerchantOrder from '../componentsG/Merchant/component/MerchantOrder';
import Geniee from '../components/GenieeDemo';
// import SideMenu from './SideMenu';

const Tab = createBottomTabNavigator();

export function ButtomTabs() {
  return (
    <Tab.Navigator
      tabBar={props => <FooterTab {...props} />}
      initialRouteName={'Home'}>
      {/* <Tab.Screen name="Home" component={Dashboard} />
      <Tab.Screen name="More" component={SideMenu} />
      <Tab.Screen name="WishListEF" component={WishListEF} /> */}
      <Tab.Screen name="Home" component={Home} />
      {/* <Tab.Screen name="Home" component={Geniee} /> */}
      <Tab.Screen name="Chat" component={ChatList} />
      <Tab.Screen name="MyCart" component={MyCart} />
      <Tab.Screen name="SearchResult" component={SearchResult} />
      <Tab.Screen name="MyAccount" component={MyAccount} />

      {/* Merchant Bottom Tab */}
      <Tab.Screen name="MerchantDashboard" component={MerchantDashboard} />
      <Tab.Screen name="MerchantOrder" component={MerchantOrder} />
    </Tab.Navigator>
  );
}
