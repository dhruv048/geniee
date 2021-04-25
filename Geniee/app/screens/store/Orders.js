import React, { Component } from 'react';
import {
    Container,
    Header,
    Text,
    View,
    Card,
    CardItem,
    Badge,
    Grid,
    Col, Tabs, Tab, Item, Input, Button,
    Left, Body
} from 'native-base';
import Moment from "moment";
import {
    StyleSheet, FlatList, TouchableOpacity, BackHandler
} from 'react-native';
import { colors, customStyle } from "../../config/styles";
import Meteor from "../../react-native-meteor";
import Icon from 'react-native-vector-icons/Feather';
import { OrderStatus } from "../../config/settings";
import DeviceInfo from "react-native-device-info";
import _ from "lodash";


// import RNEsewa from "react-native-esewa";

class Orders extends Component {
    constructor(props) {
        super(props);
        this.mounted = false;
        this.state = {
            ordersToMe: '',
            ordersByMe: '',
            query: '',
            isOwnOrders: false
        };
        this.isDisplaying = false;
        this.debounceSearch = _.debounce(this._searchOrders, 500);
        this.toMeSkip = 0;
        this.byMeSkip = 0;
        this.limit = 15;
        this.ordersToMe = [];
        this.ordersByMe = [];
    }

    componentDidMount() {

        // BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);

        const deviceId = DeviceInfo.getUniqueId();
        Meteor.call('getMyOrders', (err, res) => {
            console.log(err, res);
            if (!err) {
                this.ordersToMe = res;
                this.setState({ ordersToMe: res })
            }
        })
        Meteor.call('getOrders', deviceId, (err, res) => {
            console.log(err, res);
            if (!err) {
                this.ordersByMe = res.result;
                this.setState({ ordersByMe: res.result })
            }
        })
    }

    handleBackButton = () => {
        if (this.isDisplaying) {
            console.log('handleback press orderList')
            // this.props.navigation.navigate('Dashboard');
            this.props.navigation.navigate('Home');
            return true;
        }

    }

