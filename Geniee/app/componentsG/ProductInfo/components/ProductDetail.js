import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import {
    View,
    StyleSheet,
    ToastAndroid,
    TouchableWithoutFeedback,
    Keyboard,
    TouchableOpacity,
    StatusBar
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
import { customGalioTheme, customPaperTheme } from '../../../config/themes';
import { categorySelector } from '../../../store/selectors';
import { connect } from 'react-redux';
import { ProgressViewIOSComponent, Image } from 'react-native';
import { SliderBox } from "react-native-image-slider-box";
import productHandlers from "../../../store/services/product/handlers";
import Meteor from '../../../react-native-meteor';
import { FlatList } from 'react-native-gesture-handler';
import Product from '../../../components/Store/Product';
import FIcon from 'react-native-vector-icons/FontAwesome';
import settings from '../../../config/settings';
import CartIcon from "../../../components/HeaderIcons/CartIcon";
import { Colors } from 'react-native/Libraries/NewAppScreen';
import IIcon from 'react-native-vector-icons/Ionicons';
import MIcon from 'react-native-vector-icons/MaterialIcons';

const RNFS = require('react-native-fs');

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
        //_product = productTest;//using for Testing
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
            !liked
                ? 'Product removed from  Wishlist !'
                : 'Product added to  Wishlist !',
            ToastAndroid.LONG,
            ToastAndroid.TOP,
            0,
            50,
        );
    }

    const renderImage = () => {
        const imageList = [];
        productData.images.map((item) => {
            imageList.push(settings.IMAGE_URLS + item);
        });
        return (
            <SliderBox
                images={imageList}
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
                    <View style={{ width: '50%' }}><Text>{item.metaName}  :</Text></View>
                    <View style={{ width: '50%'}}><Text style={{color:customPaperTheme.GenieeColor.lightTextColor}}>{item.metaValue}</Text></View>
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
        return (
            <TouchableOpacity
                key={item._id}
                onPress={() => props.navigation.navigate('ProductDetail', { data: product })}
                style={[
                    customStyle.productContainerStyle,
                    { borderTopLeftRadius: 4, borderTopRightRadius: 5 },
                ]}
            >
                <View
                    key={item._id}
                    style={[customStyle.Card, { top: 0, left: 0, rigth: 0 }]}>
                    <View style={{ width: '100%', borderRadius: 5 }}>
                        <Image
                            source={{ uri: settings.IMAGE_URLS + item.images[0] }}
                            style={{
                                flex: 1, width: undefined, height: 140, width: 90, resizeMode: 'cover', borderRadius: 4, marginBottom: 8,
                            }}
                        />
                    </View>
                    {/* <View style={{ position: 'absolute', top: 4, right: 4 }}>
                        {isInWishlist ?
                            <FAIcon name='heart' onPress={() => { addToWishlist(item._id) }} style={{ fontSize: 25, color: customPaperTheme.GenieeColor.likedColor }} /> :
                            <FAIcon name='heart' onPress={() => { addToWishlist(item._id) }} style={{ fontSize: 25, color: customPaperTheme.GenieeColor.disLikedColor }} />}
                    </View> */}
                    {!item.instock || item.availableQuantity < 0 ?
                        <View style={{ flexDirection: 'row', position: 'absolute', top: 90, left: 6, backgroundColor: 'red' }}>
                            <Text style={{ fontSize: 14, color: colors.whiteText }}>Out of Stock</Text>
                        </View> : null}
                    <View>
                        <View>
                            <Text numberOfLines={1} style={{ fontSize: 10 }}>From {item.businessName}</Text>
                            <Text numberOfLines={2} style={{ fontSize: 12, fontWeight: 'bold', color: colors.gray_100 }}>
                                {item.title}
                            </Text>
                            <View style={{ flexDirection: 'row' }}>
                                {item.discount ? (
                                    <>
                                        <Text style={{ color: colors.body_color, fontWeight: '400', fontSize: 12, textDecorationLine: 'line-through', textDecorationStyle: 'solid' }}>
                                            Rs. {item.price}
                                        </Text>
                                        <Text style={{ color: colors.body_color, fontWeight: '400', fontSize: 10, marginLeft: 5, }}>
                                            {item.discount}% off
                                        </Text>
                                    </>
                                ) : null}
                            </View>
                            <Text
                                style={{
                                    color: colors.primary,
                                    fontWeight: '700',
                                    fontSize: 12,
                                }}>
                                Rs. {item.price - (item.price * item.discount) / 100}
                            </Text>
                        </View>
                    </View>
                </View>

            </TouchableOpacity>
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
                        <StatusBar
                            backgroundColor='transparent'
                            barStyle='dark-content'
                            translucent={true}
                        />
                        <View style={styles.sliderBox}>
                            {productData.images && productData.images.length > 0 ? renderImage() : null}
                            <View style={{ position: 'absolute', flexDirection: 'row', justifyContent: 'space-between', marginTop: '10%', marginHorizontal: 5 }}>
                                <Icon
                                    style={{ color: colors.whiteText, fontSize: 20, marginRight: '70%' }}
                                    onPress={() => {
                                        props.navigation.goBack();
                                    }}
                                    name="arrow-left" />
                                <CartIcon></CartIcon>
                                <Icon
                                    style={{ color: colors.whiteText, fontSize: 20, marginLeft: 15 }}
                                    onPress={() => {
                                        console.log('SearchPressed');
                                    }}
                                    name="search" />
                            </View>
                        </View>
                        {productData && productData.business[0].isApproved ? <View style={styles.verifiedContainer}>
                            <IIcon name='shield-checkmark' size={15} style={styles.verifiedIcon} />
                            <Text style={styles.verifiedText}>Geniee verified seller</Text>
                        </View> : null}
                        {productData ? <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <MIcon name='storefront' size={14} style={styles.storeIcon} />
                            <Text style={styles.storeName}>{productData.business[0].businessName}</Text>
                            <MIcon name='my-location' size={14} style={styles.storeLocationIcon} />
                            <Text style={styles.storeLocation}>{productData.business[0].city},{productData.business[0].district}</Text>
                        </View> : null}
                        <View style={styles.containerRegister}>

                            <View>
                                <Text style={{ fontWeight: 'bold', marginVertical: 15, fontSize: 18 }}>{productData.productTitle}</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ textDecorationLine: 'line-through', textDecorationStyle: 'solid', marginRight: 10 }}>Rs.{productData.price}</Text>
                                <Text style={{ fontWeight: 'bold', color: 'red' }}>-{productData.discount}% Off</Text>
                            </View>
                            <Text style={{ color: colors.statusBar }}>Rs. {productData.price - (productData.price * productData.discount) / 100}</Text>
                            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                <Icon style={{ fontSize: 14, marginTop: 5 }} name='star' />
                                <Text style={{ fontWeight: 'bold' }}>3.5</Text>
                                <Text style={{ fontSize: 14, marginBottom: 10,color:customPaperTheme.GenieeColor.lightTextColor }}>(12.5k)Ratings </Text>
                                <TouchableOpacity onPress={() =>{console.log('see all views pressed')}}>
                                <View style={{ flexDirection: 'row', marginTop:1}}>
                                    <Text style={{fontSize:14,color:customPaperTheme.GenieeColor.lightTextColor}}>
                                        |  See reviews
                                    </Text>
                                    <IIcon style={{ color: 'black', fontSize: 14, marginTop:3, marginLeft:5,color:customPaperTheme.GenieeColor.lightTextColor }} name="open-sharp" />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 10, marginBottom: 10 }}>
                                <Text style={{ fontWeight: 'bold', }}>Quantity : </Text>
                                <Icon name='minus' onPress={() => { quantity > 1 ? setQuantity(quantity - 1) : null }} style={{ fontSize: 20, marginHorizontal: 15 }} />
                                <Text>{quantity}</Text>
                                <Icon name='plus' onPress={() => { setQuantity(quantity + 1) }} style={{ fontSize: 20, marginHorizontal: 15 }} />
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.titleStyle}>Choose Color : </Text>
                                {productData.color && productData.color.length > 0 ? productData.color.map((item, index) => renderColor(item, index)) : <Text>N/A</Text>}
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.titleStyle}>Choose Size : </Text>
                                {productData.size && productData.size.length > 0 ? productData.size.map((item, index) => renderSize(item, index)) : <Text>N/A</Text>}
                            </View>
                            <View>
                                <Text style={styles.titleStyle}>Product Description : </Text>
                                <Text style={{ fontSize: 16, color: '#B8B8B8' }}>{productData.description}</Text>
                            </View>
                            <View>
                                <Text style={styles.titleStyle}>Product Specification : </Text>
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
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={[styles.blockTitle, { fontSize: 16 }]}>
                                    Similar Products
                                </Text>
                                <Text style={{ fontSize: 10, color: colors.statusBar, marginLeft: '35%' }}>
                                    You may also like
                                </Text>

                            </View>
                            <View style={{ marginVertical: 15 }}>

                                <FlatList
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
        marginHorizontal: 20,
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
    verifiedContainer: {
        flexDirection: 'row',
        backgroundColor: customPaperTheme.GenieeColor.lightPrimaryColor,
        marginHorizontal: 15,
        height: 25,
        width: '60%'
    },

    verifiedIcon: {
        marginLeft: 15,
        marginTop: 3,
        color: customPaperTheme.GenieeColor.primaryColor
    },

    verifiedText: {
        marginLeft: 10,
        color: customPaperTheme.GenieeColor.primaryColor
    },

    storeIcon: {
        marginLeft: 15,
        marginTop: 3,
        color: customPaperTheme.GenieeColor.darkColor
    },

    storeName: {
        marginLeft: 10,
        color: customPaperTheme.GenieeColor.darkColor,
        fontSize: 14,
        fontWeight: 'bold'
    },

    storeLocationIcon: {
        marginLeft: 15,
        marginTop: 3,
        color: customPaperTheme.GenieeColor.lightTextColor
    },

    storeLocation: {
        marginLeft: 10,
        color: customPaperTheme.GenieeColor.lightTextColor,
        fontSize: 14
    },

    titleStyle: {
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10
    },
});