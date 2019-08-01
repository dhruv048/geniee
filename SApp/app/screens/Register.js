import React, {Component} from 'react';
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

import {RadioGroup} from 'react-native-btr';

import Meteor from 'react-native-meteor';
import GooglePlaceSearchBox from '../components/GooglePlaceSearch';
import Logo from '../components/Logo/Logo';
import {colors} from '../config/styles';
import {userType} from '../config/settings';
import {Item} from 'native-base';

class Register extends Component {
    validInput = (overrideConfirm) => {
        const {email, password, confirmPassword, confirmPasswordVisible} = this.state;
        let valid = true;

        if (email.length === 0 || password.length === 0) {
            ToastAndroid.showWithGravityAndOffset(
                'Email or password cannot be empty.',
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
            const {email, password} = this.state;

            try {
                Meteor.loginWithPassword(email, password, function (err, res) {
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
        if (this.validInput()) {
            const {email, password, name, contact, userType, location} = this.state;
            if (name.length === 0 || contact.length === 0 || !location) {
                console.log('Empty');
                ToastAndroid.showWithGravityAndOffset(
                    'Name, Location or Contact cannot be empty.',
                    ToastAndroid.LONG,
                    ToastAndroid.TOP,
                    0,
                    50,
                );
                //valid = false;
            }
            else {
                let selectedItem = this.state.radioButtons.find(e => e.checked == true);
                selectedItem = selectedItem ? selectedItem.value : this.state.radioButtons[0].value;
                let user = {
                    password: password,
                    username: contact,
                    email: email,
                    createdAt: new Date(),
                    //createdBy: new Date(),
                    profile: {
                        role: selectedItem,
                        name: name,
                        contactNo: contact,
                        profileImage: null,
                        location:location
                    }
                };
                Meteor.call('signUpUser', user, (err, res) => {
                    if (err) {
                        console.log(err.reason);
                    } else {
                        // hack because react-native-meteor doesn't login right away after sign in
                        console.log('Reslut from register' + res);
                        this.handleSignIn();
                    }
                });
            }
        }
    }

    constructor(props) {
        super(props);

        this.mounted = false;
        this.state = {
            name: '',
            email: '',
            contact: '',
            password: '',
            location: null,
            confirmPassword: '',
            confirmPasswordVisible: false,
            userType: null,
            isLogged: Meteor.user() ? true : null,
            radioButtons: [
                {
                    label: 'User',
                    value: userType.NORMAL,
                    checked: true,
                },
                {
                    label: 'Service Provider',
                    value: userType.SERVICE_PROVIDER
                }
            ]
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

    handleLocation = (data, Detail) => {
        console.log(data, 'Detail :' + Detail)
        this.setState({
            location: data
        })
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

                    <View style={styles.containerRegister}>
                        <TextInput style={styles.inputBox}
                                   underlineColorAndroid='rgba(0,0,0,0)'
                                   placeholder='Full Name'
                                   placeholderTextColor='#ffffff'
                                   selectionColor='#ffffff'
                                   onSubmitEditing={() => this.email.focus()}
                                   onChangeText={(name) => this.setState({name})}
                        />
                        <TextInput style={styles.inputBox}
                                   underlineColorAndroid='rgba(0,0,0,0)'
                                   placeholder='Email'
                                   placeholderTextColor='#ffffff'
                                   selectionColor='#ffffff'
                                   keyboardType='email-address'
                                   ref={(input) => this.email = input}
                                   onSubmitEditing={() => this.contact.focus()}
                                   onChangeText={(email) => this.setState({email})}
                        />
                        <TextInput style={styles.inputBox}
                                   underlineColorAndroid='rgba(0,0,0,0)'
                                   placeholder='Contact Number'
                                   placeholderTextColor='#ffffff'
                                   selectionColor='#ffffff'
                                   keyboardType='phone-pad'
                                   onChangeText={(contact) => this.setState({contact})}
                        />
                        {/*<View style={{width:300,minHeight:40,  marginVertical: 5}}>*/}
                                <Item style={{width:300,minHeight:40,  marginVertical: 5}}>
                        <GooglePlaceSearchBox
                            underlineColorAndroid='rgba(0,0,0,0)'
                            placeholderTextColor='#ffffff'
                            styles={GooglePlaceSerachStyle}
                            onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                                console.log(data, details);
                                this.handleLocation(details)
                            }}
                            ref={(input) => this.password = input}
                            placeholder='Enter Address (*)'
                        ></GooglePlaceSearchBox>
                    </Item>
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
                               onChangeText={(confirmPassword) => this.setState({confirmPassword})}
                    />

                    {/*<View style={styles.pickerView}><Picker style={styles.selectBox}
                            selectedValue={this.state.userType}
                            onValueChange={(itemValue, itemIndex) =>
                                this.setState({userType:itemValue})
                            }
                        >
                            <Picker.Item label="Register As" value=""/>
                            <Picker.Item label="User" value="0"/>
                            <Picker.Item label="Service Provider" value="1"/>
                        </Picker></View>*/}
                    {/*<View style={styles.radioView}>*/}
                        {/*<Text style={styles.radioTypeText}>Register As</Text>*/}
                        {/*<RadioGroup style={styles.radioGrp}*/}
                                    {/*color='#094c6b'*/}
                            {/*//flexDirection='row'*/}
                                    {/*labelStyle={{fontSize: 16, color: '#094c6b'}}*/}
                                    {/*radioButtons={this.state.radioButtons}*/}
                                    {/*onPress={radioButtons => this.setState({radioButtons})}*/}
                        {/*/>*/}
                    {/*</View>*/}

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
    )
        ;

    }
}

const GooglePlaceSerachStyle={
    textInputContainer: {
        width: 300,
        backgroundColor: 'rgba(0,0,0,0)',
        borderTopWidth: 0,
        borderBottomWidth: 0,
        padding:0
    },
    //container:{
        //padding:0,
        //borderRadius: 25,
    //},
    description: {
        fontWeight: 'bold',
        color: colors.appLayout
    },
    predefinedPlacesDescription: {
        color: colors.appLayout
    },
    textInput: {
        width: 300,
        backgroundColor: colors.inputBackground,
        borderRadius: 25,
        paddingHorizontal: 16,
        fontSize: 16,
        color: colors.whiteText,
        // marginVertical: 5,
        height:40,
        margin:0 ,
        marginTop:0,
        marginLeft:0,
        marginRight:0,
        paddingTop:0,
        paddingButtom:0
    },

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
        width: '100%'
    },

    inputBox: {
        width: 300,
        height: 40,
        backgroundColor: colors.inputBackground,
        borderRadius: 25,
        paddingHorizontal: 16,
        fontSize: 16,
        color: colors.whiteText,
        marginVertical: 5,
    },


    radioView: {
        //flexGrow: 1,
        //alignItems: 'flex-end',
        justifyContent: 'center',
        //paddingVertical: 2,
        flexDirection: 'row'
    },
    radioTypeText: {
        color: colors.primaryText,
        fontSize: 16,
        fontWeight: '700',
        paddingVertical: 10,
        paddingHorizontal: 40,
    },
    radioGrp: {
        paddingHorizontal: 12,
        marginVertical: 0,
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

    s50325ddf: {
        backgroundColor: `rgba(0, 0, 0, 0.11)`,
        height: 1,
        marginBottom: 2,
        marginTop: 2,
        width: `100%`,

    },

    //signupButton: {
    //color: '#a51822',
    //fontSize: 16,
    //fontWeight: '500'
    //}
});

export default Register;
