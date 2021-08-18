import React, { Fragment, useCallback, useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    ToastAndroid,
    TouchableOpacity,
    Image,
    Modal,
    SafeAreaView,
    BackHandler,
    FlatList,
} from 'react-native';
import Autocomplete from 'native-base-autocomplete';
import { colors, customStyle } from '../../config/styles';
import {
    Container,
    Content,
    Text,
    Item,
    Icon,
    ListItem,
    Textarea,
    CheckBox,
    Button,
    Picker,
    Header,
    Left,
    Body,
    Label,
    Footer,
    Input as NBInput
} from 'native-base';
import ActionSheet from 'react-native-actionsheet';
import Meteor from '../../react-native-meteor';
import FIcon from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-crop-picker';
import LocationPicker from '../../components/LocationPicker';
import {
    backToRoot,
    goToRoute,
    navigateToRoutefromSideMenu,
    goBack,
} from '../../Navigation';
import CogMenu from '../../components/CogMenu';
import { Navigation } from 'react-native-navigation/lib/dist/index';
import settings, { BusinessType } from '../../config/settings';
import ImageResizer from 'react-native-image-resizer';
import AsyncStorage from '@react-native-community/async-storage';
import Loading from '../../components/Loading';
import _, { set } from 'lodash';
import { Title, Button as RNPButton, TextInput, Checkbox } from 'react-native-paper';
import { customGalioTheme } from '../../config/themes';
import UseBusinessForm from '../../hooks/useBusinessForm';
import connect from '../../react-native-meteor/components/ReactMeteorData';
import { getCategoriesSelector } from '../../store/selectors/business';
import authHandlers from '../../store/services/business/handlers'

const RNFS = require('react-native-fs');

