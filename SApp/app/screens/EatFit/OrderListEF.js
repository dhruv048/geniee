import React, {Component} from 'react';
import {
    Container,
    Header,
    Left,
    Body,
    Right,
    Content,
    Tabs,
    Tab,
    Button,
    Text,
    Item,
    View,
    Label,
    Thumbnail,
    Title,
    Card,
    CardItem,
    Badge,
    Grid,
    Col,
    Row
} from 'native-base';
import Moment from "moment";
import {
    StyleSheet, FlatList, TouchableOpacity,

} from 'react-native';
import {colors, customStyle, variables} from "../../config/styles";
import Meteor, {withTracker} from "react-native-meteor";
import Icon from 'react-native-vector-icons/Feather';
import FontIcon from 'react-native-vector-icons/FontAwesome'
import {OrderStatus} from "../../config/settings";
import settings from "../../config/settings";
import {TouchableNativeFeedback} from 'react-native-gesture-handler';
import DeviceInfo from "react-native-device-info/deviceinfo";
import Loading from "../../components/Loading/Loading";
import ForgotPassword from "../ForgotPassword";

// import RNEsewa from "react-native-esewa";

class OrderListEF extends Component {
    constructor(props) {
        super(props);
        this.mounted = false;
        this.state={
            orderList:''
        }

    }

    componentDidMount() {
        const deviceId=DeviceInfo.getUniqueID();
        Meteor.call('getOrdersEF',deviceId,(err,res)=>{
            console.log(err,res);
            if(!err){
                this.setState({orderList:res})
            }
        })
    }

    componentWillUnmount() {
        this.mounted = false;
    }
    _approveOrder = (Id) => {
        Meteor.call('approveOrder', Id, (err) => {
            if (err) {
                console.log(err)
            }
        })
    }
    _declineOrder = (Id) => {
        Meteor.call('declineOrder', Id, (err) => {
            if (err) {
                console.log(err)
            }
        })
    }
    _handleConfirm = (orderId) => {
        let res = this.onEsewaComplete();
        // alert(res);
        console.log(res.data)
        // Meteor.call('confirmOrder', orderId, (err) => {
        //     if (err) {
        //         console.log(er.reason);
        //     }
        // })
    }
    onEsewaComplete = async () => {
        // const componentName = await RNEsewa.resolveActivity();
        // if (!componentName) {
        //     // You could also display a dialog with the link to the app store.
        //     throw new Error(`Cannot resolve activity for intent . Did you install the app?`);
        // }

        // const response = await RNEsewa.makePayment('2', 'Product101', '0014assffff', 'http://192.168.1.245:3000/').then(function (response) {
        //     return response
        // }).catch(function (error) {
        //     console.log('There has been a problem with your fetch operation: ' + error.message);
        //     // ADD THIS THROW error
        //     throw error;
        // });

        // if (response.resultCode !== RNEsewaSdk.OK) {
        //     throw new Error('Invalid result from child activity.');
        // }
        // console.log(response.data);


        // return response.data;
    };

    _totalAmount(items) {
        var total = 0;
        items.map((item) => {
            total += parseFloat(item.finalPrice) * parseInt(item.quantity);
        });
        return total;
    }

    getQuantity(items) {
        var total = 0;
        items.map((item) => {
            total += item.quantity;
        });
        return total
    }

    _renderItem = (dataa, index) => {
        var order = dataa.item;
        let TotalAmount = order.totalPrice;
        return (
            <Card key={order._id} style={customStyle.Card}>
                <TouchableNativeFeedback onPress={() => {
                    this.props.navigation.navigate('OrderDetail', {'Id':order._id,'Order': order})
                }} background={TouchableNativeFeedback.SelectableBackground()}>
                    <CardItem>
                        <Grid>
                            <Col style={{flex: 2}}>
                                {/* <Thumbnail large
                                        source={{uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSOdoMX4D0Cf_zowYRuqboJkIGBg_lQtnmixZ1YdVkHXin0PIMW'}}/> */}
                                <Text style={{fontSize: 16}}>Order ID: {order._id || "0000145"}</Text>
                                <Text note>{Moment(order.orderDate).format('DD MMM, YYYY')}</Text>
                                {order.status == OrderStatus.ORDER_REQUESTED ?
                                    <Badge warning style={[customStyle.badgeWarning, {marginTop: 4}]}>
                                        <Text style={customStyle.badgeWarningText}>Order Placed</Text>
                                    </Badge> : null}

                                {order.status == OrderStatus.ORDER_DISPATCHED ?
                                    <Badge info style={[customStyle.badgePrimary, {marginTop: 4}]}>
                                        <Text style={customStyle.badgePrimaryText}>Dispatched</Text>
                                    </Badge> : null}
                                {order.status == OrderStatus.ORDER_DELIVERED ?
                                    <Badge success style={[customStyle.badgeSuccess,{marginTop: 4}]}>
                                        <Text style={customStyle.badgeSuccessText}>Delivered</Text>
                                    </Badge> : null}

                                {order.status == OrderStatus.ORDER_CANCELLED ?
                                    <Badge danger style={[customStyle.badgeDanger,{marginTop: 4}]}>
                                        <Text style={customStyle.badgeDangerText}>Cancelled</Text>
                                    </Badge> : null}
                            </Col>
                            <Col style={{paddingLeft: 10, flex: 1, alignItems: 'flex-end'}}>
                                {/* <Text style={{
                                    fontSize: 18,
                                    fontWeight: "500"
                                }}>{order.items[0].quantity} X {order.items[0].title}</Text> */}
                                
                                <Text style={{fontSize: 18, fontWeight: 'bold'}}>Rs. {TotalAmount}</Text>
                                <Text style={{fontSize: 14}}>{order.items.length} items</Text>
                                <Text style={{fontSize: 14}}>{this.getQuantity(order.items)} quantity</Text>
                            </Col>
                        </Grid>
                    </CardItem>
                </TouchableNativeFeedback>
            </Card>
        )
    }



    render() {
        return (
            <Container style={styles.container}>
                <Header androidStatusBarColor={colors.statusBar}
                        style={{backgroundColor: colors.appLayout}}>
                    <Left>
                        <Button transparent onPress={() => {
                            this.props.navigation.openDrawer()
                        }}>
                            <FontIcon name='ellipsis-v' size={24} color={'white'}/>
                        </Button>

                    </Left>
                    <Body>
                        <Title>Orders</Title>
                    </Body>
                    {/* <Right style={{margin: 7}}>
                        <Button onPress={() => {
                            this.props.navigation.navigate('ArticleCreate')
                        }} transparent>
                            <Icon name='plus' color='white' size={25}/>
                        </Button>
                    </Right> */}
                    <Right/>
                </Header>

                <Content padder>
                    {this.state.orderList && this.state.orderList.length > 0 ?
                        <FlatList
                            data={this.state.orderList}
                            renderItem={this._renderItem}
                        />
                        : <View style={customStyle.noList}>
                            <Text style={customStyle.noListTextColor}>No order available</Text>
                        </View>
                    }
                    {!this.state.orderList?
                    <Loading/>:null}
                </Content>
            </Container>
        );
    };
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#eee',
    },
    content: {
    },
});

export default withTracker(() => {
    return {
        //orders: Meteor.collection('order').find({owner: Meteor.userId()}, {$sort: {orderDate: -1}}),
    }
})(OrderListEF);