import React, { Fragment, useCallback, useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    ToastAndroid,
    TouchableWithoutFeedback,
    Keyboard,
    SafeAreaView
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
import { customGalioTheme, customPaperTheme } from '../../../config/themes';
import UseBusinessForm from '../../../hooks/useBusinessForm';
import { businessTypesSelector, categorySelector } from '../../../store/selectors';
import { connect } from 'react-redux';
import { ProgressViewIOSComponent } from 'react-native';
import Meteor from '../../../react-native-meteor';
import handlers from '../../../store/services/categories/handlers';
import combineSelectors from '../../../helpers';
const RNFS = require('react-native-fs');

const BusinessForm = (props) => {
    const { values, handleInputChange, validateBusinessForm, resetBusinessForm } = UseBusinessForm();
    const registerUser = props.route.params.data;
    const [pickLocation, setPickLocation] = useState(false);
    const [location, setLocation] = useState('');

    const merchantOwner = Meteor.userId() ? Meteor.userId() : registerUser;

    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        handlers.getAllBusinessType((res) => {
            if (res) {
                //setBusinessTypes(res.result);
            }
        });
    }, []);

    const handleOnLocationSelect = (location) => {
        let city = '';
        let district = '';
        for (var i = 0; i < location.address_components.length; i++) {
            for (var b = 0; b < location.address_components[i].types.length; b++) {

                //there are different types that might hold a city admin_area_lvl_1 usually does in come cases looking for sublocality type will be more appropriate
                if (location.address_components[i].types[b] == "locality") {
                    //this is the object you are looking for
                    city = location.address_components[i];
                }
                if (location.address_components[i].types[b] == "administrative_area_level_2") {
                    //this is the object you are looking for
                    district = location.address_components[i];
                }
            }
        }

        delete location.address_components;
        setLocation(location.formatted_address);
        handleInputChange('district', district.long_name);
        handleInputChange('city', city.long_name)
        setPickLocation(false);
    }

    const closePickLocation = () => {
        setPickLocation(false);
    }

    const loadBusinessTypes = useCallback(() => {
        if (!props.businessTypes) return;
        return props.businessTypes.map(item => (
            <Picker.Item key={item._id} label={item.title} value={item._id} style={styles.inputBox} />
        ))
    }, [props.businessTypes]);


    const loadCategoriesTypes = useCallback(() => {
        if (!props.categories) return;
        return props.categories.map(category => (
            category.subCategories.map(subCategory => (
                <Picker.Item key={subCategory._id} label={subCategory.title} value={subCategory._id} style={styles.inputBox} />
            )
            )
        ))
    });

    const handleMerchantInfo = () => {
        //if(!validateBusinessForm()){
        //preparing for Database
        let business = {
            businessName: values.merchantName.value,
            selectedCategory: values.selectedCategory.value,
            businessTypes: values.businessType.value,
            district: values.district.value,
            city: values.city.value,
            nearestLandmark: values.nearestLandmark.value,
            location: location,
            panNumber: values.panNumber.value,
            contact: values.contact.value,
            email: values.email.value,
            owner: merchantOwner
        };
        //}
        props.navigation.navigate('BusinessDocument', { businessData: business });
        resetBusinessForm();
    }

    return (
        <SafeAreaView style={{ flex: 1 }} keyboardShouldPersistTaps='always'>
            <Content style={{ padding: Platform.OS === 'ios' ? 20 : 0 }}>
                <TouchableWithoutFeedback
                    onPress={Keyboard.dismiss}
                    accessible={false}>
                    <View style={{ paddingTop: 0 }}>
                        {/* <Logo />*/}

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
                                <Icon style={{ color: '#ffffff', fontSize: 20 }} name="arrow-left" />
                                <Text style={{ color: colors.whiteText, fontSize: 20 }}>Back</Text>
                            </RNPButton>
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
                                placeholder="Business Name"
                                placeholderTextColor="#808080"
                                label="Business Name"
                                value={values.merchantName.value}
                                onChangeText={(value) => handleInputChange('merchantName', value)}
                                style={styles.inputBox}
                                theme={{ roundness: 6 }}
                            />
                            <View
                                style={styles.categoryPicker}>
                                <Picker
                                    placeholder='Select BusinessType'
                                    selectedValue={values.businessType.value}
                                    onValueChange={(itemValue, itemIndex) => handleInputChange('businessType', itemValue)
                                    }>
                                    <Picker.Item label='Select Business Type' value='0' style={styles.inputBox} />
                                    {loadBusinessTypes()}
                                </Picker>
                            </View>
                            <View
                                style={styles.categoryPicker}>
                                <Picker
                                    placeholder='Select Categories'
                                    selectedValue={values.selectedCategory.value}
                                    onValueChange={(itemValue, itemIndex) => handleInputChange('selectedCategory', itemValue)
                                    }>
                                    <Picker.Item label='Select Category' value='0' style={styles.inputBox} />
                                    {loadCategoriesTypes()}
                                </Picker>
                            </View>
                            <TextInput
                                mode="outlined"
                                color={customGalioTheme.COLORS.INPUT_TEXT}
                                label="Location"
                                onFocus={() => setPickLocation(true)}
                                placeholder="Location"
                                placeholderTextColor='#808080'
                                value={location}
                                //   onChangeText={(radius) => this.setState({radius})}
                                style={styles.inputBox}
                                theme={{ roundness: 6 }}
                            />
                            <View style={styles.textInputNameView}>
                                <TextInput
                                    mode="outlined"
                                    color={customGalioTheme.COLORS.INPUT_TEXT}
                                    placeholder="District"
                                    placeholderTextColor="#808080"
                                    label="District"
                                    name="district"
                                    value={values.district.value}
                                    onChangeText={(value) => handleInputChange('district', value)}
                                    style={styles.textInputNameBox}
                                    error={values.district.error}
                                    theme={{ roundness: 6 }}
                                />

                                <TextInput
                                    mode="outlined"
                                    color={customGalioTheme.COLORS.INPUT_TEXT}
                                    placeholder="City"
                                    label="City"
                                    placeholderTextColor="#808080"
                                    name="city"
                                    value={values.city.value}
                                    onChangeText={(value) => handleInputChange('city', value)}
                                    style={styles.textInputNameBox}
                                    error={values.city.error}
                                    theme={{ roundness: 6 }}
                                />
                            </View>
                            <TextInput
                                mode="outlined"
                                color={customGalioTheme.COLORS.INPUT_TEXT}
                                placeholder="Nearest Landmark"
                                label="Nearest Landmark"
                                placeholderTextColor="#808080"
                                value={values.nearestLandmark.value}
                                onChangeText={(value) => handleInputChange('nearestLandmark', value)}
                                style={styles.inputBox}
                                error={values.nearestLandmark.error}
                                theme={{ roundness: 6 }}
                            />

                            <TextInput
                                mode="outlined"
                                color={customGalioTheme.COLORS.INPUT_TEXT}
                                placeholder="PAN Number"
                                label="PAN Number"
                                placeholderTextColor='#808080'
                                value={values.panNumber.value}
                                onChangeText={(value) => handleInputChange('panNumber', value)}
                                style={styles.inputBox}
                                theme={{ roundness: 6 }}
                            />
                            <TextInput
                                mode="outlined"
                                color={customGalioTheme.COLORS.INPUT_TEXT}
                                // style={{width:'90%'}}
                                placeholder="Business contacts number"
                                label="Business contacts number"
                                placeholderTextColor='#808080'
                                keyboardType="phone-pad"
                                onChangeText={(value) => handleInputChange('contact', value)}
                                value={values.contact.value}
                                style={styles.inputBox}
                                theme={{ roundness: 6 }}
                            />
                            <TextInput
                                mode="outlined"
                                color={customGalioTheme.COLORS.INPUT_TEXT}
                                placeholder="Business contacts email"
                                label="Business contacts email"
                                placeholderTextColor='#808080'
                                onChangeText={(value) => handleInputChange('email', value)}
                                value={values.email.value}
                                style={styles.inputBox}
                                theme={{ roundness: 6 }}
                            />
                            <RNPButton
                                mode='contained'
                                onPress={() => { handleMerchantInfo() }}
                                uppercase={false}
                                style={styles.btnContinue}
                            >
                                <Text
                                    style={styles.btnContinueText}>
                                    Continue
                                </Text>
                                <Icon style={{ color: '#ffffff', fontSize: 18 }} name="arrow-right" />
                            </RNPButton>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Content>
            <LocationPicker
                close={closePickLocation}
                onLocationSelect={handleOnLocationSelect}
                modalVisible={pickLocation}
            />
        </SafeAreaView>

    );
}

const combinedSelector = combineSelectors(categorySelector, businessTypesSelector);
export default connect(combinedSelector)(BusinessForm);

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

    textSubHeader: {
        fontSize: 14,
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
        marginBottom: 10,
        marginTop: 20,
        marginLeft: '25%',
        borderRadius: 6,
        height: 45,
    },

    btnContinueText: {
        fontSize: 18,
        fontWeight: '500',
        color: colors.whiteText,
    },

    categoryPicker: {
        width: '100%',
        height: 45,
        marginBottom: 10,
        backgroundColor: customGalioTheme.COLORS.WHITE,
        borderRadius: customGalioTheme.SIZES.INPUT_BORDER_RADIUS,
        borderWidth: customGalioTheme.SIZES.INPUT_BORDER_WIDTH,
        borderColor: customGalioTheme.COLORS.PLACEHOLDER,
    }
});