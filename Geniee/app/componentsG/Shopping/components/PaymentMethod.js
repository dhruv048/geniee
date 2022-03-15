import React, { Component, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, NativeModules, ToastAndroid, Alert, AsyncStorage, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import {
    Container,
    Content,
    View,
    Header,
    Left,
    Right,
    ListItem,
    Body,
    Thumbnail,
    Radio
} from 'native-base';
import FAIcon from 'react-native-vector-icons/FontAwesome';

// Our custom files and classes import
import Meteor from "../../../react-native-meteor";
import { colors } from "../../../config/styles";
import { PaymentType, TransactionTypes, OrderStatus } from "../../../config/settings";
import DeviceInfo from 'react-native-device-info'
import FIcon from 'react-native-vector-icons/Feather';
import { Button, TextInput } from 'react-native-paper';
import { customGalioTheme, customPaperTheme } from '../../../config/themes';
import { variables, customStyle } from '../../../config/styles';
import AIcon from 'react-native-vector-icons/AntDesign';
import shoppingHandler from '../../../store/services/shopping/handlers';

const paymentMethodList = [
    { id: 1, title: 'Sajilo Pay', subtitle: 'Get 10% off', image: require('Geniee/app/images/sajilopay.png'), icon: 'chevron-right' },
    { id: 2, title: 'E-sewa', subtitle: '', image: require('Geniee/app/images/esewa.png'), icon: 'chevron-right' },
    { id: 3, title: 'Credit/Debit Card', subtitle: '', image: require('Geniee/app/images/creditcard.jpg'), icon: 'chevron-right' },
    { id: 4, title: 'IME Pay', subtitle: '', image: require('Geniee/app/images/imepay.png'), icon: 'chevron-right' },
    { id: 5, title: 'Cash On Delivery', subtitle: '', image: require('Geniee/app/images/cashondelivery.png'), icon: 'checkcircle' },
];

const PaymentMethod = (props) => {
    const orderItems = props.route.params.data;
    const totalPrice = props.route.params.totalAmount ? props.route.params.totalAmount : 0;
    const [cashOnDeliverySelected, setCashOnDeliverySelected] = useState(false);
    const [paymentType, setPaymentType] = useState('');

    const placeMyOrders = async () => {
        //prepare for database
        let Item = orderItems;
        Item.PaymentType = paymentType;

        shoppingHandler.addOrder(Item, async (res) => {
            if (res.result) {
                try {
                    shoppingHandler.removeItemFromCart(Item);
                    ToastAndroid.showWithGravityAndOffset(
                        'Order Made Successfully!!',
                        ToastAndroid.SHORT,
                        ToastAndroid.BOTTOM,
                        0,
                        50,
                    );

                }
                catch (e) {
                    Meteor.call('removeOrder', res.result);
                    ToastAndroid.showWithGravityAndOffset(
                        e.message,
                        ToastAndroid.LONG,
                        ToastAndroid.TOP,
                        0,
                        80,
                    );
                }
                props.navigation.navigate('OrdersCompleted', { orderId: res.result });

            } else {
                console.log(err.reason);
                ToastAndroid.showWithGravityAndOffset(
                    err.reason,
                    ToastAndroid.LONG,
                    ToastAndroid.TOP,
                    0,
                    80,
                );
            }
        });
    };

    const selectPaymentMethod = (paymentTitle) => {
        setPaymentType(paymentTitle);
        if (paymentTitle === "Cash On Delivery") {
            setCashOnDeliverySelected(true);
            console.log('Cash On Delivery');
        } else {
            setCashOnDeliverySelected(false);
            console.log('Online Payment option selected');
        };
    };

    const renderItem = (data, index) => {
        let payMethod = data.item;
        let url = payMethod.image
        return (
            <ListItem
                key={payMethod.id}
                last={payMethod.length === index + 1}
                style={{ width: '100%' }}
            >
                <Body>
                    <TouchableOpacity
                        onPress={() => { selectPaymentMethod(payMethod.title) }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Image square style={{ width: 40, height: 40 }}
                                source={url} />
                            <View style={{ marginLeft: 15, marginVertical: 5 }}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold' }} numberOfLines={2}>
                                    {payMethod.title}
                                </Text>
                                <Text style={{ fontSize: 12, fontWeight: '300', color: 'green' }}>{payMethod.subtitle}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </Body>
                <Right style={{ alignItems: 'flex-end' }}>
                    {payMethod.title === "Cash On Delivery" ?
                        <AIcon name={payMethod.icon} size={30} style={{ marginRight: 12, color: cashOnDeliverySelected ? colors.statusBar : "" }} />
                        :
                        <FIcon name={payMethod.icon} size={30} style={{ marginRight: 12 }} />}
                </Right>
            </ListItem>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1 }} keyboardShouldPersistTaps='always'>
            <Content style={{ backgroundColor: colors.appBackground }}>
                <Header
                    androidStatusBarColor={colors.statusBar}
                    style={{ backgroundColor: colors.statusBar, marginTop: customPaperTheme.headerMarginVertical }}
                >
                    <Button
                        transparent
                        uppercase={false}
                        style={{ width: '100%', alignItems: 'flex-start' }}
                        onPress={() => {
                            props.navigation.goBack();
                        }}>
                        <FIcon style={{ color: '#ffffff', fontSize: 20 }} name="arrow-left" />
                        <Text style={{ color: colors.whiteText, fontSize: 20 }}>Back</Text>
                    </Button>
                </Header>
                <View style={{ marginHorizontal: 20 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: '10%' }}>
                        <Text style={styles.textField}>Available Methods</Text>
                        <Button
                            uppercase={false}
                            style={{ height: 45 }}
                            onPress={() => { }}>
                            <Text>Edit</Text>
                        </Button>
                    </View>

                    <View>
                        <FlatList
                            data={paymentMethodList}
                            renderItem={(item, index) => renderItem(item, index)}
                            _keyExtractor={(item, index) => {
                                return item.id
                            }}
                        />
                    </View>

                    {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, marginBottom: 15 }}>
                        <Text style={{ fontSize: 18, marginTop: 5 }}>Cash on Delivery</Text>

                    </View> */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 }}>
                        <Text style={{ fontSize: 18, marginTop: 5 }}>Total</Text>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 5, color: 'blue' }}>Rs.{totalPrice} /-</Text>
                    </View>
                    <View>
                        <Button
                            mode='contained'
                            uppercase={false}
                            style={styles.btnContinue}
                            onPress={() => placeMyOrders()}
                        >
                            <Text>Place my orders</Text>
                            <FIcon style={{ color: '#ffffff', fontSize: 15, marginTop: 5 }} name="arrow-right" />
                        </Button>
                    </View>
                </View>

            </Content>
        </SafeAreaView>
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
    textField: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 5,
    },
    lstItem: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'flex-start',
        alignContent: 'flex-start'
    }
});

export default PaymentMethod;