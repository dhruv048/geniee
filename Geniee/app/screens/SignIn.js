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
    AsyncStorage,
    BackHandler,
} from 'react-native';
import {Container} from 'native-base';
import Icon from 'react-native-vector-icons/Feather';
import Meteor from '../react-native-meteor';
import Logo from '../components/Logo/Logo';
import {colors} from '../config/styles';
import {customGalioTheme} from '../config/themes';
import {LoginManager} from 'react-native-fbsdk';
import {onLoginFinished} from '../lib/FBlogin';
import {Navigation} from 'react-native-navigation';
import {
    backToRoot,
    goToRoute,
    goBack,
} from '../Navigation';
import {EventRegister} from 'react-native-event-listeners';
import {GalioProvider, Input, Button} from 'galio-framework';
import {Title} from 'react-native-paper';

const USER_TOKEN_KEY = 'USER_TOKEN_KEY_GENNIE';
const USER_TOKEN_TYPE = 'USER_TOKEN_TYPE';

class SignIn extends Component {
    constructor(props) {
        super(props);

        this.mounted = false;
        this.state = {
            email: '',
            password: '',
            loading: false,
            loadingFB: false,
        };
    }

    componentDidMount() {
        Navigation.events().bindComponent(this);
    }

    handleBackButton() {
        console.log('handlebackpressSignIn');
        backToRoot(this.props.componentId);
        return true;
    };

