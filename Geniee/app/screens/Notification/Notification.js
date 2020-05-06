import React, {Component} from 'react';
import {
    Container,
    Header,
    Left,
    Body,
    Right,
    Content,
    Thumbnail,
    Label,
    Button,
    Text,
    Item,
    Title,
} from 'native-base';
import Icon from 'react-native-vector-icons/Feather';
import {
    StyleSheet, View,
    FlatList,
    TouchableOpacity
} from 'react-native';
import {colors, variables} from "../../config/styles";
import settings, {NotificationTypes, userType} from "../../config/settings";
import Meteor from '../../react-native-meteor';
import MyFunctions from "../../lib/MyFunctions";
import Moment from 'moment';
import Swipeable from "react-native-gesture-handler/Swipeable";
// import DropdownAlert from 'react-native-dropdownalert';
// import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';
import Loading from "../../components/Loading/Loading";
import {goBack} from '../../Navigation';


class Notification extends Component {

    _notificationPressed = (item) => {
        console.log('press');
        const navigator = this.props.navigation;
        Meteor.call('updateNotificationSeen', [item._id], (err) => {
            if (err) {
                console.log(err.reason);
               // this.dropDownAlertRef.alertWithType('error', 'Error', err.reason);
            }
        })

        switch (item.type) {
            case NotificationTypes.HOSPITAL_ADD:
                Meteor.subscribe('singleUser', item.navigateId, () => {
                    this.setState({loading: false});
                    navigator.navigate('CustProfile', {
                        Id: item.navigateId,
                        User: Meteor.collection("users").findOne({_id: item.navigateId})
                    });
                });

                break;
            case NotificationTypes.DOCTOR_ADD:
                Meteor.subscribe('singleUser', item.navigateId, () => {
                    this.setState({loading: false});
                    navigator.navigate('CustProfile', {
                        Id: item.navigateId,
                        User: Meteor.collection("users").findOne({_id: item.navigateId})
                    });
                });

                break;
            case NotificationTypes.MESSAGE_RECEIVED:
                Meteor.subscribe('chatItemsGroupByDate', item.navigateId, () => {
                    let Channel = {
                        channelId: item.navigateId,
                        user: {
                            userId: item.owner,
                            name: item.Owner.profile.name,
                            profileImage: item.Owner.profile.profileImage
                        }
                    };
                    this.setState({loading: false});
                    navigator.navigate('Message', {Channel: Channel})
                });
                break;
            case NotificationTypes.NEW_ARTICLE:
                //Meteor.subscribe('singleArticle', item.navigateId, () => {
                    this.setState({loading: false});
                    navigator.navigate('ArticleDetail', {Id: item.navigateId});
                //});

                break;
            case NotificationTypes.COMMENT_ARTICLE:
                Meteor.subscribe("articleComments", item.navigateId, () => {
                    this.setState({loading: false});
                    navigator.navigate('ArticleComment', {articleId: item.navigateId});
                });

                break;
            case NotificationTypes.LIKE_ARTICLE:
                //Meteor.subscribe("singleArticle", item.navigateId, () => {
                    this.setState({loading: false});
                    navigator.navigate('ArticleDetail', {Id: item.navigateId});
                //});
                break;
            case NotificationTypes.ARTICLE_SHARE:
                //Meteor.subscribe("singleArticle", item.navigateId, () => {
                    this.setState({loading: false});
                    navigator.navigate('ArticleDetail', {Id: item.navigateId});
                //});

                break;
            case NotificationTypes.ASK_QUESTION:
                //Meteor.subscribe('getSingleQuestion', item.navigateId,0, () => {
                    this.setState({loading: false});
                    navigator.navigate('QuestionDetail', {Id: item.navigateId});
                //});
                break;
            case NotificationTypes.COMMENT_QUESTION:
                Meteor.subscribe("questionComments", item.navigateId, () => {
                    this.setState({loading: false});
                    navigator.navigate('QuestionComment', {questionId: item.navigateId});
                });

                break;
            case NotificationTypes.ANSWER_QUESTION:
                //Meteor.subscribe("getSingleQuestion", item.navigateId,1, () => {
                    this.setState({loading: false});
                    navigator.navigate('QuestionDetail', {Id: item.navigateId});
                //});

                break;
            case NotificationTypes.LIKE_QUESTION:
                //Meteor.subscribe("questionsByVisitorUser", item.navigateId, () => {
                    this.setState({loading: false});
                    navigator.navigate('QuestionDetail', {Id: item.navigateId});
                //});

                break;
            case NotificationTypes.APPOINTMENT_BOOKED:
                //Meteor.subscribe(this.loggedUser.profile.role == 1 ? "singleAppointmentByDoctor" : "appointmentForHospital", item.navigateId, () => {
                    this.setState({loading: false});
                    navigator.navigate(item.screen, {Id: item.navigateId});
                //});
                break;
            case NotificationTypes.APPOINTMENT_APPROVED:
                //Meteor.subscribe(this.loggedUser.profile.role == 1 ? "singleAppointmentByDoctor" : "appointmentForHospital", item.navigateId, () => {
                    this.setState({loading: false});
                    navigator.navigate(item.screen, {Id: item.navigateId});
                //});
                break;
            case NotificationTypes.APPOINTMENT_DECLINED:
                //Meteor.subscribe(this.loggedUser.profile.role == 1 ? "singleAppointmentByDoctor" : "appointmentForHospital", item.navigateId, () => {
                    this.setState({loading: false});
                    navigator.navigate(item.screen, {Id: item.navigateId});
                //});
                break;
            case NotificationTypes.APPOINTMENT_CONFRIMED:
                //Meteor.subscribe(this.loggedUser.profile.role == 1 ? "singleAppointmentByDoctor" : "appointmentForHospital", item.navigateId, () => {
                    this.setState({loading: false});
                    navigator.navigate(item.screen, {Id: item.navigateId});
                //});
                break;
            case NotificationTypes.APPOINTMENT_CANCEL:
                //Meteor.subscribe(this.loggedUser.profile.role == 1 ? "singleAppointmentByDoctor" : "appointmentForHospital", item.navigateId, () => {
                    this.setState({loading: false});
                    navigator.navigate(item.screen, {Id: item.navigateId});
                //});
                break;
            case NotificationTypes.NEW_PRODUCT:
                Meteor.subscribe("singleProduct", item.navigateId, () => {
                    this.setState({loading: false});
                    navigator.navigate('ProductDetail', {Id: item.navigateId});
                });
                break;
            case NotificationTypes.CART_PRODUCT:
                Meteor.subscribe("singleProduct", item.navigateId, () => {
                    this.setState({loading: false});
                    navigator.navigate('ProductDetail', {Id: item.navigateId});
                });
                break;
            case NotificationTypes.ORDER_PRODUCT:
                Meteor.subscribe("singleProduct", item.navigateId, () => {
                    this.setState({loading: false});
                    navigator.navigate('ProductDetail', {Id: item.navigateId});
                });
                break;
            case NotificationTypes.NEW_NEWS:
                //Meteor.subscribe("singleNews", item.navigateId, () => {
                    this.setState({loading: false});
                    navigator.navigate('NewsDetail', {Id: item.navigateId});
                //});
                break;
            case NotificationTypes.LIKE_NEWS:
                //Meteor.subscribe("singleNews", item.navigateId, () => {
                    this.setState({loading: false});
                    navigator.navigate('NewsDetail', {Id: item.navigateId});
                //});
                break;
            case NotificationTypes.COMMENT_NEWS:
                //Meteor.subscribe("singleNews", item.navigateId, () => {
                    this.setState({loading: false});
                    navigator.navigate('NewsDetail', {Id: item.navigateId});
                //});
                break;
                case NotificationTypes.ORDER_DISPATCHED:
                    this.setState({loading: false});
                    navigator.navigate('OrderDetail', {Id: item.navigateId});
                break;
            case NotificationTypes.ORDER_DELIVERED:
                    this.setState({loading: false});
                    navigator.navigate('OrderDetail', {Id: item.navigateId});
                break;
            case NotificationTypes.ORDER_CANCELLED:
                    this.setState({loading: false});
                    navigator.navigate('OrderDetail', {Id: item.navigateId});
                break;
            case NotificationTypes.ACCOUNT_APPROVED:
                Meteor.subscribe('singleUser', item.navigateId, () => {
                    this.setState({loading: false});
                    navigator.navigate('Profile', {
                        Id: item.navigateId,
                        User: Meteor.collection("users").findOne({_id: item.navigateId})
                    });
                });
                break;
            case NotificationTypes.REVIEW_RATING:
                    this.setState({loading: false});
                    navigator.navigate('ProfileRating', {Id: item.navigateId});
                break;

            case NotificationTypes.FOLLOWED:
                Meteor.subscribe('singleUser', item.navigateId, () => {
                    this.setState({loading: false});
                    navigator.navigate('Profile', {
                        Id: item.navigateId,
                        User: Meteor.collection("users").findOne({_id: item.navigateId})
                    });
                });
                break;
            default :
                this.setState({loading: false});

        }
    }
    NotificationMarkAsRead = (item) => {
        Meteor.call('updateNotificationSeen', [item._id], (err) => {
            if (err) {
                console.log(err.reason);
                this.dropDownAlertRef.alertWithType('error', 'Error', err.reason);
            }
        })
    };
    _handleChat = (Id) => {
        this._getChatChannel(Id).then(channelId => {
            console.log(channelId)
            let Channel = {
                channelId: channelId,
                user: {
                    name: this.props.User.profile.name,
                    userId: Id,
                    profileImage: this.props.User.profile.profileImage
                }
            }
            this.props.navigation.navigate('Message', {Channel: Channel});
        }).catch(error => {
            console.error(error);
        });
    }
    swipeLeft = (_id, isNew) => {
        const logged = Meteor.userId();
        if (isNew) {
            this.setState(state => {
                const newNotifications = state.newNotifications.filter((item) => item._id != _id);
                return {
                    newNotifications,
                };
            });
            console.log(_id, this.state.newNotifications)
        }
        else {
            this.setState(state => {
                const earlyNotifications = state.earlyNotifications.filter((item) => item._id != _id);
                return {
                    earlyNotifications,
                };
            });
            // this.state.earlyNotifications.filter(item=>{
            //     return item._id!=_id
            // })
            console.log(_id, this.state.earlyNotifications)
        }
        Meteor.call('removeNotification', _id, (err) => {
            if (err) {
                this.dropDownAlertRef.alertWithType('error', 'Error', err.reason);
            }
        })
    };

