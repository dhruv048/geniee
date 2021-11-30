import { Text, FooterTab, Footer, Button, View, Icon as NBIcon } from "native-base";
import { ScrollView, StyleSheet, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Feather';
import React, { createRef, useEffect, useState } from "react";
import { colors, customStyle } from "../config/styles";
import FAIcon from 'react-native-vector-icons/FontAwesome';
import ActionSheet from "react-native-actions-sheet";
import { Headline, List, } from "react-native-paper";
import Meteor from "../react-native-meteor";
import AIcon from 'react-native-vector-icons/AntDesign';
import CartIcon from "./HeaderIcons/CartIcon";
import merchantHandlers from "../store/services/merchant/handlers";
import AddProduct from "../screens/store/AddProduct";

const FooterTabs = (props) => {

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
    if(merchantUser){
      props.navigation.navigate('MerchantDashboard')
    }else{
      props.navigation.navigate('Home')
    }
  }

  const handleCartOrder = () => {
    props.navigation.navigate('MerchantOrder');
  }

  return (
    <Footer style={{ backgroundColor: colors.whiteText, borderTopWidth: 0 }}>
      <View style={styles.footerTab}>
        <View >
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
              <Text note style={{color: props.state.index == getIndex('Chat') ? colors.statusBar : colors.gray_200, fontSize: 8}}>Message</Text>
          </Button>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', paddingBottom: 10, }}>
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
          <View>
            <CartIcon
              navigation={props.navigation}
              style={customStyle.actionIcon}
            />
          </View>
          {/* :
          <View>
            <Button transparent style={styles.btnTab}
              onPress={() => handleCartOrder()}
            >
              <Icon name="list" style={{ color: props.state.index == getIndex('MerchantOrder') ? colors.statusBar : colors.gray_200 }} size={20}></Icon>
              <Text note style={{ color: props.state.index == getIndex('MerchantOrder') ? colors.statusBar : colors.gray_200, fontSize: 8 }}>Orders</Text>
            </Button>
          </View>
        } */}
        <View>
          <Button transparent style={styles.btnTab}
            onPress={() => handleAccount()}
          >
            <AIcon name="user" style={{ color: props.state.index == getIndex('MyAccount') ? colors.statusBar : colors.gray_200 }} size={25}></AIcon>
            <Text note style={{ color: props.state.index == getIndex('MyAccount') ? colors.statusBar : colors.gray_200, fontSize: 8 }}>Account</Text>
          </Button>
        </View>
      </View>

      <ActionSheet ref={actionSheetRef}
        initialOffsetFromBottom={0.6}
        statusBarTranslucent
        bounceOnOpen={true}
        bounciness={4}
        gestureEnabled={true}
        defaultOverlayOpacity={0.3}
      >
        <View
          nestedScrollEnabled={true}
          style={styles.actionContentView}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Headline>Create</Headline>
            <TouchableOpacity onPress={() => { actionSheetRef.current?.setModalVisible(false) }} />
            <Icon onPress={() => { actionSheetRef.current?.setModalVisible(false) }} name="x" size={25} />
          </View>
          <TouchableOpacity onPress={() => { actionSheetRef.current?.setModalVisible(false), props.navigation.navigate('AddService') }} style={{ flexDirection: 'row', paddingLeft: 20, paddingVertical: 10 }}>
            <MIcon size={20} name="briefcase" color={colors.gray_100} />
            <Text note style={{ marginLeft: 25 }}>Business</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { actionSheetRef.current?.setModalVisible(false), props.navigation.navigate('AddService') }} style={{ flexDirection: 'row', paddingLeft: 20, paddingVertical: 10 }}>
            <Image style={{ height: 20, width: 20 }} source={require("../images/ic_storefront_black_36dp.png")} />
            <Text note style={{ marginLeft: 25 }}>Store</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { actionSheetRef.current?.setModalVisible(false), props.navigation.navigate('AddProduct') }} style={{ flexDirection: 'row', paddingLeft: 20, paddingVertical: 10 }}>
            <Image style={{ height: 20, width: 20 }} source={require("../images/ic_store_plus_black_36dp.png")} />
            <Text note style={{ marginLeft: 25 }}>Product</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { actionSheetRef.current?.setModalVisible(false), props.navigation.navigate('AddProduct') }} style={{ flexDirection: 'row', paddingLeft: 20, paddingVertical: 10 }}>
            <MIcon size={20} name="face-agent" color={colors.gray_100} />
            <Text note style={{ marginLeft: 25 }}>Services</Text>
          </TouchableOpacity>

          {/*  Add a Small Footer at Bottom */}
          <View style={styles.footer} />
        </View>
      </ActionSheet>
    </Footer>
  );
}

export default Meteor.withTracker(() => {
  return {
    loggedUser: Meteor.user()
  }
})(FooterTabs);

const styles = StyleSheet.create({
  footerTab: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 10
  },

  footer: {
    height: 100,
  },

  btnTab: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  },

  textTab: {
    color: colors.statusBar,
    fontSize: 9,
    fontWeight: 'bold'
  },

  searchBtn: {
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: colors.statusBar,
    height: 60,
    width: 60,
    borderRadius: 30
  },

  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  btnLeft: {
    width: 30,
    height: 30,
    backgroundColor: '#f0f0f0',
    borderRadius: 100,
  },
  input: {
    width: '100%',
    minHeight: 50,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  actionContentView: {
    width: '100%',
    padding: 12,
  },
  btn: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#fe8a71',
    paddingHorizontal: 10,
    borderRadius: 5,
    elevation: 5,
    shadowColor: 'black',
    shadowOffset: { width: 0.3 * 4, height: 0.5 * 4 },
    shadowOpacity: 0.2,
    shadowRadius: 0.7 * 4,
  },
  safeareview: {
    justifyContent: 'center',
    flex: 1,
  },
  btnTitle: {
    color: 'white',
    fontWeight: 'bold',
  },
});