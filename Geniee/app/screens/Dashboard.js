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
    Badge,
    Icon as NBIcon,
    Spinner,
    Card,
    CardItem,
} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import {colors, customStyle, variables} from '../config/styles';
import {Navigation} from 'react-native-navigation';

const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');
import settings from '../config/settings';
import StarRating from '../components/StarRating/StarRating';
import Product from '../components/Store/Product';
import MyFunctions from '../lib/MyFunctions';
import CogMenu from '../components/CogMenu';
import SplashScreen from 'react-native-splash-screen';
import firebase from 'react-native-firebase';
import AsyncStorage from '@react-native-community/async-storage';
import {goToRoute} from '../Navigation';
import {getProfileImage} from '../config/settings';

let isDashBoard = true;

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
            resturants: [
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

    handleBackButton = () => {
        console.log('back handle from dashboard');
        if (isDashBoard) {
            const {screen, navigator} = this.props;
            console.log(screen, navigator, this.props);
            this.state.backClickCount == 1 ? BackHandler.exitApp() : this._spring();
            return true;
        }
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

    async componentDidMount() {
        let MainCategories = await AsyncStorage.getItem('Categories');
        if (MainCategories) {
            MainCategories = JSON.parse(MainCategories);
            this.setState({categories: MainCategories, loading: false});
            this.arrayholder = MainCategories;
        } else {
            MainCategories = [];
        }
        SplashScreen.hide();
        Navigation.events().bindComponent(this);
        Meteor.subscribe('aggChatChannels');
        if (this.props.notificationCount.length > 0)
            this.setState({
                notificationCount: this.props.notificationCount[0].totalCount,
            });


        Meteor.call('getActiveAdvertises', (err, res) => {
            if (!err) {
                this.setState({Adds: res});
            }
        });


        this.granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: 'Location Permission',
                message:
                'This App needs access to your location ' +
                'so we can know where you are.',
            },
        );
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
            console.log('resturants', err, res)
            if (!err) {
                let resturants = [...this.state.resturants]
                resturants = resturants.concat(res);
                this.setState({resturants});
            }
        });


        //Get Nearby services
        this._fetchNearByServices();

        //Store All Catefories
        Meteor.subscribe('categories-list', () => {
            //console.log(MainCategories)
            if (this.props.categories.length > 0) {
                let MainCategories = this.props.categories;
                this.setState({categories: MainCategories, loading: false});

                this.arrayholder = MainCategories;
                AsyncStorage.setItem('Categories', JSON.stringify(MainCategories));
            }
        });

        //Get Popular Products
        Meteor.call('getPopularProducts', 0, 6, (err, res) => {
            if (!err) {
                this.setState({popularProducts: res.result});
            } else {
                console.log(err);
            }
        });


    }

    _fetchNearByServices = () => {
        const data = {
            skip: 0,
            limit: 10,
            coords: [this.region.longitude, this.region.latitude],
            subCatIds: null,
        };
        Meteor.call('getServicesNearBy', data, (err, res) => {
            this.setState({loading: false});
            if (!err) {
                this.setState({nearByservice: res.result});
            } else {
                console.log(err);
            }
        });
    };

    componentWillReceiveProps(newProps) {
        const oldProps = this.props;
        if (oldProps.categories.length !== newProps.categories.length) {
            this.setState({categories: newProps.categories, loading: false});
            this.arrayholder = newProps.categories;
            this._search(this.currentSearch);
            AsyncStorage.setItem('Categories', JSON.stringify(newProps.categories));
        }
        if (
            newProps.notificationCount.length > 0 &&
            newProps.notificationCount[0].totalCount != this.state.notificationCount
        )
            this.setState({
                notificationCount: newProps.notificationCount[0].totalCount,
            });
    }

    componentWillUnmount() {
        this.mounted = false;
        this.watchID != null && Geolocation.clearWatch(this.watchID);
    }

    messageListener = async () => {
        this.notificationOpenedListener = firebase
            .notifications()
            .onNotificationOpened(notificationOpen => {
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
                    goToRoute(
                        this.props.componentId,
                        notificationOpen.notification.data.route,
                        {Id: notificationOpen.notification.data.Id},
                    );
                    // });
                }
            });

        const notificationOpen = await firebase
            .notifications()
            .getInitialNotification();
        if (notificationOpen) {
            const {title, body} = notificationOpen.notification;
            //  this.showAlert(title, body);
            console.log('notificationOpen', notificationOpen.notification);
            if (notificationOpen.notification.data.title == 'REMOVE_AUTH_TOKEN') {
                // try {
                //     AsyncStorage.setItem(USER_TOKEN_KEY, '');
                //     Meteor.logout();
                //     goToRoute(this.props.componentId,'Auth');
                // }
                // catch (e) {
                //     console.log(e.message)
                //     goToRoute(this.props.componentId,'Auth');
                // }
            }
            if (notificationOpen.notification.data.navigate) {
                console.log('subscribe & Navigate');
                goToRoute(
                    this.props.componentId,
                    notificationOpen.notification.data.route,
                    {Id: notificationOpen.notification.data.Id},
                );
            }
        }
    };

    async componentDidAppear() {
        isDashBoard = true;
        let wishList = await AsyncStorage.getItem('myWhishList');
        if (wishList) wishList = JSON.parse(wishList);
        else wishList = [];

        let cartList = await AsyncStorage.getItem('myCart');
        if (cartList) {
            cartList = JSON.parse(cartList);
        } else {
            cartList = [];
        }
        this.setState({wishList: wishList, totalCount: cartList.length});
        BackHandler.addEventListener(
            'hardwareBackPress',
            this.handleBackButton.bind(this),
        );
        console.log('componentDidAppear-Dashboard');

        // Meteor.call('getCategoriesGR', (err, res) => {
        //     //   console.log(err,res)
        //     if (!err) {
        //         this.setState({categories: res.result});
        //         this.categories=res.result;
        //     }
        // })
    }

    componentDidDisappear() {
        isDashBoard = false;
        BackHandler.removeEventListener(
            'hardwareBackPress',
            this.handleBackButton.bind(this),
        );
        console.log('componentDidDisappear-Dashboard');
    }

    _search = text => {
        if (this.state.query)
            goToRoute(this.props.componentId, 'SearchResult', {
                SearchText: this.state.query,
            });
    };

    _handlItemPress = service => {
        service.avgRate = this.averageRating(service.ratings);
        //  this.props.navigation.navigate('Service', {Id: service});
        Navigation.push(this.props.componentId, {
            component: {
                name: 'ServiceDetail',
                passProps: {
                    Id: service._id,
                },
            },
        });
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
        // this.props.navigation.navigate("Home", {Id: Ids, Region: this.region})
        Navigation.push(this.props.componentId, {
            component: {
                name: 'ServiceList',
                passProps: {
                    Id: Ids,
                    Region: this.region,
                },
            },
        });
    };

    gotoEatFit = () => {
        console.log('Eat-Fit');
        Navigation.push(this.props.componentId, {
            component: {
                name: 'LandingPageEF',
            },
        });
    };

    gotoBB = () => {
        Navigation.push(this.props.componentId, {
            component: {
                name: 'ProductsBB',
            },
        });
    };
    renderItem = (data, index) => {
        var item = data.item;
        return (
            <View key={item._id} style={styles.containerStyle}>
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
                    <Icon name={item.icon} size={18} style={styles.catIcon}/>
                    </Body>

                    <Text
                        style={{
                            textAlign: 'center',
                            fontWeight: '200',
                            color: colors.appLayout,
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
        if (rowData.location && rowData.location.geometry)
            distance = MyFunctions.calculateDistance(
                this.region.latitude,
                this.region.longitude,
                rowData.location.geometry.location.lat,
                rowData.location.geometry.location.lng,
            );
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
                                    style={{color: '#094c6b'}}/> : {rowData.hasOwnProperty('ratings') ? this.averageRating(rowData.ratings) : 0}
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
                                    <Icon name={'phone'} size={20} style={styles.catIcon}/>
                                </Button>
                            ) : null}
                        </Right>
                    </ListItem>
                </TouchableWithoutFeedback>
            </View>
        );
    };

    _renderItem({item, index}) {
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

        goToRoute(this.props.componentId, 'ProductDetail', {data: pro});
    };

    _onScroll = event => {
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
            currentOffset > 0 && currentOffset > this._listViewOffset ? 'down' : 'up';
        // If the user is scrolling down (and the action-button is still visible) hide it
        const isActionButtonVisible = direction === 'up';
        if (isActionButtonVisible !== this.state.isActionButtonVisible) {
            LayoutAnimation.configureNext(CustomLayoutLinear);
            this.setState({isActionButtonVisible});
        }
        // Update your scroll position
        this._listViewOffset = currentOffset;
    };

    _renderProduct = (data, index) => {
        let item = data;
        return (
            <TouchableOpacity key={item._id}
                onPress={() => this._handleProductPress(item)}
                style={styles.productContainerStyle}>
                {/*<Product key={item._id} product={item}/>*/}
                <View  style={customStyle.Card}>
                    <CardItem cardBody style={{width: '100%'}}>
                        <Image
                            source={{uri: settings.IMAGE_URL + item.images[0]}}
                            style={{
                                flex: 1,
                                width: undefined,
                                height: 100,
                                resizeMode: 'cover',
                            }}
                        />
                        <View
                            style={{
                                position: 'absolute',
                                top: 5,
                                left: 5,
                                right: 5,
                                bottom: 5,
                                borderWidth: 1,
                                borderColor: 'rgba(253, 253, 253, 0.2)',
                            }}
                        />
                    </CardItem>
                    {item.discount ? (
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
                            <Text style={{fontSize: 8, color: 'white'}}>
                                {item.discount}% off
                            </Text>
                        </View>
                    ) : null}
                    <CardItem style={{paddingTop: 0, paddingLeft: 7, paddingRight: 3}}>
                        <Body style={{alignItems: 'center'}}>
                        <Text
                            style={{fontSize: 12, color: colors.primaryText}}
                            numberOfLines={1}>
                            {item.title}
                        </Text>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                            <Icon name={'home'} size={10} color={colors.gray_200}/>
                            <Text
                                numberOfLines={1}
                                note
                                style={{fontSize: 12, marginLeft: 3, marginRight: 0}}>
                                {item.Service.title || ''}
                            </Text>
                        </View>
                        <View style={{flex: 1, width: '100%', alignItems: 'center'}}>
                            <Text
                                note
                                style={{
                                    fontSize: 10,
                                    paddingLeft: 2,
                                    paddingRight: 2,
                                    zIndex: 1000,
                                    backgroundColor: '#fdfdfd',
                                }}>
                                Rs. {item.price}
                            </Text>
                        </View>
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
        return (
            <Container style={{flex: 1, backgroundColor: colors.appBackground}}>
                <Header
                    androidStatusBarColor={colors.statusBar}
                    style={{backgroundColor: colors.appLayout}}>
                    <Left style={{flex: 1}}>
                        <CogMenu componentId={this.props.componentId}/>
                    </Left>
                    {/*<Body>*/}
                    {/*<Text onPress={this.handleOnPress} style={{color: 'white', fontSize: 18, fontWeight: '500'}}>*/}
                    {/*Home*/}
                    {/*</Text>*/}
                    {/*</Body>*/}

                    <Right style={{flex: 1, marginRight: 5}}>
                        <Button
                            onPress={() => goToRoute(this.props.componentId, 'WishListEF')}
                            transparent>
                            <Icon name="heart" style={{fontSize: 24, color: 'white'}}/>
                            {this.state.wishList.length > 0 ? (
                                <Badge style={{position: 'absolute', height: 18, right: 0}}>
                                    <Text
                                        style={{
                                            fontSize: 10,
                                            fontWeight: '100',
                                            color: 'white',
                                            lineHeight: 18,
                                        }}>
                                        {this.state.wishList.length}
                                    </Text>
                                </Badge>
                            ) : null}
                        </Button>
                        <Button
                            onPress={() => goToRoute(this.props.componentId, 'CartEF')}
                            transparent>
                            <NBIcon name="ios-cart" style={{fontSize: 27, color: 'white'}}/>
                            {this.state.totalCount > 0 ? (
                                <Badge style={{position: 'absolute', height: 18, right: 0}}>
                                    <Text
                                        style={{
                                            fontSize: 10,
                                            fontWeight: '100',
                                            color: 'white',
                                            lineHeight: 18,
                                        }}>
                                        {this.state.totalCount}
                                    </Text>
                                </Badge>
                            ) : null}
                        </Button>
                        <Button
                            onPress={() => goToRoute(this.props.componentId, 'Notification')}
                            transparent>
                            <NBIcon
                                name="ios-notifications"
                                style={{fontSize: 29, color: 'white'}}
                            />
                            {this.state.notificationCount > 0 ? (
                                <Badge style={{position: 'absolute', height: 18, right: 0}}>
                                    <Text
                                        style={{
                                            fontSize: 10,
                                            fontWeight: '100',
                                            color: 'white',
                                            lineHeight: 18,
                                        }}>
                                        {this.state.notificationCount}
                                    </Text>
                                </Badge>
                            ) : null}
                        </Button>
                        {/*<Button transparent onPress={this.handleOnPress}>*/}
                        {/*<Icon name={'search'} size={25} color={'white'}/></Button>*/}
                    </Right>
                </Header>
                {/*{this.state.loading ? <ActivityIndicator style={{flex: 1}}/> : null}*/}
                {this.state.isActionButtonVisible ? (
                    <Item
                        rounded
                        search
                        boadered
                        style={{
                            backgroundColor: 'white',
                            marginLeft: 10,
                            marginRight: 10,
                            marginVertical: 10,
                            marginTop: 10,
                            height: 40,
                            zIndex: 1,
                            position: 'absolute',
                            top: 70,
                            left: 0,
                            right: 0,
                        }}>
                        <Button
                            transparent
                            disabled={this.state.query.length < 3}
                            onPress={this._search.bind(this)}>
                            <Icon
                                style={{
                                    paddingHorizontal: 20,
                                    fontSize: this.state.query.length > 2 ? 20 : 15,
                                    color:
                                        this.state.query.length > 2 ? colors.primary : undefined,
                                }}
                                name={'search'}
                            />
                        </Button>
                        <Input
                            style={{fontFamily: 'Roboto'}}
                            placeholder={'Search your wish..'}
                            underlineColorAndroid="rgba(0,0,0,0)"
                            returnKeyType="search"
                            onSubmitEditing={this._search}
                            onChangeText={searchText => {
                                this.setState({query: searchText});
                            }}
                        />
                    </Item>
                ) : null}

                <Content
                    onScroll={this._onScroll}
                    style={{
                        width: '100%',
                        flex: 1,
                        paddingHorizontal: 10,
                        paddingTop: 80,
                    }}>
                    {/*NEARBY SERVICE PROVIDERS LIST START*/}
                    {this.state.nearByservice.length > 0 ? (
                        <View style={styles.block}>
                            <View style={styles.blockHeader}>
                                <Text style={styles.blockTitle}>Services/Stores Nearby</Text>
                                <Button
                                    transparent
                                    onPress={() =>
                                        goToRoute(this.props.componentId, 'ServiceList', {
                                            Region: this.region,
                                        })
                                    }>
                                    <Text style={customStyle.buttonOutlinePrimaryText}>
                                        View All
                                    </Text>
                                </Button>
                            </View>
                            <FlatList
                                contentContainerStyle={{paddingBottom: 15}}
                                data={this.state.nearByservice}
                                horizontal={true}
                                _keyExtractor={(item, index) => index.toString()}
                                showsHorizontalScrollIndicator={false}
                                renderItem={({item, index}) => (
                                    <TouchableOpacity
                                        onPress={() => {
                                            goToRoute(this.props.componentId, 'ServiceDetail', {
                                                Id: item,
                                            });
                                        }}>
                                        <View
                                            key={item._id}
                                            style={{
                                                backgroundColor: 'white',
                                                marginHorizontal: 5,
                                                width: 150,
                                                borderRadius: 4,
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                paddingHorizontal: 10,
                                                paddingBottom: 15,
                                            }}>
                                            <Thumbnail
                                                style={{
                                                    width: 150,
                                                    height: 90,
                                                    marginBottom: 10,
                                                    borderTopLeftRadius: 4,
                                                    borderTopRightRadius: 4,
                                                    resizeMode: 'cover',
                                                }}
                                                square
                                                source={
                                                    item.coverImage
                                                        ? {uri: settings.IMAGE_URL + item.coverImage}
                                                        : require('../images/no-image.png')
                                                }
                                            />

                                            <View style={{flexDirection: 'row'}}>
                                                <View
                                                    style={{
                                                        flex: 1,
                                                        width: '100%',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}>
                                                    <Thumbnail
                                                        style={{borderRadius: 2, height: 25, width: 25}}
                                                        square
                                                        small
                                                        source={
                                                            item.Owner.profile.profileImage
                                                                ? {
                                                                    uri: getProfileImage(
                                                                        item.Owner.profile.profileImage,
                                                                    ),
                                                                }
                                                                : require('../images/user-icon.png')
                                                        }
                                                    />
                                                    {/*<Text note>{item.Owner.profile.name}</Text>*/}
                                                    <View
                                                        style={{
                                                            flexDirection: 'row',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                        }}>
                                                        <Text>
                                                            {item.hasOwnProperty('ratings')
                                                                ? Math.round(item.Rating.avgRate)
                                                                : 0}
                                                        </Text>

                                                        <Icon
                                                            name={'star'}
                                                            size={14}
                                                            color={colors.warning}
                                                        />
                                                    </View>
                                                </View>
                                                <View
                                                    style={{
                                                        borderColor: colors.appBackground,
                                                        borderLeftWidth: 1,
                                                    }}
                                                />
                                                <View
                                                    style={{
                                                        flex: 3,
                                                        alignItems: 'center',
                                                        marginLeft: 5,
                                                    }}>
                                                    <Text style={styles.cardTitle} numberOfLines={1}>
                                                        {item.title}
                                                    </Text>
                                                    {item.category ? (
                                                        <View
                                                            style={{
                                                                flexDirection: 'row',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                            }}>
                                                            <Icon
                                                                name={'tag'}
                                                                size={10}
                                                                color={colors.gray_200}
                                                            />

                                                            <Text
                                                                numberOfLines={1}
                                                                note
                                                                style={{marginLeft: 5, fontSize: 12}}>
                                                                {item.category.mainCategory || ''}
                                                            </Text>
                                                        </View>
                                                    ) : null}
                                                    {/*<Text note style={styles.cardNote}*/}
                                                    {/*numberOfLines={1}>{item.location.formatted_address}</Text>*/}
                                                    <View
                                                        style={{
                                                            flexDirection: 'row',
                                                            justifyContent: 'space-around',
                                                            width: '100%',
                                                        }}>
                                                        <View
                                                            style={{
                                                                alignItem: 'center',
                                                                flexDirection: 'row',
                                                            }}>
                                                            {/*<Icon name={'location-arrow'} size={18}*/}
                                                            {/*color={colors.gray_200}/>*/}
                                                            <Text note style={{fontSize: 12}}>
                                                                {Math.round(item.dist.calculated * 100) / 100}{' '}
                                                                K.M Away
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
                        <View style={styles.blockHeader}>
                            <Text style={styles.blockTitle}>
                                Hungry? Order delicious foods now.
                            </Text>
                            {/*<Button onPress={() => {*/}
                            {/*this.props.navigation.navigate('Shopping')*/}
                            {/*}} transparent style={customStyle.buttonOutlinePrimary}>*/}
                            {/*<Text style={customStyle.buttonOutlinePrimaryText}>View All</Text></Button>*/}
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
                                _keyExtractor={(item, index) => index.toString()}
                                showsHorizontalScrollIndicator={false}
                                renderItem={({item, index}) => (
                                    <View
                                        key={item._id}
                                        style={[
                                            styles.card,
                                            {
                                                marginHorizontal: 5,
                                                width: 200,
                                            },
                                        ]}>
                                        <TouchableOpacity
                                            onPress={item.hasOwnProperty('onPress') ? item.onPress :()=>goToRoute(this.props.componentId,'ServiceDetail',{Id:item})}>
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
                                                        width: '100%',
                                                        resizeMode: 'cover',
                                                        // margin: 5,
                                                    }}
                                                />
                                                {item.title ? (
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
                                                ) : null}
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                        </View>
                    </View>

                    {/*SPECIAL RESTURANT LISTING END*/}

                    <View style={[styles.block, {marginVertical: 20}]}>
                        {this.state.Adds.length > 0 ? (
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
                        ) : null}
                    </View>

                    {/*POPULAR PRODUCTS LIST START*/}
                    {this.state.popularProducts.length > 0 ? (
                        <View style={styles.block}>
                            <View style={styles.blockHeader}>
                                <Text style={styles.blockTitle}>Popular Products</Text>
                                <Button
                                    transparent
                                    onPress={() =>
                                        goToRoute(this.props.componentId, 'AllProducts', {
                                            Region: this.region,
                                        })
                                    }>
                                    <Text style={customStyle.buttonOutlinePrimaryText}>
                                        View All
                                    </Text>
                                </Button>
                            </View>
                            {/*<FlatList*/}
                                {/*contentContainerStyle={{paddingBottom: 15}}*/}
                                {/*data={this.state.popularProducts}*/}
                                {/*horizontal={false}*/}
                                {/*// _keyExtractor={(item, index) => index.toString()}*/}
                                {/*showsHorizontalScrollIndicator={false}*/}
                                {/*numColumns={3}*/}
                                {/*renderItem={(item, index) => this._renderProduct(item, index)}*/}
                            {/*/>*/}

                            <View style={{flex:1,flexDirection:'row', flexWrap:'wrap', alignItems:'flex-start',justifyContent:'flex-start',marginBottom:20}}>
                                {this.state.popularProducts.map((item)=>this._renderProduct(item))}
                            </View>
                        </View>
                    ) : null}

                    {/*POPULAR PRODUCTS LIST LIST END*/}

                    {/*CATEGORIES LIST START*/}
                    {this.state.categories.length > 0 ? (
                        <View style={styles.block}>
                            <View style={styles.blockHeader}>
                                <Text style={styles.blockTitle}>Availble Categories</Text>
                                {/*<Button transparent*/}
                                {/*onPress={() => goToRoute(this.props.componentId, "MyProducts", {Region: this.region})}>*/}
                                {/*<Text*/}
                                {/*style={customStyle.buttonOutlinePrimaryText}>View All</Text></Button>*/}
                            </View>
                            <FlatList
                                contentContainerStyle={{
                                    marginBottom: 80,
                                    marginTop: 10,
                                    paddingBottom: 10,
                                    // flexWrap:'wrap',
                                    // flexDirection:'row',
                                }}
                                data={this.state.categories}
                                horizontal={true}
                                _keyExtractor={(item, index) => index.toString()}
                                showsHorizontalScrollIndicator={false}
                                renderItem={this.renderItem}
                            />
                        </View>
                    ) : null}

                    {/*CATEGORIES LIST LIST END*/}
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'wrap',
    },
    containerStyle: {
        paddingHorizontal: 5,
        paddingVertical: 5,
        backgroundColor: 'white',
        borderWidth: 0,
        // marginVertical: 4,
        borderColor: '#808080',
        //elevation: 5,
        width: 90,
        marginHorizontal: 5,
        height: 90,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    catIcon: {
        padding: 10,
        borderRadius: 100,
        backgroundColor: colors.appLayout,
        color: 'white',
        width: 40,
        height: 40,
    },
    activeTabIcon: {
        color: '#ffffff',
    },
    activeTabText: {
        color: '#ffffff',
    },
    serviceList: {
        //backgroundColor: colors.inputBackground,
        backgroundColor: '#094c6b0a',
        //marginVertical: 5,
        //marginHorizontal: '2%',
        borderRadius: 0,
        borderBottomColor: '#094c6b',
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
        backgroundColor: '#094c6b',
        borderTopWidth: 3,
        borderTopColor: '#000000',
    },
    activeTab: {
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
    },

    searchInput: {
        // color: '#ffffff',
        borderTopWidth: 0,
        borderRightWidth: 0,
        borderLeftWidth: 0,
        borderBottomWidth: 0,
    },

    productContainerStyle: {
        // flex: 1,
        borderWidth: 0,
        marginHorizontal: 2,
        marginVertical: 4,
        borderColor: '#808080',
        elevation: 1,
       // width: (viewportWidth-35) / 3,
        width: '32%',
        maxWidth:130,
        justifyContent: 'center',
        alignItems: 'center',
    },
    block: {},
    blockHeader: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // borderBottomWidth: 1,
        borderColor: '#E2E2E2',
        paddingHorizontal: 15,
        //  backgroundColor:'white'
    },
    blockTitle: {
        fontSize: 18,
        fontWeight: '500',
        fontFamily: 'Roboto',
        color: colors.primary,
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
        categories: Meteor.collection('MainCategories').find(),
        notificationCount: Meteor.collection('newNotificationCount').find(),
    };
})(Dashboard);