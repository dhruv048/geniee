import React, { Component } from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
    StatusBar, 
    TouchableOpacity, 
    TextInput,
    TouchableWithoutFeedback,
    Keyboard,
    ToastAndroid,
    AsyncStorage
 } from 'react-native';
import {Button} from 'native-base';
import Icon from 'react-native-vector-icons/Feather';
import Meteor from 'react-native-meteor';
import Logo from '../components/Logo/Logo';
import { colors } from '../config/styles';
import {LoginManager} from "react-native-fbsdk";
import {onLoginFinished} from "../lib/FBlogin";
import Data from "react-native-meteor/src/Data";
import {MyFunctions} from "../lib/MyFunctions";
import {hashPassword} from "react-native-meteor/lib/utils";

const USER_TOKEN_KEY = 'USER_TOKEN_KEY_GENNIE';
const USER_TOKEN_TYPE = 'USER_TOKEN_TYPE';



class SignIn extends Component {
    constructor(props) {
        super(props);

        this.mounted = false;
        this.state = {
            email: '',            
            password: '',
            isLogged:Meteor.user()?true : null            
        };
    }

    componentWillMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }
    
    componentDidMount(){
        
    }   
    
    validInput = (overrideConfirm) => {
        const { email, password } = this.state;
        let valid = true;

        if (email.length === 0 || password.length === 0) {
            console.log('Empty');
            ToastAndroid.showWithGravityAndOffset(
                'Email and password cannot be empty.',
                ToastAndroid.LONG,
                ToastAndroid.TOP,
                0,
                50,
            );
            valid = false;
        }
        return valid;
    };

    _loginFacabook = () => {
        console.log('loginFB')
        // try {
            const navi = this.props.navigation;
            LoginManager.logInWithReadPermissions(["email", "user_location", "user_birthday"]).then(function (result) {
                console.log('resulttt',result)
                if (result.isCancelled) {
                    console.log("Login cancelled");
                } else {
                    console.log(
                        "Login success with permissions: " +
                        result.grantedPermissions.toString()
                    );
                    onLoginFinished(result, navi);
                }
            }).catch(function (error) {
                console.log('There has been a problem with your fetch operation: ' + error.message);
                // ADD THIS THROW error
                throw error;
            });
        // }
        // catch (e) {
        //     console.log(e,e.message)
        // }

    }

    handleSignIn = () => {
        if (this.validInput(true)) {
            const { email, password } = this.state;            

            try {
               Meteor.loginWithPassword(email.toLowerCase(), password, function (err, res) {
                    if (err) {
                        console.log("err::" + err.message);
                        ToastAndroid.showWithGravityAndOffset(
                           err.reason,
                            ToastAndroid.LONG,
                            ToastAndroid.TOP,
                            0,
                            50,
                        );
                    }
                    else {
                        console.log("Resulton LogedIN:" + Meteor.getData()._tokenIdSaved);
                        AsyncStorage.setItem(USER_TOKEN_KEY,  Meteor.getData()._tokenIdSaved );
                        AsyncStorage.setItem(USER_TOKEN_TYPE, 'METEOR');
                        this.setState({
                            isLogged: true
                        })
                        this.props.navigation.navigate('App')
                    }
                }.bind(this));
                // Meteor.call('login',{data: {email: email, password:hashPassword(password), type:'meteor'}}, (err, result) => {
                //     if (!err) {//save user id and token
                //         console.log('result', result)
                //         AsyncStorage.setItem(USER_TOKEN_KEY, result.token);
                //         AsyncStorage.setItem(USER_TOKEN_TYPE, 'METEOR');
                //         Data._tokenIdSaved = result.token;
                //         Meteor._userIdSaved = result.id;
                //        // Meteor._loginWithToken(result.token)
                //         this.props.navigation.navigate('App')
                //     }
                //     else{
                //         ToastAndroid.showWithGravityAndOffset(
                //                     err.reason,
                //                     ToastAndroid.LONG,
                //                     ToastAndroid.TOP,
                //                     0,
                //                     50,
                //                 );
                //     }
                // });
            }
            catch (e) {
                console.log(e.message)                
            }
        }
    }   
    

    render() {
        const {navigate} = this.props.navigation;
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={styles.container}>
                    <StatusBar
                        backgroundColor={colors.statusBar}
                        barStyle='light-content'
                    />

                    <Logo/>

                    <View style={styles.containerForm}>
                        <TextInput style={styles.inputBox}
                                   underlineColorAndroid='rgba(0,0,0,0)'
                                   placeholder='Email/Mobile No'
                                   placeholderTextColor='#ffffff'
                                   selectionColor='#ffffff'
                                   keyboardType='email-address'
                                   onSubmitEditing={() => this.password.focus()}
                                   onChangeText={(email) => this.setState({email})}
                                   textContentType={'emailAddress'}
                        />
                        <TextInput style={styles.inputBox}
                                   underlineColorAndroid='rgba(0,0,0,0)'
                                   placeholder='Password'
                                   placeholderTextColor='#ffffff'
                                   selectionColor='#ffffff'
                                   secureTextEntry
                                   ref={(input) => this.password = input}
                                   onChangeText={(password) => this.setState({password})}
                        />



                        <TouchableOpacity style={styles.button} onPress={this.handleSignIn}>
                            <Text style={styles.buttonText}>Login</Text>
                        </TouchableOpacity>


                        <View>
                            <TouchableOpacity onPress={()=>this.props.navigation.navigate('ForgotPassword')}>
                            <Text style={styles.forgotPwdButton}>Forgot password?</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={[styles.button,{backgroundColor:'#3b5998'}]} onPress={this._loginFacabook}>
                            <Text style={styles.buttonText}>
                                <Icon name='facebook' size={20}
                                      style={{alignSelf: 'flex-start', color: 'white'}}/> Facebook Login</Text>

                        </TouchableOpacity>
                    </View>

                    <View style={styles.signupCont}>
                        <Text style={styles.signupText}>Don't have an account?</Text>
                        <TouchableOpacity style={styles.navButton} onPress={() => navigate('Register')}>
                            <Text style={styles.navButtonText}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );

    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.appBackground,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },

    containerForm: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    
    inputBox: {
        width: 300,
        backgroundColor: colors.inputBackground,
        borderRadius: 25,
        paddingHorizontal: 16,
        fontSize: 16,
        color: colors.whiteText,
        marginVertical: 5
    },
    
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
    forgotPwdButton: {
        color: colors.redText,
        fontSize: 14,
        fontWeight: '500'
    },

    signupCont: {
        flexGrow: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingVertical: 16,
        flexDirection: 'row'
    },
    signupText: {
        color: colors.primaryText,
        fontSize: 16,
        fontWeight: '700',
        paddingVertical: 2
    },
    navButton: {
        width: 80,
        backgroundColor: colors.buttonPrimaryBackground,
        borderRadius: 25,
        paddingVertical: 2,
        marginLeft: 5
    },
    navButtonText: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.whiteText,
        textAlign: 'center'
    },

    //signupButton: {
        //color: '#a51822',
        //fontSize: 16,
        //fontWeight: '500',
        //paddingVertical: 10,
    //},    
});

export default SignIn;
