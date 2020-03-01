import React, {Component} from 'react';
import {FlatList, Image} from 'react-native';
import {
    Container,
    Content,
    View,
    Grid,
    Col,
    Left,
    Right,
    Button,
    List,
    ListItem,
    Body,
   Badge, Thumbnail
} from 'native-base';


// Our custom files and classes import
import Text from '../../components/ecommerce/Text';
import Navbar from '../../components/ecommerce/Navbar';
import Meteor from "../../react-native-meteor";
import {colors, customStyle} from "../../config/styles";
import {OrderStatus, PaymentType} from "../../config/settings";
import Moment from "moment/moment";
import settings from "../../config/settings";
import Icon from 'react-native-vector-icons/Feather';
import {goBack} from '../../Navigation';

class OrderDetailEF extends Component {
    constructor(props) {
        super(props);
        this.state = {
            total: 0,
            card: true,
            order :''
        };
    }

    componentWillMount() {
        //let order = this.props.Order');
        // var total = 0;
        // this.state.order.items.map((item) => {
        //     total += parseFloat(item.finalPrice) * parseInt(item.quantity);
        //     this.setState({total: total});
        // });
    }

    componentDidMount() {
        let orderId = this.props.Id;
        let _order = this.props.Order;
 
        if (_order) {
            this.setState({order: _order})
        }
        else {
            Meteor.call('getSingleOrder',orderId, (err, res) => {
                if (err) {
                    console.log('this is due to error. '+err);
                }
                else{
                    this.setState({order: res});
                }
            });
        };
    }

    render() {
        var order = this.props.Order;
        var left = (
            <Left style={{flex: 1}}>
                <Button onPress={() => goBack(this.props.componentId)} transparent>
                    <Icon name='x' size={24} color={'white'}/>
                </Button>
            </Left>
        );
        return (
            <Container style={styles.container}>
                <Navbar left={left} title="Order Detail"/>
                <Content style={styles.content}>
                   
                        <View style={{flex: 1, flexDirection: 'column', alignItems: 'center', paddingVertical: 30, paddingHorizontal: 20}}>
                            <Image height='293' width='229'
                                source={require('../../images/verified.png')}/>
                            <Text style={{fontSize: 18, marginBottom: 5, marginTop: 22}}>Order ID: {order._id || "0000145"}</Text>

                            <Text style={{fontSize: 16, color: '#8E8E8E', marginBottom: 10}}>Payment
                                :{order.PaymentType == PaymentType.CASH ? " Pay on Delivery" : " Paid with Esewa"}</Text>
                            {order.PaymentType == PaymentType.ESEWA ?
                                <Text style={{fontSize: 15, color: '#8E8E8E', marginBottom: 10}}>E-Sewa Refrence
                                    Id:{order.esewaDetail.transactionDetails.referenceId}</Text> : null}
                            <Text style={{fontSize: 15, color: '#8E8E8E', marginBottom: 10}}>{Moment(order.orderDate).format('dddd, ll')}</Text>
                            {order.status == OrderStatus.ORDER_REQUESTED ?
                                <Badge warning style={[customStyle.badgeWarning, {
                                    alignSelf: 'center',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }]}>
                                    <Text style={customStyle.badgeWarningText}>Order Placed</Text>
                                </Badge> : null}

                            {order.status == OrderStatus.ORDER_DISPATCHED ?
                                <Badge info style={[customStyle.badgePrimary, {
                                    alignSelf: 'center',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }]}>
                                    <Text style={customStyle.badgePrimaryText}>Dispatched</Text>
                                </Badge> : null}
                            {order.status == OrderStatus.ORDER_DELIVERED ?
                                <Badge success style={[customStyle.badgeSuccess, {
                                    alignSelf: 'center',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }]}>
                                    <Text style={customStyle.badgeSuccessText}>Delivered</Text>
                                </Badge> : null}

                            {order.status == OrderStatus.ORDER_CANCELLED ?
                                <Badge danger style={[customStyle.badgeDanger, {
                                    alignSelf: 'center',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }]}>
                                    <Text style={customStyle.badgeDangerText}>Cancelled</Text>
                                </Badge> : null}
                            
                        </View>
                        {/*<CardItem style={{borderTopWidth: 1, borderTopColor: '#e8e8e8'}}>*/}
                        <Text style={{marginTop: 15, fontSize: 15, padding: 15, borderBottomColor: '#ddd', borderBottomWidth: 1, fontWeight: 'bold'}}>Order Items</Text>
                        <View style={styles.invoice}>
                            <List>
                                <FlatList
                                    data={order.items}
                                    renderItem={(item, index) => this.renderItem(item, index)}
                                />
                            </List>
                            
                            <Grid style={{paddingVertical: 20, paddingHorizontal: 16, marginBottom: 20}}>
                                <Col>
                                    <Text style={{fontSize: 15, fontWeight: 'bold'}}>Total</Text>
                                </Col>
                                <Col>
                                    <Text style={{
                                        textAlign: 'right',
                                        fontSize: 20,
                                        fontWeight: 'bold'
                                    }}>Rs. {order.totalPrice}</Text>
                                </Col>
                            </Grid>
                        </View>
                        {/*</CardItem>*/}
                        {/*<CardItem style={{borderTopWidth: 1, borderTopColor: '#e8e8e8'}}>*/}
                        {/*<View style={{marginTop: 10, marginBottom: 10, paddingBottom: 7}}>*/}
                        {/*<Button onPress={() => this.checkout()} style={{backgroundColor: colors.appLayout}}*/}
                        {/*block*/}
                        {/*iconLeft>*/}
                        {/*<Text style={{color: '#fdfdfd'}}> Download</Text>*/}
                        {/*</Button>*/}
                        {/*</View>*/}
                        {/*</CardItem>*/}
                    
                </Content>
            </Container>
        );
    }

    renderItem(data, i) {
        let item = data.item;
        return (
            <ListItem
                key={i}
                style={{}}
            >
                <Thumbnail square style={{width: 80, height: 80}}
                           source={item.productImage?{uri:settings.IMAGE_URL+item.productImage}:require('../../images/wishlist-empty.png')}/>
               
                <Body style={{flex: 2, paddingLeft: 10}}>
                    <Text style={{fontSize: 16}}>
                        {item.quantity > 1 ? item.quantity + "x " : null}
                        {item.title}
                    </Text>
                    <Text style={{color: '#8E8E8E', fontSize: 13}}>{item.isVeg?"Veg":"Non-Veg"}</Text>
                    {/*<Text style={{color: '#8E8E8E', fontSize: 13}}>Size: {item.size}</Text>*/}
                </Body>
                <Right style={{flex: 1, alignSelf: "flex-start"}}>
                    <Text style={{fontSize: 18, fontWeight: 'bold'}}>Rs. {item.finalPrice}</Text>
                </Right>
            </ListItem>
        );
    }
}

const styles = {
    invoice: {
        // paddingLeft: 20,
        // paddingRight: 20
    },
    line: {
        // width: '100%',
        // height: 1,
        // backgroundColor: '#bdc3c7'
    }
};

export default Meteor.withTracker((props) => {

    return {
        user: Meteor.user(),
    }
})(OrderDetailEF)