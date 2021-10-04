import React, { PureComponent, useEffect, useState } from 'react';
import AsyncStorage from "@react-native-community/async-storage";
import { colors, customStyle, variables } from "../../config/styles";
import Meteor from '../../react-native-meteor';
import { Container, Content, Header, Item, Label, Text, Radio, Left, Body, Title, Icon, Right, Button } from "native-base";
import UploadProfilePic from '../../components/UploadProfilePic/UploadProfilePic';
import {
    KeyboardAvoidingView, SafeAreaView, StatusBar, TouchableNativeFeedback, View,
    StyleSheet, ToastAndroid, TouchableWithoutFeedback, Keyboard
} from "react-native";
// import Icon from 'react-native-vector-icons/Feather';
import { backToRoot } from "../../Navigation";
import { GalioProvider, Input, Checkbox, Button as GButton } from 'galio-framework';
import { customGalioTheme } from '../../config/themes';
import { blue100 } from 'react-native-paper/lib/typescript/styles/colors';
import FIcon from 'react-native-vector-icons/Feather';
import { TextInput, Button as RNPButton } from 'react-native-paper';
import useUpdateProfileForm from '../../hooks/useUpdateProfileForm';

const Profile = (props) => {

    const { values, handleInputChange, validateUpdateProfileForm, resetUpdateProfileForm } = useUpdateProfileForm();

    let user = props.loggedUser;
    let loggedUser = Meteor.user() ? Meteor.user() : JSON.parse(user);
    useEffect(() => {
        //let user = await AsyncStorage.getItem('loggedUser');       
        if (loggedUser) {
            _updateState(loggedUser.profile);
        }
    }, [loggedUser])

    const _updateState = (profile) => {
        handleInputChange('firstName', profile.firstName);
        handleInputChange('lastName', profile.lastName);
        handleInputChange('email', profile.email);
        handleInputChange('contactNo', profile.contactNo);
    }

    const UpdateVisitorProfile = () => {
        let profile = loggedUser.profile;
        profile.firstName = values.firstName.value;
        profile.lastName = values.lastName.value;
        profile.email = values.email.value;
        profile.contactNo = values.contactNo.value;
        Meteor.call('updateProfile', profile, (err, res) => {
            if (err) {
                console.log(err)
            }
            else {
                ToastAndroid.showWithGravityAndOffset(
                    'updated profile Successfully',
                    ToastAndroid.LONG,
                    ToastAndroid.TOP,
                    0,
                    50,
                );
            }
        })
    }
    
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <GalioProvider theme={customGalioTheme}>
                <Container style={styles.container}>
                    <Header androidStatusBarColor={colors.statusBar}
                        style={{ backgroundColor: '#4d94ff' }}>
                        <RNPButton
                            transparent
                            uppercase={false}
                            style={{ width: '100%', alignItems: 'flex-start' }}
                            onPress={() => {
                                props.navigation.goBack();
                            }}>
                            <FIcon style={{ color: '#ffffff', fontSize: 20 }} name="arrow-left" />
                            <Text style={{ color: colors.whiteText, fontSize: 20 }}>Edit Profile</Text>
                        </RNPButton>
                    </Header>
                    <Content>
                        <SafeAreaView style={{ flex: 1 }} keyboardShouldPersistTaps='always'>
                            <View style={styles.welcomeText}>
                                <Text
                                    style={styles.textHeader}>
                                    Update your profile,
                                </Text>
                            </View>
                            
                            <KeyboardAvoidingView>
                                <View style={styles.containerRegister}>
                                <View style={styles.textLabelImageView}>
                                <Text style={{marginTop : 30, paddingLeft:20}}>Add Profile Image</Text>
                                <UploadProfilePic />
                            </View>
                                    <View style={styles.textInputNameView}>
                                        <TextInput
                                            mode="outlined"
                                            color={customGalioTheme.COLORS.INPUT_TEXT}
                                            placeholder="First Name"
                                            placeholderTextColor="#808080"
                                            label="First Name"
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
                                            label="Last Name"
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
                                        placeholder="Email"
                                        placeholderTextColor="#808080"
                                        keyboardType="email-address"
                                        label="Email"
                                        value={values.email.value}
                                        onChangeText={(value) => handleInputChange('email', value)}
                                        style={styles.inputBox}
                                        theme={{ roundness: 6 }}
                                        error={values.email.error}
                                    />
                                    <TextInput
                                        mode="outlined"
                                        color={customGalioTheme.COLORS.INPUT_TEXT}
                                        placeholder="ContactNo"
                                        placeholderTextColor="#808080"
                                        keyboardType="phone-pad"
                                        label="ContactNo"
                                        value={values.contactNo.value}
                                        onChangeText={(value) => handleEmailValidation(value)}
                                        style={styles.inputBox}
                                        theme={{ roundness: 6 }}
                                        error={values.contactNo.error}
                                    />

                                    <View>
                                        <RNPButton
                                            mode='contained'
                                            uppercase={false}
                                            onPress={UpdateVisitorProfile}
                                            style={styles.btnContinue}
                                        >
                                            <Text
                                                style={styles.btnContinueText}>
                                                Update Profile
                                            </Text>
                                        </RNPButton>
                                    </View>
                                </View>
                            </KeyboardAvoidingView>
                        </SafeAreaView>
                    </Content>
                </Container>
            </GalioProvider>
        </TouchableWithoutFeedback>
    );
};
const styles = StyleSheet.create({
    sb85086c9: {
        alignItems: 'center',
        justifyContent: `center`,
        padding: 10,
        flexGrow: 1,
        width: '100%',
        flex: 1
    },
    sbf9e8383: {
        flex: 1,
        opacity: 1
    },
    container: {
        backgroundColor: colors.appBackground,
        width: '100%',
        fontFamily: `Source Sans Pro`,
        // alignItems: 'center',
        // justifyContent: 'center'
    },
    containerRegister: {
        padding: 30,
        width: '100%'
    },

    welcomeText: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        flexDirection: 'column',
        paddingHorizontal: 25,
      },

      textHeader: {
        fontSize: 20,
        color: 'rgba(0, 0, 0, 0.87)',
        marginBottom: 5,
        marginTop: 50,
        fontWeight: 'bold'
      },

    textInputNameView:
    {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },

    textLabelImageView:
    {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom :15,
        height:80,
        backgroundColor: '#F0F8FF'
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

    inputBox: {
        width: '100%',
        height: 45,
        color: 'rgba(0, 0, 0, 0.6)',
        fontSize: 18,
        //backgroundColor: colors.transparent,
        marginBottom: 10,
    },

    btnContinue: {
        width: '55%',
        marginVertical: 15,
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
    screenHeader: {
        fontSize: 20,
        color: '#ffffff',
    },
});
export default Profile;