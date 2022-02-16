import React, { Component, useCallback, useEffect, useState } from 'react';
import Meteor from '../../../react-native-meteor';
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
  RefreshControl,
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
import { colors, customStyle, variables } from '../../../config/styles';
import { Badge, Avatar, ActivityIndicator } from 'react-native-paper';
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
import settings from '../../../config/settings';
import StarRating from '../../../components/StarRating/StarRating';
import Product from '../../../components/Store/Product';
import MyFunctions from '../../../lib/MyFunctions';
import CogMenu from '../../../components/CogMenu';
import SplashScreen from 'react-native-lottie-splash-screen';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-community/async-storage';
import { getProfileImage } from '../../../config/settings';
import LinearGradient from 'react-native-linear-gradient';
import FooterTabs from '../../../components/FooterTab';
import NotificationIcon from '../../../components/HeaderIcons/NotificationIcon';
import CartIcon from '../../../components/HeaderIcons/CartIcon';
import { customPaperTheme } from '../../../config/themes';
import { MaterialColors } from '../../../constants/material-colors';
import { Button as RNPButton } from 'react-native-paper';
import { lowerCase, set } from 'lodash';
import Moment from 'moment';
import Data from '../../../react-native-meteor/Data';
import { connect } from 'react-redux';
import { categorySelector } from '../../../store/selectors';
import AIcon from 'react-native-vector-icons/AntDesign';
import Statusbar from '../../Shared/components/Statusbar';

let isDashBoard = true;

