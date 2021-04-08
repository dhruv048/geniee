import React, { PureComponent } from 'react';
import AsyncStorage from "@react-native-community/async-storage";
import { colors, customStyle,variables } from "../../config/styles";
import Meteor from '../../react-native-meteor';
import { Container, Content, Header, Item, Label, Text, Radio, Left, Body, Title, Icon, Right,Button } from "native-base";
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

class Profile extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            address: '',
            email: '',
            contact: '',
        }
        this.loggedUser;
    }

    async componentDidMount() {
        let user = await AsyncStorage.getItem('loggedUser');
        this.loggedUser = Meteor.user() ? Meteor.user() : JSON.parse(user);
        // const profile = Meteor.user() ? Meteor.user().profile : this.loggedUser.profile;
        this._updateState(this.loggedUser.profile)
    }

    _updateState(profile) {
        this.setState({
            name: profile.name,
            address: profile.location.formatted_address,
            email: profile.email,
            contact: profile.contactNo,
        })
    }

    UpdateVisitorProfile = () => {
        const { name, contact, email, address } = this.state;
        let profile = this.loggedUser.profile;
        profile.name = name;
        profile.contactNo = contact;
        profile.email = email;

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

    render() {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <GalioProvider theme={customGalioTheme}>
                    <Container style={styles.container}>
                        <Header androidStatusBarColor={colors.statusBar}
                            style={{ backgroundColor: '#4d94ff' }}>
                            <Left>
                            <Button
                  transparent
                  onPress={() => {
                    this.props.navigation.navigate('Home');
                  }}>
                  <Icon style={{color: '#ffffff'}} name="arrow-back" />
                </Button>                                
                            </Left>
                            <Body>
                <Title style={styles.screenHeader}>Edit Profile</Title>
              </Body>
                        </Header>
                        <Content>
                            <SafeAreaView style={{ flex: 1 }} keyboardShouldPersistTaps='always'>
                                <UploadProfilePic />
                                <KeyboardAvoidingView>
                                    <View style={styles.containerRegister}>
                                        <Input
                                            placeholder="Name"
                                            value={this.state.name}
                                            onChangeText={(name) => this.setState({ name })}
                                        />
                                        <Input
                                            placeholder="Email"
                                            value={this.state.email}
                                            onChangeText={(email) => this.setState({ email })}
                                        />
                                        {/*<View style={[customStyle.formGroup, {*/}
                                        {/*flexDirection: 'column'*/}
                                        {/*}]}>*/}
                                        {/*<Label style={[customStyle.formLabel, {marginBottom: 5}]}>Gender</Label>*/}
                                        {/*<View style={customStyle.radioGroup}>*/}
                                        {/*<Item onPress={() => {*/}
                                        {/*this._changeGender('Male')*/}
                                        {/*}} style={customStyle.radioInline}>*/}
                                        {/*<Radio*/}
                                        {/*style={customStyle.radioButton}*/}
                                        {/*color={colors.radioNormal}*/}
                                        {/*selectedColor={colors.radioActive}*/}
                                        {/*selected={this.state.gender === 'Male'}*/}
                                        {/*/>*/}
                                        {/*<Text>Male</Text>*/}
                                        {/*</Item>*/}
                                        {/*<Item onPress={() => {*/}
                                        {/*this._changeGender('Female')*/}
                                        {/*}} style={customStyle.radioInline}>*/}
                                        {/*<Radio*/}
                                        {/*style={customStyle.radioButton}*/}
                                        {/*color={colors.radioNormal}*/}
                                        {/*selectedColor={colors.radioActive}*/}
                                        {/*selected={this.state.gender === 'Female'}*/}
                                        {/*/>*/}
                                        {/*<Text>Female</Text>*/}
                                        {/*</Item>*/}
                                        {/*<Item onPress={() => {*/}
                                        {/*this._changeGender('Other')*/}
                                        {/*}} style={customStyle.radioInline}>*/}
                                        {/*<Radio*/}
                                        {/*style={customStyle.radioButton}*/}
                                        {/*color={colors.radioNormal}*/}
                                        {/*selectedColor={colors.radioActive}*/}
                                        {/*selected={this.state.gender === 'Other'}*/}
                                        {/*/>*/}
                                        {/*<Text>Others</Text>*/}
                                        {/*</Item>*/}
                                        {/*</View>*/}
                                        {/*</View>*/}

                                        <Input
                                            placeholder="Mobile Number"
                                            value={this.state.contact}
                                            keyboardType='phone-pad'
                                            onChangeText={(contact) => this.setState({ contact })}
                                        />

                                        <Input
                                            placeholder="Address"
                                            onFocus={() => this.setState({ locationModal: true })}
                                            onKeyPress={() => this.setState({ locationModal: true })}
                                            value={this.state.address}
                                        />
                                        <View>
                                            <Button
                                                // round
                                                onPress={this.UpdateVisitorProfile}
                                                style={styles.button}
                                            >
                                                <Text style={styles.buttonText}>SAVE</Text>
                                            </Button>
                                        </View>
                                    </View>
                                </KeyboardAvoidingView>
                            </SafeAreaView>
                        </Content>
                    </Container>
                </GalioProvider>
            </TouchableWithoutFeedback>
        );
    }
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

    inputBox: {
        width: 300,
        backgroundColor: colors.inputBackground,
        borderRadius: 25,
        paddingHorizontal: 16,
        fontSize: 16,
        color: colors.whiteText,
        marginVertical: 5
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
        backgroundColor: colors.appLayout,
        borderRadius: 5,
        marginVertical: 10,
        paddingVertical: 13,
        justifyContent:'center',
      },
    buttonText: {
        fontSize: variables.fontSizeLarge,
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

    //signupButton: {
    //color: '#a51822',
    //fontSize: 16,
    //fontWeight: '500'
    //}
    screenHeader: {
        fontSize: 20,
        color: '#ffffff',
    },
});
export default Profile;