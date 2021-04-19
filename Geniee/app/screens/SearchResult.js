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
    Body,Left, Right
} from 'native-base';
import {colors} from '../config/styles';
import {
    FlatList,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import {goBack} from '../Navigation';
import Meteor from '../react-native-meteor';
import Product from '../components/Store/Product';
import CartIcon from '../components/HeaderIcons/CartIcon';

const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');
const materialColors=['#C2185B', '#7B1FA2', '#512DA8', '#303F9F', '#1976D2','#AFB42B','#D32F2F','#0288D1' ,'#5D4037','#0097A7','#FBC02D','#00796B', '#388E3C', '#F57C00','#689F38','#E64A19',
'#616161','#FFA000','#455A64' ];
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
        this.props.navigation.push('ProductDetail', { Id: pro._id,})
        // Navigation.push(this.props.componentId, {
        //     component: {
        //         name: 'ProductDetail',
        //         passProps: {
        //             Id: pro._id,
        //         },
        //     },
        // });
    };

    _itemClick = item => {
        let Ids = [];
        item.subCategories.map(item => {
            Ids.push(item.subCatId);
        });
        this.props.navigation.navigate("ServiceList", {Id: Ids, Region: this.region})
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
    renderItem = (data, index) => {
        var item = data.item;
        return (
            <View key={item._id} style={styles.containerStyle}>
                <TouchableOpacity onPress={() => this._itemClick(item)}>
                    <Body>
                    <View style={[styles.catIcon,{backgroundColor:materialColors[data.index]}]}>
                        <FAIcon name={item.icon} size={25} color='white'/>
                    </View>
                    </Body>

                    <Text
                        style={{
                            textAlign: 'center',
                            fontWeight: '200',
                            color: materialColors[data.index],
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
          this.props.navigation.navigate('Service', {Id: service._id});
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
    _getListItem = data => {
        let rowData = data.item;
        let distance;
        return (
            <ServiceItem navigation={this.props.navigation} service={rowData}/>
        )
    };

    _renderProduct = (data, index) => {
        let item = data.item;
        // console.log(item);
        return (
            <Product product={item} navigation={this.props.navigation}/>
           
        );
    };

    componentDidMount() {
        let searchText = this.props.route.params.SearchText;
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
                    style={{backgroundColor: '#4d94ff'}}>
                    <Left style={{flex: 1}}>
                    <Button transparent onPress={() => 
                    this.props.navigation.goBack()}>
                    <Icon name={'arrow-left'} size={25} color={'white'}/></Button>
                    {/*<CogMenu componentId={this.props.componentId}/>*/}
                    </Left>
                    {/*<Body style={{flexDirection: 'row', flex: 6}}>*/}

                    <Item search style={{height: 40, width: '95%', paddingLeft: 10, flex:6.5,  backgroundColor: '#cce0ff',
                            zIndex: 1,
                            borderRadius:8,
                            borderBottomWidth:0,}}>
                        {/* <Button
                            onPress={() => this.props.navigation.goBack()}
                            style={{paddingHorizontal: 10}}
                            transparent>
                            <Icon name={'arrow-left'} size={25} color={colors.primary}/>
                        </Button> */}
                        <Input
                        style={{ fontFamily: 'Roboto' }}
                        underlineColorAndroid="rgba(0,0,0,0)"
                        returnKeyType="search"
                            placeholder="Search..."
                            style={styles.searchInput}
                            // selectionColor='#ffffff'
                            onChangeText={searchText => {
                                this._search(searchText), this.setState({query: searchText});
                            }}
                            value={this.state.query}
                            autoCorrect={false}
                        />
                       
                       <Button
                            style={{paddingHorizontal: 2}}
                            transparent
                            onPress={() => this.setState({query: ''})}>
                            <NBIcon
                                name={'close'}
                                size={25}
                                style={{color: colors.whiteText}}
                            />
                        </Button>
                        
                    </Item>
                    <Right style={{alignItems:'center', justifyContent:'center'}}>
                    {/* <TouchableOpacity
                            style={{paddingHorizontal: 5}}
                            transparent
                            onPress={() => this.setState({query: ''})}>
                            <Icon
                                name={'shopping-bag'}
                                size={25}
                                style={{color: colors.whiteText}}v
                            />
                        </TouchableOpacity> */}
                        <CartIcon navigation={this.props.navigation}/>
                    </Right>
                    {/*</Body>*/}
                </Header>
                <Content style={{padding: 10, backgroundColor: colors.appBackground}}>
                    {/* <View style={{alignItems: 'center', marginHorizontal: 30}}>
                        <Text style={[styles.screenHeader, {color: colors.appLayout}]}>
                            Services
                        </Text>
                    </View> */}
                    {this.state.services.length > 0 ? (
                        <FlatList
                            style={styles.contentList}
                            data={this.state.services}
                            renderItem={this._getListItem}
                            initialNumToRender={15}
                            numColumns={2}
                            // onEndReached={(distance) => this._onEndReached(distance)}
                            // onEndReachedThreshold={0.1}
                            // ListFooterComponent={this.state.loading ? <ActivityIndicator style={{height: 80}}/> : null}
                            keyExtractor={(item, index) => item._id}
                        />
                    ) : null}
                    
                    {/*  (
                         <View style={customStyle.noList}>
                             <Text style={customStyle.noListTextColor}>
                                 Sorry No Services found for "{this.currentSearch}"
                             </Text>
                         </View>
                     )} */}
                    {/* <View style={{alignItems: 'center', marginHorizontal: 30}}>
                        <Text style={[styles.screenHeader, {color: colors.appLayout}]}>
                            Products
                        </Text>
                    </View> */}
                    {this.state.products.length > 0 ? (
                        <FlatList
                            style={styles.mainContainer}
                            data={this.state.products}
                            keyExtracter={(item, index) => item._id}
                            horizontal={false}
                            numColumns={2}
                            renderItem={(item, index) => this._renderProduct(item, index)}
                        />
                    ) : null}
                    
                    {/* (
                        <View style={customStyle.noList}>
                            <Text style={customStyle.noListTextColor}>
                                Sorry No Products found for "{this.currentSearch}"
                            </Text>
                        </View>
                    )} */}

                    <FlatList
                            contentContainerStyle={{
                            marginTop: 10,
                            paddingBottom: 10,
                            //   alignItems:'center',
                            justifyContent:'space-around',
                            // flexWrap:'wrap',
                            // flexDirection:'row',
                        }}
                        data={this.state.categories}
                        horizontal={false}
                        keyExtractor={(item, index) => index.toString()}
                        showsHorizontalScrollIndicator={false}
                        renderItem={this.renderItem}
                        numColumns={Math.round(viewportWidth/100)}
                    />
                </Content>
            </Container>
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