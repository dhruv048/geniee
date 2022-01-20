import React, { Component, useCallback, useEffect, useState } from 'react';
import Meteor from '../../../react-native-meteor';
import {
    StyleSheet,
    Dimensions,
    View,
    ToastAndroid,
    TouchableOpacity,
    FlatList,
    Image,
    SafeAreaView,
    StatusBar,
    RefreshControl,
} from 'react-native';
import {
    Header,
    Container,
    Content,
    Item,
    Body,
    Left,
    Button,
    Right,
    Text,
    ListItem,
    Thumbnail,
    Icon as NBIcon,
    Spinner,
    Card,
    CardItem,
    Picker,
} from 'native-base';
import Icon from 'react-native-vector-icons/Feather';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import { colors, customStyle, variables } from '../../../config/styles';
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
import settings from '../../../config/settings';
import { Button as RNPButton, TextInput } from 'react-native-paper';
import Moment from 'moment';
import AIcon from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-community/async-storage';
import productHandler from '../../../store/services/product/handlers';
import Statusbar from '../../Shared/components/Statusbar';
import { customPaperTheme } from '../../../config/themes';

const AllProduct = (props) => {
    const [loggedUser, setLoggedUser] = useState(Meteor.user());
    const [productList, setProductList] = useState([]);
    const [wishList, setWhishList] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(true);

    const product = props.route.params.data;

    useEffect(() => {
        //
        if (product) {
            setIsRefreshing(false);
            setProductList(product);
        } else {
            getAllProduct();
        }
    }, [])

    const getAllProduct = useCallback(() => {
        productHandler.getAllProducts((res) => {
            setIsRefreshing(false);
            if (res.result) {
                setProductList(res.result);
            }
        });
    });

    const _handleProductPress = (product) => {
        props.navigation.navigate('ProductDetail', { Id: product._id, data: product });
    }

    const onRefreshPage = () => {
        getAllProduct();
    }

    const addToWishlist = (productId) => {
        //Added to wishlist
        let index = wishList.findIndex(item => { return item == productId });
        if (index > -1)
            wishList.splice(index, 1);
        else
            wishList.push(productId);

        AsyncStorage.setItem('myWhishList', JSON.stringify(wishList));
        ToastAndroid.showWithGravityAndOffset(
            index > - 1 ? 'Product removed from  Wishlist !' : 'Product added to  Wishlist !',
            ToastAndroid.LONG,
            ToastAndroid.TOP,
            0,
            50,
        );
        updateCounts();
    }

    const updateCounts = async () => {
        let wishList = await AsyncStorage.getItem('myWhishList');
        if (wishList) {
            wishList = JSON.parse(wishList);
        } else {
            wishList = [];
        }
        setWhishList(wishList);
    };

    const _renderProduct = (data, index) => {
        let item = data.item;
        let isInWishlist = wishList.includes(item._id);
        return (
            <TouchableOpacity
                key={item._id}
                onPress={() => _handleProductPress(item)}
                style={[
                    customStyle.productContainerStyle,
                    { borderTopLeftRadius: 4, borderTopRightRadius: 5 },
                ]}>
                <View
                    key={item._id}
                    style={[customStyle.Card, { top: 0, left: 0, rigth: 0 }]}>
                    <View style={{ width: '100%', borderRadius: 5 }}>
                        <Image
                            source={{ uri: settings.IMAGE_URLS + item.images[0] }}
                            style={styles.productImage}
                        />
                    </View>
                    <View style={{ position: 'absolute', top: 4, right: 4, backgroundColor: '#FAFBFF', height: 30, width: 30, borderRadius: 4, justifyContent: 'center', alignItems: 'center' }}>
                        {isInWishlist ?
                            <FAIcon name='heart' onPress={() => { addToWishlist(item._id) }} style={{ fontSize: 25, color: customPaperTheme.GenieeColor.pinkColor }} /> :
                            <FAIcon name='heart' onPress={() => { addToWishlist(item._id) }} style={{ fontSize: 25, color: customPaperTheme.GenieeColor.lightDarkColor }} />}
                    </View>
                    <View>
                        <View>
                            <Text numberOfLines={1} style={{ fontSize: 10 }}>From {item.business[0].businessName}</Text>
                            <Text numberOfLines={2} style={styles.storeDescription}>{item.description}</Text>
                            <View style={{ flexDirection: 'row' }}>
                                {item.discount ? (
                                    <>
                                        <Text style={styles.originalPrice}>Rs. {item.price}</Text>
                                        <Text style={styles.discountPrice}>{item.discount}% off</Text>
                                    </>
                                ) : null}
                            </View>
                            <Text style={styles.finalPrice}>Rs. {item.price - (item.price * item.discount) / 100}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <>

            <SafeAreaView style={{ flex: 1, backgroundColor: colors.whiteText }}>
                <Statusbar />
                <View style={{ marginVertical: customPaperTheme.headerMarginVertical }}>
                    <Header
                        androidStatusBarColor={colors.statusBar}
                        style={{ backgroundColor: colors.statusBar }}
                    >
                        <RNPButton
                            transparent
                            uppercase={false}
                            style={{ width: '100%', alignItems: 'flex-start' }}
                            onPress={() => {
                                props.navigation.goBack();
                            }}>
                            <Icon style={{ color: '#ffffff', fontSize: 20 }} name="arrow-left" />
                            <Text style={{ color: colors.whiteText, fontSize: 20 }}>All  Products</Text>
                        </RNPButton>
                    </Header>
                </View>
                <Content
                    // onScroll={_onScroll}
                    refreshControl={<RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={onRefreshPage}
                    />}
                    style={{
                        //width: '100%',
                        flex: 1,
                        paddingTop: 2,
                        marginHorizontal: 10
                    }}>
                    {/* Search bar */}
                    <View>
                        {/* STORE*/}
                        {productList && productList.length > 0 ? (
                            <View>
                                <FlatList                                   
                                    data={productList}
                                    //horizontal={true}
                                    keyExtractor={(item, index) => item._id}
                                    showsHorizontalScrollIndicator={false}
                                    numColumns={3}
                                    renderItem={(item, index) => _renderProduct(item, index)}
                                />
                            </View>
                        ) : <Text>No Product Available.</Text>}
                    </View>

                </Content>
                {/* <FooterTabs route={'Home'} componentId={props.componentId}/> */}
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    productImage: {
        flex: 1,
        width: undefined,
        height: 160,
        width: 104,
        resizeMode: 'cover',
        borderRadius: 4,
        marginBottom: 8,
    },
    storeDescription: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.gray_100,
    },

    originalPrice: {
        color: colors.body_color,
        fontWeight: '400',
        fontSize: 12,
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid',
    },
    discountPrice: {
        color: colors.body_color,
        fontWeight: '400',
        fontSize: 10,
        marginLeft: 5,
    },
    finalPrice: {
        color: colors.primary,
        fontWeight: '700',
        fontSize: 12,
    },
});
export default AllProduct;
