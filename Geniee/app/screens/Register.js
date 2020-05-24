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
    Dimensions, Modal, ScrollView
} from 'react-native';
import {CheckBox} from 'native-base'
import {RadioGroup} from 'react-native-btr';
import Icon from 'react-native-vector-icons/Feather';
import Meteor from '../react-native-meteor';
import Logo from '../components/Logo/Logo';
import {colors, customStyle, variables} from '../config/styles';
import {userType} from '../config/settings';
import {Button, Container, Content, Item, Label} from 'native-base';
import LocationPicker from "../components/LocationPicker";
import {goBack, goToRoute} from "../Navigation";
import AutoHeightWebView from 'react-native-autoheight-webview';
import {privacyPolicy} from "../lib/PrivacyPolicy";
import {TermsCondition} from "../lib/Terms&Condition";
class Register extends Component {

    constructor(props) {
        super(props);

        this.mounted = false;
        this.state = {
            termsChecked:false,
            name: '',
            email: '',
            contact: '',
            password: '',
            location: null,
            confirmPassword: '',
            confirmPasswordVisible: false,
            userType: null,
            isLogged: Meteor.user() ? true : null,
            pickLocation:false,
            privacyModal: false,
            termsModal: false,
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
                            err.reason,
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
                       goToRoute(this.props.componentId,'Dashboard');
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

                if(this.state.termsChecked) {

                    let user = {
                        password: password,
                        username: contact,
                        email: email,
                        createdAt: new Date(),
                        //createdBy: new Date(),
                        profile: {
                            role: selectedItem,
                            name: capitalzeFirstLetter(name),
                            contactNo: contact,
                            profileImage: null,
                            location: location,
                            primaryEmail: email,
                            email: email,
                        }
                    };
                    Meteor.call('signUpUser', user, (err, res) => {
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
                            goToRoute(this.props.componentId, 'SignIn');
                        }
                    });
                }
                else{
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

    updateUsersAgreeStatus=()=>{
        let termsChecked=this.state.termsChecked;
        console.log('termsChecked:', termsChecked)
        termsChecked=!termsChecked
        this.setState({termsChecked})
        console.log(termsChecked)
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
    handleOnLocationSelect(location){
        console.log(location);
        this.setState({location:location,pickLocation:false})
    }

    closePickLocation(){
        console.log('method Called')
        this.setState({pickLocation:false})
    }

    render() {
        const {location}=this.state;
        return (
            <Container>
                <StatusBar
                    backgroundColor={colors.statusBar}
                    barStyle='light-content'
                />

                <Content  >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                        <View style={{paddingTop:20}}>

                            <Logo/>

                            <View style={styles.containerRegister}>
                                <TextInput style={styles.inputBox}
                                         //  underlineColorAndroid='rgba(0,0,0,0)'
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
                                           textContentType={'emailAddress'}
                                />
                                <TextInput style={styles.inputBox}
                                           underlineColorAndroid='rgba(0,0,0,0)'
                                           placeholder='Mobile No'
                                           placeholderTextColor='#ffffff'
                                           selectionColor='#ffffff'
                                           keyboardType='phone-pad'
                                           onChangeText={(contact) => this.setState({contact})}
                                />
                                {/*<View style={{width:300,minHeight:40,  marginVertical: 5}}>*/}
                                {/*<View */}
                                {/*underlineColorAndroid='rgba(0,0,0,0)'*/}
                                {/*style={{width:300,minHeight:40,  marginVertical: 5}}>*/}
                                {/*<GooglePlaceSearchBox*/}
                                    {/*underlineColorAndroid='rgba(0,0,0,0)'*/}
                                    {/*placeholderTextColor='#ffffff'*/}
                                    {/*styles={GooglePlaceSerachStyle}*/}
                                    {/*onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true*/}
                                        {/*console.log(data, details);*/}
                                        {/*this.handleLocation(details)*/}
                                    {/*}}*/}
                                    {/*placeholder='Enter Address (*)'*/}
                                {/*/>*/}

                                <TextInput style={styles.inputBox}
                                           underlineColorAndroid='rgba(0,0,0,0)'
                                           placeholder='Location'
                                           placeholderTextColor='#ffffff'
                                           selectionColor='#ffffff'
                                           value={location?location.formatted_address:''}
                                           onFocus={()=>this.setState({pickLocation:true})}

                                />
                                {/*</View>*/}
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
                                <View style={{
                                    paddingTop: 16,
                                    paddingBottom: 16,
                                    paddingLeft: 30,
                                    paddingRight: 30,
                                    alignItems:'center',
                                    justifyContent:'center',
                                    textAlign: 'center',
                                    color: '#8E8E8E',
                                    flexDirection: 'row',
                                    flexWrap: 'wrap',
                                }}>
                                    <TouchableOpacity transparent onPress={()=>this.updateUsersAgreeStatus()}>
                                    <CheckBox checked={this.state.termsChecked} color={variables.checkboxActive} />
                                    </TouchableOpacity>
                                    <Text  style={{marginLeft:15, color:colors.gray_200}}>I agree & accept Geniee's </Text>
                                    <Text style={{color: colors.primaryText}} onPress={() => {
                                        this.setState({termsModal: true})
                                    }}>Terms of Service</Text><Text note> & </Text>
                                    <Text  style={{color: colors.primaryText}} onPress={() => {
                                        this.setState({privacyModal: true})}}>Privacy Policy.</Text>
                                </View>

                                <TouchableOpacity style={styles.button} onPress={this.handleCreateAccount}>
                                    <Text style={styles.buttonText}>Register</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.signupCont}>
                                <Text style={styles.signupText}>Already have an account?</Text>
                                <TouchableOpacity style={styles.navButton} onPress={() => goBack(this.props.componentId)}>
                                    <Text style={styles.navButtonText}>Login</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                    </TouchableWithoutFeedback>


                    {/*PRIVACY POLICY MODAL START */}
                    <Modal style={customStyle.modal}
                           animationType="slide"
                        // transparent={true}
                           visible={this.state.privacyModal}
                           onRequestClose={() => {
                               this.setState({privacyModal: false})
                           }}>
                        <View style={customStyle.modalDialog}>
                            <View style={customStyle.modalHeader}>
                                <Button transparent onPress={() => this.setState({privacyModal: false})}>
                                    <Icon name={'x'} size={24} color={'#2E2E2E'}/></Button>
                                {/*<Button onPress={() => this.setState({languageModal: false})} transparent*/}
                                {/*style={customStyle.buttonOutlinePrimary}>*/}
                                {/*<Text style={customStyle.buttonOutlinePrimaryText}>Save</Text>*/}
                                {/*</Button>*/}
                                <View style={[customStyle.modalTitleHolder, {marginLeft: 30}]}>
                                    <Text style={customStyle.modalTitle}>Privacy Policy</Text>
                                    <Text note></Text>
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
                                        style={{width: Dimensions.get('window').width - 60, margin: 10, marginTop: 10}}
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
                    <Modal style={customStyle.modal}
                           animationType="slide"
                        // transparent={true}
                           visible={this.state.termsModal}
                           onRequestClose={() => {
                               this.setState({termsModal: false})
                           }}>
                        <View style={customStyle.modalDialog}>
                            <View style={customStyle.modalHeader}>
                                <Button transparent onPress={() => this.setState({termsModal: false})}>
                                    <Icon name={'x'} size={24} color={'#2E2E2E'}/></Button>
                                {/*<Button onPress={() => this.setState({languageModal: false})} transparent*/}
                                {/*style={customStyle.buttonOutlinePrimary}>*/}
                                {/*<Text style={customStyle.buttonOutlinePrimaryText}>Save</Text>*/}
                                {/*</Button>*/}
                                <View style={[customStyle.modalTitleHolder, {marginLeft: 30}]}>
                                    <Text style={customStyle.modalTitle}>Terms and Condition</Text>
                                    <Text note></Text>
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
                                        style={{width: Dimensions.get('window').width - 60, margin: 10, marginTop: 10}}
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
                </Content>
                <LocationPicker
                    close={this.closePickLocation.bind(this)}
                    onLocationSelect={this.handleOnLocationSelect.bind(this)}
                    modalVisible={this.state.pickLocation} />
            </Container>)
            ;

    }
}

const GooglePlaceSerachStyle = {
    textInputContainer: {
        width: "100%",
        backgroundColor: 'rgba(0,0,0,0)',
        borderTopWidth: 0,
        borderBottomWidth: 0,
        padding: 0,

    },
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
        height: 40,
        margin: 0,
        marginTop: 0,
        marginLeft: 0,
        marginRight: 0,
        paddingTop: 0,
        paddingBottom: 0
    },
    listView: {
        flex: 1,
    }

}

const styles = StyleSheet.create({
    content: {
        backgroundColor: colors.appBackground,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },

    containerRegister: {
        //  flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal:30,
        marginTop:20
    },

    inputBox: {
        width: '100%',
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
        width: '100%',
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

    //signupButton: {
    //color: '#a51822',
    //fontSize: 16,
    //fontWeight: '500'
    //}
});

export default Register;
const capitalzeFirstLetter = (str) => {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        // You do not need to check if i is larger than splitStr length, as your for does that for you
        // Assign it back to the array
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(' ');
}
