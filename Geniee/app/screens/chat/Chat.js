import React, { Component, useMemo, useState } from 'react';
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

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
var RNFS = require('react-native-fs');

const Chat = () => {

  const channel = props.Channel;
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState([]);
  const [modalItem, setModalItem] = useState('');
  const [customModalVisible, setCustomModalVisible] = useState(false);
  const [allowDelete, setAllowDelete] = useState(false);
  const [height, setHeight] = useState(45);
  const [messages, setMessages] = useState([]);
  const [disable, setDisable] = useState(false);

  useMemo((newProps) => {
    setMessages(newProps.messages)
  }, [newProps]);

  const getMessage = (message) => {
    const loggedUser = Meteor.userId();
    let Message = message.messageData;
    if (message.from != loggedUser)
      return (
        <View key={message._id} style={styles.leftMessage}>
          <View style={{ backgroundColor: '#e6e6e6', padding: 5, borderRadius: 8 }}>
            {Message.type === 'text' ? (
              <Text style={{ alignSelf: 'flex-start', }}>{Message.message}</Text>)
              :
              (
                <TouchableOpacity onPress={() => _showFile(Message, false)}>
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
            ) :
              (
                <TouchableOpacity onPress={() => _showFile(Message, false)}>
                  <View>
                    {Message.type.includes('image') ? (
                      <Image style={styles.rightImage}
                        source={{ uri: settings.WEB_URL + 'api/chatFiles/' + Message.src + '/' + Message.fileName, }}
                      />
                    ) : (
                      <Icon style={{ alignSelf: 'flex-end' }} name={'file-text'} size={50} />
                    )}
                  </View>
                </TouchableOpacity>
              )}
          </View>
          <View style={styles.timeStyle}>
            <Text note>{Moment(message.messageOn).local().format('hh:mm A')}</Text>
            {message.seen ? (
              <MaterialIcon name={'done-all'} size={13} style={{ color: colors.appLayout, marginHorizontal: 5 }} />
            ) : (
              <MaterialIcon name={'done'} size={13} style={{ color: '#8E8E8E', marginHorizontal: 5 }} />
            )}
          </View>
        </View>
      );
  };

  const _renderList = (data) => {
    let item = data.item;
    // console.log(item)
    return (
      <ListItem key={data.index} style={{ flexDirection: 'column' }}>
        <Text style={{ fontWeight: '500', color: colors.appLayout }}>
          {item._id}
        </Text>
        {item.messages.map((message, index) => getMessage(message))}
      </ListItem>
    );
  };

  const _sendMessage = () => {
    const chanelId = props.Channel.channelId;
    if (message) {
      let Message = {
        channelId: chanelId,
        data: { message: message, type: 'text' },
      };
      _saveMessageToServer(Message);
    }
    if (files.length > 0) {
      setDisable(true);
      files.map((file, index) => {
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
            _removeFile(index);
          }
        });
        if (files.length == index + 1)
          setDisable(false);
      });
    }
  };

  const _onViewChange = (info) => {
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

  const _sendImageCamera = () => {
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
      setFiles(prevState => ({
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

  const _senFile = async () => {
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
          setFiles(prevState => ({
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
  const _removeFile = (i) => {
    let files = [...files];
    files.splice(i, 1);
    setFiles(files);
  };

  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     message: '',
  //     files: [],
  //     modalItem: '',
  //     customModalVisible: false,
  //     allowDelete: false,
  //     height: 45,
  //     messages: [],
  //     disable: false,
  //   };
  //   this._sendMessage = this._sendMessage.bind(this);
  //   this.viewabilityConfig = {
  //     minimumViewTime: 100,
  //     viewAreaCoveragePercentThreshold: 20,
  //   };
  //   this._onViewChange = this._onViewChange.bind(this);
  //   this._showFile = this._showFile.bind(this);
  // }

  const updateSize = (height) => {
    setHeight(height);
  };

  const _handleNotTyping = () => {
    Meteor.call(
      'addRemoveTyper',
      props.Channel.channelId,
      'remove',
      err => {
        if (err) {
          console.log(err.reason);
        }
      },
    );
  };

  const _handleTyping = () => {
    Meteor.call('addRemoveTyper', props.Channel.channelId, 'add', err => {
      if (err) {
        console.log(err.reason);
      }
    });
  };

  const _saveMessageToServer = (Message) => {
    setMessage('');
    setDisable(true);
    Meteor.call('addChatMessage', Message, err => {
      setDisable(false);
      if (err) {
        // this.setState({message: Message.data.message});
      } else {
        setMessage('');
      }
    });
  }

  const _showFile = (file, allowDelete) => {
    if (allowDelete) {
      FileViewer.open(file.src, {
        showOpenWithDialog: true,
        displayName: file.fileName,
      });
    } else {
      MyFunctions._openFile(file.src + '/' + file.fileName, file.fileName);
    }
  };

  return (
    <Container>
      <Header androidStatusBarColor={colors.statusBar} searchBar rounded style={{ backgroundColor: colors.appLayout }}>
        <Left style={{ flexDirection: 'row' }}>
          <Button
            onPress={() => { props.navigation.goBack() }}
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
          <Text style={{ color: 'white', fontSize: 18, fontWeight: '500' }}>{channel.user.name || ''}</Text>
          <Text style={{ color: 'white', fontSize: 14, fontWeight: '200' }}>{channel.service.title || ''}</Text>
        </Body>
        {/*<Left style={{margin: 7}}>*/}

        {/*</Left>*/}
      </Header>
      <View style={styles.content}>
        <FlatList
          style={{ flex: 1 }}
          inverted
          ref={ref => (flatList = ref)}
          // onContentSizeChange={() => this.flatList.scrollToEnd({animated: true})}
          // onLayout={() => this.flatList.scrollToEnd({animated: false})}
          data={messages
            .slice()
            .sort((a, b) => b.nepaliDate.getTime() - a.nepaliDate.getTime())}
          renderItem={_renderList}
          keyExtractor={(item, index) => index.toString()}
          onViewableItemsChanged={_onViewChange}
          viewabilityConfig={viewabilityConfig}
          onEndReachedThreshold={0.5}
          onEndReached={info => { }}
        />
        {props.typerList.length > 0 ? (
          <Text note style={{ alignSelf: 'center' }}>
            {channel.user.name || ''} is <Icon name={'edit-3'} /> message...
          </Text>
        ) : null}
        <View style={{ maxHeight: '40%' }}>
          <ScrollView style={{ marginHorizontal: 10, flexGrow: 0 }}>
            {files.map((file, index) => (
              <TouchableOpacity
                onPress={() => _showFile(file, true)}
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
                        onPress={() => _showFile(file, true)}
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
                      onPress={() => _removeFile(index)}>
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
        style={styles.footer}>
        <Input
          placeholder={'Write Message'}
          value={message}
          multiline={true}
          onContentSizeChange={e =>
            updateSize(e.nativeEvent.contentSize.height)
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
          onChangeText={message => setMessage(message)}
          onFocus={_handleTyping}
          onBlur={_handleNotTyping}
          onSubmitEditing={_handleNotTyping}
        />

        <View
          style={{ flexDirection: 'row', width: '30%', alignSelf: 'flex-end' }}>
          <Button
            transparent
            onPress={_senFile}
            style={{ marginHorizontal: 8 }}>
            <Icon name="paperclip" size={20} color="white" />
          </Button>
          <Button
            transparent
            style={{ marginHorizontal: 8 }}
            onPress={_sendImageCamera}>
            <Icon name="camera" size={20} color="white" />
          </Button>
          <Button
            disabled={disable}
            transparent
            onPress={_sendMessage}
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
  },
  footer: {
    backgroundColor: '#4d94ff',
    paddingTop: 5,
    height: 45 + 10,
    flexDirection: 'row',
    width: '100%',
  }

});

export default Meteor.withTracker(props => {
  let channel = props.Channel;
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