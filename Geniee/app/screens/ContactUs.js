import React, { Component } from 'react';
import {
    StyleSheet,
    Dimensions,
    View,
    BackHandler,
    Alert,
    StatusBar,
    TouchableOpacity,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import Meteor from '../react-native-meteor';
import { colors } from '../config/styles';
import { Header, Left, Body, Text, Container, Content, Button, Textarea, Title, Icon } from 'native-base';
import CogMenu from "../components/CogMenu";
import { Navigation } from "react-native-navigation/lib/dist/index";
import { backToRoot, goToRoute, navigateToRoutefromSideMenu } from "../Navigation";
import { customGalioTheme } from '../config/themes';
import { PaperProvider, TextInput, Button as RNPButton } from 'react-native-paper';
import UseContactForm from '../hooks/useContactForm';
import authHandlers from '../store/services/contact/handlers';
import FIcon from 'react-native-vector-icons/Feather';

const window = Dimensions.get('window');

const ContactUs = (props) => {

    const { values, handleInputChange, validateContactForm, resetContactForm } = UseContactForm();

    const handleError = (error) => {
        handleInputChange('error', error);
    }

    const validInput = () => {
        let valid = true;

        if (validateContactForm() === true) {
            handleError('Please Enter all the information.');
            valid = false;
        }
        else {
            handleError('');
            valid = true;
        }
        return valid;
    }


    const handleContactUS = () => {
        if (validInput()) {
            let contactInfo = {
                name: values.name.value,
                phone: values.contact.value,
                email: values.email.value,
                message: values.message.value,
            };
            handleInputChange('loading', true);
            authHandlers.contactUs(contactInfo, (err, res) => {
                debugger;
                handleInputChange('loading', false);
                if (err) {
                    handleError(err.reason);
                } else {
                    Alert.alert("DONE", "We will Contact you shortly!!");
                    navigation.navigate('Dashboard');
                }
            });
        }
    }

    return (
        <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}>
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
                        <Text style={{ color: colors.whiteText, fontSize: 20 }}>Contact us</Text>
                    </RNPButton>
                </Header>
                <Content>
                <View style={{ marginVertical: 20 }}>
                    <KeyboardAvoidingView style={{ padding: 10 }}>
                        {/*<View style={styles.header}>*/}
                        <Text style={styles.subHeaderText}>
                            Want to get in touch with us? Fill out the form below to send us a message and we
                            will try
                            to get back to you within 24 hours!
                        </Text>
                        {/*</View>*/}

                        <View style={{ marginVertical: 15 }}>
                            <TextInput
                                mode="outlined"
                                label="Name"
                                color={customGalioTheme.COLORS.INPUT_TEXT}
                                placeholder='Name'
                                value={values.name.value}
                                onChangeText={(name) => handleInputChange('name', name)}
                                style={styles.textInputNameBox}
                                theme={{ roundness: 6 }}
                                error={values.name.error} />

                            <TextInput
                                mode="outlined"
                                color={customGalioTheme.COLORS.INPUT_TEXT}
                                label="Email address"
                                placeholder='Email address'
                                keyboardType='email-address'
                                value={values.email.value}
                                onChangeText={(email) => handleInputChange('email', email)}
                                textContentType={'emailAddress'}
                                style={styles.textInputNameBox}
                                theme={{ roundness: 6 }}
                                error={values.email.error}
                            />

                            <TextInput
                                mode="outlined"
                                color={customGalioTheme.COLORS.INPUT_TEXT}
                                label="Phone No"
                                placeholder='Phone No'
                                keyboardType='phone-pad'
                                value={values.contact.value}
                                onChangeText={(contact) => handleInputChange('contact', contact)}
                                style={styles.textInputNameBox}
                                theme={{ roundness: 6 }}
                                error={values.contact.error}
                            />
                            <Textarea
                                        rowSpan={3}
                                        placeholder="Message"
                                        label="Message"
                                        style={styles.inputTextarea}
                                        placeholderTextColor="#808080"
                                        underlineColorAndroid='red'
                                        value={values.message.value}
                                        onChangeText={(message) => handleInputChange('message', message)}
                                        _dark={{
                                            placeholderTextColor: "gray.300",
                                        }}
                                    />
                        </View>
                        <View style={styles.error}>
                            <Text style={styles.errorText}>{values.error.value}</Text>
                        </View>
                        <View>
                            <RNPButton
                                mode='contained'
                                loading = {values.loading.value}
                                onPress={() => { handleContactUS() }}
                                uppercase={false}
                                style={styles.btnContinue}
                            >
                                <Text
                                    style={styles.btnContinueText}>
                                    Send
                                </Text>
                            </RNPButton>
                        </View>
                    </KeyboardAvoidingView>
                </View>
                </Content>
            </Container >
        </TouchableWithoutFeedback>
    );
}

export default (ContactUs);

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: colors.appBackground,
        fontFamily: `Source Sans Pro`,
    },
    screenHeader: {
        fontSize: 20,
        color: '#ffffff',
    },
    contentContainer: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
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
    textInputNameBox: {
        width: '100%',
        height: 45,
        paddingHorizontal: 10,
        color: 'rgba(0, 0, 0, 0.6)',
        fontSize: 18,
        //backgroundColor: colors.transparent,
        marginBottom: 10,
    },
    inputTextarea: {
        flexDirection: 'row',
        width: '100%',
        backgroundColor: 'white',
        borderRadius: customGalioTheme.SIZES.INPUT_BORDER_RADIUS,
        borderWidth: customGalioTheme.SIZES.INPUT_BORDER_WIDTH,
        borderColor: customGalioTheme.COLORS.PLACEHOLDER,
        paddingHorizontal: 10,
        fontSize: customGalioTheme.SIZES.INPUT_TEXT,
        color: customGalioTheme.COLORS.INPUT_TEXT,
        marginVertical: 5,
    },
    btnContinue: {
        width: '55%',
        marginBottom: 10,
        //marginTop: 10,
        marginLeft: '25%',
        borderRadius: 6,
        height: 45,
    },

    btnContinueText: {
        fontSize: 18,
        fontWeight: '500',
        color: colors.whiteText,
    },

    errorText: {
        color: colors.danger,
        fontSize: 14,
        marginBottom: 14,
    },
    subHeaderText: {
        fontSize: 16,
        // color: colors.headerText,
        fontWeight: '400',
        fontStyle: 'italic',
        textAlign: 'center',
        //color:'#006bb3',
        marginBottom: 14,
        color: colors.primaryText,
    },
    subContainer: {
        marginHorizontal: 20
    },
});
