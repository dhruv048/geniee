import React, {Component} from 'react';
import Meteor from '../react-native-meteor';
import {
    StyleSheet, BackHandler,
    Dimensions, Animated,
    View, ToastAndroid,
    TouchableOpacity,
    FlatList, PermissionsAndroid, Image, TouchableWithoutFeedback
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import Geolocation from 'react-native-geolocation-service';
import {
    Header,    Container,
    Content,    Item,
    Body,    Left,
    Button,    Right,
    Text,    Input,
    ListItem,    Thumbnail, Badge, Icon as NBIcon, Spinner
} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import {colors, customStyle, variables} from '../config/styles';
import {Navigation} from 'react-native-navigation';

const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');
import settings from "../config/settings";
import StarRating from "../components/StarRating/StarRating";
import Product from "../components/Store/Product";
import MyFunctions from "../lib/MyFunctions";
import CogMenu from "../components/CogMenu";
import SplashScreen from "react-native-splash-screen";
import firebase from "react-native-firebase";
import AsyncStorage from "@react-native-community/async-storage";
import {goToRoute} from "../Navigation";
import {getProfileImage} from "../config/settings";

let isDashBoard = true;

class Dashboard extends Component {

    constructor(props) {
        super(props)
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
            nearByservice: []
        };
        this.arrayholder;
        this.currentSearch = '';
        this.region = {
            latitude: 27.712020,
            longitude: 85.312950,
        };
        this.granted;
        this.watchID;
        this.springValue = new Animated.Value(100);

        this.partners = [
            {
                title: "",
                imgSource: require("../images/baadshah_logo.jpg"),
                onPress: this.gotoBB,
            },
            {
                title: "EAT-FIT",
                imgSource: require("../images/EF2.jpg"),
                onPress: this.gotoEatFit,
            },
        ]

        //this.onClick = this.onClick.bind(this);
    }

    handleOnPress = () => this.setState({showSearchBar: true});
    handleOnPressUnset = () => {
        this.setState({showSearchBar: false, query: ''});
        this._search('')
    };
    //onClick() {
    //let { showSearchBar } = this.state.showSearchBar;
    //this.setState({
    //showSearchBar: !showSearchBar,
    //});
    //}


    handleBackButton = () => {
        console.log('back handle from dashboard')
        if (isDashBoard) {
            const {screen, navigator} = this.props;
            console.log(screen, navigator, this.props);
            this.state.backClickCount == 1 ? BackHandler.exitApp() : this._spring();
            return true;
        }
    };

    _spring() {
        ToastAndroid.showWithGravityAndOffset(
            "Tap again to Exit.",
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            0,
            50,
        );

        this.setState({backClickCount: 1}, () => {
            Animated.sequence([
                Animated.spring(
                    this.springValue,
                    {
                        toValue: -.15 * viewportHeight,
                        friction: 5,
                        duration: 300,
                        useNativeDriver: true,
                    }
                ),
                Animated.timing(
                    this.springValue,
                    {
                        toValue: 100,
                        duration: 300,
                        useNativeDriver: true,
                    }
                ),

            ]).start(() => {
                this.setState({backClickCount: 0});
            });
        });

    }

    handleOnLocationSelect(location) {
        console.log(location);
        this.setState({pickLocation: false})
    }

    async componentDidMount() {
        let MainCategories = await AsyncStorage.getItem("Categories");
        if (MainCategories) {
            MainCategories = JSON.parse(MainCategories);
            this.setState({categories: MainCategories, loading: false});
            this.arrayholder = this.props.categories ? this.props.categories : MainCategories;
        }
        SplashScreen.hide();
        Navigation.events().bindComponent(this);
        Meteor.subscribe('aggChatChannels');
        if (this.props.notificationCount.length > 0)
            this.setState({notificationCount: this.props.notificationCount[0].totalCount})
        Meteor.call('getActiveAdvertises', (err, res) => {
            // console.log("banners",err, res)
            if (!err) {
                this.setState({Adds: res});
            }
        });
        this.granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                'title': 'Location Permission',
                'message': 'This App needs access to your location ' +
                'so we can know where you are.'
            }
        )
        if (this.granted === PermissionsAndroid.RESULTS.GRANTED) {
            Geolocation.getCurrentPosition(
                (position) => {
                    console.log(position);
                    let region = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    }
                    this.region = region;
                    //Get Nearby services
                    this._fetchNearByServices();
                },
                (error) => {
                    // See error code charts below.
                    console.log(error.code, error.message);
                },
                {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000}
            );
        } else {
            console.log("Location permission denied")
        }
        this.watchID = Geolocation.watchPosition(
            (position) => {
                console.log(position);
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
            {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000}
        );

        this.messageListener()
            .catch(e => {
                console.log(e)
            });


        //Get Nearby services
        this._fetchNearByServices();

        //Store All Catefories
        Meteor.subscribe('categories-list', () => {
            let MaiCategories = this.props.categories;
            //console.log(MainCategories)
            this.setState({categories: MaiCategories, loading: false});
            this.arrayholder = this.props.categories ? this.props.categories : MaiCategories;
            AsyncStorage.setItem("Categories", JSON.stringify(MainCategories))
        });


    }

    _fetchNearByServices = () => {
        const data = {
            skip: 0,
            limit: 10,
            coords: [this.region.longitude, this.region.latitude],
            subCatIds: null
        };
        Meteor.call('getServicesNearBy', data, (err, res) => {
            console.log(err, res);
            this.setState({loading: false})
            if (!err) {
                // if (res.result.length > 0) {
                    this.setState({nearByservice: res.result});
                // }
            }
        });
    }

    componentWillReceiveProps(newProps) {
        const oldProps = this.props
        if (oldProps.categories.length !== newProps.categories.length) {
            this.setState({categories: newProps.categories, loading: false})
            this.arrayholder = newProps.categories;
            this._search(this.currentSearch);
            AsyncStorage.setItem("Categories", JSON.stringify(newProps.categories))
        }
        if (newProps.notificationCount.length > 0 && newProps.notificationCount[0].totalCount != this.state.notificationCount)
            this.setState({notificationCount: newProps.notificationCount[0].totalCount})
    }

    componentWillUnmount() {
        this.mounted = false;
        this.watchID != null && Geolocation.clearWatch(this.watchID);
    }

    messageListener = async () => {
        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
            const {title, body} = notificationOpen.notification;
            // this.showAlert(title, body);
            console.log('onNotificationOpened', notificationOpen)
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
                console.log("subscribe & Navigate");
                // Meteor.subscribe(notificationOpen.notification.data.subscription, notificationOpen.notification.data.Id, (err) => {
                goToRoute(this.props.componentId, notificationOpen.notification.data.route, {Id: notificationOpen.notification.data.Id})
                // });
            }
        });

        const notificationOpen = await firebase.notifications().getInitialNotification();
        if (notificationOpen) {

            const {title, body} = notificationOpen.notification;
            //  this.showAlert(title, body);
            console.log('notificationOpen', notificationOpen.notification);
            if (notificationOpen.notification.data.title == "REMOVE_AUTH_TOKEN") {
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
                console.log("subscribe & Navigate");
                goToRoute(this.props.componentId, notificationOpen.notification.data.route, {Id: notificationOpen.notification.data.Id})
            }

        }
    }

    async componentDidAppear() {
        isDashBoard = true;
        let wishList = await AsyncStorage.getItem('myWhishList');
        if (wishList)
            wishList = JSON.parse(wishList);
        else
            wishList = [];

        let cartList = await AsyncStorage.getItem('myCart');
        if (cartList) {
            cartList = JSON.parse(cartList);
        }
        else {
            cartList = [];
        }
        this.setState({wishList: wishList, totalCount: cartList.length});
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));
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
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton.bind(this));
        console.log('componentDidDisappear-Dashboard');
    }

    _search = (text) => {
        const textData = text.trim().toUpperCase();
        this.setState({loading: true});
        // if (textData === this.currentSearch) {
        //     // abort search if query wasn't different
        //     return;
        // }
        if (textData === "") {
            this.setState({
                searchMode: false,
                loading: false,
                products: [],
                services: [],
                //   categories: this.arrayholder, loading: false
            });
            this.currentSearch = '';
            return;
        }
        else {
            this.setState({
                searchMode: true,
            })
        }
        ;

        this.currentSearch = text;
        // const newData = this.arrayholder.filter(item => {
        //     const itemData =
        //         `${item.mainCategory.toUpperCase()}`;
        //     return itemData.indexOf(textData) > -1;
        // });
        // this.setState({categories: newData, loading: false});


        var dataToSend = {
            searchValue: text
        };
        console.log('fetch')
        fetch(settings.API_URL + 'mainSearch', {
            method: "POST",//Request Type
            body: JSON.stringify(dataToSend),//post body
            headers: {//Header Defination
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(responseJson => {
                //   console.log(responseJson);
                this.setState(
                    {
                        loading: false,
                        products: responseJson.products,
                        services: responseJson.services,
                    }
                );
                // //  this.arrayholder = responseJson.data
            })
            .catch(error => {
                console.error('API error', error);
            });

    };

    _handlItemPress = (service) => {
        service.avgRate = this.averageRating(service.ratings);
        //  this.props.navigation.navigate('Service', {Id: service});
        Navigation.push(this.props.componentId, {
            component: {
                name: "ServiceDetail",
                passProps: {
                    Id: service._id
                }
            }
        });
    }
    averageRating = (arr) => {
        let sum = 0;
        arr.forEach(item => {
            sum = sum + item.count;
        });
        var avg = sum / arr.length;
        return Math.round(avg);
    };
    _itemClick = (item) => {
        let Ids = [];
        item.subCategories.map(item => {
            Ids.push(item.subCatId)
        })
        // this.props.navigation.navigate("Home", {Id: Ids, Region: this.region})
        Navigation.push(this.props.componentId, {
            component: {
                name: "ServiceList",
                passProps: {
                    Id: Ids,
                    Region: this.region
                }
            }
        });
    }

    gotoEatFit = () => {
        console.log('Eat-Fit');
        Navigation.push(this.props.componentId, {
            component: {
                name: "LandingPageEF",
            }
        });
    }

    gotoBB = () => {
        console.log('Eat-Fit');
        Navigation.push(this.props.componentId, {
            component: {
                name: "ProductsBB",
            }
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
                    <Icon name={item.icon} size={20} style={styles.catIcon}/>
                    </Body>

                    <Text style={{
                        textAlign: 'center',
                        fontWeight: '200',
                        color: '#ffffff',
                        fontSize: 12
                    }}>{item.mainCategory}</Text>
                    {/*</View>
                    </ImageBackground>*/}
                </TouchableOpacity>
            </View>
        )
    }
    _getListItem = (data) => {
        let rowData = data.item;
        let distance;
        if (rowData.location && rowData.location.geometry)
            distance = MyFunctions.calculateDistance(this.region.latitude, this.region.longitude, rowData.location.geometry.location.lat, rowData.location.geometry.location.lng);
        console.log(distance);
        return (
            <View key={data.item._id} style={styles.serviceList}>
                <TouchableWithoutFeedback onPress={() => {
                    this._handlItemPress(data.item)
                }}>
                    <ListItem thumbnail>
                        <Left>
                            {rowData.coverImage === null ?
                                //   <Thumbnail style={styles.banner} square source={dUser}/> :
                                <Text></Text> :
                                <Thumbnail style={styles.banner}
                                           source={{uri: settings.API_URL + 'images/' + rowData.coverImage}}/>}
                        </Left>
                        <Body>
                        <Text numberOfLines={1} style={styles.serviceTitle}>{rowData.title}</Text>
                        {rowData.location.formatted_address ?
                            <Text note numberOfLines={1}
                                  style={styles.serviceAddress}>{rowData.location.formatted_address}</Text> : null}

                        {distance ?
                            <Text note
                                  style={styles.serviceDist}>{distance} KM</Text> : null}
                        <View style={styles.serviceAction}>
                            <StarRating
                                starRate={rowData.hasOwnProperty('ratings') ? this.averageRating(rowData.ratings) : 0}/>
                            {/*{this.averageRating(rowData.ratings) > 0 ?
                                <Text style={{fontSize: 20, fontWeight: '400', color: '#ffffff'}}>
                                    <Icon name={'star'}
                                        style={{color: '#094c6b'}}/> : {rowData.hasOwnProperty('ratings') ? this.averageRating(rowData.ratings) : 0}
                            </Text> : null}*/}
                        </View>
                        </Body>
                        <Right>
                            {(data.item.contact || data.item.contact1) ?
                                <Button transparent style={styles.serviceIconBtn} onPress={() => {
                                    MyFunctions._callPhone(data.item.contact ? data.item.contact : data.item.contact1)
                                }}>
                                    {/*<Icon name={'call'} color={'green'}/>*/}
                                    <Icon name={'phone'} size={20} style={styles.catIcon}/>
                                </Button>
                                : null}

                        </Right>

                    </ListItem>
                </TouchableWithoutFeedback>
            </View>
        )
    }

    _renderItem({item, index}) {
        return (
            <View key={index} style={{}}>
                <Thumbnail square style={{width: '100%', height: Math.round(viewportWidth * 0.29), resizeMode: 'cover'}}
                           source={{uri: settings.IMAGE_URL + item.src}}/>
            </View>
        );
    }

    _handleProductPress = (pro) => {
        Meteor.subscribe('products', pro.service);
        // this.props.navigation.navigate("ProductDetail", {'Id': pro._id})
        Navigation.push(this.props.componentId, {
            component: {
                name: "ProductDetail",
                passProps: {
                    Id: pro._id
                }
            }
        });
    };

    _renderProduct = (data, index) => {
        let item = data.item;
        return (
            <TouchableOpacity onPress={() => this._handleProductPress(item)}
                              style={styles.productContainerStyle}>
                <Product key={item._id} product={item}/>

            </TouchableOpacity>
        )
    }

    closePickLocation() {
        console.log('method Called')
        this.setState({pickLocation: false})
    }

    render() {
        console.log(this.state.products, this.state.services);
        const {showSearchBar} = this.state;
        return (
            <Container style={{flex: 1, backgroundColor: colors.appBackground}}>
                {showSearchBar == false ? (
                    <Header androidStatusBarColor={colors.statusBar} style={{backgroundColor: '#094c6b'}}>
                        <Left style={{flex: 1}}>
                            {/*<CogMenu componentId={this.props.componentId}/>*/}
                        </Left>
                        {/*<Body>*/}
                        {/*<Text onPress={this.handleOnPress} style={{color: 'white', fontSize: 18, fontWeight: '500'}}>*/}
                        {/*Home*/}
                        {/*</Text>*/}
                        {/*</Body>*/}

                        <Right style={{flex: 1}}>
                            <Button onPress={() => goToRoute(this.props.componentId, 'WishListEF')} transparent>
                                <Icon name='heart' style={{fontSize: 24, color: 'white'}}/>
                                {this.state.wishList.length > 0 ?
                                    <Badge
                                        style={{position: 'absolute', height: 18, right: 0}}>
                                        <Text style={{
                                            fontSize: 10,
                                            fontWeight: '100',
                                            color: 'white',
                                            lineHeight: 18
                                        }}>{this.state.wishList.length}</Text></Badge>
                                    : null}
                            </Button>
                            <Button onPress={() => goToRoute(this.props.componentId, 'CartEF')} transparent>
                                <NBIcon name='ios-cart' style={{fontSize: 27, color: 'white'}}/>
                                {this.state.totalCount > 0 ?
                                    <Badge
                                        style={{position: 'absolute', height: 18, right: 0}}>
                                        <Text style={{
                                            fontSize: 10,
                                            fontWeight: '100',
                                            color: 'white',
                                            lineHeight: 18
                                        }}>{this.state.totalCount}</Text></Badge> : null}
                            </Button>
                            <Button onPress={() => goToRoute(this.props.componentId, 'Notification')} transparent>
                                <NBIcon name='ios-notifications' style={{fontSize: 29, color: 'white'}}/>
                                {this.state.notificationCount > 0 ?
                                    <Badge
                                        style={{position: 'absolute', height: 18, right: 0}}>
                                        <Text style={{
                                            fontSize: 10,
                                            fontWeight: '100',
                                            color: 'white',
                                            lineHeight: 18
                                        }}>{this.state.notificationCount}</Text></Badge> : null}
                            </Button>
                            {/*<Button transparent onPress={this.handleOnPress}>*/}
                            {/*<Icon name={'search'} size={25} color={'white'}/></Button>*/}
                        </Right>
                    </Header>
                ) : (
                    <Header searchBar rounded androidStatusBarColor={colors.statusBar}
                            style={{backgroundColor: '#094c6b'}}>
                        {/*<Left style={{flex: 1}}>*/}
                        {/*/!*<Button transparent onPress={() => {*!/*/}
                        {/*/!*this.props.navigation.openDrawer()*!/*/}
                        {/*/!*}}>*!/*/}
                        {/*/!*<Icon name={'ellipsis-v'} size={25} color={'white'}/></Button>*!/*/}
                        {/*<CogMenu componentId={this.props.componentId}/>*/}
                        {/*</Left>*/}
                        {/*<Body style={{flexDirection: 'row', flex: 6}}>*/}


                        <Item style={{height: 40, width: '95%', paddingLeft: 10}}>
                            {/*<CogMenu componentId={this.props.componentId}/>*/}
                            {/*{!this.state.query ?*/}
                            {/*<Icon style={styles.activeTabIcon} name='search' size={15}/> : null}*/}

                            <Icon name='search' size={15} color={colors.primary}/>
                            <Input placeholder="Search..." style={styles.searchInput}
                                   placeholderTextColor={colors.primaryText}
                                // selectionColor='#ffffff'
                                   onChangeText={(searchText) => {
                                       this._search(searchText), this.setState({query: searchText})
                                   }}
                                   autoCorrect={false}
                            />
                            {/*<Right>*/}
                            <Button style={{paddingHorizontal: 5}} transparent onPress={this.handleOnPressUnset}>
                                <NBIcon name={'close'} size={25} style={{color: colors.primary}}/></Button>
                            {/*</Right>*/}
                        </Item>
                        {/*</Body>*/}
                    </Header>
                )}


                {/*{this.state.loading ? <ActivityIndicator style={{flex: 1}}/> : null}*/}
                <Content style={{width: '100%', flex: 1,}}>
                    <Item rounded search boadered style={{
                        backgroundColor: 'white',
                        marginLeft: 10,
                        marginRight: 10,
                        marginVertical: 20,
                        height: 45
                    }}>
                        <Icon style={{
                            paddingHorizontal: 20,
                            fontSize: this.state.query ? 20 : 15,
                            color: this.state.query ? colors.primary : ''
                        }} name={"search"}/>
                        <Input
                            style={{fontFamily: 'Roboto',}}
                            placeholder={"Make your wish.."}
                            underlineColorAndroid='rgba(0,0,0,0)'
                            onChangeText={(searchText) => {
                                this.setState({query: searchText})
                            }}
                        />
                    </Item>


                    {/*NEARBY SERVICE PROVIDERS LIST START*/}
                    {this.state.nearByservice.length>0 ?
                    <View style={styles.block}>
                        <View style={styles.blockHeader}>
                            <Text style={styles.blockTitle}>Services/Stores Nearby</Text>
                            <Button transparent
                                    onPress={() => goToRoute(this.props.componentId, "ServiceList",{Region:this.region})}>
                                <Text
                                    style={customStyle.buttonOutlinePrimaryText}>View All</Text></Button>
                        </View>
                            <FlatList
                                contentContainerStyle={{paddingHorizontal: 10, paddingBottom: 15}}
                                data={this.state.nearByservice}
                                horizontal={true}
                                _keyExtractor={(item, index) => index.toString()}
                                showsHorizontalScrollIndicator={false}
                                renderItem={({item, index}) =>

                                    <TouchableOpacity
                                        onPress={() => {
                                            goToRoute(this.props.componentId, 'ServiceDetail', {
                                                'Id': item._id,
                                            })
                                        }}>
                                        <View key={item._id}
                                              style={{
                                                  backgroundColor: 'white',
                                                  marginHorizontal: 5,
                                                  width: 200,
                                                  borderRadius: 4,
                                                  flexDirection: 'column',
                                                  alignItems: 'center',
                                                  paddingHorizontal: 10,
                                                  paddingBottom: 15
                                              }}>

                                            <Thumbnail style={{
                                                width: 200,
                                                height: 80,
                                                marginBottom: 10,
                                                borderTopLeftRadius: 4,
                                                borderTopRightRadius: 4,
                                                resizeMode: 'cover'
                                            }}
                                                       square
                                                       source={item.coverImage ? {uri: settings.IMAGE_URL + item.coverImage} : require('../images/no-image.png')}/>

                                            <View style={{flexDirection: 'row'}}>

                                                <View style={{flex: 2,width:'100%', alignItems: 'center', justifyContent: 'center',}}>
                                                    <Thumbnail style={{borderRadius: 2,}} square small source={item.Owner.profile.profileImage? {uri:getProfileImage(item.Owner.profile.profileImage)}:require('../images/user-icon.png')}/>
                                                    {/*<Text note>{item.Owner.profile.name}</Text>*/}
                                                    <View style={{
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}>
                                                        <Text>
                                                            {item.hasOwnProperty('ratings') ? Math.round(item.Rating.avgRate) : 0}
                                                        </Text>
                                                        <Text>
                                                            <Icon name={'star'} size={16}
                                                                  color={colors.warning}/></Text>
                                                    </View>
                                                </View>
                                                <View style={{borderColor: colors.appBackground,borderLeftWidth:1}} />
                                                <View style={{flex: 7, alignItems:'center', marginLeft:5}}>
                                                    <Text style={styles.cardTitle}
                                                          numberOfLines={1}>{item.title}</Text>
                                                    {item.Category?
                                                    <View style={{
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                    }}>
                                                        <Text>
                                                            <Icon name={'tag'} size={16}
                                                                  color={colors.gray_200}/></Text>
                                                        <Text note style={{marginLeft:5}}>
                                                            {item.Category.subCategory||""}
                                                        </Text>

                                                    </View>:null}
                                                    {/*<Text note style={styles.cardNote}*/}
                                                          {/*numberOfLines={1}>{item.location.formatted_address}</Text>*/}
                                                    <View style={{
                                                        flexDirection: 'row',
                                                        justifyContent: 'space-around',
                                                        width: '100%'
                                                    }}>
                                                        <View style={{alignItem: 'center', flexDirection: 'row'}}>
                                                            {/*<Icon name={'location-arrow'} size={18}*/}
                                                            {/*color={colors.gray_200}/>*/}
                                                            <Text note>{Math.round(item.dist.calculated * 100) / 100} K.M</Text>
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
                                }
                            />
                    </View>
                        : null}

                    {/*NEARBY SERVICE PROVIDERS LIST END*/}


                    {/*SPECIAL RESTURANT LISTING START*/}
                    <View style={styles.block}>
                        <View style={styles.blockHeader}>
                            <Text style={styles.blockTitle}>Hungry? Order delicious foods now.</Text>
                            {/*<Button onPress={() => {*/}
                            {/*this.props.navigation.navigate('Shopping')*/}
                            {/*}} transparent style={customStyle.buttonOutlinePrimary}>*/}
                            {/*<Text style={customStyle.buttonOutlinePrimaryText}>View All</Text></Button>*/}
                        </View>
                        <View style={[styles.blockBody, {marginTop: 10, marginBottom: 15, padding: 0}]}>
                            <FlatList
                                contentContainerStyle={{paddingHorizontal: 10}}
                                data={this.partners}
                                horizontal={true}
                                _keyExtractor={(item, index) => index.toString()}
                                showsHorizontalScrollIndicator={false}
                                renderItem={({item, index}) =>

                                    <View key={item._id} style={[styles.card, {
                                        marginHorizontal: 5,
                                        width: 200
                                    }]}>
                                        <TouchableOpacity onPress={item.onPress}>
                                            <View>
                                                <Image onPress={() => item.onPress} source={item.imgSource}
                                                       style={{
                                                           flex: 1,
                                                           height: 100,
                                                           width: '100%',
                                                           resizeMode: 'cover',
                                                           margin: 5
                                                       }}/>
                                                {item.title ?
                                                    <View style={{
                                                        top: 0,
                                                        left: 0,
                                                        right: 0,
                                                        bottom: 0,
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        position: 'absolute'
                                                    }}>
                                                        <Text style={{
                                                            color: 'white',
                                                            fontWeight: '500',
                                                            fontSize: 30
                                                        }}>{item.title}</Text>
                                                    </View> : null}
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                }
                            />
                        </View>
                    </View>

                    {/*SPECIAL RESTURANT LISTING END*/}


                    {/*<TouchableOpacity onPress={()=>this.props.navigation.navigate('PickLocation')}>*/}
                    {/*<TouchableOpacity onPress={()=>this.setState({pickLocation:true})}>*/}
                    {/*<View>*/}
                    {/*<Text>Pick Location</Text>*/}
                    {/*</View>*/}
                    {/*</TouchableOpacity>*/}

                    {/*<LocationPicker*/}
                    {/*close={this.closePickLocation.bind(this)}*/}
                    {/*onLocationSelect={this.handleOnLocationSelect.bind(this)}*/}
                    {/*modalVisible={this.state.pickLocation} />*/}

                    {/*<ScrollView style={{viewportWidth: '100%', flex: 1}}>*/}
                    {this.state.searchMode == false ?
                        <View>
                            {/*<TouchableOpacity onPress={() => this.gotoBB()}>*/}
                            {/*<View>*/}
                            {/*<Image onPress={() => this.gotoBB()} source={require("../images/baadshah_logo.jpg")}*/}
                            {/*style={{*/}
                            {/*flex: 1,*/}
                            {/*height: 130,*/}
                            {/*width: viewportWidth - 10,*/}
                            {/*resizeMode: 'cover',*/}
                            {/*margin: 5*/}
                            {/*}}/>*/}
                            {/*/!*<View style={{*!/*/}
                            {/*/!*top: 0,*!/*/}
                            {/*/!*left: 0,*!/*/}
                            {/*/!*right: 0,*!/*/}
                            {/*/!*bottom: 0,*!/*/}
                            {/*/!*justifyContent: 'center',*!/*/}
                            {/*/!*alignItems: 'center',*!/*/}
                            {/*/!*position: 'absolute'*!/*/}
                            {/*/!*}}>*!/*/}
                            {/*/!*<Text style={{color: 'white', fontWeight: '500', fontSize: 30}}>BAADSHAH-BIRYANI</Text>*!/*/}
                            {/*/!*</View>*!/*/}
                            {/*</View>*/}
                            {/*</TouchableOpacity>*/}
                            <View style={styles.block}>
                                {this.state.Adds.length > 0 ?
                                    <View style={{
                                        minHeight: Math.round(viewportWidth * 0.29),
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <Carousel
                                            ref={(c) => {
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

                                    </View> : null}
                            </View>

                            {/*<FlatList style={styles.mainContainer}*/}
                                      {/*data={this.props.categories}*/}
                                      {/*numColumns={3}*/}
                                      {/*renderItem={this.renderItem}*/}
                                      {/*keyExtractor={item => item._id}*/}
                            {/*/>*/}
                        </View> :
                        <View>
                            <View style={{alignItems: 'center', marginHorizontal: 30}}>
                                <Text style={[styles.screenHeader, {color: colors.appLayout}]}>
                                    Services
                                </Text>

                            </View>
                            {this.state.services.length > 0 ?
                                <FlatList style={styles.contentList}
                                          data={this.state.services}
                                          renderItem={this._getListItem}
                                          initialNumToRender={15}
                                    // onEndReached={(distance) => this._onEndReached(distance)}
                                    // onEndReachedThreshold={0.1}
                                    // ListFooterComponent={this.state.loading ? <ActivityIndicator style={{height: 80}}/> : null}
                                          keyExtractor={(item, index) => item._id}
                                />
                                : <View style={customStyle.noList}>
                                    <Text style={customStyle.noListTextColor}>Sorry No Services found for
                                        "{this.currentSearch}"</Text>
                                </View>}
                            <View style={{alignItems: 'center', marginHorizontal: 30}}>
                                <Text style={[styles.screenHeader, {color: colors.appLayout}]}>
                                    Products
                                </Text>

                            </View>
                            {this.state.products.length > 0 ?
                                <FlatList style={styles.mainContainer}
                                          data={this.state.products}
                                          keyExtracter={(item, index) => item._id}
                                          horizontal={false}
                                          numColumns={2}
                                          renderItem={(item, index) => this._renderProduct(item, index)}
                                />
                                : <View style={customStyle.noList}>
                                    <Text style={customStyle.noListTextColor}>Sorry No Products found for
                                        "{this.currentSearch}"</Text>
                                </View>}
                        </View>
                    }
                </Content>
            </Container>
        )
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
        paddingVertical: 10,
        backgroundColor: colors.inputBackground,
        borderWidth: 0,
        marginVertical: 4,
        borderColor: '#808080',
        //elevation: 5,
        width: '31%',
        marginHorizontal: '1%',
        height: 100,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    catIcon: {
        padding: 10,
        borderRadius: 100,
        backgroundColor: '#fff',
        color: '#094c6b',
        width: 40,
        height: 40
    },
    activeTabIcon: {
        color: '#ffffff'
    },
    activeTabText: {
        color: '#ffffff'
    },
    serviceList: {
        //backgroundColor: colors.inputBackground,
        backgroundColor: '#094c6b0a',
        //marginVertical: 5,
        //marginHorizontal: '2%',
        borderRadius: 0,
        borderBottomColor: '#094c6b',
        borderBottomWidth: 5
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
        alignItems: 'center'
    },
    contentList: {
        //marginVertical: 3,
        //paddingVertical: 3
    },
    image: {
        width: 50,
        height: 56,
        borderRadius: 25,
        backgroundColor: '#000000'
    },
    banner: {
        width: 80,
        height: 50,
        borderRadius: 3,
        backgroundColor: '#000000'
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
        flex: 1,
        borderWidth: 0,
        marginHorizontal: 5,
        marginVertical: 5,
        borderColor: '#808080',
        elevation: 2,
        width: (viewportWidth / 2) - 10,
        justifyContent: 'center',
        alignItems: 'center'
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
        fontWeight: 'bold',
        fontFamily: 'Roboto',
        color: colors.primary,
    },
    blockBody: {
        padding: 15,
        paddingTop: 0
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
        padding: 10
    },
    cardItemCenter: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'column'
    },
    cardIcon: {
        paddingVertical: 20,
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        flex: 1
    },
    cardImage: {
        width: '100%',
        flexGrow: 1,
        paddingVertical: 10
    },
    cardText: {
        padding: 10
    },
    cardTitle: {
        color: variables.gray_100,
        fontSize: 15,
        marginBottom: 3,
        fontFamily: 'Roboto',
    },
    cardNote: {
        marginBottom: 5
    },
})
export default Meteor.withTracker(() => {
    return {
        categories: Meteor.collection('MainCategories').find(),
        notificationCount: Meteor.collection("newNotificationCount").find()
    }
})(Dashboard);


