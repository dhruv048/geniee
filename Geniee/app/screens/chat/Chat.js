import React, { Component } from 'react';
import {
  Header,
  Text,
  Container,
  Content,
  Thumbnail,
  Right,
  Left,
  Body,
  Button,
  ListItem,
  Card,
  Item,
  Input,
  Footer,
} from 'native-base';

import {
  StyleSheet,
  StatusBar,
  View,
  FlatList,
  Image,
  Dimensions,
  ToastAndroid,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../config/styles';
import Meteor from '../../react-native-meteor';
import settings, { getProfileImage } from '../../config/settings';
import Moment from 'moment';
import MyFunctions from '../../lib/MyFunctions';
import ImagePicker from 'react-native-image-crop-picker';
import DocumentPicker from 'react-native-document-picker';
import FileViewer from 'react-native-file-viewer';
import { goBack } from '../../Navigation';
import { customPaperTheme } from '../../config/themes';
import { Button as RNPButton, TextInput } from 'react-native-paper';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
var RNFS = require('react-native-fs');

class Chat extends Component {

  constructor(props) {
    super(props);
    this.state = {
      message: '',
      files: [],
      modalItem: '',
      customModalVisible: false,
      allowDelete: false,
      height: 45,
      messages: [],
      disable: false,
    };
    this._sendMessage = this._sendMessage.bind(this);
    this.viewabilityConfig = {
      minimumViewTime: 100,
      viewAreaCoveragePercentThreshold: 20,
    };
    this._onViewChange = this._onViewChange.bind(this);
    this._showFile = this._showFile.bind(this);
  }

  componentDidMount() { }

  componentWillReceiveProps(newProps) {
    this.setState({ messages: newProps.messages });
  }

  componentWillUnmount() {
    this._handleNotTyping();
  }
  componentDidAppear() {
    this.setState({ messages: [] });
    this.setState({ messages: this.props.messages });
  }
  componentDidDisappear() {
    this._handleNotTyping();
  }

  getMessage = message => {
    const loggedUser = Meteor.userId();
    let Message = message.messageData;
    if (message.from != loggedUser)
      return (
        <View key={message._id} style={styles.leftMessage}>
          <View style={{ backgroundColor: '#e6e6e6', padding: 5, borderRadius: 8 }}>
            {Message.type === 'text' ? (
              <Text style={{ alignSelf: 'flex-start' }}>{Message.message}</Text>
            ) : (
              <TouchableOpacity onPress={() => this._showFile(Message, false)}>
                <View>
                  {Message.type.includes('image') ? (
                    <Image style={styles.leftImage}
                      source={{ uri: settings.WEB_URL + 'api/chatFiles/' + Message.src + '/' + Message.fileName, }}
                    />
                  ) : (
                    <Icon style={{ alignSelf: 'flex-start' }} name={'file-text'} size={50} />
                  )}
                </View>
              </TouchableOpacity>
            )}
          </View>
          <Text style={{ alignSelf: 'flex-start' }} note>{Moment(message.messageOn).local().format('hh:mm A')}</Text>
        </View>
      );
    else
      return (
        <View key={message._id} style={styles.rightMessage}>
          <View style={{ backgroundColor: '#acd1e3', padding: 5, borderRadius: 8 }}>
            {Message.type === 'text' ? (
              <Text style={{ alignSelf: 'flex-end' }}>{Message.message}</Text>
            ) : (
              <TouchableOpacity onPress={() => this._showFile(Message, false)}>
                <View> {Message.type.includes('image') ? (
                  <Image
                    style={styles.rightImage}
                    source={{ uri: settings.WEB_URL + 'api/chatFiles/' + Message.src + '/' + Message.fileName, }}
                  />
                ) : (
                  <Icon style={{ alignSelf: 'flex-end' }} name={'file-text'} size={50} />
                )}
                  {/*  <Text
                                style={{alignSelf: 'flex-end', color: colors.appLayout}}>{Message.fileName || ''}</Text> */}
                </View>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.timeStyle}>
            <Text note> {Moment(message.messageOn).local().format('hh:mm A')}</Text>
            {message.seen ? (
              <MaterialIcon name={'done-all'} size={13} style={{ color: colors.appLayout, marginHorizontal: 5 }} />
            ) : (
              <MaterialIcon name={'done'} size={13} style={{ color: '#8E8E8E', marginHorizontal: 5 }} />
            )}
          </View>
        </View>
      );
  };
  _renderList = data => {
    let item = data.item;
    // console.log(item)
    return (
      <ListItem key={data.index} style={{ flexDirection: 'column' }}>
        <Text style={{ fontWeight: '500', color: colors.appLayout }}>
          {item._id}
        </Text>
        {item.messages.map((message, index) => this.getMessage(message))}
      </ListItem>
    );
  };
  _sendMessage = () => {
    const chanelId = this.props.route.params.Channel.channelId;
    if (this.state.message) {
      let Message = {
        channelId: chanelId,
        data: { message: this.state.message, type: 'text' },
      };
      this._saveMessageToServer(Message);
    }
    if (this.state.files.length > 0) {
      this.setState({ disable: true });
      this.state.files.map((file, index) => {
        Meteor.call('uploadChatFile', file, chanelId, (err, result) => {
          if (err) {
            console.log(err.reason);
            ToastAndroid.showWithGravityAndOffset(
              err.reason,
              ToastAndroid.LONG,
              ToastAndroid.TOP,
              0,
              80,
            );
          } else {
            console.log(result);
            this._removeFile(index);
          }
        });
        if (this.state.files.length == index + 1)
          this.setState({ disable: false });
      });
    }
  };

  _onViewChange = info => {
    const loggedUser = Meteor.userId();
    let messagesToUpdate = [];
    // console.log(info);
    let viewableItems = info.viewableItems;
    viewableItems.forEach(viewableItem => {
      if (viewableItem.isViewable) {
        viewableItem.item.messages.forEach(item => {
          if (item.from != loggedUser && !item.seen) {
            messagesToUpdate.push(item._id);
          }
        });
      }
    });
    if (messagesToUpdate.length > 0) {
      Meteor.call('updateMessageSeen', messagesToUpdate, err => {
        if (err) {
          console.log(err);
        }
      });
    }
  };
  _sendImageCamera = () => {
    ImagePicker.openCamera({
      includeBase64: true,
    }).then(image => {
      console.log(image);
      const uri = `data:${image.mime};base64,${image.data}`;
      image.name =
        Meteor.userId() +
        Moment().format('DDMMYYx') +
        '.' +
        image.mime.substr(image.mime.indexOf('/') + 1);
      image.fileName = image.name;
      image.src = uri;
      this.setState(prevState => ({
        files: [...prevState.files, image],
      }));

      ImagePicker.clean()
        .then(() => {
          console.log('removed all tmp images from tmp directory');
        })
        .catch(e => {
          alert(e);
        });
    });
  };
  _senFile = async () => {
    try {
      const file = await DocumentPicker.pick({
        type: [DocumentPicker.types.images, DocumentPicker.types.allFiles],
        readContent: true,
      });
      // console.log(
      //     file
      // );
      RNFS.readFile(file.uri, 'base64')
        .then(encoded => {
          // Send it to a server
          // console.log(encoded)
          file.data = encoded;
          file.mime = file.type;
          file.fileName = file.name;
          file.name =
            Meteor.userId() +
            Moment().format('DDMMYYx') +
            '.' +
            file.mime.substr(file.mime.indexOf('/') + 1);
          // file.imagUri = file.mime.includes('image/') ? `data:${file.mime};base64,${file.data}` : null;
          file.src = file.uri;
          this.setState(prevState => ({
            files: [...prevState.files, file],
          }));
        })
        .catch(error => console.error(error));
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };
  _removeFile = i => {
    let files = [...this.state.files];
    files.splice(i, 1);
    this.setState({ files });
  };

  updateSize = height => {
    console.log(height);
    this.setState({
      height,
    });
  };

  _handleNotTyping = () => {
    console.log('removeTyping');
    Meteor.call(
      'addRemoveTyper',
      this.props.route.params.Channel.channelId,
      'remove',
      err => {
        if (err) {
          console.log(err.reason);
        }
      },
    );
  };

  _handleTyping = () => {
    console.log('typing');
    Meteor.call('addRemoveTyper', this.props.route.params.Channel.channelId, 'add', err => {
      if (err) {
        console.log(err.reason);
      }
    });
  };
  _saveMessageToServer(Message) {
    this.setState({ message: '' });
    this.setState({ disable: true });
    Meteor.call('addChatMessage', Message, err => {
      this.setState({ disable: false });
      if (err) {
        // this.setState({message: Message.data.message});
      } else {
        this.setState({ message: '' });
        // this.flatList.scrollToOffset({offset: 0, animated: true});
      }
    });
  }

  _showFile = (file, allowDelete) => {
    console.log(file);
    // this.setState({
    //     modalItem:file,
    //     customModalVisible:true,
    //     allowDelete:allowDelete
    // })
    if (allowDelete) {
      FileViewer.open(file.src, {
        showOpenWithDialog: true,
        displayName: file.fileName,
      });
    } else {
      MyFunctions._openFile(file.src + '/' + file.fileName, file.fileName);
    }
  };

  render() {
    const { height } = this.state;

    let newStyle = {
      height,
    };
    const channel = this.props.route.params.Channel;
    return (
      <Container>
        <View style={{ marginVertical: customPaperTheme.headerMarginVertical }}>
          <Header androidStatusBarColor={colors.statusBar} searchBar rounded style={{ backgroundColor: colors.statusBar }}>
            <Left style={{ flexDirection: 'row' }}>
              <Button
                onPress={() => {
                  this.props.navigation.goBack();
                }}
                transparent>
                <Icon name="arrow-left" color="white" size={25} />
              </Button>
              <Thumbnail
                square
                small
                style={{ borderRadius: 5, margin: 7 }}
                source={
                  channel.user.profileImage
                    ? { uri: getProfileImage(channel.user.profileImage) }
                    : require('../../images/user-icon.png')
                }
              />
            </Left>
            <Body>
              <Text style={{ color: 'white', fontSize: 18, fontWeight: '500' }}>
                {channel.user.name || 'User'}
              </Text>
              <Text style={{ color: 'white', fontSize: 14, fontWeight: '200' }}>
                {channel.business.title || channel.business.businessName}
              </Text>
            </Body>
            {/*<Left style={{margin: 7}}>*/}

            {/*</Left>*/}
          </Header>
        </View>
        <View style={styles.content}>
          <FlatList
            style={{ flex: 1 }}
            inverted
            ref={ref => (this.flatList = ref)}
            // onContentSizeChange={() => this.flatList.scrollToEnd({animated: true})}
            // onLayout={() => this.flatList.scrollToEnd({animated: false})}
            data={this.state.messages
              .slice()
              .sort((a, b) => b.nepaliDate.getTime() - a.nepaliDate.getTime())}
            renderItem={this._renderList}
            keyExtractor={(item, index) => index.toString()}
            onViewableItemsChanged={this._onViewChange}
            viewabilityConfig={this.viewabilityConfig}
            onEndReachedThreshold={0.5}
            onEndReached={info => { }}
          />
          {this.props.typerList.length > 0 ? (
            <Text note style={{ alignSelf: 'center' }}>
              {channel.user.name || ''} is <Icon name={'edit-3'} /> message...
            </Text>
          ) : null}
          <View style={{ maxHeight: '40%' }}>
            <ScrollView style={{ marginHorizontal: 10, flexGrow: 0 }}>
              {this.state.files.map((file, index) => (
                <TouchableOpacity
                  onPress={() => this._showFile(file, true)}
                  key={index}>
                  <View
                    style={{
                      marginVertical: 5,
                      backgroundColor: '#5093b3',
                      flexDirection: 'row',
                    }}>
                    <View style={{ alignSelf: 'flex-start' }}>
                      {file.mime.includes('application/') ? (
                        <Icon name="file-text" size={50} />
                      ) : (
                        <Thumbnail
                          square
                          medium
                          onPress={() => this._showFile(file, true)}
                          source={{ uri: file.src }}
                        />
                      )}
                    </View>
                    <View style={{ alignSelf: 'center', width: '75%' }}>
                      <Text style={{ color: 'white' }} note>
                        {file.fileName}
                      </Text>
                    </View>
                    <View style={{ alignSelf: 'flex-end' }}>
                      <Button
                        transparent
                        style={
                          {
                            // ...StyleSheet.absoluteFillObject,
                            // alignSelf: 'flex-end',
                            // right: 0,
                            // marginTop: -5,
                            // position: 'absolute',
                          }
                        }
                        onPress={() => this._removeFile(index)}>
                        <Icon name="x-circle" size={25} color={'red'} />
                      </Button>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
        <Footer
          style={{
            backgroundColor: '#4d94ff',
            paddingTop: 5,
            height: this.state.height + 10,
            flexDirection: 'row',
            width: '100%',
          }}>
          <Input
            placeholder={'Write Message'}
            value={this.state.message}
            multiline={true}
            onContentSizeChange={e =>
              this.updateSize(e.nativeEvent.contentSize.height)
            }
            style={[
              {
                backgroundColor: '#f2f2f2',
                borderWidth: 1,
                borderRadius: 5,
                borderColor: '#c6c6c6',
                width: '66%',
                marginHorizontal: '2%',
              },
              newStyle,
            ]}
            onChangeText={message => {
              this.setState({ message });
            }}
            onFocus={this._handleTyping.bind(this)}
            onBlur={this._handleNotTyping}
            onSubmitEditing={this._handleNotTyping}
          />

          <View
            style={{ flexDirection: 'row', width: '30%', alignSelf: 'flex-end' }}>
            <Button
              transparent
              onPress={this._senFile}
              style={{ marginHorizontal: 8 }}>
              <Icon name="paperclip" size={20} color="white" />
            </Button>
            <Button
              transparent
              style={{ marginHorizontal: 8 }}
              onPress={this._sendImageCamera}>
              <Icon name="camera" size={20} color="white" />
            </Button>
            <Button
              disabled={this.state.disable}
              transparent
              onPress={this._sendMessage}
              style={{ marginHorizontal: 8 }}>
              {/*<Icon                                     
                                    style={{color: this.state.message.length > 1 || this.state.files.length > 0 ? colors.appLayout : undefined}}
                                name='send' size={20} color='white'/>*/}
              <Icon name="send" size={20} color="white" />
            </Button>
          </View>
        </Footer>
      </Container>
    );
  }
}

export default Meteor.withTracker(props => {
  let channel = props.route.params.Channel;
  Meteor.subscribe('chatItemsGroupByDate', channel.channelId);
  Meteor.subscribe('chatUsers', channel.channelId);
  Meteor.subscribe('typerList', channel.channelId);
  console.log(Meteor.collection('users').find());
  return {
    messages: Meteor.collection('chatMessages').find(
      {},
      { $sort: { nepaliDate: -1 } },
    ),
    user: Meteor.collection('users').findOne({ _id: channel.user.userId }),
    typerList: Meteor.collection('typingList').find(),
  };
})(Chat);


const styles = StyleSheet.create({
  content: {
    backgroundColor: colors.appBackground,
    flex: 1,
  },
  leftMessage: {
    marginRight: '20%',
    marginLeft: '1%',
    marginTop: 5,
    maxWidth: '79%',
    alignSelf: 'flex-start',
  },

  rightMessage: {
    marginRight: '1%',
    marginLeft: '20%',
    marginTop: 5,
    maxWidth: '79%',
    flex: 1,
    alignSelf: 'flex-end',
  },
  leftImage: {
    alignSelf: 'flex-start',
    width: 150,
    height: 150,
    resizeMode: 'cover',
  },

  rightImage: {
    alignSelf: 'flex-end',
    width: 150,
    height: 150,
    resizeMode: 'cover',
  },
  timeStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end'
  }

});