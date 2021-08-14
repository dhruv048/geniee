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
import { PaperProvider, TextInput, Button as GButton } from 'react-native-paper';
import UseContactForm from '../hooks/useContactForm';
import authHandlers from '../store/services/contact/handlers';

const window = Dimensions.get('window');

const ContactUs = ({navigation}) => {

    const { values, handleInputChange, validateContactForm, resetContactForm } = UseContactForm();

    const handleError = (error) => {
        handleInputChange('error',error);
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
            handleInputChange('loading',true);
            authHandlers.contactUs(contactInfo, (err, res) => {
                debugger;
                handleInputChange('loading',false);
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

                <Header androidStatusBarColor={colors.statusBar} style={{ backgroundColor: colors.appLayout }}>
                    <Left>
                        <Button transparent onPress={() => {navigation.navigate('Dashboard')}}>
                            <Icon style={{ color: '#ffffff' }} name="arrow-back" />
                        </Button>
                    </Left>
                    <Body>
                        <Title style={styles.screenHeader}>Contact Us</Title>
                    </Body>
                </Header>
                <View style={{ marginVertical: 20 }}>
                    <KeyboardAvoidingView style={{ padding: 20 }}>
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
                                color={customGalioTheme.COLORS.INPUT_TEXT}
                                placeholder='Full name'
                                value={values.name.value}
                                onChangeText={(name) => handleInputChange('name',name)}
                                style={{ marginVertical: 10 }} />

                            <TextInput
                                mode="outlined"
                                color={customGalioTheme.COLORS.INPUT_TEXT}
                                placeholder='Email address'
                                keyboardType='email-address'
                                value={values.email.value}
                                onChangeText={(email) => handleInputChange('email',email)}
                                textContentType={'emailAddress'}
                                style={{ marginVertical: 10 }}
                            />

                            <TextInput
                                mode="outlined"
                                color={customGalioTheme.COLORS.INPUT_TEXT}
                                placeholder='Phone No.'
                                keyboardType='phone-pad'
                                value={values.contact.value}
                                onChangeText={(contact) => handleInputChange('contact',contact)}
                                style={{ marginVertical: 10 }}
                            />

                            <TextInput
                                mode="outlined"
                                multiline={true}
                                rowSpan={4}
                                placeholder="Description"
                                placeholderTextColor={customGalioTheme.COLORS.PLACEHOLDER}
                                selectionColor='#ffffff'
                                underlineColorAndroid='rgba(0,0,0,0)'
                                value={values.message.value}
                                onChangeText={(message) => handleInputChange('message',message)}
                                style={{ marginVertical: 10 }}
                            />
                        </View>
                        <View style={styles.error}>
                            <Text style={styles.errorText}>{values.error.value}</Text>
                        </View>
                        <View>
                            <GButton
                                mode="contained"
                                onPress={() => {
                                    handleContactUS();
                                }}
                                style={{ width: '100%', height: 50 }}
                                loading={values.loading.value}
                                disabled={values.loading.value}>
                                Send
                            </GButton>
                        </View>
                    </KeyboardAvoidingView>
                </View>
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
    inputTextarea: {
        flexDirection: 'row',
        width: '100%',
        backgroundColor: 'white',
        borderRadius: customGalioTheme.SIZES.INPUT_BORDER_RADIUS,
        borderWidth: customGalioTheme.SIZES.INPUT_BORDER_WIDTH,
        borderColor: customGalioTheme.COLORS.PLACEHOLDER,
        paddingHorizontal: 16,
        fontSize: customGalioTheme.SIZES.INPUT_TEXT,
        color: customGalioTheme.COLORS.INPUT_TEXT,
        marginVertical: 5,

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

    errorText: {
        color: colors.danger,
        fontSize: 14,
        marginBottom: 14,
    },
    subHeaderText: {
        fontSize: 20,
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
