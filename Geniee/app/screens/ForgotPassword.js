import Meteor from '../react-native-meteor';
import React, {Component} from 'react';
import {
  Container,
  Content,
  Button,
  Item,
  Text,
  Label,
  Header,
  Left,
  Body,
  Title,
  Icon,
  StyleProvider,
} from 'native-base';
import {
  ToastAndroid,
  TouchableOpacity,
  KeyboardAvoidingView,
  View,
  StyleSheet,
  StatusBar,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  BackHandler,
} from 'react-native';
import {hashPassword} from '../react-native-meteor/lib/utils';
import {colors} from '../config/styles';
import AsyncStorage from '@react-native-community/async-storage';
import {GalioProvider, Input, Button as GButton} from 'galio-framework';
import {customGalioTheme} from '../config/themes';
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
      setPassWord: false,
      loading:false,
    };
  }

  componentDidMount() {
    
   
  }

  componentDidAppear(){
     BackHandler.addEventListener('hardwareBackPress',  this.handleBackButton.bind(this));
  }
  handleBackButton() {
    console.log('handlebackpress');
    // this.props.navigation.navigate('Dashboard');
   this.props.navigation.navigate('Home');
    return true;
  }

  componentDidDisappear() {
    BackHandler.removeEventListener('hardwareBackPress',this.handleBackButton.bind(this));
  }

  _forgotPassword = () => {
    if (!this.state.email) {
      ToastAndroid.showWithGravityAndOffset(
        'Plaese enter email',
        ToastAndroid.LONG,
        ToastAndroid.TOP,
        0,
        50,
      );
      return;
    }
    console.log('sds');
    try {
      this.setState({loading:true});
      Meteor.call('forgotPasswordCustom', this.state.email, (err, res) => {
        this.setState({loading:false});
        if (err) {
          ToastAndroid.showWithGravityAndOffset(
            err.message,
            ToastAndroid.LONG,
            ToastAndroid.TOP,
            0,
            50,
          );
        } else {
          ToastAndroid.showWithGravityAndOffset(
            'Password Reset Code has been sent to email:' + this.state.email,
            ToastAndroid.LONG,
            ToastAndroid.TOP,
            0,
            50,
          );
          AsyncStorage.setItem('Forgot_pss_email', this.state.email);
          this.setState({setPassWord: true, email: ''});
        }
      });
    } catch (e) {
      alert(e.message);
    }
  };

  _setNewPassword = async () => {
    let email = await AsyncStorage.getItem('Forgot_pss_email');
    const {token, password, confirmPassword} = this.state;
    if (token && password && confirmPassword) {
      if (password !== confirmPassword) {
        ToastAndroid.showWithGravityAndOffset(
          'Password & ConfirmPassword do not match!!!',
          ToastAndroid.LONG,
          ToastAndroid.TOP,
          0,
          80,
        );
      } else {
        this.setState({loading:true});
        // Meteor.Accounts.resetPassword(token,password,(err,res)=>{
        Meteor.call('setPasswordCustom', email, token, password, (err, res) => {
          this.setState({loading:false});
          if (!err) {
            ToastAndroid.showWithGravityAndOffset(
              'Password Reset Successfully!!',
              ToastAndroid.LONG,
              ToastAndroid.TOP,
              0,
              50,
            );
            this.setState({setPassWord: false});
            this.props.navigation.goBack();
          } else {
            ToastAndroid.showWithGravityAndOffset(
              err.reason,
              ToastAndroid.LONG,
              ToastAndroid.TOP,
              0,
              50,
            );
          }
        });
      }
    } else {
      ToastAndroid.showWithGravityAndOffset(
        'Please type 6-digit Code and Password',
        ToastAndroid.LONG,
        ToastAndroid.TOP,
        0,
        50,
      );
    }
  };

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <GalioProvider theme={customGalioTheme}>
          <Container style={styles.container}>
            <Header
              androidStatusBarColor={colors.statusBar}
              style={{backgroundColor: '#094c6b'}}>
              <Left>
                <Button
                  transparent
                  onPress={() => {
                    this.props.navigation.navigate('Home');
                  }}>
                  <Icon style={{color: '#ffffff'}} name="arrow-back" />
                </Button>
              </Left>
              <Body>
                <Title style={styles.screenHeader}>Forgot Password</Title>
              </Body>
            </Header>

            {this.state.setPassWord === false ? (
              <View style={styles.contentContainer}>
                <KeyboardAvoidingView style={{padding: 20}}>
                  {/*<Text style={{fontSize: 28, fontWeight: 'bold', marginBottom: 10, color: colors.primaryText}}>Forgot password</Text>*/}
                  <Text style={{marginBottom: 14, color: colors.primaryText}}>
                    Please enter your email address. You will receive a 6-digit
                    code to Reset Password
                  </Text>
                  {/*<Item floatingLabel style={{marginBottom: 30}}>
                                <Label>Email address</Label>
                                <Input onChangeText={(email) => this.setState({email})}/>
                            </Item>*/}

                  <View>
                    <Input
                    placeholder="Email Address"
                      color={customGalioTheme.COLORS.INPUT_TEXT}
                      keyboardType="email-address"
                      onChangeText={email => this.setState({email})}
                      textContentType={'emailAddress'}
                    />
                  </View>

                  <View>
                    {/* <TouchableOpacity  style={styles.button}  onPress={() => {
                                    this._forgotPassword()
                                }}>
                                    <Text style={styles.buttonText}>Send</Text>
                                </TouchableOpacity> */}
                    <GButton
                      onPress={() => {
                        this._forgotPassword();
                      }}
                      style={{width: '100%', marginVertical: 20}}
                      loading={this.state.loading}
                      disabled={this.state.loading}>
                      Send
                    </GButton>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingTop: 20,
                      paddingBottom: 20,
                    }}>
                    <Button
                      transparent
                      onPress={() => {
                        this.setState({setPassWord: true});
                      }}>
                      <Text style={styles.priText}>
                        Already have code, please click here
                      </Text>
                    </Button>
                  </View>
                </KeyboardAvoidingView>
              </View>
            ) : (
              <View style={styles.contentContainer}>
                <KeyboardAvoidingView style={{padding: 20}}>
                  {/*<Text style={{fontSize: 28, fontWeight: 'bold', marginBottom: 10, color: colors.primaryText,}}>Password reset</Text>*/}
                  <Text style={{marginBottom: 14, color: colors.primaryText}}>
                    Please Enter the Password Reset code sent to your email.
                  </Text>
                  {/*<Item floatingLabel style={{marginBottom: 30}}>
                                <Label>Token(6-digit Code)</Label>
                                <Input onChangeText={(token) => this.setState({token})}
                                    keyboardType='phone-pad'
                                />
                            </Item>*/}

                  <View>
                    <Input
                      color={customGalioTheme.COLORS.INPUT_TEXT}
                      placeholder="Token(6-digit Code)"
                      keyboardType="phone-pad"
                      onChangeText={token => this.setState({token})}
                    />
                  </View>

                  <View>
                    <Input
                      color={customGalioTheme.COLORS.INPUT_TEXT}
                      placeholder="Password"
                      Password
                      onChangeText={password => this.setState({password})}
                    />
                  </View>

                  <View>
                    <Input
                      color={customGalioTheme.COLORS.INPUT_TEXT}
                      Password
                      placeholder="Confirm Password"
                      onChangeText={confirmPassword =>
                        this.setState({confirmPassword})
                      }
                    />
                  </View>

                  {/*<Item floatingLabel style={{marginBottom: 30}}>
                            <Label>Password</Label>
                                <Input onChangeText={(password) => this.setState({password})}
                                />
                            </Item>
                            <Item floatingLabel style={{marginBottom: 30}}>
                                <Label>Confirm Password</Label>
                                <Input onChangeText={(confirmPassword) => this.setState({confirmPassword})}
                                />
                            </Item>*/}
                  <View>
                    {/*  <TouchableOpacity  style={styles.button}  onPress={() => {
                                    this._setNewPassword()
                                }}>
                                    <Text style={styles.buttonText}>Set New Password</Text>
                                </TouchableOpacity>*/}

                    <GButton
                      onPress={() => {
                        this._setNewPassword();
                      }}
                      style={{width: '100%', marginVertical: 20}}
                      loading={this.state.loading}
                      disabled={this.state.loading}>
                      Set New Password
                    </GButton>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingTop: 20,
                      paddingBottom: 20,
                    }}>
                    <Button
                      transparent
                      onPress={() => {
                        this.setState({setPassWord: false});
                      }}>
                      <Text style={styles.priText}>
                        Resend code, click here
                      </Text>
                    </Button>
                  </View>
                </KeyboardAvoidingView>
              </View>
            )}
          </Container>
        </GalioProvider>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.appBackground,
    width: '100%',
    fontFamily: `Source Sans Pro`,
  },
  contentContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  screenHeader: {
    fontSize: 20,
    color: '#ffffff',
  },
  inputBox: {
    flexDirection: 'row',
    width: '100%',
    height: 40,
    backgroundColor: colors.inputBackground,
    borderRadius: 25,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.whiteText,
    marginVertical: 5,
  },
  priText: {
    color: colors.primaryText,
    fontSize: 16,
    fontWeight: '700',
    paddingVertical: 2,
  },
  button: {
    width: '100%',
    backgroundColor: colors.buttonPrimaryBackground,
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
});

export default ForgotPassword;