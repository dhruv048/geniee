import React, { Component, createRef, useCallback, useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  TouchableHighlight,
} from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { Footer, Button, Icon as NBIcon } from "native-base";
//import { ScrollView, StyleSheet, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Feather';
import { colors, customStyle } from "../config/styles";
import FAIcon from 'react-native-vector-icons/FontAwesome';
import ActionSheet from "react-native-actions-sheet";
import { Badge, Headline, List, } from "react-native-paper";
import Meteor from "../react-native-meteor";
import AIcon from 'react-native-vector-icons/AntDesign';
import CartIcon from "./HeaderIcons/CartIcon";
import merchantHandlers from "../store/services/merchant/handlers";
import AddProduct from "../screens/store/AddProduct";
import ChatHandlers from "../store/services/chat/handlers";
import { customPaperTheme } from "../config/themes";
import { connect } from "react-redux";
import { loggedUserSelector } from "../store/selectors";

const FooterTab = (props) => {

  const pathX = "357";
  const pathY = "675";
  const pathA = "689";
  const pathB = "706";
  const [loggedUser, setLoggedUser] = useState();
  const [merchantUser, setMerchantUser] = useState(false);
  const actionSheetRef = createRef();
  const userLogged = Meteor.user();
  const [unreadChatCount, setUnreadChatCount] = useState(0);

  useEffect(() => {

    if (!props.loggedUser) {
      setLoggedUser(userLogged);
    } else {
      setLoggedUser(props.loggedUser);
    }

    getBusinessInfo()
    getChatItems()
  })

  const getBusinessInfo = () => {
    merchantHandlers.getBusinessInfo(loggedUser, (res) => {
      if (res) {
        setMerchantUser(true);
      } else {
        setMerchantUser(false);
      }
    })
  }

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

  const getChatItems = useCallback(() => {
    ChatHandlers.getAllChatItems(loggedUser, (res) => {
      if (res) {
        let result = res.filter(item => item.seen === false);
        setUnreadChatCount(result.length);
      } else {
        console.log('Please contact administrator ' + err);
      }
    });
  }, [])

  const handleCartOrder = () => {
    props.navigation.navigate('MerchantOrder');
  }
  return (
    <View style={[styles.container]}>
      <View style={[styles.content]}>
        <View style={styles.subContent}>

          <View style={{ marginRight: 35, paddingLeft: 15}}>
            <Button transparent style={styles.btnTab}
              onPress={() => handleDashboard()}
            >
              <AIcon name="home" style={{ color: props.state.index == getIndex('Home') || props.state.index == getIndex('MerchantDashboard') ? colors.statusBar : colors.gray_200, }} size={25} ></AIcon>
              {merchantUser ?
                <Text note style={{ color: props.state.index == getIndex('MerchantDashboard') ? colors.statusBar : colors.gray_200, fontSize: 8 }}>Dash</Text>
                :
                <Text note style={{ color: props.state.index == getIndex('Home') ? colors.statusBar : colors.gray_200, fontSize: 8 }}>Home</Text>
              }
            </Button >
          </View>
          <View>
            <Button transparent style={styles.btnTab}
              onPress={() => props.navigation.navigate('Chat')}
            >
              <AIcon name="message1" style={{ color: props.state.index == getIndex('Chat') ? colors.statusBar : colors.gray_200 }} size={25}></AIcon>
              <Text note style={{ color: props.state.index == getIndex('Chat') ? colors.statusBar : colors.gray_200, fontSize: 8 }}>Message</Text>
            </Button>
            {unreadChatCount > 0 ? (
              <Badge style={{ position: 'absolute', top: -8, left: 36, borderWidth: 1 }}>
                {unreadChatCount}
              </Badge>
            ) : null}
          </View>
          {/* Center Circle */}
          <View style={{ flex: 1, justifyContent: 'center',  marginHorizontal:30, paddingBottom:10}}>
            {merchantUser ?
              <Button onPress={() => { props.navigation.navigate('ProductInfo') }}
                style={styles.searchBtn} >
                <AIcon name="plus" style={{ color: colors.whiteText }} size={25}></AIcon>
              </Button>
              :
              <Button onPress={() => { props.navigation.navigate('SearchResult') }}
                style={styles.searchBtn} >
                <AIcon name="search1" style={{ color: colors.whiteText }} size={25}></AIcon>
              </Button>}
          </View>
          {/* {!merchantUser ? */}
          <View style={{ marginRight: 35, marginTop:20 }}>
            <CartIcon
              navigation={props.navigation}
              style={customStyle.actionIcon}
            />
          </View>
          <View style={{ marginRight: 10 }}>
            <Button transparent style={styles.btnTab}
              onPress={() => handleAccount()}
            >
              <AIcon name="user" style={{ color: props.state.index == getIndex('MyAccount') ? colors.statusBar : colors.gray_200 }} size={25}></AIcon>
              <Text note style={{ color: props.state.index == getIndex('MyAccount') ? colors.statusBar : colors.gray_200, fontSize: 8 }}>Account</Text>
            </Button>
          </View>
        </View>
        <Svg
          version="1.1"
          id="bottom-bar"
          x="0px"
          y="0px"
          width="100%"
          height="100"
          viewBox="0 0 1092 200"
          space="preserve"
        >
          <Path
            fill={"white"}
            stroke={"grey"}
            d={`M30,60h${pathX}.3c17.2,0,31,14.4,30,31.6c-0.2,2.7-0.3,5.5-0.3,8.2c0,71.2,58.1,129.6,129.4,130c72.1,0.3,130.6-58,130.6-130c0-2.7-0.1-5.4-0.2-8.1C${pathY}.7,74.5,${pathA}.5,60,${pathB}.7,60H1062c16.6,0,30,13.4,30,30v135c0,42-34,76-76,120H76c-42,0-76-34-76-76V90C0,73.4,13.4,60,30,60z`}
          />
          <Circle
            fill={customPaperTheme.GenieeColor.primaryColor}
            stroke={"#7EE6D2"}
            cx="546"
            cy="100"
            r="100"
          />
        </Svg>
      </View>
    </View>
  );
}

export default connect(loggedUserSelector) (FooterTab);

const styles = StyleSheet.create({
  container: {
    height: 95,
    overflow: "hidden",
    backgroundColor: 'transparent',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0
  },
  content: {
    flexDirection: "column",
    zIndex: 0,
    width: Dimensions.get("window").width,
    position: "absolute",
    //bottom: "1%",
    backgroundColor: '#00000000'
  },
  subContent: {
    flexDirection: "row",
    //marginBottom: 10,
    zIndex: 1,
    position: "absolute",
    bottom:5,
    //flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 5,
    backgroundColor: '#00000000'
  },
  btnTab: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop:20
  },
  searchBtn: {
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: customPaperTheme.GenieeColor.primaryColor,
    height: 70,
    width: 70,
    borderRadius: 35
  },
});
