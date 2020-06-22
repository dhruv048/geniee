import React, {PureComponent} from 'react';
import {Image} from 'react-native';
import {List, Avatar} from 'react-native-paper';
import StarRating from "../StarRating/StarRating";
import {customGalioTheme} from "../../config/themes";
import {getProfileImage} from "../../config/settings";


export default class ChatListItem extends PureComponent {


    render() {
        const {chatChannel} = this.props;
        return (
            <List.Item
                style={{backgroundColor:customGalioTheme.COLORS.WHITE}}
                title={chatChannel.user.profile.name}
                description={() => <StarRating
                    starRate={2}
                />}

                left={() => <Image style={{borderRadius: 5, width: 55, height: 55}} source={
                    chatChannel.user.profile.profileImage
                        ? {uri: getProfileImage(chatChannel.user.profile.profileImage)}
                        : require('../../images/user-icon.png')
                }/>}
            />
        )
    }

}