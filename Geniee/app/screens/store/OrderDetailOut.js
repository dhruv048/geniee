import React, {Component} from 'react';
import {FlatList, Image, ToastAndroid} from 'react-native';
import {
  Container,
  Content,
  View,
  Label,
  Grid,
  Col,
  Left,
  Right,
  Button,
  List,
  ListItem,
  Body,
  Badge,
  Thumbnail,
  Footer,
  Card,
  CardItem,
  H2,
} from 'native-base';
// Our custom files and classes import
import Text from '../../components/ecommerce/Text';
import Navbar from '../../components/ecommerce/Navbar';
import Meteor from '../../react-native-meteor';
import {colors, customStyle} from '../../config/styles';
import {orderModal} from '../../config/modals';
import {OrderStatus, PaymentType, ProductOwner} from '../../config/settings';
import Moment from 'moment/moment';
import settings from '../../config/settings';
import Icon from 'react-native-vector-icons/Feather';
import {goBack} from '../../Navigation';
import DeviceInfo from 'react-native-device-info';

class OrderDetailOut extends Component {
  constructor(props) {
    super(props);
    this.state = {
      total: 0,
      card: true,
      order: orderModal,
    };
  }

  componentDidMount() {
    let orderId = this.props.route.params.Id;
    let _order = this.props.Order;

    if (_order) {
      this.setState({order: _order});
    } else {
      Meteor.call('getSingleOrder', orderId, (err, res) => {
        if (err) {
          console.log('this is due to error. ' + err);
        } else {
          console.log(res);
          this.setState({order: res.result});
        }
      });
    }
  }

  render() {
    var order = this.state.order;
    var left = (
      <Left style={{flex: 1}}>
        <Button onPress={() => this.props.navigation.goBack()} transparent>
          <Icon name="arrow-left" size={24} color={'white'} />
        </Button>
      </Left>
    );
    return (
      <Container style={styles.container}>
        <Navbar left={left} title="Order Detail" />
        <Content style={styles.content}>
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              paddingVertical: 20,
              paddingHorizontal: 20,
            }}>
            {/*<Image height='293' width='229'*/}
            {/*source={require('../../images/verified.png')}/>*/}
            <Text style={{fontSize: 18, marginBottom: 5, marginTop: 22}}>
              Order ID: {order.orderId || '0000145'}
            </Text>

            <Text style={{fontSize: 16, color: '#8E8E8E', marginBottom: 10}}>
              Payment :
              {order.PaymentType == PaymentType.CASH
                ? ' Pay on Delivery'
                : ' Paid with Esewa'}
            </Text>
            {order.PaymentType == PaymentType.ESEWA ? (
              <Text style={{fontSize: 15, color: '#8E8E8E', marginBottom: 10}}>
                E-Sewa Refrence Id:
                {order.esewaDetail.transactionDetails.referenceId}
              </Text>
            ) : null}
            <Text style={{fontSize: 15, color: '#8E8E8E', marginBottom: 10}}>
              {Moment(order.orderDate).format('dddd, ll')}
            </Text>
          </View>
          {/*<CardItem style={{borderTopWidth: 1, borderTopColor: '#e8e8e8'}}>*/}
          <Text
            style={{
              marginTop: 15,
              fontSize: 15,
              padding: 15,
              borderBottomColor: '#ddd',
              borderBottomWidth: 1,
              fontWeight: 'bold',
            }}>
            Order Items
          </Text>
          <View style={styles.invoice}>
            <List>
              <FlatList
                data={order.items}
                renderItem={(item, index) => this.renderItem(item, index)}
              />
            </List>

