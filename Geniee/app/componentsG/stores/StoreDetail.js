import React, { Component, useEffect, useState } from 'react';
import Meteor from '../../react-native-meteor';
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
import { colors, customStyle, variables } from '../../config/styles';
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
import settings from '../../config/settings';
import { Button as RNPButton, TextInput } from 'react-native-paper';
import Moment from 'moment';
import EIcon from 'react-native-vector-icons/EvilIcons';

const popularProducts = [
    {
        "_id": "GtM8GuzubeooJZYng",
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
        "city": "kathmandu"
    },
    {
        "_id": "GtM8GuzubeooJZYng",
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
        "city": "kathmandu"
    },
    {
        "_id": "GtM8GuzubeooJZYng",
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
        "city": "kathmandu"
    },
    {
        "_id": "GtM8GuzubeooJZYng",
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
        "city": "kathmandu"
    }
]
const StoreDetail = (props) => {

    const [loggedUser, setLoggedUser] = useState(Meteor.user());
    const [searchText, setSearchText] = useState('');

    const businessId = props.route.params.id;

    const _handleSearchText = () => {
        console.log('Testedt')
    }

    const _handleProductPress = (product) => {
        props.navigation.navigate('ProductDetail', { Id: product._id });
    }

    const _renderProducts = (data, index) => {
        let item = data.item;
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
                            style={{
                                flex: 1, width: undefined, height: 160, width: 104, resizeMode: 'cover', borderRadius: 4, marginBottom: 8,
                            }}
                        />
                    </View>
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
        <>
            <StatusBar backgroundColor={colors.statusBar} />
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.whiteText }}>
                <View
                    style={{
                        backgroundColor: colors.appLayout,
                        height: 80,
                    }}>
                    <Header
                        androidStatusBarColor={colors.statusBar}
                        style={{ backgroundColor: '#4d94ff' }}
                    >
                        <View style={{ flexDirection: 'row' }}>
                            <RNPButton
                                transparent
                                uppercase={false}
                                style={{ alignItems: 'flex-start' }}
                                onPress={() => {
                                    props.navigation.goBack();
                                }}>
                                <Icon style={{ color: '#ffffff', fontSize: 20 }} name="arrow-left" />
                            </RNPButton>
                            <TextInput
                                mode="outlined"
                                //color={customGalioTheme.COLORS.INPUT_TEXT}
                                label="Search in here"
                                placeholder="Search in here"
                                placeholderTextColor="#808080"
                                value={searchText}
                                onChangeText={(value) => { _handleSearchText(value) }}
                                style={{ height: 40, width: '80%', paddingRight: 20 }}
                                theme={{ roundness: 6 }}
                            />
                        </View>
                    </Header>
                </View>
                {/*{loading ? <ActivityIndicator style={{flex: 1}}/> : null}*/}

                <Content
                    //onScroll={_onScroll}
                    style={{
                        width: '100%',
                        flex: 1,
                        paddingTop: 8,
                        paddingHorizontal:10
                    }}>
                    <View>
                        {/* STORE*/}
                        <View style={{ flexDirection: 'row' }}>
                            <Image
                                source={{ uri: settings.IMAGE_URLS + popularProducts[0].images[0] }}
                                style={{
                                    height: 100, width: 100, resizeMode: 'cover', borderRadius: 4,
                                }}
                            />
                            <View style={{ marginLeft: 10 }}>
                                <Text style={{ marginTop: 15, fontWeight: 'bold', color: colors.gray_100 }}>{popularProducts[0].businessName}</Text>
                                <Text style={{ fontWeight: 'bold', color: colors.gray_100 }}>({popularProducts[0].city})</Text>
                                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                    <EIcon name='location' style={{ fontSize: 20 }}></EIcon>
                                    <Text style={{ fontSize: 12 }}>{popularProducts[0].city}</Text>
                                </View>
                            </View>
                            <View style={{marginLeft:'auto',marginTop:15,paddingRight:10}}>
                                <Icon name='message-square' style={{ fontSize: 30 }} onPress={() => props.navigation.navigate('Chat')}></Icon>
                                <Text>Chat</Text>
                            </View>
                        </View>

                        <View style={styles.block}>
                            <FlatList
                                contentContainerStyle={{
                                    paddingBottom: 15,
                                    marginHorizontal: 8,
                                    marginTop: 15
                                }}
                                data={popularProducts}
                                //horizontal={true}
                                keyExtractor={(item, index) => item._id}
                                showsHorizontalScrollIndicator={false}
                                numColumns={3}
                                renderItem={(item, index) => _renderProducts(item, index)}
                            />
                        </View>
                    </View>

                </Content>
                {/* <FooterTabs route={'Home'} componentId={props.componentId}/> */}
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        // flexDirection: 'column',
        // flexWrap: 'wrap',
    },
    containerStyle: {
        paddingLeft: 5,
        paddingVertical: 5,
        //backgroundColor: 'white',
        borderWidth: 0,
        // marginVertical: 4,
        borderColor: '#808080',
        //elevation: 5,
        //width: (viewportWidth-60)/3,
        width: 100,
        margin: 5,
        height: 100,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
export default StoreDetail;
