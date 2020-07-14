import React, {PureComponent} from 'react';
import {
    Container,
    Content,
    Text,
    View,
    Header,
    Item,
    Icon as NBIcon,
    Input,
    Button,
    Body,
    Card,
    CardItem,
} from 'native-base';
import {colors, customStyle} from '../config/styles';
import {
    FlatList,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Image,
} from 'react-native';
import settings from '../config/settings';
import Icon from 'react-native-vector-icons/Feather';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import {goBack} from '../Navigation';
import Meteor from '../react-native-meteor';

const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');
import {Navigation} from 'react-native-navigation';
import ServiceItem from "../components/Service/ServiceItem";

export default class SearchResult extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            query: '',
            services: [],
            products: [],
            categories: [],
            loading: false,
        };
        this.currentSearch = '';
    }

    _handleProductPress = pro => {
        Navigation.push(this.props.componentId, {
            component: {
                name: 'ProductDetail',
                passProps: {
                    Id: pro._id,
                },
            },
        });
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
    renderItem = (data, index) => {
        var item = data.item;
        return (
            <View key={item._id} style={styles.containerStyle}>
                <TouchableOpacity onPress={() => this._itemClick(item)}>
                    <Body>
                    <View style={styles.catIcon}>
                        <FAIcon name={item.icon} size={25} color='white'/>
                    </View>
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
    _search = text => {
        // const textData = text.trim().toUpperCase();
        this.setState({loading: true});
        // if (textData === this.currentSearch) {
        //     // abort search if query wasn't different
        //     return;
        // }
        if (text === '') {
            this.setState({
                loading: false,
                products: [],
                services: [],
                //   categories: this.arrayholder, loading: false
            });
            this.currentSearch = '';
            return;
        } else {
            this.setState({
                searchMode: true,
            });
        }
        this.currentSearch = text;
        // const newData = this.arrayholder.filter(item => {
        //     const itemData =
        //         `${item.mainCategory.toUpperCase()}`;
        //     return itemData.indexOf(textData) > -1;
        // });
        // this.setState({categories: newData, loading: false});

        var dataToSend = {
            searchValue: text,
        };
        console.log('fetch');

        Meteor.call('searchService', dataToSend, (err, res) => {
            console.log(err, res);
            if (!err) {
                this.setState({
                    loading: false,
                    services: res.result
                });
            }
        });

        Meteor.call('searchProducts', text, (err, res) => {
            console.log(err, res);
            if (!err) {
                this.setState({
                    loading: false,
                    products: res.result
                });
            }
        });

        Meteor.call('searchCategories', text, (err, res) => {
            console.log(err, res);
            if (!err) {
                this.setState({
                    loading: false,
                    categories: res.result
                });
            }
        });

        // fetch(settings.API_URL + 'mainSearch', {
        //     method: 'POST', //Request Type
        //     body: JSON.stringify(dataToSend), //post body
        //     headers: {
        //         //Header Defination
        //         'Content-Type': 'application/json',
        //     },
        // })
        //     .then(response => response.json())
        //     .then(responseJson => {
        //         // console.log(responseJson);
        //         this.setState({
        //             loading: false,
        //             services: responseJson.services,
        //             products: responseJson.products,
        //             categories: responseJson.categories,
        //         });
        //         // //  this.arrayholder = responseJson.data
        //     })
        //     .catch(error => {
        //         console.error('API error', error);
        //     });
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
    _getListItem = data => {
        let rowData = data.item;
        let distance;
        // if (rowData.location && rowData.location.geometry)
        //     distance = MyFunctions.calculateDistance(this.region.latitude, this.region.longitude, rowData.location.geometry.location.lat, rowData.location.geometry.location.lng);
        // console.log(distance);
        // return (
        //   <View key={data.item._id} style={styles.serviceList}>
        //     <TouchableWithoutFeedback
        //       onPress={() => {
        //         this._handlItemPress(data.item);
        //       }}>
        //       <ListItem thumbnail>
        //         <Left>
        //           {rowData.coverImage === null ? (
        //             //   <Thumbnail style={styles.banner} square source={dUser}/> :
        //             <Text />
        //           ) : (
        //             <Thumbnail
        //               style={styles.banner}
        //               source={{
        //                 uri: settings.API_URL + 'images/' + rowData.coverImage,
        //               }}
        //             />
        //           )}
        //         </Left>
        //         <Body>
        //           <Text numberOfLines={1} style={styles.serviceTitle}>
        //             {rowData.title}
        //           </Text>
        //           {rowData.location.formatted_address ? (
        //             <Text note numberOfLines={1} style={styles.serviceAddress}>
        //               {rowData.location.formatted_address}
        //             </Text>
        //           ) : null}
        //
        //           {distance ? (
        //             <Text note style={styles.serviceDist}>
        //               {distance} KM
        //             </Text>
        //           ) : null}
        //           <View style={styles.serviceAction}>
        //             <StarRating
        //               starRate={
        //                 rowData.hasOwnProperty('ratings')
        //                   ? this.averageRating(rowData.ratings)
        //                   : 0
        //               }
        //             />
        //             {/*{this.averageRating(rowData.ratings) > 0 ?
        //                             <Text style={{fontSize: 20, fontWeight: '400', color: '#ffffff'}}>
        //                                 <Icon name={'star'}
        //                                     style={{color: '#094c6b'}}/> : {rowData.hasOwnProperty('ratings') ? this.averageRating(rowData.ratings) : 0}
        //                         </Text> : null}*/}
        //           </View>
        //         </Body>
        //         <Right>
        //           {data.item.contact || data.item.contact1 ? (
        //             <Button
        //               transparent
        //               style={styles.serviceIconBtn}
        //               onPress={() => {
        //                 MyFunctions._callPhone(
        //                   data.item.contact
        //                     ? data.item.contact
        //                     : data.item.contact1,
        //                 );
        //               }}>
        //               {/*<Icon name={'call'} color={'green'}/>*/}
        //               <Icon name={'phone'} size={20} style={styles.catIcon} />
        //             </Button>
        //           ) : null}
        //         </Right>
        //       </ListItem>
        //     </TouchableWithoutFeedback>
        //   </View>
        // );

        return (
            <ServiceItem componentId={this.props.componentId} service={rowData}/>
        )
    };

    _renderProduct = (data, index) => {
        let item = data.item;
        console.log(item);
        return (
            <View>
                <TouchableOpacity
                    onPress={() => this._handleProductPress(item)}
                    style={styles.productContainerStyle}>
                    {/*<Product key={item._id} product={item}/>*/}
                    <Card key={item._id} style={customStyle.Card}>
                        <CardItem cardBody style={{width: '100%'}}>
                            <Image
                                source={{uri: settings.IMAGE_URL + item.images[0]}}
                                style={{
                                    flex: 1,
                                    width: undefined,
                                    height: 70,
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
                                }}>
                                {item.discount ? (
                                    <View
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            backgroundColor: colors.primary,
                                            opacity: 1,
                                            borderRadius: 5,
                                            textAlign: 'center',
                                            padding: 2,
                                        }}>
                                        <Text style={{fontSize: 10, color: 'white'}}>
                                            {item.discount}% off
                                        </Text>
                                    </View>
                                ) : null}
                            </View>
                        </CardItem>
                        <CardItem style={{paddingTop: 0}}>
                            <Button
                                style={{
                                    flex: 1,
                                    paddingLeft: 0,
                                    paddingRight: 0,
                                    paddingBottom: 0,
                                    paddingTop: 0,
                                }}
                                transparent
                                onPress={() => {
                                }}>
                                <Body>
                                <Text
                                    style={{fontSize: 14, color: colors.primaryText}}
                                    numberOfLines={2}>
                                    {item.title}
                                </Text>
                                <View style={{flex: 1, width: '100%', alignItems: 'center'}}>
                                    <Text
                                        note
                                        style={{
                                            fontSize: 12,
                                            paddingLeft: 2,
                                            paddingRight: 2,
                                            zIndex: 1000,
                                            backgroundColor: '#fdfdfd',
                                        }}>
                                        Rs. {item.price}
                                    </Text>
                                </View>
                                </Body>
                            </Button>
                        </CardItem>
                    </Card>
                </TouchableOpacity>
            </View>
        );
    };

    componentDidMount() {
        let searchText = this.props.SearchText;
        this.setState({query: searchText});
        this._search(searchText);
    }

    render() {
        return (
            <Container>
                <Header
                    searchBar
                    rounded
                    androidStatusBarColor={colors.statusBar}
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
                        <Button
                            onPress={() => goBack(this.props.componentId)}
                            style={{paddingHorizontal: 10}}
                            transparent>
                            <Icon name={'arrow-left'} size={25} color={colors.primary}/>
                        </Button>
                        <Input
                            placeholder="Search..."
                            style={styles.searchInput}
                            placeholderTextColor={colors.primaryText}
                            // selectionColor='#ffffff'
                            onChangeText={searchText => {
                                this._search(searchText), this.setState({query: searchText});
                            }}
                            value={this.state.query}
                            autoCorrect={false}
                        />
                        {/*<Right>*/}
                        <Button
                            style={{paddingHorizontal: 5}}
                            transparent
                            onPress={() => this.setState({query: ''})}>
                            <NBIcon
                                name={'close'}
                                size={25}
                                style={{color: colors.primary}}
                            />
                        </Button>
                        {/*</Right>*/}
                    </Item>
                    {/*</Body>*/}
                </Header>
                <Content style={{padding: 10, backgroundColor: colors.appBackground}}>
                    <View style={{alignItems: 'center', marginHorizontal: 30}}>
                        <Text style={[styles.screenHeader, {color: colors.appLayout}]}>
                            Services
                        </Text>
                    </View>
                    {this.state.services.length > 0 ? (
                        <FlatList
                            style={styles.contentList}
                            data={this.state.services}
                            renderItem={this._getListItem}
                            initialNumToRender={15}
                            // onEndReached={(distance) => this._onEndReached(distance)}
                            // onEndReachedThreshold={0.1}
                            // ListFooterComponent={this.state.loading ? <ActivityIndicator style={{height: 80}}/> : null}
                            keyExtractor={(item, index) => item._id}
                        />
                    ) : (
                        <View style={customStyle.noList}>
                            <Text style={customStyle.noListTextColor}>
                                Sorry No Services found for "{this.currentSearch}"
                            </Text>
                        </View>
                    )}
                    <View style={{alignItems: 'center', marginHorizontal: 30}}>
                        <Text style={[styles.screenHeader, {color: colors.appLayout}]}>
                            Products
                        </Text>
                    </View>
                    {this.state.products.length > 0 ? (
                        <FlatList
                            style={styles.mainContainer}
                            data={this.state.products}
                            keyExtracter={(item, index) => item._id}
                            horizontal={false}
                            numColumns={2}
                            renderItem={(item, index) => this._renderProduct(item, index)}
                        />
                    ) : (
                        <View style={customStyle.noList}>
                            <Text style={customStyle.noListTextColor}>
                                Sorry No Products found for "{this.currentSearch}"
                            </Text>
                        </View>
                    )}

                    <FlatList
                            contentContainerStyle={{
                            marginTop: 10,
                            paddingBottom: 10,
                            //   alignItems:'center',
                            justifyContent:'space-around',
                            flexWrap:'wrap',
                            flexDirection:'row',
                        }}
                        data={this.state.categories}
                        horizontal={false}
                        _keyExtractor={(item, index) => index.toString()}
                        showsHorizontalScrollIndicator={false}
                        renderItem={this.renderItem}
                        numColumns={3}
                    />
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
        //width: (viewportWidth-60)/3,
        width: 100,
        margin: 5,
        height: 100,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    catIcon: {
        padding: 10,
        borderRadius: 100,
        backgroundColor: colors.appLayout,
        color: 'white',
        width: 50,
        height: 50,
        alignItems:'center',
        justifyContent:'center'
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
        flex: 1,
        borderWidth: 0,
        // marginHorizontal: 2,
        marginVertical: 5,
        borderColor: '#808080',
        elevation: 1,
        width: viewportWidth / 3,
        justifyContent: 'center',
        alignItems: 'center',
    },
});