    componentWillUnmount() {
        // BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
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
    _searchOrders = (searchText) => {
        if (!searchText) {
            this.setState({ ordersByMe: this.ordersByMe });
            return;
        }

        Meteor.call('searchOrder', searchText, DeviceInfo.getUniqueId(), (err, res) => {
            console.log(err, res);
            if (!err) {
                this.setState({ ordersByMe: res.result })
            }
        })
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

    _handleTabChange = (isOwn) => {
        console.log('changed', isOwn)
        this.setState({ isOwnOrders: isOwn })
    }

    _renderItem = (dataa, index) => {
        var order = dataa.item;
        let TotalAmount = order.totalPrice;
        return (
            <Card key={order._id} style={customStyle.Card}>
                <TouchableOpacity onPress={() => {
                    this.props.navigation.navigate(this.state.isOwnOrders ? 'OrderDetailOut' : 'OrderDetailIn', { 'Id': order._id })
                }} >
                    <CardItem>
                        <Grid>
                            <Col style={{ flex: 2 }}>
                                {/* <Thumbnail large
                                        source={{uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSOdoMX4D0Cf_zowYRuqboJkIGBg_lQtnmixZ1YdVkHXin0PIMW'}}/> */}


                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    {order.status == OrderStatus.ORDER_REQUESTED ?
                                        <Badge warning style={[customStyle.badgeWarning, { marginTop: 4, marginRight: 5 }]}>
                                            {/* <Text style={customStyle.badgeWarningText}>Order Placed</Text> */}
                                            <Icon name={'user-check'} color={colors.whiteText} />
                                        </Badge> : null}
                                    {order.status == OrderStatus.ORDER_DISPATCHED ?
                                        <Badge info style={[customStyle.badgePrimary, { marginTop: 4, marginRight: 5 }]}>
                                            {/* <Text style={customStyle.badgePrimaryText}>Dispatched</Text> */}
                                            <Icon name={'truck'} color={colors.whiteText} />
                                        </Badge> : null}
                                    {order.status == OrderStatus.ORDER_DELIVERED ?
                                        <Badge success style={[customStyle.badgeSuccess, { marginTop: 4, marginRight: 5 }]}>
                                            {/* <Text style={customStyle.badgeSuccessText}>Delivered</Text> */}
                                            <Icon name={'check'} color={colors.whiteText} />
                                        </Badge> : null}
                                    {order.status == OrderStatus.ORDER_CANCELLED ?
                                        <Badge danger style={[customStyle.badgeDanger, { marginTop: 4, marginRight: 5 }]}>
                                            {/* <Text style={customStyle.badgeDangerText}>Cancelled</Text> */}
                                            <Icon name={'x'} color={colors.whiteText} />
                                        </Badge> : null}
                                    {order.status == OrderStatus.ORDER_DECLINED ?
                                        <Badge danger style={[customStyle.badgeDanger, { marginTop: 4, marginRight: 5 }]}>
                                            {/* <Text style={customStyle.badgeDangerText}>Declined</Text> */}
                                            <Icon name={'x-circle'} color={colors.whiteText} />
                                        </Badge> : null}
                                    <View>
                                        {order.status == OrderStatus.ORDER_REQUESTED ?
                                            <Text note>Your order is placed.</Text> : null}
                                        {order.status == OrderStatus.ORDER_DISPATCHED ?
                                            <Text note>Your order is dispatched.</Text> : null}
                                        {order.status == OrderStatus.ORDER_DELIVERED ?
                                            <Text note>Your order is delivered.</Text> : null}
                                        {order.status == OrderStatus.ORDER_CANCELLED ?
                                            <Text note>Your order is cancelled.</Text> : null}
                                        {order.status == OrderStatus.ORDER_DECLINED ?
                                            <Text note>Your order is declined.</Text> : null}

                                        <Text note>{Moment(order.orderDate).format('DD MMM, YYYY')}</Text>
                                        <Text style={{ fontSize: 16 }}>{order.orderId || "0000145"}</Text>

                                    </View>
                                </View>
                            </Col>
                            <Col style={{ paddingLeft: 10, flex: 1, alignItems: 'flex-end' }}>
                                {/* <Text style={{
                                    fontSize: 18,
                                    fontWeight: "500"
                                }}>{order.items[0].quantity} X {order.items[0].title}</Text> */}

                                <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.primary }}>Rs. {TotalAmount}</Text>
                                <Text note style={{ fontSize: 14 }}>{order.items.length} items</Text>
                                <Text note style={{ fontSize: 14 }}>{this.getQuantity(order.items)} quantity</Text>
                            </Col>
                        </Grid>
                    </CardItem>
                </TouchableOpacity>
            </Card>
        )
    }



