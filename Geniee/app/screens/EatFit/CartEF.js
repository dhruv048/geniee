import React, { Component } from 'react';
import { Alert, AsyncStorage, FlatList, ToastAndroid,TouchableOpacity } from 'react-native';
import {
    Container,
    Content,
    View,
    Icon,
    Button,
    Left,
    Right,
    Body,
    ListItem,
    Thumbnail,
    Footer
} from 'native-base';

// Our custom files and classes import
import FIcon from "react-native-vector-icons/Feather";
import Text from '../../components/ecommerce/Text';
import Navbar from '../../components/ecommerce/Navbar';
import { colors, customStyle } from "../../config/styles";
import Meteor from "../../react-native-meteor";
import settings, { ProductOwner } from "../../config/settings";
import Loading from "../../components/Loading/Loading";
import { goBack, goToRoute } from "../../Navigation";
import Product from "../../components/Store/Product";

class CartEF extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cartItems: '',
            totalPrice: 0,
            popularProducts: [],
            shippingPrice: 0,
            liked: false
        };
        this.cartList = [];
        this.skip = 0;
        this.limit = 20;
        this.popularProducts = [];
    }

    getCartItems = (products) => {
        const cartList = this.cartList;
        if (products.length == 0) {
            this.setState({ cartItems: [] });
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
                this.setState({ cartItems: res.result, totalPrice, shippingPrice, });
            }
        });
    };
    async componentDidMount() {
        let products = [];
        let cartList = await AsyncStorage.getItem('myCart');
        if (cartList) {
            cartList = JSON.parse(cartList);
            cartList.forEach(item => {
                products.push(item.id)
            }
            )
        }
        else {
            cartList = [];
        }
        this.cartList = cartList;
        this.getCartItems(products);

        //Get popular products
        Meteor.call('getPopularProducts', this.skip, this.limit, (err, res) => {
            if (err) {
                console.log('this is due to error. ' + err);
            }
            else {
                this.skip = this.skip + this.limit;
                this.setState({ popularProducts: res.result });
            };
        });

        //Get Wishlist Items
        let wishList = await AsyncStorage.getItem('myWhishList');

        if (wishList) wishList = JSON.parse(wishList);
        else wishList = [];
        wishList.forEach((x) => {
            products.liked = x.includes(products) ? true : false;
            console.log('Product Id ' + products);
            console.log('Wishlist Id ' + x);
            console.log('Product Id liked ' + products.liked);
        })
        // this.setState({
        //     liked: wishList.includes(products) ? true : false,
        //     // liked: false
        // });


    }

    renderProduct = (data, index) => {
        let item = data.item;
        return (
            <Product product={item} navigation={this.props.navigation} onDelete={this.onDelete.bind(this)} />
        )
    }

    onDelete() {
        //Rerender popular Items
    }

    _plusQuantity(_product) {
        let cartItems = this.state.cartItems.slice();
        cartItems.forEach(item => {
            if (item._id == _product._id)
                item.orderQuantity = item.orderQuantity + 1;
        });
        this.setState({ cartItems });
    }

    _minusQuantity(_product) {
        let cartItems = this.state.cartItems.slice();
        cartItems.forEach(item => {
            if (item._id == _product._id)
                item.orderQuantity = item.orderQuantity - 1;
        });
        this.setState({ cartItems });
    }

    render() {
        var left = (
            <Left style={{ flex: 1 }}>
                <Button transparent onPress={() => {
                    this.props.navigation.goBack()
                }}>
                    <FIcon name="arrow-left" size={24} color={'#fff'} />
                </Button>
            </Left>
        );
        var right = (
            <Right style={{ flex: 1 }}>
                <Button transparent onPress={() => this.removeAllPressed()}>
                    <Text style={{ color: '#fff', textTransform: 'uppercase' }}>Empty</Text>
                </Button>
            </Right>
        );
        var title = "My Cart (" + [this.state.cartItems.length] + ")";
        return (
            <Container style={{ backgroundColor: colors.backgroundColor }}>
                <Navbar left={left} right={right} title={title} />
                {this.state.cartItems && this.state.cartItems.length <= 0 ?
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Icon name="ios-cart" size={100} style={{ fontSize: 100, color: '#95a5a6', marginBottom: 7 }} />
                        <Text style={{ fontSize: 16, color: '#A3A3A3', marginTop: 40 }}>Your cart is empty</Text>
                    </View>
                    :
                    <Content>
                        {this.state.cartItems ?
                            <FlatList
                                data={this.state.cartItems}
                                renderItem={(item, index) => this.renderItems(item, index)}
                                keyExtractor={(item, index) => {
                                    return item._id
                                }}
                            /> : <Loading />}

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10, marginHorizontal: 20 }}>
                            <View >
                                <Text style={{ fontSize: 16, marginBottom: 5 }}>Items ({this.state.cartItems.length})</Text>
                                <Text style={{ fontSize: 16, marginBottom: 12 }}>Shipping</Text>
                                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>SubTotal</Text>
                            </View>
                            <View>
                                <Text style={{ fontSize: 16, marginBottom: 5 }}></Text>
                                <Text style={{ fontSize: 16, marginBottom: 12 }}>Rs. {this.state.shippingPrice}</Text>
                                <Text style={{ fontSize: 16, color: 'blue' }}>Rs. {this.state.totalPrice + this.state.shippingPrice}</Text>
                            </View>
                        </View>
                        {this.state.cartItems.length > 0 ?

                            // <Footer style={customStyle.footer}>
                            <View style={[customStyle.row, { padding: 10 }]}>
                                <View style={customStyle.col}>
                                    <Button onPress={() => this.checkout()} style={customStyle.buttonPrimary}
                                        block iconLeft>
                                        <FIcon name='credit-card' size={18} color={'#fff'} style={{ marginRight: 10 }} />
                                        <Text uppercase={false} style={customStyle.buttonPrimaryText}>CHECKOUT</Text>
                                    </Button>
                                </View>
                            </View>
                            // </Footer>
                            : null}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 30, marginHorizontal: 10 }}>
                            <Text style={{ marginTop: 5 }}>You may also like</Text>
                            <Button transparent>
                                <Text style={{ color: 'blue' }}> View All</Text>
                            </Button>
                        </View>
                        <View>
                            {/* <Text>This is product FlatList Commented</Text> */}
                            <FlatList contentContainerStyle={{ flex: 1, paddingHorizontal: 5, width: '100%', }}
                                data={this.state.popularProducts}
                                keyExtracter={(item, index) => item._id}
                                numColumns={2}
                                renderItem={(item, index) => this.renderProduct(item, index)}
                                onEndReachedThreshold={0.1}
                            />
                        </View>
                    </Content>
                }

            </Container>

        );
    }

    renderItems(data, index) {
        let item = data.item;
        return (
            <View>
                <ListItem
                    key={data.item._id}
                    last={this.state.cartItems.length === index + 1}
                    onPress={() => this.itemClicked(item)}
                >
                    <View style={{ flexDirection: 'row'}}>
                        <Thumbnail square style={{ width: 80, height: 80, borderRadius: 4 }}
                            source={{ uri: settings.IMAGE_URL + item.images[0] }} />
                        <View style={{ marginLeft: 15 }}>
                            <View style={{flexDirection: 'row',justifyContent:'space-around' }}>
                                <Text style={{ fontSize: 10 }}> From Chaudhary Group</Text>
                                <TouchableOpacity 
                                transparent 
                                style={{marginLeft:130,color:colors.danger}}
                                onPress={() => this.removeItemPressed(data.item)}>
                                    <FIcon name='x-circle' size={15}/>
                                </TouchableOpacity>
                            </View>
                            <Text style={{ fontSize: 16, fontWeight: 'bold' }} numberOfLines={2}>
                                {item.title}
                                {/* {item.orderQuantity > 1 ? " x " + item.orderQuantity : null} */}
                            </Text>
                            {/*<Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 5}}>Rs. {item.finalPrice} <Text style={{fontWeight: 'normal', fontSize: 13}}>{item.orderQuantity > 1 ? " x " + item.orderQuantity : null}</Text></Text>*/}
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'blue', marginRight: 10 }}>Rs. {item.finalPrice}</Text>
                                <Text style={{ fontSize: 12, textDecorationLine: 'line-through', textDecorationStyle: 'solid', marginTop:3 }}>Rs. {item.price}</Text>
                            </View>
                            {/* <Text style={{ fontSize: 12, fontWeight: '300' }}>{item.discount} %OFF</Text> */}
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <Button block icon transparent onPress={this._minusQuantity.bind(this, item)}
                                // onPress={() => this.setState({ quantity: item.orderQuantity > 1 ? item.orderQuantity - 1 : 1 })}
                                >
                                    <FIcon name='minus' size={16} style={{ paddingRight: 16 }} />
                                </Button>
                                <Text style={{ fontSize: 16, marginTop: 10 }}>{item.orderQuantity}</Text>
                                <Button block icon transparent onPress={this._plusQuantity.bind(this, item)}
                                // onPress={() => this.setState({ quantity: item.orderQuantity + 1 })}
                                >
                                    <FIcon style={{ paddingLeft: 16 }} size={16} name='plus' />
                                </Button>
                            </View>
                        </View>
                        {/* <Right >
                            <View style={{ flexDirection: 'row' }}>
                                <Button transparent onPress={() => this.addToWishlist(data.item)}>
                                <FIcon name="heart" color={item.liked?colors.primary: '#8E8E8E'} size={24} style={{ paddingRight: 20 }} />
                                </Button>
                                <Button transparent onPress={() => this.removeItemPressed(data.item)}>
                                    <FIcon name='trash' size={24} color={'#8E8E8E'} />
                                </Button>
                            </View>
                        </Right> */}
                    </View>
                </ListItem>
            </View>
        );
    }

    removeItemPressed(Item) {
        Alert.alert(
            'Remove ' + Item.title,
            'Are you sure you want to remove this item from your cart?',
            [
                { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' },
                {
                    text: 'Yes', onPress: () => {
                        let { cartItems } = this.state;
                        let index = cartItems.findIndex(item => item._id == Item._id);
                        if (index >= 0) {
                            cartItems.splice(index, 1);
                            this.setState({ cartItems });
                        }
                        let idx = this.cartList.findIndex(item => item.id == Item._id);
                        if (idx >= 0) {
                            this.cartList.splice(idx, 1);
                            AsyncStorage.setItem('myCart', JSON.stringify(this.cartList));
                        }
                        ToastAndroid.showWithGravityAndOffset(
                            'Removed Successfully!!',
                            ToastAndroid.LONG,
                            ToastAndroid.TOP,
                            0,
                            80,
                        );
                        // Meteor.call('removeCartItem', item._id, (err) => {
                        //     if (err) {
                        //         console.log(err.reason);
                        //     }else{
                        //         this.getCartItems();
                        //     }
                        // })
                    }
                },
            ]
        )
    }

    async addToWishlist(item) {
        var productId = item._id;
        const liked = this.state.liked;
        this.setState({ liked: !liked });
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



    removeAllPressed() {
        Alert.alert(
            'Empty cart',
            'Are you sure you want to empty your cart?',
            [
                { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' },
                {
                    text: 'Yes', onPress: () => {
                        this.cartList = [];
                        this.getCartItems([]);
                        AsyncStorage.setItem('myCart', JSON.stringify([]));
                        ToastAndroid.showWithGravityAndOffset(
                            'Your Cart is Empty now!!',
                            ToastAndroid.LONG,
                            ToastAndroid.TOP,
                            0,
                            80,
                        );
                    }
                }
            ]
        )
    }


    checkout() {
        this.props.navigation.navigate('CheckoutEF');
    }

    itemClicked(item) {
        if (item.productOwner == ProductOwner.EAT_FIT)
            this.props.navigation.navigate('ProductDetailEF', { Id: item._id, data: item });
        else
            this.props.navigation.navigate('ProductDetail', { Id: item._id, data: item });
    }

}

// export default CartEF;

export default Meteor.withTracker(() => {
    return {
        // cartItems: Meteor.collection('cart').find()
    }
})(CartEF)
const styles = {
    title: {
        fontFamily: 'Roboto',
        fontWeight: '100'
    }
};
