import React, { Component, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableWithoutFeedback,
    Keyboard,
    ToastAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { colors, customStyle, variables } from '../../../config/styles';
import { Container, Content, Item, Label, Right, Button, Header, Left } from 'native-base';
import LocationPicker from '../../../components/LocationPicker';
import { customGalioTheme } from '../../../config/themes';
import { Title, Button as RNPButton, TextInput, Checkbox, HelperText } from 'react-native-paper';
import authHandlers from '../../../store/services/auth/handlers';
import useAddressDetailForm from '../../../hooks/useAddressDetailForm';
import { OTPConfig } from '../../../config/settings';

const AddressDetail = (props) => {
    const { values, handleInputChange, validateAddressDetailForm, resetAddressDetailForm } = useAddressDetailForm();
    const [showOTPInput, setShowOTPInput] = useState(false);
    const [OTPCodeValid, setOTPCodeValid] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pickLocation, setPickLocation] = useState(false);
    const [location, setLocation] = useState('');
    const [sendOTPCode, setsendOTPCode] = useState('');

    const validateOTPCode = () => {
        // this code will be from API
        let otpValid = false;
        //let sendOTPCode = '123456';
        if (sendOTPCode === values.OTPCode.value) {
            setOTPCodeValid(false);
            otpValid = true;
        }
        else {
            setOTPCodeValid(true);
            otpValid = false;
        }
        return otpValid;
    }

    const generateOTPCode = () => {
        const digits = '0123456789';
        let OTPCode = '';
        for (let i = 0; i < 5; i++) {
            OTPCode += digits[Math.floor(Math.random() * 10)];
        }
        return OTPCode;
    };
    //Design Purpose
    // const handleCreateAccount = () => {
    //     props.navigation.navigate('RegisterCompleted',{data:'user'});
    // }
    const handleCreateAccount = () => {
        let userData = props.route.params.userData;
        let registerUser = '';
        if (!validateAddressDetailForm()) {
            if (validateOTPCode()) {
                //preparing for Database
                let user = {
                    username: values.contact.value,
                    password: userData.password,
                    email: userData.email,
                    createdAt: new Date(),
                    profile: {
                        firstName: capitalzeFirstLetter(userData.firstName),
                        middleName: '',
                        lastName: capitalzeFirstLetter(userData.lastName),
                        contactNo: values.contact.value,
                        profileImage: null,
                        location: location,
                        primaryEmail: userData.email,
                        email: userData.email,
                        district: values.district.value,
                        city: values.city.value,
                        nearestLandmark: values.nearestLandmark.value,
                        otpCode: values.OTPCode.value
                    }
                }
                setLoading(true);
                authHandlers.handleSignUp(user, (res) => {
                    console.log('Result from register' + res);
                    if (res.error) {
                        console.log('result from signup error ' + res.reason);
                        ToastAndroid.showWithGravityAndOffset(
                            res.reason,
                            ToastAndroid.LONG,
                            ToastAndroid.TOP,
                            0,
                            50,
                        );
                    } else {
                        // hack because react-native-meteor doesn't login right away after sign in
                        console.log('Result from register' + res);
                        ToastAndroid.showWithGravityAndOffset(
                            'Registered Successfully',
                            ToastAndroid.LONG,
                            ToastAndroid.TOP,
                            0,
                            50,
                        );
                        registerUser = res;
                        setLoading(false);
                        resetAddressDetailForm();
                        props.navigation.navigate('RegisterCompleted', { data: registerUser });
                    }
                });
                setLoading(false);
            }
        }
    }

    const handleOnLocationSelect = (location) => {
        let city = '';
        let district = '';
        if (location != '') {
            for (var i = 0; i < location.address_components.length; i++) {
                for (var b = 0; b < location.address_components[i].types.length; b++) {

                    //there are different types that might hold a city admin_area_lvl_1 usually does in come cases looking for sublocality type will be more appropriate
                    if (location.address_components[i].types[b] == "locality") {
                        //this is the object you are looking for
                        city = location.address_components[i];
                    }
                    if (location.address_components[i].types[b] == "administrative_area_level_2") {
                        //this is the object you are looking for
                        district = location.address_components[i];
                    }
                }
            }

            delete location.address_components;
            setLocation(location);
            handleInputChange('district', district.long_name);
            handleInputChange('city', city.long_name)
        }
        setPickLocation(false);
    }

    const closePickLocation = () => {
        setPickLocation(false);
    }
    const handleShowOTPInput = () => {
        //if (validateAddressDetailForm()) {
        setShowOTPInput(true);
        //}
    }
    const getOTPCode = (mobileNumber) => {
        let otpCode = generateOTPCode();
        let message = 'Your OTP code is ' + otpCode + ' for Geniee verification.';
        if (otpCode && mobileNumber) {
            authHandlers.PostSendSMS(mobileNumber, message, (res) =>{
                if(res){
                    setsendOTPCode(otpCode);
                    ToastAndroid.showWithGravityAndOffset(
                        'OTP Code has been sent to register number.',
                        ToastAndroid.LONG,
                        ToastAndroid.TOP,
                        0,
                        50,
                    );
                }
            })
            
        }
    }

    const handleSkipCall = () => {
        handleCreateAccount();
    }
    return (
        <Container>
            <Content style={{ backgroundColor: colors.appBackground }}>
                <TouchableWithoutFeedback
                    onPress={Keyboard.dismiss}
                    accessible={false}>
                    <View style={{ paddingTop: 0 }}>
                        {/* <Logo />*/}
                        <Header
                            androidStatusBarColor={colors.statusBar}
                            style={{ backgroundColor: '#4d94ff' }}
                        >
                            <Left>
                                <RNPButton
                                    transparent
                                    uppercase={false}
                                    onPress={() => {
                                        props.navigation.goBack();
                                    }}>
                                    <Icon style={{ color: '#ffffff', fontSize: 20 }} name="arrow-left" />
                                    <Text style={{ color: colors.whiteText }}>
                                        Back
                                    </Text>
                                </RNPButton>
                            </Left>
                            <Right>
                                {/* <RNPButton
                                    transparent
                                    uppercase={false}
                                    onPress={() => {
                                        handleSkipCall();
                                    }}>
                                    <Text style={{ color: colors.whiteText }}>
                                        Skip
                                    </Text>
                                </RNPButton> */}
                            </Right>
                        </Header>

                        <View style={styles.welcomeText}>
                            <Text
                                style={styles.textHeader}>
                                Just few more forms,
                            </Text>
                            <Text
                                style={styles.textSubHeader}>
                                Few info for your convenience
                            </Text>
                        </View>
                        <View style={styles.containerRegister}>
                            <TextInput
                                mode="outlined"
                                right={<TextInput.Icon name="map-marker" />}
                                family="feather"
                                iconSize={20}
                                iconColor={colors.primary}
                                color={customGalioTheme.COLORS.INPUT_TEXT}
                                label="Location"
                                placeholder="Location"
                                placeholderTextColor="#808080"
                                value={location ? location.formatted_address : ''}
                                onFocus={() => setPickLocation(true)}
                                style={styles.inputBox}
                                // error={values.location.error}
                                theme={{ roundness: 6 }}
                            />
                            <View style={styles.textInputNameView}>
                                <TextInput
                                    mode="outlined"
                                    color={customGalioTheme.COLORS.INPUT_TEXT}
                                    placeholder="District"
                                    placeholderTextColor="#808080"
                                    label="District"
                                    name="district"
                                    value={values.district.value}
                                    onChangeText={(value) => handleInputChange('district', value)}
                                    style={styles.textInputNameBox}
                                    error={values.district.error}
                                    theme={{ roundness: 6 }}
                                />

                                <TextInput
                                    mode="outlined"
                                    color={customGalioTheme.COLORS.INPUT_TEXT}
                                    placeholder="City"
                                    placeholderTextColor="#808080"
                                    label="City"
                                    name="city"
                                    value={values.city.value}
                                    onChangeText={(value) => handleInputChange('city', value)}
                                    style={styles.textInputNameBox}
                                    error={values.city.error}
                                    theme={{ roundness: 6 }}
                                />
                            </View>
                            <TextInput
                                mode="outlined"
                                color={customGalioTheme.COLORS.INPUT_TEXT}
                                label="Nearest Landmark"
                                placeholder="Nearest Landmark"
                                placeholderTextColor="#808080"
                                value={values.nearestLandmark.value}
                                onChangeText={(value) => handleInputChange('nearestLandmark', value)}
                                style={styles.inputBox}
                                error={values.nearestLandmark.error}
                                theme={{ roundness: 6 }}
                            />

                            {showOTPInput === false ?
                                <TextInput
                                    mode="outlined"
                                    //left={<TextInput.Affix text="+977-" textStyle={{ color: 'black' }} />}
                                    //right={<TextInput.Icon name="check-circle" style={{ color: 'green'}} />}
                                    color={customGalioTheme.COLORS.INPUT_TEXT}
                                    label="Mobile Number"
                                    placeholder="Mobile Number"
                                    placeholderTextColor="#808080"
                                    keyboardType="phone-pad"
                                    value={values.contact.value}
                                    onChangeText={(value) => handleInputChange('contact', value)}
                                    style={styles.inputBox}
                                    error={values.contact.error}
                                    theme={{ roundness: 6 }}
                                />
                                :
                                <View>
                                    <View style={styles.textInputNameView}>
                                        <TextInput
                                            mode="outlined"
                                            //left={<TextInput.Affix text="+977-" textStyle={{ color: 'black' }} />}
                                            color={customGalioTheme.COLORS.INPUT_TEXT}
                                            label="Mobile Number"
                                            placeholder="Mobile Number"
                                            placeholderTextColor="#808080"
                                            keyboardType="phone-pad"
                                            value={values.contact.value}
                                            onChangeText={(value) => handleInputChange('contact', value)}
                                            style={styles.textInputMobileBox}
                                            error={values.contact.error}
                                            theme={{ roundness: 6 }}
                                        />

                                        <RNPButton
                                            mode='contained'
                                            uppercase={false}
                                            onPress={() => {
                                                getOTPCode(values.contact.value)
                                            }}
                                            style={{ marginTop: 8, height: 45, borderRadius: 4 }}>
                                            <Text style={{ fontSize: 12, textAlign: 'center' }}>Get OTP</Text>
                                        </RNPButton>
                                    </View>
                                    <TextInput
                                        mode="outlined"
                                        color={customGalioTheme.COLORS.INPUT_TEXT}
                                        placeholder="OTP Code"
                                        label="OTP Code"
                                        placeholderTextColor="#808080"
                                        keyboardType="phone-pad"
                                        value={values.OTPCode.value}
                                        onChangeText={(value) => handleInputChange('OTPCode', value)}
                                        style={styles.inputBox}
                                        error={values.OTPCode.error}
                                        theme={{ roundness: 6 }}
                                    />
                                </View>
                            }
                            {OTPCodeValid ?
                                <View style={styles.textInputNameView}>
                                    <HelperText type='error' visible={true} style={{ fontSize: 15, marginTop: 10 }}>
                                        OTP did not matched
                                    </HelperText>
                                    <RNPButton
                                        mode='contained'
                                        uppercase={false}
                                        onPress={() => {
                                            getOTPCode()
                                        }}
                                        style={{ marginTop: 10, height: 40, borderRadius: 4 }}>
                                        <Text style={{ fontSize: 12, textAlign: 'center' }}>Resend OTP</Text>
                                    </RNPButton>
                                </View> : null}
                            <RNPButton
                                mode='contained'
                                uppercase={false}
                                loading={loading}
                                //onPress={handleCreateAccount}
                                style={styles.btnComplete}
                                onPress={() => {
                                    showOTPInput ? handleCreateAccount() : handleShowOTPInput()
                                }}
                            >
                                <Text
                                    style={styles.btnCompleteText}>
                                    Complete
                                </Text>
                            </RNPButton>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Content>
            <LocationPicker
                close={closePickLocation}
                onLocationSelect={handleOnLocationSelect}
                modalVisible={pickLocation}
            />
        </Container>
    );
}

