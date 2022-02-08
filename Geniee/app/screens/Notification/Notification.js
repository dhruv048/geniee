import React, { Component } from 'react';
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
import { colors, variables } from "../../config/styles";
import settings, { NotificationTypes, userType, getProfileImage, ProductOwner } from "../../config/settings";
import Meteor from '../../react-native-meteor';
import MyFunctions from "../../lib/MyFunctions";
import Moment from 'moment';
import Swipeable from "react-native-gesture-handler/Swipeable";
// import DropdownAlert from 'react-native-dropdownalert';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import Loading from "../../components/Loading/Loading";
import { goBack, goToRoute } from '../../Navigation';
import DeviceInfo from "react-native-device-info";
import { Image } from 'react-native';
import { Button as RNPButton } from 'react-native-paper';
import { customPaperTheme } from '../../config/themes';


class Notification extends Component {

    constructor(props) {
        super(props);
        this.mounted = false;
        this.skip = 0;
        this.viewabilityConfig = {
            minimumViewTime: 100,
            viewAreaCoveragePercentThreshold: 50
        };
        this.state = {
            newNotifications: Meteor.collection('notificationDetail').find({ seenBy: { $nin: [Meteor.userId()] } }),
            earlyNotifications: Meteor.collection('notificationDetail').find({ seenBy: Meteor.userId() }),
            notifications: Meteor.collection('notificationDetail').find(),
            loading: false
        }
        this.loggedUser = Meteor.user();
        this.subHandle = null;
        this.loadMore = false;
    }

    componentDidMount() {
        const deviceId = DeviceInfo.getUniqueId();
        this.subHandle = Meteor.subscribe("notificationWithLimit", 0, deviceId);
        this.skip = this.skip + 20;
        this.setState({
            newNotifications: this.props.newNotifications,
            earlyNotifications: this.props.earlyNotifications,
            notifications: this.props.notifications
        })
        this._notificationPressed = this._notificationPressed.bind(this);
    }

    componentWillUnmount() {
        if (this.subHandle)
            this.subHandle.stop();
        this.mounted = false;
    }

    componentWillReceiveProps(newProps) {
        if (newProps.notifications.length != this.props.notifications.length) {
            this.setState({
                notifications: newProps.notifications
            })
        }

    }

    _notificationPressed = (item) => {
        console.log('press', item);
        const deviceId = DeviceInfo.getUniqueId();
        Meteor.call('updateNotificationSeen', [item._id], deviceId, (err) => {
            if (err) {
                console.log(err.reason);
                // this.dropDownAlertRef.alertWithType('error', 'Error', err.reason);
            }
        })

        switch (item.type) {

            case NotificationTypes.ADD_PRODUCT:
                if (item.productOwner == ProductOwner.EAT_FIT)
                    this.props.navigation.navigate("ProductDetailEF", { Id: item.navigateId });
                else
                    this.props.navigation.navigate("ProductDetail", { Id: item.navigateId });
                break;
            case NotificationTypes.ADD_SERVICE:
                this.props.navigation.navigate("ServiceDetail", { Id: item.navigateId });
                break;
            case NotificationTypes.RATE_SERVICE:
                this.props.navigation.navigate("ServiceRatings", { Id: item.navigateId });
                break;
            case NotificationTypes.ORDER_DECLINED:
                this.props.navigation.navigate("OrderDetailOut", { Id: item.navigateId });
                break;
            case NotificationTypes.ORDER_CANCELLED:
                this.props.navigation.navigate("OrderDetailIn", { Id: item.navigateId });
                break;
            case NotificationTypes.ORDER_DISPATCHED:
                this.props.navigation.navigate("OrderDetailOut", { Id: item.navigateId });
                break;
            case NotificationTypes.ORDER_DELIVERED:
                this.props.navigation.navigate("OrderDetailOut", { Id: item.navigateId });
                break;
            case NotificationTypes.ORDER_REQUESTED:
                this.props.navigation.navigate("OrderDetailIn", { Id: item.navigateId });
                break;
        }
    }
    NotificationMarkAsRead = (item) => {
        const deviceId = DeviceInfo.getUniqueId();
        Meteor.call('updateNotificationSeen', deviceId, [item._id], (err) => {
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
            this.props.navigation.navigate('Message', { Channel: Channel });
        }).catch(error => {
            console.error(error);
        });
    }
    swipeLeft = (_id, isNew) => {
        if (isNew) {
            this.setState(state => {
                const notifications = state.notifications.filter((item) => item._id != _id);
                return {
                    notifications,
                };
            });
            //  console.log(_id, this.state.newNotifications)
        }
        else {
            this.setState(state => {
                const earlyNotifications = state.earlyNotifications.filter((item) => item._id != _id);
                return {
                    earlyNotifications,
                };
            });
        }
        Meteor.call('removeNotification', _id, (err) => {
            if (err) {
                //  this.dropDownAlertRef.alertWithType('error', 'Error', err.reason);
            }
        })
    };

