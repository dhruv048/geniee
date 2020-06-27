
import React, {PureComponent} from 'react';
import {
  Title,
  Surface,
  Caption,
  Paragraph,
  Subheading,
  Divider,
  Provider,
} from 'react-native-paper';
import {Body, Left, ListItem, Right, View, Text, Button} from 'native-base';
import {Image, StyleSheet, TouchableOpacity,Alert,ToastAndroid} from 'react-native';
import settings from '../../config/settings';
import StarRating from '../../components/StarRating/StarRating';
import {customGalioTheme, customPaperTheme} from '../../config/themes';
import {colors, customStyle} from '../../config/styles';
import {Navigation} from 'react-native-navigation';
import FIcon from 'react-native-vector-icons/Feather';
import Meteor from '../../react-native-meteor';
import {goToRoute} from '../../Navigation';
import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';
import call from 'react-native-phone-call';

export default class ServiceItem extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showMenu: false,
    };
  }

_callPhone = number => {
    // let res=  this.onEsewaComplete();
    // alert(res);
    console.log(number);
    if (!number) {
      Alert.alert('Contact No. Unavailable for the Service');
      return;
    }

    const args = {
      number: number, // String value with the number to call
      prompt: false, // Optional boolean property. Determines if the user should be prompt prior to the call
    };
    call(args).catch(console.error);
  };

  componentDidMount() {}

 removeService = _service => {
    Alert.alert(
      'Remove Service',
      `Do you want to remove service '${
        _service.title
      }'? All the products under service will also be removed`,
      [
        {
          text: 'Yes Remove',
          onPress: () =>
            Meteor.call('removeService', _service._id, (err, res) => {
              if (!err) {
                ToastAndroid.showWithGravityAndOffset(
                  'Removed Successfully',
                  ToastAndroid.SHORT,
                  ToastAndroid.BOTTOM,
                  0,
                  50,
                );
              } else {
                ToastAndroid.showWithGravityAndOffset(
                  err.reason,
                  ToastAndroid.SHORT,
                  ToastAndroid.BOTTOM,
                  0,
                  50,
                );
              }
            }),
        },
        {
          text: 'Cancel',
          onPress: () => {
            return true;
          },
        },
      ],
      {cancelable: false},
    );
  };

  editService = serv => {
    goToRoute(this.props.componentId, 'AddService', {Service: serv});
  };



  _getChatChannel(userId) {
    var channelId = new Promise(function(resolve, reject) {
      Meteor.call('addChatChannel', userId, function(error, result) {
        if (error) {
          reject(error);
        } else {
          // Now I can access `result` and make an assign `result` to variable `resultData`
          resolve(result);
        }
      });
    });
    return channelId;
  }

  _handleChat=() =>{
    let Service = this.props.service;
    // console.log('service' + Service._id);
    this._getChatChannel(Service._id)
      .then(channelId => {
        // console.log(channelId);
        let Channel = {
          channelId: channelId,
          user: {
            userId: Service.createdBy,
            name: '',
            profileImage: null,
          },
          service: Service,
        };
        goToRoute(this.props.componentId, 'Message', {Channel});
      })
      .catch(error => {
        console.error(error);
      });
  }

  _handlItemPress = service => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'ServiceDetail',
        passProps: {
          Id: service,
        },
      },
    });
  };

  render() {
    const {service} = this.props;
    console.log(service)
    return (
      <Provider theme={customPaperTheme}>
        <View style={styles.listBox}>
          <ListItem style={{paddingRight: 10}}>
            <Left style={{flex: 3, flexDirection: 'column'}}>
              <TouchableOpacity
                onPress={() => {
                  this._handlItemPress(service);
                }}
                style={styles.surface}>
                <Image
                  style={styles.banner}
                  source={{uri: settings.IMAGE_URL + service.coverImage}}
                />
              </TouchableOpacity>
              <StarRating
                starRate={
                  service.hasOwnProperty('Rating') ? service.Rating.avgRate : 1
                }
              />
            </Left>
            <TouchableOpacity
              style={{flex: 6}}
              onPress={() => this._handlItemPress(service)}>
              <Subheading numberOfLines={1}>{service.title}</Subheading>
              {service.subCategory ? (
                <Text numberOfLines={1} style={{alignSelf: 'flex-start',fontSize:14}}>
                  {service.subCategory.subCategory}
                </Text>
              ) : null}
              <Caption>{service.location.formatted_address || ''}</Caption>
            </TouchableOpacity>
            <Right
              style={{
                flex: 1,
                flexDirection: 'column',
                alignItems: 'flex-end',
              }}>
              {/*<Button*/}
              {/*icon*/}
              {/*transparent*/}
              {/*// onPress={this.addToCart.bind(this)}*/}
              {/*style={[*/}
              {/*customStyle.buttonOutlineSecondary, {*/}
              {/*height: 30,*/}
              {/*width: 30,*/}
              {/*marginBottom: 5,*/}
              {/*alignItems: 'center',*/}
              {/*justifyContent: 'center',*/}
              {/*backgroundColor: colors.appBackground*/}
              {/*}*/}
              {/*]}>*/}
              {/*<FIcon name={'phone'} size={20} color={colors.primary}/>*/}
              {/*</Button>*/}
              {/*<Button*/}
              {/*icon*/}
              {/*transparent*/}
              {/*onPress={this.handleChat.bind(this)}*/}
              {/*style={[*/}
              {/*customStyle.buttonOutlineSecondary, {*/}
              {/*height: 30,*/}
              {/*width: 30,*/}
              {/*marginTop: 5,*/}
              {/*alignItems: 'center',*/}
              {/*justifyContent: 'center',*/}
              {/*backgroundColor: colors.appBackground*/}
              {/*}*/}
              {/*]}>*/}
              {/*<FIcon*/}
              {/*name={'message-square'}*/}
              {/*size={20}*/}
              {/*color={colors.primary}*/}
              {/*/>*/}
              {/*</Button>*/}

              <TouchableOpacity
                style={{
                  width: 38,
                  height: 38,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => {}}>
                <Menu
                  ref={ref => (this[`menu${service._id}`] = ref)}
                  button={
                    <Button style={{alignSelf:'flex-end'}}
                      transparent
                      onPress={() => this[`menu${service._id}`].show()}>
                      <FIcon
                        name={'more-vertical'}
                        size={25}
                        color={colors.primary}
                      />
                    </Button>
                  }>
                   {Meteor.userId()!=service.owner?
                  <MenuItem
                    onPress={() => {
                      this[`menu${service._id}`].hide(),
                        this._callPhone(service.contact ? service.contact : service.contact1);
                    }}>
                    <FIcon
                        name={'phone'}
                        size={15}
                        color={colors.gray_200}
                      />  Call
                  </MenuItem>:null}
                  {Meteor.userId() && Meteor.userId()!=service.owner?
                  <MenuItem
                    onPress={() => {
                      this[`menu${service._id}`].hide(),
                        this._handleChat();
                    }}>
                    <FIcon
                        name={'message-square'}
                        size={15}
                        color={colors.gray_200}
                      />  Message
                  </MenuItem> : null}
                  {Meteor.userId()==service.owner?
                    <>
                  <MenuDivider/>
                  <MenuItem
                    onPress={() => {
                      this[`menu${service._id}`].hide(),
                        this.editService(service);
                    }}>
                    <FIcon
                        name={'edit'}
                        size={15}
                        color={colors.gray_200}
                      />  Edit
                  </MenuItem>
                  <MenuItem
                    onPress={() => {
                      this[`menu${service._id}`].hide(),
                        this.removeService(service);
                    }}>
                    <FIcon
                        name={'trash'}
                        size={15}
                        color={colors.gray_200}
                      />  Remove
                  </MenuItem>
                  </>:null}
                </Menu>
              </TouchableOpacity>
            </Right>
          </ListItem>
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  banner: {
    width: 80,
    height: 50,
    borderRadius: 3,
    backgroundColor: '#000000',
  },
  listBox: {
    marginTop: 5,
    backgroundColor: customGalioTheme.COLORS.WHITE,
    borderRadius: 4,
  },
  surface: {
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    top: -5,
  },
});