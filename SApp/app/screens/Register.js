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
    Picker
 } from 'react-native';

import Meteor from 'react-native-meteor';

import Logo from '../components/Logo/Logo';
import { colors } from '../config/styles';

class Register extends Component {
    constructor(props) {
        super(props);

        this.mounted = false;
        this.state = {
            name:'',
            email: '',
            contact:'',
            password: '',
            confirmPassword: '',
            confirmPasswordVisible: false,
            userType: '',
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
        const { email, password, confirmPassword, confirmPasswordVisible } = this.state;
        let valid = true;

        if (email.length === 0 || password.length === 0) {
            ToastAndroid.showWithGravityAndOffset(
                'Email and password cannot be empty.',
                ToastAndroid.LONG,
                ToastAndroid.TOP,
                0,
                50,
            );
            valid = false;
        }

        if (!overrideConfirm && confirmPasswordVisible && password !== confirmPassword) {
            ToastAndroid.showWithGravityAndOffset(
                'Password mismatch.',
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
                    // Meteor.call('loginUser',{email, password}, (err,res) => {
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
                        //this.props.navigation.navigate('Details');
                    }
                }.bind(this));
            }
            catch (e) {
                console.log(e.message)
            }
        }
        // this.props.navigation.navigate('Details');
    }

    handleCreateAccount = () => {
        if ( this.validInput()) {
            const { email,password,name,contact,userType } = this.state;
            if (name.length === 0 || contact.length === 0) {
                console.log('Empty');
                ToastAndroid.showWithGravityAndOffset(
                    'Name and Contact cannot be empty.',
                    ToastAndroid.LONG,
                    ToastAndroid.TOP,
                    0,
                    50,
                );
                valid = false;
            }
            else {
                let user={
                    name:name,
                    contact:contact,
                    email:email,
                    password:password,
                    userType:userType
                };
                Meteor.call('registerUser',  user , (err, res) => {
                    if (err) {
                        console.log(err.reason);
                    } else {
                        // hack because react-native-meteor doesn't login right away after sign in
                        console.log('Reslut from register'+res);                        
                        this.handleSignIn();
                    }
                });
            }
        }       
    }   
    
    
    render() {
        const { navigate } = this.props.navigation;
        
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>  
                <View style={styles.container}>
                    <StatusBar
                        backgroundColor= {colors.statusBar}
                        barStyle= 'light-content'
                    />
                    
                    <Logo/>
                    
                    <View style={styles.containerRegister}>
                        {/*<TextInput style={styles.inputBox}
                        underlineColorAndroid='rgba(0,0,0,0)'
                        placeholder='Full Name'
                        placeholderTextColor='#ffffff'
                        selectionColor='#ffffff'
                        onSubmitEditing={() => this.email.focus()}
                        onChangeText={(name) => this.setState({name})}          
        />*/}
                        <TextInput style={styles.inputBox}
                        underlineColorAndroid='rgba(0,0,0,0)'
                        placeholder='Email'
                        placeholderTextColor='#ffffff'
                        selectionColor='#ffffff'
                        keyboardType='email-address'
                        ref={(input) => this.email = input}
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
                        onSubmitEditing={() => this.confirmPassword.focus()}
                        onChangeText={(password) => this.setState({password})}
                        />
                        <TextInput style={styles.inputBox}
                        underlineColorAndroid='rgba(0,0,0,0)'
                        placeholder='Confirm Password'
                        placeholderTextColor='#ffffff'
                        selectionColor='#ffffff'
                        secureTextEntry
                        ref={(input) => this.confirmPassword = input}
                        onSubmitEditing={() => this.contactNumber.focus()}
                        onChangeText={(confirmPassword) => this.setState({confirmPassword})}
                        />
                        <TextInput style={styles.inputBox}
                        underlineColorAndroid='rgba(0,0,0,0)'
                        placeholder='Contact Number'
                        placeholderTextColor='#ffffff'
                        selectionColor='#ffffff'
                        keyboardType='phone-pad'
                        ref={(input) => this.contactNumber = input}
                        onChangeText={(contact) => this.setState({contact})}
                        />
                        <View style={styles.pickerView}><Picker style={styles.selectBox}
                            selectedValue={this.state.userType}
                            onValueChange={(itemValue, itemIndex) =>
                                this.setState({userType:itemValue})
                            }
                        >
                            <Picker.Item label="Register As" value=""/>
                            <Picker.Item label="User" value="0"/>
                            <Picker.Item label="Service Provider" value="1"/>
                        </Picker></View>

                        <TouchableOpacity style={styles.button} onPress={this.handleCreateAccount}>
                            <Text style={styles.buttonText}>Register</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.signupCont}>
                        <Text style={styles.signupText}>Already have an account?</Text>
                        <TouchableOpacity style={styles.navButton} onPress={() => navigate('SignIn')}>
                            <Text style={styles.navButtonText}>Login</Text>
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

    containerRegister: {
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

    pickerView: {
        overflow: 'hidden',
        width: 300,
        borderRadius: 100,
    },
    selectBox: {
        width: 300,
        backgroundColor: colors.inputBackground,        
        paddingHorizontal: 16,
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
        //fontWeight: '500'
    //}
});

export default Register;
