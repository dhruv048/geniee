import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import {
    View,
    StyleSheet,
    ToastAndroid,
    TouchableWithoutFeedback,
    Keyboard,
    TouchableOpacity
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
import { Title, Button as RNPButton, TextInput, Checkbox } from 'react-native-paper';
import { customGalioTheme } from '../../../config/themes';
import UseBusinessForm from '../../../hooks/useBusinessForm';
import { categorySelector } from '../../../store/selectors';
import { connect } from 'react-redux';
import { ProgressViewIOSComponent, Image } from 'react-native';

const RNFS = require('react-native-fs');

const ProductInfo = (props) => {
    let actionsheet = useRef();

    const [productTitle, setProductTitle] = useState('');
    const [price, setPrice] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [description, setDescription] = useState('');
    const [isTitleValid, setIsTitleValid] = useState(false);
    const [isPriceValid, setIsPriceValid] = useState(false);
    const [isDescriptionValid, setIsDescriptionValid] = useState(false);

    const [productImage, setProductImage] = useState([]);
    const [customFields, setCustomFields] = useState([{ metaName: 'value', metaValue: 'value' }]);


    const addCustomField = () => {
        setCustomFields(prev => [...prev, { metaName: 'value', metaValue: 'value' }])
    }
    
    const handleCustomFieldName = (value,index)=>{
        customFields[index].metaName = value;
        setCustomFields(customFields);
    }
    
    const handleCustomFieldValue = (value, index) =>{
        customFields[index].metaValue = value;
        setCustomFields(customFields);
    }
    
    const deleteDynamicInput = (key) =>{
      const _inputs = customFields.filter((input,index) => index != key);
      setCustomFields(_inputs);
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
                        name="label"
                        value={customInput.key}
                        onChangeText={(label) => handleCustomFieldName(label,key)}
                        style={styles.textInputNameBox}
                        error={isPriceValid}
                        theme={{ roundness: 6 }}
                    />
                    <TextInput
                        mode="outlined"
                        color={customGalioTheme.COLORS.INPUT_TEXT}
                        placeholder="Property value"
                        placeholderTextColor="#808080"
                        name="value"
                        //value={discount}
                        onChangeText={(value) => handleCustomFieldValue(value,key)}
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
        console.log('This is image' + image);
        // this.setState(prevState => ({
        //     images: [...prevState.images, image]
        // }))

        setProductImage(prevImage => [...prevImage, image]);
        ImagePicker.clean().then(() => {
            console.log('removed all tmp images from tmp directory');
        }).catch(e => {
            alert(e);
        });

    };

    const handleProductInfo = () => {
        console.log('THis is customs'+customFields);
        //if(!validateBusinessForm()){
        //preparing for Database
        let product = {
            productTitle: productTitle,
            price: price,
            discount: discount,
            description: description,
            productImage: productImage,
            productProperty: customFields,
        };
        //}
        props.navigation.navigate('ProductPreview', { productInfo: product });
        //props.navigation.navigate('ProductCompleted');
    }

    const renderImage = (data, index) => {
        let item = data;
        return (
            <View key={index}>
                <View >
                    <Image style={{
                        flex: 1,
                        //alignSelf: 'stretch',
                        width: 60,
                        height: 60,
                        resizeMode: 'cover'
                    }}
                        source={{ uri: item.uri }} />
                    <RNPButton onPress={() => removeImage(item)} transparent
                        style={{ position: 'absolute', top: -12, right: 250 }}>
                        <Icon name='x-circle' style={{ backgroundColor: 'white', top: 0 }} size={20}
                            color={colors.danger} />
                    </RNPButton>
                </View>

            </View>

        )
    };

    const removeImage = (image) => {
        let images = [...this.state.images];
        let index = images.indexOf(image);
        console.log(index, image)
        if (index !== -1) {
            images.splice(index, 1);
            this.setState({ images: images });
            if (image.hasOwnProperty("_id")) {
                this.imagesToRemove.push(image._id);
            }
        }
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
                                Product info,
                            </Text>
                            <Text
                                style={styles.textSubHeader}>
                                Please fill authentic data below
                            </Text>
                        </View>
                        <View style={styles.containerRegister}>
                            <View>
                                <Text style={{ fontWeight: 'bold' }}>Photo of Product({productImage.length}/5)</Text>
                            </View>
                            <RNPButton
                                mode='contained'
                                uppercase={false}
                                onPress={() => {
                                    actionsheet.current.show();
                                }}
                                style={{ height: 40, marginTop: 10 }}>
                                <Text style={{ fontSize: 12, textAlign: 'center' }}>Upload</Text>
                                <Icon style={{ color: '#ffffff', fontSize: 12 }} name="arrow-up" />
                            </RNPButton>
                            <View>
                                {productImage.map((item, indx) => renderImage(item, indx))}
                            </View>
                            <View style={{ marginTop: 20 }}>
                                <Text style={{ fontWeight: 'bold' }}>Product Details</Text>
                                <TextInput
                                    mode="outlined"
                                    color={customGalioTheme.COLORS.INPUT_TEXT}
                                    placeholder="Product Title"
                                    placeholderTextColor="#808080"
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
                                        placeholder="Discount"
                                        placeholderTextColor="#808080"
                                        name="discount"
                                        value={discount}
                                        onChangeText={(value) => setDiscount(value)}
                                        style={styles.textInputNameBox}
                                        theme={{ roundness: 6 }}
                                    />
                                </View>
                                <View>
                                    <Textarea
                                        rowSpan={4}
                                        placeholder="Product Description"
                                        style={styles.inputTextarea}
                                        placeholderTextColor="#808080"
                                        underlineColorAndroid='red'
                                        value={description}
                                        onChangeText={(value) => setDescription(value)}
                                        isInvalid={isDescriptionValid}
                                        _dark={{
                                            placeholderTextColor: "gray.300",
                                        }}
                                        disabled={description.length>500}
                                    />
                                    <Text style={{fontSize:12,marginLeft:285}}>({description.length}/500)</Text>
                                </View>
                                {customFields.length > 0 ?
                                <View>
                                    {customFields.map((item, index) => renderCustomField(item, index))}
                                </View>:null}
                                <View>
                                    <RNPButton
                                        mode="outlined"
                                        uppercase={false}
                                        onPress={() => { addCustomField()}}>
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
                        uploadProductImage(index);
                    }}
                />
            </Content>
        </Container>

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
});