const IMAGE_URL = 'http://139.59.59.117/api/files/';
const Home = props => {
  const [viewAll, setViewAll] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchMode, setSearchMode] = useState(false);
  const [showSearchBar, setShowSearchbar] = useState(false);
  const [adds, setAdds] = useState([]);
  const [query, setQuery] = useState('');
  const [pickLocation, setPickLocation] = useState(false);
  const [backClickCount, setBackClickCount] = useState(0);
  const [wishList, setWhishList] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);
  const [nearByservice, setNearByService] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [isActionButtonVisible, setIsActionButtonVisible] = useState(true);
  const [loggedUser, setLoggedUser] = useState(Meteor.user());
  const [storesList, setStoresList] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [timeForBanner, setTimeForBanner] = useState();
  const [userCount, setUserCount] = useState(0);
  const [displayUserCount, setDisplayUserCount] = useState(true);

  const currentDate = new Date();
  let arrayholder;
  let currentSearch = '';
  let region = {
    latitude: 27.71202,
    longitude: 85.31295,
  };
  let granted;
  let watchID;
  let springValue = new Animated.Value(100);

  _listViewOffset = 0;
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
  //onClick = onClick.bind(this);

  useEffect(async () => {
    SplashScreen.hide();
    let user = Meteor.user();
    setLoggedUser(user);
    updateCounts();
    setCategories(props.categories);
    //
    Meteor.subscribe('aggChatChannels');
    // Get Nearby service
    getNearByServices();

    //Get Popular Products
    getPopularProducts()

    //Get Popular Products
    getPopularStores()

    if (Platform.OS === 'ios') {
      granted = await Geolocation.requestAuthorization('always');
    } else {
      granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message:
            'This App needs access to your location ' +
            'so we can know where you are.',
        },
      );
    }
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      Geolocation.getCurrentPosition(
        position => {
          //  console.log(position);
          let region = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          region = region;
          //Get Nearby services
          _fetchNearByServices();
        },
        error => {
          // See error code charts below.
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    } else {
      console.log('Location permission denied');
    }
    watchID = Geolocation.watchPosition(
      position => {
        //   console.log(position);
        let region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        region = region;
        _fetchNearByServices();
      },
      error => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );

    messageListener().catch(e => {
      console.log(e);
    });

    // Meteor.call('getPopularResturants', (err, res) => {
    //   if (!err) {
    //     setResturants(res, [...resturants, res]);
    //   }
    // });

    Meteor.call('getUserCount', (err, res) => {
      if (res) {
        setUserCount(res.result);
      }
    })

    //Timer
    let end = moment(currentDate).add(5, 'days');
    let duration = moment.duration(end.diff(currentDate, 'days'));
    let hours = duration.asHours();
    setTimeForBanner(duration);

  }, []);

  const getNearByServices = useCallback(() => {
    Meteor.call('getRandomServices', [region.longitude, region.latitude], 15, 10, (err, res) => {
      setLoading(false);
      setIsRefreshing(false);
      if (!err) {
        setNearByService(res.result);
      } else {
        console.log(err);
      }
    },
    );
  }, []);

  const getPopularProducts = useCallback(() => {
    Meteor.call('getPopularProducts', 0, 6, (err, res) => {
      setLoading(false);
      setIsRefreshing(false);
      if (!err) {
        setPopularProducts(res.result);
      } else {
        console.log(err);
      }
    });
  }, []);

  const getPopularStores = useCallback(() => {
    Meteor.call('getPopularStores', (err, res) => {
      setLoading(false);
      setIsRefreshing(false);
      if (!err) {
        setStoresList(res);
      } else {
        console.log(err);
      }
    });
  }, [])

  const _fetchNearByServices = () => {
    const data = {
      skip: 0,
      limit: 10,
      coords: [region.longitude, region.latitude],
      subCatIds: null,
    };
    //   Meteor.call('getServicesNearBy', data, (err, res) => {
    Meteor.call(
      'getRandomServices',
      [region.longitude, region.latitude],
      15,
      10,
      (err, res) => {
        console.log(err, res);
        setLoading(false);
        if (!err) {
          setNearByService(res.result);
        } else {
          console.log(err);
        }
      },
    );
  };

  const handleViewAll = () => {
    let prevState = viewAll;
    const categories = prevState
      ? props.categories.slice(0, 6)
      : props.categories;
    setViewAll(!prevState);
    //setCategories(categories);
  };

  const _spring = () => {
    ToastAndroid.showWithGravityAndOffset(
      'Tap again to Exit.',
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      0,
      50,
    );

    setState({ backClickCount: 1 }, () => {
      Animated.sequence([
        Animated.spring(springValue, {
          toValue: -0.15 * viewportHeight,
          friction: 5,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(springValue, {
          toValue: 100,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setBackClickCount(0);
      });
    });
  };

  const messageListener = async () => {
    notificationOpenedListener = messaging().onNotificationOpenedApp(
      notificationOpen => {
        const { title, body } = notificationOpen.notification;
        // showAlert(title, body);
        console.log('onNotificationOpened', notificationOpen);

        if (notificationOpen.notification.data.navigate) {
          console.log('subscribe & Navigate');
        }
      },
    );

    const notificationOpen = await messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        return remoteMessage;
      });
    if (notificationOpen) {
      const { title, body } = notificationOpen.notification;
      //  showAlert(title, body);
      console.log('notificationOpen', notificationOpen.notification);
      if (notificationOpen.notification.data.title == 'REMOVE_AUTH_TOKEN') {
      }
      if (notificationOpen.notification.data.navigate) {
        console.log('subscribe & Navigate');
        props.navigation.navigate(notificationOpen.notification.data.route, {
          Id: notificationOpen.notification.data.Id,
        });
      }
    }
  };

  const updateCounts = async () => {
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
    setWhishList(wishList);
    setTotalCount(cartList.length);
  };

  const _search = text => {
    if (query) {
      props.navigation.navigate('SearchResult', {
        SearchText: query,
        Region: region,
      });
    }
  };

  const _handlItemPress = service => {
    service.avgRate = averageRating(service.ratings);
    props.navigation.push('ServiceDetail', { Id: service._id });
  };

  const averageRating = arr => {
    let sum = 0;
    arr.forEach(item => {
      sum = sum + item.count;
    });
    var avg = sum / arr.length;
    return Math.round(avg);
  };

  const _itemClick = item => {
    let Ids = [];
    item.subCategories.map(item => {
      Ids.push(item.subCatId);
    });
    props.navigation.navigate('ServiceList', {
      Id: Ids,
      Region: region,
    });
  };

  const gotoEatFit = () => {
    console.log('Eat-Fit');
    props.navigation.navigate('LandingPageEF');
  };

  const gotoBB = () => {
    props.navigation.navigate('ProductsBB');
  };

  const onCategoryClick = item => {
    props.navigation.navigate('StoreList', {
      categoryId: item._id,
      title: item.title,
    });
  };
  const renderCategoryItem = (data, index) => {
    var item = data.item;
    return (
      <View>
        <View key={data.index.toString()} style={styles.containerStyle}>
          <TouchableOpacity onPress={() => onCategoryClick(item)}>
            <Image
              style={{ height: 50, width: 50 }}
              source={{
                uri: settings.IMAGE_URLS + item.image,
              }}
            />
            {/*</View>
                </ImageBackground>*/}
          </TouchableOpacity>
        </View>
        <View style={{ width: 65, marginBottom: 5 }}>
          <Text style={{ textAlign: 'center', fontSize: 10 }}> {item.title}</Text>
        </View>
      </View>
    );
  };

  const _getListItem = data => {
    let rowData = data.item;
    let distance;
    if (rowData.location && rowData.location.geometry) {
      distance = MyFunctions.calculateDistance(
        region.latitude,
        region.longitude,
        rowData.location.geometry.location.lat,
        rowData.location.geometry.location.lng,
      );
    }
    // console.log(distance);
    return (
      <View key={data.item._id} style={styles.serviceList}>
        <TouchableWithoutFeedback
          onPress={() => {
            _handlItemPress(data.item);
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
                      ? averageRating(rowData.ratings)
                      : 0
                  }
                />
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

  const _handleProductPress = pro => {
    props.navigation.navigate('ProductDetail', { Id: pro._id, data: pro });
  };

  const _onScroll = event => {
    // Simple fade-in / fade-out animation
    const CustomLayoutLinear = {
      duration: 100,
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
      currentOffset > 0 && currentOffset > _listViewOffset ? 'down' : 'up';
    // If the user is scrolling down (and the action-button is still visible) hide it
    const _isActionButtonVisible = direction === 'up';
    if (_isActionButtonVisible !== isActionButtonVisible) {
      LayoutAnimation.configureNext(CustomLayoutLinear);
      setIsActionButtonVisible(_isActionButtonVisible);
      //setState({ isActionButtonVisible });
    }
    // Update your scroll position
    _listViewOffset = currentOffset;
  };

  const addToWishlist = (productId) => {
    //Added to wishlist
    let index = wishList.findIndex(item => { return item == productId });
    if (index > -1)
      wishList.splice(index, 1);
    else
      wishList.push(productId);

    AsyncStorage.setItem('myWhishList', JSON.stringify(wishList));
    ToastAndroid.showWithGravityAndOffset(
      index > - 1 ? 'Product removed from  Wishlist !' : 'Product added to  Wishlist !',
      ToastAndroid.LONG,
      ToastAndroid.TOP,
      0,
      50,
    );
    // to re-render after adding to to wishlist.
    updateCounts();
  }

  const _renderProduct = (data, index) => {
    let item = data.item;
    let isInWishlist = wishList.includes(item._id);
    return (
      <TouchableOpacity
        key={item._id}
        onPress={() => _handleProductPress(item)}
        style={[
          customStyle.productContainerStyle,
          { borderTopLeftRadius: 4, borderTopRightRadius: 5 },
        ]}>
        <View
          key={item._id}
          style={[customStyle.Card, { top: 0, left: 0, rigth: 0 }]}>
          <View style={{ width: '100%', borderRadius: 5 }}>
            <Image
              source={{ uri: settings.IMAGE_URLS + item.images[0] }}
              style={styles.productImage}
            />
          </View>
          <View style={{ position: 'absolute', top: 4, right: 4, backgroundColor: '#FAFBFF', height: 30, width: 30, borderRadius: 4, justifyContent: 'center', alignItems: 'center' }}>
            {isInWishlist ?
              <FAIcon name='heart' onPress={() => { addToWishlist(item._id) }} style={{ fontSize: 25, color: customPaperTheme.GenieeColor.pinkColor }} /> :
              <FAIcon name='heart' onPress={() => { addToWishlist(item._id) }} style={{ fontSize: 25, color: customPaperTheme.GenieeColor.lightDarkColor }} />}
          </View>
          <View>
            <View>
              <Text numberOfLines={1} style={{ fontSize: 10 }}>From {item.business[0].businessName}</Text>
              <Text numberOfLines={2} style={styles.storeDescription}>{item.description}</Text>
              <View style={{ flexDirection: 'row' }}>
                {item.discount ? (
                  <>
                    <Text style={styles.originalPrice}>Rs. {item.price}</Text>
                    <Text style={styles.discountPrice}>{item.discount}% off</Text>
                  </>
                ) : null}
              </View>
              <Text style={styles.finalPrice}>Rs. {item.price - (item.price * item.discount) / 100}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const _renderStore = (data, index) => {
    let item = data.item;
    return (
      <View
        key={item._id}
        onPress={() => { console.log('Visit Prssed'); }}
        style={[
          customStyle.productContainerStyle,
          { borderTopLeftRadius: 4, borderTopRightRadius: 5 },
        ]}>
        <View
          key={item._id}
          style={[customStyle.Card, { top: 0, left: 0, rigth: 0 }]}>
          <View style={{ width: '100%', borderRadius: 5 }}>
            <Image
              source={{ uri: settings.IMAGE_URLS + item.registrationImage }}
              style={styles.storeImage}
            />
          </View>
          {item.isApproved ? <View style={{ flexDirection: 'row', position: 'absolute', top: 50, left: 3 }}>
            <AIcon name='checkcircle' size={12} style={{ marginRight: 3, color: colors.statusBar }} />
            <Text style={{ fontSize: 12, }}>Verified</Text>
          </View> : null}
          <View>
            <View>
              <Text numberOfLines={1} style={{ fontSize: 10 }}>{item.city}</Text>
              <Text numberOfLines={2} style={styles.storeDescription}>{item.businessName}</Text>
              <View style={{ marginTop: 5, marginRight: 5 }}>
                <RNPButton
                  mode="text"
                  uppercase={false}
                  onPress={() => { props.navigation.navigate('StoreDetail', { data: item }) }}
                >
                  <Text style={{ fontSize: 10 }}>Visit</Text>
                  <Icon
                    name="chevron-right"
                    style={{ marginLeft: 10, marginTop: 10 }}
                  />
                </RNPButton>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const handleKeySearch = e => {
    console.log(e.nativeEvent);
    if (e.nativeEvent.key == 'Search') {
      dismissKeyboard();
      _search();
    }
  };

  const closePickLocation = () => {
    setPickLocation(false);
  };

  const onRefreshPage = () => {
    getNearByServices();
    getPopularProducts();
    getPopularStores();
  }

  const handleMerchantSeller = () => {
      loggedUser
        ? props.navigation.navigate('BecomeSeller', {
          data: loggedUser,
        })
        : props.navigation.navigate('SignIn');
  }
  
  const profileImage = loggedUser ? loggedUser.profile.profileImage : null;
  // console.log(loggedUser,profileImage)
  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.whiteText }}>
        <Statusbar />
        {/* {isRefreshing ? <ActivityIndicator style={{flex: 1}}/> : null} */}

        <Content
          onScroll={_onScroll}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefreshPage} />
          }
          style={{
            width: '100%', flex: 1, paddingTop: 8,
          }}>
          {/* GENIEE BANNER */}
          <View>
            <View style={styles.logoContainer}>
              <Image
                style={{ height: 30, width: 80 }}
                source={require('../../../images/geniee_logo.png')}
              />
              <View>
                <TouchableOpacity
                  style={{ marginHorizontal: 0, flexDirection: 'row', marginLeft: 'auto' }}>
                  <FAIcon
                    name="map-marker"
                    style={{
                      color: colors.statusBar, fontSize: 20, marginRight: 8,
                    }}
                  />
                  <Text style={{ fontSize: customPaperTheme.GenieeText.fontMinSize }}>Kathmandu</Text>
                </TouchableOpacity>
                <Text uppercase={false}
                  style={{
                    fontSize: 10, color: colors.statusBar, marginLeft: 65,
                  }}>
                  {Moment(currentDate).format('MMM Do YYYY')}{' '}
                </Text>
              </View>
            </View>
            <View style={{ marginHorizontal: 15 }}>
              <Image
                style={{ height: 120, width: '100%', resizeMode: 'stretch' }}
                source={require('../../../images/geniee_banner.png')}
              />
            </View>
            <View style={{ position: 'absolute', top: 225, left: 130, backgroundColor: '#FFE5E5', width: 90, height: 25, borderRadius: 6 }}>
              <Text style={{ color: 'red', textAlign: 'center', justifyContent: 'center' }} >{Moment(timeForBanner).format('HH:mm:ss')}</Text>
            </View>
            {displayUserCount ? <View>
              <TouchableOpacity
                onPress={() => handleMerchantSeller()}
                style={styles.merchantContainer}>
                <Image
                  style={styles.merchantImage}
                  source={require('../../../images/Avatar.png')}
                />
                <Text style={{
                  flex: 1,
                  marginTop: 15,
                  fontSize: 16
                }}>Become a merchant and reach {userCount}+ customers.</Text>
                <FAIcon name='x' style={{ fontSize: 18, marginTop: 10, marginRight: 10 }} onPress={() => setDisplayUserCount(false)} />
              </TouchableOpacity>
            </View> : null}
            {/* <View style={{ marginHorizontal: 15, marginVertical: 15 }}>
              <RNPButton
                mode="outlined"
                uppercase={false}
                onPress={() => {
                  loggedUser
                    ? props.navigation.navigate('BecomeSeller', {
                      data: loggedUser,
                    })
                    : props.navigation.navigate('SignIn');
                }}
                style={{
                  borderColor: colors.statusBar, borderWidth: 2, borderStyle: 'dotted',
                }}>
                <Text style={{ color: colors.statusBar }}>
                  Become a Merchant & Sell
                </Text>
              </RNPButton>
            </View> */}
            {/*CATEGORIES LIST START*/}
            {props.categories ? (
              props.categories.length > 0 ? (
                <View style={[styles.block, { marginVertical: 15 }]}>
                  <FlatList
                    contentContainerStyle={styles.categoriesContentStyle}
                    data={categories}
                    //horizontal={true}
                    keyExtractor={(item, index) => index.toString()}
                    // showsHorizontalScrollIndicator={false}
                    renderItem={renderCategoryItem}
                    numColumns={5}
                  />
                </View>
              ) : null
            ) : null}

            {/*Deal that might excite you*/}
            {popularProducts.length > 0 ? (
              <View style={styles.block}>
                <View style={styles.blockHeader}>
                  <Text style={[styles.blockTitle, { fontSize: 16 }]}>Deals that might excite you</Text>
                  <Text uppercase={false}
                    style={{
                      fontSize: 10, color: colors.statusBar, marginLeft: 65,
                    }}>
                    {Moment(currentDate).format('MMM Do YYYY')}{' '}
                  </Text>
                </View>
                <FlatList
                  contentContainerStyle={styles.popularProductsContentStyle}
                  data={popularProducts.slice(0, 6)}
                  numColumns={3}
                  keyExtractor={(item, index) => item._id}
                  showsHorizontalScrollIndicator={false}
                  renderItem={(item, index) => _renderProduct(item, index)}
                />
                <View style={{ marginTop: 5, marginRight: 5 }}>
                  <RNPButton
                    mode="text"
                    uppercase={false}
                    onPress={() => {
                      props.navigation.navigate('AllProduct', { data: popularProducts })
                    }}>
                    <Text style={{ fontSize: 12 }}>See All</Text>
                    <Icon
                      name="chevron-right"
                      style={{ marginLeft: 10, marginTop: 10 }}
                    />
                  </RNPButton>
                </View>
              </View>
            ) : null}

            {/*FEATURE STORE*/}
            {storesList && storesList.length > 0 ? (
              <View style={styles.block}>
                <View style={styles.blockHeader}>
                  <Text style={[styles.blockTitle, { fontSize: 16 }]}>
                    Featured Store
                  </Text>
                  <RNPButton
                    mode="text"
                    uppercase={false}
                    onPress={() => props.navigation.navigate('AllStore', { data: storesList })}>
                    <Text style={{ fontSize: 10, color: colors.statusBar }}>
                      See All
                    </Text>
                    <Icon
                      name="arrow-right"
                      style={customStyle.blockHeaderArrow}
                    />
                  </RNPButton>
                </View>
                <FlatList
                  contentContainerStyle={styles.popularProductsContentStyle}
                  data={storesList}
                  horizontal={true}
                  keyExtractor={(item, index) => item._id}
                  showsHorizontalScrollIndicator={false}
                  //  numColumns={3}
                  renderItem={(item, index) => _renderStore(item, index)}
                />
              </View>
            ) : null}

            {/*NEARBY SERVICE PROVIDERS LIST START*/}
            {storesList && storesList.length > 0 ? (
              <View style={styles.block}>
                <View style={styles.blockHeader}>
                  <Text style={[styles.blockTitle, { fontSize: 16 }]}>
                    Nearby Store
                  </Text>
                  <RNPButton
                    mode="text"
                    uppercase={false}
                    onPress={() => props.navigation.navigate('AllStore', { data: storesList })}>
                    <Text style={{ fontSize: 10, color: colors.statusBar }}>
                      See All
                    </Text>
                    <Icon
                      name="arrow-right"
                      style={customStyle.blockHeaderArrow}
                    />
                  </RNPButton>
                </View>
                <FlatList
                  contentContainerStyle={styles.popularProductsContentStyle}
                  data={storesList}
                  horizontal={true}
                  keyExtractor={(item, index) => item._id}
                  showsHorizontalScrollIndicator={false}
                  //  numColumns={3}
                  renderItem={(item, index) => _renderStore(item, index)}
                />
              </View>
            ) : null}

            {/*POPULAR STORE*/}
            {storesList && storesList.length > 0 ? (
              <View style={styles.block}>
                <View style={styles.blockHeader}>
                  <Text style={[styles.blockTitle, { fontSize: 16 }]}>
                    Popular Stores
                  </Text>
                  <RNPButton
                    mode="text"
                    uppercase={false}
                    onPress={() => props.navigation.navigate('AllStore', { data: storesList })}>
                    <Text style={{ fontSize: 10, color: colors.statusBar }}>
                      See All
                    </Text>
                    <Icon
                      name="arrow-right"
                      style={customStyle.blockHeaderArrow}
                    />
                  </RNPButton>
                </View>
                <FlatList
                  contentContainerStyle={styles.popularProductsContentStyle}
                  data={storesList}
                  horizontal={true}
                  keyExtractor={(item, index) => item._id}
                  showsHorizontalScrollIndicator={false}
                  //  numColumns={3}
                  renderItem={(item, index) => _renderStore(item, index)}
                />
              </View>
            ) : null}

            {/*POPUlAR IN STORE*/}
            {popularProducts.length > 0 ? (
              <View style={styles.block}>
                <View style={styles.blockHeader}>
                  <Text style={[styles.blockTitle, { fontSize: 16 }]}>
                    Popular in Stores
                  </Text>
                  <RNPButton
                    mode="text"
                    uppercase={false}
                    onPress={() => props.navigation.navigate('AllProduct', { data: popularProduct })}>
                    <Text style={{ fontSize: 10, color: colors.statusBar }}>
                      See All
                    </Text>
                    <Icon
                      name="arrow-right"
                      style={customStyle.blockHeaderArrow}
                    />
                  </RNPButton>
                </View>
                <FlatList
                  contentContainerStyle={styles.popularProductsContentStyle}
                  data={popularProducts}
                  horizontal={true}
                  keyExtractor={(item, index) => item._id}
                  showsHorizontalScrollIndicator={false}
                  //  numColumns={3}
                  renderItem={(item, index) => _renderProduct(item, index)}
                />
              </View>
            ) : null}

            {/*SPECIAL RESTURANT LISTING START*/}
            {popularProducts.length > 0 ? (
              <View style={styles.block}>
                <View style={styles.blockHeader}>
                  <Text style={[styles.blockTitle, { fontSize: 16 }]}>
                    Popular Restaurants
                  </Text>
                  <RNPButton
                    mode="text"
                    uppercase={false}
                    onPress={() => props.navigation.navigate('AllProduct', { data: popularProducts })}>
                    <Text style={{ fontSize: 10, color: colors.statusBar }}>
                      See All
                    </Text>
                    <Icon
                      name="arrow-right"
                      style={customStyle.blockHeaderArrow}
                    />
                  </RNPButton>
                </View>
                <FlatList
                  contentContainerStyle={styles.popularProductsContentStyle}
                  data={popularProducts}
                  horizontal={true}
                  keyExtractor={(item, index) => item._id}
                  showsHorizontalScrollIndicator={false}
                  //  numColumns={3}
                  renderItem={(item, index) => _renderProduct(item, index)}
                />
              </View>
            ) : null}

            {/*POPUlAR IN RESTAURANTS*/}
            {popularProducts.length > 0 ? (
              <View style={styles.block}>
                <View style={styles.blockHeader}>
                  <Text style={[styles.blockTitle, { fontSize: 16 }]}>
                    Popular in Restaurants
                  </Text>
                  <RNPButton
                    mode="text"
                    uppercase={false}
                    onPress={() => props.navigation.navigate('AllProduct', { data: popularProducts })}>
                    <Text style={{ fontSize: 10, color: colors.statusBar }}>
                      See All
                    </Text>
                    <Icon
                      name="arrow-right"
                      style={customStyle.blockHeaderArrow}
                    />
                  </RNPButton>
                </View>
                <FlatList
                  contentContainerStyle={styles.popularProductsContentStyle}
                  data={popularProducts}
                  horizontal={true}
                  keyExtractor={(item, index) => item._id}
                  showsHorizontalScrollIndicator={false}
                  //  numColumns={3}
                  renderItem={(item, index) => _renderProduct(item, index)}
                />
              </View>
            ) : null}

            {/*POPULAR TRAVEL AGENCY*/}
            {popularProducts.length > 0 ? (
              <View style={styles.block}>
                <View style={styles.blockHeader}>
                  <Text style={[styles.blockTitle, { fontSize: 16 }]}>
                    Popular Travel Agency
                  </Text>
                  <RNPButton
                    mode="text"
                    uppercase={false}
                    onPress={() => props.navigation.navigate('AllStore', { data: storesList })}>
                    <Text style={{ fontSize: 10, color: colors.statusBar }}>
                      See All
                    </Text>
                    <Icon
                      name="arrow-right"
                      style={customStyle.blockHeaderArrow}
                    />
                  </RNPButton>
                </View>
                <FlatList
                  contentContainerStyle={styles.popularProductsContentStyle}
                  data={storesList}
                  horizontal={true}
                  keyExtractor={(item, index) => item._id}
                  showsHorizontalScrollIndicator={false}
                  //  numColumns={3}
                  renderItem={(item, index) => _renderStore(item, index)}
                />
              </View>
            ) : null}

            {/*POPUlAR IN TRAVEL/AGENCY*/}
            {popularProducts.length > 0 ? (
              <View style={styles.block}>
                <View style={styles.blockHeader}>
                  <Text style={[styles.blockTitle, { fontSize: 16 }]}>Popular Destination</Text>
                  <RNPButton
                    mode="text"
                    uppercase={false}
                    onPress={() => props.navigation.navigate('AllProduct', { data: popularProducts })}>
                    <Text style={{ fontSize: 10, color: colors.statusBar }}>See All</Text>
                    <Icon name="arrow-right" style={customStyle.blockHeaderArrow} />
                  </RNPButton>
                </View>
                <FlatList
                  contentContainerStyle={styles.popularProductsContentStyle}
                  data={popularProducts}
                  horizontal={true}
                  keyExtractor={(item, index) => item._id}
                  showsHorizontalScrollIndicator={false}
                  //  numColumns={3}
                  renderItem={(item, index) => _renderProduct(item, index)}
                />
              </View>
            ) : null}
          </View>
        </Content>
        {/* <FooterTabs route={'Home'} componentId={props.componentId}/> */}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // flexDirection: 'column',
    // flexWrap: 'wrap',
  },
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    marginTop: '15%',
    marginBottom: '10%'
  },

  containerStyle: {
    borderWidth: 0,
    borderRadius: 300,
    marginVertical: 5,
    borderColor: '#808080',
    borderWidth: 0,
    //elevation: 5,
    width: (viewportWidth - 60) / 5,
    width: 55,
    margin: 7,
    height: 50,
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
  productImage: {
    flex: 1,
    width: undefined,
    height: 160,
    width: 104,
    resizeMode: 'cover',
    borderRadius: 4,
    marginBottom: 8,
  },

  storeDescription: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.gray_100,
  },

  originalPrice: {
    color: colors.body_color,
    fontWeight: '400',
    fontSize: 12,
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  discountPrice: {
    color: colors.body_color,
    fontWeight: '400',
    fontSize: 10,
    marginLeft: 5,
  },
  finalPrice: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 12,
  },

  storeImage: {
    flex: 1,
    width: undefined,
    height: 70,
    width: 100,
    resizeMode: 'cover',
    borderRadius: 4,
    marginBottom: 8,
  },
  categoriesContentStyle: {
    marginTop: 10,
    paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'column',
  },
  popularProductsContentStyle: {
    paddingBottom: 15,
    marginHorizontal: 8,
    marginTop: 15,
  },
  merchantContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    marginHorizontal: 15,
    height: 70,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: customPaperTheme.GenieeColor.primaryColor
  },
  merchantImage: {
    height: 40,
    width: 40,
    resizeMode: 'cover',
    marginHorizontal: 10,
    marginTop: 15
  },
});
// export default Meteor.withTracker(() => {
//     return {
//         loggedUser: Meteor.user(),
//         categories: Meteor.collection('MainCategories').find(),
//         notificationCount: Meteor.collection('newNotificationCount').find(),
//     };
// })(Home);
export default connect(categorySelector)(Home);
