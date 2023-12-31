import React, {Component} from 'react';
import Meteor from '../react-native-meteor';
import {
  StyleSheet,
  BackHandler,
  Dimensions,
  Animated,
  View,
  ToastAndroid,
  TouchableOpacity,
  LayoutAnimation,
  FlatList,
  PermissionsAndroid,
  Image,
  TouchableWithoutFeedback,
  UIManager,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import Geolocation from 'react-native-geolocation-service';
import {
  Header,
  Container,
  Content,
  Item,
  Body,
  Left,
  Button,
  Right,
  Text,
  Input,
  ListItem,
  Thumbnail,
  Icon as NBIcon,
  Spinner,
  Card,
  CardItem,
} from 'native-base';
import Icon from 'react-native-vector-icons/Feather';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import {colors, customStyle, variables} from '../config/styles';
import {Badge, Avatar} from 'react-native-paper';
const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');
import settings from '../config/settings';
import StarRating from '../components/StarRating/StarRating';
import Product from '../components/Store/Product';
import MyFunctions from '../lib/MyFunctions';
import CogMenu from '../components/CogMenu';
import SplashScreen from 'react-native-lottie-splash-screen';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-community/async-storage';
import {getProfileImage} from '../config/settings';
import LinearGradient from 'react-native-linear-gradient';
import FooterTabs from '../components/FooterTab';
import NotificationIcon from '../components/HeaderIcons/NotificationIcon';
import CartIcon from '../components/HeaderIcons/CartIcon';
import {customPaperTheme} from '../config/themes';
import {MaterialColors} from '../constants/material-colors';

let isDashBoard = true;

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewAll: false,
      categories: [],
      loading: false,
      services: [],
      products: [],
      searchMode: false,
      showSearchBar: false,
      Adds: [],
      query: '',
      pickLocation: false,
      backClickCount: 0,
      wishList: 0,
      totalCount: 0,
      notificationCount: 0,
      nearByservice: [],
      popularProducts: [],
      isActionButtonVisible: true,
      loggedUser: Meteor.user(),
      resturants: [
        {
          title: 'Baadshah Briyani',
          imgSource: require('../images/baadshah_logo.jpg'),
          onPress: this.gotoBB,
          tags: 'Fast food restaurant',
          description:
            'Baadshah Biryani serves the most authentic Biryani in Kathmandu prepared by our expertise.Our Biryani will give you a burst of flavour in every bite as we use in-house spices',
        },
        {
          title: 'Eat-Fit',
          imgSource: require('../images/EF2.jpg'),
          onPress: this.gotoEatFit,
          tags: 'Hotel & Restaurant',
          description:
            'At cure.fit, we make group workouts fun, daily food healthy & tasty, mental fitness easy with yoga & meditation, and medical & lifestyle care hassle-free. #BeBetterEveryDay',
        },
      ],
    };
    this.arrayholder;
    this.currentSearch = '';
    this.region = {
      latitude: 27.71202,
      longitude: 85.31295,
    };
    this.granted;
    this.watchID;
    this.springValue = new Animated.Value(100);

    this.partners = [
      {
        title: '',
        imgSource: require('../images/baadshah_logo.jpg'),
        onPress: this.gotoBB,
      },
      {
        title: 'EAT-FIT',
        imgSource: require('../images/EF2.jpg'),
        onPress: this.gotoEatFit,
      },
    ];
    this._listViewOffset = 0;
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
    //this.onClick = this.onClick.bind(this);
  }
  async componentDidMount() {
    this.setState({loggedUser: this.props.loggedUser});
    this.updateCounts();
    let MainCategories = await AsyncStorage.getItem('Categories');
    if (MainCategories) {
      MainCategories = JSON.parse(MainCategories);
      this.setState({categories: MainCategories.slice(0, 6), loading: false});
      this.arrayholder = MainCategories;
    } else {
      MainCategories = [];
    }
    SplashScreen.hide();
    //
    Meteor.subscribe('aggChatChannels');
    if (this.props.notificationCount.length > 0) {
      this.setState({
        notificationCount: this.props.notificationCount[0].totalCount,
      });
    }
    Meteor.call('getActiveAdvertises', (err, res) => {
      if (!err) {
        this.setState({Adds: res});
      }
    });

    //Services/Store Nearby
    //   Meteor.call('getServicesNearBy', data, (err, res) => {
    Meteor.call(
      'getRandomServices',
      [this.region.longitude, this.region.latitude],
      15,
      10,
      (err, res) => {
        console.log(err, res);
        this.setState({loading: false});
        if (!err) {
          this.setState({nearByservice: res.result});
        } else {
          console.log(err);
        }
      },
    );

    //Get Popular Products
    Meteor.call('getPopularProducts', 0, 6, (err, res) => {
      console.log(err, res);
      if (!err) {
        this.setState({popularProducts: res.result});
      } else {
        console.log(err);
      }
    });

    if (Platform.OS === 'ios') {
      this.granted = await Geolocation.requestAuthorization('always');
    } else {
      this.granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message:
            'This App needs access to your location ' +
            'so we can know where you are.',
        },
      );
    }
    if (this.granted === PermissionsAndroid.RESULTS.GRANTED) {
      Geolocation.getCurrentPosition(
        position => {
          //  console.log(position);
          let region = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          this.region = region;
          //Get Nearby services
          this._fetchNearByServices();
        },
        error => {
          // See error code charts below.
          console.log(error.code, error.message);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    } else {
      console.log('Location permission denied');
    }
    this.watchID = Geolocation.watchPosition(
      position => {
        //   console.log(position);
        let region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        this.region = region;
        //   this._fetchNearByServices();
      },
      error => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );

    this.messageListener().catch(e => {
      console.log(e);
    });

    Meteor.call('getPopularResturants', (err, res) => {
      if (!err) {
        let resturants = [...this.state.resturants];
        resturants = resturants.concat(res);
        this.setState({resturants});
      }
    });

    //Store All Catefories
    Meteor.subscribe('categories-list', () => {
      //console.log(MainCategories)
      if (this.props.categories.length > 0) {
        let MainCategories = this.props.categories;
        this.setState({
          categories: this.state.viewAll
            ? MainCategories
            : MainCategories.slice(0, 6),
          loading: false,
        });
        this.arrayholder = MainCategories;
        AsyncStorage.setItem('Categories', JSON.stringify(MainCategories));
      }
    });

    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButton.bind(this),
    );

    this.focusListnier = this.props.navigation.addListener('focus', () => {
      console.log('Dashboard Focus');
      this._fetchNearByServices();
      this.backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        this.handleBackButton.bind(this),
      );
    });

    this.blurListnier = this.props.navigation.addListener('blur', () => {
      try {
        this.backHandler.remove();
      } catch (e) {
        console.log(e.message);
      }
    });
  }

  _fetchNearByServices = () => {
    console.log('_fetchNearByServices');
    const data = {
      skip: 0,
      limit: 10,
      coords: [this.region.longitude, this.region.latitude],
      subCatIds: null,
    };
    //   Meteor.call('getServicesNearBy', data, (err, res) => {
    Meteor.call(
      'getRandomServices',
      [this.region.longitude, this.region.latitude],
      15,
      10,
      (err, res) => {
        console.log(err, res);
        this.setState({loading: false});
        if (!err) {
          this.setState({nearByservice: res.result});
        } else {
          console.log(err);
        }
      },
    );
  };

  componentWillReceiveProps(newProps) {
    const oldProps = this.props;
    if (oldProps.categories.length !== newProps.categories.length) {
      this.setState({
        categories: this.state.viewAll
          ? newProps.categories
          : newProps.categories.slice(0, 6),
        loading: false,
      });
      this.arrayholder = newProps.categories;
      this._search(this.currentSearch);
      AsyncStorage.setItem('Categories', JSON.stringify(newProps.categories));
    }
    if (newProps.notificationCount.length > 0) {
      //console.log(newProps.notificationCount)
      this.setState({
        notificationCount: newProps.notificationCount[0].totalCount,
      });
    }
    if (newProps.loggedUser) {
      this.setState({loggedUser: newProps.loggedUser});
    }
  }

  componentWillUnmount() {
    this.mounted = false;
    this.watchID != null && Geolocation.clearWatch(this.watchID);
    this.focusListnier;
    this.blurListnier;
  }

  handleOnPress = () => this.setState({showSearchBar: true});
  handleOnPressUnset = () => {
    this.setState({showSearchBar: false, query: ''});
    this._search('');
  };
  //onClick() {
  //let { showSearchBar } = this.state.showSearchBar;
  //this.setState({
  //showSearchBar: !showSearchBar,
  //});
  //}

  handleBackButton() {
    console.log('back handle from dashboard');
    if (isDashBoard) {
      const {screen, navigator} = this.props;
      console.log(screen, navigator, this.props);
      this.state.backClickCount == 1 ? BackHandler.exitApp() : this._spring();
      return true;
    }
  }

  setViewAll = () => {
    let prevState = this.state.viewAll;
    const categories = prevState
      ? this.props.categories.slice(0, 6)
      : this.props.categories;
    this.setState({viewAll: !prevState, categories: categories});
  };

  _spring() {
    ToastAndroid.showWithGravityAndOffset(
      'Tap again to Exit.',
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      0,
      50,
    );

    this.setState({backClickCount: 1}, () => {
      Animated.sequence([
        Animated.spring(this.springValue, {
          toValue: -0.15 * viewportHeight,
          friction: 5,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(this.springValue, {
          toValue: 100,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        this.setState({backClickCount: 0});
      });
    });
  }

  handleOnLocationSelect(location) {
    console.log(location);
    this.setState({pickLocation: false});
  }

  messageListener = async () => {
    this.notificationOpenedListener = messaging().onNotificationOpenedApp(
      notificationOpen => {
        const {title, body} = notificationOpen.notification;
        // this.showAlert(title, body);
        console.log('onNotificationOpened', notificationOpen);
        // if (notificationOpen.notification.data.title == "REMOVE_AUTH_TOKEN") {
        //     try {
        //         AsyncStorage.setItem(USER_TOKEN_KEY, '');
        //         Meteor.logout();
        //         goToRoute(this.props.componentId'Auth');
        //     }
        //     catch (e) {
        //         console.log(e.message)
        //         goToRoute(this.props.componentId'Auth');
        //     }
        // }
        if (notificationOpen.notification.data.navigate) {
          console.log('subscribe & Navigate');
          // Meteor.subscribe(notificationOpen.notification.data.subscription, notificationOpen.notification.data.Id, (err) => {
          // goToRoute(
          //     this.props.componentId,
          //     notificationOpen.notification.data.route,
          //     { Id: notificationOpen.notification.data.Id },
          // );
          // });
        }
      },
    );

    const notificationOpen = await messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        return remoteMessage;
      });
    if (notificationOpen) {
      const {title, body} = notificationOpen.notification;
      //  this.showAlert(title, body);
      console.log('notificationOpen', notificationOpen.notification);
      if (notificationOpen.notification.data.title == 'REMOVE_AUTH_TOKEN') {
        // try {
        //     AsyncStorage.setItem(USER_TOKEN_KEY, '');
        //     Meteor.logout();
        //     this.props.navigation.navigate('Auth');
        // }
        // catch (e) {
        //     console.log(e.message)
        //     this.props.navigation.navigate('Auth');
        // }
      }
      if (notificationOpen.notification.data.navigate) {
        console.log('subscribe & Navigate');
        this.props.navigation.navigate(
          notificationOpen.notification.data.route,
          {Id: notificationOpen.notification.data.Id},
        );
      }
    }
  };

  async updateCounts() {
    let wishList = await AsyncStorage.getItem('myWhishList');
    if (wishList) {
      wishList = JSON.parse(wishList);
    } else {
      wishList = [];
    }

    let cartList = await AsyncStorage.getItem('myCart');
    if (cartList) {
      cartList = JSON.parse(cartList);
    } else {
      cartList = [];
    }
    this.setState({wishList: wishList, totalCount: cartList.length});
  }

  _search = text => {
    if (this.state.query) {
      this.props.navigation.navigate('SearchResult', {
        SearchText: this.state.query,
        Region: this.region,
      });
    }
  };

  _handlItemPress = service => {
    service.avgRate = this.averageRating(service.ratings);
    this.props.navigation.push('ServiceDetail', {Id: service._id});
    // Navigation.push(this.props.componentId, {
    //     component: {
    //         name: 'ServiceDetail',
    //         passProps: {
    //             Id: service._id,
    //         },
    //     },
    // });
  };
  averageRating = arr => {
    let sum = 0;
    arr.forEach(item => {
      sum = sum + item.count;
    });
    var avg = sum / arr.length;
    return Math.round(avg);
  };
  _itemClick = item => {
    let Ids = [];
    item.subCategories.map(item => {
      Ids.push(item.subCatId);
    });
    this.props.navigation.navigate('ServiceList', {
      Id: Ids,
      Region: this.region,
    });
    // Navigation.push(this.props.componentId, {
    //     component: {
    //         name: 'ServiceList',
    //         passProps: {
    //             Id: Ids,
    //             Region: this.region,
    //         },
    //     },
    // });
  };

  gotoEatFit = () => {
    console.log('Eat-Fit');
    this.props.navigation.navigate('LandingPageEF');
  };

  gotoBB = () => {
    this.props.navigation.navigate('ProductsBB');
  };
  renderCategoryItem = (data, index) => {
    var item = data.item;
    return (
      <View key={data.index.toString()} style={styles.containerStyle}>
        <TouchableOpacity onPress={() => this._itemClick(item)}>
          {/*<ImageBackground source={require('../images/bgLogo.png')}
                    style={{justifyContent: 'center', alignItems: 'center', alignSelf: 'stretch'}}
    >
                    <View style={{justifyContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'stretch',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        padding: 10
                    }}>*/}
          <Body>
            <View
              style={[
                styles.categoriesIcon,
                {backgroundColor: MaterialColors[data.index]},
              ]}>
              <FAIcon name={item.icon} size={25} />
            </View>
          </Body>

          <Text
            style={{
              textAlign: 'center',
              fontWeight: '200',
              color: MaterialColors[data.index],
              fontSize: 10,
            }}>
            {item.mainCategory}
          </Text>
          {/*</View>
                </ImageBackground>*/}
        </TouchableOpacity>
      </View>
    );
  };
  _getListItem = data => {
    let rowData = data.item;
    let distance;
    if (rowData.location && rowData.location.geometry) {
      distance = MyFunctions.calculateDistance(
        this.region.latitude,
        this.region.longitude,
        rowData.location.geometry.location.lat,
        rowData.location.geometry.location.lng,
      );
    }
    // console.log(distance);
    return (
      <View key={data.item._id} style={styles.serviceList}>
        <TouchableWithoutFeedback
          onPress={() => {
            this._handlItemPress(data.item);
          }}>
          <ListItem thumbnail>
            <Left>
              {rowData.coverImage === null ? null : ( //   <Thumbnail style={styles.banner} square source={dUser}/> :
                <Thumbnail
                  style={styles.banner}
                  source={{
                    uri: settings.API_URL + 'images/' + rowData.coverImage,
                  }}
                />
              )}
            </Left>
            <Body>
              <Text numberOfLines={1} style={styles.serviceTitle}>
                {rowData.title}
              </Text>
              {rowData.location.formatted_address ? (
                <Text note numberOfLines={1} style={styles.serviceAddress}>
                  {rowData.location.formatted_address}
                </Text>
              ) : null}

              {distance ? (
                <Text note style={styles.serviceDist}>
                  {distance} KM
                </Text>
              ) : null}
              <View style={styles.serviceAction}>
                <StarRating
                  starRate={
                    rowData.hasOwnProperty('ratings')
                      ? this.averageRating(rowData.ratings)
                      : 0
                  }
                />
                {/*{this.averageRating(rowData.ratings) > 0 ?
                            <Text style={{fontSize: 20, fontWeight: '400', color: '#ffffff'}}>
                                <Icon name={'star'}
                                    style={{color: '#4d94ff'}}/> : {rowData.hasOwnProperty('ratings') ? this.averageRating(rowData.ratings) : 0}
                                </Text> : null}*/}
              </View>
            </Body>
            <Right>
              {data.item.contact || data.item.contact1 ? (
                <Button
                  transparent
                  style={styles.serviceIconBtn}
                  onPress={() => {
                    MyFunctions._callPhone(
                      data.item.contact
                        ? data.item.contact
                        : data.item.contact1,
                    );
                  }}>
                  {/*<Icon name={'call'} color={'green'}/>*/}
                  <Icon name={'phone'} size={20} style={styles.catIcon} />
                </Button>
              ) : null}
            </Right>
          </ListItem>
        </TouchableWithoutFeedback>
      </View>
    );
  };

  _renderItem({item, index}) {
    console.log(item, index);
    return (
      <View key={index} style={{flex: 1, width: '100%'}}>
        <Thumbnail
          square
          style={{
            width: '100%',
            height: Math.round(viewportWidth * 0.29),
            resizeMode: 'cover',
          }}
          source={{uri: settings.IMAGE_URL + item.src}}
        />
      </View>
    );
  }

  _handleProductPress = pro => {
    // Navigation.push(this.props.componentId, {
    //     component: {
    //         name: "ProductDetail",
    //         passProps: {
    //             Id: pro._id
    //         }
    //     }
    // });

    this.props.navigation.navigate('ProductDetail', {Id: pro._id});
  };

  _onScroll = event => {
    // Simple fade-in / fade-out animation
    const CustomLayoutLinear = {
      duration: 1000,
      create: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity,
      },
      delete: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity,
      },
    };
    // Check if the user is scrolling up or down by confronting the new scroll position with your own one
    const currentOffset = event.nativeEvent.contentOffset.y;
    const direction =
      currentOffset > 0 && currentOffset > this._listViewOffset ? 'down' : 'up';
    // If the user is scrolling down (and the action-button is still visible) hide it
    const isActionButtonVisible = direction === 'up';
    if (isActionButtonVisible !== this.state.isActionButtonVisible) {
      LayoutAnimation.configureNext(CustomLayoutLinear);
      this.setState({isActionButtonVisible});
    }
    // Update your scroll position
    this._listViewOffset = currentOffset;
    updateCounts();
  };

  _renderProduct = (data, index) => {
    let item = data.item;
    return (
      <TouchableOpacity
        key={item._id}
        onPress={() => this._handleProductPress(item)}
        style={[
          customStyle.productContainerStyle,
          {borderTopLeftRadius: 4, borderTopRightRadius: 5},
        ]}>
        {/*<Product key={item._id} product={item}/>*/}
        <View
          key={item._id}
          style={[customStyle.Card, {top: 0, left: 0, rigth: 0}]}>
          <CardItem cardBody style={{width: '100%', borderRadius: 5}}>
            <Image
              source={{uri: settings.IMAGE_URL + item.images[0]}}
              style={{
                flex: 1,
                width: undefined,
                height: 104,
                width: 104,
                resizeMode: 'cover',
                borderRadius: 4,
                marginBottom: 8,
              }}
            />
            {/* <View
                            style={{
                                position: 'absolute',
                                top: 5,
                                left: 5,
                                right: 5,
                                bottom: 5,
                                borderWidth: 1,
                                borderColor: 'rgba(253, 253, 253, 0.2)',
                            }}
                        /> */}
          </CardItem>
          {/* {item.discount ? (
                        <View
                            style={{
                                position: 'absolute',
                                top: 5,
                                right: 5,
                                backgroundColor: colors.primary,
                                opacity: 1,
                                borderRadius: 5,
                                textAlign: 'center',
                                padding: 2,
                                zIndex: 1,
                            }}>
                            <Text style={{ fontSize: 8, color: 'white' }}>
                                {item.discount}% off
                            </Text>
                        </View>
                    ) : null} */}
          <CardItem style={{paddingTop: 0, paddingLeft: 5}}>
            <Body>
              <View style={{height: 35}}>
                <Text note numberOfLines={2} style={{fontWeight: 'bold'}}>
                  {/* style={{ fontSize: 12, color: colors.primaryText }}
                                 numberOfLines={1}> */}
                  {item.title}
                </Text>
              </View>
              <Text
                style={{
                  color: colors.primary,
                  fontWeight: '700',
                  fontSize: 14,
                }}>
                Rs. {item.price - (item.price * item.discount) / 100}
              </Text>
              {item.discount ? (
                <>
                  <Text
                    style={{
                      color: colors.body_color,
                      fontWeight: '400',
                      fontSize: 12,
                      textDecorationLine: 'line-through',
                      textDecorationStyle: 'solid',
                    }}>
                    Rs. {item.price}
                  </Text>
                  <Text
                    style={{
                      color: colors.body_color,
                      fontWeight: '400',
                      fontSize: 10,
                    }}>
                    {item.discount}% off
                  </Text>
                </>
              ) : null}
              {/* <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    width: '100%', alignSelf: 'center'
                                }}>
                                <Icon name={'home'} size={10} color={colors.gray_200} />
                                <Text
                                    numberOfLines={1}
                                    note
                                    style={{ fontSize: 12, marginLeft: 3, marginRight: 0 }}>
                                    {item.Service.title || ''}
                                </Text>
                            </View>
                            <View style={{ flex: 1, width: '100%', alignItems: 'center' }}>
                                <Text
                                    note
                                    style={{
                                        fontSize: 10,
                                        paddingLeft: 2,
                                        paddingRight: 2,
                                        zIndex: 1000,
                                        backgroundColor: '#fdfdfd',
                                    }}>
                                    Rs. {item.price}{item.unit ? ("/" + item.unit) : ""}
                                </Text>
                            </View> */}
            </Body>
          </CardItem>
        </View>
      </TouchableOpacity>
    );
  };

  handleKeySearch = e => {
    console.log(e.nativeEvent);
    if (e.nativeEvent.key == 'Search') {
      dismissKeyboard();
      this._search();
    }
  };

  closePickLocation() {
    // console.log('method Called');
    this.setState({pickLocation: false});
  }

  render() {
    const {loggedUser} = this.state;
    const profileImage = loggedUser ? loggedUser.profile.profileImage : null;
    // console.log(loggedUser,profileImage)
    return (
      <>
        <StatusBar backgroundColor={colors.statusBar} />
        <SafeAreaView style={{flex: 1, backgroundColor: colors.whiteText}}>
          <View
            style={{
              backgroundColor: colors.appLayout,
              height: this.state.isActionButtonVisible ? 110 : 50,
            }}>
            <View style={customStyle.topbarHeader}>
              <Text style={customStyle.topbarLogo}>Geniee</Text>
              <View style={customStyle.topbarActionIcons}>
                <NotificationIcon navigation={this.props.navigation} />

                {/* <Button
                        style={{marginHorizontal:8 }}
                            onPress={() => this.props.navigation.navigate( 'WishListEF')}
                            transparent>
                            <Icon name="heart" style={{ fontSize: 22, color: 'white'}} />
                            {this.state.wishList.length > 0 ? (
                                <Badge style={{ position: 'absolute', top: 0, right: -7, borderWidth: 2, borderColor: colors.appLayout }}>

                                    {this.state.wishList.length}

                                </Badge>
                            ) : null}
                        </Button> */}

                <CartIcon
                  navigation={this.props.navigation}
                  style={customStyle.actionIcon}
                />

                <TouchableOpacity
                  style={{marginHorizontal: 0}}
                  onPress={() =>
                    this.props.navigation.navigate(
                      loggedUser ? 'Profile' : 'SignIn',
                    )
                  }>
                  <Icon name="user" style={customStyle.actionIcon} />
                </TouchableOpacity>

                {/*<Button transparent onPress={this.handleOnPress}>*/}
                {/*<Icon name={'search'} size={25} color={'white'}/></Button>*/}
              </View>
            </View>
            {this.state.isActionButtonVisible ? (
              <Item search style={styles.searchWrapper}>
                <Button
                  transparent
                  disabled={this.state.query.length < 3}
                  onPress={this._search.bind(this)}>
                  <Icon
                    style={styles.searchIcon}
                    // style={{
                    //     paddingHorizontal: 20,
                    //     fontSize: this.state.query.length > 2 ? 20 : 15,
                    //     color:
                    //         this.state.query.length > 2 ? colors.unset : undefined,
                    //         opacity:0.5,
                    // }}

                    name={'search'}
                    color="rgba(255,255,255,0.87)"
                  />
                </Button>
                <Input
                  style={{fontFamily: 'Roboto', fontWeight: '300'}}
                  placeholder={'Search anything...'}
                  placeholderTextColor="rgba(255,255,255,0.87)"
                  underlineColorAndroid="rgba(0,0,0,0)"
                  returnKeyType="search"
                  onSubmitEditing={this._search}
                  onChangeText={searchText => {
                    this.setState({query: searchText});
                  }}
                />
              </Item>
            ) : null}
          </View>
          {/*{this.state.loading ? <ActivityIndicator style={{flex: 1}}/> : null}*/}

          <Content
            onScroll={this._onScroll}
            style={{
              width: '100%',
              flex: 1,
              paddingLeft: 10,
              paddingTop: 10,
            }}>
            {/*NEARBY SERVICE PROVIDERS LIST START*/}
            {this.state.nearByservice === '' ? null : this.state.nearByservice >
              0 ? (
              <View style={styles.block}>
                <View style={customStyle.blockHeader}>
                  <Text style={customStyle.blockTitle}>
                    Services/Store nearby
                  </Text>
                  <Button
                    style={{paddingRight: 10}}
                    transparent
                    onPress={() =>
                      this.props.navigation.navigate('ServiceList', {
                        Region: this.region,
                      })
                    }>
                    {/* <Text style={customStyle.buttonOutlinePrimaryText}>
                                        View All
                                    </Text> */}
                    <Icon
                      name="arrow-right"
                      style={customStyle.blockHeaderArrow}
                    />
                  </Button>
                </View>
                <FlatList
                  contentContainerStyle={{
                    paddingBottom: 14,
                    paddingLeft: 14,
                    paddingRight: 14,
                    marginLeft: 0,
                  }}
                  data={this.state.nearByservice}
                  horizontal={true}
                  keyExtractor={(item, index) => item._id}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({item, index}) => (
                    <TouchableOpacity
                      onPress={() => {
                        this.props.navigation.navigate('ServiceDetail', {
                          Id: item,
                        });
                      }}>
                      <View
                        key={item._id}
                        style={{
                          backgroundColor: 'white',
                          marginRight: 8,
                          // height: 120,
                          width: 310,
                          flexDirection: 'column',
                          // alignItems: 'center',
                          // paddingHorizontal: 10,
                          // paddingBottom: 10,
                          borderRadius: 4,
                        }}>
                        <View
                          style={{height: 147, width: 310, borderRadius: 4}}>
                          <Thumbnail
                            style={{
                              width: 310,
                              height: 147,
                              marginBottom: 10,
                              borderRadius: 4,
                              resizeMode: 'cover',
                            }}
                            square
                            source={
                              item.coverImage
                                ? {uri: settings.IMAGE_URL + item.coverImage}
                                : require('../images/no-image.png')
                            }
                          />
                          <LinearGradient
                            colors={[
                              'transparent',
                              'rgba(0, 0, 0, 0.5)',
                              'rgba(0, 0, 0, 0.6)',
                            ]}
                            style={{
                              position: 'absolute',
                              bottom: 0,
                              width: '100%',
                              padding: 5,
                              paddingTop: 10,
                              borderBottomLeftRadius: 5,
                              borderBottomRightRadius: 5,
                            }}>
                            <Text style={{color: 'white', fontSize: 15}}>
                              {item.title}
                            </Text>
                          </LinearGradient>
                        </View>
                        <View style={{flexDirection: 'row', padding: 0}}>
                          <View
                            style={{
                              flex: 3,
                              alignItems: 'flex-start',
                            }}>
                            {/*<Text style={styles.cardTitle} numberOfLines={1}>*/}
                            {/*{item.title}*/}
                            {/*</Text>*/}
                            {item.category ? (
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}>
                                {/* <Icon

                                                                    name={'tag'}
                                                                    size={12}
                                                                    color={colors.gray_100}
                                                                /> */}

                                <Text
                                  numberOfLines={1}
                                  style={customStyle.itemTitle}>
                                  {item.category.mainCategory || ''}
                                </Text>
                              </View>
                            ) : null}
                            {/*<Text note style={styles.cardNote}*/}
                            {/*numberOfLines={1}>{item.location.formatted_address}</Text>*/}
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
                                <Text
                                  note
                                  style={{
                                    fontSize: 12,
                                    color: colors.text_muted,
                                  }}>
                                  {Math.round(item.dist.calculated * 100) / 100}{' '}
                                  km away
                                </Text>
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
                                  style={{
                                    fontSize: 14,
                                    color: colors.text_muted,
                                  }}
                                />
                                <Text
                                  note
                                  style={{
                                    fontSize: 12,
                                    marginLeft: 4,
                                    color: colors.text_muted,
                                  }}>
                                  {item.hasOwnProperty('ratings')
                                    ? Math.round(item.Rating.avgRate)
                                    : 1}{' '}
                                  (
                                  {item.hasOwnProperty('ratings')
                                    ? tem.Rating.count
                                    : 0}
                                  )
                                </Text>
                              </View>

                              {/*{item.Category?*/}
                              {/*<View style={{*/}
                              {/*flexDirection: 'row',*/}
                              {/*alignItems: 'center',*/}
                              {/*justifyContent: 'center',*/}
                              {/*}}>*/}
                              {/*<Text>*/}
                              {/*<Icon name={'tag'} size={16}*/}
                              {/*color={colors.warning}/></Text>*/}
                              {/*<Text note>*/}
                              {/*{item.Category.subCategory}*/}
                              {/*</Text>*/}

                              {/*</View>:null}*/}
                            </View>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )}
                />
              </View>
            ) : null}

            {/*NEARBY SERVICE PROVIDERS LIST END*/}

            {/*SPECIAL RESTURANT LISTING START*/}
            <View style={styles.block}>
              <View style={customStyle.blockHeader}>
                <Text
                  style={[
                    styles.blockTitle,
                    {marginRight: 37, width: 278, paddingRight: 20},
                  ]}>
                  Hungry? Order delicious foods now.
                </Text>
                <Button style={{paddingRight: 0}} transparent>
                  <Icon
                    name="arrow-right"
                    style={customStyle.blockHeaderArrow}
                  />
                </Button>
              </View>
              <View
                style={[
                  styles.blockBody,
                  {marginTop: 10, marginBottom: 15, padding: 0},
                ]}>
                <FlatList
                  contentContainerStyle={{paddingBottom: 15}}
                  data={this.state.resturants}
                  horizontal={true}
                  keyExtractor={(item, index) => index.toString()}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({item, index}) => (
                    <View
                      key={index.toString()}
                      style={[
                        styles.card,
                        {
                          marginHorizontal: 5,
                          width: viewportWidth / 2.5,
                        },
                      ]}>
                      <TouchableOpacity
                        onPress={
                          item.hasOwnProperty('onPress')
                            ? item.onPress
                            : () =>
                                this.props.navigation.navigate(
                                  'ServiceDetail',
                                  {Id: item},
                                )
                        }>
                        <View>
                          <Image
                            onPress={() => item.onPress}
                            source={
                              item.hasOwnProperty('coverImage')
                                ? {uri: settings.IMAGE_URL + item.coverImage}
                                : item.imgSource
                            }
                            style={{
                              flex: 1,
                              height: 100,
                              width: 158,
                              resizeMode: 'cover',
                              // margin: 5,
                            }}
                          />
                          {/* {item.title ? (
                                                    <View
                                                        style={{
                                                            top: 0,
                                                            left: 0,
                                                            right: 0,
                                                            bottom: 0,
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            position: 'absolute',
                                                        }}>
                                                        <Text
                                                            style={{
                                                                color: 'white',
                                                                fontWeight: '500',
                                                                fontSize: 30,
                                                            }}>
                                                            {item.title}
                                                        </Text>
                                                    </View>
                                                ) : null} */}

                          <Text numberOfLines={1} style={customStyle.itemTitle}>
                            {item.title}
                          </Text>
                          {/* needs to be made dynamic */}
                          <Text
                            style={{
                              fontSize: 12,
                              color: colors.text_muted,
                              marginVertical: 2,
                            }}>
                            {item.tags}
                          </Text>
                          {/* needs to be made dynamic */}
                          {/* <Text style={{fontSize:10,color:colors.text_muted}}>Durbarmarg</Text> */}

                          <Text note numberOfLines={2}>
                            {item.description}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  )}
                />
              </View>
            </View>

            {/*SPECIAL RESTURANT LISTING END*/}

            {this.state.Adds.length > 0 ? (
              <View style={[styles.block, {marginVertical: 20}]}>
                <View
                  style={{
                    minHeight: Math.round(viewportWidth * 0.29),
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                  }}>
                  <Carousel
                    ref={c => {
                      this._carousel = c;
                    }}
                    data={this.state.Adds}
                    renderItem={this._renderItem}
                    sliderWidth={viewportWidth - 20}
                    itemWidth={viewportWidth - 20}
                    //  slideStyle={{ viewportWidth: viewportWidth }}
                    inactiveSlideOpacity={1}
                    inactiveSlideScale={1}
                    autoplay={true}
                    loop={true}
                  />
                </View>
              </View>
            ) : null}

            {/*POPULAR PRODUCTS LIST START*/}
            {this.state.popularProducts.length > 0 ? (
              <View style={styles.block}>
                <View style={styles.blockHeader}>
                  <Text style={styles.blockTitle}>Popular</Text>
                  <Button
                    style={{paddingRight: 10}}
                    transparent
                    onPress={() =>
                      this.props.navigation.navigate('AllProducts', {
                        Region: this.region,
                      })
                    }>
                    {/* <Text style={customStyle.buttonOutlinePrimaryText}>
                                        View All
                                    </Text> */}
                    <Icon
                      name="arrow-right"
                      size={20}
                      color={colors.gray_200}
                    />
                  </Button>
                </View>
                <FlatList
                  contentContainerStyle={{
                    paddingBottom: 15,
                    marginHorizontal: 8,
                  }}
                  data={this.state.popularProducts}
                  horizontal={true}
                  keyExtractor={(item, index) => item._id}
                  showsHorizontalScrollIndicator={false}
                  //  numColumns={3}
                  renderItem={(item, index) => this._renderProduct(item, index)}
                />

                {/*<View style={{flex:1,flexDirection:'row', flexWrap:'wrap', alignItems:'flex-start',justifyContent:'flex-start',marginBottom:20}}>*/}
                {/*{this.state.popularProducts.map((item)=>this._renderProduct(item))}*/}
                {/*</View>*/}
              </View>
            ) : null}

            {/*POPULAR PRODUCTS LIST LIST END*/}

            {/*CATEGORIES LIST START*/}
            {this.state.categories.length > 0 ? (
              <View style={[styles.block, {marginBottom: 80}]}>
                <View style={styles.blockHeader}>
                  <Text style={styles.blockTitle}>Categories</Text>
                  <Button transparent onPress={() => this.setViewAll()}>
                    <Text style={customStyle.buttonOutlinePrimaryText}>
                      {this.state.viewAll ? 'Vew Less' : 'View All'}
                    </Text>
                  </Button>
                </View>
                <FlatList
                  contentContainerStyle={{
                    marginTop: 10,
                    paddingBottom: 10,
                    //   alignItems:'center',
                    justifyContent: 'space-around',
                    // flexWrap: 'wrap',
                    // flexDirection: 'row',
                  }}
                  data={this.state.categories}
                  //horizontal={true}
                  keyExtractor={(item, index) => index.toString()}
                  // showsHorizontalScrollIndicator={false}
                  renderItem={this.renderCategoryItem}
                  numColumns={Math.round(viewportWidth / 100)}
                />
                {/*  {this.state.viewAll? null:
                          <Button onPress={() => {this.setViewAll()}}
                            style={[customStyle.buttonOutlinePrimary,{height:25,marginBottom:30,width:130,alignSelf:'center',backgroundColor:'white'}]}>
                            <Text style={customStyle.buttonOutlinePrimaryText}>View All</Text></Button>} */}
              </View>
            ) : null}
          </Content>
          {/* <FooterTabs route={'Home'} componentId={this.props.componentId}/> */}
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // flexDirection: 'column',
    // flexWrap: 'wrap',
  },
  containerStyle: {
    paddingLeft: 5,
    paddingVertical: 5,
    //backgroundColor: 'white',
    borderWidth: 0,
    // marginVertical: 4,
    borderColor: '#808080',
    //elevation: 5,
    //width: (viewportWidth-60)/3,
    width: 100,
    margin: 5,
    height: 100,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  catIcon: {
    opacity: 0.5,
    padding: 10,
    borderRadius: 100,
    //backgroundColor: colors.appLayout,
    color: 'white',
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoriesIcon: {
    opacity: 0.5,
    padding: 10,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabIcon: {
    color: '#ffffff',
  },
  activeTabText: {
    color: '#ffffff',
  },
  serviceList: {
    //backgroundColor: colors.inputBackground,
    backgroundColor: '#4d94ff0a',
    //marginVertical: 5,
    //marginHorizontal: '2%',
    borderRadius: 0,
    borderBottomColor: '#4d94ff',
    borderBottomWidth: 5,
  },
  serviceTitle: {
    color: '#000000',
    fontWeight: 'bold',
  },
  serviceAddress: {
    color: '#000000',
  },
  serviceDist: {
    color: '#000000',
  },
  serviceAction: {
    //flexDirection: 'row',
    //justifyContent: 'center',
    //alignItems: 'center',
  },
  serviceIconBtn: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentList: {
    //marginVertical: 3,
    //paddingVertical: 3
  },
  image: {
    width: 50,
    height: 56,
    borderRadius: 25,
    backgroundColor: '#000000',
  },
  banner: {
    width: 80,
    height: 50,
    borderRadius: 3,
    backgroundColor: '#000000',
  },
  footerTab: {
    backgroundColor: '#4d94ff',
    borderTopWidth: 3,
    borderTopColor: '#000000',
  },
  activeTab: {
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
  },
  searchWrapper: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginLeft: 14,
    marginRight: 14,
    marginVertical: 10,
    marginTop: 15,
    height: 40,
    zIndex: 1,
    borderRadius: 10,
    borderBottomWidth: 0,
    color: 'rgba(255,255,255,0.2)',
  },
  searchIcon: {
    marginLeft: 14,
    marginRight: 16,
    fontSize: 16,
  },
  searchInput: {
    // color:'rgba(255,255,255,0.87)',
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    // backgroundColor:rgba(255,255,255,0.2)
  },

  block: {},
  blockHeader: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // borderBottomWidth: 1,
    borderColor: '#E2E2E2',
    marginHorizontal: 16,
    // paddingHorizontal: 15,
    //  backgroundColor:'white'
  },
  blockTitle: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Roboto',
    color: colors.gray_100,
  },
  blockBody: {
    padding: 10,
    paddingTop: 0,
  },
  card: {
    overflow: 'hidden',
    borderRadius: 4,
    flexGrow: 1,
    backgroundColor: 'white',
  },
  cardWrapper: {},
  cardBody: {
    alignItems: 'flex-start',
    padding: 10,
  },
  cardItemCenter: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'column',
  },
  cardIcon: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    flex: 1,
  },
  cardImage: {
    width: '100%',
    flexGrow: 1,
    paddingVertical: 10,
  },
  cardText: {
    padding: 10,
  },
  cardTitle: {
    color: colors.gray_100,
    fontSize: 15,
    marginBottom: 3,
    fontFamily: 'Roboto',
  },
  cardNote: {
    marginBottom: 5,
  },
});
export default Meteor.withTracker(() => {
  return {
    loggedUser: Meteor.user(),
    categories: Meteor.collection('MainCategories').find(),
    notificationCount: Meteor.collection('newNotificationCount').find(),
  };
})(Dashboard);
