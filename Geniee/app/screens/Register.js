import React, {Component} from 'react';
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
import {Button as NBButton, Icon as NBIcon, Row} from 'native-base';
import {RadioGroup} from 'react-native-btr';
import Icon from 'react-native-vector-icons/Feather';
import Meteor from '../react-native-meteor';
import Logo from '../components/Logo/Logo';
import {colors, customStyle, variables} from '../config/styles';
import {userType} from '../config/settings';
import {Container, Content, Item, Label} from 'native-base';
import LocationPicker from '../components/LocationPicker';
import {goBack, goToRoute} from '../Navigation';
import AutoHeightWebView from 'react-native-autoheight-webview';
import {privacyPolicy} from '../lib/PrivacyPolicy';
import {TermsCondition} from '../lib/Terms&Condition';
import {customGalioTheme} from '../config/themes';
import {GalioProvider, Input, Checkbox, Button} from 'galio-framework';
import {Title, Button as RNPButton} from 'react-native-paper';

class Register extends Component {
  validInput = overrideConfirm => {
    console.log('validInput');
    const {
      email,
      password,
      confirmPassword,
      confirmPasswordVisible,
    } = this.state;
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

    if (
      !overrideConfirm &&
      confirmPasswordVisible &&
      password !== confirmPassword
    ) {
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
  };
  handleCreateAccount = () => {
    console.log('handleCreateAccount');
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
      } else {
        if (this.state.termsChecked) {
          let user = {
            password: password,
            username: contact,
            email: email,
            createdAt: new Date(),
            //createdBy: new Date(),
            profile: {
              name: capitalzeFirstLetter(name),
              contactNo: contact,
              profileImage: null,
              location: location,
              primaryEmail: email,
              email: email,
            },
          };
          this.setState({loading: true});
          Meteor.call('signUpUser', user, (err, res) => {
            this.setState({loading: false});
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
              //  this.handleSignIn();
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
      }
    }
  };
  _updateUsersAgreeStatus = () => {
    console.log(this.mounted);
    if (this.mounted) {
      let termsChecked = this.state.termsChecked;
      console.log('termsChecked:', termsChecked);
      termsChecked = !termsChecked;
      this.setState({termsChecked});
      console.log(termsChecked);
    }
  };
  handleLocation = (data, Detail) => {
    console.log('handleLocation');
    console.log(data, 'Detail :' + Detail);
    this.setState({
      location: data,
    });
  };

  constructor(props) {
    super(props);

    this.mounted = false;
    this.state = {
      loading: false,
      termsChecked: false,
      name: '',
      email: '',
      contact: '',
      password: '',
      location: null,
      confirmPassword: '',
      confirmPasswordVisible: false,
      userType: null,
      pickLocation: false,
      privacyModal: false,
      termsModal: false,
    };
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidAppear() {
    this.mounted = true;
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButton.bind(this),
    );
  }

  handleBackButton() {
    console.log('handlebackpress Register');
    this.props.navigation.goBack();
    return true;
  }

  componentDidDisappear() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButton.bind(this),
    );
  }

  handleOnLocationSelect(location) {
    console.log('handleOnLocationSelect');
    console.log(location);
    this.setState({location: location, pickLocation: false});
  }

  closePickLocation() {
    console.log('closePickLocation');
    console.log('method Called');
    this.setState({pickLocation: false});
  }

