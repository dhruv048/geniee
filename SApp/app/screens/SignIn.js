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
    ToastAndroid
 } from 'react-native';

import Meteor from 'react-native-meteor';

import Sapp from "../screens/Sapp";
import Logo from '../components/Logo/Logo';
import { colors } from '../config/styles';
import settings, {userType} from '../config/settings';


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
    }

    handleSignIn = () => {
        if (this.validInput(true)) {
            const { email, password } = this.state;            

            try {
                Meteor.loginWithPassword({username: email}, password, function (err, res) {
                    if (err) {
                        console.log("err::" + err.message);
                        ToastAndroid.showWithGravityAndOffset(
                            'Invalid login details!',
                            ToastAndroid.LONG,
                            ToastAndroid.TOP,
                            0,
                            50,
                        );
                    }
                    else {
                        console.log("Resulton LogedIN:" + res);
                        this.setState({
                            isLogged: true
                        })
                    }
                }.bind(this));
            }
            catch (e) {
                console.log(e.message)                
            }
        }
    }   
    

    render() {
        const { navigate } = this.props.navigation;
        if(this.state.isLogged!==null){
            return < Sapp />
        }
        else {
            return (
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <View style={styles.container}>
                        <StatusBar 
                            backgroundColor= {colors.statusBar}
                            barStyle= 'light-content'
                        />
                    
                        <Logo/>
                        
                        <View style={styles.containerForm}>
                            <TextInput style={styles.inputBox}
                                underlineColorAndroid='rgba(0,0,0,0)'
                                placeholder='Email'
                                placeholderTextColor='#ffffff'
                                selectionColor='#ffffff'
                                keyboardType='email-address'
                                onSubmitEditing={() => this.password.focus()}
                                onChangeText={(email) => this.setState({email})}
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
                                <Text style={styles.forgotPwdButton}>Forgot password?</Text>
                            </View>
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
