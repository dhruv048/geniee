/* eslint-disable react/prop-types */
import React from 'react';
import { Image } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import Home from '../screens/Home';
import Details from '../screens/Details';
import Profile from '../screens/Profile';
import SignIn from '../screens/SignIn';
import Register from '../screens/Register';
import ChatList from '../screens/ChatList';
import Chat from '../screens/Chat';

import homeIcon from '../images/home-icon.png';
import profileIcon from '../images/user-icon.png';

export const AuthStack = createStackNavigator({
  SignIn: {
    screen: SignIn,
  },  
  Register: {
    screen: Register,
  },
}, {
  headerMode: 'none',
});

export const RegisterStack = createStackNavigator({
    Register: {
      screen: Register,
    },
    SignIn: {
        screen: SignIn,
    },
}, {
    headerMode: 'none',
});

export const ChatStack = createStackNavigator({
    ChatList: {
        screen: ChatList,
    },
    Chat:{
        screen: Chat,
    }
},{
    headerMode:'none'
});

export const ProfileStack = createStackNavigator({
    Profile: {
        screen: Profile,
    },
}, {
    headerMode: 'none',
});

export const HomeStack = createStackNavigator({
  Home: {
    screen: Home,
    // navigationOptions: {
    //   headerTitle: 'Services',
    // },
  },
  Details: {
    screen: Details,

  },
    Chat:{
      screen:Chat,
    },

    Tabbs : {
        screen: createBottomTabNavigator({
            Users: {
                screen: Home,
                navigationOptions: {
                    tabBarLabel: 'Users',
                    tabBarIcon: ({tintColor}) => (
                        <Image
                            style={[styles.icon, {tintColor}]}
                            source={homeIcon}
                        />
                    ),
                },
            },
            Profile: {
                screen: ProfileStack,
                navigationOptions: {
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({tintColor}) => (
                        <Image
                            style={[styles.icon, {tintColor}]}
                            source={profileIcon}
                        />
                    ),
                },
            },
        }),
    },

    signIn:{
      screen:AuthStack,
    },
    Register:{
        screen:RegisterStack,
    }
},{
    headerMode: 'none',
});


const styles = {
  icon: {
    height: 30,
    width: 30,
  },
};

// export const Tabs = TabNavigator({
//   Home: {
//     screen: HomeStack,
//     navigationOptions: {
//       tabBarLabel: 'Home',
//       tabBarIcon: ({ tintColor }) => (
//         <Image
//           style={[styles.icon, { tintColor }]}
//           source={homeIcon}
//         />
//       ),
//     },
//   },
//     // Users: {
//     //     screen: Users,
//     //     navigationOptions: {
//     //         tabBarLabel: 'Users',
//     //         tabBarIcon: ({tintColor}) => (
//     //             <Image
//     //                 style={[styles.icon, {tintColor}]}
//     //                 source={homeIcon}
//     //             />
//     //         ),
//     //     },
//     // },
//   Profile: {
//     screen: ProfileStack,
//     navigationOptions: {
//       tabBarLabel: 'Profile',
//       tabBarIcon: ({ tintColor }) => (
//         <Image
//           style={[styles.icon, { tintColor }]}
//           source={profileIcon}
//         />
//       ),
//     },
//   },
// });