    render() {
        return (
            <Container style={customStyle.Container}>
                <Header searchBar rounded androidStatusBarColor={colors.statusBar}
                    style={{ backgroundColor: colors.appLayout }}>
                    <Left style={{ flex: 1 }}>
                        <Button transparent onPress={() => {
                            this.props.navigation.goBack()
                        }}>
                            <Icon name='arrow-left' size={24} color={'white'} />
                        </Button>
                    </Left>
                    <Body style={{ flex: 8 }}>
                        {/* <Item>
                        <Input
                            value={this.state.query}
                            placeholder="Search Orders"
                            onChangeText={(text) => {
                                this.setState({query: text}),
                                    this.debounceSearch(text)
                            }}/>
                    </Item> */}
                        <Item search style={{
                            height: 40, width: '95%', paddingHorizontal: 10, backgroundColor: '#cce0ff',
                            zIndex: 1,
                            borderRadius: 8,
                            borderBottomWidth: 0,
                        }}>
                            <Input
                                style={{ fontFamily: 'Roboto' }}
                                underlineColorAndroid="rgba(0,0,0,0)"
                                returnKeyType="search"
                                placeholder="Search..."
                                style={styles.searchInput}
                                // selectionColor='#ffffff'
                                onChangeText={(text) => {
                                    this.setState({ query: text }),
                                        this.debounceSearch(text)
                                }}
                                value={this.state.query}
                                autoCorrect={false}
                                value={this.state.query}
                            />
                            {this.state.query ?
                                <Button style={{ paddingHorizontal: 10 }}
                                    onPress={() => {
                                        this.setState({ query: '' }),
                                            this.debounceSearch("")
                                    }} transparent>
                                    <Icon name='x' size={20} color={colors.primary} />
                                </Button> :
                                <Button
                                    style={{ paddingHorizontal: 2 }}
                                    transparent
                                >
                                    <Icon
                                        name={'search'}
                                        size={20}
                                        style={{ color: colors.whiteText }}
                                    />
                                </Button>}

                        </Item>
                    </Body>
                    {/*<Right style={{flex: 1}}>*/}
                    {/*<Button onPress={() => {*/}
                    {/*this.setState({query: ''}),*/}
                    {/*this.debounceSearch("")*/}
                    {/*}} transparent>*/}
                    {/*<Icon name='x' color='white' size={25}/>*/}
                    {/*</Button>*/}
                    {/*</Right>*/}
                </Header>

                <Tabs
                    onChangeTab={({ i }) => this._handleTabChange(i)}
                    tabContainerStyle={customStyle.tabContainerStyle}
                    tabsContainerStyle={customStyle.tabsContainerStyle}
                    tabBarUnderlineStyle={customStyle.tabBarUnderlineStyle}
                >
                    <Tab
                        tabStyle={customStyle.tabStyle}
                        activeTabStyle={customStyle.activeTabStyle}
                        activeTextStyle={customStyle.activeTextStyle}
                        textStyle={customStyle.textStyle}
                        heading="Orders To Me">
                        <View style={[customStyle.Container, { flex: 1 }]}>
                            {this.state.ordersToMe && this.state.ordersToMe.length > 0 ?
                                <FlatList
                                    data={this.state.ordersToMe.slice().sort(
                                        (a, b) => b.orderDate.getTime() - a.orderDate.getTime())}
                                    renderItem={this._renderItem}
                                    refreshing={this.state.refreshing}
                                    // onRefresh={this._handleRefreshUpcomming.bind(this)}
                                    KeyExtractor={(item) => item._id}
                                    // onEndReached={this._handleEndReachUpcomming}
                                    onEndReachedThreshold={0.2}
                                />
                                : <View style={customStyle.noList}>
                                    <Text style={customStyle.noListTextColor}>No Orders available for your Products or You haven't Logged In.</Text>
                                </View>
                            }
                        </View>
                    </Tab>
                    <Tab
                        tabStyle={customStyle.tabStyle}
                        activeTabStyle={customStyle.activeTabStyle}
                        activeTextStyle={customStyle.activeTextStyle}
                        textStyle={customStyle.textStyle}
                        heading="Orders By Me">
                        <View style={[customStyle.Container, { flex: 1 }]}>
                            {this.state.ordersByMe && this.state.ordersByMe.length > 0 ?
                                <FlatList
                                    data={this.state.ordersByMe.slice().sort(
                                        (a, b) => b.orderDate.getTime() - a.orderDate.getTime())}
                                    renderItem={this._renderItem}
                                    refreshing={this.state.refreshing}
                                    // onRefresh={this._handleRefreshPrevious.bind(this)}
                                    KeyExtractor={(item) => item._id}
                                    // onEndReached={this._handleEndReachPrevious}
                                    onEndReachedThreshold={0.2}
                                />
                                : <View style={customStyle.noList}>
                                    <Text style={customStyle.noListTextColor}>You haven't place any order yet or Logged In.</Text>
                                </View>
                            }
                        </View>
                    </Tab>
                </Tabs>
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

export default Meteor.withTracker(() => {
    return {
        //orders: Meteor.collection('order').find({owner: Meteor.userId()}, {$sort: {orderDate: -1}}),
    }
})(Orders);