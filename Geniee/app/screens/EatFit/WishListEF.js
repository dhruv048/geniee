import React, {Component} from 'react';
import {Alert, FlatList, StyleSheet, Image, ToastAndroid} from 'react-native';
import {
    Container,
    Content,
    View,
    Button,
    Left,
    Right,
    Body,
    ListItem,
    Thumbnail,
} from 'native-base';

import Icon from "react-native-vector-icons/Feather";
import Text from '../../components/ecommerce/Text';
import Navbar from '../../components/ecommerce/Navbar';
import Meteor from "../../react-native-meteor";
import settings, {ProductOwner} from "../../config/settings";
import AsyncStorage from '@react-native-community/async-storage';
import CartIcon from '../../components/HeaderIcons/CartIcon';
import Product from "../../components/Store/Product";

class WishListEF extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            wishList:null,
            popularProducts: [],
        };
        this.wishList = [];
        this.popularProducts = [];
        this.skip = 0;
        this.limit = 20;
    }
 
     componentDidMount() {
        
        this.getWishListItems();
        this.focusListiner = this.props.navigation.addListener('focus',()=>{
            this.getWishListItems();
        });

        //Get popular products
        Meteor.call('getPopularProducts', this.skip, this.limit, (err, res) => {
            if (err) {
                console.log('this is due to error. ' + err);
            }
            else {
                this.skip = this.skip + this.limit;
                this.setState({ popularProducts: res.result });
            };
        });
        console.log('this is popular Products ' + this.state.popularProducts +'List');
    }

    getWishListItems =async () => {
        let wishList = await AsyncStorage.getItem('myWhishList');
        if (wishList)
            wishList = JSON.parse(wishList);
        else
            wishList = [];
        this.wishList = wishList;
        Meteor.call('WishListItemsEF', this.wishList, (err, res) => {
            console.log(err, res)
            if (err) {
                console.log('this is due to error. ' + err);
            }
            else {
                this.setState({wishList: res.result});
            }
        });
    }

    addToCart = async () => {
        var product = this.state.wishList;
        product['orderQuantity'] = 1;
        let cartList = await AsyncStorage.getItem('myCart');
        let cartItem = {
            id: product._id,
            orderQuantity: product.orderQuantity
        }
        if (cartList) {
            cartList = JSON.parse(cartList);
        }
        else {
            cartList = [];
        }
        let index = cartList.findIndex(item => {
            return item.id == product.id
        });
        if (index > -1) {
            cartList.splice(index, 1);
            cartList.push(cartItem);
        }
        else {
            cartList.push(cartItem);
            ToastAndroid.showWithGravityAndOffset(
                'Product added to your cart !',
                ToastAndroid.LONG,
                ToastAndroid.TOP,
                0,
                50,
            );
        }
        AsyncStorage.setItem('myCart', JSON.stringify(cartList));
    }
    
    renderItem(data, i) {
        let item = data.item;
        return (
            <ListItem
                key={i}
                last={this.state.wishList.length === i + 1}
                //last={this.props.wishList.length === i + 1}
                onPress={() => this.itemClicked(item)}
            >
                <Thumbnail square style={{width: 100, height: 100}}
                           source={{uri: settings.IMAGE_URL + item.images[0]}}/>
                <Body style={{paddingLeft: 16}}>
                <Text style={{fontSize: 16}} numberOfLines={2}>
                    {item.title}
                </Text>
                <Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 5}}>Rs. {item.price}</Text>
                {/* <Text style={{fontSize: 14, fontStyle: 'italic'}}>{item.Category}</Text> */}
                <Text style={{fontSize: 14, marginBottom: 3, color: '#8E8E8E'}}>{item.isVeg ? "Veg" : "Non Veg"}</Text>
                {/*<Text style={{color: '#8E8E8E', fontSize: 13}}>{item.availabeQuantity} pieces available</Text>*/}
                </Body>
                <Right style={{paddingRight: 5,paddingTop:80}}>
                    <View style={{flexDirection:'row'}}>
                    <Button transparent onPress={() => this.addToCart()} style={{marginRight:15}}>
                        <Icon name='shopping-bag' size={24} color={'#8E8E8E'}/>
                    </Button>
                    <Button transparent onPress={() => this.removeItemPressed(item)}>
                        <Icon name='trash' size={24} color={'#8E8E8E'}/>
                    </Button>
                    </View>
                </Right>
            </ListItem>
        );
    }

    itemClicked(item) {
        if (item.productOwner === ProductOwner.EAT_FIT)
        this.props.navigation.navigate('ProductDetailEF', {Id: item._id, data: item});
        else
        this.props.navigation.navigate('ProductDetail', {Id: item._id, data: item})
    }

    removeItemPressed(Item) {
        Alert.alert(
            'Remove ' + Item.title,
            'Are you sure you want to remove this item from your wishlist?',
            [
                {text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel'},
                {
                    text: 'Yes', onPress: () => {

                        var wishList = [...this.state.wishList]; // make a separate copy of the array
                        var allWishList = wishList;
                        var index = wishList.findIndex(item => {
                            return item._id === Item._id
                        });
                        if (index >= 0) {
                            wishList.splice(index, 1);
                            this.setState({wishList: wishList});
                        }
                        let i = this.wishList.findIndex(item => {
                            return item == Item._id
                        });
                        if (i > -1)
                            this.wishList.splice(i, 1);
                        AsyncStorage.setItem('myWhishList', JSON.stringify(this.wishList));
                    }
                },
            ]
        )
    }

    _emptyWhishList() {
        Alert.alert(
            'Remove all items',
            'Are you sure you want to remove all items from WishList?',
            [
                {text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel'},
                {
                    text: 'Yes', onPress: () => {
                        this.wishList = [];
                        this.setState({wishList: []});
                        AsyncStorage.setItem('myWhishList', JSON.stringify([]));
                    }
                },
            ]
        )
    }

    renderProduct = (data, index) => {
        let item = data.item;
        return (
            <Product product={item} navigation={this.props.navigation} onDelete={this.onDelete.bind(this)} />
        )
    }

    onDelete() {
        //Rerender popular Items
    }

    render() {
        var left = (
            <Left style={{flex: 1}}>
                <Button transparent onPress={() => this.props.navigation.goBack()}>
                    <Icon name="arrow-left" size={24} color={'#fff'}/>
                </Button>
            </Left>
        );
        var right = (
            <Right style={{flex: 1}}>
                {/* <Button transparent onPress={this._emptyWhishList.bind(this)}>
                    <Text style={{color: '#fff', textTransform: 'uppercase'}}>Empty</Text>
                </Button> */}
                <CartIcon navigation={this.props.navigation} />
            </Right>
        );
        var title = "Wishlist("+[this.wishList.length]+")";
        return (
            <Container style={styles.container}>
                <Navbar left={left} right={right} title={title}/>
                {this.state.wishList!==null && !this.state.wishList.length > 0 ?
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        {/* <Icon name="heart" size={48} style={{fontSize: 48, color: '#95a5a6', marginBottom: 7}}/> */}
                        <Image height='293' width='229'
                               source={require('../../images/wishlist-empty.png')}/>
                        <Text style={{fontSize: 16, color: '#A3A3A3', marginTop: 40}}>Your wishlist is empty...</Text>
                    </View>
                    :
                    <Content>
                        <FlatList
                            //data={this.props.wishList}
                            data={this.state.wishList}
                            renderItem={(item, index) => this.renderItem(item, index)}
                            _keyExtractor={(item, index) => {
                                return item._id
                            }}
                        />
                         <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 30, marginHorizontal: 10 }}>
                            <Text style={{ marginTop: 5 }}>You may also like</Text>
                            <Button transparent>
                                <Text style={{ color: 'blue' }}> View All</Text>
                            </Button>
                        </View>
                        <View>
                            {/* <Text>This is product FlatList Commented</Text> */}
                            <FlatList contentContainerStyle={{ flex: 1, paddingHorizontal: 5, width: '100%', }}
                                data={this.state.popularProducts}
                                keyExtracter={(item, index) => item._id}
                                numColumns={2}
                                renderItem={(item, index) => this.renderProduct(item, index)}
                                onEndReachedThreshold={0.1}
                            />
                        </View>
                    </Content>
                }
                 {/* <FooterTabs route={'Favourite'} componentId={this.props.componentId}/> */}
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
    },

});

export default WishListEF;
// export default Meteor.withTracker(() => {
//     return {
//         // wishList: Meteor.collection('products').find({_id: {$in: wishList}})
//     }
// })(WishList);