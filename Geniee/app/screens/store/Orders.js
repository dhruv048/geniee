import React, {Component} from 'react';
import {
    Container,
    Header,
    Text,
    View,
    Card,
    CardItem,
    Badge,
    Grid,
    Col,Tabs, Tab, Item, Input,Button
} from 'native-base';
import Moment from "moment";
import {
    StyleSheet, FlatList,TouchableNativeFeedback,BackHandler

} from 'react-native';
import {colors, customStyle} from "../../config/styles";
import Meteor from "../../react-native-meteor";
import Icon from 'react-native-vector-icons/Feather'
import {OrderStatus} from "../../config/settings";
import DeviceInfo from "react-native-device-info";
import Loading from "../../components/Loading/Loading";
import {CogMenu} from "../../components/CogMenu/CogMenu";
import {Navigation} from "react-native-navigation";
import {backToRoot, goToRoute} from "../../Navigation";
import  _ from "lodash";


// import RNEsewa from "react-native-esewa";

class Orders extends Component {
    constructor(props) {
        super(props);
        this.mounted = false;
        this.state={
            ordersToMe:'',
            ordersByMe:'',
            query:'',
            isOwnOrders:false
        };
        this.isDisplaying=false;
        this.debounceSearch = _.debounce(this._searchOrders, 500);
        this.toMeSkip = 0;
        this.byMeSkip = 0;
        this.limit = 15;
        this.ordersToMe = [];
        this.ordersByMe = [];
    }

    componentDidMount() {
        Navigation.events().bindComponent(this);
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);

        const deviceId=DeviceInfo.getUniqueId();
        Meteor.call('getMyOrders',(err,res)=>{
            console.log(err,res);
            if(!err){
                this.setState({ordersToMe:res})
            }
        })
        Meteor.call('getOrders',deviceId,(err,res)=>{
            console.log(err,res);
            if(!err){
                this.setState({ordersByMe:res.result})
            }
        })
    }

    handleBackButton=()=>{
        if( this.isDisplaying) {
            console.log('handleback press orderList')
            // navigateToRoutefromSideMenu(this.props.componentId,'Dashboard');
            backToRoot(this.props.componentId);
            return true;
        }

    }

    componentDidAppear(){
        this.isDisplaying=true;
    }

    componentDidDisappear(){
        this.isDisplaying=false;
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
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
        // if (searchText == "") {
        //     this.setState({
        //         UpcomingAppointments: this.UpcomingAppointments,
        //         PreviousAppointments: this.PreviousAppointments
        //     });
        // }
        // if (searchText.length > 2) {
        //     Meteor.call('searchAppointment', searchText, true, (error, res) => {
        //         console.log(error, res);
        //         if (error) {
        //             alert(error.reason);
        //         }
        //         else {
        //             let uppcomming = res.result.filter(item => {
        //                 return item.appointmentDate.getTime() >= new Date().getTime()
        //             });
        //             let previous = res.result.filter(item => {
        //                 return item.appointmentDate.getTime() < new Date().getTime()
        //             });
        //             console.log(uppcomming, previous);
        //             this.setState({UpcomingAppointments: uppcomming, PreviousAppointments: previous});
        //         }
        //     })
        // }
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

    _handleTabChange=(isOwn)=>{
        console.log('changed',isOwn)
        this.setState({isOwnOrders:isOwn})
    }

    _renderItem = (dataa, index) => {
        var order = dataa.item;
        let TotalAmount = order.totalPrice;
        return (
            <Card key={order._id} style={customStyle.Card}>
                <TouchableNativeFeedback onPress={() => {
                    goToRoute(this.props.componentId,'OrderDetailEF', {'Id':order._id,'Order': order,isOwnOrder: this.state.isOwnOrders})
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
            <Container style={customStyle.Container}>
                <Header searchBar rounded androidStatusBarColor={colors.statusBar}
                        style={{backgroundColor: colors.appLayout}}>
                    {/* <Left style={{flex: 1}}>
                        <Button transparent onPress={() => {
                            this.props.navigation.openDrawer()
                        }}>
                            <Icon name='menu' size={24} color={'white'}/>
                        </Button>
                    </Left> */}
                    <Item>
                        {/*{this.state.query ?*/}
                            {/*<Button onPress={() => {*/}
                                {/*this.setState({query: ''}), this.debounceSearch("")*/}
                            {/*}} transparent*/}
                                    {/*style={{paddingHorizontal: 10}}>*/}

                                {/*<Icon name='arrow-left' size={20}/>*/}
                            {/*</Button>*/}
                            {/*:*/}
                            {/*// <Icon name='search' size={20}/>*/}
                            {/*<Button transparent onPress={() => {*/}
                                {/*this.props.navigation.openDrawer()*/}
                            {/*}} style={{paddingHorizontal: 10}}>*/}
                                {/*<Icon name='menu' size={20}/>*/}
                            {/*</Button>*/}
                        {/*}*/}

                        <CogMenu componentId={this.props.componentId} color={colors.primary}/>
                        <Input
                            value={this.state.query}
                            placeholder="Search Orders"
                            onChangeText={(text) => {
                                this.setState({query: text}),
                                    this.debounceSearch(text)
                            }}/>
                        {this.state.query ?
                            <Button style={{paddingHorizontal: 10}}
                                    onPress={() => {
                                        this.setState({query: ''}),
                                            this.debounceSearch("")
                                    }} transparent>
                                <Icon name='x' size={20} color={colors.primary}/>
                            </Button> : null}
                    </Item>
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
                    onChangeTab={({i}) => this._handleTabChange(i)}
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
                        <View style={[customStyle.Container, {flex: 1}]}>
                            {this.state.ordersToMe && this.state.ordersToMe.length > 0 ?
                                <FlatList
                                    data={this.state.ordersToMe}
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
                        <View style={[customStyle.Container, {flex: 1}]}>
                            {this.state.ordersByMe && this.state.ordersByMe.length > 0 ?
                                <FlatList
                                    data={this.state.ordersByMe}
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