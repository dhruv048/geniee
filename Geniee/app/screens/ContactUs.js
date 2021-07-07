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
//import Icon from 'react-native-vector-icons/Feather'
// import { GalioProvider, Input, Button as GButton } from 'galio-framework';
import { customGalioTheme } from '../config/themes';
import { PaperProvider, TextInput,Button as GButton  } from 'react-native-paper';

const window = Dimensions.get('window');

class ContactUs extends Component {
    constructor(props) {
        super(props);

        this.mounted = false;
        this.state = {
            name: '',
            email: '',
            contact: '',
            message: '',
            error: null,
            loading: false,
        };
    }


    componentDidMount() {

        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));
    }

    handleBackButton() {
        console.log('handlebackpress')
        // this.props.navigation.navigate('Dashboard');
        this.props.navigation.navigate('Home');
        return true;
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton.bind(this));
    }

    handleError = (error) => {
        console.log('handleError')
        this.setState({ error });
    }

    validInput = () => {
        const { name, email, message, contact } = this.state;
        let valid = true;

        if (!contact.length || !message || !name || !email) {
            this.handleError('Please Enter all the information.');
            valid = false;
        }
        else {
            this.handleError('');
            valid = true;
        }

        if (valid) {
            this.handleError(null);
        }
        return valid;
    }


    handleContactUS = () => {
        console.log('handleContactUS')
        const { name, email, message, contact } = this.state;
        if (this.validInput()) {
            let contactInfo = {
                name: name,
                phone: contact,
                email: email,
                message: message
            };
            this.setState({ loading: true });
            Meteor.call('addContactUsMessage', contactInfo, (err, result) => {
                this.setState({ loading: false });
                if (err) {
                    this.handleError(err.reason);
                } else {
                    Alert.alert("DONE", "We will Contact you shortly!!");
                    this.props.navigation.navigate('Dashboard');
                }
            });
        }
    }

    render() {

        return (
            <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}>
            <Container style={styles.container}>
               
                <Header androidStatusBarColor={colors.statusBar} style={{ backgroundColor: colors.appLayout }}>
                    <Left>
                        <Button transparent onPress={() => { this.props.navigation.goBack() }}>
                            <Icon style={{ color: '#ffffff' }} name="arrow-back" />
                        </Button>
                        {/* <CogMenu componentId={this.props.componentId} /> */}
                    </Left>
                    <Body>
                        <Title style={styles.screenHeader}>Contact Us</Title>
                    </Body>
                </Header>
                <View style={{marginVertical : 20}}>
                    <KeyboardAvoidingView style={{ padding: 20 }}>
                        {/*<View style={styles.header}>*/}
                        <Text style={styles.subHeaderText}>
                            Want to get in touch with us? Fill out the form below to send us a message and we
                            will try
                            to get back to you within 24 hours!
                        </Text>
                        {/*</View>*/}

                        <View style={{marginVertical : 15}}>
                            <TextInput
                                mode="outlined"
                                color={customGalioTheme.COLORS.INPUT_TEXT}
                                placeholder='Full name'
                                value={this.state.name}
                                onChangeText={(name) => this.setState({ name })}
                                style={{marginVertical :10}} />

                            <TextInput
                                mode="outlined"
                                color={customGalioTheme.COLORS.INPUT_TEXT}
                                placeholder='Email address'
                                keyboardType='email-address'
                                value={this.state.email}
                                onChangeText={(email) => this.setState({ email })}
                                textContentType={'emailAddress'}
                                style={{marginVertical :10}}
                            />

                            <TextInput
                                mode="outlined"
                                color={customGalioTheme.COLORS.INPUT_TEXT}
                                placeholder='Phone No.'
                                keyboardType='phone-pad'
                                value={this.state.contact}
                                onChangeText={(contact) => this.setState({ contact })}
                                style={{marginVertical :10}}
                            />

                            <TextInput
                                mode="outlined"
                                multiline={true}
                                rowSpan={4}
                                placeholder="Description (*)"
                                // style={{height:100}}
                                placeholderTextColor={customGalioTheme.COLORS.PLACEHOLDER}
                                selectionColor='#ffffff'
                                underlineColorAndroid='rgba(0,0,0,0)'
                                //onSubmitEditing={() => this.contactNumber.focus()}
                                value={this.state.message}
                                onChangeText={(message) => this.setState({ message })}
                                style={{marginVertical :10}}
                            />
                        </View>
                        <View style={styles.error}>
                            <Text style={styles.errorText}>{this.state.error}</Text>
                        </View>
                        <View>
                            <GButton
                            mode="contained"
                                onPress={() => {
                                    this.handleContactUS();
                                }}
                                style={{ width: '100%', height:50 }}
                                loading={this.state.loading}
                                disabled={this.state.loading}>
                                Send
                            </GButton>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </Container >
            </TouchableWithoutFeedback>
        );
    }
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
