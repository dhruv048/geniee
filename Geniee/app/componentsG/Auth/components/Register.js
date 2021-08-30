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
  Image
} from 'react-native';
import { Button as NBButton, Icon as NBIcon, Row } from 'native-base';
import { RadioGroup } from 'react-native-btr';
import Icon from 'react-native-vector-icons/Feather';
import Meteor from '../../../react-native-meteor';
import Logo from '../../../components/Logo/Logo';
import { colors, customStyle, variables } from '../../../config/styles';
import { userType } from '../../../config/settings';
import { Container, Content, Item, Label } from 'native-base';
import LocationPicker from '../../../components/LocationPicker';
import { goBack, goToRoute } from '../../../Navigation';
import AutoHeightWebView from 'react-native-autoheight-webview';
import { privacyPolicy } from '../../../lib/PrivacyPolicy';
import { TermsCondition } from '../../../lib/Terms&Condition';
import { customGalioTheme } from '../../../config/themes';
import { Title, Button as RNPButton, TextInput, Checkbox } from 'react-native-paper';
import useRegisterForm from '../../../hooks/useRegisterForm';
import connect from '../../../react-native-meteor/components/ReactMeteorData';
import authHandlers from '../../../store/services/auth/handlers';
import AddService from '../../../screens/services/AddService';
import BusinessForm from '../../Merchant/component/BusinessForm';

const Register = ({ navigation }) => {

  const { values, handleInputChange, validateRegisterForm, resetRegisterForm } = useRegisterForm();
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [privacyModal, setprivacyModal] = useState(false);
  const [termsModal, settermsModal] = useState(false);
  const [showPassword, setshowPassword] = useState(false);
  const [showConfirmPassword, setshowConfirmPassword] = useState(false);

  // const validateWithPassword = () => {
  //   let isValidConfirmPassword = true;
  //   if (values.password.value != values.confirmPassword.value) {
  //     isValidConfirmPassword = false;
  //   }
  //   return isValidConfirmPassword;
  // }

  const handleCreateAccount = () => {
    if (!validateRegisterForm() && isPasswordValid && isEmailValid) {
      let user = {
        firstName: values.firstName.value,
        lastName: values.lastName.value,
        email: values.email.value,
        password: values.password.value
      }
      navigation.navigate('AddressDetail', { userData: user });
    }
  }

  // const _updateUsersAgreeStatus = () => {
  //   let termsChecked = values.termsChecked.value;
  //   termsChecked = !termsChecked;
  //   handleInputChange('termsChecked', termsChecked);
  // };

  const handlePasswordValidation = (value) => {
    const passwordValidator = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
    if (passwordValidator.test(value)) {
      setIsPasswordValid(true);
    } else {
      setIsPasswordValid(false);
    }
    handleInputChange('password', value);
  }

  const handleEmailValidation = (value) => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (emailRegex.test(value)) {
      setIsEmailValid(true);
    } else {
      setIsEmailValid(false);
    }
    handleInputChange('email', value);
  }

  return (
    <Container>
      <Content style={{ backgroundColor: colors.appBackground }}>
        <TouchableWithoutFeedback
          onPress={Keyboard.dismiss}
          accessible={false}>
          <View style={{ paddingTop: 0 }}>
            {/* <Logo />*/}
            <View style={styles.logo}>
              <Image style={styles.logoImage} source={require('Geniee/app/images/logoApp.png')} />
            </View>

            <View style={styles.welcomeText}>
              <Text
                style={styles.textHeader}>
                Let's create your account,
              </Text>
              <Text
                style={styles.textSubHeader}>
                A step to making your wish come true
              </Text>
            </View>
            <View style={styles.containerRegister}>
              <View style={styles.textInputNameView}>
                <TextInput
                  mode="outlined"
                  color={customGalioTheme.COLORS.INPUT_TEXT}
                  placeholder="First Name"
                  placeholderTextColor="#808080"
                  name="firstName"
                  value={values.firstName.value}
                  onChangeText={(value) => handleInputChange('firstName', value)}
                  style={styles.textInputNameBox}
                  theme={{ roundness: 6 }}
                  error={values.firstName.error}
                />
                <TextInput
                  mode="outlined"
                  color={customGalioTheme.COLORS.INPUT_TEXT}
                  placeholder="Last Name"
                  placeholderTextColor="#808080"
                  name="lastName"
                  value={values.lastName.value}
                  onChangeText={(value) => handleInputChange('lastName', value)}
                  style={styles.textInputNameBox}
                  theme={{ roundness: 6 }}
                  error={values.lastName.error}
                />
              </View>
              <TextInput
                mode="outlined"
                color={customGalioTheme.COLORS.INPUT_TEXT}
                placeholder="user@gmail.com"
                placeholderTextColor="#808080"
                keyboardType="email-address"
                value={values.email.value}
                onChangeText={(value) => handleEmailValidation(value)}
                style={styles.inputBox}
                theme={{ roundness: 6 }}
                error={values.email.value.length > 0 ? !isEmailValid : values.email.error}
              />
              <TextInput
                mode="outlined"
                color={customGalioTheme.COLORS.INPUT_TEXT}
                secureTextEntry={!showPassword}
                right={
                  <TextInput.Icon
                    name="eye"
                    onPress={() => setshowPassword(!showPassword)}
                  />
                }
                iconColor={colors.primary}
                iconSize={24}
                placeholder="Password"
                placeholderTextColor="#808080"
                value={values.password.value}
                onChangeText={(value) => handlePasswordValidation(value)}
                style={styles.inputBox}
                theme={{ roundness: 6 }}
                error={values.password.value.length > 0 ? !isPasswordValid : values.password.error}
              />
              {/* <TextInput
                mode="outlined"
                color={customGalioTheme.COLORS.INPUT_TEXT}
                secureTextEntry={!values.showConfirmPassword.value}
                right={
                  <TextInput.Icon
                    name="eye"
                    onPress={() => handleInputChange('showConfirmPassword', !values.showConfirmPassword.value)}
                  />
                }
                iconColor={colors.primary}
                iconSize={24}
                placeholder="Confirm Password"
                placeholderTextColor="#808080"
                value={values.confirmPassword.value}
                onChangeText={(value) => handleInputChange('confirmPassword', value)}
                //onSubmitEditing={validateWithPassword}
                style={styles.inputBox}
                theme={{ roundness: 6 }}
                error={values.confirmPassword.error}
              /> */}
              <View style={{ marginBottom: 15 }}>
                {isPasswordValid ?
                  <Text style={{ color: 'green' }}>At least 8 character. At least 1 numerals.</Text> :
                  <Text>At least 8 character. At least 1 numerals.</Text>}
                {isPasswordValid ? <Text style={{ color: 'green' }}>A upper and lower character.</Text> :
                  <Text>A upper and lower character.</Text>}
              </View>
              <View
                style={styles.textTermsCondition}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ color: 'rgba(0, 0, 0, 0.87)', fontSize: 12 }}>
                    Signing up means you agree with all the {' '}
                  </Text>

                  <TouchableOpacity>
                    <Text
                      style={{ color: colors.primaryText, fontSize: 12 }}
                      onPress={() => handleInputChange('termsModal', true)}>
                      terms & condition
                    </Text>
                  </TouchableOpacity>
                </View>

                <Text style={{ color: 'rgba(0, 0, 0, 0.87)', fontSize: 12, marginLeft: '35%' }}>
                  {' '}
                  set by geniee{' '}
                </Text>
              </View>
              <RNPButton
                mode='contained'
                uppercase={false}
                onPress={handleCreateAccount}
                style={styles.btnContinue}
              >
                <Text
                  style={styles.btnContinueText}>
                  Continue
                </Text>
                <Icon style={{ color: '#ffffff', fontSize: 18 }} name="arrow-right" />
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
          </View>
        </TouchableWithoutFeedback>
      </Content>
      {/*PRIVACY POLICY MODAL START */}
      <Modal
        style={customStyle.modal}
        animationType="slide"
        // transparent={true}
        visible={privacyModal}
        onRequestClose={() => setprivacyModal(false)}>
        <View style={customStyle.modalDialog}>
          <View style={customStyle.modalHeader}>
            <NBButton
              transparent
              onPress={() => setprivacyModal(false)}>
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
        visible={termsModal}
        onRequestClose={() => setTermsModal(false)}>
        <View style={customStyle.modalDialog}>
          <View style={customStyle.modalHeader}>
            <NBButton
              transparent
              onPress={() => setTermsModal(false)}>
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
    </Container>
  );
}

