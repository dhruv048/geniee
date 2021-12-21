import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import {
    View,
    StyleSheet,
    ToastAndroid,
    TouchableWithoutFeedback,
    Keyboard,
    TouchableOpacity,
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
    Right,
    Textarea
} from 'native-base';
import ActionSheet from 'react-native-actionsheet';
import Icon from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-crop-picker';
import LocationPicker from '../../../components/LocationPicker';
import AsyncStorage from '@react-native-community/async-storage';
import _, { set } from 'lodash';
import { Title, Button as RNPButton, TextInput, Checkbox, Switch } from 'react-native-paper';
import { customGalioTheme, customPaperTheme } from '../../../config/themes';
import UseBusinessForm from '../../../hooks/useBusinessForm';
import { categorySelector } from '../../../store/selectors';
import { connect } from 'react-redux';
import { ProgressViewIOSComponent, Image } from 'react-native';
import { FlatList } from 'react-native';
import { Dimensions } from 'react-native';
import Meteor from '../../../react-native-meteor';
import DropDown from "react-native-paper-dropdown";
import settings, { BusinessType, ServiceDuration } from "../../../config/settings";
import productHandlers from "../../../store/services/product/handlers";

const { width, height } = Dimensions.get('screen');

const RNFS = require('react-native-fs');

