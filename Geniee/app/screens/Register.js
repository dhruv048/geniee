import React, { Component, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  BackHandler,
  TouchableWithoutFeedback,
  Keyboard,
  ToastAndroid,
  Dimensions,
  Modal,
  ScrollView,
} from 'react-native';
import { Button as NBButton, Icon as NBIcon, Row } from 'native-base';
import { RadioGroup } from 'react-native-btr';
import Icon from 'react-native-vector-icons/Feather';
import Meteor from '../react-native-meteor';
import Logo from '../components/Logo/Logo';
import { colors, customStyle, variables } from '../config/styles';
import { userType } from '../config/settings';
import { Container, Content, Item, Label } from 'native-base';
import LocationPicker from '../components/LocationPicker';
import { goBack, goToRoute } from '../Navigation';
import AutoHeightWebView from 'react-native-autoheight-webview';
import { privacyPolicy } from '../lib/PrivacyPolicy';
import { TermsCondition } from '../lib/Terms&Condition';
import { customGalioTheme } from '../config/themes';
import { Title, Button as RNPButton, TextInput, Checkbox } from 'react-native-paper';
import useRegisterForm from '../hooks/useRegisterForm';
import connect from '../react-native-meteor/components/ReactMeteorData';
import { authActionsSelector } from '../store/selectors';
import authHandlers from '../store/services/auth/handlers';