export default Register;

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
  },
  content: {
    backgroundColor: colors.appBackground,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  containerRegister: {
    marginHorizontal: 25,
    marginTop: 5,
  },

  logo: {
    marginTop: 30,
    marginLeft: 10,
    marginBottom: 40
  },

  logoImage: {
    height: 40,
    width: 80,
    position: 'absolute'
  },

  textHeader: {
    fontSize: 20,
    color: 'rgba(0, 0, 0, 0.87)',
    marginBottom: 5,
    marginTop: 50,
    fontWeight: 'bold'
  },

  textSubHeader: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.87)',
    marginBottom: 15,
  },
  textInputNameView:
  {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },

  textInputNameBox: {
    width: '55%',
    height: 45,
    paddingHorizontal: 10,
    color: 'rgba(0, 0, 0, 0.6)',
    fontSize: 18,
    backgroundColor: colors.transparent,
    marginBottom: 10,
  },

  inputBox: {
    width: '100%',
    height: 45,
    color: 'rgba(0, 0, 0, 0.6)',
    fontSize: 18,
    backgroundColor: colors.transparent,
    marginBottom: 10,
  },

  btnContinue: {
    width: '55%',
    marginBottom: 10,
    marginLeft: '25%',
    borderRadius: 6,
    height: 45,
  },

  btnContinueText: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.whiteText,
  },

  textTermsCondition: {
    marginBottom: 40,
    color: '#8E8E8E',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    flexDirection: 'row',
    marginLeft: 25
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