/**
 * This is the Product component
 **/

// React native and others libraries imports
import React, { Component, PureComponent } from 'react';
import { Image, TouchableOpacity,ToastAndroid } from 'react-native';
import { View, Col, Card, CardItem, Body, Button, Text, Grid } from 'native-base';
import settings from "../../config/settings";
import { customStyle, colors } from '../../config/styles';
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-community/async-storage';
//
// import Text from './Text';

export default class Product extends PureComponent {

    constructor(props) {
        super(props);
        this.state={
            liked : false,
        }
    }

   async componentDidMount() {
        let wishList = await AsyncStorage.getItem('myWhishList');
        console.log('wishList', wishList);
        if (wishList) wishList = JSON.parse(wishList);
        else wishList = [];
        this.setState({
            liked: wishList.includes(this.props.product._id) ? true : false,
            // liked: false
        });
    }

    async addToWishlist() {
        var productId = this.props.product._id;
        const liked = this.state.liked;
        this.setState({ liked: !liked });
        let wishList = await AsyncStorage.getItem('myWhishList');
        if (wishList) {
            wishList = JSON.parse(wishList);
        } else {
            wishList = [productId];
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

    render() {
        const { product, isRight, navigation } = this.props;
        //    console.log(product)
        return (
            <>
                {/* <Card transparent>
                    <CardItem cardBody style={{width:'100%'}}>

                            <Image source={{uri: settings.IMAGE_URL + product.images[0]}} style={style.image}/>
                            <View style={style.border} />

                    </CardItem>
                    <CardItem style={{paddingTop: 0}}>
                        <Button style={{flex: 1, paddingLeft: 0, paddingRight: 0, paddingBottom: 0, paddingTop: 0}}
                                transparent
                                onPress={() => {}}
                        >
                            <Body>
                            <Text
                                style={{fontSize: 16}}
                                numberOfLines={1}
                            >{product.title}</Text>
                            <View style={{flex: 1, width: '100%', alignItems: 'center'}}>
                                <View style={style.line} />
                                <Text style={style.price}>Rs. {product.price}</Text>
                                <View style={style.line} />
                            </View>
                            </Body>
                        </Button>
                    </CardItem>
                </Card> */}

                <TouchableOpacity key={product._id}
                    onPress={() => navigation.navigate('ProductDetail', { Id: product._id })}
                    style={[style.productContainerStyle, { borderTopLeftRadius: 5, borderTopRightRadius: 5 }]}>
                    {/*<Product key={product._id} product={product}/>*/}
                    <View style={[customStyle.Card, { top: 0, left: 0, rigth: 0, }]}>
                        <CardItem cardBody style={{ width: '100%', borderRadius: 5 }}>
                            <Image
                                source={{ uri: settings.IMAGE_URL + product.images[0] }}
                                style={{
                                    flex: 1,
                                    width: '100%',
                                    height: 150,
                                    resizeMode: 'cover',
                                    borderRadius: 5
                                }}
                            />
                            <TouchableOpacity
                                style={{
                                    position: 'absolute',
                                    top: 5,
                                    right: 5,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: 32,
                                    height: 32,
                                    borderRadius: 100,
                                    opacity: 0.7,
                                    backgroundColor: this.state.liked?colors.whiteText: colors.gray_200
                                }}
                                onPress={this.addToWishlist.bind(this)}>
                                <Icon name="heart" color={this.state.liked?colors.primary: colors.whiteText} size={20} />
                            </TouchableOpacity>
                        </CardItem>
                        <CardItem style={{ paddingTop: 0, paddingLeft: 5 }}>
                            <Body>
                                <View style={{ height: 35 }}>
                                    <Text note numberOfLines={2} style={{ fontWeight: 'bold' }}>
                                        {/* style={{ fontSize: 12, color: colors.primaryText }}
                 numberOfLines={1}> */}
                                        {product.title}
                                    </Text>
                                </View>
                                <Text style={{ color: colors.appLayout, fontWeight: '700', fontSize: 14 }}>Rs. {(product.price - (product.price * product.discount) / 100)}</Text>
                                {product.discount ?
                                    <>
                                        <Text style={{ color: colors.gray_200, fontWeight: '500', fontSize: 12, textDecorationLine: 'line-through', textDecorationStyle: 'solid' }}>Rs. {product.price}</Text>
                                        <Text style={{ color: colors.gray_200, fontWeight: '300', fontSize: 10, }}>{product.discount}% off</Text>
                                    </> : null}
                            </Body>
                        </CardItem>
                    </View>
                </TouchableOpacity>
            </>
        );
    }

}

const style = {
    button: { flex: 1, height: 150, paddingLeft: 4, paddingRight: 4 },
    image: { flex: 1, width: undefined, height: 150, resizeMode: 'cover' },
    leftMargin: {
        marginLeft: 7,
        marginRight: 0,
        marginBottom: 7
    },
    rightMargin: {
        marginLeft: 0,
        marginRight: 7,
        marginBottom: 7
    },
    border: {
        position: 'absolute',
        top: 10,
        left: 10,
        right: 10,
        bottom: 10,
        borderWidth: 1,
        borderColor: 'rgba(253, 253, 253, 0.2)'
    },
    price: {
        fontSize: 16,
        paddingLeft: 5,
        paddingRight: 5,
        zIndex: 1000,
        backgroundColor: '#fdfdfd'
    },
    line: {
        width: '100%',
        height: 1,
        backgroundColor: '#7f8c8d',
        position: 'absolute',
        top: '52%'
    },
    productContainerStyle: {
        height: 250,
        flex: 1,
        borderWidth: 0,
        marginHorizontal: 2,
        marginVertical: 4,
        borderColor: '#ffffff',
        width: '100%',
        backgroundColor: 'white'
    },
}