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
import { ProgressViewIOSComponent } from 'react-native';
import Meteor from '../../../react-native-meteor';
import handlers from '../../../store/services/categories/handlers';
const RNFS = require('react-native-fs');

const BusinessForm = (props) => {
    const { values, handleInputChange, validateBusinessForm, resetBusinessForm } = UseBusinessForm();
    const registerUser = props.route.params.data

    const merchantOwner = Meteor.userId() ? Meteor.userId() : registerUser;
    const [businessTypes, setBusinessTypes] = useState();

    const [modalVisible, setModalVisible] = useState(false);
    useEffect(() => {
        console.log('This is categories : ' + props.categories);
        handlers.getAllBusinessType((res) =>{
            if(res){
                setBusinessTypes(res.result);
            }
        });
    }, [props.categories]);

    // const handleOnLocationSelect = (location) => {
    //     delete location.address_components;
    //     handleInputChange('location', location);
    //     handleInputChange('pickLocation', false);
    // }

    // const closePickLocation = () => {
    //     handleInputChange('pickLocation', false);
    // }
    // const loadBusinessTypes = () => {
        
    // }

    const loadBusinessTypes = useCallback(() => {
        if (!businessTypes) return;
        return businessTypes.map(item => (
            <Picker.Item key={item._id} label={item.title} value={item._id} style={styles.inputBox}/>
        ))
    }, [businessTypes]);


    const loadCategoriesTypes = useCallback(() => {
        if (!props.categories) return;
        return props.categories.map(category => (
            <Picker.Item key={category._id} label={category.title} value={category._id} style={styles.inputBox}/>
        ))
    }, [props.categories]);

    const handleMerchantInfo = () => {
        //if(!validateBusinessForm()){
        //preparing for Database
        let business = {
            businessName: values.merchantName.value,
            selectedCategory: values.selectedCategory.value,
            district: values.district.value,
            city: values.city.value,
            nearestLandmark: values.nearestLandmark.value,
            location: null,
            panNumber: values.panNumber.value,
            contact: values.contact.value,
            email: values.email.value,
            owner: merchantOwner
        };
        //}
        //props.navigation.navigate('BusinessDocument',{businessData : business});
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
                                        Back
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
                                theme={{ roundness: 6 }}
                            />
                            <View
                                style={styles.categoryPicker}>
                                <Picker
                                    placeholder='Select BusinessType'
                                    selectedValue={values.businessType.value}
                                    onValueChange={(itemValue, itemIndex) => handleInputChange('businessType', itemValue)
                                    }>
                                    <Picker.Item label='Select Business Type' value='0' style={styles.inputBox}/>
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
                                    <Picker.Item label='Select Category' value='0' style={styles.inputBox}/>
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
                                    theme={{ roundness: 6 }}
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
                                    theme={{ roundness: 6 }}
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
                                theme={{ roundness: 6 }}
                            />
                            {/* <TextInput
                                mode="outlined"
                                color={customGalioTheme.COLORS.INPUT_TEXT}
                                //   onBlur={()=>this.setState({pickLocation:true})}
                                onFocus={() => handleInputChange('pickLocation', true)}
                                placeholder="Location"
                                placeholderTextColor='#808080'
                                value={values.location.value ? values.location.value.formatted_address : ""}
                                //   onChangeText={(radius) => this.setState({radius})}
                                style={styles.inputBox}
                                theme={{roundness:6}}
                            /> */}
                            <TextInput
                                mode="outlined"
                                color={customGalioTheme.COLORS.INPUT_TEXT}
                                placeholder="PAN Number"
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
            {/* <LocationPicker
                close={closePickLocation}
                onLocationSelect={handleOnLocationSelect}
                modalVisible={values.pickLocation.value}
            /> */}
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
        backgroundColor: colors.transparent,
        marginBottom: 10,
    },

    inputBox: {
        width: '100%',
        height: 45,
        color: 'rgba(0, 0, 0, 0.6)',
        fontSize: 18,
        backgroundColor: colors.transparent,
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