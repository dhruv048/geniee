import Meteor , { Accounts } from 'react-native-meteor';
import React, {Component} from 'react';
import {Container, Content, Button, Input, Item, Text, Label, Header, Left, Body, Title, Icon, StyleProvider} from "native-base";
import {ToastAndroid, TouchableOpacity, KeyboardAvoidingView, View, StyleSheet, StatusBar} from "react-native";
import { hashPassword } from '../../node_modules/react-native-meteor/lib/utils';
import {colors} from "../config/styles";
//import Icon from 'react-native-vector-icons/dist/FontAwesome';

class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.mounted = false;
        this.state = {
            email: '',
            token: '',
            password: '',
            confirmPassword: '',
            setPassWord:false
        };
    }

    componentWillMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    componentDidMount() {

    }

    _forgotPassword = () => {
        console.log('sds');
        try {
            Meteor.call('forgotPasswordCustom',this.state.email, (err,res) => {
                if (err) {
                    ToastAndroid.showWithGravityAndOffset(
                        err.message,
                        ToastAndroid.LONG,
                        ToastAndroid.TOP,
                        0,
                        50,
                    );
                }
                else {
                    ToastAndroid.showWithGravityAndOffset(
                        'Password Reset Code has been sent to email:'+this.state.email,
                        ToastAndroid.LONG,
                        ToastAndroid.TOP,
                        0,
                        50,
                    );

                  this.setState({  setPassWord:true});
                }
            });
        }
        catch
            (e) {
            alert(e.message)
        }
    }

    _setNewPassword=()=>{
        const {token,password,confirmPassword} = this.state;
        if(token && password && confirmPassword){
           if(password!==confirmPassword)
           {
               ToastAndroid.showWithGravityAndOffset(
                   'Password & ConfirmPassword do not match!!!' ,
                   ToastAndroid.LONG,
                   ToastAndroid.TOP,
                   0,
                   80,
               );
           }
           else{
               Accounts.resetPassword(token,password,(err,res)=>{
                   if(!err){
                       ToastAndroid.showWithGravityAndOffset(
                           'Password Reset Successfully!!' ,
                           ToastAndroid.LONG,
                           ToastAndroid.TOP,
                           0,
                           50,
                       );
                       this.setState({  setPassWord:false});
                       this.props.navigation.navigate('AuthLoading');
                   }
                   else{
                       ToastAndroid.showWithGravityAndOffset(
                           err.message,
                           ToastAndroid.LONG,
                           ToastAndroid.TOP,
                           0,
                           50,
                       );
                   }
               })
           }
        }
        else {
            ToastAndroid.showWithGravityAndOffset(
                'Please type 6-digit Code and Password',
                ToastAndroid.LONG,
                ToastAndroid.TOP,
                0,
                50,
            );
        }
    }


    render() {
        return (
            <Container style={{backgroundColor:colors.appBackground}}>
                <StatusBar
                    backgroundColor={colors.statusBar}
                    barStyle='light-content'
                />
                {this.state.setPassWord===false?
                
                <Content>
                        <Header transparent>
                            <Left>
                                <Button transparent onPress={()=>{this.props.navigation.goBack()}}>
                                    <Icon style={{color: '#000'}} name="arrow-back" />
                                </Button>
                            </Left>
                                <Body>
                                    <Title></Title>
                                </Body>
                        </Header>
                        <KeyboardAvoidingView style={{padding: 30}}>
                            <Text style={{fontSize: 28, fontWeight: 'bold', marginBottom: 10, color: colors.primaryText}}>Forgot password</Text>
                            <Text style={{marginBottom: 14, color: colors.primaryText,}}>Please enter your email address. You will receive a 6-digit code to Reset Password</Text>
                            <Item floatingLabel style={{marginBottom: 30}}>
                                <Label>Email address</Label>
                                <Input onChangeText={(email) => this.setState({email})}/>
                            </Item>

                            <View>
                                <TouchableOpacity  style={styles.button}  onPress={() => {
                                    this._forgotPassword()
                                }}>
                                    <Text style={styles.buttonText}>Send</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingTop: 20, paddingBottom: 20}}>
                                <Button transparent onPress={()=>{this.setState({setPassWord:true})}}>
                                    <Text>Token has been already recieved!!!</Text>
                                </Button>
                            </View>
                    </KeyboardAvoidingView>
                </Content>
               :
                <Content>
                    <Header transparent>
                        <Left>
                            <Button transparent onPress={()=>{this.props.navigation.goBack()}}>
                                <Icon style={{color: '#000'}} name="arrow-back" />
                            </Button>
                        </Left>
                            <Body>
                                <Title></Title>
                            </Body>
                    </Header>
                    <KeyboardAvoidingView style={{padding: 30}}>
                        <Text style={{fontSize: 28, fontWeight: 'bold', marginBottom: 10, color: colors.primaryText,}}>Password reset</Text>
                        <Text style={{marginBottom: 14, color: colors.primaryText}}>Please Enter the Password Reset code sent to your email.</Text>
                        <Item floatingLabel style={{marginBottom: 30}}>
                            <Label>Token(6-digit Code)</Label>
                            <Input onChangeText={(token) => this.setState({token})}
                                   keyboardType='phone-pad'
                            />
                        </Item>
                        <Item floatingLabel style={{marginBottom: 30}}>
                        <Label>Password</Label>
                            <Input onChangeText={(password) => this.setState({password})}
                            />
                        </Item>
                        <Item floatingLabel style={{marginBottom: 30}}>
                            <Label>Confirm Password</Label>
                            <Input onChangeText={(confirmPassword) => this.setState({confirmPassword})}
                            />
                        </Item>
                        <View>
                            <TouchableOpacity  style={styles.button}  onPress={() => {
                                this._setNewPassword()
                            }}>
                                <Text style={styles.buttonText}>Set New Password</Text>
                            </TouchableOpacity>
                        </View>
                        
                        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingTop: 20, paddingBottom: 20}}>
                            <Button transparent onPress={()=>{this.setState({setPassWord:false})}}>
                                <Text>Get new password reset token</Text>
                            </Button>
                        </View>
                    </KeyboardAvoidingView>
                </Content> }
            </Container>
        )
    }
}

const styles=StyleSheet.create({
    button: {
        width: 300,
        backgroundColor: colors.buttonPrimaryBackground,
        borderRadius: 25,
        marginVertical: 10,
        paddingVertical: 13
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.whiteText,
        textAlign: 'center'
    },
})

export default ForgotPassword;