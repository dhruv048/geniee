import React, { Component, useEffect, useMemo, useState } from 'react';
import {
  Header,
  Text,
  Container,
  Content,
  Left,
  Body,
  View,
} from 'native-base';

import {
  StyleSheet,
  FlatList,
  BackHandler,
} from 'react-native';

import { colors } from '../../config/styles';
import Meteor from '../../react-native-meteor';
import Moment from 'moment/moment';
import CogMenu from '../../components/CogMenu';
import ChatListItem from '../../components/Chat/ChatListItem';
import FooterTabs from '../../components/FooterTab';
import { customPaperTheme } from '../../config/themes';

const ChatList = (props) => {

  const [chatList, setChatList] = useState([]);

  useMemo((props) => {
    setChatList([]);
    let sorteData = props.chatChannels.sort((a, b) => {
      if (
        !a.hasOwnProperty('latestMessage') ||
        !a.latestMessage.hasOwnProperty('messageOn')
      ) {
        if (
          !b.hasOwnProperty('latestMessage') ||
          !b.latestMessage.hasOwnProperty('messageOn')
        )
          return 0;
        else return 1;
      } else if (
        !b.hasOwnProperty('latestMessage') ||
        !b.latestMessage.hasOwnProperty('messageOn')
      ) {
        return 0;
      } else if (
        Moment(a.latestMessage.messageOn).isBefore(
          Moment(b.latestMessage.messageOn),
        )
      ) {
        return 1;
      } else if (
        Moment(a.latestMessage.messageOn).isAfter(
          Moment(b.latestMessage.messageOn),
        )
      ) {
        return -1;
      } else {
        return 0;
      }
    });
    // console.log('received new props..', newProps.chatChannels)
    // console.log('sortedData', sorteData);
    setChatList(sorteData);
  }, [props]);

  useEffect(() => {
    setChatList(props.chatChannels);
  })

  const _handlePress = (channel) => {
    let Channel = {
      channelId: channel._id,
      user: {
        userId: channel.user._id,
        name: channel.user.profile.name || '',
        profileImage: channel.user.profile.profileImage || '',
      },
      service: channel.service,
    };
    props.navigation.navigate('Message', { Channel: Channel });
  };

  _renderList = data => {
    const logged = Meteor.userId();
    let item = data.item;
    //console.log(item);
    item.Message = item.latestMessage ? item.latestMessage.messageData : null;
    item.user = item.Users.find(item => item._id !== logged);

    return (
      <ChatListItem chatChannel={item} componentId={props.componentId} />
    );
  };

  return (
    <Container>
      <View style={{ marginVertical: customPaperTheme.headerMarginVertical }}>
        <Header androidStatusBarColor={colors.statusBar} searchBar rounded style={{ backgroundColor: colors.statusBar }}>
          <Left>
            <CogMenu componentId={props.componentId} />
          </Left>
          <Body>
            <Text style={{ color: 'white' }}>Messages</Text>
          </Body>
        </Header>
      </View>
      <Content style={styles.content}>
        <FlatList
          data={chatList}
          renderItem={_renderList}
          keyExtractor={item => item._id}
        />
      </Content>
      {/* <FooterTabs route={'Chat'} componentId={this.props.componentId}/> */}
    </Container>
  );
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: colors.appBackground,
    flex: 1,
    padding: 10
  },
  serviceList: {
    //backgroundColor: colors.inputBackground,
    backgroundColor: '#4d94ff0a',
    //marginVertical: 5,
    //marginHorizontal: '2%',
    borderRadius: 0,
    borderBottomColor: '#4d94ff',
    borderBottomWidth: 5,
    paddingVertical: 10,
  },
});

//export default ChatList;

export default Meteor.withTracker(() => {
  return {
    chatChannels: Meteor.collection('chatChannels').find(),
  };
})(ChatList);