  render() {
    const {location} = this.state;
    return (
      <Container>
        <StatusBar
          backgroundColor={colors.appBackground}
          barStyle="dark-content"
        />
        <GalioProvider theme={customGalioTheme}>
          <Content style={{backgroundColor: colors.appBackground}}>
            <TouchableWithoutFeedback
              onPress={Keyboard.dismiss}
              accessible={false}>
              <View style={{paddingTop: 0}}>
                {/* <Logo />*/}
                <View style={{width: '100%', alignItems: 'flex-end'}}>
                  <RNPButton mode="text">
                    <NBIcon
                      name="close"
                      size={20}
                      style={{color: 'rgba(0, 0, 0, 0.6)'}}
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
                  <Input
                    color={customGalioTheme.COLORS.INPUT_TEXT}
                    placeholder="Full Name"
                    placeholderTextColor="#808080"
                    onSubmitEditing={() => this.email.focus()}
                    onChangeText={name => this.setState({name})}
                    style={styles.inputBox}
                  />

                  <Input
                    color={customGalioTheme.COLORS.INPUT_TEXT}
                    placeholder="Email"
                    keyboardType="Email-Address"
                    placeholderTextColor="#808080"
                    ref={input => (this.email = input)}
                    onSubmitEditing={() => this.contact.focus()}
                    onChangeText={email => this.setState({email})}
                    textContentType={'emailAddress'}
                    style={styles.inputBox}
                  />

                  <Input
                    color={customGalioTheme.COLORS.INPUT_TEXT}
                    placeholder="Mobile No"
                    placeholderTextColor="#808080"
                    keyboardType="phone-pad"
                    onChangeText={contact => this.setState({contact})}
                    style={styles.inputBox}
                  />

                  <Input
                    right
                    icon="map-pin"
                    family="feather"
                    iconSize={20}
                    iconColor={colors.primary}
                    color={customGalioTheme.COLORS.INPUT_TEXT}
                    placeholder="Location"
                    placeholderTextColor="#808080"
                    value={location ? location.formatted_address : ''}
                    onFocus={() => this.setState({pickLocation: true})}
                    style={styles.inputBox}
                  />
                  {/*</View>*/}
                  <Input
                    color={customGalioTheme.COLORS.INPUT_TEXT}
                    password
                    viewPass
                    iconColor={colors.primary}
                    iconSize={24}
                    placeholder="Password"
                    placeholderTextColor="#808080"
                    ref={input => (this.password = input)}
                    onSubmitEditing={() => this.confirmPassword.focus()}
                    onChangeText={password => this.setState({password})}
                    style={styles.inputBox}
                  />
                  <Input
                    password
                    viewPass
                    iconColor={colors.primary}
                    iconSize={24}
                    color={customGalioTheme.COLORS.INPUT_TEXT}
                    placeholder="Confirm Password"
                    placeholderTextColor="#808080"
                    secureTextEntry
                    ref={input => (this.confirmPassword = input)}
                    onChangeText={confirmPassword =>
                      this.setState({confirmPassword})
                    }
                    style={styles.inputBox}
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
                  {/*color='#4d94ff'*/}
                  {/*//flexDirection='row'*/}
                  {/*labelStyle={{fontSize: 16, color: '#4d94ff'}}*/}
                  {/*radioButtons={this.state.radioButtons}*/}
                  {/*onPress={radioButtons => this.setState({radioButtons})}*/}
                  {/*/>*/}
                  {/*</View>*/}

                  <Button
                    // round
                    onPress={this.handleCreateAccount}
                    style={{
                      width: '100%',
                      marginBottom: 35,
                      borderRadius: 4,
                      height: 36,
                    }}
                    loading={this.state.loading}
                    disabled={this.state.loading}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: '500',
                        color: colors.whiteText,
                      }}>
                      SIGN UP
                    </Text>
                  </Button>

                  {/*       <TouchableOpacity style={styles.button} onPress={this.handleCreateAccount}>
                                    <Text style={styles.buttonText}>Register</Text>
                                </TouchableOpacity> */}
                </View>

                <View style={styles.signupCont}>
                  <Text style={styles.signupText}>
                    Already have an account?
                  </Text>
                  <TouchableOpacity
                    style={styles.navButton}
                    onPress={() => this.props.navigation.goBack()}>
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
                  {/* <Checkbox
                      label=""
                      initialValue={this.state.termsChecked}
                      color="primary"
                      onChange={this._updateUsersAgreeStatus}
                    /> */}

                  <Text style={{color: 'rgba(0, 0, 0, 0.87)', fontSize: 12}}>
                    By proceeding, you agree to our{' '}
                  </Text>

                  <TouchableOpacity>
                    <Text
                      style={{color: colors.primaryText, fontSize: 12}}
                      onPress={() => {
                        this.setState({termsModal: true});
                      }}>
                      Terms of Use
                    </Text>
                  </TouchableOpacity>

                  <Text style={{color: 'rgba(0, 0, 0, 0.87)', fontSize: 12}}>
                    {' '}
                    and confirm you have read our{' '}
                  </Text>

