import React, { Component } from 'react';
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
} from 'react-native';
import { Container, Icon as NBIcon } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Meteor from '../react-native-meteor';
import Logo from '../components/Logo/Logo';
import { colors, customStyle } from '../config/styles';
import { customGalioTheme } from '../config/themes';
import { LoginManager } from 'react-native-fbsdk';
import { onLoginFinished } from '../lib/FBlogin';
// import {GalioProvider, Input} from 'galio-framework';
import { Title, Button, TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
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
      showPassword: false,
    };
  }

  componentDidMount() { }

  componentWillUnmount() {
    console.log('componentWillUnmount');
  }

  validInput = overrideConfirm => {
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

  _loginFacabook = (navigation, needReturn) => {
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
          onLoginFinished(result, navigation, needReturn);
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
      });
  };

  handleSignIn = () => {
    if (this.validInput(true)) {
      const { email, password } = this.state;

      try {
        this.setState({ loading: true });
        Meteor.loginWithPassword(
          email.toLowerCase(),
          password,
          function (err, res) {
            this.setState({ loading: false });
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
              ToastAndroid.showWithGravityAndOffset(
                'Logged In Successfully',
                ToastAndroid.LONG,
                ToastAndroid.TOP,
                0,
                50,
              );
              if (this.props.needReturn) {
                this.props.navigation.goBack();
              } else {
                this.props.navigation.navigate('Home');
              }
            }
          }.bind(this),
        );       
      } catch (e) {
        console.log(e.message);
      }
    }
  };

  navigate(route) {
    this.props.navigation.navigate(route);
  }

  render() {
    console.log('render');
    return (
      <Container>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          {/* <GalioProvider theme={customGalioTheme}> */}
          <View style={styles.container} keyboardShouldPersistTaps="always">
            <StatusBar
              hidden
              backgroundColor={colors.appBackground}
              barStyle="dark-content"
            />
            <View style={{ width: '100%', alignItems: 'flex-end' }}>
              <Button mode="text">
                <NBIcon
                  name="close"
                  size={20}
                  style={{ color: 'rgba(0, 0, 0, 0.6)' }}
                />
              </Button>
            </View>
            {/* <Logo /> */}
            <Text
              style={
                (customStyle.topbarLogo,
                {
                  color: colors.primary,
                  fontSize: 50,
                  paddingHorizontal: 16,
                  marginBottom: 39,
                  marginTop: 71,
                })
              }>
              Geniee
            </Text>

            <View style={styles.welcomeText}>
              <Title style={{ fontSize: 24, marginBottom: 5 }}>Welcome,</Title>
              <Text
                style={{
                  fontSize: 16,
                  color: 'rgba(0,0,0,0.87)',
                  letterSpacing: 0.15,
                  marginBottom: 22,
                }}>
                Log in to continue
              </Text>
            </View>
            <View style={styles.containerForm}>
              {/* <Input
                  color={customGalioTheme.COLORS.INPUT_TEXT}
                  // rounded
                  placeholder="Email or Mobile No"
                  placeholderTextColor="#808080"
                  keyboardType="email-address"
                  onSubmitEditing={() => this.password.focus()}
                  onChangeText={email => this.setState({email})}
                  textContentType={'emailAddress'}
                  style={styles.inputBox}
                /> */}
              <TextInput
                mode="outlined"
                placeholder="Email"
                dense
                label="Email"
                value={this.state.email}
                onChangeText={email => this.setState({ email })}
                style={styles.inputBox}
              />
              {/* <Input
                  color={customGalioTheme.COLORS.INPUT_TEXT}
                  // rounded
                  password
                  //viewPass
                  placeholder="Password"
                  placeholderTextColor="#808080"
                  iconColor={colors.primary}
                  iconSize={24}
                  ref={input => (this.password = input)}
                  onChangeText={password => this.setState({password})}
                  textContentType={'emailAddress'}
                  style={styles.inputBox}
                /> */}
              <TextInput
                mode="outlined"
                secureTextEntry = {!this.state.showPassword}
                right={<TextInput.Icon name="eye" onPress={() => this.setState({showPassword : true})}/>}
                placeholder="Password"
                label="Password"
                value={this.state.password}
                onChangeText={password => this.setState({ password })}
                style={styles.inputBox}
              />

              <Button
                // round
                mode="contained"
                color={customGalioTheme.COLORS.PRIMARY}
                onPress={this.handleSignIn}
                style={{
                  width: '100%',
                  marginBottom: 28,
                  paddingVertical: 5,
                  paddingHorizontal: 15,
                }}
                loading={this.state.loading}>
                LOG IN
              </Button>
              <Button
                // round
                icon="facebook"
                mode="outlined"
                loading={this.state.loadingFB}
                color={customGalioTheme.COLORS.FACEBOOK}
                uppercase={false}
                style={{
                  width: '100%',
                  marginBottom: 28,
                  borderColor: '#E0E0E0',
                }}
                onPress={() =>
                  this._loginFacabook(
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
              </Button>
              <View>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('ForgotPassword')
                  }>
                  <Text style={styles.forgotPwdButton}>
                    Forgot your password?
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.signupCont}>
                <Text style={styles.signupText}>Don't have an account?</Text>
                <TouchableOpacity
                  style={styles.navButton}
                  onPress={() => this.props.navigation.navigate('Register')}>
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
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.whiteText,
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
  },

  containerForm: {
    flexGrow: 1,
    //alignItems: 'center',
    //justifyContent: 'center',
    paddingHorizontal: 25,
    width: '100%',
  },

  inputBox: {
    width: '100%',
    backgroundColor: colors.transparent,
    borderRadius: 3.5,
    paddingHorizontal: 10,
    fontSize: 16,
    color: 'rgba(0, 0, 0, 0.6)',
    marginBottom: 10,
    borderColor: colors.borderColor,
    height: 54,
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
    color: colors.primary,
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 15,
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
    // backgroundColor: customGalioTheme.COLORS.PRIMARY,
    borderRadius: 25,
    paddingVertical: 2,
    marginLeft: 5,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.primary,
    // textAlign: 'center',
    // alignSelf: 'center',
  },

  //signupButton: {
  //color: '#a51822',
  //fontSize: 16,
  //fontWeight: '500',
  //paddingVertical: 10,
  //},
  welcomeText: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    flexDirection: 'column',
    paddingHorizontal: 25,
    paddingVertical: 15,
  },
});

export default SignIn;
