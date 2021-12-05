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

const productList = [
    {
        "_id": "4755jPwTynSgwZgzQ",
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
        "instock": true
    },
    {
        "_id": "mXuQTExhKZcSw8J7Q",
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
        "instock": false
    },
    {
        "_id": "4755jPwTynSgwZgzQ",
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
        "instock": true
    },
    {
        "_id": "mXuQTExhKZcSw8J7Q",
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
        "instock": true
    },
    {
        "_id": "mXuQTExhKZcSw8J7Q",
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
        "instock": true
    }
]

const stores = [
    {
        "_id": "55430308-5ab2-454d-82fd-2567ac0450c3",
        "isApproved": true,
        "businessName": "Omkar Iphone Store",
        "selectedCategory": "20211004051531",
        "city": "Butwal",
        "district": "Butwal",
        "nearestLandmark": "Milanchowk",
        "image": "1635072638975.png",
        "businessImage": "1635072638977.jpeg",
        "registrationImage": "1635072638978.png",
        "panNumber": "121212",
        "PANImage": "1635072638978.png",
        "contact": "9843580327",
        "email": "peace.shrizaa@gmail.com",
        "location": "P8HM+PX Kathmandu, Nepal",
        "coverImage": "1635072638978.png",
    },
    {
        "_id": "55430308-5ab2-454d-82fd-2567ac0450c3",
        "isApproved": false,
        "businessName": "Narayan Dai ko Kirana Pasal",
        "selectedCategory": "20211004051531",
        "city": "Kathmandu",
        "district": "Kathmandu",
        "nearestLandmark": "balkot",
        "image": "1635072638975.png",
        "businessImage": "1635072638977.jpeg",
        "registrationImage": "1635072638978.png",
        "panNumber": "121212",
        "PANImage": "1635072638978.png",
        "contact": "9843580327",
        "email": "peace.shrizaa@gmail.com",
        "location": "P8HM+PX Kathmandu, Nepal",
        "coverImage": "1635072638978.png",
    },
    {
        "_id": "55430308-5ab2-454d-82fd-2567ac0450c3",
        "isApproved": true,
        "businessName": "Riddhi Siddhi Electronis Gadgets",
        "selectedCategory": "20211004051531",
        "city": "Kathmandu",
        "district": "Kathmandu",
        "nearestLandmark": "balkot",
        "image": "1635072638975.png",
        "businessImage": "1635072638977.jpeg",
        "registrationImage": "1635072638978.png",
        "panNumber": "121212",
        "PANImage": "1635072638978.png",
        "contact": "9843580327",
        "email": "peace.shrizaa@gmail.com",
        "location": "P8HM+PX Kathmandu, Nepal",
        "coverImage": "1635072638978.png",
    },
    {
        "_id": "55430308-5ab2-454d-82fd-2567ac0450c3",
        "isApproved": false,
        "businessName": "Met Life Insurance Pvt Ltd",
        "selectedCategory": "20211004051531",
        "city": "Kathmandu",
        "district": "Kathmandu",
        "nearestLandmark": "balkot",
        "image": "1635072638975.png",
        "businessImage": "1635072638977.jpeg",
        "registrationImage": "1635072638978.png",
        "panNumber": "121212",
        "PANImage": "1635072638978.png",
        "contact": "9843580327",
        "email": "peace.shrizaa@gmail.com",
        "location": "P8HM+PX Kathmandu, Nepal",
        "coverImage": "1635072638978.png",
    },
]

