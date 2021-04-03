import React, {PureComponent} from 'react';
import {Image, View, Text} from 'react-native';
import {List, Avatar, Paragraph, Badge, Caption} from 'react-native-paper';
import StarRating from '../StarRating/StarRating';
import {customGalioTheme} from '../../config/themes';
import {getProfileImage} from '../../config/settings';
import Icon from 'react-native-vector-icons/Feather';
import Meteor from '../../react-native-meteor';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Moment from 'moment/moment';
import {goToRoute} from "../../Navigation";

export default class ChatListItem extends PureComponent {


    _handlePress = channel => {
        let Channel = {
            channelId: channel._id,
            user: {
                userId: channel.user._id,
                name: channel.user.profile.name || '',
                profileImage: channel.user.profile.profileImage || '',
            },
            service: channel.service,
        };
        this.props.navigation.navigate( 'Message', {Channel: Channel});
    };

    render() {
        const {chatChannel} = this.props;
        console.log(chatChannel);
        const time = chatChannel.hasOwnProperty('latestMessage')
            ? Moment(chatChannel.latestMessage.messageOn)
                .local()
                .fromNow()
            : '';
        console.log(time);
        return (
            <List.Item onPress={() => {
                this._handlePress(chatChannel)}}
                style = {{
                    backgroundColor: customGalioTheme.COLORS.WHITE, padding:10, marginBottom:8,
                    borderRadius: 4,
                }}

                title = {chatChannel.user.profile.name}
                description = {()=>(
                    <View style={{}}>
                        {chatChannel.Message && chatChannel.Message.type == 'text' ? (
                            <Paragraph>{chatChannel.Message.message}</Paragraph>
                        ) : (
                            (chatChannel.Message && chatChannel.Message.type.includes('image')) ?
                                <Image name={'file'} style={{height: 25, width: 25}}
                                       source={require("../../images/no-image.png")}/> :
                                <Icon name={'file'} size={25}/>
                        )}
                    </View>
                )}
                left = {()=>(
                    <View style={{paddingHorizontal: 10}}>
                        <Image
                            style={{borderRadius: 5, width: 55, height: 55}}
                            source={
                                chatChannel.user.profile.profileImage
                                    ? {uri: getProfileImage(chatChannel.user.profile.profileImage)} : require('../../images/user-icon.png')
                            }/>
                    </View>
                )}
                right = {()=>(
                    <View style={{flexDirection: 'column', alignSelf: 'flex-end', alignItems: 'center'}}>
                        {chatChannel.hasOwnProperty('latestMessage') &&
                        chatChannel.latestMessage.from != Meteor.userId() && chatChannel.unreadMessagesCount > 0 ? (
                                    <Badge
                                        style={{backgroundColor: customGalioTheme.COLORS.PRIMARY, alignSelf: 'center'}}>
                                        {chatChannel.unreadMessagesCount}
                                    </Badge>
                        ) : null}

                        {chatChannel.hasOwnProperty('latestMessage') &&
                        chatChannel.latestMessage.from == Meteor.userId() ? (
                            // <Text style={{alignSelf: 'flex-end'}} note>{Moment(item.latestMessage.messageOn).local().format('hh:mm A')}</Text>
                            <View style={{marginTop: 10}}>
                                {chatChannel.latestMessage.seen ? (
                                    <MaterialIcon
                                        name={'done-all'}
                                        size={13}
                                        style={{
                                            color: customGalioTheme.COLORS.PRIMARY,
                                            marginHorizontal: 5,
                                            alignSelf: 'center',
                                        }}
                                    />
                                ) : (
                                    <MaterialIcon
                                        name={'done'}
                                        size={13}
                                        style={{
                                            color: '#8E8E8E',
                                            marginHorizontal: 5,
                                            alignSelf: 'center',
                                        }}
                                    />
                                )}
                            </View>
                        ) : null}
                        <Caption style={{alignSelf: 'center'}}>{time}</Caption>
                    </View>
                )}
                />
            );
            }
            }