const ProductInfo = (props) => {
    let actionsheet = useRef();

    const loggedUser = Meteor.userId() ? Meteor.userId() : props.route.params.loggedUser;

    const [productTitle, setProductTitle] = useState('');
    const [price, setPrice] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [description, setDescription] = useState('');
    const [isTitleValid, setIsTitleValid] = useState(false);
    const [isPriceValid, setIsPriceValid] = useState(false);
    const [isDescriptionValid, setIsDescriptionValid] = useState(false);
    const [imageBeRemove, setImageBeRemove] = useState([]);
    const [warranty, setWarranty] = useState(0);
    const [warrantyTime, setWarrantyTime] = useState(2);
    const [returnPolicy, setReturnPolicy] = useState(0);
    const [returnPolicyTime, setReturnPolicyTime] = useState(2);
    const [stockAvailability, setStockAvailability] = React.useState(true);
    const [colorAvailability, setColorAvailability] = React.useState(true);
    const [sizeAvailability, setSizeAvailability] = React.useState(true);
    const [productImage, setProductImage] = useState([]);
    const [customFields, setCustomFields] = useState([{ metaName: 'value', metaValue: 'value' }]);
    const [colorField, setColorField] = useState([{ colorName: 'Color1' }]);
    const [sizeField, setSizeField] = useState([{ size: 'Color1' }]);
    const [businessList, setBusinessList] = useState([]);
    const [businessType, setBusinessTypes] = useState();

    useEffect(() => {

        productHandlers.getBusinessList(loggedUser, (res) => {
            if (res) {
                setBusinessList(res);
            }
        })
    }, [])

    const addPropertyCustomField = () => {
        setCustomFields(prev => [...prev, { metaName: 'value', metaValue: 'value' }])
    }

    const handleCustomFieldName = (value, index) => {
        customFields[index].metaName = value;
        setCustomFields(customFields);
    }

    const handleCustomFieldValue = (value, index) => {
        customFields[index].metaValue = value;
        setCustomFields(customFields);
    }

    const deleteDynamicInput = (key) => {
        const _inputs = customFields.filter((input, index) => index != key);
        setCustomFields(_inputs);
    }


    const addColorCustomField = () => {
        setColorField(prev => [...prev, { colorName: 'value' }])
    }

    const handleColorFieldValue = (value, index) => {
        colorField[index].colorName = value;
        setColorField(colorField);
    }

    const deleteColorDynamicInput = (key) => {
        const _inputs = colorField.filter((input, index) => index != key);
        setColorField(_inputs);
    }

    const addSizeCustomField = () => {
        setSizeField(prev => [...prev, { size: 'value', }])
    }

    const handleSizeFieldValue = (value, index) => {
        sizeField[index].size = value;
        setSizeField(sizeField);
    }

    const deleteSizeDynamicInput = (key) => {
        const _inputs = sizeField.filter((input, index) => index != key);
        setSizeField(_inputs);
    }

    const renderCustomField = (customInput, key) => {
        return (
            <View key={key}>
                <View style={styles.textInputNameView}>
                    <TextInput
                        mode="outlined"
                        color={customGalioTheme.COLORS.INPUT_TEXT}
                        placeholder="Property label"
                        placeholderTextColor="#808080"
                        label="Property label"
                        name="label"
                        value={customInput.key}
                        onChangeText={(label) => handleCustomFieldName(label, key)}
                        style={styles.textInputNameBox}
                        error={isPriceValid}
                        theme={{ roundness: 6 }}
                    />
                    <TextInput
                        mode="outlined"
                        color={customGalioTheme.COLORS.INPUT_TEXT}
                        placeholder="Property value"
                        label="Property value"
                        placeholderTextColor="#808080"
                        name="value"
                        //value={discount}
                        onChangeText={(value) => handleCustomFieldValue(value, key)}
                        style={styles.textInputNameBox}
                        theme={{ roundness: 6 }}
                    />
                    <TouchableOpacity
                        onPress={() => { deleteDynamicInput(key) }}>
                        <Icon name='x-circle' style={{ backgroundColor: 'white', top: 0 }} size={20} color={colors.danger} />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    const renderColorField = (customInput, key) => {
        return (
            <View key={key}>
                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                    <TextInput
                        mode="outlined"
                        color={customGalioTheme.COLORS.INPUT_TEXT}
                        placeholder="Color value"
                        label="Color value"
                        placeholderTextColor="#808080"
                        name="color"
                        //value={discount}
                        onChangeText={(value) => handleColorFieldValue(value, key)}
                        style={{ width: '50%', height: 45, fontSize: 18 }}
                        theme={{ roundness: 6 }}
                    />
                    <TouchableOpacity
                        onPress={() => { deleteColorDynamicInput(key) }}>
                        <Icon name='x-circle' style={{ backgroundColor: 'white', top: 0 }} size={20} color={colors.danger} />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    const renderSizeField = (customInput, key) => {
        return (
            <View key={key}>
                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                    <TextInput
                        mode="outlined"
                        color={customGalioTheme.COLORS.INPUT_TEXT}
                        placeholder="Size value"
                        label="Size value"
                        placeholderTextColor="#808080"
                        name="size"
                        //value={discount}
                        onChangeText={(value) => handleSizeFieldValue(value, key)}
                        style={{ width: '50%', height: 45, fontSize: 18 }}
                        theme={{ roundness: 6 }}
                    />
                    <TouchableOpacity
                        onPress={() => { deleteSizeDynamicInput(key) }}>
                        <Icon name='x-circle' style={{ backgroundColor: 'white', top: 0 }} size={20} color={colors.danger} />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    const uploadProductImage = (selectedOption) => {
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
        image.uri = `data:${image.mime};base64,${image.data}`;
        imageData = image.uri;
        // this.setState(prevState => ({
        //     images: [...prevState.images, image]
        // }))

        setProductImage(prevImage => [...prevImage, imageData]);
        ImagePicker.clean().then(() => {
            console.log('removed all tmp images from tmp directory');
        }).catch(e => {
            alert(e);
        });

    };

    const handleProductInfo = () => {
        //if(!validateBusinessForm()){
        //preparing for Database
        let product = {
            productTitle: productTitle,
            price: price,
            discount: discount,
            businessType : businessType,
            warranty: warranty,
            stockAvailability: stockAvailability,
            warrantyTime: warrantyTime,
            returnPolicy: returnPolicy,
            returnPolicyTime: returnPolicyTime,
            color: colorField,
            size: sizeField,
            description: description,
            images: productImage,
            productProperty: customFields,
            owner: loggedUser,
            imageBeRemove: imageBeRemove,
        };
        //}
        props.navigation.navigate('ProductPreview', { productInfo: product });
        //props.navigation.navigate('ProductCompleted');
    }

    const resetProductForm = () => {
        productTitle = '';
        price = '';
        discount = '';
        warranty = '';
        returnPolicy = '';
        description = '';
        productImage = [];
        customFields = [{ metaName: 'value', metaValue: 'value' }];
        colorField = [{ colorName: 'Color1' }];
        sizeField = [{ size: 'Color1' }];
    }

    const renderImage = (data, index) => {
        let item = data.item;
        return (
            <View key={index}>
                <Image style={{
                    //alignSelf: 'stretch',
                    width: 70,
                    height: 70,
                }}
                    source={{ uri: item }} />
                <RNPButton
                    transparent
                    style={{ position: 'absolute', top: -12, left: 30 }}
                    onPress={() => removeImage(item)} >
                    <Icon name='x-circle' size={20}
                        color={colors.danger} />
                </RNPButton>

            </View>

        )
    };

    const removeImage = (image) => {
        let images = [...productImage];
        let index = images.indexOf(image);
        console.log(index, image)
        if (index !== -1) {
            images.splice(index, 1);
            setProductImage(images);
            if (image.hasOwnProperty("_id")) {
                imageBeRemove.push(image._id);
            }
        }
    }

    const loadBusiness = () => {
        if (!businessList) return;
        return businessList.map(item => (
            <Picker.Item key={item._id} label={item.businessName} value={item.businessTypes} style={styles.inputBox} />
        ))
    };

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
                        <View style={{paddingHorizontal:25,marginTop:15}}>
                        <View style={styles.categoryPicker}>
                            <Picker
                                placeholder='Select Business'
                                selectedValue={businessType}
                                onValueChange={(itemValue, itemIndex) => setBusinessTypes(itemValue)
                                }>
                                <Picker.Item label='Select Business' value='0' style={styles.inputBox} />
                                {loadBusiness()}
                            </Picker>
                        </View>
                        </View>
                        {/* Product Add */}
                        {businessType === BusinessType.STORE || businessType === BusinessType.PRODUCTS_GOODS_SELLER ?
                            <View>
                                <View style={styles.welcomeText}>
                                    <Text
                                        style={styles.textHeader}>
                                        Product info,
                                    </Text>
                                    <Text
                                        style={styles.textSubHeader}>
                                        Please fill authentic data below
                                    </Text>
                                </View>
                                <View style={styles.containerRegister}>
                                    <View>
                                        <Text style={{ fontWeight: 'bold' }}>Photo of Product({productImage.length}/4)</Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                        {/* {productImage.map((item, indx) => renderImage(item, indx))} */}
                                        {productImage.length > 0 ? <FlatList
                                            data={productImage}
                                            renderItem={(item, index) => renderImage(item, index)}
                                            keyExtractor={item => item.id}
                                            numColumns={5}
                                        /> : null}
                                        <TouchableOpacity
                                            onPress={() => {
                                                actionsheet.current.show();
                                            }}
                                            disabled={productImage.length === 4 ? true : false}
                                            style={{ height: 70, width: 70, borderWidth: 1, borderColor: 'grey' }}>
                                            <Image
                                                source={require('Geniee/app/images/uploadimage.png')}
                                                style={{ width: 65, height: 65, resizeMode: 'cover' }} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ marginTop: 20 }}>
                                        <Text style={{ fontWeight: 'bold' }}>Product Details</Text>
                                        <TextInput
                                            mode="outlined"
                                            color={customGalioTheme.COLORS.INPUT_TEXT}
                                            placeholder="Product Title"
                                            placeholderTextColor="#808080"
                                            label="Product Title"
                                            value={productTitle}
                                            onChangeText={(value) => setProductTitle(value)}
                                            style={styles.inputBox}
                                            error={isTitleValid}
                                            theme={{ roundness: 6 }}
                                        />

                                        <View style={styles.textInputNameView}>
                                            <TextInput
                                                mode="outlined"
                                                color={customGalioTheme.COLORS.INPUT_TEXT}
                                                placeholder="Price"
                                                placeholderTextColor="#808080"
                                                label="Price"
                                                name="price"
                                                value={price}
                                                onChangeText={(value) => setPrice(value)}
                                                style={styles.textInputNameBox}
                                                error={isPriceValid}
                                                theme={{ roundness: 6 }}
                                            />

                                            <TextInput
                                                mode="outlined"
                                                color={customGalioTheme.COLORS.INPUT_TEXT}
                                                placeholder="Discount %"
                                                placeholderTextColor="#808080"
                                                label="Discount %"
                                                name="discount"
                                                value={discount}
                                                onChangeText={(value) => setDiscount(value)}
                                                style={styles.textInputNameBox}
                                                theme={{ roundness: 6 }}
                                            />
                                        </View>
                                        <View style={styles.textInputNameView}>
                                            <TextInput
                                                mode="outlined"
                                                color={customGalioTheme.COLORS.INPUT_TEXT}
                                                placeholder="Warranty"
                                                placeholderTextColor="#808080"
                                                label="Warranty"
                                                name="warranty"
                                                value={warranty}
                                                onChangeText={(value) => setWarranty(value)}
                                                style={styles.textInputNameBox}
                                                //error={warranty}
                                                theme={{ roundness: 6 }}
                                            />
                                            <View style={{
                                                width: '50%',
                                                height: 47,
                                                paddingHorizontal: 10,
                                                color: 'rgba(0, 0, 0, 0.6)',
                                                fontSize: 18,
                                                //backgroundColor: colors.transparent,
                                                borderWidth: 1, borderRadius: 6, marginTop: 7, marginHorizontal: 10
                                            }}>
                                                <Picker
                                                    mode="dropdown"
                                                    iosIcon={<Icon name="arrow-down" />}
                                                    placeholder="Select Duration"

                                                    style={{ width: '100%', fontSize: 18 }}
                                                    selectedValue={warrantyTime}
                                                    onValueChange={(warrantyTime) => setWarrantyTime(warrantyTime)}>
                                                    <Picker.Item
                                                        label="Day"
                                                        value={ServiceDuration.Day}
                                                    />
                                                    <Picker.Item
                                                        label="Month"
                                                        value={ServiceDuration.Month}
                                                    />
                                                    <Picker.Item
                                                        label="Year"
                                                        value={ServiceDuration.Yr}
                                                    />
                                                </Picker>
                                            </View>
                                        </View>
                                        <View style={styles.textInputNameView}>
                                            <TextInput
                                                mode="outlined"
                                                color={customGalioTheme.COLORS.INPUT_TEXT}
                                                placeholder="Return Policy"
                                                placeholderTextColor="#808080"
                                                label="Return Policy"
                                                name="policy"
                                                value={returnPolicy}
                                                onChangeText={(value) => setReturnPolicy(value)}
                                                style={styles.textInputNameBox}
                                                //error={returnPolicy}
                                                theme={{ roundness: 6 }}
                                            />
                                            <View style={{
                                                width: '50%',
                                                height: 47,
                                                paddingHorizontal: 10,
                                                color: 'rgba(0, 0, 0, 0.6)',
                                                fontSize: 18,
                                                //backgroundColor: colors.transparent,
                                                borderWidth: 1, borderRadius: 6, marginTop: 7, marginHorizontal: 10
                                            }}>
                                                <Picker
                                                    mode="dropdown"
                                                    iosIcon={<Icon name="arrow-down" />}
                                                    placeholder="Select Duration"

                                                    style={{ width: '100%', fontSize: 18 }}
                                                    selectedValue={returnPolicyTime}
                                                    onValueChange={(returnPolicyTime) => setReturnPolicyTime(returnPolicyTime)}>
                                                    <Picker.Item
                                                        label="Day"
                                                        value={ServiceDuration.Day}
                                                    />
                                                    <Picker.Item
                                                        label="Month"
                                                        value={ServiceDuration.Month}
                                                    />
                                                    <Picker.Item
                                                        label="Year"
                                                        value={ServiceDuration.Yr}
                                                    />
                                                </Picker>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignContent: 'space-between', marginVertical: 10 }}>
                                            <Text style={{ fontWeight: 'bold' }}>Stock Availability</Text>
                                            <Switch style={{ marginLeft: 'auto' }} value={stockAvailability} onValueChange={() => setStockAvailability(!stockAvailability)} />
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignContent: 'space-between', marginVertical: 10 }}>
                                            <Text style={{ fontWeight: 'bold' }}>Color Availability</Text>
                                            <Switch style={{ marginLeft: 'auto' }} value={colorAvailability} onValueChange={() => setColorAvailability(!colorAvailability)} />
                                        </View>
                                        {colorField.length > 0 ?
                                            <View>
                                                {colorField.map((item, index) => renderColorField(item, index))}
                                            </View> : null}
                                        <View>
                                            <View>
                                                <RNPButton
                                                    mode="outlined"
                                                    uppercase={false}
                                                    disabled={!colorAvailability}
                                                    style={{ marginVertical: 10 }}
                                                    onPress={() => { addColorCustomField() }}>
                                                    <Icon name='plus' />
                                                    <Text>Add color variant</Text>
                                                </RNPButton>
                                            </View>

                                            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignContent: 'space-between', marginVertical: 10 }}>
                                                <Text style={{ fontWeight: 'bold' }}>Size Availability</Text>
                                                <Switch style={{ marginLeft: 'auto' }} value={sizeAvailability} onValueChange={() => setSizeAvailability(!sizeAvailability)} />
                                            </View>
                                            {sizeField.length > 0 ?
                                                <View>
                                                    {sizeField.map((item, index) => renderSizeField(item, index))}
                                                </View> : null}
                                            <RNPButton
                                                mode="outlined"
                                                uppercase={false}
                                                disabled={!sizeAvailability}
                                                style={{ marginVertical: 10 }}
                                                onPress={() => { addSizeCustomField() }}>
                                                <Icon name='plus' />
                                                <Text>Add size variant</Text>
                                            </RNPButton>
                                        </View>
                                        <View>
                                            <Textarea
                                                rowSpan={4}
                                                placeholder="Product Description"
                                                label="Product Description"
                                                style={styles.inputTextarea}
                                                placeholderTextColor="#808080"
                                                underlineColorAndroid='red'
                                                value={description}
                                                onChangeText={(value) => setDescription(value)}
                                                isInvalid={isDescriptionValid}
                                                _dark={{
                                                    placeholderTextColor: "gray.300",
                                                }}
                                                disabled={description.length > 500}
                                            />
                                            <Text style={{ fontSize: 12, marginLeft: 264 }}>({description.length}/500)</Text>
                                        </View>
                                        {customFields.length > 0 ?
                                            <View>
                                                {customFields.map((item, index) => renderCustomField(item, index))}
                                            </View> : null}
                                        <View>
                                            <RNPButton
                                                mode="outlined"
                                                uppercase={false}
                                                style={{ marginVertical: 10 }}
                                                onPress={() => { addPropertyCustomField() }}>
                                                <Icon name='plus' />
                                                <Text>Add Property</Text>
                                            </RNPButton>
                                        </View>
                                    </View>
                                    <RNPButton
                                        mode='contained'
                                        onPress={() => { handleProductInfo() }}
                                        uppercase={false}
                                        style={styles.btnContinue}
                                    >
                                        <Text
                                            style={styles.btnContinueText}>
                                            Confirm
                                        </Text>
                                        <Icon style={{ color: '#ffffff', fontSize: 18 }} name="arrow-right" />
                                    </RNPButton>
                                </View>
                            </View> : null}
                        {/* Service add */}
                        {businessType === BusinessType.SERVICE_PROVIDER ?
                            <View>
                                <View style={styles.welcomeText}>
                                    <Text
                                        style={styles.textHeader}>
                                        Service info,
                                    </Text>
                                    <Text
                                        style={styles.textSubHeader}>
                                        Please fill authentic data below
                                    </Text>
                                </View>
                                <View style={styles.containerRegister}>
                                    <View>
                                        <Text style={{ fontWeight: 'bold' }}>Your portfolio image({productImage.length}/4)</Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                        {/* {productImage.map((item, indx) => renderImage(item, indx))} */}
                                        {productImage.length > 0 ? <FlatList
                                            data={productImage}
                                            renderItem={(item, index) => renderImage(item, index)}
                                            keyExtractor={item => item.id}
                                            numColumns={5}
                                        /> : null}
                                        <TouchableOpacity
                                            onPress={() => {
                                                actionsheet.current.show();
                                            }}
                                            disabled={productImage.length === 4 ? true : false}
                                            style={{ height: 70, width: 70, borderWidth: 1, borderColor: 'grey' }}>
                                            <Image
                                                source={require('Geniee/app/images/uploadimage.png')}
                                                style={{ width: 65, height: 65, resizeMode: 'cover' }} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ marginTop: 20 }}>
                                        <Text style={{ fontWeight: 'bold' }}>Service Details</Text>
                                        <TextInput
                                            mode="outlined"
                                            color={customGalioTheme.COLORS.INPUT_TEXT}
                                            placeholder="Product Title"
                                            placeholderTextColor="#808080"
                                            label="Product Title"
                                            value={productTitle}
                                            onChangeText={(value) => setProductTitle(value)}
                                            style={styles.inputBox}
                                            error={isTitleValid}
                                            theme={{ roundness: 6 }}
                                        />

                                        <View style={styles.textInputNameView}>
                                            <TextInput
                                                mode="outlined"
                                                color={customGalioTheme.COLORS.INPUT_TEXT}
                                                placeholder="Price"
                                                placeholderTextColor="#808080"
                                                label="Price"
                                                name="price"
                                                value={price}
                                                onChangeText={(value) => setPrice(value)}
                                                style={styles.textInputNameBox}
                                                error={isPriceValid}
                                                theme={{ roundness: 6 }}
                                            />
                                            <View style={{
                                                width: '50%',
                                                height: 47,
                                                paddingHorizontal: 10,
                                                color: 'rgba(0, 0, 0, 0.6)',
                                                fontSize: 18,
                                                //backgroundColor: colors.transparent,
                                                borderWidth: 1, borderRadius: 6, marginTop: 7, marginHorizontal: 10
                                            }}>
                                                <Picker
                                                    mode="dropdown"
                                                    iosIcon={<Icon name="arrow-down" />}
                                                    placeholder="Select Duration"

                                                    style={{ width: '100%', fontSize: 18 }}
                                                    selectedValue={warrantyTime}
                                                    onValueChange={(warrantyTime) => setWarrantyTime(warrantyTime)}>
                                                    <Picker.Item
                                                        label="Hour"
                                                        value={ServiceDuration.Hr}
                                                    />
                                                    <Picker.Item
                                                        label="Day"
                                                        value={ServiceDuration.Day}
                                                    />
                                                    <Picker.Item
                                                        label="Month"
                                                        value={ServiceDuration.Month}
                                                    />
                                                    <Picker.Item
                                                        label="Year"
                                                        value={ServiceDuration.Yr}
                                                    />
                                                </Picker>
                                            </View>
                                        </View>
                                        <TextInput
                                            mode="outlined"
                                            color={customGalioTheme.COLORS.INPUT_TEXT}
                                            placeholder="Discount %"
                                            placeholderTextColor="#808080"
                                            label="Discount %"
                                            name="discount"
                                            value={discount}
                                            onChangeText={(value) => setDiscount(value)}
                                            style={styles.inputBox}
                                            theme={{ roundness: 6 }}
                                        />
                                        <View>
                                            <Textarea
                                                rowSpan={4}
                                                placeholder="Product Description"
                                                label="Product Description"
                                                style={styles.inputTextarea}
                                                placeholderTextColor="#808080"
                                                underlineColorAndroid='red'
                                                value={description}
                                                onChangeText={(value) => setDescription(value)}
                                                isInvalid={isDescriptionValid}
                                                _dark={{
                                                    placeholderTextColor: "gray.300",
                                                }}
                                                disabled={description.length > 500}
                                            />
                                            <Text style={{ fontSize: 12, marginLeft: 264 }}>({description.length}/500)</Text>
                                        </View>
                                    </View>
                                    <RNPButton
                                        mode='contained'
                                        onPress={() => { handleProductInfo() }}
                                        uppercase={false}
                                        style={styles.btnContinue}
                                    >
                                        <Text
                                            style={styles.btnContinueText}>
                                            Confirm
                                        </Text>
                                        <Icon style={{ color: '#ffffff', fontSize: 18 }} name="arrow-right" />
                                    </RNPButton>
                                </View>
                            </View> : null}
                        {/* Restaurant Add */}
                    </View>
                </TouchableWithoutFeedback>
                <ActionSheet
                    ref={actionsheet}
                    title={'Please select the option'}
                    options={[
                        <Text style={{ color: colors.text_muted }}>
                            Take Picture from Camera
                        </Text>,
                        <Text style={{ color: colors.text_muted }}>
                            Pick Image from Gallery
                        </Text>,
                        'Cancel',
                    ]}
                    cancelButtonIndex={2}
                    destructiveButtonIndex={2}
                    onPress={index => {
                        uploadProductImage(index);
                    }}
                />
            </Content>
        </SafeAreaView>

    );
}
export default ProductInfo;

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
        marginTop: 25,
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