    renderLeftActions = (progress, dragX) => {
        const trans = dragX.interpolate({
            inputRange: [0, 100,],
            outputRange: [0, 1],
        });
        return (
            <View style={{backgroundColor: colors.appBackground, flex: 1}}>
                {/*<Animated.Text*/}
                {/*style={{transform: [{ translateX: trans }]}}>*/}
                {/*removing*/}
                {/*</Animated.Text>*/}
                {/*<Text>removing</Text>*/}
            </View>
        );
    };

    _renderNew = (data) => {
        let item = data.item;
        console.log(item)
        if (item.type == NotificationTypes.MESSAGE_RECEIVED)
            item.Message = (MyFunctions.decryptData(item.description))
        return (
            <Swipeable
                renderLeftActions={this.renderLeftActions}
                onSwipeableLeftOpen={() => this.swipeLeft(item._id, true)}
                key={data.item._id}>
                {this.renderItem(item)}
            </Swipeable>
        )
    };
    _renderEarly = (data) => {
        let item = data.item;
        console.log(item)
        if (item.type == NotificationTypes.MESSAGE_RECEIVED)
            item.Message = (MyFunctions.decryptData(item.description))
        return (
            <Swipeable
                renderLeftActions={this.renderLeftActions}
                onSwipeableLeftOpen={() => this.swipeLeft(item._id, false)}
                key={data.item._id}>
                {this.renderItem(item)}
            </Swipeable>
        )
    };

