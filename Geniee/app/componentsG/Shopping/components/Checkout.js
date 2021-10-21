import React, { Component, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, NativeModules, ToastAndroid, Alert, AsyncStorage } from 'react-native';
import {
    Container,
    Content,
    View,
    Header,
    Left,
    Right,
    ListItem,
    Body,
} from 'native-base';
import FAIcon from 'react-native-vector-icons/FontAwesome';

// Our custom files and classes import
import Meteor from "../../../react-native-meteor";
import { colors } from "../../../config/styles";
import { PaymentType, TransactionTypes, OrderStatus } from "../../../config/settings";
import DeviceInfo from 'react-native-device-info'
import FIcon from 'react-native-vector-icons/Feather';
import { Button, TextInput } from 'react-native-paper';
import { customGalioTheme } from '../../../config/themes';
import { settings } from '../../../config/settings';

const Checkout = (props) => {
    const [cartItems, setCartItems] = useState('');
    const [total, setTotal] = useState(0);
    const [card, setCard] = useState(true);
    const [paypal, setPaypal] = useState(false);
    const [name, setName] = useState('Name');
    const [email, setEmail] = useState('Email');
    const [phone, setPhone] = useState('Number');
    const [address, setAddress] = useState('Address');
    const [disableShipping, setDisableShipping] = useState(true);
    const [disablePicking, setDisablePicking] = useState(true);
    const [shippingCharge, setShippingCharge] = useState(100);
    const [finalAmount, setFinalAmont] = useState(0);
    const [merchantName, setMerchantName] = useState('From chaudhary Group');

    useEffect(() => {
        const singleProduct = props.productOrder;
        if (singleProduct) {
            singleProduct.addDate = new Date(new Date().toUTCString());
            singleProduct.type = 0;
            setCartItems([singleProduct])
        }
        else {
            getCartItems();
        }
        props.user? getShippingAddress():null;
    }, []);

    const getShippingAddress = () => {
        setName(props.user.profile.firstName+ ' '+ props.user.profile.lastName);
        setEmail(props.user.profile.primaryEmail);
        setAddress(props.user.profile.city);
        setPhone(props.user.profile.contactNo);
    }

    const updateTotal = (myItems) => {
        // console.log(cartItems);
        var total = 0;
        myItems.map((item) => {
            total += parseFloat(item.finalPrice) * parseInt(item.orderQuantity);
            setTotal(total);
        });
        setFinalAmont(total+shippingCharge);
    }

    const getdeviceId = () => {
        //Getting the Unique Id from here
        var id = DeviceInfo.getUniqueId();
        return id;
    };

    const getCartItems = async () => {
        let products = [];
        let myCart = await AsyncStorage.getItem('myCart');
        if (myCart) {
            myCart = JSON.parse(myCart);
            myCart.forEach(item => {
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
                    const cartItem = myCart.find(item => item.id == product._id);
                    console.log(cartItem, product)
                    product.orderQuantity = cartItem.orderQuantity;
                    product.size = cartItem.size;
                    product.color = cartItem.color;
                    product.finalPrice = Math.round(product.price - (product.discount ? (product.price * (product.discount / 100)) : 0));
                });
                setCartItems(res.result);
                updateTotal(res.result);
            }
        });
    }

    // const proceedCheckOut = () => {
    //     console.log('This is cart Items '+cartItems);

    //     props.navigation.navigate('PaymentMethod',{data : cartItems,totalAmount:finalAmount});
    // };

    const proceedCheckOut = () => {
        let items = [];
        if (name.includes('Name') || phone.includes('Number') || address.includes('Address') || email.includes('Email')) {
            Alert.alert('Incomplete Contact Info', 'Please Enter all the contact info to complete Order.');
            return true;
        }
        const userToken= AsyncStorage.getItem(settings.USER_TOKEN_KEY);
        if(userToken){
            checkout()
        }
        else {
            Alert.alert(
                'You are not Logged In?',
                'Are you sure, you want to continue without Logged In? You will be not able to manage or see your orders from other devices. We suggest to log in before making orders.',
                [
                    {
                        text: 'Continue', onPress: () => {
                            checkout();
                        }
                    }
                    , {
                    text: 'Log In Now'
                    ,
                    onPress: () => {
                        props.navigation.navigate( 'SignIn', {needReturn: true}
                        )
                    }
                }],
                {
                    cancelable: false
                }
            );
        }
    }

    const checkout = () => {
        Alert.alert(
            'Confirm Checkout?',
            'Are you sure, you want to Checkout?',
            [
                {
                    text: 'Yes Checkout', onPress: () => {
                        let items = [];
                        if (name.includes('Name') || phone.includes('Number') || address.includes('Address') || email.includes('Email')) {
                            Alert.alert('Incomplete Contact Info', 'Please Enter all the contact info to complete Order.');
                            return true;
                        }
                        try {
                            cartItems.forEach(item => {
                                let product = {
                                    productOwner: item.productOwner,
                                    productId: item._id,
                                    title: item.title,
                                    price: item.price,
                                    isVeg: item.isVeg,
                                    finalPrice: item.finalPrice,
                                    discount: item.discount,
                                    unit: item.unit,
                                    quantity: item.orderQuantity,
                                    category: item.category || '',
                                    service: item.service || '',
                                    serviceOwner: item.serviceOwner || '',
                                    productImage: item.images[0],
                                    status: OrderStatus.ORDER_REQUESTED,
                                     color: item.colors,
                                     size: item.sizes,
                                };
                                items.push(product);
                            });
                        }
                        catch (e) {
                            console.log(e.message)
                        }
                        let Item = {
                            contact: {
                                name: name,
                                email: email,
                                phone: phone,
                                address: address,
                            },
                            totalPrice: total,
                            items: items,
                            deviceId: getdeviceId(),
                            //PaymentType: paymentType
                        };
                        _performOrder(Item);
                    }
                },
                {
                    text: 'Cancel', onPress: () => {
                        return
                    }
                }
            ],
            {cancelable: false}
        );
    }

    const _performOrder = (Item) => {
        console.log('This is order items '+ Item);
        props.navigation.navigate('PaymentMethod',{data : Item,totalAmount:finalAmount});
    }
    const renderItem = (data, i) => {
        let item = data.item;
        return (
            <ListItem
                key={data.item._id}
                style={{width:'100%'}}
            >
                <Body style={{flex: 4 }}>
                    <Text style={{ fontSize: 18, fontWeight:'bold' }}>
                        {/* {item.orderQuantity > 1 ? item.orderQuantity + "x " : null} */}
                        {item.title}
                    </Text>
                    <Text>From {merchantName}</Text>
                    {/* <Text style={{ fontSize: 15, fontStyle: 'italic' }}>Price: Rs. {item.finalPrice}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        {item.color ?
                            <Text style={{ fontSize: 14, fontStyle: 'italic' }}>Color: {item.color}</Text> : null}
                        {item.size ?
                            <Text style={{
                                fontSize: 14,
                                fontStyle: 'italic',
                                marginLeft: item.color ? 10 : 0
                            }}>Size: {item.size}</Text> : null}
                    </View> */}
                </Body>
                <Right style={{flex:2,alignItems:'flex-end'}}>
                    <Text style={{
                        fontSize: 18,
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
                <Header
                    androidStatusBarColor={colors.statusBar}
                    style={{ backgroundColor: '#4d94ff' }}
                >
                    <Button
                        transparent
                        uppercase={false}
                        style={{ width: '100%', alignItems: 'flex-start' }}
                        onPress={() => {
                            props.navigation.goBack();
                        }}>
                        <FIcon style={{ color: '#ffffff', fontSize: 20 }} name="arrow-left" />
                        <Text style={{ color: colors.whiteText, fontSize: 20 }}>Checkout Info</Text>
                    </Button>
                    {/* <Left style={{marginLeft:0}}>
                          
                    </Left>
                    <Right></Right> */}
                </Header>
                <View style={{ marginHorizontal: 20 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: '10%' }}>
                        <Text style={styles.textField}>Shipping Address</Text>
                        <Button
                            uppercase={false}
                            style={{ height: 45 }}
                            onPress={() => {setDisableShipping(false)}}>
                            <Text>Edit</Text>
                        </Button>
                    </View>
                    {disableShipping ?
                    <View>
                        <Text style={{fontSize:18,fontWeight:'bold',marginLeft:'18%'}}>To,{name}</Text>
                        <Text style={{marginLeft:'18%'}}>{address}</Text>
                    </View>
                        :<View>
                        <TextInput
                            mode="outlined"
                            disabled={disableShipping}
                            color='#F5F7FF'
                            // style={{width:'90%'}}
                            label="Name"
                            placeholder="Name"
                            placeholderTextColor='#F5F7FF'
                            onChangeText={(value) => setName(value)}
                            value={name}
                            style={styles.shippingName}
                            theme={{ roundness: 6 }}
                        />
                        <TextInput
                            mode="outlined"
                            disabled={disableShipping}
                            color={customGalioTheme.COLORS.INPUT_TEXT}
                            label="Address"
                            placeholder="Address"
                            placeholderTextColor='#808080'
                            onChangeText={(value) => setAddress(value)}
                            value={address}
                            style={styles.shippingAddress}
                            theme={{ roundness: 6 }}
                        />
                    </View>}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop:10 }}>
                        <Text style={styles.textField}>Who is picking</Text>
                        <Button
                            uppercase={false}
                            style={{ height: 45 }}
                            onPress={() => {setDisablePicking(false)}}>
                            <Text>Edit</Text>
                        </Button>
                    </View>
                    <View>
                        <TextInput
                            mode="outlined"
                            disabled={disablePicking}
                            left={<TextInput.Icon name="phone"/>}
                            color={customGalioTheme.COLORS.INPUT_TEXT}
                            label="Number"
                            placeholder="Number"
                            placeholderTextColor='#808080'
                            keyboardType="phone-pad"
                            onChangeText={(value) => setPhone(value)}
                            value={phone}
                            style={styles.inputBox}
                            theme={{ roundness: 6 }}
                        />
                        <TextInput
                            mode="outlined"
                            disabled={disablePicking}
                            left={<TextInput.Icon name="email"/>}
                            color={customGalioTheme.COLORS.INPUT_TEXT}
                            label="Email"
                            placeholder="Email"
                            placeholderTextColor='#808080'
                            onChangeText={(value) => setEmail(value)}
                            value={email}
                            style={styles.inputBox}
                            theme={{ roundness: 6 }}
                        />
                    </View>
                    <View>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 35 }}>Order Info</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
                        <Text style={{ fontSize: 18, marginTop: 5 }}>Items</Text>
                        <Text style={styles.textField}>{cartItems.length} Items</Text>
                    </View>
                    <View>
                        <FlatList
                            data={cartItems}
                            renderItem={(item, index) => renderItem(item, index)}
                            _keyExtractor={(item, index) => {
                                return item._id
                            }}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                        <Text style={{ fontSize: 18, marginTop: 5 }}>Subtotal</Text>
                        <Text style={styles.textField}>Rs.{total}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                        <Text style={{ fontSize: 18, marginTop: 5 }}>Delivery Cost</Text>
                        <Text style={styles.textField}>Rs.{shippingCharge}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
                        <Text style={{ fontSize: 18, marginTop: 5 }}>Total</Text>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 5, color: 'blue' }}>Rs.{finalAmount}</Text>
                    </View>
                    <View>
                        <Button
                            mode='contained'
                            uppercase={false}
                            style={styles.btnContinue}
                            onPress={() => { proceedCheckOut() }}
                        >
                            <Text>Proceed to Payment</Text>
                            <FIcon style={{ color: '#ffffff', fontSize: 15, marginTop: 10 }} name="arrow-right" />
                        </Button>
                    </View>
                </View>

            </Content>
        </Container>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.whiteText,
        flex: 1,
    },
    btnContinue: {
        width: '60%',
        marginBottom: 20,
        marginTop: '15%',
        marginLeft: '20%',
        borderRadius: 6,
        height: 45,
    },
    shippingName: {
        width: '80%',
        height: 30,
        color: 'rgba(0, 0, 0, 0.6)',
        fontSize: 18,
        fontWeight:'bold',
        //backgroundColor: colors.transparent,
        marginLeft:'15%',
        marginTop: 10,
    },
    shippingAddress: {
        width: '80%',
        height: 25,
        color: 'rgba(0, 0, 0, 0.6)',
        fontSize: 15,
        //backgroundColor: colors.transparent,
        marginBottom: 10,
        marginLeft:'18%'
    },
    inputBox: {
        width: '100%',
        height: 40,
        color: 'rgba(0, 0, 0, 0.6)',
        fontSize: 18,
        //backgroundColor: colors.transparent,
        marginTop: 10,
    },
    textField:{ 
        fontSize: 18, 
        fontWeight: 'bold', 
        marginTop: 5, 
    }
});

export default Meteor.withTracker((props) => {
    let productId = props.productId;
    return {
        user: Meteor.user(),
        cartItems: Meteor.collection('cart').find(),
    }
})(Checkout)