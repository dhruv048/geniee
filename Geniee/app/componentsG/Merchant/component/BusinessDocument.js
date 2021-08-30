import React, {useState } from 'react';
import {
    View,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard
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

const RNFS = require('react-native-fs');

const BusinessForm = ({ navigation }) => {

    const [merchantPhoto, setMerchantPhoto] = useState('');
    const [PANNumber, setPANNumber] = useState('');
    const [businessRegistration, setBusinessRegistration] = useState('');
    const [modalVisible,setModalVisible] = useState('');

    const _handleImageUpload = selectedOption => {
        setModalVisible(false);
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
    };
    const _onImageChange = (image) => {
        const compressFormat = 'JPEG';
        const newWidth = image.width > 1440 ? 1440 : image.width;
        const newHeight = image.height > 2960 ? 2960 : image.width;
        handleInputChange('avatarSource', { uri: `data:${image.mime};base64,${image.data}` });
        handleInputChange('Image', image);
    };


    const handleMerchantInfo = () => {
        console.log('This is merchan document');
        navigation.navigate('BusinessCompleted')
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
                                    onPress={() => {
                                        navigation.goBack();
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
                                        _handleImageUpload()
                                    }}
                                    style={{ height: 40, marginTop: 10 }}>
                                    <Text style={{ fontSize: 12, textAlign: 'center' }}>Upload</Text>
                                    <Icon style={{ color: '#ffffff', fontSize: 12 }} name="arrow-up" />
                                </RNPButton>
                            </View>
                            <View style={styles.textInputNameView}>
                                <TextInput
                                    mode="outlined"
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
                                        _handleImageUpload()
                                    }}
                                    style={{ height: 40, marginTop: 10 }}>
                                    <Text style={{ fontSize: 12, textAlign: 'center' }}>Upload</Text>
                                    <Icon style={{ color: '#ffffff', fontSize: 12 }} name="arrow-up" />
                                </RNPButton>
                            </View>
                            <View style={styles.textInputNameView}>
                                <TextInput
                                    mode="outlined"
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
                                        _handleImageUpload()
                                    }}
                                    style={{ height: 40, marginTop: 10 }}>
                                    <Text style={{ fontSize: 12, textAlign: 'center' }}>Upload</Text>
                                    <Icon style={{ color: '#ffffff', fontSize: 12 }} name="arrow-up" />
                                </RNPButton>
                            </View>
                            <RNPButton
                                mode='contained'
                                onPress={() => { handleMerchantInfo() }}
                                uppercase={false}
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