import React, { useRef, useState } from 'react';
import {
    View,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard,
    Image
} from 'react-native';
import { colors, customStyle } from '../../../config/styles';
import {
    Container,
    Content,
    Text,
    Header,
    Left,
    Right
} from 'native-base';
import ActionSheet from 'react-native-actionsheet';
import Icon from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-crop-picker';
import { Title, Button as RNPButton, TextInput, Checkbox } from 'react-native-paper';
import { customGalioTheme } from '../../../config/themes';
import { launchImageLibrary } from 'react-native-image-picker';
import merchantHandlers from '../../../store/services/merchant/handlers';

const RNFS = require('react-native-fs');

const BusinessForm = (props) => {
    let actionsheet = useRef();
    const [merchantPhoto, setMerchantPhoto] = useState('Merchant image');
    const [PANNumber, setPANNumber] = useState('PAN Number image');
    const [businessRegistration, setBusinessRegistration] = useState('Registration image');
    const [merchantImage, setMerchantImage] = useState('');
    const [PANImage, setPANImage] = useState('');
    const [registrationImage, setRegistrationImage] = useState('');
    const [isMerchant, setIsMerchant] = useState(false);
    const [isPAN, setIsPAN] = useState(false);
    const [isRegistration, setIsRegistration] = useState(false);
    const [loading, setLoading] = useState(false);

    const chooseImage = (selectedOption) => {
        if (selectedOption === 0) {
            ImagePicker.openCamera({
                width: 1440,
                height: 720,
                cropping: true,
                includeBase64: true,
                compressImageMaxWidth: 1440,
                compressImageMaxHeight: 720,
                compressImageQuality: 0.8,
            }).then(image => {
                _onImageChange(image);
            });
        } else if (selectedOption === 1) {
            ImagePicker.openPicker({
                width: 1440,
                height: 720,
                cropping: true,
                includeBase64: true,
                compressImageMaxWidth: 1440,
                compressImageMaxHeight: 720,
                compressImageQuality: 0.8,
            }).then(image => {
                _onImageChange(image);
            });
        }
    }

    const _onImageChange = (image) => {
        const imagedata = `data:${image.mime};base64,${image.data}`;
        if (isMerchant) {
            setMerchantImage(imagedata);
        } else if (isPAN) {
            setPANImage(imagedata);
        } else if (isRegistration) {
            setRegistrationImage(imagedata);
        }
        setImageData(imagedata);
        setIsMerchant(false);
        setIsPAN(false);
        setIsRegistration(false);

    };

    const handleMerchantInfo =()=>{
        props.navigation.navigate('BusinessCompleted');
    }
    
    const handleMerchantInfo1 = () => {
        let business = props.route.params.businessData;
        //prepare for database
        business.merchantImage = merchantImage;
        business.PANImage = PANImage;
        business.registrationImage = registrationImage;

        setLoading(true);
        merchantHandlers.addBusiness(business, (res) => {
            if (!res) {
                console.log('result from Merchant error ' + err.reason);
                ToastAndroid.showWithGravityAndOffset(
                    err.reason,
                    ToastAndroid.LONG,
                    ToastAndroid.TOP,
                    0,
                    50,
                );
            } else {
                // hack because react-native-meteor doesn't login right away after sign in
                console.log('Result from Merchant register' + res);
                ToastAndroid.showWithGravityAndOffset(
                    'Business Registered Successfully',
                    ToastAndroid.LONG,
                    ToastAndroid.TOP,
                    0,
                    50,
                );
                setLoading(false);
                //resetAddressDetailForm();
                props.navigation.navigate('BusinessCompleted');
            }
        });
        setLoading(false);
    }

    return (
        <Container style={styles.container}>
            <Content style={{ padding: Platform.OS === 'ios' ? 20 : 0 }}>
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
                                        back
                                    </Text>
                                </RNPButton>
                            </Left>
                            <Right>

                            </Right>
                        </Header>
                        <View style={styles.welcomeText}>
                            <Text
                                style={styles.textHeader}>
                                Upload some supporting documents,
                            </Text>
                            <Text
                                style={styles.textSubHeader}>
                                Please fill authentic data below
                            </Text>
                        </View>
                        <View style={styles.containerRegister}>
                            <View style={styles.textInputNameView}>
                                <TextInput
                                    mode="outlined"
                                    disabled= {true}
                                    color={customGalioTheme.COLORS.INPUT_TEXT}
                                    placeholder="Photo of Merchant"
                                    placeholderTextColor="#808080"
                                    name="merchantPhoto"
                                    value={merchantPhoto}
                                    onChangeText={(value) => setMerchantPhoto(value)}
                                    style={styles.textInputNameBox}
                                />
                                <RNPButton
                                    mode='contained'
                                    uppercase={false}
                                    onPress={() => {
                                        setIsMerchant(true);
                                        actionsheet.current.show();
                                    }}
                                    style={{ height: 40, marginTop: 10 }}>
                                    <Text style={{ fontSize: 12, textAlign: 'center' }}>Upload</Text>
                                    <Icon style={{ color: '#ffffff', fontSize: 12 }} name="arrow-up" />
                                </RNPButton>
                            </View>
                            <View>
                                {merchantPhoto ?
                                    <Image
                                        source={{ uri: merchantImage }}
                                        style={{ width: 100, height: 100, marginBottom: 10 }}
                                    /> : null
                                }
                            </View>
                            <View style={styles.textInputNameView}>
                                <TextInput
                                    mode="outlined"
                                    disabled= {true}
                                    color={customGalioTheme.COLORS.INPUT_TEXT}
                                    placeholder="PAN Number"
                                    placeholderTextColor="#808080"
                                    name="PANNumber"
                                    value={PANNumber}
                                    onChangeText={(value) => setPANNumber(value)}
                                    style={styles.textInputNameBox}
                                />
                                <RNPButton
                                    mode='contained'
                                    uppercase={false}
                                    onPress={() => {
                                        setIsPAN(true);
                                        actionsheet.current.show();
                                    }}
                                    style={{ height: 40, marginTop: 10 }}>
                                    <Text style={{ fontSize: 12, textAlign: 'center' }}>Upload</Text>
                                    <Icon style={{ color: '#ffffff', fontSize: 12 }} name="arrow-up" />
                                </RNPButton>
                            </View>
                            <View>
                                {PANNumber ?
                                    <Image
                                        source={{ uri: PANImage }}
                                        style={{ width: 100, height: 100, marginBottom: 10 }}
                                    /> : null
                                }
                            </View>
                            <View style={styles.textInputNameView}>
                                <TextInput
                                    mode="outlined"
                                    disabled= {true}
                                    color={customGalioTheme.COLORS.INPUT_TEXT}
                                    placeholder="Business Registration"
                                    placeholderTextColor="#808080"
                                    name="businessRegistration"
                                    value={businessRegistration}
                                    onChangeText={(value) => setBusinessRegistration(value)}
                                    style={styles.textInputNameBox}
                                />
                                <RNPButton
                                    mode='contained'
                                    uppercase={false}
                                    onPress={() => {
                                        setIsRegistration(true);
                                        actionsheet.current.show();
                                    }}
                                    style={{ height: 40, marginTop: 10 }}>
                                    <Text style={{ fontSize: 12, textAlign: 'center' }}>Upload</Text>
                                    <Icon style={{ color: '#ffffff', fontSize: 12 }} name="arrow-up" />
                                </RNPButton>
                            </View>
                            <View>
                                {businessRegistration ?
                                    <Image
                                        source={{ uri: registrationImage }}
                                        style={{ width: 100, height: 100, marginBottom: 10 }}
                                    /> : null
                                }
                            </View>
                            <RNPButton
                                mode='contained'
                                onPress={() => { handleMerchantInfo() }}
                                uppercase={false}
                                loading={loading}
                                style={styles.btnContinue}
                            >
                                <Text
                                    style={styles.btnText}>
                                    Continue
                                </Text>
                                <Icon style={{ color: '#ffffff', fontSize: 20 }} name="arrow-right" />
                            </RNPButton>
                        </View>

                    </View>

                </TouchableWithoutFeedback>
                <ActionSheet
                    ref={actionsheet}
                    title={'Please select the option'}
                    options={[
                        <Text style={{ color: colors.appLayout }}>
                            Take Picture from Camera
                        </Text>,
                        <Text style={{ color: colors.appLayout }}>
                            Pick Image from Gallery
                        </Text>,
                        'Cancel',
                    ]}
                    cancelButtonIndex={2}
                    destructiveButtonIndex={2}
                    onPress={index => {
                        chooseImage(index);
                    }}
                />
            </Content>
        </Container>

    );
}
export default BusinessForm;

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
        //marginTop: 5,
    },

    textHeader: {
        fontSize: 20,
        color: 'rgba(0, 0, 0, 0.87)',
        marginBottom: 5,
        marginTop: 25,
        fontWeight: 'bold'
    },

    textSubHeader: {
        fontSize: 16,
        color: 'rgba(0, 0, 0, 0.87)',
        marginBottom: 25,
    },
    textInputNameView:
    {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },

    textInputNameBox: {
        width: '80%',
        height: 48,
        borderRadius: 3.5,
        paddingHorizontal: 10,
        color: 'rgba(0, 0, 0, 0.6)',
        fontSize: 18,
        backgroundColor: colors.transparent,
        marginBottom: 10,
    },

    welcomeText: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        flexDirection: 'column',
        paddingHorizontal: 20,
    },
    btnContinue: {
        width: '45%',
        marginVertical: 15,
        marginLeft: '25%',
        borderRadius: 4,
        height: 50,
    },
    btnText: {
        fontSize: 20,
        fontWeight: '500',
        color: colors.whiteText,
    },
});