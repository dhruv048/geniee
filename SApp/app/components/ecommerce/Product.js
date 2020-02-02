/**
 * This is the Product component
 **/

// React native and others libraries imports
import React, {Component} from 'react';
import {Image, TouchableOpacity} from 'react-native';
import {View, Col, Card, CardItem, Body, Button, Text, Grid} from 'native-base';
import settings from "../../config/settings";
import { customStyle } from '../../config/styles';

//
// import Text from './Text';

export default class Product extends Component {
    render() {
        const {product, isRight} = this.props;
        return (
            <View style={[customStyle.Card, style.card]}>
                <Image source={{uri: settings.IMAGE_URL + product.images[0]}} style={style.thumbnail}/>
                <View style={style.cardDetails}>
                    <Text style={style.productTitle}
                        numberOfLines={2}>{product.title}</Text>
                    <Text style={style.price}>Rs. {product.price}</Text>
                </View>
            </View>
        );
    }

}

const style = {
    thumbnail: {
        flex: 1, width: undefined, height: 150, resizeMode: 'cover'
    },
    productTitle: {
        fontSize: 15,
        marginBottom: 5
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 0,
        overflow: 'hidden',
    },
    cardDetails: {
        padding: 15
    }
}