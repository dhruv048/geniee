import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Dashboard from './Dashboard';
import ChatList from './chat/ChatList';
import WishListEF from './EatFit/WishListEF';
import FooterTab from '../components/FooterTab';
import SideMenu from '../componentsG/Auth/components/SideMenu';
import Home from '../componentsG/Home/components/Home';
// import SideMenu from './SideMenu';

const Tab = createBottomTabNavigator();

export function ButtomTabs() {
  return (
    <Tab.Navigator tabBar={props => <FooterTab {...props} />}initialRouteName={'Home'}>
      {/* <Tab.Screen name="Home" component={Dashboard} /> */}
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Chat" component={ChatList} />
      <Tab.Screen name="WishListEF" component={WishListEF} />
      <Tab.Screen name="More" component={SideMenu} />
    </Tab.Navigator>
  );
}