const Register = ({ navigation }) => {

  const { values, handleInputChange, validateRegisterForm, resetRegisterForm } = useRegisterForm();

  const validateWithPassword = () => {
    let isValidConfirmPassword = true;
    if (values.password.value != values.confirmPassword.value) {
      isValidConfirmPassword = false;
    }
    return isValidConfirmPassword;
  }

  const handleCreateAccount = () => {
    if (validateRegisterForm()) {
      ToastAndroid.showWithGravityAndOffset(
        'Please fill all required field',
        ToastAndroid.LONG,
        ToastAndroid.TOP,
        0,
        50,
      );
    }
    else {
      if (validateWithPassword()) {
        if (values.termsChecked.value) {
          let user = {
            password: values.password.value,
            username: values.contact.value,
            email: values.email.value,
            createdAt: new Date(),
            profile: {
              name: capitalzeFirstLetter(values.name.value),
              contactNo: values.contact.value,
              profileImage: null,
              location: values.location.value,
              primaryEmail: values.email.value,
              email: values.email.value,
            },
          };
          handleInputChange('loading', true);
          authHandlers.handleSignUp({ user }, (err, res) => {
            handleInputChange('loading', false);
            if (err) {
              console.log(err.reason);
              ToastAndroid.showWithGravityAndOffset(
                err.reason,
                ToastAndroid.LONG,
                ToastAndroid.TOP,
                0,
                50,
              );
            } else {
              // hack because react-native-meteor doesn't login right away after sign in
              console.log('Reslut from register' + res);
              ToastAndroid.showWithGravityAndOffset(
                'Registered Successfully',
                ToastAndroid.LONG,
                ToastAndroid.TOP,
                0,
                50,
              );
              this.props.navigation.navigate('SignIn');
            }
          });
        } else {
          ToastAndroid.showWithGravityAndOffset(
            'Please read & accept Terms & Conditions.',
            ToastAndroid.LONG,
            ToastAndroid.TOP,
            0,
            50,
          );
        }
      } else {
        ToastAndroid.showWithGravityAndOffset(
          'Password and Confirm Password mismatch',
          ToastAndroid.LONG,
          ToastAndroid.TOP,
          0,
          50,
        );
      }
    }
  }

  const _updateUsersAgreeStatus = () => {
    if (this.mounted) {
      let termsChecked = values.termsChecked.value;
      termsChecked = !termsChecked;
      handleInputChange('termsChecked', termsChecked);
    }
  };

  const handleLocation = (data, Detail) => {
    setValues({ location: data });
  };

  const handleOnLocationSelect = (location) => {
    handleInputChange('location', location.formatted_address);
    handleInputChange('pickLocation', false);
  }

  const closePickLocation = () => {
    handleInputChange('pickLocation', false);
  }
  //const { location } = this.state;
  return (
    <Container>
      <StatusBar
        backgroundColor={colors.appBackground}
        barStyle="dark-content"
      />
      <Content style={{ backgroundColor: colors.appBackground }}>
        <TouchableWithoutFeedback
          onPress={Keyboard.dismiss}
          accessible={false}>
          <View style={{ paddingTop: 0 }}>
            {/* <Logo />*/}
            <View style={{ width: '100%', alignItems: 'flex-end' }}>
              <RNPButton mode="text">
                <NBIcon
                  name="close"
                  size={20}
                  style={{ color: 'rgba(0, 0, 0, 0.6)' }}
                />
              </RNPButton>
            </View>

            <View style={styles.welcomeText}>
              <Title
                style={{
                  fontSize: 24,
                  color: 'rgba(0, 0, 0, 0.87)',
                  marginBottom: 5,
                  marginTop: 71,
                }}>
                Welcome to Geniee,
              </Title>
              <Text
                style={{
                  fontSize: 16,
                  color: 'rgba(0, 0, 0, 0.87)',
                  marginBottom: 28,
                }}>
                Sign up with email
              </Text>
            </View>
            <View style={styles.containerRegister}>
              <TextInput
                mode="outlined"
                color={customGalioTheme.COLORS.INPUT_TEXT}
                placeholder="First Name"
                placeholderTextColor="#808080"
                name="firstName"
                value={values.firstName.value}
                onChangeText={(value) => handleInputChange('firstName', value)}
                //onSubmitEditing={() => values.middleName.focus()}
                style={styles.inputBox}
              />
              <TextInput
                mode="outlined"
                color={customGalioTheme.COLORS.INPUT_TEXT}
                placeholder="Middle Name"
                placeholderTextColor="#808080"
                name="middleName"
                value={values.middleName.value}
                onChangeText={(value) => handleInputChange('middleName', value)}
                //onSubmitEditing={() => values.lastName.focus()}
                style={styles.inputBox}
              />
              <TextInput
                mode="outlined"
                color={customGalioTheme.COLORS.INPUT_TEXT}
                placeholder="Last Name"
                placeholderTextColor="#808080"
                name="lastName"
                value={values.lastName.value}
                onChangeText={(value) => handleInputChange('lastName', value)}
                //onSubmitEditing={() => values.email.focus()}
                style={styles.inputBox}
              />

              <TextInput
                mode="outlined"
                color={customGalioTheme.COLORS.INPUT_TEXT}
                placeholder="Email"
                placeholderTextColor="#808080"
                keyboardType="Email-Address"
                value={values.email.value}
                //ref={input => (values.email.value = input)}
                onSubmitEditing={() => values.contact.focus()}
                onChangeText={(value) => handleInputChange('email', value)}
                style={styles.inputBox}
              />

              <TextInput
                mode="outlined"
                color={customGalioTheme.COLORS.INPUT_TEXT}
                placeholder="Mobile No"
                placeholderTextColor="#808080"
                keyboardType="phone-pad"
                value={values.contact.value}
                onChangeText={(value) => handleInputChange('contact', value)}
                style={styles.inputBox}
              />

              <TextInput
                mode="outlined"
                right={<TextInput.Icon name="map-marker" />}
                family="feather"
                iconSize={20}
                iconColor={colors.primary}
                color={customGalioTheme.COLORS.INPUT_TEXT}
                placeholder="Location"
                placeholderTextColor="#808080"
                value={values.location.value}
                onFocus={() => handleInputChange('pickLocation', true)}
                style={styles.inputBox}
              />
              {/*</View>*/}
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
                ref={input => (values.password = input)}
                //onSubmitEditing={() => values.confirmPassword.focus()}
                onChangeText={(value) => handleInputChange('password', value)}
                style={styles.inputBox}
              />
              <TextInput
                mode="outlined"
                secureTextEntry={!values.showConfirmPassword.value}
                right={
                  <TextInput.Icon
                    name="eye"
                    onPress={() => handleInputChange('showConfirmPassword', !values.showConfirmPassword)}
                  />
                }
                iconColor={colors.primary}
                iconSize={24}
                color={customGalioTheme.COLORS.INPUT_TEXT}
                placeholder="Confirm Password"
                placeholderTextColor="#808080"
                value={values.confirmPassword.value}
                ref={input => (values.confirmPassword = input)}
                onChangeText={(value) => handleInputChange('confirmPassword', value)}
                onSubmitEditing={validateWithPassword}
                style={styles.inputBox}
              />
              <RNPButton
                mode='contained'
                onPress={handleCreateAccount}
                style={{
                  width: '100%',
                  marginBottom: 35,
                  borderRadius: 4,
                  height: 50,
                }}
                loading={values.loading.value}
                disabled={values.loading.value}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: '500',
                    color: colors.whiteText,
                  }}>
                  SIGN UP
                </Text>
              </RNPButton>
            </View>

            <View style={styles.signupCont}>
              <Text style={styles.signupText}>
                Already have an account?
              </Text>
              <TouchableOpacity
                style={styles.navButton}
                onPress={() => navigation.navigate('SignIn')}>
                <Text style={styles.navButtonText}>Login</Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                paddingTop: 16,
                paddingBottom: 16,
                color: '#8E8E8E',
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignItems: 'flex-end',
                marginLeft: 16,
              }}>
              <Checkbox
                status={values.termsChecked.value ? 'checked' : 'unchecked'}
                onPress={() => _updateUsersAgreeStatus}
              />
              <Text style={{ color: 'rgba(0, 0, 0, 0.87)', fontSize: 12 }}>
                By proceeding, you agree to our{' '}
              </Text>

              <TouchableOpacity>
                <Text
                  style={{ color: colors.primaryText, fontSize: 12 }}
                  onPress={() => handleInputChange('termsModal', true)}>
                  Terms of Use
                </Text>
              </TouchableOpacity>

              <Text style={{ color: 'rgba(0, 0, 0, 0.87)', fontSize: 12 }}>
                {' '}
                and confirm you have read our{' '}
              </Text>

              <TouchableOpacity>
                <Text
                  style={{ color: colors.primaryText, fontSize: 12 }}
                  onPress={() => handleInputChange('privacyModal', true)}>
                  Privacy Policy.
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Content>
      {/*PRIVACY POLICY MODAL START */}
      <Modal
        style={customStyle.modal}
        animationType="slide"
        // transparent={true}
        visible={values.privacyModal.value}
        onRequestClose={() => handleInputChange('privacyModal', false)}>
        <View style={customStyle.modalDialog}>
          <View style={customStyle.modalHeader}>
            <NBButton
              transparent
              onPress={() => handleInputChange('privacyModal', false)}>
              <Icon name={'x'} size={24} color={'#2E2E2E'} />
            </NBButton>
            <View style={[customStyle.modalTitleHolder, { marginLeft: 30 }]}>
              <Text style={customStyle.modalTitle}>Privacy Policy</Text>
              <Text note />
            </View>
          </View>

          <ScrollView style={customStyle.modalScrollView}>
            <View style={{ paddingBottom: 30 }}>
              <AutoHeightWebView
                style={{
                  width: Dimensions.get('window').width - 60,
                  margin: 10,
                  marginTop: 10,
                }}
                customStyle={''}
                onSizeUpdated={size => console.log(size.height)}
                source={{ html: privacyPolicy.content }}
              />
            </View>
          </ScrollView>
        </View>
      </Modal>
      {/* PRIVACY POLICY MODAL STOP */}

      {/*TERMS&CONDITION MODAL START */}
      <Modal
        style={customStyle.modal}
        animationType="slide"
        // transparent={true}
        visible={values.termsModal}
        onRequestClose={() => handleInputChange('termsModal', false)}>
        <View style={customStyle.modalDialog}>
          <View style={customStyle.modalHeader}>
            <NBButton
              transparent
              onPress={() => handleInputChange('termsModal', false)}>
              <Icon name={'x'} size={24} color={'#2E2E2E'} />
            </NBButton>
            <View style={[customStyle.modalTitleHolder, { marginLeft: 30 }]}>
              <Text style={customStyle.modalTitle}>Terms and Condition</Text>
              <Text note />
            </View>
          </View>

          <ScrollView style={customStyle.modalScrollView}>
            <View style={{ paddingBottom: 30 }}>

              <AutoHeightWebView
                style={{
                  width: Dimensions.get('window').width - 60,
                  margin: 10,
                  marginTop: 10,
                }}
                customStyle={''}
                onSizeUpdated={size => console.log(size.height)}
                source={{ html: TermsCondition.content }}
              />
            </View>
          </ScrollView>
        </View>
      </Modal>
      {/* TERMS&CONDITION MODAL STOP */}
      <LocationPicker
        close={closePickLocation}
        onLocationSelect={handleOnLocationSelect}
        modalVisible={values.pickLocation.value}
      />
    </Container>
  );
}

