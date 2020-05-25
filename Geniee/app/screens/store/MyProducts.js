import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Alert,
    FlatList,
     Dimensions, AsyncStorage
} from 'react-native';
import {
    Button,
    Container,
    Content,
    Header,
    Left,
    Body, Right, Title} from 'native-base';
import Meteor  from "../../react-native-meteor";
import FIcon from 'react-native-vector-icons/Feather';
import {colors} from "../../config/styles";

const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');
import Product from "../../components/ecommerce/Product";
import {Navigation} from "react-native-navigation";
import {goBack,goToRoute} from "../../Navigation";
import Menu,{MenuItem} from "react-native-material-menu";


class MyProducts extends Component {
    ratingCompleted = (rating) => {
        this.setState({
            starCount: rating,
        });
    };


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
            wishList:[]
        }

    }

    componentDidMount() {
        Navigation.events().bindComponent(this);
        // this.handler= DeviceEventEmitter.addListener('onEsewaComplete', this.onEsewaComplete);
        Meteor.call('getMyProducts', (err, res) => {
            console.log(err,res)
            if (err) {
                console.log('this is due to error. '+err);
            }
            else{
                this.setState({Products: res});
            }
        });
        this.setState({
            //     totalCount: this.props.Count.length > 0 ? this.props.Count[0].totalCount : 0,
            CategoryName:this.props.Category
        });

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
    componentWillUnmount() {
    }

    clickEventListener() {
        Alert.alert("Success", "Product has been added to cart")
    }

    editProduct=(_product)=>{
        goToRoute(this.props.componentId,"AddProduct",{Product:_product});
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
        console.log(item);
        return (
            <View style={styles.col}>
                <TouchableOpacity onPress={() => goToRoute(this.props.componentId,"ProductDetail", {'Id': item._id,data:item})} style={styles.containerStyle}>
                    <Product key={item._id} product={item}/>
                        <Button transparent style={{height:40,width:40}} onPress={() => this[`menu${item._id}`].show()} style={{position:'absolute', top:0,right:5}}>
                            {/*<Icon name={'ios-menu'} style={{fontSize:25,color:colors.danger }}/>*/}
                            <Menu
                                ref={ref => (this[`menu${item._id}`] = ref)}
                                button={
                                    <Button transparent onPress={() => this[`menu${item._id}`].show()}>
                                        <FIcon name={'more-vertical'} size={20} color={colors.whiteText}/>
                                    </Button>}>
                                <MenuItem onPress={() => {
                                    this[`menu${item._id}`].hide(), this.editProduct(item)
                                }}>Edit Product</MenuItem>
                                <MenuItem onPress={() => {
                                    this[`menu${item._id}`].hide(), this.removeProduct(item)
                                }}>Remove Product</MenuItem>
                            </Menu>
                        </Button>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        const Id = this.props.Id;
        return (

            <Container style={styles.container}>
                <Header androidStatusBarColor={colors.statusBar}
                        style={{backgroundColor: colors.appLayout}}>
                    <Left>
                        <Button transparent onPress={() => {
                            goBack(this.props.componentId)
                        }}>
                            <FIcon name="arrow-left" color={'white'} size={24}/>
                        </Button>
                    </Left>

                    <Body>
                    <Title style={styles.screenHeader}>My Products</Title>
                    </Body>
                    <Right>
                        {/*<Button onPress={() => goToRoute(this.props.componentId,'WishListEF')} transparent>*/}
                            {/*<FIcon name='heart' style={{fontSize:24,color:'white'}} />*/}
                            {/*{this.state.wishList.length > 0 ?*/}
                                {/*<Badge*/}
                                    {/*style={{position: 'absolute', height: 18}}>*/}
                                    {/*<Text style={{*/}
                                        {/*fontSize: 10,*/}
                                        {/*fontWeight: '100',*/}
                                        {/*color: 'white',*/}
                                        {/*lineHeight: 18*/}
                                    {/*}}>{this.state.wishList.length}</Text></Badge>*/}
                                {/*: null}*/}
                        {/*</Button>*/}
                        <Button onPress={() => goToRoute(this.props.componentId,'AddProduct')} transparent>
                            <FIcon name='plus' style={{fontSize:27,color:'white'}} />
                        </Button>
                    </Right>
                </Header>
                <Content style={styles.content}>
                    <FlatList style={styles.mainContainer}
                        //data={this.props.Products}
                              data={this.state.Products}
                              keyExtracter={(item, index) => item._id}
                              horizontal={false}
                              numColumns={2}
                              renderItem={(item, index) => this._renderProduct(item, index)}
                    />
                </Content>
            </Container>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#eee',
    },
    mainContainer: {
    },
    containerStyle: {
        borderRadius: 4,
        overflow: 'hidden'
    },
    content: {
        padding: 8
    },
    col: {
        width: (viewportWidth / 2) - 8,
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
})(MyProducts);