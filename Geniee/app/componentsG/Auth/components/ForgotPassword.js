import Meteor from '../../../react-native-meteor';
import React, { Component } from 'react';
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
  TouchableWithoutFeedback,
  Keyboard,
  BackHandler,
} from 'react-native';
import { hashPassword } from '../../../react-native-meteor/lib/utils';
import { colors } from '../../../config/styles';
import AsyncStorage from '@react-native-community/async-storage';
//import { GalioProvider, Input, Button as GButton } from 'galio-framework';
import { customGalioTheme } from '../../../config/themes';
import UseForgetPasswordForm from '../../../hooks/useForgetPasswordForm';
import { mapValues } from 'lodash';
//import Icon from 'react-native-vector-icons/dist/FontAwesome';
import { Button as RNPButton, TextInput } from 'react-native-paper';
import { loggedUserSelector } from '../../../store/selectors/auth';
import authHandlers from '../../../store/services/auth/handlers';
import { connect } from 'react-redux';

const ForgotPassword = ({loggedUser, navigation}) => {

  const { values, handleInputChange, validateForgetPasswordForm, resetForgetPasswordForm } = UseForgetPasswordForm();

  const _forgotPassword = () => {
    if (!values.email.value) {
      ToastAndroid.showWithGravityAndOffset(
        'Plaese enter email',
        ToastAndroid.LONG,
        ToastAndroid.TOP,
        0,
        50,
      );
      return;
    }
    try {
      handleInputChange('loading', true);
      authHandlers.forgetPassword(values.email.value, (res,err) => {
        handleInputChange('loading', false);
        if (res === true) {
          ToastAndroid.showWithGravityAndOffset(
            'Password Reset Code has been sent to email:' + values.email.value,
            ToastAndroid.LONG,
            ToastAndroid.TOP,
            0,
            50,
          );
          //AsyncStorage.setItem('Forgot_pss_email', values.email.value);
          handleInputChange('setPassword', true);
          handleInputChange('email', '');
        } else {
          ToastAndroid.showWithGravityAndOffset(
            err.message,
            ToastAndroid.LONG,
            ToastAndroid.TOP,
            0,
            50,
          );
        }
      });
    } catch (e) {
      alert(e.message);
    }
    handleInputChange('loading', false);
  };

  const _setNewPassword = () => {
    debugger;
    console.log('This is logged user :'+loggedUser)
    //let email = await AsyncStorage.getItem('Forgot_pss_email');
    let email = loggedUser.emails[0].address;
    if (values.token.value && values.password.value && values.confirmPassword.value) {
      if (values.password.value !== values.confirmPassword.value) {
        ToastAndroid.showWithGravityAndOffset(
          'Password & ConfirmPassword do not match!!!',
          ToastAndroid.LONG,
          ToastAndroid.TOP,
          0,
          80,
        );
      } else {
        handleInputChange('loading', true);
        authHandlers.changeNewPassword(email, values.token.value, values.password.value, (err, res) => {
          handleInputChange('loading', false);
          if (res === true) {
            ToastAndroid.showWithGravityAndOffset(
              'Password Reset Successfully!!',
              ToastAndroid.LONG,
              ToastAndroid.TOP,
              0,
              50,
            );
            handleInputChange('setPassword', false)
            navigation.navigate('SignIn')
          } else {
            ToastAndroid.showWithGravityAndOffset(
              err.reason,
              ToastAndroid.LONG,
              ToastAndroid.TOP,
              0,
              50,
            );
          }
          handleInputChange('loading', false);
        });
      }
    } else {
      ToastAndroid.showWithGravityAndOffset(
        'Please Enter Valid 6-digit Code and Password',
        ToastAndroid.LONG,
        ToastAndroid.TOP,
        0,
        50,
      );
    }
    handleInputChange('loading', false);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <Container style={styles.container}>
        <Header
          androidStatusBarColor={colors.statusBar}
          style={{ backgroundColor: '#4d94ff' }}>
          <Left>
            <Button
              transparent
              onPress={() => {
                navigation.navigate('Home');
              }}>
              <Icon style={{ color: '#ffffff' }} name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title style={styles.screenHeader}>Forgot Password</Title>
          </Body>
        </Header>

        {values.setPassword.value === false ? (
          <View style={styles.contentContainer}>
            <KeyboardAvoidingView style={{ padding: 20 }}>
              <Title
                style={{
                  fontSize: 24,
                  color: 'rgba(0, 0, 0, 0.87)',
                  marginBottom: 5,
                }}>
                Forgot Password
              </Title>
              {/*<Text style={{fontSize: 28, fontWeight: 'bold', marginBottom: 10, color: colors.primaryText}}>Forgot password</Text>*/}
              <Text style={{ marginBottom: 14, color: colors.text_muted }}>
                Please enter your email address. You will receive a 6-digit
                code to Reset Password
              </Text>
              <View>
                <TextInput
                  mode="outlined"
                  color={customGalioTheme.COLORS.INPUT_TEXT}
                  placeholder="Email"
                  placeholderTextColor="#808080"
                  keyboardType="Email-Address"
                  value={values.email.value}
                  onChangeText={(value) => handleInputChange('email', value)}
                  style={styles.inputBox}
                />
              </View>
              <View>
                <RNPButton
                  mode='contained'
                  onPress={() => _forgotPassword()}
                  style={{
                    width: '100%',
                    marginBottom: 10,
                    borderRadius: 4,
                    height: 36,
                  }}
                  loading={values.loading.value}
                  disabled={values.loading.value}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '500',
                      color: colors.whiteText,
                    }}>
                    Send
                  </Text>
                </RNPButton>
              </View>

              <View style={styles.codeCont}>
                <Text style={styles.codeText}>Already have code?</Text>
                <TouchableOpacity
                  style={styles.navButton}
                  onPress={() => handleInputChange('setPassword', true)}
                >
                  <Text style={styles.navButtonText}>click here</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </View>
        ) : (
          <View style={styles.contentContainer}>
            <KeyboardAvoidingView style={{ padding: 20 }}>
              {/*<Text style={{fontSize: 28, fontWeight: 'bold', marginBottom: 10, color: colors.primaryText,}}>Password reset</Text>*/}
              <Text style={{ marginBottom: 14, color: colors.primaryText }}>
                Please Enter the Password Reset code sent to your email.
              </Text>
              <TextInput
                mode="outlined"
                color={customGalioTheme.COLORS.INPUT_TEXT}
                placeholder="Token(6-digit Code)"
                keyboardType="phone-pad"
                placeholderTextColor="#808080"
                value={values.token.value}
                onChangeText={(value) => handleInputChange('token', value)}
                style={styles.inputBox}
              />
              <TextInput
                mode="outlined"
                color={customGalioTheme.COLORS.INPUT_TEXT}
                secureTextEntry={!values.showPassword.value}
                right={
                  <TextInput.Icon
                    name="eye"
                    onPress={() => handleInputChange('showPassword', !values.showPassword.value)}
                  />
                }
                iconColor={colors.primary}
                iconSize={24}
                placeholder="Password"
                placeholderTextColor="#808080"
                value={values.password.value}
                onChangeText={(value) => handleInputChange('password', value)}
                style={styles.inputBox}
              />
              <TextInput
                mode="outlined"
                secureTextEntry={!values.showConfirmPassword.value}
                right={
                  <TextInput.Icon
                    name="eye"
                    onPress={() => handleInputChange('showConfirmPassword', !values.showConfirmPassword.value)}
                  />
                }
                iconColor={colors.primary}
                iconSize={24}
                color={customGalioTheme.COLORS.INPUT_TEXT}
                placeholder="Confirm Password"
                placeholderTextColor="#808080"
                value={values.confirmPassword.value}
                onChangeText={(value) => handleInputChange('confirmPassword', value)}
                style={styles.inputBox}
              />
              <View>
                <RNPButton
                  mode='contained'
                  onPress={() =>_setNewPassword()}
                  style={{ width: '100%', marginVertical: 20 }}
                  loading={values.loading.value}
                  disabled={values.loading.value}>
                  Set New Password
                </RNPButton>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingTop: 20,
                  paddingBottom: 20,
                }}>
                <RNPButton
                  transparent
                  onPress={() => handleInputChange('setPassWord', false)}
                >
                  <Text style={styles.priText}>
                    Resend code, click here
                  </Text>
                </RNPButton>
              </View>
            </KeyboardAvoidingView>
          </View>
        )}
        </Container>
      </TouchableWithoutFeedback>
  );
};

export default connect(loggedUserSelector)(ForgotPassword);

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
    width: '100%',
    backgroundColor: colors.transparent,
    borderRadius: 3.5,
    paddingHorizontal: 10,
    fontSize: 16,
    color: 'rgba(0, 0, 0, 0.6)',
    borderColor: colors.borderColor,
    height: 54,
    marginBottom: 10,
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
  codeCont: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingVertical: 10,
    flexDirection: 'row',
  },
  codeText: {
    color: 'rgba(0, 0, 0, 0.87);',
    fontSize: 16,
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
});

