import {
    Container,
    Content,
    Header,
    Left,
    Right,
    ListItem,
    Thumbnail,
} from 'native-base';
import React, { useEffect, useState } from 'react';
import { Keyboard, View, Text, StyleSheet, FlatList, Alert, AsyncStorage, ToastAndroid, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import { colors } from '../../../config/styles';
import Icon from 'react-native-vector-icons/Feather';
import Meteor from '../../../react-native-meteor';

const MyCart = ({ navigation }) => {
    const [ cartItems,setCartItems] = useState('');
    const [ totalPrice,settotalPrice] = useState(0)
    const [ shippingPrice,setShippingPrice] = useState(0);
    const [ liked,setLiked] = useState(false);
    const [ cartList,setcartList] = useState();

    useEffect(() => {
        var products = [];
        var cartList = AsyncStorage.getItem('myCart');
        if (cartList) {
            cartList = JSON.parse(JSON.stringify(cartList));
            cartList.forEach(item => {
                products.push(item.id)
            }
            )
        }
        else {
            cartList = [];
        }
        cartList = cartList;
        getCartItems(products);
    }, [])

    const getCartItems = (products) => {
        const cartList = cartList;
        if (products.length == 0) {
            setCartItems();
            return true;
        }
        Meteor.call('WishListItemsEF', products, (err, res) => {

            console.log(err, res);
            if (err) {
                console.log('this is due to error. ' + err);
            }
            else {
                let totalPrice = 0;
                let shippingPrice = 0;
                res.result.forEach((product, indx) => {
                    const cartItem = cartList.find(item => item.id == product._id);
                    //console.log(cartItem, product)
                    product.orderQuantity = cartItem.orderQuantity;
                    product.color = cartItem.color;
                    product.size = cartItem.size;
                    product.finalPrice = Math.round(product.price - (product.discount ? (product.price * (product.discount / 100)) : 0));
                    product.shippingChage = product.homeDelivery ? (product.shippingChage ? product.shippingChage : 0) : 0;
                    shippingPrice = shippingPrice + product.shippingChage;
                    // product.totalPrice = product.totalPrice + Math.round(product.price - (product.discount ? (product.price * (product.discount / 100)) : 0))
                    totalPrice = totalPrice + (product.finalPrice * product.orderQuantity) + product.shippingChage;
                    //console.log(shippingPrice, totalPrice);
                });
                setCartItems(res.result)
                //this.setState({ cartItems: res.result, totalPrice, shippingPrice, });
            }
        });
    };

    const _plusQuantity = (_product) => {
        let cartItems = cartItems.slice();
        cartItems.forEach(item => {
            if (item._id == _product._id)
                item.orderQuantity = item.orderQuantity + 1;
        });
        setCartItems(cartItems);
        //this.setState({ cartItems });
    }

    const _minusQuantity = (_product) => {
        let cartItems = cartItems.slice();
        cartItems.forEach(item => {
            if (item._id == _product._id)
                item.orderQuantity = item.orderQuantity - 1;
        });
        setCartItems(cartItems);
        //this.setState({ cartItems });
    }

    const removeItemPressed = (Item) => {
        Alert.alert(
            'Remove ' + Item.title,
            'Are you sure you want to remove this item from your cart?',
            [
                { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' },
                {
                    text: 'Yes', onPress: () => {
                        // let { cartItems } = this.state;
                        let index = cartItems.findIndex(item => item._id == Item._id);
                        if (index >= 0) {
                            cartItems.splice(index, 1);
                            setCartItems(cartItems);
                        }
                        let idx = cartList.findIndex(item => item.id == Item._id);
                        if (idx >= 0) {
                            cartList.splice(idx, 1);
                            AsyncStorage.setItem('myCart', JSON.stringify(cartList));
                        }
                        ToastAndroid.showWithGravityAndOffset(
                            'Removed Successfully!!',
                            ToastAndroid.LONG,
                            ToastAndroid.TOP,
                            0,
                            80,
                        );
                    }
                },
            ]
        )
    }

    const handleCheckout = () => {
        console.log('Proceed to checkout');
    }

    const renderItems = (data, index) => {
        let item = data.item;
        return (
            <View>
                <ListItem
                    key={data.item._id}
                    last={cartItems.length === index + 1}
                >
                    <View style={{ flexDirection: 'row' }}>
                        <Thumbnail square style={{ width: 80, height: 80, borderRadius: 4 }}
                            source={{ uri: settings.IMAGE_URL + item.images[0] }} />
                        <View style={{ marginLeft: 15 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                <Text style={{ fontSize: 10 }}> From Chaudhary Group</Text>
                                <TouchableOpacity
                                    transparent
                                    style={{ marginLeft: 130, color: colors.danger }}
                                    onPress={() => removeItemPressed(data.item)}>
                                    <FIcon name='x-circle' size={15} />
                                </TouchableOpacity>
                            </View>
                            <Text style={{ fontSize: 16, fontWeight: 'bold' }} numberOfLines={2}>
                                {item.title}
                            </Text>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'blue', marginRight: 10 }}>Rs. {item.finalPrice}</Text>
                                <Text style={{ fontSize: 12, textDecorationLine: 'line-through', textDecorationStyle: 'solid', marginTop: 3 }}>Rs. {item.price}</Text>
                            </View>
                            {/* <Text style={{ fontSize: 12, fontWeight: '300' }}>{item.discount} %OFF</Text> */}
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <Button block icon transparent onPress={_minusQuantity(item)}
                                >
                                    <FIcon name='minus' size={16} style={{ paddingRight: 16 }} />
                                </Button>
                                <Text style={{ fontSize: 16, marginTop: 10 }}>{item.orderQuantity}</Text>
                                <Button block icon transparent onPress={_plusQuantity(item)}
                                >
                                    <FIcon style={{ paddingLeft: 16 }} size={16} name='plus' />
                                </Button>
                            </View>
                        </View>
                    </View>
                </ListItem>
            </View>
        );
    }

    return (
        <Container>
            <Content style={{ backgroundColor: colors.appBackground }}>
                <Header
                    androidStatusBarColor={colors.statusBar}
                    style={{ backgroundColor: '#4d94ff' }}
                >
                    <Left>
                        <Button
                            transparent
                            uppercase={false}
                            onPress={() => {
                                navigation.goBack();
                            }}>
                            <Icon style={{ color: '#ffffff', fontSize: 20 }} name="arrow-left" />
                            <Text style={{ color: colors.whiteText }}>
                                Cart
                            </Text>
                        </Button>
                    </Left>
                    <Right>

                    </Right>
                </Header>
                <View style={styles.container}>
                    <View style={styles.cartList}>
                        {
                            cartItems && cartItems.length <= 0 ?
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Icon name="ios-cart" size={100} style={{ fontSize: 100, color: '#95a5a6', marginBottom: 7 }} />
                                    <Text style={{ fontSize: 16, color: '#A3A3A3', marginTop: 40 }}>Your cart is empty</Text>
                                </View>
                                :
                                <View>
                                    {cartItems ?
                                        <FlatList
                                            data={cartItems}
                                            renderItem={(item, index) => renderItems(item, index)}
                                            keyExtractor={(item, index) => {
                                                return item._id
                                            }}
                                        /> : null}
                                </View>
                        }

                    </View>
                    <Button
                        mode='contained'
                        uppercase={false}
                        style={{ marginBottom: 15, height: 40 }}
                        onPress={() => { handleCheckout() }}
                    >
                        <Text>Continue to checkout</Text>
                        <Icon style={{ color: '#ffffff', fontSize: 15, marginTop: 5 }} name="arrow-right" />
                    </Button>
                </View>
            </Content>
        </Container>
    );
}

export default MyCart;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '2%',
    },

    cartList: {

    }
})