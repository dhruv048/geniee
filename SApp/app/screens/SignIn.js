import React, { Component } from 'react';
import { LayoutAnimation, StyleSheet, Dimensions, Text, View, Image,Modal,ScrollView } from 'react-native';
import Meteor from 'react-native-meteor';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import ImagePicker from 'react-native-image-picker';
import {CheckBox} from 'react-native-elements';
import { colors } from '../config/styles';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Button from '../components/Button';
import GenericTextInput, { InputWrapper } from '../components/GenericTextInput';
import logoImage from '../images/rn-logo.png';
import userImage from '../images/duser.png';
import Sapp from "../screens/Sapp";
import settings from '../config/settings'
import Icon  from 'react-native-vector-icons/FontAwesome';
import GooglePlaceSearchBox from "../components/GooglePlaceSearch"

const window = Dimensions.get('window');

const options = {
    title: 'Select Image Source',
    chooseFromLibraryButtonTitle	:  'Choose Photo from Gallery' ,
    takePhotoButtonTitle: 'Take Photo from Camera' ,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  buttons: {
    flexDirection: 'row',
      justifyContent: 'center',
  },
  error: {
    height: 28,
    justifyContent: 'center',
    width: window.width,
    alignItems: 'center',
  },
  errorText: {
    color: colors.errorText,
    fontSize: 14,
  },
  header: {
    marginBottom: 25,
    alignItems: 'center',
  },
  logo: {
    width: 125,
    height: 125,

  },
    logoContainer:{
      alignItems:'center',
        justifyContent:'center',
        flex:1,
    },
    userImage: {
        height: 150,
        width:150,
        alignItems: 'center',
        padding:5,
        marginTop:20,
    },
  headerText: {
    fontSize: 30,
    color: colors.headerText,
    fontWeight: '600',
    fontStyle: 'italic',
  },
  subHeaderText: {
    fontSize: 20,
    color: colors.headerText,
    fontWeight: '400',
    fontStyle: 'italic',
  },
    infoContainer:{
      position:'absolute',
        left:0,
        right:0,
        bottom:5,
        height:190,
        padding:10,
    },
});

