import React, {Component} from 'react';
import Meteor, {withTracker} from 'react-native-meteor';
import {
    StyleSheet,
    Dimensions,
    StatusBar,
    View,
    Image,
    ImageBackground,
    TouchableOpacity,
    ActivityIndicator,
    FlatList
} from 'react-native';
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
    Thumbnail, Label
} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import {colors, customStyle} from '../config/styles';
import SplashScreen from "react-native-splash-screen";
import settings from "../config/settings";
import TouchableWithoutFeedback from "react-native-gesture-handler/touchables/TouchableWithoutFeedback";
import StarRating from "../components/StarRating/StarRating";
import Product from "../components/Store/Product";
// import { Header } from 'react-native-elements';

const window = Dimensions.get('window');

class Dashboard extends Component {

    constructor(props) {
        super(props)
        this.state = {
            categories: [],
            loading: false,
            services: [],
            products: [],
            searchMode: false,
        };
        this.arrayholder;
        this.currentSearch = '';
        this.region = {
            latitude: 27.712020,
            longitude: 85.312950,
        };
        this.granted;
    }

    componentDidMount() {
        Meteor.subscribe('categories-list');
        Meteor.subscribe('aggChatChannels')
        console.log("You can use locations ")
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
        this.setState({categories: this.props.categories ? this.props.categories : [], loading: false})
        this.arrayholder = this.props.categories ? this.props.categories : []
    }

    componentWillReceiveProps(newProps) {
        const oldProps = this.props
        if (oldProps.categories !== newProps.categories) {
            this.setState({categories: newProps.categories, loading: false})
            this.arrayholder = newProps.categories;
            this._search(this.currentSearch)
        }
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
        })
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

                        {rowData.dist ?
                            <Text note
                                  style={styles.serviceDist}>{Math.round(rowData.dist.calculated * 100) / 100} KM</Text> : null}
                        {/*<Text note numberOfLines={1}>{'Ph: '}{rowData.contact} {' , Service on'} {rowData.radius} {' KM around'}</Text>*/}
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
                            <Button transparent style={styles.serviceIconBtn} onPress={() => {
                                this._callPhone(data.item.contact ? data.item.contact : data.item.contact1)
                            }}>
                                {/*<Icon name={'call'} color={'green'}/>*/}
                                <Icon name={'phone'} size={20} style={styles.catIcon}/>
                            </Button>

                        </Right>

                    </ListItem>
                </TouchableWithoutFeedback>
            </View>
        )

    }

    _renderProduct = (data, index) => {
        let item = data.item;
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate("ProductDetail", {'Id': item._id})}
                              style={styles.containerStyle}>
                <Product key={item._id} product={item}/>
            </TouchableOpacity>
        )
    }

    render() {
        console.log(this.state.products,this.state.services)
        return (
            <Container style={{flex: 1, backgroundColor: colors.appBackground}}>
                <StatusBar
                    backgroundColor={colors.statusBar}
                    barStyle='light-content'
                />
                <Header style={{backgroundColor: '#094c6b'}}>
                    <Left style={{flex: 1}}>
                        <Button transparent onPress={() => {
                            this.props.navigation.openDrawer()
                        }}>
                            <Icon name={'ellipsis-v'} size={25} color={'white'}/></Button>
                    </Left>
                    <Body style={{flexDirection: 'row', flex: 6}}>
                    <Item style={{height: 40, width: '90%'}}>
                        {/*<Button transparent onPress={()=>{}}>*/}
                        <Icon style={styles.activeTabIcon} name='search' size={15}/>
                        {/*</Button>*/}
                        <Input placeholder="Search" style={styles.searchInput}
                               placeholderTextColor='#ffffff'
                               selectionColor='#ffffff'
                            //  underlineColorAndroid="transparent"
                               onChangeText={(searchText) => {
                                   this._search(searchText)
                               }}
                               autoCorrect={false}
                        />
                    </Item>
                    </Body>

                </Header>
                {this.state.loading ? <ActivityIndicator style={{flex: 1}}/> : null}
                <Content style={{width: '100%', flex: 1,}}>
                    {/*<ScrollView style={{width: '100%', flex: 1}}>*/}
                    {this.state.searchMode==false ?
                        <FlatList style={styles.mainContainer}
                                  data={this.props.categories}
                                  numColumns={2}
                                  renderItem={this.renderItem}
                                  keyExtractor={item => item._id}
                        /> :
                        <View>
                            <View style={{alignItems: 'center', marginHorizontal: 30}}>
                                <Text style={[styles.screenHeader, {color: colors.appLayout}]}>
                                    Services
                                </Text>

                            </View>
                            {this.state.services.length>1 ?
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
                            {this.state.products.length>1 ?
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
    searchInput: {
        //borderBottomWidth: 3,
        //borderBottomColor: '#000000',
        color: '#ffffff',
        //backgroundColor: '#898e907a',
        // height: 40,
        // width: 300,
        // paddingHorizontal: 16,
        borderTopWidth: 0,
        borderRightWidth: 0,
        borderLeftWidth: 0,
        borderBottomWidth: 0,
    }
})
export default withTracker(() => {

    return {
        categories: Meteor.collection('MainCategories').find()
    }
})(Dashboard);


