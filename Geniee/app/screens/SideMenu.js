import React,{Component} from 'react';
import {Body, Container, Content, Header, Item, Text} from "native-base";
import {colors} from "../config/styles";
import UploadProfilePic from "../components/UploadProfilePic/UploadProfilePic";
import {StatusBar,StyleSheet} from "react-native";
import {Navigation} from "react-native-navigation/lib/dist/index";
import {navigateToRoutefromSideMenu} from "../Navigation";
import ContactUs from "./ContactUs";
import ForgotPassword from "./ForgotPassword";
import  Meteor from "../react-native-meteor";
import { EventRegister } from 'react-native-event-listeners';

class SideMenu extends Component{
    constructor(props){
        super(props);
        this.state={
            isLogged:Meteor.user()?true:false,
            currentRoute:'Dashboard'
        }
    }

    componentDidMount(){
        Navigation.events().bindComponent(this);
        this.setState({isLogged:this.props.loggedUser?true:false})
        this.listener = EventRegister.addEventListener('routeChanged', (data) => {
            console.log('routeChanged',data)
            this.setState({
                currentRoute:data
            })
        })

    }

    componentWillReceiveProps(newProps){
        this.setState({isLogged:newProps.loggedUser?true:false})
    }

    navigateToRoute(route){
    console.log(this.props.componentId);
       navigateToRoutefromSideMenu(this.props.componentId,route)
    }

    render(){
        return(
            <Container>
                <Header androidStatusBarColor={colors.statusBar} style={{height: 220, backgroundColor: colors.inputBackground}}>
                    <Body style={{justifyContent: 'center', alignItems: 'center'}}>
                    <UploadProfilePic/>
                    </Body>
                </Header>
                <Content style={{backgroundColor: colors.appBackground, flex:1,marginTop:1}}>
                    <Item style={this.state.currentRoute=='Dashboard'? style.activeRoute:style.normalRoute} onPress={()=>this.navigateToRoute("Dashboard")}>
                        <Text style={this.state.currentRoute=='Dashboard'? style.activeText:style.normalText} >Home</Text>
                    </Item>
                    <Item style={this.state.currentRoute=='Orders'? style.activeRoute:style.normalRoute} onPress={()=>this.navigateToRoute('Orders')}>
                        <Text style={this.state.currentRoute=='Orders'? style.activeText:style.normalText} >My Orders</Text>
                    </Item>
                    {this.state.isLogged?
                        <>
                    <Item style={this.state.currentRoute=='Chat'? style.activeRoute:style.normalRoute} onPress={()=>this.navigateToRoute('Chat')}>
                        <Text style={this.state.currentRoute=='Chat'? style.activeText:style.normalText} >Chat</Text>
                    </Item>
                    <Item style={this.state.currentRoute=='MyServices'? style.activeRoute:style.normalRoute} onPress={()=>this.navigateToRoute('MyServices')}>
                        <Text style={this.state.currentRoute=='MyServices'? style.activeText:style.normalText} >My Services</Text>
                    </Item>
                    <Item style={this.state.currentRoute=='AddService'? style.activeRoute:style.normalRoute} onPress={()=>this.navigateToRoute('AddService')}>
                        <Text style={this.state.currentRoute=='AddService'? style.activeText:style.normalText} >Add Service</Text>
                    </Item>
                    <Item style={this.state.currentRoute=='AddProduct'? style.activeRoute:style.normalRoute} onPress={()=>this.navigateToRoute('AddProduct')}>
                        <Text style={this.state.currentRoute=='AddProduct'? style.activeText:style.normalText} >Add Product</Text>
                    </Item></>:null}

                    <Item style={this.state.currentRoute=='ContactUs'? style.activeRoute:style.normalRoute} onPress={()=>this.navigateToRoute('ContactUs')}>
                        <Text style={this.state.currentRoute=='ContactUs'? style.activeText:style.normalText} >Contact Us</Text>
                    </Item>
                    <Item style={this.state.currentRoute=='ForgotPassword'? style.activeRoute:style.normalRoute} onPress={()=>this.navigateToRoute('ForgotPassword')}>
                        <Text style={this.state.currentRoute=='ForgotPassword'? style.activeText:style.normalText} >Forgot Password</Text>
                    </Item>


                    {this.state.isLogged?
                    <Item style={this.state.currentRoute=='SignOut'? style.activeRoute:style.normalRoute}>
                    <Text style={this.state.currentRoute=='SignOut'? style.activeText:style.normalText} >SignOut</Text>
                    </Item>:
                        <Item style={this.state.currentRoute=='SignIn'? style.activeRoute:style.normalRoute} onPress={()=>this.navigateToRoute('SignIn')}>
                            <Text style={this.state.currentRoute=='SignIn'? style.activeText:style.normalText} >Sign In</Text>
                        </Item>}

                </Content>
            </Container>
        )
    }
}

const style=StyleSheet.create({
    activeRoute:{
        backgroundColor:colors.appLayout,
       height:50,
        padding:2
    },
    normalRoute:{
        backgroundColor:'white',
        height:50,
        padding:2
    },
    activeText:{
        color:'#ffffff',
        fontSize:22,
        marginLeft:30,
        fontWeight:'700'
    },
    normalText:{
        color:colors.appLayout,
        fontSize:20,
        marginLeft:30,
        fontWeight:'600'
    }
})

export default Meteor.withTracker(()=>{
    return{
        loggedUser:Meteor.user()
    }
}) (SideMenu);