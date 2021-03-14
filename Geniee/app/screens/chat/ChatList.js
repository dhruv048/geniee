import React, {Component} from 'react';
import {
  Header,
  Text,
  Container,
  Content,
      Left,
  Body,
} from 'native-base';

import {
  StyleSheet,
      FlatList,
  BackHandler,
  } from 'react-native';

import {colors} from '../../config/styles';
import Meteor from '../../react-native-meteor';
import Moment from 'moment/moment';
import {Navigation} from 'react-native-navigation/lib/dist/index';
import CogMenu from '../../components/CogMenu';
import ChatListItem from '../../components/Chat/ChatListItem';
import {
  backToRoot,
  goToRoute,
} from '../../Navigation';
import FooterTabs from '../../components/FooterTab';

class ChatList extends Component {
  constructor(props) {
    super(props);
    this._handlePress = this._handlePress.bind(this);
    this.state = {
      chatList: [],
    };
    this.isDisplaying = false;
  }

  componentDidMount() {
    Navigation.events().bindComponent(this);
    this.setState({chatList: this.props.chatChannels});
  }
  handleBackButtonChat() {
    console.log('handlebackpressChatList');
    backToRoot(this.props.componentId);
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
    this.setState({chatList: []});
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
    this.setState({chatList: sorteData});
  }

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
    goToRoute(this.props.componentId, 'Message', {Channel: Channel});
  };

  _renderList = data => {
    const logged = Meteor.userId();
    let item = data.item;
    //console.log(item);
    item.Message = item.latestMessage ? item.latestMessage.messageData : null;
    item.user = item.Users.find(item => item._id !== logged);

    return (
        <ChatListItem chatChannel={item} componentId={this.props.componentId}/>
    );
  };

  render() {
    return (
      <Container>
       
        <Header androidStatusBarColor={colors.statusBar} searchBar rounded style={{backgroundColor: colors.appLayout}}>
          <Left>
            {/*<Button onPress={() => Navigation.pop(this.props.componentId)} transparent>*/}
            {/*<Icon name='arrow-left' color='white' size={25}/>*/}
            {/*</Button>*/}

            <CogMenu componentId={this.props.componentId} />
          </Left>
          <Body>
            <Text style={{color: 'white'}}>Messages</Text>
          </Body>
          {/*<Right style={{margin: 7}}>*/}
          {/*<Button onPress={() => {*/}
          {/*goToRoute(this.props.componentId,'AddHospital')*/}
          {/*}} transparent>*/}
          {/*<Icon name='plus' color='white' size={25}/>*/}
          {/*</Button>*/}
          {/*</Right>*/}
        </Header>
        <Content style={styles.content}>
          <FlatList
            data={this.state.chatList}
            renderItem={this._renderList}
            keyExtractor={item => item._id}
          />
        </Content>
        <FooterTabs route={'Chat'} componentId={this.props.componentId}/>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: colors.appBackground,
    flex: 1,
      padding:10
  },
  serviceList: {
    //backgroundColor: colors.inputBackground,
    backgroundColor: '#094c6b0a',
    //marginVertical: 5,
    //marginHorizontal: '2%',
    borderRadius: 0,
    borderBottomColor: '#094c6b',
    borderBottomWidth: 5,
    paddingVertical: 10,
  },
});

export default Meteor.withTracker(() => {
  return {
    chatChannels: Meteor.collection('chatChannels').find(),
  };
})(ChatList);