    renderItem = (item) => {
        const logged = Meteor.userId();
        return (
            <TouchableOpacity onPress={() => this._notificationPressed(item)}>
                <View style={{
                    borderWidth: 1,
                    //borderColor: '#C8E3F5',
                    borderColor: item.seenBy.includes(logged) ? '#fff' : 'rgba(17,131, 131, .15)',
                    backgroundColor: '#fff',
                    marginBottom: 3,
                    borderRadius: 4,
                    paddingVertical: 15,
                    paddingLeft: 15,
                    paddingRight: 5,
                    marginHorizontal: 15,
                    flex: 1,
                    flexDirection: 'row'
                }}>
                    <Left style={{flex: 0, alignSelf: 'flex-start', paddingTop: 4}}>
                        {[NotificationTypes.ORDER_CANCELLED, NotificationTypes.ORDER_DISPATCHED, NotificationTypes.ORDER_DELIVERED, NotificationTypes.NEW_NEWS, NotificationTypes.NEW_PRODUCT, NotificationTypes.ACCOUNT_APPROVED].includes(item.type) ?
                            <Thumbnail source={require('../../images/logo.png')} small/> :

                            <Thumbnail
                                source={item.Owner.profile.profileImage ?
                                    {uri: settings.IMAGE_URL + item.Owner.profile.profileImage}
                                    : require('../../images/duser.png')}
                                small/>}
                    </Left>
                    <Body style={{flex: 3, flexDirection: 'column', alignItems: 'flex-start', paddingHorizontal: 10}}>
                    <Text style={{flex: 1, marginBottom: 3}}>
                        {[NotificationTypes.ORDER_CANCELLED, NotificationTypes.ORDER_DISPATCHED, NotificationTypes.ORDER_DELIVERED, NotificationTypes.NEW_NEWS, NotificationTypes.NEW_PRODUCT, NotificationTypes.ACCOUNT_APPROVED].includes(item.type) ?
                            null :
                            <Label style={{
                                fontSize: 14,
                                fontWeight: "bold"
                            }}>{item.Owner.profile.role === userType.DOCTOR ?
                                <Label style={{
                                    fontSize: 14,
                                    fontWeight: "bold"
                                }}>Dr. </Label> : null}{item.Owner.profile.name}</Label>}

                        {item.type == NotificationTypes.MESSAGE_RECEIVED ?
                            <Label style={{fontSize: 14}}> sent message </Label> : null}
                        {item.type == NotificationTypes.HOSPITAL_ADD ?
                            <Label style={{fontSize: 14}}> has added you in his Hospital List. </Label> : null}
                        {item.type == NotificationTypes.DOCTOR_ADD ?
                            <Label style={{fontSize: 14}}> has added you in his Doctor List. </Label> : null}
                        {item.type == NotificationTypes.COMMENT_ARTICLE ?
                            <Label style={{fontSize: 14}}> has commented on your article. </Label> : null}
                        {item.type == NotificationTypes.FOLLOWED ?
                            <Label style={{fontSize: 14}}> has followed you. </Label> : null} 
                        {item.type == NotificationTypes.LIKE_ARTICLE ?
                            <Label style={{fontSize: 14}}> has liked your article. </Label> : null}
                        {item.type == NotificationTypes.NEW_ARTICLE ?
                            <Label style={{fontSize: 14}}> has written new article. </Label> : null}
                        {item.type == NotificationTypes.ARTICLE_SHARE ?
                            <Label style={{fontSize: 14}}> has shared your article. </Label> : null}
                        {item.type == NotificationTypes.ASK_QUESTION ?
                            <Label style={{fontSize: 14}}> has asked new question. </Label> : null}
                        {item.type == NotificationTypes.ANSWER_QUESTION ?
                            <Label style={{fontSize: 14}}> has answered your question. </Label> : null}
                        {item.type == NotificationTypes.COMMENT_QUESTION ?
                            <Label style={{fontSize: 14}}> has commented on your question. </Label> : null}
                        {item.type == NotificationTypes.LIKE_QUESTION ?
                            <Label style={{fontSize: 14}}> has liked your answer. </Label> : null}
                        {item.type == NotificationTypes.APPOINTMENT_BOOKED ?
                            <Label style={{fontSize: 14}}> has booked an appointment with appointment {item.appointmentId}. </Label> : null}
                        {item.type == NotificationTypes.APPOINTMENT_APPROVED ?
                            <Label style={{fontSize: 14}}> has approved your appointment with appointment {item.appointmentId}. </Label> : null}
                        {item.type == NotificationTypes.APPOINTMENT_DECLINED ?
                            <Label style={{fontSize: 14}}> has declined your appointment with appointment {item.appointmentId}. </Label> : null}
                        {item.type == NotificationTypes.APPOINTMENT_CONFRIMED ?
                            <Label style={{fontSize: 14}}> has confirmed your appointment with appointment {item.appointmentId}. </Label> : null}
                        {item.type == NotificationTypes.APPOINTMENT_CANCEL ?
                            <Label style={{fontSize: 14}}> has cancelled your appointment with appointment {item.appointmentId}. </Label> : null}
                        {item.type == NotificationTypes.NEW_PRODUCT ?
                            <Label style={{fontSize: 14}}>Medidoc has added new products. </Label> : null}
                        {item.type == NotificationTypes.NEW_NEWS ?
                            <Label style={{fontSize: 14}}>Medidoc has added new news </Label> : null}
                        {item.type == NotificationTypes.LIKE_NEWS ?
                            <Label style={{fontSize: 14}}> has liked news. </Label> : null}
                        {item.type == NotificationTypes.COMMENT_NEWS ?
                            <Label style={{fontSize: 14}}> has commented News. </Label> : null}
                        {item.type == NotificationTypes.ORDER_DISPATCHED ?
                            <Label style={{fontSize: 14}}>Your Order has been dispatched. </Label> : null}
                        {item.type == NotificationTypes.ORDER_DELIVERED ?
                            <Label style={{fontSize: 14}}>Your Order has ben delivered </Label> : null}
                        {item.type == NotificationTypes.ORDER_CANCELLED ?
                            <Label style={{fontSize: 14}}>Your Order has ben cancelled. </Label> : null}
                        {item.type == NotificationTypes.ACCOUNT_APPROVED ?
                            <Label style={{fontSize: 14}}> has approved your account. </Label> : null}
                        {item.type == NotificationTypes.REVIEW_RATING ?
                            <Label style={{fontSize: 14}}> has reviewed you. </Label> : null}
                        {item.type == NotificationTypes.ACCOUNT_APPROVED ?
                            <Label style={{fontSize: 14}}>Your profile has been Approved by MediDoc
                                Nepal. </Label> : null}
                        {/*{item.type == NotificationTypes.MESSAGE_RECEIVED ?*/}
                        {/*item.Message.type == 'text' ?*/}
                        {/*<Text note numberOfLines={3}>{item.Message.message}</Text> :*/}
                        {/*<Icon name={'file-text'} size={15}/> :*/}
                        {/*<Text note numberOfLines={3}>{item.description}</Text>}*/}
                    </Text>
                    <Text style={{color: item.seenBy.includes(logged) ? colors.gray_200 : colors.primaryText, fontSize: 13}}>{Moment(item.createdAt).fromNow()}</Text>
                    </Body>
                    <Right style={{flex: 0}}>
                        {/*<TouchableOpacity*/}
                            {/*style={{width: 38, height: 38, justifyContent: 'center', alignItems: 'center'}}*/}
                            {/*onPress={() => {*/}
                            {/*}}>*/}
                            {/*<Menu*/}
                                {/*ref={ref => (this[`menu${item._id}`] = ref)}*/}
                                {/*button={*/}
                                    {/*<Button transparent onPress={() => this[`menu${item._id}`].show()}>*/}
                                        {/*<Icon name={'more-vertical'} size={18} color={variables.gray_200}/>*/}
                                    {/*</Button>}>*/}
                                {/*<MenuItem onPress={() => {*/}
                                    {/*this[`menu${item._id}`].hide(), this.NotificationMarkAsRead(item)*/}
                                {/*}}>Mark as read</MenuItem>*/}
                            {/*</Menu>*/}
                        {/*</TouchableOpacity>*/}
                    </Right>
                </View>
            </TouchableOpacity>
        )
    };
    _handleEndReach = (data) => {
        console.log(data)
        Meteor.subscribe('notificationWithLimit', this.skip);
        this.skip = this.skip + 20;
    }