const BusinessForm = ({ navigation, categories }) => {
    const { values, handleInputChange, validateBusinessForm, resetBusinessForm } = UseBusinessForm();

    const [modalVisible, setModalVisible]= useState(false);
    useEffect(() => {
        debugger;
        authHandlers.getAllCategories();
        //fillEditForm();
    }, []);

    const fillEditForm = useCallback(() => {
        if(!categories) return;
        let _serviceToEdit = props.Service;
        //  console.log(_serviceToEdit,this.categories)
        if (_serviceToEdit) {
            let selectedCategory = categories.find(item => {
                return item.subCatId == _serviceToEdit.categoryId;
            });
            handleInputChange('title', _serviceToEdit.title);
            handleInputChange('selectedCategory', selectedCategory);
            handleInputChange('businessType', _serviceToEdit.businessType);
            handleInputChange('location', _serviceToEdit.location);
            handleInputChange('panvat', _serviceToEdit.panvat);
            handleInputChange('contact', _serviceToEdit.contact);
            handleInputChange('contactPerson', _serviceToEdit.contactPerson);
            handleInputChange('email', _serviceToEdit.email);
            handleInputChange('webLink', _serviceToEdit.webLink);
            handleInputChange('avatarSource', { uri: settings.IMAGE_URL + _serviceToEdit.coverImage });
        }
    },[categories]);

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
        if(!categories) return;
        return categories.map(category => (
            <Picker.Item label={category.name} value={category._id} />
        ))
    },[categories]);

    const businessTypeChange = (businessType) => {
        handleInputChange('businessType', businessType);
    };

    //const { query, selectedCategory, location } = this.state;
    // const categories = this._findCategory(query);
    // const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
    return (
        <Container style={styles.container}>
            <Content style={{ padding: Platform.OS === 'ios' ? 20 : 0 }}>
                    <SafeAreaView
                        style={styles.formContainer}
                        keyboardShouldPersistTaps="always">
                        {/*<Item style={styles.sbc83915f}>*/}
                        <TextInput
                            mode="outlined"
                            color={customGalioTheme.COLORS.INPUT_TEXT}
                            placeholder="Business Title"
                            placeholderTextColor="#808080"
                            value={values.title.value}
                            onChangeText={(value) => handleInputChange('title', value)}
                            style={styles.inputBox}
                        />
                        <View
                            style={{
                                width: '92%',
                                marginBottom:10,
                                backgroundColor: customGalioTheme.COLORS.WHITE,
                                borderRadius: customGalioTheme.SIZES.INPUT_BORDER_RADIUS,
                                borderWidth: customGalioTheme.SIZES.INPUT_BORDER_WIDTH,
                                borderColor: customGalioTheme.COLORS.PLACEHOLDER,
                            }}>
                            <Picker
                            placeholder='Select Categories'
                                selectedValue={values.selectedCategory.value}
                                onValueChange={(itemValue, itemIndex) => handleInputChange('selectedCategory', itemValue)
                                }>
                                {loadCategoriesTypes}
                            </Picker>
                        </View>
                        {/* <TextInput
                            mode="outlined"
                            color={customGalioTheme.COLORS.INPUT_TEXT}
                            placeholder="Category (*)"
                            placeholderTextColor='#808080'
                            //onSubmitEditing={() => this.title.focus()}
                            //onKeyPress={() => this.setState({ categoryModal: true })}
                            //onFocus={() => this.setState({ categoryModal: true })}
                            value={this.state.selectedCategory.subCategory}
                            style={styles.inputBox}
                        /> */}
                        <View
                            style={{
                                width: '92%',
                                marginBottom:8,
                                backgroundColor: customGalioTheme.COLORS.WHITE,
                                borderRadius: customGalioTheme.SIZES.INPUT_BORDER_RADIUS,
                                borderWidth: customGalioTheme.SIZES.INPUT_BORDER_WIDTH,
                                borderColor: customGalioTheme.COLORS.PLACEHOLDER,
                            }}>
                            <Picker
                                mode="dropdown"
                                iosIcon={<Icon name="arrow-down" />}
                                placeholder="Select Service Type"
                                placeholderTextColor='#808080'
                                placeholderStyle={{
                                    color: customGalioTheme.COLORS.PLACEHOLDER,
                                }}
                                placeholderIconColor={customGalioTheme.COLORS.PLACEHOLDER}
                                style={{ width: '100%' }}
                                selectedValue={values.businessType.value}
                                itemTextStyle={{ color: customGalioTheme.COLORS.INPUT_TEXT }}
                                onValueChange={() => businessTypeChange}>
                                <Picker.Item
                                    label="Product Store"
                                    value={BusinessType.STORE}
                                />
                                <Picker.Item
                                    label="Restaurant"
                                    value={BusinessType.RESTURANT}
                                />
                            </Picker>
                        </View>
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
                            placeholder="PAN/VAT"
                            placeholderTextColor='#808080'
                            value={values.panvat.value}
                            onChangeText={(value) => handleInputChange('panvat', value)}
                            style={styles.inputBox}
                        />
                        <TextInput
                            mode="outlined"
                            color={customGalioTheme.COLORS.INPUT_TEXT}
                            // style={{width:'90%'}}
                            placeholder="Contact No"
                            placeholderTextColor='#808080'
                            keyboardType="phone-pad"
                            onChangeText={(value) => handleInputChange('contact', value)}
                            value={values.contact.value}
                            style={styles.inputBox}
                        />
                        <TextInput
                            mode="outlined"
                            color={customGalioTheme.COLORS.INPUT_TEXT}
                            // style={{width:'90%'}}
                            placeholder="Contact Person"
                            placeholderTextColor='#808080'
                            onChangeText={(value) => handleInputChange('contactPerson', value)}
                            value={values.contactPerson.value}
                            style={styles.inputBox}
                        />
                        <TextInput
                            mode="outlined"
                            color={customGalioTheme.COLORS.INPUT_TEXT}
                            placeholder="Email"
                            placeholderTextColor='#808080'
                            onChangeText={(value) => handleInputChange('email', value)}
                            value={values.email.value}
                            style={styles.inputBox}
                        />
                        <TextInput
                            mode="outlined"
                            color={customGalioTheme.COLORS.INPUT_TEXT}
                            placeholder="Website"
                            placeholderTextColor='#808080'
                            onChangeText={(value) => handleInputChange('webLink', value)}
                            value={values.webLink.value}
                            style={styles.inputBox}
                        />
                        <View style={styles.sbc83915f}>
                            {/*<Text style={styles.s1f0fdd20}>{`Add Service`}</Text>*/}
                            <TouchableOpacity
                                style={styles.imageView}
                                onPress={() => {
                                    ActionSheet.show();
                                }}>
                                {values.avatarSource.value !== null ? (
                                    <Image
                                        style={{
                                            width: '100%',
                                            height: 150,
                                            borderRadius: 10,
                                            borderWidth: 3,
                                            height: 150,
                                            justifyContent: `center`,
                                            borderColor: customGalioTheme.COLORS.PLACEHOLDER,
                                        }}
                                        source={values.avatarSource.value}
                                    />
                                ) : (
                                    <Icon style={styles.sfe09f185} name="camera" />
                                )}
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                <ActionSheet
                    //ref={o => (this.ActionSheet = o)}
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
                        _handleImageUpload(index);
                    }}
                />
            </Content>

            <LocationPicker
                close={closePickLocation}
                onLocationSelect={handleOnLocationSelect}
                modalVisible={values.pickLocation.value}
            />
        </Container>

    );
}