    componentDidAppear() {
        console.log('appearSignIn');
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));
    }


    componentWillUnmount() {
        console.log('componentWillUnmount');
    }

    componentDidDisappear() {
        console.log('disappearSignIn');
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton.bind(this));
    }

    validInput = overrideConfirm => {
        const {email, password} = this.state;
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

    _loginFacabook = (componentId, needReturn) => {
        console.log('loginFB');
        // try {
        //  LoginManager.logInWithPermissions(["email", "user_location", "user_birthday","public_profile"]).then(function (result) {
        // this.setState({loadingFB: true})
        LoginManager.logInWithPermissions(['email', 'public_profile'])
            .then(function (result) {
                console.log('resulttt', result);
                if (result.isCancelled) {
                    // this.setState({loadingFB: false})
                    console.log('Login cancelled');
                } else {
                    console.log(
                        'Login success with permissions: ' +
                        result.grantedPermissions.toString(),
                    );
                    Keyboard.dismiss();
                    onLoginFinished(result, componentId, needReturn);
                    // this.setState({loadingFB: false})
                }
            })
            .catch(function (error) {
                console.log(
                    'There has been a problem with your fetch operation: ' +
                    error.message,
                );
                ToastAndroid.showWithGravityAndOffset(
                    error.message,
                    ToastAndroid.LONG,
                    ToastAndroid.TOP,
                    0,
                    50,
                );
                // this.setState({loadingFB: false})
                // ADD THIS THROW error
              //  throw error;
            });
        // }
        // catch (e) {
        //     console.log(e,e.message)
        // }
    };

    handleSignIn = () => {
        if (this.validInput(true)) {
            const {email, password} = this.state;

            try {
                this.setState({loading: true})
                Meteor.loginWithPassword(
                    email.toLowerCase(),
                    password,
                    function (err, res) {
                        this.setState({loading: false})
                        if (err) {
                            console.log('err::' + err.message);
                            ToastAndroid.showWithGravityAndOffset(
                                err.reason,
                                ToastAndroid.LONG,
                                ToastAndroid.TOP,
                                0,
                                50,
                            );
                        } else {
                            Keyboard.dismiss();
                            console.log('Resulton LogedIN:' + Meteor.getData()._tokenIdSaved);
                            AsyncStorage.setItem(
                                USER_TOKEN_KEY,
                                Meteor.getData()._tokenIdSaved,
                            );
                            AsyncStorage.setItem(USER_TOKEN_TYPE, 'METEOR');
                            EventRegister.emit('siggnedIn', true);
                            ToastAndroid.showWithGravityAndOffset(
                                'Logged In Successfully',
                                ToastAndroid.LONG,
                                ToastAndroid.TOP,
                                0,
                                50,
                            );
                            if (this.props.needReturn) {
                                goBack(this.props.componentId);
                            } else {
                                backToRoot(this.props.componentId);
                            }
                        }
                    }.bind(this),
                );
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
            } catch (e) {
                console.log(e.message);
            }
        }
    };

    navigate(route) {
        goToRoute(this.props.componentId, route);
    }

    render() {
        console.log('render')
        return (
            <Container>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <GalioProvider theme={customGalioTheme}>
                        <View style={styles.container} keyboardShouldPersistTaps="always">
                            <StatusBar
                                backgroundColor={colors.appBackground}
                                barStyle="dark-content"
                            />

                            <Logo/>
                            <View style={styles.welcomeText}>
                                <Title>Welcome,</Title>
                                <Text>Log in to continue</Text>
                            </View>

                            <View style={styles.containerForm}>
                                <Input
                                    color={customGalioTheme.COLORS.INPUT_TEXT}
                                    // rounded
                                    placeholder="Email/Mobile No"
                                    keyboardType="email-address"
                                    onSubmitEditing={() => this.password.focus()}
                                    onChangeText={email => this.setState({email})}
                                    textContentType={'emailAddress'}
                                />
                                <Input
                                    color={customGalioTheme.COLORS.INPUT_TEXT}
                                    // rounded
                                    password
                                    viewPass
                                    placeholder="Password"
                                    ref={input => (this.password = input)}
                                    onChangeText={password => this.setState({password})}
                                    textContentType={'emailAddress'}
                                />


                                <Button
                                    // round
                                    onPress={this.handleSignIn}
                                    style={{width: '100%', marginVertical: 20}}
                                    loading={this.state.loading}>
                                    LOG IN
                                </Button>
                                <Button
                                    // round
                                    loading={this.state.loadingFB}
                                    color={customGalioTheme.COLORS.FACEBOOK}
                                    style={{width: '100%', marginVertical:15}}
                                    Icon='facebook'
                                    onPress={() =>
                                        this._loginFacabook(
                                            this.props.componentId,
                                            this.props.needReturn,
                                        )
                                    }>
                                    Continue with Facebook                                  
                                </Button>
                                <View>
                                    <TouchableOpacity
                                        onPress={() =>
                                            goToRoute(this.props.componentId, 'ForgotPassword')
                                        }>
                                        <Text style={styles.forgotPwdButton}>Forgot your password?</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.signupCont}>
                                <Text style={styles.signupText}>Don't have an account?</Text>
                                <TouchableOpacity
                                    style={styles.navButton}
                                    onPress={() => goToRoute(this.props.componentId, 'Register')}>
                                    <Text style={styles.navButtonText}>Sign Up</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </GalioProvider>
                </TouchableWithoutFeedback>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.appBackground,
        flex: 1,
       // alignItems: 'center',
       // justifyContent: 'center',
    },

    containerForm: {
        flexGrow: 1,
        //alignItems: 'center',
        //justifyContent: 'center',
        paddingHorizontal: 25,
        width: '100%'
    },

    inputBox: {
        width: 300,
        backgroundColor: colors.inputBackground,
        borderRadius: 25,
        paddingHorizontal: 16,
        fontSize: 16,
        color: colors.whiteText,
        marginVertical: 5,
    },

    button: {
        width: 300,
        backgroundColor: customGalioTheme.COLORS.PRIMARY,
        borderRadius: 25,
        marginVertical: 10,
        paddingVertical: 13,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.whiteText,
        textAlign: 'center',
    },
    forgotPwdButton: {
        color: colors.redText,
        fontSize: 14,
        fontWeight: '500',
        paddingVertical: 20,
    },

    signupCont: {
         flexGrow: 1,
        flexDirection: 'row',
        paddingHorizontal:30,
        paddingBottom : 100,
    },
    signupText: {
        color: customGalioTheme.COLORS.PRIMARY,
        fontSize: 16,
        fontWeight: '700',
        paddingVertical: 2,
    },
    navButton: {
        width: 80,
        backgroundColor: customGalioTheme.COLORS.PRIMARY,
        borderRadius: 25,
        paddingVertical: 2,
        marginLeft: 5,
    },
    navButtonText: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.whiteText,
        textAlign: 'center',
        alignSelf: 'center'
    },

    //signupButton: {
    //color: '#a51822',
    //fontSize: 16,
    //fontWeight: '500',
    //paddingVertical: 10,
    //},
    welcomeText : {
        flexGrow: 1,
        justifyContent: 'flex-start',
        flexDirection: 'column',
        paddingHorizontal: 25,
        paddingVertical : 15,
    },
});

export default SignIn;