    constructor(props) {
        super(props);
        this.mounted = false;
        this.skip = 0;
        this.viewabilityConfig = {
            minimumViewTime: 100,
            viewAreaCoveragePercentThreshold: 50
        };
        this.state = {
            newNotifications: Meteor.collection('notificationDetail').find({seenBy: {$nin: [Meteor.userId()]}}),
            earlyNotifications: Meteor.collection('notificationDetail').find({seenBy: Meteor.userId()}),
            loading: false
        }
        this.loggedUser = Meteor.user();
        this.subHandle = null;
    }

    componentDidMount() {
        this.subHandle = Meteor.subscribe("notificationWithLimit");
        this.skip = this.skip + 20;
        this.setState({
            newNotifications: this.props.newNotifications,
            earlyNotifications: this.props.earlyNotifications
        })
        this._notificationPressed = this._notificationPressed.bind(this);
    }

    componentWillUnmount() {
        if (this.subHandle)
            this.subHandle.stop();
        this.mounted = false;
    }

    componentWillReceiveProps(newProps) {
        if (newProps.newNotifications) {
            this.setState({
                newNotifications: newProps.newNotifications
            })
        }
        if (this.props.earlyNotifications !== newProps.earlyNotifications) {
            this.setState({
                earlyNotifications: newProps.earlyNotifications
            })
        }
    }

