import React, { Component, useEffect, useState } from 'react';
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
    useWindowDimensions,
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
} from 'native-base';
import Icon from 'react-native-vector-icons/Feather';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import { colors, customStyle, variables } from '../../../config/styles';
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
import settings from '../../../config/settings';
import { Button as RNPButton, TextInput } from 'react-native-paper';
import Moment from 'moment';
import EIcon from 'react-native-vector-icons/EvilIcons';
import ProgressCircle from 'react-native-progress-circle';
import AIcon from 'react-native-vector-icons/AntDesign';
import { customPaperTheme } from '../../../config/themes';
import Statusbar from '../../Shared/components/Statusbar';

const productLists = [
    {
        "_id": "4755jPwTynSgwZgzQ",
        "orderId": "20211123abcd12",
        "businessName": "Omkar Iphone Store",
        "title": "This is title of product.This is tested.",
        "description": "Love",
        "contact": "",
        "radius": 0,
        "homeDelivery": false,
        "price": 300,
        "discount": 5,
        "unit": "200",
        "images": [
            "1635072638975.png"
        ],
        "city": "kathmandu",
        "availableQuantity": 100,
        "instock": true,
        "date": "2021-08-08",
        "orderStatus": 0,
    },
    {
        "_id": "mXuQTExhKZcSw8J7Q",
        "orderId": "20211123abcd12",
        "businessName": "Omkar Iphone Store",
        "title": "This is title of product.This is tested.",
        "description": "Love",
        "contact": "",
        "radius": 0,
        "homeDelivery": false,
        "price": 300,
        "discount": 5,
        "unit": "200",
        "images": [
            "1635072638975.png"
        ],
        "city": "kathmandu",
        "availableQuantity": 0,
        "instock": false,
        "date": "2021-08-08",
        "orderStatus": 0,
    },
    {
        "_id": "4755jPwTynSgwZgzQ",
        "orderId": "20211123abcd12",
        "businessName": "Omkar Iphone Store",
        "title": "This is title of product.This is tested.",
        "description": "Love",
        "contact": "",
        "radius": 0,
        "homeDelivery": false,
        "price": 300,
        "discount": 5,
        "unit": "200",
        "images": [
            "1635072638975.png"
        ],
        "city": "kathmandu",
        "availableQuantity": 100,
        "instock": true,
        "date": "2021-08-08",
        "orderStatus": 1,
    },
    {
        "_id": "mXuQTExhKZcSw8J7Q",
        "orderId": "20211123abcd12",
        "businessName": "Omkar Iphone Store",
        "title": "This is title of product.This is tested khjkhj sryt hdg.",
        "description": "Love",
        "contact": "",
        "radius": 0,
        "homeDelivery": false,
        "price": 300,
        "discount": 5,
        "unit": "200",
        "images": [
            "1635072638975.png"
        ],
        "city": "kathmandu",
        "availableQuantity": 100,
        "instock": true,
        "date": "2021-08-08",
        "orderStatus": 2,
    },
    {
        "_id": "mXuQTExhKZcSw8J7Q",
        "orderId": "20211123abcd12",
        "businessName": "Omkar Iphone Store",
        "title": "This is title of product.This is tested.",
        "description": "Love",
        "contact": "",
        "radius": 0,
        "homeDelivery": false,
        "price": 300,
        "discount": 5,
        "unit": "200",
        "images": [
            "1635072638975.png"
        ],
        "city": "kathmandu",
        "availableQuantity": 100,
        "instock": true,
        "date": "2021-08-08",
        "orderStatus": 2,
    }
]