const MerchantDashboard = (props) => {

    const [sellersRank, setSellersRank] = useState(123);
    const [productSold, setProductSold] = useState(56);
    const [revenue, setRevenue] = useState(2340);
    const [weekButtonActive, setWeekButtonActive] = useState(true);
    const [monthButtonActive, setMonthButtonActive] = useState(false);
    const [yearlyButtonActive, setYearlyButtonActive] = useState(false);
    const [responseTime, setResponseTime] = useState(25);
    const [orderCompletion, setOrderCompletion] = useState(75);
    const [deliveryTime, setDeliveryTime] = useState(12);
    const [customerRating, setCusotmerRating] = useState(0);
    const [increasedRank, setIncreasedRank] = useState(2);

    const handleWeekButton = () => {
        setWeekButtonActive(true);
        setMonthButtonActive(false);
        setYearlyButtonActive(false);
    }

    const handleMonthlyButton = () => {
        setWeekButtonActive(false);
        setMonthButtonActive(true);
        setYearlyButtonActive(false);
    }

    const handleYearlyButton = () => {
        setWeekButtonActive(false);
        setMonthButtonActive(false);
        setYearlyButtonActive(true);
    }

    const _handleProductPress = (item) => {
        props.navigation.navigate('StoreDetail', { id: item._id });
    }
    { Moment(new Date()).format('MMM Do YYYY') } { ' ' }

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
                    <View style={{ marginLeft: 10, marginVertical: 10, }}>

                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.gray_300, width: '90%' }} numberOfLines={2}>
                            {product.title}
                        </Text>
                        <View style={{ flexDirection: 'row', marginLeft: 15 }}>
                            <Text
                                style={{
                                    color: colors.primary,
                                    fontWeight: '700',
                                    fontSize: 12,
                                    marginRight: 10
                                }}>
                                Rs. {product.price - (product.price * product.discount) / 100}
                            </Text>
                            <Text style={{ color: colors.body_color, fontWeight: '400', fontSize: 12, textDecorationLine: 'line-through', textDecorationStyle: 'solid' }}>
                                Rs. {product.price}
                            </Text>
                        </View>
                    </View>
                </View>
                {/* </TouchableOpacity> */}
            </ListItem>
        );
    }

    const _renderStore = (data, index) => {
        let item = data.item;
        return (
            <View
                key={item._id}
                // onPress={() => _handleProductPress(item)}
                style={[
                    customStyle.productContainerStyle,
                    { borderTopLeftRadius: 4, borderTopRightRadius: 5 },
                ]}>
                <View
                    key={item._id}
                    style={[customStyle.Card, { top: 0, left: 0, rigth: 0 }]}>
                    <View style={{ width: '100%', borderRadius: 5 }}>
                        <Image
                            source={{ uri: settings.IMAGE_URLS + item.image }}
                            style={{
                                flex: 1, width: undefined, height: 70, width: 100, resizeMode: 'cover', borderRadius: 4, marginBottom: 8,
                            }}
                        />
                    </View>
                    {item.isApproved ? <View style={{ flexDirection: 'row', position: 'absolute', top: 55, left: 6 }}>
                        <AIcon name='checkcircle' size={10} style={{ marginRight: 3, color: colors.statusBar }} />
                        <Text style={{ fontSize: 10 }}>Verified</Text>
                    </View> : null}
                    <View>
                        <View>
                            <Text numberOfLines={1} style={{ fontSize: 10 }}>{item.city}</Text>
                            <Text numberOfLines={2} style={{ fontSize: 12, fontWeight: 'bold', color: colors.gray_100 }}>
                                {item.businessName}
                            </Text>
                            <View style={{ marginTop: 5, marginRight: 5 }}>
                                <RNPButton
                                    mode='text'
                                    uppercase={false}
                                    onPress={() => { _handleProductPress(item) }}
                                >
                                    <Text style={{ fontSize: 10 }}>Visit</Text>
                                    <Icon name='chevron-right' style={{ marginLeft: 10, marginTop: 10 }} />
                                </RNPButton>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <>
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.whiteText }}>
                <Container>

                    <View
                        style={{
                            backgroundColor: colors.appLayout,
                            height: 60,
                        }}>
                        <Header
                            androidStatusBarColor={colors.statusBar}
                            style={{ backgroundColor: '#4d94ff' }}>
                            <RNPButton
                                transparent
                                uppercase={false}
                                style={{ width: '100%', alignItems: 'flex-start' }}
                                onPress={() => {
                                    props.navigation.navigate('Home');
                                }}>
                                <Icon style={{ color: '#ffffff', fontSize: 20 }} name="arrow-left" />
                                <Text style={{ color: colors.whiteText, fontSize: 20 }}>Your Dashboard</Text>
                            </RNPButton>
                        </Header>
                    </View>
                    <Content style={styles.content}>
                        {/* Performance Section */}
                        <View style={{ backgroundColor: '#ffffff' }}>
                            <View style={{ marginHorizontal: 15 }}>
                                <View style={{ flexDirection: 'row', paddingHorizontal: 10, justifyContent: 'space-between' }}>
                                    <View>
                                        <RNPButton mode='text'
                                            uppercase={false}
                                            onPress={() => { handleWeekButton() }}
                                            style={weekButtonActive ? styles.activeButton : ''}
                                        >
                                            <Text style={weekButtonActive ? styles.activeText : ''}>This Week</Text>
                                        </RNPButton>
                                    </View>
                                    <View>
                                        <RNPButton
                                            mode='text'
                                            uppercase={false}
                                            onPress={() => { handleMonthlyButton() }}
                                            style={monthButtonActive ? styles.activeButton : ''}
                                        >
                                            <Text style={monthButtonActive ? styles.activeText : ''}>{Moment(new Date()).format('MMM')}</Text>
                                        </RNPButton>
                                    </View>
                                    <View>
                                        <RNPButton
                                            mode='text'
                                            uppercase={false}
                                            onPress={() => { handleYearlyButton() }}
                                            style={yearlyButtonActive ? styles.activeButton : ''}
                                        >
                                            <Text style={yearlyButtonActive ? styles.activeText : ''}>{Moment(new Date()).format('yyyy')}</Text>
                                        </RNPButton>
                                    </View>
                                </View>
                                <View
                                    style={{
                                        borderBottomColor: '#EEEDED',
                                        borderBottomWidth: 1,
                                        marginBottom:10,
                                    }}
                                />
                                <View>
                                    <Text style={{ fontWeight: 'bold', color: colors.gray_100 }}>Here's your performance</Text>
                                    <View style={{ flexDirection: 'row', paddingTop: 5 }}>
                                        <Text>Seller's Rank</Text>
                                        <Icon name='chevrons-up' style={{ marginLeft: 'auto', fontSize: 16, color: '#00B35E' }}>
                                            <Text style={{ fontSize: 16, color: '#00B35E' }}>{increasedRank}</Text>
                                        </Icon>
                                        <Text style={{ fontWeight: 'bold', color: colors.gray_100, marginLeft: 8 }}>{sellersRank}th</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', paddingTop: 5 }}>
                                        <Text>Product Sold</Text>
                                        <Text style={{ marginLeft: 'auto', fontWeight: 'bold', color: colors.gray_100 }}>{productSold}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', paddingTop: 5 }}>
                                        <Text>Revenue 2021</Text>
                                        <Text style={{ marginLeft: 'auto', fontWeight: 'bold', color: '#3DA9FC' }}>Rs.{revenue}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginVertical: 20, justifyContent: 'space-between' }}>
                                        <View>
                                            <ProgressCircle
                                                percent={responseTime}
                                                radius={40}
                                                borderWidth={6}
                                                color={responseTime > 74 ? '#00B35E' : responseTime > 24 ? '#FFC940' : '#FF3131'}
                                                shadowColor="#999"
                                                bgColor="#fff"
                                            >
                                                {responseTime > 0 ? <Text style={{ fontSize: 18, color: responseTime > 74 ? '#00B35E' : responseTime > 24 ? '#FFC940' : '#FF3131' }}>{responseTime}%</Text> : <Text>N/A</Text>}
                                            </ProgressCircle>
                                            <View style={{ flexGrow: 1, flexDirection: 'row' }}>
                                                <Text style={{ flex: 1, width: 1, fontSize: 14 }}>Response Time</Text>
                                            </View>
                                        </View>
                                        <View>
                                            <ProgressCircle
                                                percent={orderCompletion}
                                                radius={40}
                                                borderWidth={6}
                                                color={orderCompletion > 74 ? '#00B35E' : orderCompletion > 24 ? '#FFC940' : '#FF3131'}
                                                shadowColor="#999"
                                                bgColor="#fff"
                                            >
                                                {orderCompletion > 0 ? <Text style={{ fontSize: 18, color: orderCompletion > 74 ? '#00B35E' : orderCompletion > 24 ? '#FFC940' : '#FF3131' }}>{orderCompletion}%</Text> : <Text>N/A</Text>}
                                            </ProgressCircle>
                                            <View style={{ flexGrow: 1, flexDirection: 'row' }}>
                                                <Text style={{ flex: 1, width: 1, fontSize: 14 }}>Order Completion</Text>
                                            </View>
                                        </View>
                                        <View>
                                            <ProgressCircle
                                                percent={deliveryTime}
                                                radius={40}
                                                borderWidth={6}
                                                color={deliveryTime > 74 ? '#00B35E' : deliveryTime > 24 ? '#FFC940' : '#FF3131'}
                                                shadowColor="#999"
                                                bgColor="#fff"
                                            >
                                                {deliveryTime > 0 ? <Text style={{ fontSize: 18, color: deliveryTime > 74 ? '#00B35E' : deliveryTime > 24 ? '#FFC940' : '#FF3131' }}>{deliveryTime}%</Text> : <Text>N/A</Text>}
                                            </ProgressCircle>
                                            <View style={{ flexGrow: 1, flexDirection: 'row' }}>
                                                <Text style={{ flex: 1, width: 1, fontSize: 14 }}>Delivery Time</Text>
                                            </View>
                                        </View>
                                        <View>
                                            <ProgressCircle
                                                percent={customerRating}
                                                radius={40}
                                                borderWidth={6}
                                                color={customerRating > 74 ? '#00B35E' : customerRating > 24 ? '#FFC940' : '#FF3131'}
                                                shadowColor="#999"
                                                bgColor="#fff"
                                            >
                                                {customerRating > 0 ? <Text style={{ fontSize: 18, color: customerRating > 74 ? '#00B35E' : customerRating > 24 ? '#FFC940' : '#FF3131' }}>{customerRating}%</Text> : <Text>N/A</Text>}
                                            </ProgressCircle>
                                            <View style={{ flexGrow: 1, flexDirection: 'row' }}>
                                                <Text style={{ flex: 1, width: 1, fontSize: 14 }}>Customer Rating</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                        {/* Sales Overview  Section*/}
                        <View style={{ marginTop: 20, backgroundColor: '#ffffff' }}>
                            <View style={{ marginHorizontal: 15, paddingVertical: 15 }}>
                                <Text style={{ fontWeight: 'bold', color: colors.gray_100 }}>Sales Overview</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                                    <View>
                                        <Text style={{ fontSize: 14 }}>Sep Revenue</Text>
                                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#00B35E' }}>Rs.12435</Text>
                                    </View>
                                    <View>
                                        <Text style={{ fontSize: 14 }}>2021 Revenue</Text>
                                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.gray_100 }}>Rs.12435</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                                    <View>
                                        <Text style={{ fontSize: 14 }}>Total Revenue</Text>
                                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.gray_100 }}>Rs.12435</Text>
                                    </View>
                                    <View>
                                        <Text style={{ fontSize: 14 }}>Avg Yearly Selling</Text>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Icon name='chevrons-up' style={{ marginLeft: 'auto', fontSize: 14, color: '#00B35E' }}>
                                                <Text style={{ fontSize: 14, color: '#00B35E' }}>12%</Text>
                                            </Icon>
                                            <Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.gray_100, marginLeft: 8 }}>Rs.12435</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                        {/* Order Overview Section */}
                        <View style={{ marginTop: 20, backgroundColor: '#ffffff' }}>
                            <View style={{ marginHorizontal: 15, paddingVertical: 15 }}>
                                <Text style={{ fontWeight: 'bold', color: colors.gray_100 }}>Orders</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                                    <View>
                                        <Text style={{ fontSize: 14 }}>Delivered Orders</Text>
                                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#00B35E' }}>Rs.12435</Text>
                                    </View>
                                    <View>
                                        <Text style={{ fontSize: 14 }}>Shipped Orders</Text>
                                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#3DA9FC' }}>Rs.12435</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                                    <View>
                                        <Text style={{ fontSize: 14 }}>Pending Orders</Text>
                                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#FFC940' }}>Rs.12435</Text>
                                    </View>
                                    <View>
                                        <Text style={{ fontSize: 14 }}>Cancelled Orders</Text>
                                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#FF3131', marginLeft: 8 }}>Rs.12435</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        {/* Inventory Section */}
                        <View style={{ marginTop: 20, backgroundColor: '#ffffff' }}>
                            <View style={{ marginHorizontal: 15, paddingVertical: 15 }}>
                                <Text style={{ fontWeight: 'bold', color: colors.gray_100 }}>Inventory</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                                    <View>
                                        <Text style={{ fontSize: 14 }}>Total Items</Text>
                                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#00B35E' }}>Rs.12435</Text>
                                    </View>
                                    <View>
                                        <Text style={{ fontSize: 14 }}>Out of Stock</Text>
                                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#FFC940' }}>Rs.12435</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        {/* Listed Product Section */}
                        <View style={{ marginTop: 20, backgroundColor: '#ffffff' }}>
                            <View style={{ marginHorizontal: 15, paddingVertical: 10 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                    <Text style={{ fontWeight: 'bold', color: colors.gray_100, paddingTop: 10 }}>Your Listed Product</Text>
                                    <View>
                                        <RNPButton
                                            mode='text'
                                            uppercase={false}
                                            onPress={() => { }}
                                        >
                                            <Text style={{ fontSize: 14, color: colors.statusBar }}>See all</Text>
                                            <Icon name='arrow-right' />
                                        </RNPButton>
                                    </View>
                                </View>
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
                        {/* Most Selling Product Section */}
                        <View style={{ marginTop: 20, backgroundColor: '#ffffff' }}>
                            <View style={{ marginHorizontal: 15, paddingVertical: 10 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                    <Text style={{ fontWeight: 'bold', color: colors.gray_100, paddingTop: 10 }}>Most Selling Product</Text>
                                    <View>
                                        <RNPButton
                                            mode='text'
                                            uppercase={false}
                                            onPress={() => { }}
                                        >
                                            <Text style={{ fontSize: 14, color: colors.statusBar }}>See all</Text>
                                            <Icon name='arrow-right' />
                                        </RNPButton>
                                    </View>
                                </View>
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
                        {/* Other Merchants Section */}
                        <View style={{ marginTop: 20, backgroundColor: '#ffffff' }}>
                            <View style={{ marginHorizontal: 15, paddingVertical: 10 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                    <Text style={{ fontWeight: 'bold', color: colors.gray_100, paddingTop: 10 }}>Other Merchants</Text>
                                    <View>
                                        <RNPButton
                                            mode='text'
                                            uppercase={false}
                                            onPress={() => { }}
                                        >
                                            <Text style={{ fontSize: 14, color: colors.statusBar }}>See all</Text>
                                            <Icon name='arrow-right' />
                                        </RNPButton>
                                    </View>
                                </View>
                            </View>
                            <View>
                                <FlatList
                                    contentContainerStyle={{
                                        paddingBottom: 15,
                                        marginHorizontal: 8,
                                        marginTop: 15
                                    }}
                                    data={stores}
                                    //horizontal={true}
                                    keyExtractor={(item, index) => item._id}
                                    showsHorizontalScrollIndicator={false}
                                    numColumns={3}
                                    renderItem={(item, index) => _renderStore(item, index)}
                                />
                            </View>
                        </View>
                    </Content>
                </Container>
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
    }
});
export default MerchantDashboard;
