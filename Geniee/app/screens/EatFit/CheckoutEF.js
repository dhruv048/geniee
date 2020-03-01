import React, {Component} from 'react';
import {FlatList, TextInput, NativeModules, ToastAndroid, Alert, AsyncStorage} from 'react-native';
import {
    Container,
    Content,
    View,
    Grid,
    Col,
    Left,
    Right,
    Button,
    Icon,
    List,
    ListItem,
    Body,
    Radio,
    Input,
    Item,
    Label
} from 'native-base';
import FAIcon from 'react-native-vector-icons/FontAwesome';

// Our custom files and classes import
import Text from '../../components/ecommerce/Text';
import Navbar from '../../components/ecommerce/Navbar';
import Meteor from "../../react-native-meteor";
import {colors} from "../../config/styles";
import {variables, customStyle} from '../../config/styles';
import {PaymentType, TransactionTypes} from "../../config/settings";
import DeviceInfo from 'react-native-device-info'
import {goBack} from "../../Navigation";

class CheckoutEF extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cartItems: [],
            total: 0,
            card: true,
            paypal: false,
            name: '',
            email: '',
            phone: '',
            country: '',
            address: '',
            city: '',
            postcode: '',
            note: '',
            paymentType: PaymentType.CASH
        };
    }

    updateTotal(cartItems) {
       // console.log(cartItems);
        var total = 0;
        cartItems.map((item) => {
            total += parseFloat(item.finalPrice) * parseInt(item.orderQuantity);
            this.setState({total: total});
        });
    }

    componentWillReceiveProps(newProps){
        const singleProduct=this.props.productOrder;
        if(!singleProduct) {
            this.setState({cartItems: newProps.cartItems});
            this.updateTotal(newProps.cartItems);
        }

    }

    getdeviceId = () => {
        //Getting the Unique Id from here
        var id = DeviceInfo.getUniqueID();
        console.log('uniqueId',id)
       return id;
    };
    componentDidMount() {
        const singleProduct=this.props.productOrder;
        if(singleProduct) {
            // const cartItem={
            //     product: singleProduct,
            //
            //     "owner": "",
            //     "type": 0,
            //     "addDate": new Date(new Date().toUTCString()),
            // }
            singleProduct.addDate= new Date(new Date().toUTCString());
            singleProduct.type= 0;
            this.setState({
                cartItems: [singleProduct]
            });
            this.updateTotal([singleProduct]);
        }
        else{
            //var total = 0;
            // this.setState({cartItems:this.props.cartItems});
            //this.updateTotal(this.props.cartItems);
            this.getCartItems();
            //this.updateTotal(this.state.cartItems);
        }
        this.setState({
            // name: this.props.user.profile.name,
            // email: this.props.user.profile.email,
            // phone: this.props.user.profile.contact,
            // address: this.props.user.profile.address.formatted_address,
            city: '',
            postcode: '',
            note: ''
        })
    }

    getCartItems = async () => {
        let products=[];
        let cartList = await AsyncStorage.getItem('myCart');
        if (cartList) {
            cartList = JSON.parse(cartList);
            cartList.forEach(item => {
                    products.push(item.id)
                }
            )
        }
        console.log(cartList);
        if (products.length == 0) {
            return true;
        }
        Meteor.call('WishListItemsEF', products, (err, res) => {
            console.log(err, res);
            if (err) {
                console.log('this is due to error. ' + err);
            }
            else {
                res.forEach(product => {
                    const cartItem = cartList.find(item => item.id == product._id);
                    console.log(cartItem, product)
                    product.orderQuantity = cartItem.orderQuantity;
                    product.finalPrice = Math.round(product.price - (product.price * (product.discount / 100)));
                });
                this.setState({cartItems: res});
                this.updateTotal(res);
            }
        });
        // Meteor.call('getCartItems', (err, res) => {
        //     console.log(err, res);
        //     if (err) {
        //         console.log('this is due to error. ' + err);
        //     }
        //     else {
        //         this.setState({cartItems: res});
        //         this.updateTotal(res);
        //     }
        // });
    }

    ChangePaymentType(_PaymentType) {
        this.setState({
            paymentType: _PaymentType
        })
    }

    render() {
        var left = (
            <Left style={{flex: 1}}>
                <Button onPress={() => goBack(this.props.componentId)} transparent>
                    <Icon name='ios-arrow-back'/>
                </Button>
            </Left>
        );
        var right = (
            <Right style={{flex: 1}}>
                <Button onPress={() => {
                }} transparent>
                    <Icon name='ios-search-outline'/>
                </Button>
            </Right>
        );
        return (
            <Container style={styles.container}>
                <Navbar left={left} title="Checkout"/>
                <Content padder>
                    <View>
                        <Text style={{marginTop: 15, fontSize: 18}}>Shipping information</Text>
                        <View style={styles.formGroup}>
                            <Label style={styles.formLabel}>Full name</Label>
                            <TextInput style={styles.formInput} placeholder='' onChangeText={(text) => this.setState({name: text})}
                            value={this.state.name} placeholderTextColor="#687373"/>
                                
                        </View>
                        <View style={styles.formGroup}>
                            <Label style={styles.formLabel}>Email address</Label>
                            <TextInput style={styles.formInput} placeholder='' onChangeText={(text) => this.setState({email: text})}
                                   value={this.state.email} placeholderTextColor="#687373"/>
                        </View>
                        <View style={styles.formGroup}>
                            <Label style={{fontSize: 15, color: '#2E2E2E', marginBottom: 5}}>Phone number</Label>
                            <TextInput style={styles.formInput} placeholder='' onChangeText={(text) => this.setState({phone: text})}
                                   value={this.state.phone} placeholderTextColor="#687373"/>
                        </View>
                        {/*<Item regular style={{marginTop: 7}}>*/}
                        {/*<Input placeholder='Country' onChangeText={(text) => this.setState({country: text})}*/}
                        {/*placeholderTextColor="#687373"/>*/}
                        {/*</Item>*/}
                        <View style={styles.formGroup}>
                            <Label style={styles.formLabel}>Address</Label>
                            <TextInput style={styles.formInput} placeholder='' onChangeText={(text) => this.setState({address: text})}
                                   value={this.state.address} placeholderTextColor="#687373"/>
                        </View>
                        <View style={styles.formGroup}>
                            <Label style={styles.formLabel}>City</Label>
                            <TextInput style={styles.formInput} placeholder='' onChangeText={(text) => this.setState({city: text})}
                                   value={this.state.city} placeholderTextColor="#687373"/>
                        </View>
                        <View style={styles.formGroup}>
                            <Label style={styles.formLabel}>Postcode</Label>
                            <TextInput style={styles.formInput} placeholder='' onChangeText={(text) => this.setState({postcode: text})}
                                   value={this.state.postcode} placeholderTextColor="#687373"/>
                        </View>
                        <View style={styles.formGroup}>
                            <Label style={styles.formLabel}>Note</Label>
                            <TextInput style={styles.formInput} placeholder='' onChangeText={(text) => this.setState({note: text})}
                                   value={this.state.note} placeholderTextColor="#687373"/>
                        </View>
                    </View>
                    <Text style={{marginTop: 15, fontSize: 18}}>Your order</Text>
                    <View style={styles.invoice}>
                        <List>
                            <FlatList
                                data={this.state.cartItems}
                                renderItem={(item, index) => this.renderItem(item, index)}
                                _keyExtractor={(item, index) => {
                                    return item._id
                                }}
                            /> 
                        </List>
                        <View style={styles.line}/>
                        <Grid style={{paddingLeft: 10, paddingRight: 10, marginTop: 7}}>
                            <Col>
                                <Text style={{fontSize: 18, fontStyle: 'italic'}}>Total</Text>
                            </Col>
                            <Col>
                                <Text style={{
                                    textAlign: 'right',
                                    fontSize: 18,
                                    fontWeight: 'bold'
                                }}>Rs. {this.state.total}</Text>
                            </Col>
                        </Grid>
                    </View>
                    <View style={{marginTop: 20, marginBottom: 10, paddingBottom: 7}}>
                        <View style={customStyle.radioGroup}>
                            <Item style={customStyle.radioInline}>
                                <Radio
                                    onPress={() => {
                                        this.ChangePaymentType(PaymentType.CASH)
                                    }}
                                    style={customStyle.radioButton}
                                    color={variables.radioNormal}
                                    selectedColor={variables.radioActive}
                                    selected={this.state.paymentType === PaymentType.CASH}
                                />
                                <Text>Cash On Delivery</Text>
                            </Item>
                            <Item style={customStyle.radioInline}>
                                <Radio
                                    onPress={() => {
                                        this.ChangePaymentType(PaymentType.ESEWA)
                                    }}
                                    style={customStyle.radioButton}
                                    color={variables.radioNormal}
                                    selectedColor={variables.radioActive}
                                    selected={this.state.paymentType === PaymentType.ESEWA}
                                />
                                <Text>Pay With Esewa</Text>
                            </Item>
                        </View>
                    </View>
                    <View style={{marginTop: 10, marginBottom: 10, paddingBottom: 7}}>
                        <Button onPress={() => {
                            this.checkout()
                        }} style={{backgroundColor: colors.appLayout}} block
                                iconLeft>
                            <Icon name='ios-card'/>
                            <Text style={{color: '#fdfdfd'}}> Proceed</Text>
                        </Button>
                    </View>
                </Content>
            </Container>
        );
    }

    renderItem(data, i) {
        let item = data.item;
        // console.log(item)
        return (
            <ListItem
                key={data.item._id}
                style={{marginLeft: 0}}
            >
                <Body style={{paddingLeft: 10}}>
                <Text style={{fontSize: 18}}>
                    {item.orderQuantity > 1 ? item.orderQuantity + "x " : null}
                    {item.title}
                </Text>
                {/*<Text style={{fontSize: 14, fontStyle: 'italic'}}>Color: {item.color}</Text>*/}
                {/*<Text style={{fontSize: 14, fontStyle: 'italic'}}>Size: {item.size}</Text>*/}
                </Body>
                <Right>
                    <Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 10}}>Rs. {item.finalPrice}</Text>
                </Right>
            </ListItem>
        );
    }

    checkout = () => {
        //debugger;
        // console.log(this.state);
        const {name, email, phone, address, city, postcode, note, total, paymentType} = this.state;
        let items = [];
        if(!name || !phone || !address || !city){
            Alert.alert('Incomplete Contact Info', 'Please Enter all the contact info to complete Order.');
            return true;
        }
        let cartItems = this.state.cartItems;
        try {
            cartItems.forEach(item => {
                let product = {
                    productId: item._id,
                    title: item.title,
                    price: item.price,
                    isVeg:item.isVeg,
                    finalPrice: item.finalPrice,
                    discount: item.discount,
                    unit: item.unit,
                    quantity: item.orderQuantity,
                    category: item.category || '',
                    productImage: item.images[0],
                    // color: item.product.color,
                    // size: item.product.size,
                };
                items.push(product);
            });
        }
        catch (e) {
            console.log(e.message)
        }
        let Item = {
            contact: {
                name: name,
                email: email,
                phone: phone,
                address: address,
                city: city,
                postcode: postcode,
                note: note
            },
            totalPrice: total,
            items: items,
            deviceId:this.getdeviceId(),
            PaymentType: paymentType
        };
        this._performOrder(Item);
    }

    _performOrder = async (Item) => {
        console.log(Item);
        const {paymentType, total} = this.state;
        if (paymentType == PaymentType.ESEWA) {
            let response = await this._esewaPay(total.toString(), Item.items[0].title, Meteor.userId());
            if (response.resultCode == -1) {
                const actualData = JSON.parse(response.data)
                console.log(actualData);
                if (actualData.transactionDetails.status == "COMPLETE") {
                    ToastAndroid.showWithGravityAndOffset(
                        actualData.message.successMessage,
                        ToastAndroid.LONG,
                        ToastAndroid.TOP,
                        0,
                        80,
                    );
                }
                Item.esewaDetail = actualData;
            }
            else {
                ToastAndroid.showWithGravityAndOffset(
                    response.data,
                    ToastAndroid.LONG,
                    ToastAndroid.TOP,
                    0,
                    80,
                );
                return 0;
            }
        }
        console.log(Item);
        Meteor.call('addOrderEF', Item, 0, (err, res) => {
            if (err) {
                console.log(err.reason);
            } else {
                // let item = {
                //     orderId: res.result,
                //     PaymentType: PaymentType,
                //     esewaDetail: Item.esewaDetail,
                //     transactionType: TransactionTypes.SHOPPING
                // };
                //
                // Meteor.call('SaveTransactions', item, (err, res) => {
                //     if (err) {
                //         console.log(err.reason);
                //     }
                //     else {
                //
                //     }
                // })
            }
        })
      //  goToRoute(this.props.componentId,'OrderList');
        goBack(this.props.componentId);
    }
    _esewaPay = async (Amount, Product, Id) => {
        // const response = await NativeModules.RNEsewa.makePayment(Amount, Product, Id, 'http://medidocnepal.com').then(function (res) {
        //     return res
        // }).catch(function (error) {
        //     console.log('There has been a problem with your fetch operation: ' + error.message);
        //     // ADD THIS THROW error
        //     //    throw error;
        // });
        //
        // console.log(response.data);
        // return response;
        Alert.alert('Implement E-Sewa Payment')
    }

}

const styles = {
    container: {
        backgroundColor: '#eee',
    },
    formGroup: {
        marginBottom: 15
    },
    formLabel: {
        fontSize: 15, color: '#2E2E2E', marginBottom: 5
    },
    formInput: {
        height: 48, backgroundColor: '#f4f4f4', borderColor: '#ddd', borderWidth: 1, padding: 10, borderRadius: 4, fontSize: 16
    },
    invoice: {
        paddingLeft: 20,
        paddingRight: 20
    },
    line: {
        width: '100%',
        height: 1,
        backgroundColor: '#bdc3c7'
    }
};

export default Meteor.withTracker((props) => {
    let productId = props.productId;
    return {
        user: Meteor.user(),
        cartItems: Meteor.collection('cart').find(),
    }
})(CheckoutEF)