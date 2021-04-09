import React, {Component} from 'react';
import {
    StyleSheet,
    Alert,
    FlatList,
    Dimensions, AsyncStorage, TouchableOpacity
} from 'react-native';
import {
    Button,
    Container,
    Header,Item, Input, Left,Right,Body} from 'native-base';
import Meteor  from "../../react-native-meteor";
import FIcon from 'react-native-vector-icons/Feather';
import {colors} from "../../config/styles";
const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');
import Product from "../../components/Store/Product";
import CartIcon from '../../components/HeaderIcons/CartIcon';


class AllProducts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            starCount: 2,
            isLoading: false,
            showModal: false,
            comment: '',
            totalCount:0,
            CategoryName:'',
            Products:[],
            wishList:[],
            loading:false
        };
        this.arrayHolder=[];
        this.skip=0;
        this.limit=20;

    }

    componentDidMount() {
        
        // this.handler= DeviceEventEmitter.addListener('onEsewaComplete', this.onEsewaComplete);
      // this._fetchData()
        this.setState({
            //     totalCount: this.props.Count.length > 0 ? this.props.Count[0].totalCount : 0,
            CategoryName:this.props.Category
        });
        this._fetchData();
    }

    _fetchData(){
        if(!this.state.loading) {
            this.setState({loading:true})
            Meteor.call('getPopularProducts', this.skip, this.limit, (err, res) => {
                this.setState({loading:false});
                 console.log(err, res);
                if (err) {
                    console.log('this is due to error. ' + err);
                }
                else {
                    this.skip=this.skip+this.limit;
                    this.arrayHolder=this.arrayHolder.concat(res.result);
                    this.setState({Products: this.arrayHolder});
                };
            });
        }
    };
    _onEndReached = (distance) => {
        console.log(distance);
            this._fetchData();
    }
    async componentDidAppear() {
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
        this.setState({wishList:wishList,totalCount:cartList.length});
    }
    componentWillReceiveProps(newProps) {
        if (this.props.Count != newProps.Count) {
            if (newProps.Count.length > 0) {
                this.setState({totalCount: newProps.Count[0].totalCount})
            }
        }
    }
    handleBackButton() {
        console.log('handlebackpress from AllProducts');
        this.props.navigation.navigate('Home');
        return true;
    }

    // componentDidAppear() {
    //     BackHandler.addEventListener(
    //         'hardwareBackPress',
    //         this.handleBackButton.bind(this),
    //     );
    //     this._fetchData();
    // }

    // componentDidDisappear() {
    //     BackHandler.removeEventListener(
    //         'hardwareBackPress',
    //         this.handleBackButton.bind(this),
    //     );
    // }
    clickEventListener() {
        Alert.alert("Success", "Product has been added to cart")
    }

    editProduct=(_product)=>{
        this.props.navigation.navigate("AddProduct",{Product:_product});
    }

    removeProduct=(_product)=>{
        Alert.alert(
            'Remove Product',
            `Do you want to remove product '${_product.title}'?`,
            [
                {
                    text: 'Yes Remove', onPress: () =>
                        Meteor.call('removeProduct',_product._id,(err,res)=>{
                            if (!err) {
                                ToastAndroid.showWithGravityAndOffset(
                                    "Removed Successfully",
                                    ToastAndroid.SHORT,
                                    ToastAndroid.BOTTOM,
                                    0,
                                    50,
                                );
                            }
                            else {
                                ToastAndroid.showWithGravityAndOffset(
                                    err.reason,
                                    ToastAndroid.SHORT,
                                    ToastAndroid.BOTTOM,
                                    0,
                                    50,
                                );
                            }
                        })
                },
                {
                    text: 'Cancel', onPress: () => {
                        return true;
                    }
                }
            ],
            {cancelable: false}
        );
    }

    _renderProduct = (data, index) => {
        let item = data.item;
        //  console.log(item);
        return (
            // <View style={styles.col}>
            //     <View  style={styles.containerStyle}>
            //         <Product key={item._id} product={item} bottomTab={true} componentId={this.props.componentId}/>
            //         {item.serviceOwner==Meteor.userId()?
            //         <Button transparent style={{height:40,width:40}} onPress={() => this[`menu${item._id}`].show()} style={{position:'absolute', top:0,right:5}}>
            //             {/*<Icon name={'ios-menu'} style={{fontSize:25,color:colors.danger }}/>*/}
            //             <Menu
            //                 ref={ref => (this[`menu${item._id}`] = ref)}
            //                 button={
            //                     <Button transparent onPress={() => this[`menu${item._id}`].show()}>
            //                         <FIcon name={'more-vertical'} size={20} color={colors.whiteText}/>
            //                     </Button>}>
            //                 <MenuItem onPress={() => {
            //                     this[`menu${item._id}`].hide(), this.editProduct(item)
            //                 }}>Edit Product</MenuItem>
            //                 <MenuItem onPress={() => {
            //                     this[`menu${item._id}`].hide(), this.removeProduct(item)
            //                 }}>Remove Product</MenuItem>
            //             </Menu>
            //         </Button>:null}
            //     </View>
            // </View>

            <Product product={item} navigation={this.props.navigation} />
        )
    }

    render() {
        const Id = this.props.route.params.Id;
        return (

            <Container style={styles.container}>
                <Header searchBar rounded androidStatusBarColor={colors.statusBar}
                        style={{backgroundColor: colors.appLayout}}>
                    <Left style={{flex:1}}>
                        <Button transparent onPress={() => {
                            this.props.navigation.goBack()
                        }}>
                            <FIcon name="arrow-left" color={'white'} size={24}/>
                        </Button>
                    </Left>

                    {/* <Body style={{width:'100%'}}> */}
                   
                    <Item
                        search
                        style={{
                            flex:6.5,
                            backgroundColor: '#cce0ff',
                            height: 40,
                            zIndex: 1,
                            borderRadius:8,
                            borderBottomWidth:0,
                             width:'95%'
                        }}>
                        
                        <Input
                            style={{ fontFamily: 'Roboto' }}
                            placeholder={'Search...'}
                            underlineColorAndroid="rgba(0,0,0,0)"
                            returnKeyType="search"
                            // onSubmitEditing={this._search}
                            // onChangeText={searchText => {
                            //     this.setState({ query: searchText });
                            // }}
                        />
                        <Button
                            transparent
                            // onPress={this._search.bind(this)}
                            >
                            <FIcon
                                style={{
                                    paddingHorizontal: 20,
                                    fontSize: 15,
                                    color: colors.whiteText,
                                }}
                                name={'search'}
                            />
                        </Button>
                    </Item>
                    {/* </Body> */}
                    <Right style={{alignItems:'center', justifyContent:'center'}} >
                        {/* {Meteor.userId()?
                        <TouchableOpacity  onPress={() => this.props.navigation.navigate('AddProduct')} transparent>
                            <FIcon name='plus' style={{fontSize:27,color:'white'}} />
                        </TouchableOpacity>: */}
                        <CartIcon navigation={this.props.navigation}/>
                        {/* } */}
                    </Right>  

                    {/* <Item>
                        <Button style={{paddingHorizontal:10}} transparent onPress={() => {
                            this.props.navigation.goBack()
                        }}>
                            <FIcon name="arrow-left"   size={24}/>
                        </Button> 

                        <Input placeholder="Search..." />
                        {Meteor.userId()?
                        <Button style={{paddingHorizontal:10}} onPress={() => this.props.navigation.navigate('AddProduct')} transparent>
                            <FIcon name='plus' style={{fontSize:28}} />
                        </Button>:null}

                    </Item> */}
                </Header>
                {/* <Content style={styles.content}> */}
                    <FlatList contentContainerStyle={styles.mainContainer}
                        //data={this.props.Products}
                              data={this.state.Products}
                              keyExtracter={(item, index) => item._id}
                            //   horizontal={false}
                              numColumns={2}
                              renderItem={(item, index) => this._renderProduct(item, index)}
                              onEndReachedThreshold={0.1}
                              onEndReached={(distance) => this._onEndReached(distance)}
                    />
                {/* </Content> */}
            </Container>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: colors.appBackground,
    },
    mainContainer: {
        // flexDirection:'row',
        // flexWrap:'wrap',
        paddingHorizontal:5,
        width:'100%',
        flex:1,
    },
    containerStyle: {
        borderRadius: 4,
        overflow: 'hidden',
        backgroundColor:'white'
    },
    content: {
        flex:1,
        padding: 8
    },
    col: {
        width: (viewportWidth-16)/ 2,
        maxWidth:180,
        padding: 4
    }

});

export default Meteor.withTracker((props) => {
    let Id = props.Id;
    //Meteor.subscribe('productsByCategory', Id);
    return {
        detailsReady: true,
        user: Meteor.user(),
        //Products: Meteor.collection('products').find({category: Id}),
        //    Count: Meteor.collection('cartCount').find()
    };
})(AllProducts);