    renderLeftActions = (progress, dragX) => {
        const trans = dragX.interpolate({
            inputRange: [0, 100,],
            outputRange: [0, 1],
        });
        return (
            <View style={{ backgroundColor: colors.appBackground, flex: 1 }}>
                {/*<Animated.Text*/}
                {/*style={{transform: [{ translateX: trans }]}}>*/}
                {/*removing*/}
                {/*</Animated.Text>*/}
                {/*<Text>removing</Text>*/}
            </View>
        );
    };

    _renderNotification = (data) => {
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
        // console.log(item)
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

    handleNotificationPressed = (item) => {
        this.NotificationMarkAsRead(item);
        this._notificationPressed(item);
    }
    renderItem = (data) => {
        let item = data;
        const logged = this.loggedUser ? this.loggedUser._id : Meteor._userIdSaved;
        if (item.owner == logged)
            return true;
        const deviceId = DeviceInfo.getUniqueId();
        let seen = false;
        if (item.seenBy.includes(logged) || item.seenBy.includes(deviceId))
            seen = true;
        return (
            <View style={{ flex: 1, padding: 10, backgroundColor: seen ? customPaperTheme.GenieeColor.lightDarkColor : '' }}>
                <View style={{ flexDirection: 'row', }}>
                    {/* Image Section */}
                    <Image
                        style={styles.notificationImage}
                        source={
                            item.Owner.profile.profileImage
                                ? { uri: settings.IMAGE_URLS + item.Owner.profile.profileImage } : require('../../images/user-icon.png')
                        } />
                    {/* Content Section */}
                    <View style={{ marginLeft: 10, flex: 1 }}>
                        <Text numberOfLines={2} style={styles.headerText}>{item.title}</Text>
                        <Text numberOfLines={2} style={styles.subHeaderText}>{item.description}</Text>
                    </View>
                </View>
                {/* button section */}
                {item.type === 0 || item.type === 11 ?
                    <RNPButton
                        mode='contained'
                        uppercase={false}
                        style={styles.buttonStyle}
                        onPress={() => { this.handleNotificationPressed(item) }}
                    >
                        {item.type === 0 ? <Text>TrackOrder</Text> : <Text>Review</Text>}
                    </RNPButton> :
                    null
                }
            </View>
        );
    }

    // renderItem = (item) => {
    //     const logged = this.loggedUser ? this.loggedUser._id : Meteor._userIdSaved;
    //     if (item.owner == logged)
    //         return true;
    //     const deviceId = DeviceInfo.getUniqueId();
    //     let seen = false;
    //     if (item.seenBy.includes(logged) || item.seenBy.includes(deviceId))
    //         seen = true;

    //     return (
    //         <TouchableOpacity onPress={() => this._notificationPressed(item)}>
    //             <View style={{
    //                 borderWidth: 1,
    //                 //borderColor: '#C8E3F5',
    //                 borderColor: seen ? '#fff' : 'rgba(17,131, 131, .15)',
    //                 backgroundColor: '#fff',
    //                 marginBottom: 3,
    //                 borderRadius: 4,
    //                 paddingVertical: 15,
    //                 paddingLeft: 15,
    //                 paddingRight: 5,
    //                 marginHorizontal: 15,
    //                 flex: 1,
    //                 flexDirection: 'row'
    //             }}>
    //                 <Left style={{flex: 0, alignSelf: 'flex-start', paddingTop: 4}}>
    //                     {[].includes(item.type) ?
    //                         <Thumbnail medium square style={{borderRadius: 5}}
    //                                    source={require('../../images/logo.png')}/> :

    //                         <Thumbnail square medium style={{borderRadius: 5}}
    //                                    source={item.Owner.profile.profileImage ?
    //                                        {uri: getProfileImage(item.Owner.profile.profileImage)}
    //                                        : require('../../images/user-icon.png')}
    //                         />}
    //                 </Left>
    //                 <Body style={{flex: 3, flexDirection: 'column', alignItems: 'flex-start', paddingHorizontal: 10}}>
    //                 <Text style={{flex: 1, marginBottom: 3}}>
    //                     <Label style={{
    //                         fontSize: 14,
    //                         fontWeight: "bold"
    //                     }}>{[].includes(item.type) ? "Geniee" : item.Owner.profile.name}</Label>

    //                     {item.type == NotificationTypes.ADD_SERVICE ?
    //                         <Label style={{fontSize: 14}}> has started new service
    //                             '{item.description}'. </Label> : null}
    //                     {item.type == NotificationTypes.ADD_PRODUCT ?
    //                         <Label style={{fontSize: 14}}> has added new product '{item.description}'. </Label> : null}
    //                     {item.type == NotificationTypes.RATE_SERVICE ?
    //                         <Label style={{fontSize: 14}}> has rated service '{item.description}'. </Label> : null}
    //                     {item.type == 3 ?
    //                         <Label style={{fontSize: 14}}> has written new article. </Label> : null}
    //                     {item.type == 21 ?
    //                         <Label style={{fontSize: 14}}> has added new products. </Label> : null}
    //                     {item.type == 22 ?
    //                         <Label style={{fontSize: 14}}> has added new news </Label> : null}
    //                     {item.type == NotificationTypes.ORDER_DISPATCHED ?
    //                         <Label style={{fontSize: 14}}> has dispatched your order. </Label> : null}
    //                     {item.type == NotificationTypes.ORDER_DELIVERED ?
    //                         <Label style={{fontSize: 14}}> has delivered your order. </Label> : null}
    //                     {item.type == NotificationTypes.ORDER_CANCELLED ?
    //                         <Label style={{fontSize: 14}}> has cancelled the order. </Label> : null}
    //                     {item.type == NotificationTypes.ORDER_DECLINED ?
    //                         <Label style={{fontSize: 14}}> has declined your order. </Label> : null}
    //                     {item.type == NotificationTypes.ORDER_REQUESTED ?
    //                         <Label style={{fontSize: 14}}> has placed new order </Label> : null}
    //                 </Text>
    //                 <Text style={{
    //                     color: seen ? colors.gray_200 : colors.primaryText,
    //                     fontSize: 13
    //                 }}>{Moment(item.createdAt).format('DD-MMM-YYYY hh:mm a')}</Text>
    //                 </Body>
    //                 <Right style={{flex: 0}}>
    //                     <TouchableOpacity
    //                         style={{width: 38, height: 38, justifyContent: 'center', alignItems: 'center'}}>
    //                         <Menu ref={ref => (this[`menu${item._id}`] = ref)}
    //                               button={
    //                                   <Button transparent onPress={() => this[`menu${item._id}`].show()} style={{marginBottom:50}}>
    //                                       <Icon name={'more-vertical'} size={30} color={variables.gray_200}/>
    //                                   </Button>}>
    //                             <MenuItem onPress={() => {
    //                                 this[`menu${item._id}`].hide(), this.NotificationMarkAsRead(item)
    //                             }}> Mark as read</MenuItem>
    //                             <MenuItem onPress={() => {
    //                                 this[`menu${item._id}`].hide(), this.swipeLeft(item._id)
    //                             }}> Remove</MenuItem>
    //                         </Menu>
    //                     </TouchableOpacity>
    //                 </Right>
    //             </View>
    //         </TouchableOpacity>
    //     )
    // };
    _handleEndReach = (data) => {
        if (!this.loadMore) {
            this.loadMore = true;
            // console.log(data)
            Meteor.subscribe('notificationWithLimit', this.skip, () => {
                this.skip = this.skip + 20;
                this.loadMore = false;
            });
        }
    }


    clearAll = () => {
        console.log("clearAll")
        const deviceId = DeviceInfo.getUniqueId();
        Meteor.call('removeAllNotification', deviceId, (err, res) => {
            console.log(err, res)
        });
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
                <Content style={styles.content}>
                    <FlatList
                        data={this.state.notifications}
                        renderItem={this._renderNotification}
                        keyExtracter={(item) => item._id}
                        onEndReached={this._handleEndReach}
                        onEndReachedThreshold={0.5}
                        keyboardShouldPersistTaps='always'
                    // onViewableItemsChanged={this._onViewChange}
                    // viewabilityConfig={this.viewabilityConfig}
                    />

                </Content>
                {this.state.loading ?
                    <Loading /> : null
                }
                {/*<DropdownAlert ref={ref => this.dropDownAlertRef = ref}/>*/}
            </Container>
        );
    };
}


const styles = StyleSheet.create({
    content: {
        backgroundColor: colors.appBackground,
        flex: 1,
        paddingTop: 10
    },
    notificationImage: {
        height: 60,
        width: 60,
        resizeMode: 'cover',
        borderRadius: 4,
        marginBottom: 8,
    },
    headerText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: customPaperTheme.GenieeColor.darkColor
    },
    subHeaderText: {
        fontSize: 14,
        color: customPaperTheme.GenieeColor.lightTextColor
    },
    buttonStyle: {
        width: '40%',
        height: 36,
        marginLeft: '20%',
        backgroundColor: customPaperTheme.GenieeColor.primaryColor,
        color: 'white'
    }
});

export default Meteor.withTracker(() => {
    const logged = Meteor.userId();
    return {
        newNotifications: Meteor.collection('notificationDetail').find({ seenBy: { $nin: [logged] } }),
        earlyNotifications: Meteor.collection('notificationDetail').find({ seenBy: logged }),
        notifications: Meteor.collection('notificationDetail').find(),
    }

})(Notification);


Notification.defaultProps = {
    notifications: []
}