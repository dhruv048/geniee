/**
 * This is the Product component
 **/

// React native and others libraries imports
import React, { Component } from 'react';
import { Image ,TouchableOpacity} from 'react-native';
import { View, Col, Card, CardItem, Body, Button ,Text,Grid} from 'native-base';
import settings from "../../config/settings";

//
// import Text from './Text';

export default class Product extends Component {
    render() {
       const {product,isRight}=this.props;
        return(
                <Card transparent>
                    <CardItem cardBody style={{width:'100%'}}>

                            <Image source={{uri: settings.API_URL + 'images/' + product.images[0]}} style={style.image}/>
                            <View style={style.border} />

                    </CardItem>
                    <CardItem style={{paddingTop: 0}}>
                        <Button style={{flex: 1, paddingLeft: 0, paddingRight: 0, paddingBottom: 0, paddingTop: 0}}
                                transparent
                                onPress={() => {}}
                        >
                            <Body>
                            <Text
                                style={{fontSize: 16}}
                                numberOfLines={1}
                            >{product.title}</Text>
                            <View style={{flex: 1, width: '100%', alignItems: 'center'}}>
                                <View style={style.line} />
                                <Text style={style.price}>Rs. {product.price}</Text>
                                <View style={style.line} />
                            </View>
                            </Body>
                        </Button>
                    </CardItem>
                </Card>
        );
    }

}

const style = {
    button: {flex: 1, height: 150, paddingLeft: 4, paddingRight: 4},
    image: {flex:1, width: undefined, height: 150, resizeMode:'cover'},
    leftMargin: {
        marginLeft: 7,
        marginRight: 0,
        marginBottom: 7
    },
    rightMargin: {
        marginLeft: 0,
        marginRight: 7,
        marginBottom: 7
    },
    border: {
        position: 'absolute',
        top: 10,
        left: 10,
        right: 10,
        bottom: 10,
        borderWidth: 1,
        borderColor: 'rgba(253, 253, 253, 0.2)'
    },
    price: {
        fontSize: 16,
        paddingLeft: 5,
        paddingRight: 5,
        zIndex: 1000,
        backgroundColor: '#fdfdfd'
    },
    line: {
        width: '100%',
        height: 1,
        backgroundColor: '#7f8c8d',
        position: 'absolute',
        top: '52%'
    }
}