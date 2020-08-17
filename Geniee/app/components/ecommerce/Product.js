/**
 * This is the Product component
 **/

// React native and others libraries imports
import React, {PureComponent} from 'react';
import {Image, TouchableOpacity,ToastAndroid} from 'react-native';
import {View, Col, Card, CardItem, Body, Button, Text, Grid,Icon} from 'native-base';
import settings  from "../../config/settings";
import { customStyle,colors } from '../../config/styles';
import FIcon from 'react-native-vector-icons/Feather';
import {Divider} from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import {goToRoute} from "../../Navigation";
import Meteor from "../../react-native-meteor";
//
// import Text from './Text';

export default class Product extends PureComponent {
    constructor(props){
        super(props);
        this.state={
            liked:false,
        }
      this.wishList=[];
    };

   async componentDidMount(){
       let wishList = await AsyncStorage.getItem('myWhishList');
       if (wishList) {
           this.wishList = JSON.parse(wishList);
       }
       else {
           this.wishList = [];
       }
       this.setState({liked:this.wishList.includes(this.props.product._id)})
    }

    addToCart=async() =>{
        var product = this.state.product;
        product['color'] = this.state.selectedColor ? this.state.selectedColor : this.state.product.colors[0];
        product['size'] = this.state.selectedSize ? this.state.selectedSize : this.state.product.sizes[0];
        product['orderQuantity'] = this.state.quantity;
        // product['finalPrice'] = Math.round(this.state.product.price - (this.state.product.price * (this.state.product.discount / 100)));
        let cartList = await AsyncStorage.getItem('myCart');
        let cartItem={
            id:product._id,
            orderQuantity:product.orderQuantity,
            color:product.color,
            size:product.size
        }
        if (cartList) {
            cartList = JSON.parse(cartList);
        }
        else {
            cartList = [];
        }
        let index = cartList.findIndex(item => {
            return item.id == product._id
        });
        if (index > -1) {
            cartList.splice(index, 1);
            cartList.push(cartItem);
        }
        else {
            cartList.push(cartItem);
        }
        ToastAndroid.showWithGravityAndOffset(
            'Product added to your cart !',
            ToastAndroid.LONG,
            ToastAndroid.TOP,
            0,
            50,
        );
        AsyncStorage.setItem('myCart', JSON.stringify(cartList));
    }

     addToWishlist(productId) {
        // var productId = this.state.product._id;
        const liked = this.state.liked;
         this.setState({liked: !liked});
        let index=this.wishList.findIndex(item=>{return item==productId});
        if(index>-1)
            this.wishList.splice(index,1);
        else
            this.wishList.push(productId);

        AsyncStorage.setItem('myWhishList', JSON.stringify(this.wishList));
        ToastAndroid.showWithGravityAndOffset(
            liked ? 'Product removed from  Wishlist !' : 'Product added to  Wishlist !',
            ToastAndroid.LONG,
            ToastAndroid.TOP,
            0,
            50,
        );
    };
    
    _getChatChannel = (userId) => {
        var channelId = new Promise(function (resolve, reject) {
            Meteor.call('addChatChannel', userId, function (error, result) {
                if (error) {
                    reject(error);
                } else {
                    // Now I can access `result` and make an assign `result` to variable `resultData`
                    resolve(result);
                }
            });
        });
        return channelId;
    }

    handleChat = (Service) => {
        console.log('service' + Service._id);
        this._getChatChannel(Service._id).then(channelId => {
            // console.log(channelId);
            let Channel = {
                channelId: channelId,
                user: {
                    userId: Service.createdBy,
                    name: "",
                    profileImage: null,
                },
                service: Service
            };
            goToRoute(this.props.componentId,"Message",{Channel});
        }).catch(error => {
            console.error(error);
        });
    }

    render() {
        const {product, isRight,bottomTab,componentId} = this.props;
        // console.log(product)
        return (
            <View style={[customStyle.Card, style.card]}>
                <TouchableOpacity onPress={() => goToRoute(this.props.componentId,"ProductDetail", {'Id': product._id,data:product})}>
                <Image source={{uri: settings.IMAGE_URL + product.images[0]}} style={style.thumbnail}/>
                <View style={style.cardDetails}>
                    <Text style={style.productTitle}
                        numberOfLines={1}>{product.title}</Text>
                    <Text style={style.price}>Rs. {product.price} <Text note style={{fontSize:12,fontWeight:'200', color:colors.success}}>{(product.discount && product.discount>0)? "("+product.discount + "% off)":""}</Text></Text>
                    {product.Service?
                    <Text numberOfLines={1} note>{product.Service.title}</Text>:null}

                </View>
                </TouchableOpacity>
                {bottomTab && product.serviceOwner!=Meteor.userId()?
                    <>
                        <Divider style={{width:'90%',alignSelf:'center'}} />
                        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-around',padding:5}}>
                            {this.state.liked?
                            <Icon onPress={()=>this.addToWishlist(product._id)} name={'heart'}  style={{fontSize:20, color:colors.appLayout}}/>:
                                <FIcon onPress={()=>this.addToWishlist(product._id)}   name={'heart'}  style={{fontSize:18, color:colors.appLayout}}/>}
                            {/*<FIcon name={'shopping-cart'}  style={{fontSize:18, color:colors.appLayout}}/>*/}
                            {Meteor.userId() && Meteor.userId()!=product.serviceOwner?
                            <FIcon onPress={()=>this.handleChat(product.Service)} name={'message-square'} style={{fontSize:18, color:colors.appLayout}}/>:null}
                        </View>
                    </>
                    :null}
            </View>
        );
    }
}

const style = {
    thumbnail: {
        flex: 1, width: undefined, height: 150, resizeMode: 'cover'
    },
    productTitle: {
        color:colors.primary,
        fontSize: 16,
        marginBottom: 5
    },
    price: {
        color:colors.primary,
        fontSize: 15,
        fontWeight: '100',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 0,
        overflow: 'hidden',
    },
    cardDetails: {
        padding: 10
    }
}