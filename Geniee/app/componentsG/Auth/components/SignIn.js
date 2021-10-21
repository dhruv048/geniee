import React, { Component, useState, createRef } from 'react';
import {
    StyleSheet,
    Text,
    View,
    StatusBar,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard,
    ToastAndroid,
    BackHandler,
    Image
} from 'react-native';
import { Container, Icon as NBIcon } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Meteor from '../../../react-native-meteor';
import Logo from '../../../components/Logo/Logo'
import { colors, customStyle } from '../../../config/styles';
import { customGalioTheme } from '../../../config/themes';
import { LoginManager } from 'react-native-fbsdk';
import { onLoginFinished } from '../../../lib/FBlogin';
import { Title, Button, TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import authHandlers from '../../../store/services/auth/handlers'
import { authActionsSelector } from '../../../store/selectors';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
const USER_TOKEN_KEY = 'USER_TOKEN_KEY_GENNIE';
const USER_TOKEN_TYPE = 'USER_TOKEN_TYPE';

const SignIn = ({ actions, navigation }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingFB, setLoadingFB] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [validEmail, setValidEmail] = useState(false);
    const [validPassword, setValidPassword] = useState(false);

    const passwordInputRef = createRef();

    const validInput = overrideConfirm => {
        let valid = true;

        if (email.length === 0) {
            setValidEmail(true);
            valid = false;
        } if (password.length === 0){
            setValidPassword(true);
            valid = false;
        }else{
            setValidEmail(false);
            setValidPassword(false);
        }
        if(!valid){
            ToastAndroid.showWithGravityAndOffset(
                'Please fill the login form',
                ToastAndroid.LONG,
                ToastAndroid.TOP,
                0,
                50,
            );
        }
        return valid;
    };

    const _loginFacabook = (navigation, needReturn) => {
        LoginManager.logInWithPermissions(['email', 'public_profile'])
            .then(function (result) {
                console.log('resulttt', result);
                if (result.isCancelled) {
                    console.log('Login cancelled');
                } else {
                    console.log(
                        'Login success with permissions: ' +
                        result.grantedPermissions.toString(),
                    );
                    Keyboard.dismiss();
                    onLoginFinished(result, navigation, needReturn);
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
            });
    };

    const handleSignIn = () => {
        if (validInput(true)) {
            setLoading(true);
            authHandlers.handleSignIn(email, password, (res) => {
                if (res === true) {
                    setLoading(false);
                    AsyncStorage.setItem(
                        USER_TOKEN_KEY,
                        Meteor.getData()._tokenIdSaved,
                      );
                    ToastAndroid.showWithGravityAndOffset(
                        'Logged In Successfully',
                        ToastAndroid.LONG,
                        ToastAndroid.TOP,
                        0,
                        50,
                    );
                    navigation.navigate('Home');
                } else {
                    setLoading(false);
                    ToastAndroid.showWithGravityAndOffset(
                        'Username and Password are wrong',
                        ToastAndroid.LONG,
                        ToastAndroid.TOP,
                        0,
                        50,
                    );
                }
            });
            //setLoading(false);

        }
    }

    // navigate = (route) => {
    //     this.props.navigation.navigate(route);
    // }

    return (
        <Container>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={styles.container} keyboardShouldPersistTaps="always">
                    <StatusBar
                        hidden
                        backgroundColor={colors.appBackground}
                        barStyle="dark-content"
                    />
                    <View style={styles.logo}>
                        <Image style={styles.logoImage} source={require('Geniee/app/images/logoApp.png')} />
                    </View>

                    <View style={styles.welcomeText}>
                        <Title style={{ fontSize: 24, marginBottom: 5 }}>Welcome,</Title>
                        <Text
                            style={{
                                fontSize: 16,
                                color: 'rgba(0,0,0,0.87)',
                                letterSpacing: 0.15,
                            }}>
                            Log in to continue
                        </Text>
                    </View>
                    <View style={styles.containerForm}>
                        <TextInput
                            mode="outlined"
                            color={customGalioTheme.COLORS.INPUT_TEXT}
                            placeholder="Email or Mobile No"
                            placeholderTextColor="#808080"
                            keyboardType="email-address"
                            name="email"
                            label="Email"
                            value={email}
                            onSubmitEditing={() =>
                                passwordInputRef.current &&
                                passwordInputRef.current.focus()
                            }
                            onChangeText={(email) => setEmail(email)}
                            style={styles.inputBox}
                            theme={{ roundness: 6 }}
                            error={validEmail}
                        />
                        <TextInput
                            mode="outlined"
                            color={customGalioTheme.COLORS.INPUT_TEXT}
                            secureTextEntry={!showPassword}
                            right={<TextInput.Icon name="eye" onPress={() => setShowPassword(!showPassword)} />}
                            placeholder="Password"
                            placeholderTextColor="#808080"
                            label="Password"
                            value={password}
                            ref={passwordInputRef}
                            onSubmitEditing={Keyboard.dismiss}
                            onChangeText={password => setPassword(password)}
                            style={styles.inputBox}
                            theme={{ roundness: 6 }}
                            error={validPassword}
                        />
                        <View style={{ marginLeft: 'auto' }}>
                            <TouchableOpacity
                                onPress={() =>
                                    navigation.navigate('ForgotPassword')
                                }>
                                <Text style={styles.forgotPwdButton}>
                                    Forgot password?
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <Button
                            // round
                            mode="contained"
                            uppercase={false}
                            color={customGalioTheme.COLORS.PRIMARY}
                            onPress={handleSignIn}
                            style={{
                                width: '30%',
                                height: 45,
                                marginLeft: '33%',
                                marginBottom: 28,
                                borderRadius: 6
                            }}
                            loading={loading}>
                            <Text style={{ fontSize: 16, color: colors.whiteText }}>Login</Text>
                        </Button>
                        {/* <Button
                            // round
                            icon="facebook"
                            mode="outlined"
                            loading={loadingFB}
                            color={customGalioTheme.COLORS.FACEBOOK}
                            uppercase={false}
                            style={{
                                width: '100%',
                                marginBottom: 28,
                                borderColor: '#E0E0E0',
                            }}
                            onPress={() =>
                                _loginFacabook(
                                    this.props.navigation,
                                    this.props.needReturn,
                                )
                            }>
                            <Text
                                style={{
                                    color: 'rgba(0, 0, 0, 0.87)',
                                    fontSize: 14,
                                    fontWeight: '500',
                                }}>
                                Continue with Facebook
                            </Text>
                        </Button> */}

                        <View style={styles.signupCont}>
                            <Text style={styles.signupText}>Don't have an account?</Text>
                            <TouchableOpacity
                                style={styles.navButton}
                                onPress={() => navigation.navigate('Register')}>
                                <Text style={styles.navButtonText}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                {/* </GalioProvider> */}
            </TouchableWithoutFeedback>
        </Container>
    );
}

SignIn.propTypes = {
    actions: PropTypes.shape({
        loginError: PropTypes.bool,
        signedIn: PropTypes.bool,
    }),
};

SignIn.defaultProps = {
    actions: {
        loginError: false,
        signedIn: false,
    },
};
export default connect(authActionsSelector)(SignIn);

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.whiteText,
        flex: 1,
    },

    containerForm: {
        flexGrow: 1,
        //alignItems: 'center',
        //justifyContent: 'center',
        paddingHorizontal: 25,
        width: '100%',
    },

    logo: {
        marginTop: 40,
        marginLeft: 10,
        marginBottom: 40
      },

    inputBox: {
        width: '100%',
        //backgroundColor: colors.transparent,
        fontSize: 18,
        color: 'rgba(0, 0, 0, 0.6)',
        marginBottom: 10,
        borderColor: colors.borderColor,
        height: 45,
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
        color: colors.statusBar,
        fontSize: 16,
        fontWeight: '400',
        marginBottom: 25,
    },

    signupCont: {
        flexGrow: 1,
        flexDirection: 'row',
        // paddingHorizontal: 30,
        paddingBottom: 100,
    },
    signupText: {
        color: 'rgba(0, 0, 0, 0.87)',
        fontSize: 16,
        fontWeight: '400',
        paddingVertical: 2,
    },
    navButton: {
        width: 80,
        borderRadius: 25,
        paddingVertical: 2,
        marginLeft: 5,
    },
    navButtonText: {
        fontSize: 16,
        fontWeight: '400',
        color: colors.primary,

    },

    welcomeText: {
        //flexGrow: 1,
        justifyContent: 'flex-start',
        flexDirection: 'column',
        paddingHorizontal: 25,
        paddingVertical: 15,
    },
});