                  <TouchableOpacity>
                    <Text
                      style={{color: colors.primaryText, fontSize: 12}}
                      onPress={() => {
                        this.setState({privacyModal: true});
                      }}>
                      Privacy Policy.
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Content>
        </GalioProvider>
        {/*PRIVACY POLICY MODAL START */}
        <Modal
          style={customStyle.modal}
          animationType="slide"
          // transparent={true}
          visible={this.state.privacyModal}
          onRequestClose={() => {
            this.setState({privacyModal: false});
          }}>
          <View style={customStyle.modalDialog}>
            <View style={customStyle.modalHeader}>
              <NBButton
                transparent
                onPress={() => this.setState({privacyModal: false})}>
                <Icon name={'x'} size={24} color={'#2E2E2E'} />
              </NBButton>
              <View style={[customStyle.modalTitleHolder, {marginLeft: 30}]}>
                <Text style={customStyle.modalTitle}>Privacy Policy</Text>
                <Text note />
              </View>
            </View>

            <ScrollView style={customStyle.modalScrollView}>
              <View style={{paddingBottom: 30}}>
                <AutoHeightWebView
                  // default width is the width of screen
                  // if there are some text selection issues on iOS, the width should be reduced more than 15 and the marginTop should be added more than 35
                  style={{
                    width: Dimensions.get('window').width - 60,
                    margin: 10,
                    marginTop: 10,
                  }}
                  //  customScript={`document.body.style.background = 'white';`}
                  // add custom CSS to the page's <head>
                  customStyle={''}
                  // either height or width updated will trigger this
                  onSizeUpdated={size => console.log(size.height)}
                  //use local or remote files
                  //to add local files:
                  //add baseUrl/files... to android/app/src/assets/ on android
                  //add baseUrl/files... to project root on iOS
                  // baseUrl now contained by source
                  // 'web/' by default on iOS
                  // 'file:///android_asset/web/' by default on Android
                  // or uri
                  source={{html: privacyPolicy.content}}
                  // disables zoom on ios (true by default)
                  //   zoomable={true}
                  // scalesPageToFit={true}
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
          visible={this.state.termsModal}
          onRequestClose={() => {
            this.setState({termsModal: false});
          }}>
          <View style={customStyle.modalDialog}>
            <View style={customStyle.modalHeader}>
              <NBButton
                transparent
                onPress={() => this.setState({termsModal: false})}>
                <Icon name={'x'} size={24} color={'#2E2E2E'} />
              </NBButton>
              {/*<Button onPress={() => this.setState({languageModal: false})} transparent*/}
              {/*style={customStyle.buttonOutlinePrimary}>*/}
              {/*<Text style={customStyle.buttonOutlinePrimaryText}>Save</Text>*/}
              {/*</Button>*/}
              <View style={[customStyle.modalTitleHolder, {marginLeft: 30}]}>
                <Text style={customStyle.modalTitle}>Terms and Condition</Text>
                <Text note />
              </View>
            </View>

            <ScrollView style={customStyle.modalScrollView}>
              <View style={{paddingBottom: 30}}>
                {/*<View style={customStyle.sectionHeader}>*/}
                {/*/!*<Text style={customStyle.sectionHeaderTitle}>Select Languages</Text>*!/*/}
                {/*</View>*/}

                <AutoHeightWebView
                  // default width is the width of screen
                  // if there are some text selection issues on iOS, the width should be reduced more than 15 and the marginTop should be added more than 35
                  style={{
                    width: Dimensions.get('window').width - 60,
                    margin: 10,
                    marginTop: 10,
                  }}
                  //  customScript={`document.body.style.background = 'white';`}
                  // add custom CSS to the page's <head>
                  customStyle={''}
                  // either height or width updated will trigger this
                  onSizeUpdated={size => console.log(size.height)}
                  //use local or remote files
                  //to add local files:
                  //add baseUrl/files... to android/app/src/assets/ on android
                  //add baseUrl/files... to project root on iOS
                  // baseUrl now contained by source
                  // 'web/' by default on iOS
                  // 'file:///android_asset/web/' by default on Android
                  // or uri
                  source={{html: TermsCondition.content}}
                  // disables zoom on ios (true by default)
                  //   zoomable={true}
                  // scalesPageToFit={true}
                />
              </View>
            </ScrollView>
          </View>
        </Modal>
        {/* TERMS&CONDITION MODAL STOP */}
        <LocationPicker
          close={this.closePickLocation.bind(this)}
          onLocationSelect={this.handleOnLocationSelect.bind(this)}
          modalVisible={this.state.pickLocation}
        />
      </Container>
    );
  }
}

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
