import React, {Component} from 'react';
import Meteor, {withTracker} from 'react-native-meteor';
import {
    StyleSheet,
    Dimensions,
    StatusBar,
    View,
    TouchableOpacity,
    ActivityIndicator,
    FlatList, PermissionsAndroid
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
} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import {colors, customStyle} from '../config/styles';
const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');
import settings from "../config/settings";
import TouchableWithoutFeedback from "react-native-gesture-handler/touchables/TouchableWithoutFeedback";
import StarRating from "../components/StarRating/StarRating";
import Product from "../components/Store/Product";
import MyFunctions from "../lib/MyFunctions";
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
            Adds:[],
            query:''
        };
        this.arrayholder;
        this.currentSearch = '';
        this.region = {
            latitude: '',
            longitude: '',
        };
        this.granted;
        this.watchID;
        //this.onClick = this.onClick.bind(this);
    }

    handleOnPress = () => this.setState({showSearchBar:true});
    handleOnPressUnset = () => this.setState({showSearchBar:false,query:''});
    //onClick() {
        //let { showSearchBar } = this.state.showSearchBar;
        //this.setState({
            //showSearchBar: !showSearchBar,
        //});
    //}

    async componentDidMount()  {
        Meteor.subscribe('categories-list');
        Meteor.subscribe('aggChatChannels');
        Meteor.call('getActiveAdvertises',(err,res)=>{
            if(!err){
                this.setState({Adds:res});
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
        this.setState({categories: this.props.categories ? this.props.categories : [], loading: false})
        this.arrayholder = this.props.categories ? this.props.categories : [];
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
    }

    componentWillReceiveProps(newProps) {
        const oldProps = this.props
        if (oldProps.categories !== newProps.categories) {
            this.setState({categories: newProps.categories, loading: false})
            this.arrayholder = newProps.categories;
            this._search(this.currentSearch)
        }
    }
    componentWillUnmount() {
        this.mounted = false;
        this.watchID != null && Geolocation.clearWatch(this.watchID);
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
                loading:false,
                products: [],
                services: [],
                //   categories: this.arrayholder, loading: false
            });
            this.currentSearch='';
            return;
        }
        else {
            this.setState({
                searchMode: true,
            })
        };

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
                console.error('API error',error);
            });

    };

    _handlItemPress = (service) => {
        service.avgRate = this.averageRating(service.ratings);
        this.props.navigation.navigate('Service', {Id: service});
    }
    averageRating = (arr) => {
        let sum = 0;
        arr.forEach(item => {
            sum = sum + item.count;
        });
        var avg = sum / arr.length;
        return Math.round(avg);
    }
    _itemClick = (item) => {
        let Ids = [];
        item.subCategories.map(item => {
            Ids.push(item.subCatId)
        })
        this.props.navigation.navigate("Home", {Id: Ids, Region: this.region})
    }

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
                        fontWeight: 'bold',
                        color: '#ffffff'
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
        if(rowData.location)
        distance=MyFunctions.calculateDistance(this.region.latitude,this.region.longitude,rowData.location.geometry.location.lat,rowData.location.geometry.location.lng);
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
                            {(data.item.contact ||data.item.contact1)?
                            <Button transparent style={styles.serviceIconBtn} onPress={() => {
                                MyFunctions._callPhone(data.item.contact ? data.item.contact : data.item.contact1)
                            }}>
                                {/*<Icon name={'call'} color={'green'}/>*/}
                                <Icon name={'phone'} size={20} style={styles.catIcon}/>
                            </Button>
                            :null}

                        </Right>

                    </ListItem>
                </TouchableWithoutFeedback>
            </View>
        )
    }

    _renderItem({item, index}) {
        return (
            <View key={index} style={{}}>
                <Thumbnail square style={{width: '100%', height: Math.round(viewportWidth * 0.43), resizeMode: 'cover'}}
                           source={{uri: settings.IMAGE_URL +'images/'+ item.src}}/>
            </View>
        );
    }
    _handleProductPress=(pro)=>{
        Meteor.subscribe('products', pro.service);
        this.props.navigation.navigate("ProductDetail", {'Id': pro._id})
    }

    _renderProduct = (data, index) => {
        let item = data.item;
        return (
            <TouchableOpacity onPress={() =>this._handleProductPress(item) }
                              style={styles.productContainerStyle}>
                <Product key={item._id} product={item}/>

            </TouchableOpacity>
        )
    }

    render() {
        console.log(this.state.products,this.state.services);
        const { showSearchBar } = this.state;
        return (
            <Container style={{flex: 1, backgroundColor: colors.appBackground}}>
                <StatusBar
                    backgroundColor={colors.statusBar}
                    barStyle='light-content'
                />
                
                    {showSearchBar==false ? (
                        <Header style={{backgroundColor: '#094c6b'}}>
                        <Left style={{flex: 1}}>
                            <Button transparent onPress={() => {
                                this.props.navigation.openDrawer()
                            }}>
                                <Icon name={'ellipsis-v'} size={25} color={'white'}/></Button>
                        </Left>
                        <Body>
                        <Text style={{color: 'white', fontSize: 18, fontWeight: '500'}}>
                        Home
                    </Text>
                        </Body>
                        <Right>
                        <Button transparent onPress={this.handleOnPress}>
                            <Icon name={'search'} size={25} color={'white'}/></Button>
                        </Right>
                        </Header>
                        ) : (
                            <Header style={{backgroundColor: '#094c6b'}}>
                        <Left style={{flex: 1}}>
                            <Button transparent onPress={() => {
                                this.props.navigation.openDrawer()
                            }}>
                                <Icon name={'ellipsis-v'} size={25} color={'white'}/></Button>
                        </Left>
                            <Body style={{flexDirection: 'row', flex: 6}}>
                    
                    
                    <Item style={{height: 40, width: '90%'}}>
                        {!this.state.query?
                        <Icon style={styles.activeTabIcon} name='search' size={15}/>:null}
                        
                        <Input placeholder="Search" style={styles.searchInput}
                               placeholderTextColor='#ffffff'
                               selectionColor='#ffffff'
                            
                               onChangeText={(searchText) => {
                                   this._search(searchText),this.setState({query:searchText})
                               }}
                               autoCorrect={false}
                        />
                        <Right>
                        <Button transparent onPress={this.handleOnPressUnset}>
                            <Icon name={'close'} size={25} color={'white'}/></Button></Right>
                    </Item>
                    </Body>
                    </Header>
                        )}
                    
                    

                
                {this.state.loading ? <ActivityIndicator style={{flex: 1}}/> : null}
                <Content style={{width: '100%', flex: 1,}}>
                    {/*<ScrollView style={{viewportWidth: '100%', flex: 1}}>*/}
                    {this.state.searchMode==false ?
                        <View>
                            {this.state.Adds.length>0?
                        <View style={{minHeight: Math.round(viewportWidth * 0.43), justifyContent: 'center', alignItems: 'center'}}>
                            <Carousel
                                ref={(c) => {
                                    this._carousel = c;
                                }}
                                data={this.state.Adds}
                                renderItem={this._renderItem}
                                sliderWidth={viewportWidth}
                                itemWidth={viewportWidth}
                                //  slideStyle={{ viewportWidth: viewportWidth }}
                                inactiveSlideOpacity={1}
                                inactiveSlideScale={1}
                                autoplay={true}
                                loop={true}
                            />

                        </View>:null}
                        <FlatList style={styles.mainContainer}
                                  data={this.props.categories}
                                  numColumns={2}
                                  renderItem={this.renderItem}
                                  keyExtractor={item => item._id}
                        />
                        </View>:
                        <View>
                            <View style={{alignItems: 'center', marginHorizontal: 30}}>
                                <Text style={[styles.screenHeader, {color: colors.appLayout}]}>
                                    Services
                                </Text>

                            </View>
                            {this.state.services.length>0 ?
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
                                    <Text style={customStyle.noListTextColor}>Sorry No Services found for "{this.currentSearch}"</Text>
                                </View>}
                            <View style={{alignItems: 'center', marginHorizontal: 30}}>
                                <Text style={[styles.screenHeader, {color: colors.appLayout}]}>
                                    Products
                                </Text>

                            </View>
                            {this.state.products.length>0 ?
                            <FlatList style={styles.mainContainer}
                                      data={this.state.products}
                                      keyExtracter={(item, index) => item._id}
                                      horizontal={false}
                                      numColumns={2}
                                      renderItem={(item, index) => this._renderProduct(item, index)}
                            />
                                : <View style={customStyle.noList}>
                                    <Text style={customStyle.noListTextColor}>Sorry No Products found for "{this.currentSearch}"</Text>
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
        marginVertical: 8,
        borderColor: '#808080',
        //elevation: 5,
        width: '42%',
        marginHorizontal: '4%',
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
        color: '#ffffff',
        borderTopWidth: 0,
        borderRightWidth: 0,
        borderLeftWidth: 0,
        borderBottomWidth: 0,
    },

    productContainerStyle: {
        flex: 1,
        borderWidth: 0,
        marginHorizontal:5,
        marginVertical:5,
        borderColor: '#808080',
        elevation: 2,
        width: (viewportWidth / 2) - 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
})
export default withTracker(() => {

    return {
        categories: Meteor.collection('MainCategories').find()
    }
})(Dashboard);


