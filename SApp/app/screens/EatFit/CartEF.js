import React, {Component} from 'react';
import {Alert, AsyncStorage, FlatList, Image} from 'react-native';
import {
    Container,
    Content,
    View,
    Icon,
    Button,
    Left,
    Right,
    Body,
    Title,
    List,
    ListItem,
    Thumbnail,
    Grid,
    Col,
    Footer
} from 'native-base';

// Our custom files and classes import
import FIcon from "react-native-vector-icons/Feather";
import Text from '../../components/ecommerce/Text';
import Navbar from '../../components/ecommerce/Navbar';
import {colors, customStyle} from "../../config/styles";
import Meteor, {withTracker} from "react-native-meteor";
import settings from "../../config/settings";
import Loading from "../../components/Loading/Loading";

class Cart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cartItems: '',
        };
        this.cartList=[];
    }

    componentWillMount() {

    }

    getCartItems =(products)=>{
        const cartList= this.cartList;
        console.log(products,cartList);
        if (products.length==0) {
            this.setState({cartItems: []});
            return true;
        }
        Meteor.call('WishListItemsEF',products, (err, res) => {
            console.log(err, res);
            if (err) {
                console.log('this is due to error. '+err);
            }
            else{
                res.forEach(product=>{
                    const cartItem=cartList.find(item=>item.id==product._id);
                    console.log(cartItem,product)
                    product.orderQuantity=cartItem.orderQuantity;
                    product.finalPrice=Math.round(product.price - (product.price * (product.discount / 100)));
                });
                this.setState({cartItems: res});
            }
        });
    };
   async componentDidMount(){
        let products=[];
        let cartList = await AsyncStorage.getItem('myCart');
        if (cartList) {
            cartList = JSON.parse(cartList);
            cartList.forEach(item=>{
                products.push(item.id)
                }
            )
        }
        else {
            cartList = [];
        }
       this.cartList=cartList;
       this.getCartItems(products);
    }

    render() {
        var left = (
            <Left style={{flex: 1}}>
                <Button transparent onPress={() => {
                    this.props.navigation.pop()
                }}>
                    <FIcon name="x" size={24} color={'#fff'}/>
                </Button>
            </Left>
        );
        var right = (
            <Right style={{flex: 1}}>
                <Button transparent onPress={() => this.removeAllPressed()}>
                    <Text style={{color: '#fff', textTransform: 'uppercase'}}>Empty</Text>
                </Button>
            </Right>
        );
        return (
            <Container style={{backgroundColor: colors.backgroundColor}}>
                <Navbar left={left} right={right} title="My Cart"/>
                {this.state.cartItems && this.state.cartItems.length <= 0 ?
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                         <Icon name="ios-cart" size={100} style={{fontSize: 100, color: '#95a5a6', marginBottom: 7}}/>
                        <Text style={{fontSize: 16, color: '#A3A3A3', marginTop: 40}}>Your cart is empty</Text>
                    </View>
                    :
                    <Content>
                        {this.state.cartItems ?
                        <FlatList
                            data={this.state.cartItems}
                            renderItem={(item, index) => this.renderItems(item, index)}
                            _keyExtractor={(item, index) => {
                                return item._id
                            }}
                        />:<Loading/>}
                        {/* <View>
                            <Button onPress={() => this.checkout()} style={{backgroundColor: colors.appLayout}}
                                block iconLeft>
                                <Icon name='ios-card'/>
                                <Text style={{color: '#fdfdfd'}}> Checkout</Text>
                            </Button>
                        </View> */}
                        {/* <Grid style={{marginTop: 20, marginBottom: 10}}>
                            <Col style={{paddingLeft: 10, paddingRight: 5}}>
                                <Button onPress={() => this.checkout()} style={{backgroundColor: colors.appLayout}}
                                        block iconLeft>
                                    <Icon name='ios-card'/>
                                    <Text style={{color: '#fdfdfd'}}> Checkout</Text>
                                </Button>
                            </Col>
                            <Col style={{paddingLeft: 5, paddingRight: 10}}>
                                <Button onPress={() => this.removeAllPressed()}
                                        style={{borderWidth: 1, borderColor: colors.appLayout}} block iconRight
                                        transparent>
                                    <Text style={{color: colors.appLayout}}>Emtpy Cart </Text>
                                    <Icon style={{color: colors.appLayout}} name='ios-trash'/>
                                </Button>
                            </Col>
                        </Grid> */}
                    </Content>
                }
                {this.state.cartItems.length > 0 ?
                    <Footer style={customStyle.footer}>
                        <View style={customStyle.row}>
                            <View style={customStyle.col}>
                                <Button onPress={() => this.checkout()} style={customStyle.buttonPrimary}
                                        block iconLeft>
                                    <FIcon name='credit-card' size={18} color={'#fff'} style={{marginRight: 10}}/>
                                    <Text uppercase={false} style={customStyle.buttonPrimaryText}>Checkout</Text>
                                </Button>
                            </View>
                        </View>
                    </Footer> : null}
            </Container>

        );
    }

    renderItems(data, index) {
        let item = data.item;
        return (
            <ListItem
                key={data.item._id}
                last={this.state.cartItems.length === index + 1}
                onPress={() => this.itemClicked(item)}
            >
                <Thumbnail square style={{width: 100, height: 100}}
                           source={{uri: settings.IMAGE_URL + item.images[0]}}/>
                <Body style={{paddingLeft: 16}}>
                    <Text style={{fontSize: 16}} numberOfLines={2}>
                        {/* {item.orderQuantity > 1 ? item.orderQuantity + "x " : null} */}
                        {item.title}
                    </Text>
                    <Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 5}}>Rs. {item.finalPrice} <Text style={{fontWeight: 'normal', fontSize: 13}}>{item.orderQuantity > 1 ? "x " + item.orderQuantity : null}</Text></Text>
                    <Text style={{color: '#8E8E8E', fontSize: 14}}>{item.isVeg?"Veg":"Non-Veg"}</Text>
                    {/*<Text style={{color: '#8E8E8E', fontSize: 13}}>Color: {item.color}</Text>*/}
                    {/*<Text style={{color: '#8E8E8E', fontSize: 13}}>Size: {item.size}</Text>*/}
                </Body>
                <Right style={{paddingRight: 5}}>
                    <Button transparent onPress={() => this.removeItemPressed(data.item)}>
                        <FIcon name='x-circle' size={24} color={'#8E8E8E'} />
                    </Button>
                </Right>
            </ListItem>
        );
    }

    removeItemPressed(Item) {
        Alert.alert(
            'Remove ' + Item.product.productTitle,
            'Are you sure you want to remove this item from your cart?',
            [
                {text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel'},
                {
                    text: 'Yes', onPress: () => {
                        let {cartItems} = this.state;
                        let index= cartItems.findIndex(item=>item._id==Item,_id);
                        if(index>=0){
                            cartItems.splice(index,1);
                            this.setState({cartItems});
                        }
                        let idx=this.cartList.findIndex(item=>item.id==Item._id);
                        if(idx>=0){
                            this.cartList.splice(idx,1);
                            AsyncStorage.setItem('myCart', JSON.stringify(this.cartList));
                        }
                        // Meteor.call('removeCartItem', item._id, (err) => {
                        //     if (err) {
                        //         console.log(err.reason);
                        //     }else{
                        //         this.getCartItems();
                        //     }
                        // })
                    }
                },
            ]
        )
    }


    removeAllPressed() {
        Alert.alert(
            'Empty cart',
            'Are you sure you want to empty your cart?',
            [
                {text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel'},
                {
                    text: 'Yes', onPress: () => {
                        this.cartList=[];
                        this.getCartItems([]);
                        AsyncStorage.setItem('myCart', JSON.stringify([]));
                    }
                }
            ]
        )
    }


    checkout() {
        this.props.navigation.navigate('Checkout');
    }

    itemClicked(item) {
        this.props.navigation.navigate('ProductDetail', {Id: item._id, data: item})
    }

}

export default withTracker(() => {
    return {
        cartItems: Meteor.collection('cart').find()
    }
})(Cart)
const styles = {
    title: {
        fontFamily: 'Roboto',
        fontWeight: '100'
    }
};
