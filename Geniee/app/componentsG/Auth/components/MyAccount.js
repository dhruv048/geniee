import React, { PureComponent, useCallback, useEffect, useState } from 'react';
import AsyncStorage from "@react-native-community/async-storage";
import { colors, customStyle, variables } from "../../../config/styles";
import Meteor from '../../../react-native-meteor';
import { Container, Content, Header, Item, Label, Text, Radio, Left, Body, Title, Icon, Right, Button } from "native-base";
import UploadProfilePic from '../../../components/UploadProfilePic/UploadProfilePic';
import {
    KeyboardAvoidingView, SafeAreaView, StatusBar, TouchableNativeFeedback, View,
    StyleSheet, ToastAndroid, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Alert, Image
} from "react-native";
import { Button as RNPButton, Switch, ToggleButton } from 'react-native-paper'
import FIcon from 'react-native-vector-icons/Feather';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import AIcon from 'react-native-vector-icons/AntDesign';
import authHandlers from '../../../store/services/auth/handlers';
import merchantHandlers from "../../../store/services/merchant/handlers";
const USER_TOKEN_KEY = 'USER_TOKEN_KEY_GENNIE';
import Share from 'react-native-share';
import Loading from '../../../components/Loading';
import Statusbar from '../../Shared/components/Statusbar';
import { customPaperTheme } from '../../../config/themes';
import { connect } from 'react-redux';
import { loggedUserSelector } from '../../../store/selectors';

