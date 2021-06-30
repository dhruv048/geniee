
import React, { PureComponent } from 'react';
import {
  Title,
  Surface,
  Caption,
  Paragraph,
  Subheading,
  Divider,
  Provider,
} from 'react-native-paper';
import { Button, Left, ListItem, Right, View, Text, Thumbnail, Icon as NBIcon } from 'native-base';
import { Image, StyleSheet, TouchableOpacity, Alert, ToastAndroid, PermissionsAndroid } from 'react-native';
import settings from '../../config/settings';
import MyFunctions from '../../lib/MyFunctions';
import { customGalioTheme, customPaperTheme } from '../../config/themes';
import { colors, customStyle } from '../../config/styles';
import FIcon from 'react-native-vector-icons/Feather';
import Meteor from '../../react-native-meteor';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import call from 'react-native-phone-call';
import Geolocation from 'react-native-geolocation-service';

export default class ServiceItem extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showMenu: false,
    };
    this.region = {
      latitude: 27.71202,
      longitude: 85.31295,
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

  async componentDidMount() {
    this.granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        'title': 'Location Permission',
        'message': 'This App needs access to your location ' +
          'so we can know where you are.'
      }
    )
    if (this.granted === PermissionsAndroid.RESULTS.GRANTED) {
      // console.log("You can use locations ")
      Geolocation.getCurrentPosition(
        (position) => {
          // console.log(position);
          let region = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
          this.region = region;
        },
        (error) => {
          // See error code charts below.
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } else {
      console.log("Location permission denied")
    }
    this.watchID = Geolocation.watchPosition(
      (position) => {
        // console.log(position);
        let region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }
        this.region = region;
      },
      (error) => {
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );


  }

  removeService = _service => {
    Alert.alert(
      'Remove Service',
      `Do you want to remove service '${_service.title
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
      { cancelable: false },
    );
  };

  editService = serv => {
    this.props.navigation.navigate('AddService', { Service: serv });
  };



  _getChatChannel(userId) {
    var channelId = new Promise(function (resolve, reject) {
      Meteor.call('addChatChannel', userId, function (error, result) {
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

  _handleChat = () => {
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
        this.props.navigation.navigate('Message', { Channel });
      })
      .catch(error => {
        console.error(error);
      });
  }

  _handlItemPress = service => {
    this.props.navigation.navigate('ServiceDetail', { Id: service, })
    // Navigation.push(this.props.componentId, {
    //   component: {
    //     name: 'ServiceDetail',
    //     passProps: {
    //       Id: service,
    //     },
    //   },
    // });
  };


  render() {
    const userId = Meteor.userId();
    const { service, navigation } = this.props;
    let distance;
    if (service.location && service.location.geometry)
      distance = MyFunctions.calculateDistance(
        this.region.latitude,
        this.region.longitude,
        service.location.geometry.location.lat,
        service.location.geometry.location.lng,
      );

    //  console.log(distance)
    return (
      <Provider theme={customPaperTheme}>
        {/* <View style={styles.listBox}>
          <ListItem style={{}}>
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
                <Text numberOfLines={1}  style={{alignSelf: 'flex-start',fontSize:14, color:colors.gray_100}}>
                  ({service.subCategory.subCategory})
                </Text>
              ) : (
              service.Category?
               <Text numberOfLines={1}  style={{alignSelf: 'flex-start',fontSize:14, color:colors.gray_100}}>
                  ({service.Category.subCategory})
                </Text>:null
              )}

              {service.dist?
                <View
                    style={{
                        alignItem: 'center',
                        flexDirection: 'row',
                    }}>
                    <Text  style={{fontSize: 12,color:colors.gray_100}}>
                        {Math.round(service.dist.calculated * 100) / 100}{' '}
                        K.M. away</Text>
                </View>:null}
              <Caption>{service.location.formatted_address || ''}</Caption>
            </TouchableOpacity>


            <Right
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'flex-end',
              }}>
              <TouchableOpacity
                style={{
                  width: 40,
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf:'flex-end'
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
                   {Meteor.userId() && Meteor.userId()==service.owner? null :
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
                  </MenuItem>}
                  {Meteor.userId() && service.owner && Meteor.userId()!=service.owner?
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
                  {Meteor.userId() && Meteor.userId()==service.owner?
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
        </View> */}

        <TouchableOpacity style={{ padding: 10 }}
          onPress={() => {
            this.props.navigation.navigate('ServiceDetail', {
              Id: service,
            });
          }}>
          <View
            key={service._id}
            style={{
              backgroundColor: 'white',
              width: '100%',
              flexDirection: 'column',
              borderRadius: 5
            }}>
            <View style={{ height: 120, width: '100%', borderRadius: 10 }}>
              <Thumbnail
                style={{
                  width: '100%',
                  height: 120,
                  marginBottom: 10,
                  borderRadius: 5,
                  resizeMode: 'cover',
                }}
                square
                source={
                  service.coverImage
                    ? { uri: settings.IMAGE_URL + service.coverImage }
                    : require('../../images/no-image.png')
                }
              />


              <TouchableOpacity
                style={{
                  width: 40,
                  height: 40,
                  position: 'absolute',
                  top: 5,
                  right: 5,
                  zIndex: 1
                }}
                onPress={() => { }}>
                <Menu
                  ref={ref => (this[`menu${service._id}`] = ref)}
                  button={
                    <Button style={{ alignSelf: 'flex-end' }}
                      transparent
                      onPress={() => this[`menu${service._id}`].show()}>
                      <FIcon
                        name={'more-vertical'}
                        size={25}
                        color={colors.primary}
                      />
                    </Button>
                  }>
                  {Meteor.userId() && Meteor.userId() == service.owner ? null :
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
                                                </MenuItem>}
                  {Meteor.userId() && service.owner && Meteor.userId() != service.owner ?
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
                  {Meteor.userId() && Meteor.userId() == service.owner ?
                    <>
                      <MenuDivider />
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
                    </> : null}
                </Menu>
              </TouchableOpacity>

            </View>
            <View style={{ flexDirection: 'row', padding: 5 }}>
              <View
                style={{
                  flex: 3,
                  alignItems: 'flex-start',
                }}>
                {/*<Text style={styles.cardTitle} numberOfLines={1}>*/}
                {/*{service.title}*/}
                {/*</Text>*/}
                {service.title ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    {/* <Icon
                                                                name={'tag'}
                                                                size={10}
                                                                color={colors.gray_100}
                                                            /> */}

                    <Text
                      numberOfLines={2}
                      style={customStyle.itemTitle}>
                      {service.title || ''}
                    </Text>
                  </View>
                ) : null}
                {/*<Text note style={styles.cardNote}*/}
                {/*numberOfLines={1}>{service.location.formatted_address}</Text>*/}
                <View
                  style={{
                    flexDirection: 'row',
                    // justifyContent: 'space-between',
                    width: '100%',
                  }}>
                  <View
                    style={{
                      alignItem: 'center',
                      flexDirection: 'row',
                    }}>
                    {/*<Icon name={'location-arrow'} size={18}*/}
                    {/*color={colors.gray_200}/>*/}
                    {service.dist ?
                      <Text note style={{ fontSize: 12 ,color:colors.text_muted}}>
                        {Math.round(service.dist.calculated * 100) / 100}{' '}
                                                                km away
                                                            </Text> :
                      <Text note style={{ fontSize: 12 ,color:colors.text_muted}}>
                        {distance ? distance + " km away" : ''}

                      </Text>
                    }
                  </View>
                  <View
                    style={{
                      marginLeft: 10,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <NBIcon
                      name={'star'}
                      style={{ fontSize: 14, color: colors.text_muted }}
                    />
                    <Text note style={{ fontSize: 12, marginLeft: 4 ,color: colors.text_muted}}>
                      {service.hasOwnProperty('ratings')
                        ? Math.round(service.Rating.avgRate)
                        : 1} (
                                                                     {service.hasOwnProperty('ratings')
                        ? service.Rating.count
                        : 0})
                                                            </Text>


                  </View>

                  {/*{service.Category?*/}
                  {/*<View style={{*/}
                  {/*flexDirection: 'row',*/}
                  {/*alignItems: 'center',*/}
                  {/*justifyContent: 'center',*/}
                  {/*}}>*/}
                  {/*<Text>*/}
                  {/*<Icon name={'tag'} size={16}*/}
                  {/*color={colors.warning}/></Text>*/}
                  {/*<Text note>*/}
                  {/*{service.Category.subCategory}*/}
                  {/*</Text>*/}

                  {/*</View>:null}*/}
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
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