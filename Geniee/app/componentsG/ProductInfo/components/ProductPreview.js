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
import { Title, Button as RNPButton, TextInput, Checkbox, RadioButton } from 'react-native-paper';
import { customGalioTheme } from '../../../config/themes';
import { categorySelector } from '../../../store/selectors';
import { connect } from 'react-redux';
import { ProgressViewIOSComponent, Image } from 'react-native';
import { SliderBox } from "react-native-image-slider-box";
import productHandlers from "../../../store/services/product/handlers";
import FIcon from 'react-native-vector-icons/FontAwesome';

const RNFS = require('react-native-fs');

const ProductPreview = (props) => {
    const productData = props.route.params.productInfo;

    // productData.size.map((x) => {
    //     console.log('This is prodcut from preveri ' + x.size);
    // })

    const editProduct = () => {
        props.navigation.goBack();
    }

    const handleConfirmProduct = () => {
        //if(!validateBusinessForm()){
        //preparing for Database
        let product = productData;
        //}
        // call API to save data
        if (productData._id) {
            //Update
            productHandlers.updateProduct(productData._id, product, productData.imageBeRemove, (res) => {
                if (res === true) {
                    ToastAndroid.showWithGravityAndOffset(
                        "Updated Successfully!!",
                        ToastAndroid.LONG,
                        ToastAndroid.TOP,
                        0,
                        50,
                    );
                    props.navigation.navigate('ProductCompleted', { data: product });
                } else {
                    ToastAndroid.showWithGravityAndOffset(
                        "Please contact administrator",
                        ToastAndroid.LONG,
                        ToastAndroid.TOP,
                        0,
                        50,
                    );
                }
            })
        } else {
            //Save
            productHandlers.saveProduct(product, (res) => {
                if (res === true) {
                    ToastAndroid.showWithGravityAndOffset(
                        "Saved Successfully!!",
                        ToastAndroid.LONG,
                        ToastAndroid.TOP,
                        0,
                        50,
                    );
                    props.navigation.navigate('ProductCompleted', { data: product });
                } else {
                    ToastAndroid.showWithGravityAndOffset(
                        "Please contact administrator",
                        ToastAndroid.LONG,
                        ToastAndroid.TOP,
                        0,
                        50,
                    );
                }
            })
        }

    }

    const renderImage = () => {
        return (
            <SliderBox
                images={productData.images}
                sliderBoxHeight={250}
                onCurrentImagePressed={index => console.warn(`image ${index} pressed`)}
                dotColor="#FFEE58"
                inactiveDotColor="#90A4AE"
            />

        )
    };

    const renderProductProperty = (item, index) => {
        return (
            <View key={index}>
                <View style={styles.propertyView}>
                    <View style={{ width: '50%'}}><Text style={{fontWeight:'bold'}}>{item.metaName} :</Text></View>
                    <View style={{ width: '50%' }}><Text>{item.metaValue}</Text></View>
                </View>
            </View>
        )
    }

    const renderSize = (item, index) => {
        let items = item.size.toUpperCase();
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginLeft:10 }}>
                <Text style={{ marginTop: 20, marginBottom: 10 }}>{items}</Text>
            </View>
        )
    }

    const renderColor = (item, index) => {
        let items = item.colorName.toLowerCase();
        return (
            <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 12 }}>
                <FIcon name = 'circle' style={{color: items, fontSize:20, marginLeft:15, marginTop:8}}/>
                {/* <RadioButton.Android value={null} status='checked' color={items} /> */}
            </View>
        )
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
                            <RNPButton
                                transparent
                                uppercase={false}
                                style={{ width: '100%', alignItems: 'flex-start' }}
                                onPress={() => {
                                    props.navigation.goBack();
                                }}>
                                <Icon style={{ color: '#ffffff', fontSize: 20 }} name="arrow-left" />
                                <Text style={{ color: colors.whiteText, fontSize: 20 }}>Product Preview</Text>
                            </RNPButton>
                        </Header>
                        <View style={styles.containerRegister}>
                            <Text style={{ fontWeight: 'bold', marginVertical: 15, fontSize: 18 }}>{productData.productTitle}</Text>
                        </View>
                        <View style={styles.sliderBox}>
                            {productData.images.length > 0 ? renderImage() : null}
                            {/* {productData.productImage.map((item, indx) => renderImage(item, indx))} */}
                        </View>
                        <View style={styles.containerRegister}>

                            <View>
                                <Text style={{ fontWeight: 'bold', marginVertical: 15, fontSize: 18 }}>{productData.productTitle}</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ textDecorationLine: 'line-through', textDecorationStyle: 'solid', marginRight: 10 }}>Rs.{productData.price}</Text>
                                <Text style={{ fontWeight: 'bold', color: 'red' }}>-{productData.discount}% Off</Text>
                            </View>
                            <Text style={{ color: colors.statusBar }}>Rs. {productData.price - (productData.price * productData.discount) / 100}</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontWeight: 'bold', marginTop: 20, marginBottom: 10 }}>Color : </Text>
                                {productData.color && productData.color.length>0 ? productData.color.map((item, index) => renderColor(item, index)) : <Text>N/A</Text>}
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontWeight: 'bold', marginTop: 20, marginBottom: 10 }}>Size : </Text>
                                {productData.size && productData.size.length>0 ? productData.size.map((item, index) => renderSize(item, index)) : <Text>N/A</Text>}
                            </View>
                            <View>
                                <Text style={{ fontWeight: 'bold', marginTop: 20, marginBottom: 10 }}>Product Description : </Text>
                                <Text style={{ fontSize: 16 }}>{productData.description}</Text>
                            </View>
                            <Text style={{ fontWeight: 'bold', marginTop: 20, marginBottom: 10 }}>Product Specification : </Text>
                            {productData.productProperty.map((item, index) => renderProductProperty(item, index))}
                        </View>
                        <View style={styles.horizontalView}>
                            <RNPButton
                                mode='outlined'
                                onPress={() => { editProduct() }}
                                uppercase={false}
                                style={styles.btnContinue}
                            >
                                <Text
                                    style={styles.btnEditText}>
                                    Edit
                                </Text>
                                <Icon style={{ color: 'black', fontSize: 18 }} name="edit" />
                            </RNPButton>
                            <RNPButton
                                mode='contained'
                                onPress={() => { handleConfirmProduct() }}
                                uppercase={false}
                                style={styles.btnContinue}
                            >
                                <Text
                                    style={styles.btnContinueText}>
                                    Post
                                </Text>
                                <Icon style={{ color: '#ffffff', fontSize: 18 }} name="arrow-right" />
                            </RNPButton>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Content>
        </Container>

    );
}
export default ProductPreview;

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

    horizontalView:
    {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 20,
    },

    propertyView:
    {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start'
    },

    btnContinue: {
        width: '48%',
        marginBottom: 10,
        marginTop: 20,
        //marginLeft: '25%',
        borderRadius: 6,
        height: 45,
    },

    btnEditText: {
        fontSize: 18,
        fontWeight: '500',
        color: 'black',
    },
    btnContinueText: {
        fontSize: 18,
        fontWeight: '500',
        color: colors.whiteText,
    },
    sliderBox: {
        marginHorizontal: 0,
    }
});