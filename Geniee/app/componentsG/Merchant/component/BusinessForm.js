import React, { Fragment, useCallback, useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    ToastAndroid,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import { colors, customStyle } from '../../../config/styles';
import {
    Container,
    Content,
    Text,
    Picker,
    Header,
    Left,
    Input as NBInput,
    Right
} from 'native-base';
import ActionSheet from 'react-native-actionsheet';
import Icon from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-crop-picker';
import LocationPicker from '../../../components/LocationPicker';
import AsyncStorage from '@react-native-community/async-storage';
import _, { set } from 'lodash';
import { Title, Button as RNPButton, TextInput, Checkbox } from 'react-native-paper';
import { customGalioTheme } from '../../../config/themes';
import UseBusinessForm from '../../../hooks/useBusinessForm';
import { categorySelector } from '../../../store/selectors';
import { connect } from 'react-redux';

const RNFS = require('react-native-fs');

const BusinessForm = ({ navigation, categories }) => {
    const { values, handleInputChange, validateBusinessForm, resetBusinessForm } = UseBusinessForm();

    const [modalVisible, setModalVisible] = useState(false);
    useEffect(() => {
        console.log('This is categories : ' + categories);
    }, [categories]);

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

    const _callSaveServiceMethod = (service) => {
        service.Image = values.Image.value;
        let _service = props.Service;
        if (_service) {
            service.coverImage = _service.coverImage;
            handleInputChange('loading', true);
            Meteor.call('updateService', _service._id, service, (err, res) => {
                handleInputChange('loading', false);
                if (err) {
                    ToastAndroid.showWithGravityAndOffset(
                        err.reason,
                        ToastAndroid.LONG,
                        ToastAndroid.TOP,
                        0,
                        50,
                    );
                    console.log(err.reason);
                } else {
                    ToastAndroid.showWithGravityAndOffset(
                        'Service Updated Successfully!!',
                        ToastAndroid.LONG,
                        ToastAndroid.TOP,
                        0,
                        50,
                    );
                    // hack because react-native-meteor doesn't login right away after sign in
                    resetBusinessForm();
                    Meteor.call('geOwnServiceList', (err, res) => {
                        if (!err) {
                            AsyncStorage.setItem('myServices', res);
                        }
                    });
                    navigation.navigate('Home');
                }
            });
        } else {
            service.owner = Meteor.userId();
            handleInputChange('loading', true);
            Meteor.call('addNewService', service, (err, res) => {
                handleInputChange('loading', false);
                if (err) {
                    ToastAndroid.showWithGravityAndOffset(
                        err.reason,
                        ToastAndroid.LONG,
                        ToastAndroid.TOP,
                        0,
                        50,
                    );
                    console.log(err.reason);
                } else {
                    // hack because react-native-meteor doesn't login right away after sign in
                    resetBusinessForm();
                    navigation.navigate('MyServices');
                }
            });
        }
    };

    const _saveService = () => {
        let service = {
            title: values.title.value,
            selectedCategory: values.selectedCategory.value,
            contact: values.contact.value,
            location: values.location.value,
            coverImage: null,
            contactPerson: values.contactPerson.value,
            panvat: values.panvat.value,
            email: values.email.value,
            website: values.webLink.value,
            businessType: values.businessType.value,
        };
        if (validateBusinessForm() != true) {
            ToastAndroid.showWithGravityAndOffset(
                'Please Enter all the fields with *.',
                ToastAndroid.LONG,
                ToastAndroid.TOP,
                0,
                50,
            );
            //valid = false;
        } else {
            _callSaveServiceMethod(service);
        }
    };

    const handleOnLocationSelect = (location) => {
        delete location.address_components;
        handleInputChange('location', location);
        handleInputChange('pickLocation', false);
    }

    const closePickLocation = () => {
        handleInputChange('pickLocation', false);
    }

    const loadCategoriesTypes = useCallback(() => {
        if (!categories) return;
        return categories.map(category => (
            <Picker.Item key={category._id} label={category.title} value={category._id} />
        ))
    }, [categories]);

    const handleMerchantInfo = () => {
        console.log('This is merchanInfo');
        navigation.navigate('BusinessDocument');
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
                                Your merch info,
                            </Text>
                            <Text
                                style={styles.textSubHeader}>
                                Please fill authentic data below
                            </Text>
                        </View>
                        <View style={styles.containerRegister}>
                            <TextInput
                                mode="outlined"
                                color={customGalioTheme.COLORS.INPUT_TEXT}
                                placeholder="Merchant Name"
                                placeholderTextColor="#808080"
                                value={values.merchantName.value}
                                onChangeText={(value) => handleInputChange('merchantName', value)}
                                style={styles.inputBox}
                            />
                            <View
                                style={styles.categoryPicker}>
                                <Picker
                                    placeholder='Select Categories'
                                    selectedValue={values.selectedCategory.value}
                                    onValueChange={(itemValue, itemIndex) => handleInputChange('selectedCategory', itemValue)
                                    }>
                                    {loadCategoriesTypes()}
                                </Picker>
                            </View>
                            <View style={styles.textInputNameView}>
                                <TextInput
                                    mode="outlined"
                                    color={customGalioTheme.COLORS.INPUT_TEXT}
                                    placeholder="District"
                                    placeholderTextColor="#808080"
                                    name="district"
                                    value={values.district.value}
                                    onChangeText={(value) => handleInputChange('district', value)}
                                    style={styles.textInputNameBox}
                                    error={values.district.error}
                                />

                                <TextInput
                                    mode="outlined"
                                    color={customGalioTheme.COLORS.INPUT_TEXT}
                                    placeholder="City"
                                    placeholderTextColor="#808080"
                                    name="city"
                                    value={values.city.value}
                                    onChangeText={(value) => handleInputChange('city', value)}
                                    style={styles.textInputNameBox}
                                    error={values.city.error}
                                />
                            </View>
                            <TextInput
                                mode="outlined"
                                color={customGalioTheme.COLORS.INPUT_TEXT}
                                placeholder="Nearest Landmark"
                                placeholderTextColor="#808080"
                                value={values.nearestLandmark.value}
                                onChangeText={(value) => handleInputChange('nearestLandmark', value)}
                                style={styles.inputBox}
                                error={values.nearestLandmark.error}
                            />
                            <TextInput
                                mode="outlined"
                                color={customGalioTheme.COLORS.INPUT_TEXT}
                                //   onBlur={()=>this.setState({pickLocation:true})}
                                onFocus={() => handleInputChange('pickLocation', true)}
                                placeholder="Location"
                                placeholderTextColor='#808080'
                                value={values.location.value ? values.location.value.formatted_address : ""}
                                //   onChangeText={(radius) => this.setState({radius})}
                                style={styles.inputBox}
                            />
                            <TextInput
                                mode="outlined"
                                color={customGalioTheme.COLORS.INPUT_TEXT}
                                placeholder="PAN Number"
                                placeholderTextColor='#808080'
                                value={values.panNumber.value}
                                onChangeText={(value) => handleInputChange('panNumber', value)}
                                style={styles.inputBox}
                            />
                            <TextInput
                                mode="outlined"
                                color={customGalioTheme.COLORS.INPUT_TEXT}
                                // style={{width:'90%'}}
                                placeholder="Business contacts number"
                                placeholderTextColor='#808080'
                                keyboardType="phone-pad"
                                onChangeText={(value) => handleInputChange('contact', value)}
                                value={values.contact.value}
                                style={styles.inputBox}
                            />
                            <TextInput
                                mode="outlined"
                                color={customGalioTheme.COLORS.INPUT_TEXT}
                                placeholder="Business contacts email"
                                placeholderTextColor='#808080'
                                onChangeText={(value) => handleInputChange('email', value)}
                                value={values.email.value}
                                style={styles.inputBox}
                            />
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
            <LocationPicker
                close={closePickLocation}
                onLocationSelect={handleOnLocationSelect}
                modalVisible={values.pickLocation.value}
            />
        </Container>

    );
}
export default connect(categorySelector)(BusinessForm);

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
        marginBottom: 15,
    },
    textInputNameView:
    {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },

    textInputNameBox: {
        width: '55%',
        height: 48,
        borderRadius: 3.5,
        paddingHorizontal: 10,
        color: 'rgba(0, 0, 0, 0.6)',
        fontSize: 18,
        backgroundColor: colors.transparent,
        marginBottom: 10,
    },

    inputBox: {
        width: '100%',
        height: 48,
        borderRadius: 3.5,
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
        marginVertical: 8,
        marginLeft: '25%',
        borderRadius: 4,
        height: 50,
    },
    btnText: {
        fontSize: 20,
        fontWeight: '500',
        color: colors.whiteText,
    },
    categoryPicker: {
        width: '100%',
        height: 48,
        marginBottom: 10,
        backgroundColor: customGalioTheme.COLORS.WHITE,
        borderRadius: customGalioTheme.SIZES.INPUT_BORDER_RADIUS,
        borderWidth: customGalioTheme.SIZES.INPUT_BORDER_WIDTH,
        borderColor: customGalioTheme.COLORS.PLACEHOLDER,
    }
});