export default AddressDetail;

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
    },

    logoImage: {
        height: 50,
        width: 100,
    },

    textHeader: {
        fontSize: 20,
        color: 'rgba(0, 0, 0, 0.87)',
        marginBottom: 5,
        marginTop: 50,
        fontWeight: 'bold'
    },

    textHeader: {
        fontSize: 20,
        color: 'rgba(0, 0, 0, 0.87)',
        marginBottom: 5,
        marginTop: 80,
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
        //backgroundColor: colors.transparent,
        marginBottom: 10,
    },

    textInputMobileBox: {
        width: '75%',
        height: 45,
        //paddingHorizontal: 10,
        color: 'rgba(0, 0, 0, 0.6)',
        fontSize: 18,
        //backgroundColor: colors.transparent,
        marginBottom: 10,
    },

    inputBox: {
        width: '100%',
        height: 45,
        color: 'rgba(0, 0, 0, 0.6)',
        fontSize: 18,
        //backgroundColor: colors.transparent,
        marginBottom: 10,
    },

    btnComplete: {
        width: '55%',
        marginBottom: 10,
        marginTop: 25,
        marginLeft: '25%',
        borderRadius: 6,
        height: 45,
    },

    btnCompleteText: {
        fontSize: 18,
        fontWeight: '500',
        color: colors.whiteText,
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