const MyOrders = (props) => {

    const [shipButtonActive, setShipButtonActive] = useState(true);
    const [onGoingButtonActive, setOnGoingButtonActive] = useState(false);
    const [completedButtonActive, setCompletedButtonActive] = useState(false);

    var data = productLists.filter(item => item.orderStatus == 0);
    const [productList, setProductList] = useState(data);

    const handleShipButton = () => {
        setShipButtonActive(true);
        setOnGoingButtonActive(false);
        setCompletedButtonActive(false);
        var data = productLists.filter(item => item.orderStatus == 0);
        setProductList(data);
    }

    const handleOngoingButton = () => {
        setShipButtonActive(false);
        setOnGoingButtonActive(true);
        setCompletedButtonActive(false);
        var data = productLists.filter(item => item.orderStatus == 1);
        setProductList(data);
    }

    const handleCompletedButton = () => {
        setShipButtonActive(false);
        setOnGoingButtonActive(false);
        setCompletedButtonActive(true);
        var data = productLists.filter(item => item.orderStatus == 2);
        setProductList(data);
    }

    const renderProductItem = (data, index) => {
        let product = data.item;
        return (
            <ListItem
                key={product._id}
            // last={payMethod.length === index + 1}
            >
                {/* <TouchableOpacity
                        onPress={() => { }}
                    > */}
                <View style={{ flexDirection: 'row', }}>
                    <View>
                        <Image
                            source={{ uri: settings.IMAGE_URLS + product.images[0] }}
                            style={{
                                height: 85, width: 80, resizeMode: 'cover', borderRadius: 4, marginBottom: 8,
                            }}
                        />
                    </View>
                    <View style={{ marginLeft: 10 }}>
                        <Text style={styles.OrderText} >Order #{product.orderId}</Text>
                        <View style={{ width: '85%', flexWrap: 'wrap', flexDirection: 'row' }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.gray_100, }} numberOfLines={2}>
                                {product.title}
                            </Text>
                        </View>
                        {shipButtonActive ?
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.subText}>Pickup date</Text>
                                <Text style={styles.subDate}>{Moment(product.date).format('MMM Do')}</Text>
                            </View>
                            : onGoingButtonActive ?
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={styles.subText}>To be delivered on</Text>
                                    <Text style={styles.subDate}>{Moment(product.date).format('MMM Do')}</Text>
                                </View>
                                :
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={styles.subText}>Delivered on</Text>
                                    <Text style={styles.subDate}>{Moment(product.date).format('MMM Do')}</Text>
                                </View>}
                    </View>
                </View>
                {/* </TouchableOpacity> */}
            </ListItem>
        );
    }

    return (
        <>
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.whiteText }}>
                <Statusbar />
                <Header
                    androidStatusBarColor={colors.statusBar}
                    style={{ backgroundColor: colors.statusBar, marginTop: customPaperTheme.headerMarginVertical }}
                >
                    <RNPButton
                        transparent
                        uppercase={false}
                        style={{ width: '100%', alignItems: 'flex-start' }}
                        onPress={() => {
                            props.navigation.goBack();
                        }}>
                        <Icon style={{ color: '#ffffff', fontSize: 20 }} name="arrow-left" />
                        <Text style={{ color: colors.whiteText, fontSize: 20 }}>My Orders</Text>
                    </RNPButton>
                </Header>
                <Content style={styles.content}>
                    {/* Performance Section */}
                    <View style={{ backgroundColor: '#ffffff' }}>
                        <View>
                            <View style={{ flexDirection: 'row', paddingHorizontal: 10, justifyContent: 'space-between' }}>
                                <View>
                                    <RNPButton mode='text'
                                        uppercase={false}
                                        onPress={() => { handleShipButton() }}
                                        style={shipButtonActive ? styles.activeButton : ''}
                                    >
                                        <Text style={shipButtonActive ? styles.activeText : ''}>To Ship</Text>
                                    </RNPButton>
                                </View>
                                <View>
                                    <RNPButton
                                        mode='text'
                                        uppercase={false}
                                        onPress={() => { handleOngoingButton() }}
                                        style={onGoingButtonActive ? styles.activeButton : ''}
                                    >
                                        <Text style={onGoingButtonActive ? styles.activeText : ''}>Ongoing</Text>
                                    </RNPButton>
                                </View>
                                <View>
                                    <RNPButton
                                        mode='text'
                                        uppercase={false}
                                        onPress={() => { handleCompletedButton() }}
                                        style={completedButtonActive ? styles.activeButton : ''}
                                    >
                                        <Text style={completedButtonActive ? styles.activeText : ''}>Completed</Text>
                                    </RNPButton>
                                </View>
                            </View>
                            <View
                                style={{
                                    borderBottomColor: '#EEEDED',
                                    borderBottomWidth: 1,
                                    marginBottom: 10,
                                }}
                            />
                            <View>
                                <FlatList
                                    data={productList}
                                    renderItem={(item, index) => renderProductItem(item, index)}
                                    _keyExtractor={(item, index) => {
                                        return item.id
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                </Content>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.whiteText,
        flex: 1,
    },
    content: {
        backgroundColor: '#EEEDED',
        //marginHorizontal: 15
    },
    activeButton: {
        borderBottomWidth: 1,
        borderColor: '#3DA9FC',
    },
    activeText: {
        color: '#3DA9FC',
    },
    OrderText: {
        marginRight: 'auto',
        fontSize: 14,
        color: colors.gray_300,
    },
    subText: {
        //marginRight: 'auto',
        fontSize: 14,
        color: colors.gray_300,
    },
    subDate: {
        //marginRight: 'auto',
        marginLeft: 5,
        fontSize: 14,
        color: '#3DA9FC',
    }
});
export default MyOrders;
