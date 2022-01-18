import React, { Component } from 'react';
import {
  Header,
  Text,
  Container,
  Content,
  Left,
  Body,
  View,
} from 'native-base';
import { Image } from 'react-native';
import {
  StyleSheet,
  FlatList,
  BackHandler,
  SafeAreaView,
} from 'react-native';

import { colors } from '../../config/styles';
import Meteor from '../../react-native-meteor';
import Moment from 'moment/moment';
import CogMenu from '../../components/CogMenu';
import ChatListItem from '../../components/Chat/ChatListItem';
import FooterTabs from '../../components/FooterTab';
import { customPaperTheme } from '../../config/themes';
import { Button as RNPButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';
import settings from '../../config/settings';

class ChatList extends Component {

  constructor(props) {
    super(props);
    this._handlePress = this._handlePress.bind(this);
    this.state = {
      chatList: [],
      messageButtonActive: true,
      notificationButtonActive: false,
      announcementButtonActive: false,
    };
    this.isDisplaying = false;
    this.announceList = [
      {
        id: 'TeRpT6iAyyS72grS7',
        title: 'Price dropped of the item in your wishlist',
        image: '1638339925668.jpeg',
        description: 'This is the description of your item in wishlist.',
        isOrder: false,
        isReview: false,
        owner: 'YSdhXJ2cdKL57XbeS'
      },
      {
        id: 'qwr124',
        title: 'Price dropped of the item in your wishlist',
        image: '1638339925668.jpeg',
        description: 'This is the description of your item in wishlist.',
        isOrder: true,
        isReview: false,
        owner: 'YSdhXJ2cdKL57XbeS'
      },
      {
        id: 'qwr125',
        title: 'Price dropped of the item in your wishlist',
        image: '1638339925668.jpeg',
        description: 'This is the description of your item in wishlist.',
        isOrder: false,
        isReview: true,
        owner: 'YSdhXJ2cdKL57XbeS'
      },
    ]
  }

  componentDidMount() {
    this.setState({ chatList: this.props.chatChannels });
  }

  handleBackButtonChat() {
    console.log('handlebackpressChatList');
    this.props.navigation.navigate('Home');
    return true;
  }

  componentDidAppear() {
    console.log('chalList Dsplayed');
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonChat.bind(this),
    );
    this.isDisplaying = true;
  }

  componentDidDisappear() {
    console.log('chalList not displaying');
    this.isDisplaying = false;
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonChat.bind(this),
    );
  }

  componentWillReceiveProps(newProps) {
    this.setState({ chatList: [] });
    let sorteData = newProps.chatChannels.sort((a, b) => {
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
    this.setState({ chatList: sorteData });
  }

  handleMessageButton = () => {
    this.setState({ messageButtonActive: true, notificationButtonActive: false, announcementButtonActive: false });
  }

  handleNotificationButton = () => {
    this.setState({ messageButtonActive: false, notificationButtonActive: true, announcementButtonActive: false });
  }

  handleAnnouncementButton = () => {
    this.setState({ messageButtonActive: false, notificationButtonActive: false, announcementButtonActive: true });
  }

  _handlePress = channel => {
    let Channel = {
      channelId: channel._id,
      user: {
        userId: channel.user._id,
        name: channel.user.profile.firstName || '',
        profileImage: channel.user.profile.profileImage || '',
      },
      business: channel.business,
    };
    this.props.navigation.navigate('Message', { Channel: Channel });
  };

  handleTrackOrder = () => {

  }

  handleReview = () => {

  }

  handleViewStore = () => {

  }

  _renderList = (data) => {
    const logged = Meteor.userId();
    let item = data.item;
    //console.log(item);
    item.Message = item.latestMessage ? item.latestMessage.messageData : null;
    item.user = item.Users.find(item => item._id !== logged);

    return (
      <ChatListItem chatChannel={item} componentId={this.props.componentId} navigation={this.props.navigation} />
    );
  };

  renderNotification = (data) => {
    let item = data.item;
    return (
      <View style={{ flex: 1, padding: 10 }}>
        <View style={{ flexDirection: 'row' }}>
          {/* Image Section */}
          <Image
            style={styles.notificationImage}
            source={
              item.image
                ? { uri: settings.IMAGE_URLS + item.image } : require('../../images/user-icon.png')
            } />
          {/* Content Section */}
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text numberOfLines={2} style={styles.headerText}>{item.title}</Text>
            <Text numberOfLines={2} style={styles.subHeaderText}>{item.description}</Text>
          </View>
        </View>
        {/* button section */}
        {item.isOrder ?
          <RNPButton
            mode='contained'
            uppercase={false}
            style={styles.buttonStyle}
            onPress={() => this.handleTrackOrder()}
          >
            <Text>TrackOrder</Text>
          </RNPButton>
          : item.isReview ?
            <RNPButton
              mode='contained'
              uppercase={false}
              style={styles.buttonStyle}
              onPress={() => this.handleReview()}
            >
              <Text>Review</Text>
            </RNPButton> : null}
      </View>
    );
  }

  renderAnnouncment = (data) => {
    let item = data.item;
    return (
      <View style={{ flex: 1, padding: 10 }}>
        {/* Image Section */}
        <Image
          style={{ height: 80, width: '100%', resizeMode: 'stretch' }}
          source={
            item.image
              ? { uri: settings.IMAGE_URLS + item.image } : require('../../images/user-icon.png')
          } />
        {/* Content Section */}
        <View style={{ marginLeft: 10, flex: 1, marginVertical:10 }}>
          <Text numberOfLines={2} style={[styles.headerText]}>{item.title}</Text>
        </View>
        {/* button section */}
        <RNPButton
          mode='contained'
          uppercase={false}
          style={{width:'40%', height:36, backgroundColor:customPaperTheme.GenieeColor.primaryColor}}
          onPress={() => this.handleViewStore()}
        >
          <Text>ViewStore</Text>
        </RNPButton>
      </View>
    );
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }} keyboardShouldPersistTaps='always'>
        <Header
          androidStatusBarColor={colors.statusBar}
          style={{ backgroundColor: colors.statusBar, marginTop: customPaperTheme.headerMarginVertical }}
        >
          <RNPButton
            transparent
            uppercase={false}
            style={{ width: '100%', alignItems: 'flex-start' }}
            onPress={() => {
              navigation.goBack();
            }}>
            <Icon style={{ color: '#ffffff', fontSize: 20 }} name="arrow-left" />
            <Text style={{ color: colors.whiteText, fontSize: 20 }}>Inbox</Text>
          </RNPButton>
        </Header>
        <Content style={styles.content}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <View>
              <RNPButton mode='text'
                uppercase={false}
                onPress={() => this.handleMessageButton()}
                style={this.state.messageButtonActive ? styles.activeButton : ''}
              >
                <Text style={this.state.messageButtonActive ? styles.activeText : ''}>Message</Text>
              </RNPButton>
            </View>
            <View>
              <RNPButton
                mode='text'
                uppercase={false}
                onPress={() => this.handleNotificationButton()}
                style={this.state.notificationButtonActive ? styles.activeButton : ''}
              >
                <Text style={this.state.notificationButtonActive ? styles.activeText : ''}>Notification</Text>
              </RNPButton>
            </View>
            <View>
              <RNPButton
                mode='text'
                uppercase={false}
                onPress={() => this.handleAnnouncementButton()}
                style={this.state.announcementButtonActive ? styles.activeButton : ''}
              >
                <Text style={this.state.announcementButtonActive ? styles.activeText : ''}>Announcement</Text>
              </RNPButton>
            </View>
          </View>
          {this.state.messageButtonActive ?
            <View style={{ flex: 1, paddingVertical: 10 }}>
              <FlatList
                data={this.state.chatList}
                renderItem={this._renderList}
                keyExtractor={item => item._id}
              />
            </View>
            : this.state.notificationButtonActive ?
              <View style={{ flex: 1, paddingVertical: 10 }}>
                <FlatList
                  data={this.announceList}
                  renderItem={this.renderNotification}
                  keyExtractor={item => item._id}
                />
              </View>
              : <View style={{ flex: 1, paddingVertical: 10 }}>
                <FlatList
                  data={this.announceList}
                  renderItem={this.renderAnnouncment}
                  keyExtractor={item => item._id}
                />
              </View>
          }
        </Content>
        {/* <FooterTabs route={'Chat'} componentId={this.props.componentId}/> */}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: colors.appBackground,
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10
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
  activeButton: {
    borderBottomWidth: 1,
    borderColor: '#3DA9FC',
  },
  activeText: {
    color: '#3DA9FC',
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
    backgroundColor: customPaperTheme.GenieeColor.primaryColor
  }
});

export default Meteor.withTracker(() => {
  return {
    chatChannels: Meteor.collection('chatChannels').find(),
  };
})(ChatList);