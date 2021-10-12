import React, { Component, useEffect, useState } from 'react';
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
import { Badge, Avatar } from 'react-native-paper';
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
import settings from '../../../config/settings';
import StarRating from '../../../components/StarRating/StarRating';
import Product from '../../../components/Store/Product';
import MyFunctions from '../../../lib/MyFunctions';
import CogMenu from '../../../components/CogMenu';
import SplashScreen from 'react-native-splash-screen';
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
import { lowerCase } from 'lodash';
import Moment from 'moment';
import Data from '../../../react-native-meteor/Data';
import { connect } from 'react-redux';
import { categorySelector } from '../../../store/selectors';

let isDashBoard = true;

const IMAGE_URL = 'http://139.59.59.117/api/files/';
const Home = (props) => {
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

    const [resturants, setResturants] = useState([
        {
            title: 'Baadshah Briyani',
            imgSource: require('../../../images/baadshah_logo.jpg'),
            onPress: gotoBB,
            tags: 'Fast food restaurant',
            description:
                'Baadshah Biryani serves the most authentic Biryani in Kathmandu prepared by our expertise.Our Biryani will give you a burst of flavour in every bite as we use in-house spices',
        },
        {
            title: 'Eat-Fit',
            imgSource: require('../../../images/EF2.jpg'),
            onPress: gotoEatFit,
            tags: 'Hotel & Restaurant',
            description:
                'At cure.fit, we make group workouts fun, daily food healthy & tasty, mental fitness easy with yoga & meditation, and medical & lifestyle care hassle-free. #BeBetterEveryDay',
        },
    ])

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

    const partners = [
        {
            title: '',
            imgSource: require('../../../images/baadshah_logo.jpg'),
            onPress: gotoBB,
        },
        {
            title: 'EAT-FIT',
            imgSource: require('../../../images/EF2.jpg'),
            onPress: gotoEatFit,
        },
    ];
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
        // if (props.notificationCount.length > 0)
        //     setNotificationCount(props.notificationCount[0].totalCount);
        // Meteor.call('getActiveAdvertises', (err, res) => {
        //     if (!err) {
        //         setAdds(res);
        //     }
        // });

        //Services/Store Nearby
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

        //Get Popular Products
        Meteor.call('getPopularProducts', 0, 6, (err, res) => {
            console.log(err, res);
            if (!err) {
                setPopularProducts(res.result);
            } else {
                console.log(err);
            }
        });

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
                //   _fetchNearByServices();
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

        Meteor.call('getPopularResturants', (err, res) => {
            if (!err) {
                setResturants((res), [...resturants, res])
            }
        });

        //Store All Catefories
        // Meteor.subscribe('categories-list', () => {
        //     //console.log(MainCategories)
        //     if (props.categories.length > 0) {
        //         let MainCategories = props.categories;
        //         setCategories(viewAll
        //             ? MainCategories
        //             : MainCategories.slice(0, 6));
        //         setLoading(false);
        //         arrayholder = MainCategories;
        //         AsyncStorage.setItem('Categories', JSON.stringify(MainCategories));
        //     }
        // });

    }, [])

    const _fetchNearByServices = () => {
        console.log('_fetchNearByServices');
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
                setBackClickCount(0)
            });
        });
    }

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
                props.navigation.navigate(
                    notificationOpen.notification.data.route,
                    { Id: notificationOpen.notification.data.Id },
                );
            }
        }
    };

    const updateCounts = async () => {
        let wishList = await AsyncStorage.getItem('myWhishList');
        if (wishList) wishList = JSON.parse(wishList);
        else wishList = [];

        let cartList = await AsyncStorage.getItem('myCart');
        if (cartList) {
            cartList = JSON.parse(cartList);
        } else {
            cartList = [];
        }
        setWhishList(wishList);
        setTotalCount(cartList.length);
    }

    const _search = text => {
        if (query)
            props.navigation.navigate('SearchResult', {
                SearchText: query,
                Region: region,
            });
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

    const renderCategoryItem = (data, index) => {
        var item = data.item;
        return (
            <View>
                <View key={data.index.toString()} style={styles.containerStyle}>
                    <TouchableOpacity onPress={() => _itemClick(item)}>
                        <Image
                            style={{ height: 50, width: 50 }}
                            source={{
                                uri: IMAGE_URL + item.image,
                            }}
                        />
                        {/*</View>
                </ImageBackground>*/}
                    </TouchableOpacity>
                </View>
                <View style={{ width: 65,marginBottom:5 }}>
                    <Text style={{ textAlign: 'center', fontSize: 10 }}> {item.title}</Text>
                </View>
            </View>
        );
    };

    const _getListItem = data => {
        let rowData = data.item;
        let distance;
        if (rowData.location && rowData.location.geometry)
            distance = MyFunctions.calculateDistance(
                region.latitude,
                region.longitude,
                rowData.location.geometry.location.lat,
                rowData.location.geometry.location.lng,
            );
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
        props.navigation.navigate('ProductDetail', { Id: pro._id });
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
        const isActionButtonVisible = direction === 'up';
        if (isActionButtonVisible !== isActionButtonVisible) {
            LayoutAnimation.configureNext(CustomLayoutLinear);
            setState({ isActionButtonVisible });
        }
        // Update your scroll position
        _listViewOffset = currentOffset;
    };

    const _renderProduct = (data, index) => {
        let item = data.item;
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
                            source={{ uri: settings.IMAGE_URL + item.images[0] }}
                            style={{
                                flex: 1, width: undefined, height: 160, width: 104, resizeMode: 'cover', borderRadius: 4, marginBottom: 8,
                            }}
                        />
                    </View>
                    <View>
                        <View>
                            <Text numberOfLines={1} style={{ fontSize: 10 }}>From ABC group</Text>
                            <Text numberOfLines={2} style={{ fontSize: 12, fontWeight: 'bold', color: colors.gray_100 }}>
                                {/* style={{ fontSize: 12, color: colors.primaryText }}
                                 numberOfLines={1}> */}
                                {/* //{item.title} */}Phis is a title of product/ 200gb ram 600Gb memory
                            </Text>
                            <View style={{ flexDirection: 'row' }}>
                                {item.discount ? (
                                    <>
                                        <Text style={{ color: colors.body_color, fontWeight: '400', fontSize: 12, textDecorationLine: 'line-through', textDecorationStyle: 'solid' }}>
                                            Rs. {item.price}
                                        </Text>
                                        <Text style={{ color: colors.body_color, fontWeight: '400', fontSize: 10, marginLeft: 5, }}>
                                            {item.discount}% off
                                        </Text>
                                    </>
                                ) : null}
                            </View>
                            <Text
                                style={{
                                    color: colors.primary,
                                    fontWeight: '700',
                                    fontSize: 12,
                                }}>
                                Rs. {item.price - (item.price * item.discount) / 100}
                            </Text>
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
                            source={{ uri: settings.IMAGE_URL + item.images[0] }}
                            style={{
                                flex: 1, width: undefined, height: 70, width: 100, resizeMode: 'cover', borderRadius: 4, marginBottom: 8,
                            }}
                        />
                    </View>
                    <View>
                        <View>
                            <Text numberOfLines={1} style={{ fontSize: 10 }}>Butwal</Text>
                            <Text numberOfLines={2} style={{ fontSize: 12, fontWeight: 'bold', color: colors.gray_100 }}>
                                {/* style={{ fontSize: 12, color: colors.primaryText }}
                                 numberOfLines={1}> */}
                                {/* //{item.title} */}Phis is a title of product/ 200gb ram 600Gb memory
                            </Text>
                            <View style={{ marginTop: 5, marginRight: 5 }}>
                                <RNPButton
                                    mode='text'
                                    uppercase={false}
                                    onPress={() => { console.log('Visit Prssed') }}
                                >
                                    <Text style={{ fontSize: 10 }}>Visit</Text>
                                    <Icon name='chevron-right' style={{ marginLeft: 10, marginTop: 10 }} />
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
    }

    const profileImage = loggedUser ? loggedUser.profile.profileImage : null;
    // console.log(loggedUser,profileImage)
    return (
        <>
            <StatusBar backgroundColor={colors.statusBar} />
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.whiteText }}>
                <View
                    style={{
                        backgroundColor: colors.appLayout,
                        height: 80,
                    }}>
                    <View style={customStyle.topbarHeader}>
                        <Image
                            style={{ height: 30, width: 80 }}
                            source={require('../../../images/geniee_logo.png')} />
                        <View style={customStyle.topbarActionIcons}>
                            {/* <NotificationIcon navigation={props.navigation} />
                            <CartIcon
                                navigation={props.navigation}
                                style={customStyle.actionIcon}
                            />

                            <TouchableOpacity
                                style={{ marginHorizontal: 0 }}
                                onPress={() =>
                                    props.navigation.navigate(
                                        loggedUser ? 'Profile' : 'SignIn',
                                    )
                                }>
                                <Icon name="user" style={customStyle.actionIcon} />
                            </TouchableOpacity> */}
                            <TouchableOpacity
                                style={{ marginHorizontal: 0, flexDirection: 'row' }}
                            >
                                <FAIcon name="map-marker" style={{ color: colors.statusBar, fontSize: 20, marginRight: 8 }} />
                                <Text style={{ fontSize: 15 }}>Kathmandu</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                {/*{loading ? <ActivityIndicator style={{flex: 1}}/> : null}*/}

                <Content
                    onScroll={_onScroll}
                    style={{
                        width: '100%',
                        flex: 1,
                        paddingTop: 8,
                    }}>
                    {/* GENIEE BANNER */}
                    <View>
                        <View>
                            <Image
                                style={{ height: 70, width: '100%' }}
                                source={require('../../../images/geniee_banner.png')}
                            />
                        </View>
                        <View style={{ marginHorizontal: 15, marginVertical: 15 }}>
                            <RNPButton
                                mode='outlined'
                                uppercase={false}
                                onPress={() => { }}
                                style={{ borderColor: colors.statusBar, borderWidth: 2, borderStyle: 'dotted' }}
                            >
                                <Text style={{ color: colors.statusBar }}>Become a Merchant & Sell</Text>
                            </RNPButton>
                        </View>
                        {/*CATEGORIES LIST START*/}
                        {props.categories.length > 0 ? (
                            <View style={[styles.block, { marginVertical: 15 }]}>
                                {/* <View style={styles.blockHeader}>
                                <Text style={styles.blockTitle}>Categories</Text>
                                <Button transparent onPress={() => handleViewAll()}>
                                    <Text style={customStyle.buttonOutlinePrimaryText}>
                                        {viewAll ? 'Vew Less' : 'View All'}
                                    </Text>
                                </Button>
                            </View> */}
                                <FlatList
                                    contentContainerStyle={{
                                        marginTop: 10,
                                        paddingBottom: 10,
                                        //   alignItems:'center',
                                        justifyContent: 'space-around',
                                        // flexWrap: 'wrap',
                                        // flexDirection: 'row',
                                    }}
                                    data={categories}
                                    //horizontal={true}
                                    keyExtractor={(item, index) => index.toString()}
                                    // showsHorizontalScrollIndicator={false}
                                    renderItem={renderCategoryItem}
                                    numColumns={5}
                                />

                            </View>
                        ) : null}

                        {/*Deal that might excite you*/}
                        {popularProducts.length > 0 ? (
                            <View style={styles.block}>
                                <View style={styles.blockHeader}>
                                    <Text style={[styles.blockTitle, { fontSize: 16 }]}>Deals that might excite you</Text>
                                    <Text uppercase={false} style={{ fontSize: 10, color: colors.statusBar, marginLeft: 65 }}>{Moment(currentDate).format('MMM Do YYYY')} </Text>
                                </View>
                                <FlatList
                                    contentContainerStyle={{
                                        paddingBottom: 15,
                                        marginHorizontal: 8,
                                        marginTop: 15
                                    }}
                                    data={popularProducts.slice(0, 6)}
                                    numColumns={3}
                                    keyExtractor={(item, index) => item._id}
                                    showsHorizontalScrollIndicator={false}
                                    renderItem={(item, index) => _renderProduct(item, index)}
                                />
                                <View style={{ marginTop: 5, marginRight: 5 }}>
                                    <RNPButton
                                        mode='text'
                                        uppercase={false}
                                        onPress={() => { console.log('See All Prssed') }}
                                    >
                                        <Text style={{ fontSize: 12 }}>See All</Text>
                                        <Icon name='chevron-right' style={{ marginLeft: 10, marginTop: 10 }} />
                                    </RNPButton>
                                </View>
                            </View>
                        ) : null}

                        {/*FEATURE STORE*/}
                        {popularProducts.length > 0 ? (
                            <View style={styles.block}>
                                <View style={styles.blockHeader}>
                                    <Text style={[styles.blockTitle, { fontSize: 16 }]}>Featured Store</Text>
                                    <RNPButton
                                        mode='text'
                                        uppercase={false}
                                        onPress={() =>
                                            props.navigation.navigate('AllProducts', {
                                                Region: region,
                                            })
                                        }>
                                        <Text style={{ fontSize: 10, color: colors.statusBar }}>See All</Text>
                                        <Icon name="arrow-right" style={customStyle.blockHeaderArrow} />
                                    </RNPButton>
                                </View>
                                <FlatList
                                    contentContainerStyle={{
                                        paddingBottom: 15,
                                        marginHorizontal: 8,
                                        marginTop: 15
                                    }}
                                    data={popularProducts}
                                    horizontal={true}
                                    keyExtractor={(item, index) => item._id}
                                    showsHorizontalScrollIndicator={false}
                                    //  numColumns={3}
                                    renderItem={(item, index) => _renderStore(item, index)}
                                />
                            </View>
                        ) : null}

                        {/*NEARBY SERVICE PROVIDERS LIST START*/}
                        {/* {nearByservice === '' ? null : nearByservice > 0 ? ( */}
                        <View style={styles.block}>
                            <View style={customStyle.blockHeader}>
                                <Text style={[styles.blockTitle, { fontSize: 16 }]}>
                                    Nearby Stores
                                </Text>
                                <RNPButton
                                    mode='text'
                                    uppercase={false}
                                    onPress={() =>
                                        props.navigation.navigate('ServiceList', {
                                            Region: region,
                                        })
                                    }>
                                    <Text style={{ fontSize: 10, color: colors.statusBar }}>See All</Text>
                                    <Icon name="arrow-right" style={customStyle.blockHeaderArrow} />
                                </RNPButton>
                            </View>
                            <FlatList
                                contentContainerStyle={{
                                    paddingBottom: 14,
                                    paddingLeft: 14,
                                    paddingRight: 14,
                                    marginTop: 15
                                }}
                                data={nearByservice}
                                horizontal={true}
                                keyExtractor={(item, index) => item._id}
                                showsHorizontalScrollIndicator={false}
                                renderItem={({ item, index }) => (
                                    <TouchableOpacity
                                        onPress={() => {
                                            props.navigation.navigate('ServiceDetail', {
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
                                                style={{ height: 147, width: 310, borderRadius: 4 }}>
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
                                                            ? { uri: settings.IMAGE_URL + item.coverImage }
                                                            : require('../../../images/no-image.png')
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
                                                    <Text style={{ color: 'white', fontSize: 15 }}>
                                                        {item.title}
                                                    </Text>
                                                </LinearGradient>
                                            </View>
                                            <View style={{ flexDirection: 'row', padding: 0 }}>
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
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                        {/* ) : null} */}

                        {/*POPULAR STORE*/}
                        {popularProducts.length > 0 ? (
                            <View style={styles.block}>
                                <View style={styles.blockHeader}>
                                    <Text style={[styles.blockTitle, { fontSize: 16 }]}>Popular Stores</Text>
                                    <RNPButton
                                        mode='text'
                                        uppercase={false}
                                        onPress={() =>
                                            props.navigation.navigate('AllProducts', {
                                                Region: region,
                                            })
                                        }>
                                        <Text style={{ fontSize: 10, color: colors.statusBar }}>See All</Text>
                                        <Icon name="arrow-right" style={customStyle.blockHeaderArrow} />
                                    </RNPButton>
                                </View>
                                <FlatList
                                    contentContainerStyle={{
                                        paddingBottom: 15,
                                        marginHorizontal: 8,
                                        marginTop: 15
                                    }}
                                    data={popularProducts}
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
                                    <Text style={[styles.blockTitle, { fontSize: 16 }]}>Popular in Stores</Text>
                                    <RNPButton
                                        mode='text'
                                        uppercase={false}
                                        onPress={() =>
                                            props.navigation.navigate('AllProducts', {
                                                Region: region,
                                            })
                                        }>
                                        <Text style={{ fontSize: 10, color: colors.statusBar }}>See All</Text>
                                        <Icon name="arrow-right" style={customStyle.blockHeaderArrow} />
                                    </RNPButton>
                                </View>
                                <FlatList
                                    contentContainerStyle={{
                                        paddingBottom: 15,
                                        marginHorizontal: 8,
                                        marginTop: 15
                                    }}
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
                                    <Text style={[styles.blockTitle, { fontSize: 16 }]}>Popular Restaurants</Text>
                                    <RNPButton
                                        mode='text'
                                        uppercase={false}
                                        onPress={() =>
                                            props.navigation.navigate('AllProducts', {
                                                Region: region,
                                            })
                                        }>
                                        <Text style={{ fontSize: 10, color: colors.statusBar }}>See All</Text>
                                        <Icon name="arrow-right" style={customStyle.blockHeaderArrow} />
                                    </RNPButton>
                                </View>
                                <FlatList
                                    contentContainerStyle={{
                                        paddingBottom: 15,
                                        marginHorizontal: 8,
                                        marginTop: 15
                                    }}
                                    data={popularProducts}
                                    horizontal={true}
                                    keyExtractor={(item, index) => item._id}
                                    showsHorizontalScrollIndicator={false}
                                    //  numColumns={3}
                                    renderItem={(item, index) => _renderStore(item, index)}
                                />
                            </View>
                        ) : null}

                        {/*POPUlAR IN RESTAURANTS*/}
                        {popularProducts.length > 0 ? (
                            <View style={styles.block}>
                                <View style={styles.blockHeader}>
                                    <Text style={[styles.blockTitle, { fontSize: 16 }]}>Popular in Restaurants</Text>
                                    <RNPButton
                                        mode='text'
                                        uppercase={false}
                                        onPress={() =>
                                            props.navigation.navigate('AllProducts', {
                                                Region: region,
                                            })
                                        }>
                                        <Text style={{ fontSize: 10, color: colors.statusBar }}>See All</Text>
                                        <Icon name="arrow-right" style={customStyle.blockHeaderArrow} />
                                    </RNPButton>
                                </View>
                                <FlatList
                                    contentContainerStyle={{
                                        paddingBottom: 15,
                                        marginHorizontal: 8,
                                        marginTop: 15
                                    }}
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
                                    <Text style={[styles.blockTitle, { fontSize: 16 }]}>Popular Travel Agency</Text>
                                    <RNPButton
                                        mode='text'
                                        uppercase={false}
                                        onPress={() =>
                                            props.navigation.navigate('AllProducts', {
                                                Region: region,
                                            })
                                        }>
                                        <Text style={{ fontSize: 10, color: colors.statusBar }}>See All</Text>
                                        <Icon name="arrow-right" style={customStyle.blockHeaderArrow} />
                                    </RNPButton>
                                </View>
                                <FlatList
                                    contentContainerStyle={{
                                        paddingBottom: 15,
                                        marginHorizontal: 8,
                                        marginTop: 15
                                    }}
                                    data={popularProducts}
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
                                        mode='text'
                                        uppercase={false}
                                        onPress={() =>
                                            props.navigation.navigate('AllProducts', {
                                                Region: region,
                                            })
                                        }>
                                        <Text style={{ fontSize: 10, color: colors.statusBar }}>See All</Text>
                                        <Icon name="arrow-right" style={customStyle.blockHeaderArrow} />
                                    </RNPButton>
                                </View>
                                <FlatList
                                    contentContainerStyle={{
                                        paddingBottom: 15,
                                        marginHorizontal: 8,
                                        marginTop: 15
                                    }}
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
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        // flexDirection: 'column',
        // flexWrap: 'wrap',
    },
    containerStyle: {
        borderWidth: 0,
        borderRadius: 300,
        marginVertical: 5,
        borderColor: '#808080',
        borderWidth:0,
        //elevation: 5,
        //width: (viewportWidth-60)/3,
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
});
// export default Meteor.withTracker(() => {
//     return {
//         loggedUser: Meteor.user(),
//         categories: Meteor.collection('MainCategories').find(),
//         notificationCount: Meteor.collection('newNotificationCount').find(),
//     };
// })(Home);
export default connect(categorySelector)(Home);
