import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Alert,
    FlatList,
    StatusBar,
    Modal, ToastAndroid, Linking, Dimensions, TouchableNativeFeedback, AsyncStorage, Image
} from 'react-native';
import {
    Button,
    Container,
    Content,
    Header,
    Left,
    Body,
    Icon, Right, Badge, Title
} from 'native-base'
import Meteor  from "../../react-native-meteor";
import FIcon from 'react-native-vector-icons/Feather';
import {colors, customStyle} from "../../config/styles";

const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');
import {Navigation} from "react-native-navigation";
import {goBack,goToRoute} from "../../Navigation";
import settings from "../../config/settings";



class ProductsBB extends Component {
    ratingCompleted = (rating) => {
        this.setState({
            starCount: rating,
        });
    }


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
        Meteor.call('getProductsBB', (err, res) => {
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


    _renderProduct = (data, index) => {
        let item = data.item;
        return (
            <View style={styles.col}>
                <TouchableOpacity onPress={() => goToRoute(this.props.componentId,"ProductDetailBB", {'Id': item._id,data:item})} style={styles.containerStyle}>
                    <View style={[customStyle.Card, styles.card]}>
                        <Image source={{uri: settings.WEB_URL+'img/'+item.images[0]}} style={styles.thumbnail}/>
                        <View style={styles.cardDetails}>
                            <Text style={styles.productTitle}
                                  numberOfLines={2}>{item.title}</Text>
                            <Text style={styles.price}>Rs. {(item.price - (item.price * (item.discount / 100)))}{item.unit ?
                                <Text style={{
                                    fontSize: 16,
                                    fontWeight: 'normal'
                                }}> / {item.unit}</Text> : null}</Text>
                        </View>
                    </View>
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
                            <Title style={styles.screenHeader}>BAADSHAH BIRYANI</Title>
                        </Body>
                        {/*<Right>*/}
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
                            {/*<Button onPress={() => goToRoute(this.props.componentId,'CartEF')} transparent>*/}
                                {/*<Icon name='ios-cart' style={{fontSize:27,color:'white'}} />*/}
                                {/*{this.state.totalCount > 0 ?*/}
                                    {/*<Badge*/}
                                        {/*style={{position: 'absolute', height: 18}}>*/}
                                        {/*<Text style={{*/}
                                            {/*fontSize: 10,*/}
                                            {/*fontWeight: '100',*/}
                                            {/*color: 'white',*/}
                                            {/*lineHeight: 18*/}
                                        {/*}}>{this.state.totalCount}</Text></Badge> : null}*/}
                            {/*</Button>*/}
                        {/*</Right>*/}
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
    },
    thumbnail: {
        flex: 1, width: undefined, height: 150, resizeMode: 'cover'
    },
    productTitle: {
        fontSize: 15,
        marginBottom: 5
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 0,
        overflow: 'hidden',
    },
    cardDetails: {
        padding: 15
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
})(ProductsBB);