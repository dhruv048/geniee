import React, { Component, useEffect } from 'react';
import { FlatList, TextInput, NativeModules, ToastAndroid, Alert, AsyncStorage } from 'react-native';
import {
    Container,
    Content,
    View,
    Grid,
    Col,
    Left,
    Right,
    Icon,
    List,
    ListItem,
    Body,
    Radio,
    Input,
    Item,
    Label
} from 'native-base';
import FAIcon from 'react-native-vector-icons/FontAwesome';

// Our custom files and classes import
import Text from '../../components/ecommerce/Text';
import Navbar from '../../components/ecommerce/Navbar';
import Meteor from "../../react-native-meteor";
import { colors } from "../../config/styles";
import { variables, customStyle } from '../../config/styles';
import { PaymentType, TransactionTypes, OrderStatus } from "../../config/settings";
import DeviceInfo from 'react-native-device-info'
import { goBack, goToRoute, navigateToRoutefromSideMenu } from "../../Navigation";
import settings from "../../config/settings";
import Loading from "../../components/Loading/Loading";
import Button from 'react-native-paper';

const Checkout = ({navigation}) => {
    this.state = {
        cartItems: [],
        total: 0,
        card: true,
        paypal: false,
        name: '',
        email: '',
        phone: '',
        country: '',
        address: '',
        city: '',
        postcode: '',
        note: '',
        paymentType: PaymentType.CASH,
        loading: false,
    };

    const updateTotal = (cartItems) => {
        // console.log(cartItems);
        var total = 0;
        cartItems.map((item) => {
            total += parseFloat(item.finalPrice) * parseInt(item.orderQuantity);
            this.setState({ total: total });
        });
    }

    const getdeviceId = () => {
        //Getting the Unique Id from here
        var id = DeviceInfo.getUniqueId();
        console.log('uniqueId', id)
        return id;
    };

    useEffect(() => {
        const singleProduct = this.props.productOrder;
        if (singleProduct) {
            singleProduct.addDate = new Date(new Date().toUTCString());
            singleProduct.type = 0;
            this.setState({
                cartItems: [singleProduct]
            });
            updateTotal([singleProduct]);
        }
        else {
            getCartItems();
        }
        this.setState({
            city: '',
            postcode: '',
            note: ''
        })
    });

    const getCartItems = () => {
        let products = [];
        let cartList = AsyncStorage.getItem('myCart');
        if (cartList) {
            cartList = JSON.parse(cartList);
            cartList.forEach(item => {
                products.push(item.id)
            }
            )
        }
        if (products.length == 0) {
            return true;
        }
        Meteor.call('WishListItemsEF', products, (err, res) => {
            console.log(err, res);
            if (err) {
                console.log('this is due to error. ' + err);
            }
            else {
                res.result.forEach(product => {
                    const cartItem = cartList.find(item => item.id == product._id);
                    console.log(cartItem, product)
                    product.orderQuantity = cartItem.orderQuantity;
                    product.size = cartItem.size;
                    product.color = cartItem.color;
                    product.finalPrice = Math.round(product.price - (product.discount ? (product.price * (product.discount / 100)) : 0));
                });
                this.setState({ cartItems: res.result });
                this.updateTotal(res.result);
            }
        });
    }

    const proceedCheckOut = () => {
        console.log('Proceed to checkout');

        navigation.navigate('PaymentMethod');
    };

    const renderItem = (data, i) => {
        let item = data.item;
        // console.log(item)
        return (
            <ListItem
                key={data.item._id}
                style={{ marginLeft: 0 }}
            >
                <Body style={{ paddingLeft: 10, flex: 4 }}>
                    <Text style={{ fontSize: 18 }}>
                        {item.orderQuantity > 1 ? item.orderQuantity + "x " : null}
                        {item.title}
                    </Text>
                    <Text style={{ fontSize: 15, fontStyle: 'italic' }}>Price: Rs. {item.finalPrice}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        {item.color ?
                            <Text style={{ fontSize: 14, fontStyle: 'italic' }}>Color: {item.color}</Text> : null}
                        {item.size ?
                            <Text style={{
                                fontSize: 14,
                                fontStyle: 'italic',
                                marginLeft: item.color ? 10 : 0
                            }}>Size: {item.size}</Text> : null}
                    </View>
                </Body>
                <Right style={{ flex: 2 }}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        marginBottom: 10
                    }}>Rs. {item.finalPrice * item.orderQuantity}</Text>
                </Right>
            </ListItem>
        );
    }

    return (
        <Container style={styles.container}>
            <Content style={{ backgroundColor: colors.appBackground }}>
                <View>
                    <Header
                        androidStatusBarColor={colors.statusBar}
                        style={{ backgroundColor: '#4d94ff' }}
                    >
                        <Left>
                            <Button
                                transparent
                                onPress={() => {
                                    navigation.goBack();
                                }}>
                                <Icon style={{ color: '#ffffff', fontSize: 20 }} name="arrow-left" />
                                <Text style={{ color: colors.whiteText }}>
                                    Checkout Info
                                </Text>
                            </Button>
                        </Left>
                        <Right>

                        </Right>
                    </Header>
                    <Text style={{ marginTop: 15, fontSize: 18 }}>Shipping information</Text>
                    <View style={styles.formGroup}>
                        <Label style={styles.formLabel}>Full name</Label>
                        <TextInput style={styles.formInput} placeholder=''
                            onChangeText={(text) => this.setState({ name: text })}
                            value={this.state.name} placeholderTextColor="#687373" />

                    </View>
                    <View style={styles.formGroup}>
                        <Label style={styles.formLabel}>Email address</Label>
                        <TextInput style={styles.formInput} placeholder=''
                            onChangeText={(text) => this.setState({ email: text })}
                            value={this.state.email} placeholderTextColor="#687373" />
                    </View>
                    <View style={styles.formGroup}>
                        <Label style={{ fontSize: 15, color: '#2E2E2E', marginBottom: 5 }}>Phone number</Label>
                        <TextInput style={styles.formInput} placeholder=''
                            onChangeText={(text) => this.setState({ phone: text })}
                            value={this.state.phone} placeholderTextColor="#687373" />
                    </View>
                    <View style={styles.formGroup}>
                        <Label style={styles.formLabel}>Address</Label>
                        <TextInput style={styles.formInput} placeholder=''
                            onChangeText={(text) => this.setState({ address: text })}
                            value={this.state.address} placeholderTextColor="#687373" />
                    </View>
                    <View style={styles.formGroup}>
                        <Label style={styles.formLabel}>City</Label>
                        <TextInput style={styles.formInput} placeholder=''
                            onChangeText={(text) => this.setState({ city: text })}
                            value={this.state.city} placeholderTextColor="#687373" />
                    </View>
                    <View style={styles.formGroup}>
                        <Label style={styles.formLabel}>Postcode</Label>
                        <TextInput style={styles.formInput} placeholder=''
                            onChangeText={(text) => this.setState({ postcode: text })}
                            value={this.state.postcode} placeholderTextColor="#687373" />
                    </View>
                    <View style={styles.formGroup}>
                        <Label style={styles.formLabel}>Note</Label>
                        <TextInput style={styles.formInput} placeholder=''
                            onChangeText={(text) => this.setState({ note: text })}
                            value={this.state.note} placeholderTextColor="#687373" />
                    </View>
                </View>
                <Text style={{ marginTop: 15, fontSize: 18 }}>Your order</Text>
                <View style={styles.invoice}>
                    <List>
                        <FlatList
                            data={this.state.cartItems}
                            renderItem={(item, index) => renderItem(item, index)}
                            _keyExtractor={(item, index) => {
                                return item._id
                            }}
                        />
                    </List>
                    <View style={styles.line} />
                    <Grid style={{ paddingLeft: 10, paddingRight: 10, marginTop: 7 }}>
                        <Col>
                            <Text style={{ fontSize: 18, fontStyle: 'italic' }}>Total</Text>
                        </Col>
                        <Col>
                            <Text style={{
                                textAlign: 'right',
                                fontSize: 18,
                                fontWeight: 'bold'
                            }}>Rs. {this.state.total}</Text>
                        </Col>
                    </Grid>
                </View>
                <View style={{ marginTop: 10, marginBottom: 10, paddingBottom: 7 }}>
                    <Button onPress={() => {
                        this.proceedCheckOut()
                    }} style={{ backgroundColor: colors.appLayout }} block
                        iconLeft>
                        <Icon name='ios-card' />
                        <Text style={{ color: '#fdfdfd' }}> Proceed to Payment</Text>
                    </Button>
                </View>
            </Content>
        </Container>
    );
}

const styles = {
    container: {
        backgroundColor: '#eee',
    },
    formGroup: {
        marginBottom: 15
    },
    formLabel: {
        fontSize: 15, color: '#2E2E2E', marginBottom: 5
    },
    formInput: {
        height: 48,
        backgroundColor: '#f4f4f4',
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 10,
        borderRadius: 4,
        fontSize: 16
    },
    invoice: {
        paddingLeft: 20,
        paddingRight: 20
    },
    line: {
        width: '100%',
        height: 1,
        backgroundColor: '#bdc3c7'
    }
};

export default Meteor.withTracker((props) => {
    let productId = props.productId;
    return {
        user: Meteor.user(),
        cartItems: Meteor.collection('cart').find(),
    }
})(CheckoutEF)