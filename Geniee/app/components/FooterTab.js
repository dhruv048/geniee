import {Text, FooterTab,Footer,Button,  View} from "native-base";
import Icon from 'react-native-vector-icons/Feather'
import React from "react";
import { colors } from "../config/styles";
import { goToRoute ,backToRoot} from "../Navigation";

const FooterTabs = (props) => {
    return (
        <Footer style={{backgroundColor:colors.whiteText, borderTopWidth:0}}>
          <View style={{flex:1, flexDirection:'row', justifyContent:'space-around', alignItems:'center', backgroundColor:'white'}}>
            <Button transparent style={{flex:1,flexDirection:'column', justifyContent:'center'}}
            onPress={()=> backToRoot(props.componentId)}
            >
                <Icon name="home"style={{ color:props.route=='Home' ? colors.appLayout : colors.gray_200}} size={20}></Icon>
                {props.route=='Home'?
              <Text note style={{ color:colors.appLayout , fontSize: 8}}>Home</Text>
               :null} 
            </Button >
            <Button transparent style={{flex:1,flexDirection:'column', justifyContent:'center'}}
            onPress={()=>goToRoute(props.componentId,'Chat')}
            >  
            <Icon name="mail"style={{ color:props.route=='Chat' ? colors.appLayout : colors.gray_200}} size={20}></Icon>
                {props.route=='Chat'?
              <Text note style={{ color:colors.appLayout , fontSize: 8}}>Message</Text>:null}
            </Button>
            <Button  style={{flexDirection:'column', justifyContent:'center', backgroundColor:colors.appLayout, height:40,width:40, borderRadius:20}} >
            <Icon name="plus" style={{ color:colors.whiteText}} size={25}></Icon>
            </Button>
            <Button transparent style={{flex:1,flexDirection:'column', justifyContent:'center'}} >
            <Icon name="heart" style={{ color:props.route=='Favourite' ? colors.appLayout : colors.gray_200}} size={20}></Icon>
                {props.route=='Favourite'?
              <Text note style={{ color:colors.appLayout , fontSize: 8}}>Favourite</Text>:null}
            </Button>
            <Button transparent style={{flex:1,flexDirection:'column', justifyContent:'center'}} 
            onPress={()=>goToRoute(props.componentId,'SideMenu')}
            >
            <Icon name="more-horizontal"style={{ color:props.route=='More' ? colors.appLayout : colors.gray_200}} size={20}></Icon>
                {props.route=='More'?
              <Text note style={{ color:colors.appLayout , fontSize: 8}}>More</Text>:null}
            </Button>
          </View>
        </Footer>
    );
}

export default FooterTabs