    _onViewChange = (info) => {
        const loggedUser = Meteor.userId();
        let notificationsToUpdate = [];
        //   console.log(info);
        let viewableItems = info.viewableItems;
        viewableItems.forEach(viewableItem => {
            if (viewableItem.isViewable) {
                if (!viewableItem.item.seenBy.includes(loggedUser))
                    notificationsToUpdate.push(viewableItem.item._id)
            }
        })
        // console.log(notificationsToUpdate)
        if (notificationsToUpdate.length > 0) {
            Meteor.call('updateNotificationSeen', notificationsToUpdate, (err) => {
                if (err) {
                    console.log(err.reason)
                }
            })
        }
    }

    render() {


        return (
            <Container>
                <Header androidStatusBarColor={colors.statusBar} searchBar rounded
                        style={{backgroundColor: colors.appLayout}}>
                    <Left>
                        <Button onPress={() => goBack(this.props.componentId)
                        } transparent>
                            <Icon name='arrow-left' color='white' size={24}/>
                        </Button>
                    </Left>
                    <Body>
                        <Title>Notification</Title>
                    </Body>
                    <Right/>
                    {/*<Right>*/}
                    {/*<Button onPress={() => {*/}
                    {/*this.setSearch()*/}
                    {/*}} transparent>*/}
                    {/*<Icon name='check-square' color='white' size={24}/>*/}
                    {/*</Button>*/}
                    {/*</Right>*/}
                </Header>
                <Content style={styles.content}>
                    {this.state.newNotifications.length > 0 ?
                        <Text style={{paddingHorizontal: 15, paddingTop: 15, paddingBottom: 7}}>New</Text> : null}
                    <FlatList
                        data={this.state.newNotifications}
                        renderItem={this._renderNew}
                        keyExtracter={(item) => item._id}
                        onEndReached={this._handleEndReach}
                        onEndReachedThreshold={0.5}
                        keyboardShouldPersistTaps='always'
                        // onViewableItemsChanged={this._onViewChange}
                        // viewabilityConfig={this.viewabilityConfig}
                    />
                    {this.state.earlyNotifications.length > 0 ?
                        <Text style={{paddingHorizontal: 15, paddingTop: 15, paddingBottom: 7}}>Earlier</Text> : null}
                    <FlatList
                        data={this.state.earlyNotifications}
                        renderItem={this._renderEarly}
                        keyExtracter={(item) => item._id}
                        onEndReached={this._handleEndReach}
                        onEndReachedThreshold={0.5}
                        keyboardShouldPersistTaps='always'
                        // onViewableItemsChanged={this._onViewChange}
                        // viewabilityConfig={this.viewabilityConfig}
                    />

                </Content>
                {this.state.loading ?
                    <Loading/> : null
                }
                {/*<DropdownAlert ref={ref => this.dropDownAlertRef = ref}/>*/}
            </Container>
        );
    };
}


const styles = StyleSheet.create({
    content: {
        backgroundColor: colors.appBackground,
        flex: 1
    }
});

export default Meteor.withTracker(() => {
    const logged = Meteor.userId();
    return {
        newNotifications: Meteor.collection('notificationDetail').find({seenBy: {$nin: [logged]}}),
        earlyNotifications: Meteor.collection('notificationDetail').find({seenBy: logged}),
    }

})(Notification);


Notification.defaultProps = {
    notifications: []
}