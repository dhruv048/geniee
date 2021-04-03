import React, {PureComponent} from 'react';
import AsyncStorage from "@react-native-community/async-storage";
import {colors, customStyle} from "../../config/styles";
import Meteor from '../../react-native-meteor';
import {Container, Content, Header, Item, Input, Label, Text, Radio} from "native-base";
import UploadProfilePic from '../../components/UploadProfilePic/UploadProfilePic';
import {KeyboardAvoidingView, SafeAreaView, StatusBar, TouchableNativeFeedback, View, StyleSheet,ToastAndroid} from "react-native";
import Icon from 'react-native-vector-icons/Feather';
import {backToRoot} from "../../Navigation";

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
        this.loggedUser =  Meteor.user() ? Meteor.user():JSON.parse(user);
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

    UpdateVisitorProfile=()=>{
        const {name, contact, email, address} = this.state;
        let profile=this.loggedUser.profile;
        profile.name = name;
        profile.contactNo=contact;
        profile.email=email;

        Meteor.call('updateProfile',profile,(err,res)=>{
            if(err){
                console.log(err)
            }
            else{
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
            <Container style={styles.container}>
                {/*<Header androidStatusBarColor={colors.statusBar} style={{backgroundColor: '#094c6b'}}/>*/}
                <StatusBar
                    backgroundColor={colors.statusBar}
                    barStyle='light-content'
                />
                <Header style={{
                    backgroundColor: '#fff',
                    elevation: 0,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    height: 60
                }} androidStatusBarColor={colors.statusBar}>
                    <View>
                        <View>
                            <TouchableNativeFeedback onPress={() => {
                                this.props.navigation.navigate('Home')
                            }}>
                                <View>
                                    <Icon name='arrow-left' color={colors.primary} size={24}/>
                                </View>
                            </TouchableNativeFeedback>
                        </View>
                    </View>
                    <View>
                        <View>
                            <TouchableNativeFeedback onPress={this.UpdateVisitorProfile}>
                                <View>
                                    <Icon name='check' color={colors.primary} size={24}/>
                                </View>
                            </TouchableNativeFeedback>
                        </View>
                    </View>
                </Header>
                <Content>
                    <SafeAreaView style={{flex: 1}} keyboardShouldPersistTaps='always'>
                        <UploadProfilePic/>
                        <KeyboardAvoidingView>
                            <View style={styles.containerRegister}>
                                <Item inlineLabel style={customStyle.formGroup}>
                                    <Label style={customStyle.formLabel}>Name</Label>
                                    <Input
                                        style={customStyle.formControl}
                                        value={this.state.name}
                                        onChangeText={(name) => this.setState({name})}
                                    />
                                </Item>
                                <Item inlineLabel style={customStyle.formGroup}>
                                    <Label style={customStyle.formLabel}>Email</Label>
                                    <Input
                                        style={customStyle.formControl}
                                        value={this.state.email}
                                        onChangeText={(email) => this.setState({email})}
                                    />
                                </Item>
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
                                <Item inlineLabel style={customStyle.formGroup}>
                                    <Label style={customStyle.formLabel}>Mobile</Label>
                                    <Input
                                        style={customStyle.formControl}
                                        value={this.state.contact}
                                        keyboardType='phone-pad'
                                        onChangeText={(contact) => this.setState({contact})}
                                    />
                                </Item>
                                <Item inlineLabel style={customStyle.formGroup}>
                                    <Label style={customStyle.formLabel}>Address</Label>
                                    <Input
                                        style={customStyle.formControl}
                                        onFocus={() => this.setState({locationModal: true})}
                                        onKeyPress={() => this.setState({locationModal: true})}
                                        value={this.state.address}
                                    />
                                </Item>
                            </View>
                        </KeyboardAvoidingView>
                    </SafeAreaView>
                </Content>
            </Container>
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
        flex: 1,
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
        width: 300,
        backgroundColor: 'blue',
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
export default Profile;