export default connect(authActionsSelector)(Register);

const capitalzeFirstLetter = str => {
  var splitStr = str.toLowerCase().split(' ');
  for (var i = 0; i < splitStr.length; i++) {
    // You do not need to check if i is larger than splitStr length, as your for does that for you
    // Assign it back to the array
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  // Directly return the joined string
  return splitStr.join(' ');
};


const GooglePlaceSerachStyle = {
  textInputContainer: {
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0)',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    padding: 0,
  },
  description: {
    fontWeight: 'bold',
    color: colors.appLayout,
  },
  predefinedPlacesDescription: {
    color: colors.appLayout,
  },
  textInput: {
    width: 300,
    backgroundColor: colors.inputBackground,
    borderRadius: 25,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.whiteText,
    // marginVertical: 5,
    height: 40,
    margin: 0,
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
  },
  listView: {
    flex: 1,
  },
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.whiteText,
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  content: {
    backgroundColor: colors.appBackground,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  containerRegister: {
    //  flexGrow: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    marginHorizontal: 25,
    marginTop: 5,
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

  radioView: {
    //flexGrow: 1,
    //alignItems: 'flex-end',
    justifyContent: 'center',
    //paddingVertical: 2,
    flexDirection: 'row',
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

  signupCont: {
    flexGrow: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingVertical: 10,
    flexDirection: 'row',
  },
  signupText: {
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
  welcomeText: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    flexDirection: 'column',
    paddingHorizontal: 25,
  },
});