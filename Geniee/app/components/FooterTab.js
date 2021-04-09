import { Text, FooterTab, Footer, Button, View, Icon as NBIcon } from "native-base";
import {ScrollView,StyleSheet,TouchableOpacity,TextInput, Image, Alert} from 'react-native';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Feather';
import React, { createRef } from "react";
import { colors } from "../config/styles";
import FAIcon from 'react-native-vector-icons/FontAwesome';
import ActionSheet from "react-native-actions-sheet";
import { Headline, List, } from "react-native-paper";
import Meteor from "../react-native-meteor";

class FooterTabs extends React.PureComponent {

  constructor(props){
    super(props);
    this.state={
      loggedUser: Meteor.user(),
    }
    this.actionSheetRef = createRef();
  };

  componentDidMount(){
    this.setState({loggedUser:this.props.loggedUser ? this.props.loggedUser:null})
  }
  componentWillReceiveProps(newProps) {
    //  this.setState({isLogged: newProps.loggedUser ? true : false})
      if (newProps.loggedUser)
          this.setState({loggedUser: newProps.loggedUser})
  }
  getIndex = (routeName) => {
    return this.props.state.routes.findIndex(route => route.name == routeName)
}
  render(){
   console.log(this.props);
   const state=this.props.state;
    return (
      <Footer style={{ backgroundColor: colors.whiteText, borderTopWidth: 0 }}>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: 'white' }}>
          <Button transparent style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}
            onPress={() =>this.props.navigation.navigate('Home')}
          >
            <FAIcon name="home" style={{ color: state.index== this.getIndex('Home') ? colors.appLayout : colors.gray_200, }} size={20} ></FAIcon>
            {state.index== this.getIndex('Home') ?
              <Text note style={{ color: colors.appLayout, fontSize: 8 }}>Home</Text>
              : null}
          </Button >
          <Button transparent style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}
            onPress={() => this.props.navigation.navigate( 'Chat')}
          >
            <Icon name="mail" style={{ color: state.index== this.getIndex('Chat') ? colors.appLayout : colors.gray_200 }} size={20}></Icon>
            {state.index== this.getIndex('Chat')?
              <Text note style={{ color: colors.appLayout, fontSize: 8 }}>Message</Text> : null}
          </Button>
 {this.state.loggedUser?
          <View style={{ flex: 1, justifyContent:'center', width:'100%' }}>
            <Button onPress={() => { this.actionSheetRef.current?.setModalVisible(); }}
              style={{ alignSelf:'center', justifyContent: 'center', backgroundColor: colors.appLayout, height: 40, width: 40, borderRadius: 20 }} >
              <Icon name="plus" style={{ color: colors.whiteText }} size={25}></Icon>
            </Button>
          </View>:null}

          <Button transparent style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}
            onPress={() => this.props.navigation.navigate( 'WishListEF')}
          >
            <Icon name="heart" style={{ color: state.index== this.getIndex('WishListEF') ? colors.appLayout : colors.gray_200 }} size={20}></Icon>
            {state.index== this.getIndex('WishListEF')?
              <Text note style={{ color: state.index== this.getIndex('WishListEF')? colors.appLayout : colors.gray_200, fontSize: 8 }}>WishList</Text> : null}
          </Button>
          <Button transparent style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}
            onPress={() => this.props.navigation.navigate('More')}
          >
            <Icon name="more-horizontal" style={{ color: state.index== this.getIndex('More')? colors.appLayout : colors.gray_200 }} size={20}></Icon>
            {state.index== this.getIndex('More')?
              <Text note style={{ color:state.index== this.getIndex('More')? colors.appLayout :colors.gray_200, fontSize: 8 }}>More</Text> : null}
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
              <TouchableOpacity onPress={()=>{this.actionSheetRef.current?.setModalVisible(false),this.props.navigation.navigate( 'AddService')}} style={{flexDirection:'row' , paddingLeft:20, paddingVertical:10}}>
                <MIcon size={20}  name="briefcase" color={colors.gray_100}/>
                <Text note style={{marginLeft:25}}>Business</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{this.actionSheetRef.current?.setModalVisible(false),this.props.navigation.navigate( 'AddService')}} style={{flexDirection:'row' , paddingLeft:20, paddingVertical:10}}>
                <Image style={{height:20,width:20}}  source={require("../images/ic_storefront_black_36dp.png")} />
                <Text note style={{marginLeft:25}}>Store</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{this.actionSheetRef.current?.setModalVisible(false),this.props.navigation.navigate( 'AddProduct')}} style={{flexDirection:'row' , paddingLeft:20, paddingVertical:10}}>
                <Image style={{height:20,width:20}}  source={require("../images/ic_store_plus_black_36dp.png")} />
                <Text note style={{marginLeft:25}}>Product</Text>
                </TouchableOpacity>
             <TouchableOpacity onPress={()=>{this.actionSheetRef.current?.setModalVisible(false),this.props.navigation.navigate( 'AddProduct')}} style={{flexDirection:'row' , paddingLeft:20, paddingVertical:10}}>
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

export default Meteor.withTracker(() => {
  return {
      loggedUser: Meteor.user()
  }
})(FooterTabs);

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