const MyAccount = (props) => {

    const [isMerchant, setIsMerchant] = useState(false);
    const [userName, setUserName] = useState('User');
    const [merchantUser, setMerchantUser] = useState(false);

    let loggedUser = props.loggedUser;
    useEffect(async () => {
        //let user = await AsyncStorage.getItem('loggedUser');
        //let loggedUser;
        //let profile;
        //let user = props.loggedUser;
        //loggedUser = user ? user : Meteor.user();
        //profile = Meteor.user() ? Meteor.user().profile : this.loggedUser.profile;
        //this._updateState(this.loggedUser.profile)
        setUserName(loggedUser.profile.firstName + ' ' + loggedUser.profile.lastName);

        getBusinessInfo();
    }, [])

    const getBusinessInfo = useCallback(() => {
        merchantHandlers.getBusinessInfo(loggedUser, (res) => {
            if (res) {
                setMerchantUser(true);
            } else {
                setMerchantUser(false);
            }
        })
    }, [])

    const _signOut = async () => {
        Alert.alert(
            'SignOut',
            'Do you want to SignOut?',
            [
                {
                    text: 'Yes SignOut',
                    onPress: authHandlers.handleSignOut((res) => {
                        if (res === true) {
                            AsyncStorage.setItem(USER_TOKEN_KEY, '');
                            props.navigation.navigate('Home');
                        } else {
                            console.log('Please contact administrator.')
                        }
                    })
                },
                { text: 'Cancel', onPress: () => { } }
            ],
            { cancelable: false }
        );
    }

    inviteFriends = async () => {
        const shareOptions = {
            message: 'Geniee App',
            url: 'www.google.com'
        }
        try {
            const shareResponse = await Share.open(shareOptions);
            console.log(JSON.stringify(shareResponse));
        } catch (error) {
            console.log(' Error => ', error);
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <SafeAreaView style={{ flex: 1 }} keyboardShouldPersistTaps='always'>
                <Statusbar />
                <Header
                    androidStatusBarColor={colors.statusBar}
                    style={{ backgroundColor: colors.statusBar, marginTop: customPaperTheme.headerMarginVertical }}
                >
                    <RNPButton
                        transparent
                        uppercase={false}
                        style={{ width: '100%', alignItems: 'flex-start' }}
                        onPress={() => {
                            props.navigation.goBack();
                        }}>
                        <FIcon style={{ color: '#ffffff', fontSize: 20 }} name="arrow-left" />
                        <Text style={{ color: colors.whiteText, fontSize: 20 }}>My Account</Text>
                    </RNPButton>
                </Header>
                <Content>
                    <View>
                        <View style={[{ flexDirection: 'row', backgroundColor: '#F0F8FF' }]}>
                            <UploadProfilePic />
                            <View style={{ marginTop: 30, marginLeft: 20, }}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.statusBar }}>{userName}</Text>
                                {isMerchant ? <Text style={{ fontSize: 12, fontWeight: 'bold', color: colors.statusBar }}>My Design Store</Text> : null}
                            </View>
                        </View>
                        {!merchantUser ?
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', backgroundColor: '#F0F8FF', paddingBottom: 15}}>
                                <Text style={{ fontWeight: 'bold', color: colors.statusBar }}>User</Text>
                            </View>
                            :
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#F0F8FF', paddingBottom: 15 }}>
                                {!isMerchant ? <Text style={{ fontWeight: 'bold', color: colors.statusBar }}>User</Text> : <Text style={{ color: colors.statusBar }}>User</Text>}
                                <Switch
                                    value={isMerchant}
                                    onValueChange={() => setIsMerchant(!isMerchant)}
                                    color={colors.statusBar}
                                />
                                {isMerchant ? <Text style={{ fontWeight: 'bold', color: colors.statusBar }}>Merchant</Text> : <Text style={{ color: colors.statusBar }}>Merchant</Text>}
                            </View>}
                        <KeyboardAvoidingView>
                            <View style={styles.containerRegister}>
                                {!isMerchant ?
                                    <TouchableOpacity
                                        onPress={() => { }}>
                                        <View style={{ flexDirection: 'row', paddingVertical: 10 }}>
                                            <MIcon style={{ fontSize: 20 }} name='playlist-add-check' />
                                            <Text style={{ fontSize: 14, marginLeft: 10 }}>My WishList</Text>
                                            <MIcon style={{ fontSize: 20, marginLeft: 'auto' }} name='chevron-right' />
                                        </View>
                                    </TouchableOpacity> : <TouchableOpacity
                                        onPress={() => { props.navigation.navigate('Inventory', { loggedUser: loggedUser }) }}>
                                        <View style={{ flexDirection: 'row', paddingVertical: 10 }}>
                                            <MIcon style={{ fontSize: 20 }} name='playlist-add-check' />
                                            <Text style={{ fontSize: 14, marginLeft: 10 }}>My Inventory</Text>
                                            <MIcon style={{ fontSize: 20, marginLeft: 'auto' }} name='chevron-right' />
                                        </View>
                                    </TouchableOpacity>}
                                <TouchableOpacity
                                    onPress={() => { }}>
                                    <View style={{ flexDirection: 'row', paddingVertical: 10 }}>
                                        <Icon style={{ fontSize: 20 }} name='map' />
                                        <Text style={{ fontSize: 14, marginLeft: 10 }}>Address Book</Text>
                                        <MIcon style={{ fontSize: 20, marginLeft: 'auto' }} name='chevron-right' />
                                    </View>
                                </TouchableOpacity>
                                <View><Text style={{ fontWeight: 'bold', marginTop: 30, marginBottom: 10 }}>Buy & Selling</Text></View>
                                {isMerchant ? <TouchableOpacity
                                    onPress={() => { props.navigation.navigate('Earnings', { loggedUser: loggedUser }) }}>
                                    <View style={{ flexDirection: 'row', paddingVertical: 10 }}>
                                        <MIcon style={{ fontSize: 20 }} name='money' />
                                        <Text style={{ fontSize: 14, marginLeft: 10 }}>Earnings</Text>
                                        <MIcon style={{ fontSize: 20, marginLeft: 'auto' }} name='chevron-right' />
                                    </View>
                                </TouchableOpacity> : null}
                                <TouchableOpacity
                                    onPress={() => { props.navigation.navigate('MyOrders', { loggedUser: loggedUser }) }}>
                                    <View style={{ flexDirection: 'row', paddingVertical: 10 }}>
                                        <MIcon style={{ fontSize: 20 }} name='view-carousel' />
                                        <Text style={{ fontSize: 14, marginLeft: 10 }}>My Orders</Text>
                                        <MIcon style={{ fontSize: 20, marginLeft: 'auto' }} name='chevron-right' />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => { }}>
                                    <View style={{ flexDirection: 'row', paddingVertical: 10 }}>
                                        <MIcon style={{ fontSize: 20 }} name='all-inbox' />
                                        <Text style={{ fontSize: 14, marginLeft: 10 }}>My Thrifts</Text>
                                        <MIcon style={{ fontSize: 20, marginLeft: 'auto' }} name='chevron-right' />
                                    </View>
                                </TouchableOpacity>
                                <View><Text style={{ fontWeight: 'bold', marginTop: 30, marginBottom: 10 }}>General</Text></View>
                                <TouchableOpacity
                                    onPress={() => { props.navigation.navigate('Profile') }}>
                                    <View style={{ flexDirection: 'row', paddingVertical: 10 }}>
                                        <MIcon style={{ fontSize: 20 }} name='view-carousel' />
                                        <Text style={{ fontSize: 14, marginLeft: 10 }}>Update Profile</Text>
                                        <MIcon style={{ fontSize: 20, marginLeft: 'auto' }} name='chevron-right' />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => { props.navigation.navigate('ForgotPassword') }}>
                                    <View style={{ flexDirection: 'row', paddingVertical: 10 }}>
                                        <MIcon style={{ fontSize: 20 }} name='vpn-key' />
                                        <Text style={{ fontSize: 14, marginLeft: 10 }}>Change Password</Text>
                                        <MIcon style={{ fontSize: 20, marginLeft: 'auto' }} name='chevron-right' />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => { inviteFriends() }}>
                                    <View style={{ flexDirection: 'row', paddingVertical: 10 }}>
                                        <MIcon style={{ fontSize: 20 }} name='insert-invitation' />
                                        <Text style={{ fontSize: 14, marginLeft: 10 }}>Invite Friends</Text>
                                        <MIcon style={{ fontSize: 20, marginLeft: 'auto' }} name='chevron-right' />
                                    </View>
                                </TouchableOpacity>
                                {isMerchant && merchantUser ?
                                    <TouchableOpacity
                                        onPress={() => { props.navigation.navigate('ProductInfo', { data: loggedUser }) }}>
                                        <View style={{ flexDirection: 'row', paddingVertical: 10 }}>
                                            <MIcon style={{ fontSize: 20 }} name='storefront' />
                                            <Text style={{ fontSize: 14, marginLeft: 10 }}>Add Product</Text>
                                            <MIcon style={{ fontSize: 20, marginLeft: 'auto' }} name='chevron-right' />
                                        </View>
                                    </TouchableOpacity> :
                                    <TouchableOpacity
                                        onPress={() => { props.navigation.navigate('BecomeSeller', { data: loggedUser }) }}>
                                        <View style={{ flexDirection: 'row', paddingVertical: 10 }}>
                                            <MIcon style={{ fontSize: 20 }} name='storefront' />
                                            <Text style={{ fontSize: 14, marginLeft: 10 }}>Become Merchant</Text>
                                            <MIcon style={{ fontSize: 20, marginLeft: 'auto' }} name='chevron-right' />
                                        </View>
                                    </TouchableOpacity>
                                }
                                <TouchableOpacity
                                    onPress={() => { props.navigation.navigate('ContactUs') }}>
                                    <View style={{ flexDirection: 'row', paddingVertical: 10 }}>
                                        <AIcon style={{ fontSize: 20 }} name='customerservice' />
                                        <Text style={{ fontSize: 14, marginLeft: 10 }}>Support Customer Care</Text>
                                        <MIcon style={{ fontSize: 20, marginLeft: 'auto' }} name='chevron-right' />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => { _signOut() }}>
                                    <View style={{ flexDirection: 'row', paddingVertical: 10, marginBottom: 50 }}>
                                        <AIcon style={{ fontSize: 20, fontWeight: 'bold' }} name='logout' />
                                        <Text style={{ fontSize: 14, marginLeft: 10, fontWeight: 'bold' }}>Logout</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </KeyboardAvoidingView>
                    </View>
                </Content>
            </SafeAreaView>
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
        padding: 20,
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
        justifyContent: 'center',
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
export default connect(loggedUserSelector)(MyAccount);