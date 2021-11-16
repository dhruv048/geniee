import React, { useEffect } from "react";
import {
    View,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Text,
    StyleSheet,
    Keyboard,
    FlatList,
    Image
} from "react-native";
import { Container, Content, Header, ListItem, Body } from "native-base";
import { Button as RNPButton } from "react-native-paper";
import Icon from 'react-native-vector-icons/Feather';
import { colors, customStyle } from '../../../config/styles';
import { Avatar } from "react-native-elements";
import settings from "../../../config/settings";

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

const Inventory = (props) => {

    useEffect(() => {

    })

    const renderItem = (data, index) => {
        let product = data.item;
        return (
            <ListItem
                key={product._id}
                // last={payMethod.length === index + 1}
                style={{ width: '100%' }}
            >
                {/* <TouchableOpacity
                        onPress={() => { }}
                    > */}
                <View style={{ flexDirection: 'row' }}>
                    <Image
                        source={{ uri: settings.IMAGE_URLS + product.images[0] }}
                        style={{
                            width: undefined, height: 85, width: 80, resizeMode: 'cover', borderRadius: 4, marginBottom: 8,
                        }}
                    />
                    <View style={{ marginLeft: 15, marginVertical: 10 }}>

                            <Text style={{  fontSize: 16, fontWeight: 'bold', color: colors.gray_300 }} numberOfLines={2}> {product.title}
                            </Text>
                        
                        
                        <View style={{ flexDirection: 'row' }}>
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
                        {product.instock ? <Text style={{ color: 'green' }}>In Stock</Text> :
                            <Text style={{ color: 'red' }}>Out of Stock</Text>}
                    </View>
                </View>
                {/* </TouchableOpacity> */}
            </ListItem>
        );
    }

    return (
        <Container style={styles.container}>
            <Content style={{ padding: Platform.OS === 'ios' ? 20 : 0 }}>
                <TouchableWithoutFeedback
                    onPress={Keyboard.dismiss}
                    accessible={false}>
                    <View>
                        <Header
                            androidStatusBarColor={colors.statusBar}
                            style={{ backgroundColor: '#4d94ff' }}>
                            <RNPButton
                                transparent
                                uppercase={false}
                                style={{ width: '100%', alignItems: 'flex-start' }}
                                onPress={() => {
                                    props.navigation.goBack();
                                }}>
                                <Icon style={{ color: '#ffffff', fontSize: 20 }} name="arrow-left" />
                                <Text style={{ color: colors.whiteText, fontSize: 20 }}>Inventory Preview</Text>
                            </RNPButton>
                        </Header>
                        <View style={styles.content}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Your Listed Product</Text>
                            <View>
                                <FlatList
                                    data={productList}
                                    renderItem={(item, index) => renderItem(item, index)}
                                    _keyExtractor={(item, index) => {
                                        return item.id
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Content>
        </Container>
    )
}
export default Inventory;

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.whiteText,
        flex: 1,
    },
    content: {
        backgroundColor: colors.appBackground,
        flex: 1,
        marginHorizontal: 15,
        marginVertical: 15
    },
})