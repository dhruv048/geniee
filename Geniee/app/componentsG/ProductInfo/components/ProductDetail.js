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
import _, { round, set } from 'lodash';
import { Title, Button as RNPButton, TextInput, Checkbox, RadioButton } from 'react-native-paper';
import { customGalioTheme } from '../../../config/themes';
import { categorySelector } from '../../../store/selectors';
import { connect } from 'react-redux';
import { ProgressViewIOSComponent, Image } from 'react-native';
import { SliderBox } from "react-native-image-slider-box";
import productHandlers from "../../../store/services/product/handlers";
import Meteor from '../../../react-native-meteor';
import { FlatList } from 'react-native-gesture-handler';
import Product from '../../../components/Store/Product';
import FIcon from 'react-native-vector-icons/FontAwesome';

const RNFS = require('react-native-fs');

const productTest = {
    "_id": "w5Hd7rZmP4eX2JaDn",
    "productTitle": "test",
    "price": 600,
    "discount": 5,
    "warranty": "0",
    "stockAvailability": true,
    "warrantyTime": 2,
    "returnPolicy": "0",
    "returnPolicyTime": 2,
    "color": [
        {
            "colorName": "red"
        },
        {
            "colorName": "blue"
        },
        {
            "colorName": "green"
        }
    ],
    "size": [
        {
            "size": "M"
        },
        {
            "size": "l"
        },
        {
            "size": "xl"
        }
    ],
    "description": "test descr",
    "images": [],
    "productProperty": [
        {
            "metaName": "Brand",
            "metaValue": " zeepi"
        }
    ],
    "owner": "YSdhXJ2cdKL57XbeS",
    "imageBeRemove": [],
    "productOwner": 0,
    "createdBy": "YSdhXJ2cdKL57XbeS"
};