class SignIn extends Component {
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
      error: null,
        isLogged:Meteor.user()?true : null,
        showModal:false,
        sourceURI:userImage,
        checked:false,
        region:{},
    };
  }

  componentWillMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }
  componentDidMount(){
      this.watchID = navigator.geolocation.watchPosition((position) => {
          // Create the object to update this.state.mapRegion through the onRegionChange function
         this.setState({
              region:{
                  lat:       position.coords.latitude,
                  long:      position.coords.longitude,
          }})
          this.onRegionChange( position.coords.latitude, position.coords.longitude);
      }, (error)=>console.log(error));
  }
  handleError = (error) => {
    if (this.mounted) {
      this.setState({ error });
    }
  }
    onRegionChange( lastLat, lastLong) {
        this.setState({
            region:{
                lat:       lastLat,
                long:     lastLong
            }
        });
    }
  validInput = (overrideConfirm) => {
    const { email, password, confirmPassword, confirmPasswordVisible } = this.state;
    let valid = true;

    if (email.length === 0 || password.length === 0) {
      this.handleError('Email and password cannot be empty.');
      valid = false;
    }

    if (!overrideConfirm && confirmPasswordVisible && password !== confirmPassword) {
      this.handleError('Passwords do not match.');
      valid = false;
    }

    if (valid) {
      this.handleError(null);
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
                    this.handleError(err.message);

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
        const { email, password,name,contact,checked } = this.state;
        if (name.length === 0 || contact.length === 0) {
            this.handleError('Name and Contact cannot be empty.');
            valid = false;
        }
        else {
           let user={
              name:name,
              contact:contact,
              email:email,
              password:password,
              role:  0
            };
            Meteor.call('registerUser',  user , (err, res) => {
                if (err) {
                    this.handleError(err.reason);
                } else {
                    // hack because react-native-meteor doesn't login right away after sign in
                    console.log('Reslut from register'+res);
                    this.setState({
                        showModal:false
                    })
                    this.handleSignIn();
                }
            });
        }
    } else {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);

    }

      if(this.mounted){
          this.setState({
              showModal:false
          })
      }
  }
    uploadImage=()=>{
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = { uri: response.uri };

                // You can also display the image using data:
                // const source = { uri: 'data:image/jpeg;base64,' + response.data };

                this.setState({
                    sourceURI: source,
                });
            }
    })
    }

  render() {

const yourPlace= { description: 'Your Location', geometry: { location: { lat:this.state.region.lat, lng: this.state.region.long } }};



      if(this.state.isLogged!==null){
          return < Sapp />
      }
      else {
          return (
              
              <View style={styles.container}>
                  <View style={styles.logoContainer}>
                      <Image
                          style={styles.logo}
                          source={logoImage}
                      />
                  {/*</View>*/}
                  {/*<View style={styles.header}>*/}
                      <Text style={styles.headerText}>Home Service</Text>
                      <Text style={styles.subHeaderText}>Service at Your Home</Text>
                  </View>
                  <View style={styles.infoContainer}>
                      <InputWrapper>
                          <GenericTextInput
                          placeholder="Email address"
                          onChangeText={(email) => this.setState({email})}
                          />
                          <GenericTextInput
                          placeholder="Password"
                          onChangeText={(password) => this.setState({password})}
                          secureTextEntry
                          borderTop
                          />
                          {/*{this.state.confirmPasswordVisible ?*/}
                              {/*<GenericTextInput*/}
                              {/*placeholder="confirm password"*/}
                              {/*onChangeText={(confirmPassword) => this.setState({confirmPassword})}*/}
                              {/*secureTextEntry*/}
                              {/*borderTop*/}
                              {/*/>*/}
                              {/*: null}*/}
                              </InputWrapper>

                      <View style={styles.error}>
                          <Text style={styles.errorText}>{this.state.error}</Text>
                      </View>

                      <View style={styles.buttons}>
                      <Button text="Sign In" onPress={this.handleSignIn}/>
                      <Button text="Register" onPress={()=>{
                          this.setState({
                              showModal:true
                          })}}/>
                  </View>

                  <KeyboardSpacer/>
                  </View>


                  <Modal  visible={this.state.showModal} onRequestClose={()=>{this.setState({
                      showModal:false
                  })}}>
                      <View style={styles.header}>
                      <Text style={styles.subHeaderText}>Create New Account</Text>
                          <Image source={this.state.sourceURI} style={styles.userImage}/>

                          <Button text="Upload Image" onPress={this.uploadImage} />
                      </View>

                      <ScrollView>
                          <InputWrapper>
                              <CheckBox
                              center
                              title='Admin'
                              checked={this.state.checked}
                              onPress={() => this.setState({checked: !this.state.checked})}
                          />
                          <GenericTextInput
                              placeholder="Full name"
                              onChangeText={(name) => this.setState({name})}
                          />
                          <GenericTextInput
                              placeholder="Contact No."
                              onChangeText={(contact) => this.setState({contact})}
                              borderTop
                          />
                              <GooglePlaceSearchBox/>


                          <GenericTextInput
                              placeholder="Email address"
                              onChangeText={(email) => this.setState({email})}
                              borderTop
                          />
                          <GenericTextInput
                              placeholder="Password"
                              onChangeText={(password) => this.setState({password})}
                              secureTextEntry
                              borderTop
                          />
                          <GenericTextInput
                                  placeholder="Confirm password"
                                  onChangeText={(confirmPassword) => this.setState({confirmPassword})}
                                  secureTextEntry
                                  borderTop
                          />
                      </InputWrapper>
                          <View style={styles.error}>
                              <Text style={styles.errorText}>{this.state.error}</Text>
                          </View>
                      </ScrollView>
                      <View style={styles.buttons}>
                          <Button text="Create Account" onPress={this.handleCreateAccount}/>
                          <Button text="Cancel" onPress={()=>{
                              this.setState({
                                  showModal:false,
                                  error:null
                              })}}/>
                      </View>
                  </Modal>
              </View>
          );
      }
  }
}

export default SignIn;
