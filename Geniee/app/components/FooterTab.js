import { Text, FooterTab, Footer, Button, View, Icon as NBIcon } from "native-base";
import {ScrollView,StyleSheet,TouchableOpacity,TextInput, Image, Alert} from 'react-native';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Feather';
import React, { createRef } from "react";
import { colors } from "../config/styles";
import { goToRoute, backToRoot } from "../Navigation";
import ActionSheet from "react-native-actions-sheet";
import { Headline, List, } from "react-native-paper";

class FooterTabs extends React.PureComponent {

  constructor(props){
    super(props);
    this.actionSheetRef = createRef();
  };

  render(){
   
    return (
      <Footer style={{ backgroundColor: colors.whiteText, borderTopWidth: 0 }}>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: 'white' }}>
          <Button transparent style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}
            onPress={() => backToRoot(this.props.componentId)}
          >
            <NBIcon name="home" style={{ color: this.props.route == 'Home' ? colors.appLayout : colors.gray_200 }} size={20}></NBIcon>
            {this.props.route == 'Home' ?
              <Text note style={{ color: colors.appLayout, fontSize: 8 }}>Home</Text>
              : null}
          </Button >
          <Button transparent style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}
            onPress={() => goToRoute(this.props.componentId, 'Chat')}
          >
            <Icon name="mail" style={{ color: this.props.route == 'Chat' ? colors.appLayout : colors.gray_200 }} size={20}></Icon>
            {this.props.route == 'Chat' ?
              <Text note style={{ color: colors.appLayout, fontSize: 8 }}>Message</Text> : null}
          </Button>

          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Button onPress={() => { this.actionSheetRef.current?.setModalVisible(); }}
              style={{ flexDirection: 'column', justifyContent: 'center', backgroundColor: colors.appLayout, height: 40, width: 40, borderRadius: 20 }} >
              <Icon name="plus" style={{ color: colors.whiteText }} size={25}></Icon>
            </Button>
          </View>

          <Button transparent style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}
            onPress={() => goToRoute(this.props.componentId, 'WishListEF')}
          >
            <Icon name="heart" style={{ color: this.props.route == 'Favourite' ? colors.appLayout : colors.gray_200 }} size={20}></Icon>
            {this.props.route == 'Favourite' ?
              <Text note style={{ color: colors.appLayout, fontSize: 8 }}>WishList</Text> : null}
          </Button>
          <Button transparent style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}
            onPress={() => goToRoute(this.props.componentId, 'SideMenu')}
          >
            <Icon name="more-horizontal" style={{ color: this.props.route == 'More' ? colors.appLayout : colors.gray_200 }} size={20}></Icon>
            {this.props.route == 'More' ?
              <Text note style={{ color: colors.appLayout, fontSize: 8 }}>More</Text> : null}
          </Button>
        </View>
        <ActionSheet ref={this.actionSheetRef}
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
              <View style={{flexDirection:'row', justifyContent:'space-between'}}>
              <Headline>Create</Headline>
              <TouchableOpacity onPress={()=>{this.actionSheetRef.current?.setModalVisible(false)}}/>
               <Icon  onPress={()=>{this.actionSheetRef.current?.setModalVisible(false)}} name="x" size={25} />
              </View>
              <TouchableOpacity onPress={()=>{this.actionSheetRef.current?.setModalVisible(false),goToRoute(this.props.componentId, 'AddService')}} style={{flexDirection:'row' , paddingLeft:20, paddingVertical:10}}>
                <MIcon size={20}  name="briefcase" color={colors.gray_100}/>
                <Text note style={{marginLeft:25}}>Business</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{this.actionSheetRef.current?.setModalVisible(false),goToRoute(this.props.componentId, 'AddService')}} style={{flexDirection:'row' , paddingLeft:20, paddingVertical:10}}>
                <Image style={{height:20,width:20}}  source={require("../images/ic_storefront_black_36dp.png")} />
                <Text note style={{marginLeft:25}}>Store</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{this.actionSheetRef.current?.setModalVisible(false),goToRoute(this.props.componentId, 'AddProduct')}} style={{flexDirection:'row' , paddingLeft:20, paddingVertical:10}}>
                <Image style={{height:20,width:20}}  source={require("../images/ic_store_plus_black_36dp.png")} />
                <Text note style={{marginLeft:25}}>Product</Text>
                </TouchableOpacity>
             <TouchableOpacity onPress={()=>{this.actionSheetRef.current?.setModalVisible(false),goToRoute(this.props.componentId, 'AddProduct')}} style={{flexDirection:'row' , paddingLeft:20, paddingVertical:10}}>
                <MIcon size={20}  name="face-agent"  color={colors.gray_100}/>
                <Text note style={{marginLeft:25}}>Services</Text>
                </TouchableOpacity>
             
            {/*  Add a Small Footer at Bottom */}
            <View style={styles.footer} />
          </View>
        </ActionSheet>
      </Footer>
    );
  }
}

export default FooterTabs;

const styles = StyleSheet.create({
  footer: {
    height: 100,
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
    shadowOffset: {width: 0.3 * 4, height: 0.5 * 4},
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