const ProductDetail = (props) => {

    const [productData, setProductData] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [similarProducts, setSimilarProducts] = useState([]);
    const [question, setQuestion] = useState('');
    const [colorIndex, setColorIndex] = useState();
    const [sizeIndex, setSizeIndex] = useState();

    const [liked, setLiked] = useState(0);

    useEffect(async () => {
        //get the product with id of this.props.product.id from your server
        let productId = props.route.params.Id;
        let _product = props.route.params.data;
        _product = productTest;//using for Testing
        let wishList = await AsyncStorage.getItem('myWhishList');
        console.log('wishList', wishList);
        if (wishList) wishList = JSON.parse(wishList);
        else wishList = [];

        if (_product) {
            productId = _product._id;
            setProductData(_product);
            setLiked(wishList.includes(_product._id) ? true : false)
        } else {
            Meteor.call('getSingleProduct', productId, (err, res) => {
                if (err) {
                    console.log('this is due to error. ' + err);
                } else {
                    productId = res._id;
                    setProductData(_product);
                    setLiked(wishList.includes(_product._id) ? true : false)
                }
            });
        }

        //Get Similar products
        Meteor.call('getSimilarProduct', productId, (err, res) => {
            console.log(err, res);
            if (err) {
                console.log('this is due to error. ' + err);
            } else {
                setSimilarProducts(res);
            }
        });

        //Update View Count
        Meteor.call('updateViewCount', productId);
    }, [])

    const orderNow = () => {
        let product = productData;
        if (selectedColor === '' && selectedSize === '') {
            ToastAndroid.showWithGravityAndOffset(
                'Please select favourite color and size !',
                ToastAndroid.LONG,
                ToastAndroid.TOP,
                0,
                50,
            );
        } else {
            product['orderQuantity'] = quantity;
            product['color'] = selectedColor ? selectedColor : productData.color[0];
            product['size'] = selectedSize ? selectedSize : product.size[0];
            product['finalPrice'] = Math.round(
                productData.price -
                (productData.discount
                    ? productData.price * (productData.discount / 100)
                    : 0),
            );
            props.navigation.navigate('Checkout', { productOrder: product });
        }
    }

    const addToCart = async () => {
        var product = productData;
        if (selectedColor === '' && selectedSize === '') {
            ToastAndroid.showWithGravityAndOffset(
                'Please select favourite color and size !',
                ToastAndroid.LONG,
                ToastAndroid.TOP,
                0,
                50,
            );
        } else {
            product['orderQuantity'] = quantity;
            product['color'] = selectedColor ? selectedColor : productData.color[0];
            product['size'] = selectedSize ? selectedSize : productData.size[0];
            // product['finalPrice'] = Math.round(this.state.product.price - (this.state.product.price * (this.state.product.discount / 100)));
            let cartList = await AsyncStorage.getItem('myCart');
            let cartItem = {
                id: product._id,
                orderQuantity: product.orderQuantity,
                color: product.color,
                size: product.size,
            };
            if (cartList) {
                cartList = JSON.parse(cartList);
            } else {
                cartList = [];
            }
            let index = cartList.findIndex(item => {
                return item.id == product._id;
            });
            if (index > -1) {
                cartList.splice(index, 1);
                cartList.push(cartItem);
            } else {
                cartList.push(cartItem);
            }
            ToastAndroid.showWithGravityAndOffset(
                'Product added to your cart !',
                ToastAndroid.LONG,
                ToastAndroid.TOP,
                0,
                50,
            );
            AsyncStorage.setItem('myCart', JSON.stringify(cartList));
            EventRegister.emit('cartItemsChanged', 'it works!!!')
        }
    }

    const addToWishlist = async () => {
        var productId = productData._id;
        const liked = liked;
        setLiked(!liked);
        let wishList = await AsyncStorage.getItem('myWhishList');
        if (wishList) {
            wishList = JSON.parse(wishList);
        } else {
            wishList = [];
        }
        let index = wishList.findIndex(item => {
            return item == productId;
        });
        if (index > -1) wishList.splice(index, 1);
        else wishList.push(productId);

        AsyncStorage.setItem('myWhishList', JSON.stringify(wishList));
        ToastAndroid.showWithGravityAndOffset(
            liked
                ? 'Product removed from  Wishlist !'
                : 'Product added to  Wishlist !',
            ToastAndroid.LONG,
            ToastAndroid.TOP,
            0,
            50,
        );
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
                    <View style={{ width: '50%' }}><Text>{item.metaName}</Text></View>
                    <View style={{ width: '50%' }}><Text>{item.metaValue}</Text></View>
                </View>
            </View>
        )
    }

    const renderSize = (item, index) => {
        let items = item.size.toUpperCase();
        return (
            <TouchableOpacity onPress={() => {
                setSelectedSize(items);
                setSizeIndex(index);
                console.log('selected size: ' + items);
            }}>
                <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-around', marginLeft: 15, marginTop: 20, marginBottom: 10 }}>
                    <Text style={{ fontWeight: index == sizeIndex ? 'bold' : null, fontSize: index == sizeIndex ? 18 : null }}>{items}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    const renderColor = (item, index) => {
        let items = item.colorName.toLowerCase();
        return (
            <TouchableOpacity onPress={() => {
                setSelectedColor(items);
                setColorIndex(index);
                console.log('selected color: ' + items);
            }}>
                <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 12, marginLeft: 15, marginTop: 20 }}>
                    <FIcon name='circle' style={{ color: items, fontSize: index == colorIndex ? 25 : 20 }} />
                </View>
            </TouchableOpacity>
        )
    }

    const _renderProduct = (data, index) => {
        let item = data.item;
        console.log(item);
        return (
            <View key={item._id}>
                <View>
                    {/* <Product
                        product={item}
                        navigation={props.navigation}
                    /> */}
                </View>
            </View>
        );
    };

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
                                <Text style={{ color: colors.whiteText, fontSize: 20 }}>Back</Text>
                            </RNPButton>
                        </Header>
                        <View style={styles.containerRegister}>
                            <Text style={{ fontWeight: 'bold', marginVertical: 15, fontSize: 18 }}>{productData.productTitle}</Text>
                        </View>
                        <View style={styles.sliderBox}>
                            {productData.images && productData.images.length > 0 ? renderImage() : null}
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
                            <View style={{ flexDirection: 'row', marginTop: 20, marginBottom: 10 }}>
                                <Text style={{ fontWeight: 'bold', }}>Quantity : </Text>
                                <Icon name='minus' onPress={() => { quantity > 1 ? setQuantity(quantity - 1) : null }} style={{ fontSize: 20, marginHorizontal: 15 }} />
                                <Text>{quantity}</Text>
                                <Icon name='plus' onPress={() => { setQuantity(quantity + 1) }} style={{ fontSize: 20, marginHorizontal: 15 }} />
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontWeight: 'bold', marginTop: 20, marginBottom: 10 }}>Color : </Text>
                                {productData.color && productData.color.length > 0 ? productData.color.map((item, index) => renderColor(item, index)) : <Text>N/A</Text>}
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Icon style={{ fontSize: 14, marginTop: 5 }} name='star' />
                                <Text style={{ fontWeight: 'bold' }}>3.5</Text>
                                <Text style={{ fontSize: 14, marginBottom: 10 }}>(12.5k)Ratings </Text>

                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontWeight: 'bold', marginTop: 20, marginBottom: 10 }}>Size : </Text>
                                {productData.size && productData.size.length > 0 ? productData.size.map((item, index) => renderSize(item, index)) : <Text>N/A</Text>}
                            </View>
                            <View>
                                <Text style={{ fontWeight: 'bold', marginTop: 20, marginBottom: 10 }}>Product Description : </Text>
                                <Text style={{ fontSize: 16 }}>{productData.description}</Text>
                            </View>
                            <View>
                                <Text style={{ fontWeight: 'bold', marginTop: 20, marginBottom: 10 }}>Product Specification : </Text>
                                {productData.productProperty && productData.productProperty.length > 0 ? productData.productProperty.map((item, index) => renderProductProperty(item, index)) : <Text>N/A</Text>}
                            </View>
                            <View style={styles.horizontalView}>
                                <RNPButton
                                    mode='outlined'
                                    onPress={() => { orderNow() }}
                                    uppercase={false}
                                    style={styles.btnContinue}
                                >
                                    <Text
                                        style={styles.btnBuyText}>
                                        Buy Now
                                    </Text>
                                    <Icon style={{ color: 'black', fontSize: 14 }} name="shopping-bag" />
                                </RNPButton>
                                <RNPButton
                                    mode='contained'
                                    onPress={() => { addToCart() }}
                                    uppercase={false}
                                    style={styles.btnContinue}
                                >
                                    <Text
                                        style={styles.btnContinueText}>
                                        Add to Cart
                                    </Text>
                                    <Icon style={{ color: '#ffffff', fontSize: 14 }} name="shopping-cart" />
                                </RNPButton>
                            </View>
                            {/* Ratings Sections */}
                            <View style={styles.blockHeader}>
                                <Text style={[styles.blockTitle, { fontSize: 16 }]}>
                                    Ratings & Reviews
                                </Text>
                                <RNPButton
                                    mode="text"
                                    uppercase={false}
                                    onPress={() => { }}>
                                    <Text style={{ fontSize: 10, color: colors.statusBar }}>
                                        See All
                                    </Text>
                                    <Icon
                                        name="arrow-right"
                                        style={customStyle.blockHeaderArrow}
                                    />
                                </RNPButton>
                            </View>
                            {/* Q/As Sections */}
                            <View style={styles.blockHeader}>
                                <Text style={[styles.blockTitle, { fontSize: 16 }]}>
                                    Q & As
                                </Text>
                                <RNPButton
                                    mode="text"
                                    uppercase={false}
                                    onPress={() => { }}>
                                    <Text style={{ fontSize: 10, color: colors.statusBar }}>
                                        See All
                                    </Text>
                                    <Icon
                                        name="arrow-right"
                                        style={customStyle.blockHeaderArrow}
                                    />
                                </RNPButton>
                            </View>
                            {/* Post A Questions Sections */}
                            <View>
                                <Text style={[styles.blockTitle, { fontSize: 16 }]}>
                                    Ask yours questions
                                </Text>
                                <Textarea
                                    rowSpan={4}
                                    placeholder="Write your review here"
                                    label="Write your review here"
                                    style={styles.inputTextarea}
                                    placeholderTextColor="#808080"
                                    underlineColorAndroid='red'
                                    value={question}
                                    onChangeText={(value) => setQuestion(value)}
                                    _dark={{
                                        placeholderTextColor: "gray.300",
                                    }}
                                />
                                <RNPButton
                                    mode="contained"
                                    uppercase={false}
                                    style={{ width: '50%', marginLeft: '25%', marginBottom: 15, borderRadius: 4 }}
                                    onPress={() => { }}>
                                    <Text style={{ fontSize: 14, color: colors.whiteText }}>
                                        Post question
                                    </Text>
                                </RNPButton>
                            </View>
                            {/* Similar Products Sections */}
                            <View style={styles.blockHeader}>
                                <Text style={[styles.blockTitle, { fontSize: 16 }]}>
                                    Similar Products
                                </Text>
                                <Text style={{ fontSize: 10, color: colors.statusBar, marginLeft: '35%' }}>
                                    You may also like
                                </Text>
                                <View style={{ marginTop: 15, flex: 1 }}>

                                    <FlatList
                                        contentContainerStyle={styles.mainContainer}
                                        data={similarProducts}
                                        keyExtracter={(item, index) => item._id}
                                        //horizontal={false}
                                        numColumns={3}
                                        renderItem={(item, index) =>
                                            _renderProduct(item, index)
                                        }
                                    />
                                </View>
                            </View>
                        </View>

                    </View>
                </TouchableWithoutFeedback>
            </Content>
        </Container>

    );
}
export default ProductDetail;

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
        //marginHorizontal: 20,
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

    btnBuyText: {
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
    },
    blockHeader: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // borderBottomWidth: 1,
        borderColor: '#E2E2E2',
        marginBottom: 15
    },
    blockTitle: {
        fontSize: 18,
        fontWeight: '700',
        fontFamily: 'Roboto',
        color: colors.gray_100,
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
        marginVertical: 15,
    },
});