BusinessForm.defaultProps = {};

export { styles };
// export default Meteor.createContainer(() => {
//     Meteor.subscribe('categories');
//     return {
//         categories: Meteor.collection('categories').find(),
//     };
// }, BusinessForm);

export default connect(getCategoriesSelector)(BusinessForm);

const styles = StyleSheet.create({
    screenHeader: {
        fontSize: 20,
        fontFamily: `Roboto`,
        color: '#ffffff',
    },

    s1f0fdd20: {
        color: `rgba(0, 0, 0, 1)`,
        fontFamily: `Roboto`,
        fontSize: 36,
    },
    sfe09f185: {
        color: `rgba(87, 150, 252, 1)`,
        fontSize: 60,
    },
    imageView: {
        backgroundColor: customGalioTheme.COLORS.WHITE,
        alignItems: `center`,
        borderColor: customGalioTheme.COLORS.PLACEHOLDER,
        borderRadius: 10,
        borderWidth: 3,
        height: 150,
        justifyContent: `center`,
        marginTop: 0,
        width: '100%',
    },
    sbc83915f: {
        alignItems: `center`,
        width: '100%',
        //flex: 1,
        //padding: 10
    },
    sad8176a7: {
        color: `rgba(51, 51, 51, 1)`,
        fontFamily: `Roboto`,
        fontSize: 16,
        opacity: 0.5,
    },
    sdbde75cb: {
        backgroundColor: `rgba(87, 150, 252, 1)`,
        height: 1,
        marginBottom: 13,
        marginTop: 13,
        width: `100%`,
    },
    sb47a0426: {
        color: `rgba(51, 51, 51, 1)`,
        fontFamily: `Roboto`,
        fontSize: 16,
        opacity: 0.5,
        lineHeight: 2,
    },
    s5e284020: {
        color: `rgba(87, 150, 252, 1)`,
        fontFamily: `Helvetica`,
        fontSize: 9,
    },
    s4fda91b2: {
        alignItems: `center`,
        backgroundColor: `rgba(255, 255, 255, 0.8)`,
        borderColor: `rgba(87, 150, 252, 1)`,
        borderRadius: 9,
        borderWidth: 1,
        height: 18,
        justifyContent: `center`,
        marginLeft: 15,
        width: 36,
    },
    s57ff64ea: {
        flexDirection: `row`,
        width: 230,
    },
    s906d750e: {
        backgroundColor: `rgba(87, 150, 252, 1)`,
        height: 1,
        marginBottom: 13,
        marginTop: 13,
        width: `100%`,
    },
    inputBoxAC: {
        width: '100%',
        height: 40,
        backgroundColor: colors.inputBackground,
        borderRadius: 25,
        paddingHorizontal: 16,
        fontSize: 16,
        color: colors.whiteText,
        marginVertical: 5,
    },
    inputBox: {
        width: '100%',
        backgroundColor: colors.transparent,
        borderRadius: 3.5,
        paddingHorizontal: 10,
        fontSize: 16,
        color: 'rgba(0, 0, 0, 0.6)',
        borderColor: colors.borderColor,
        height: 54,
        marginBottom: 10,
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
    autocompleteOptions: {
        backgroundColor: `rgba(243, 247, 255, 1)`,
        borderRadius: 5,
        color: `rgba(0, 0, 0, 1)`,
        fontFamily: `Roboto`,
        fontSize: 16,
        padding: 10,
        //paddingLeft: 0,
        width: '100%',
        //marginBottom: 4,
        //marginTop: 4,
        height: 50,
        maxHeight: 100,
    },
    autosuggestionView: {
        maxHeight: 100,
        backgroundColor: `rgba(243, 247, 255, 1)`,
        fontSize: 16,
        padding: 10,
        //paddingLeft: 0,
        width: '100%',
        backgroundColor: '#ececec',
        flexGrow: 1,
    },
    s50325ddf: {
        backgroundColor: `rgba(0, 0, 0, 0.11)`,
        height: 1,
        marginBottom: 2,
        marginTop: 2,
        width: `100%`,
    },
    itemText: {
        color: 'rgba(51, 51, 51, 1)',
        fontFamily: 'Roboto',
        fontSize: 16,
        opacity: 0.5,
    },
    form: {
        // flex: 1.5
    },
    formContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        flex: 1,
        // width: '100%',
    },
    sbf9e8383: {
        flex: 1,
        opacity: 1,
    },
    container: {
        backgroundColor: colors.appBackground,
        width: '100%',
        //flex: 1,
        //alignItems: 'center',
        //justifyContent: 'center'
    },
    descriptionContainer: {
        // `backgroundColor` needs to be set otherwise the
        // autocomplete input will disappear on text input.
        marginTop: 10,
        backgroundColor: colors.bgBrightWhite,
    },
    infoText: {
        textAlign: 'center',
    },
    titleText: {
        fontWeight: '500',
        marginBottom: 5,
        marginTop: 5,
        textAlign: 'center',
        color: `rgba(51, 51, 51, 1)`,
        fontFamily: `Roboto`,
        fontSize: 16,
        opacity: 0.5,
    },
    directorText: {
        color: 'grey',
        fontSize: 12,
        marginBottom: 10,
        textAlign: 'center',
    },
    openingText: {
        textAlign: 'center',
    },
    buttonContainer: { flex: 1, alignSelf: 'center', paddingTop: 20 },
    centerButton: { margin: 10, alignSelf: 'center' },

    checkBokView: {
        //sbackgroundColor: `rgba(243, 247, 255, 1)`,
        //borderRadius: 5,
        color: `rgba(0, 0, 0, 0.44)`,
        fontFamily: `Roboto`,
        fontSize: 18,
        padding: 10,
        paddingLeft: 40,
        width: `100%`,
        flexDirection: 'row',
        // paddingTop: 15,
    },
    textInputContainer: {
        width: '100%',
        //backgroundColor: 'rgba(0,0,0,0)',
        borderTopWidth: 0,
        borderBottomWidth: 0,
        margin: 0,
        height: 60,
    },
    description: {
        fontWeight: 'bold',
    },
    predefinedPlacesDescription: {
        //color: '#1faadb'
    },
    textInput: {
        //backgroundColor: `rgba(243, 247, 255, 1)`,
        borderRadius: 5,
        color: 'rgba(0, 0, 0, 1)',
        fontFamily: 'Roboto',
        fontSize: 18,
        // padding: 10,
        paddingLeft: 40,
        width: '100%',
        marginBottom: 4,
        marginTop: 4,
        height: 50,
    },
    autosuggestCont: {
        //padding: 10,
        backgroundColor: '#ececec',
    },
    autosuggesText: {
        marginBottom: 1,
        padding: 10,
        borderBottomColor: colors.inputBackground,
        borderBottomWidth: 1,
    },
    multiField: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    inputBoxMultiField: {
        width: '48%',
        height: 40,
        backgroundColor: colors.inputBackground,
        borderRadius: 25,
        paddingHorizontal: 16,
        fontSize: 16,
        color: colors.whiteText,
        marginVertical: 5,
        marginHorizontal: '1%',
    },

    chkView: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '45%',
        height: 40,
        marginHorizontal: '1%',
    },

    buttonView: {
        width: '100%',
        //minHeight:40,
        marginBottom: 0,
        marginTop: 45,
    },
    button: {
        width: '100%',
        backgroundColor: colors.buttonPrimaryBackground,
        borderRadius: 25,
        //marginVertical: 10,
        paddingVertical: 13,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.whiteText,
        textAlign: 'center',
    },
});