            <Grid
              style={{
                paddingVertical: 20,
                paddingHorizontal: 16,
                marginBottom: 20,
              }}>
              <Col>
                <Text style={{fontSize: 15, fontWeight: 'bold'}}>Total</Text>
              </Col>
              <Col>
                <Text
                  style={{
                    textAlign: 'right',
                    fontSize: 20,
                    fontWeight: 'bold',
                  }}>
                  Rs. {order.totalPrice}
                </Text>
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
        <View>
          {order.status == OrderStatus.ORDER_REQUESTED ? (
            <Footer style={customStyle.footer}>
              <View style={customStyle.row}>
                <View style={customStyle.col}>
                  <Button
                    block
                    light
                    style={customStyle.buttonLight}
                    onPress={this._updateOrderStatus.bind(this)}>
                    <Text uppercase={false} style={customStyle.buttonLightText}>
                      Cancel Order
                    </Text>
                  </Button>
                </View>
              </View>
            </Footer>
          ) : null}
        </View>
      </Container>
    );
  }

  _updateOrderStatus() {
    const {_id, productOwner} = this.state.order;
    const deviceId = DeviceInfo.getUniqueId();
    Meteor.call('cancelOrder', _id, productOwner, deviceId, (err, res) => {
      if (err) {
        ToastAndroid.showWithGravityAndOffset(
          err.reason,
          ToastAndroid.LONG,
          ToastAndroid.TOP,
          0,
          80,
        );
      } else {
        ToastAndroid.showWithGravityAndOffset(
          'Order Cancelled Successfully!!',
          ToastAndroid.LONG,
          ToastAndroid.TOP,
          0,
          80,
        );
        Meteor.call('getSingleOrder',_id, (err, res) => {
          if (err) {
            console.log('this is due to error. ' + err);
          } else {
            console.log(res);
            this.setState({order: res.result});
          }
        });
      }
    });
  }

  renderItem(data, i) {
    let item = data.item;
    item.amount = item.finalPrice * item.quantity;
    item.Service = this.state.order.Services.find(serv => {
      return serv._id == item.service;
    });
    console.log(item);
    return (
      <ListItem key={i} style={{}}>
        <Thumbnail
          square
          style={{width: 80, height: 80}}
          source={
            item.productImage
              ? {uri: settings.IMAGE_URL + item.productImage}
              : require('../../images/wishlist-empty.png')
          }
        />
        <Body style={{flex: 2, paddingLeft: 10}}>
          <Text style={{fontSize: 16, fontWeight: 'bold'}}>
            {/*{item.quantity > 1 ? item.quantity + "x " : null}*/}
            {item.title}
          </Text>
          {item.productOwner == ProductOwner.EAT_FIT ? (
            <Text style={{color: '#8E8E8E', fontSize: 13}}>
              {item.isVeg ? 'Veg' : 'Non-Veg'}
            </Text>
          ) : null}
          <Text style={{color: '#8E8E8E', fontSize: 13}}>
            Quantity: {item.quantity} {item.unit}
          </Text>
          <Text style={{color: '#8E8E8E', fontSize: 13}}>
            Price : Rs. {item.finalPrice}
          </Text>
          {item.Service ? (
            <Text style={{color: '#8E8E8E', fontSize: 15}}>
              Provider : {item.Service.title}
            </Text>
          ) : null}
          {item.status == OrderStatus.ORDER_REQUESTED ? (
            <Badge
              warning
              style={[
                customStyle.badgeWarning,
                {
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              ]}>
              <Text style={[customStyle.badgeWarningText, {color: 'white'}]}>
                Order Placed
              </Text>
            </Badge>
          ) : null}

          {item.status == OrderStatus.ORDER_DISPATCHED ? (
            <Badge
              info
              style={[
                customStyle.badgePrimary,
                {
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              ]}>
              <Text style={[customStyle.badgeWarningText, {color: 'white'}]}>
                Dispatched
              </Text>
            </Badge>
          ) : null}
          {item.status == OrderStatus.ORDER_DELIVERED ? (
            <Badge
              success
              style={[
                customStyle.badgeSuccess,
                {
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              ]}>
              <Text style={[customStyle.badgeWarningText, {color: 'white'}]}>
                Delivered
              </Text>
            </Badge>
          ) : null}

          {item.status == OrderStatus.ORDER_CANCELLED ? (
            <Badge
              danger
              style={[
                customStyle.badgeDanger,
                {
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              ]}>
              <Text style={[customStyle.badgeWarningText, {color: 'white'}]}>
                Cancelled
              </Text>
            </Badge>
          ) : null}
          {item.status == OrderStatus.ORDER_DECLINED ? (
            <Badge
              danger
              style={[
                customStyle.badgeDanger,
                {
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              ]}>
              <Text style={[customStyle.badgeWarningText, {color: 'white'}]}>
                Declined
              </Text>
            </Badge>
          ) : null}
        </Body>
        <Right style={{flex: 1, alignSelf: 'flex-start'}}>
          <Text style={{fontSize: 18, fontWeight: 'bold'}}>
            Rs. {item.amount}
          </Text>
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
  },
};

export default Meteor.withTracker(props => {
  return {
    user: Meteor.user(),
  };
})(OrderDetailOut);