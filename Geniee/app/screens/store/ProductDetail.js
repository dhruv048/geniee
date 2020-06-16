/**
 * This is the Main file
 **/

// React native and others libraries imports
import React, {Component} from 'react';
import {
    Image,
    Dimensions,
    TouchableWithoutFeedback,
    AsyncStorage,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Linking,ToastAndroid
} from 'react-native';
import {
    Icon as NBIcon,
    View,
    Container,
    Content,
    Item,
    Grid,
    Col,
    Text as NBText, Spinner, Button, Footer, Picker
} from 'native-base';
import FIcon from "react-native-vector-icons/Feather";
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {Navigation} from 'react-native-navigation';
import Text from "../../components/Store/Text";
import Product from "../../components/Store/Product";
import {colors, customStyle} from "../../config/styles";
import Meteor from "../../react-native-meteor";
import settings from "../../config/settings";
import {goToRoute} from "../../Navigation";
import AutoHeightWebView from 'react-native-autoheight-webview';

const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');


class ProductDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            product: '',
            activeSlide: 0,
            quantity: 1,
            selectedColor: '',
            selectedSize: '',
            similarProducts:[]
        };
    }


    async componentDidMount() {
        // /* Select the default color and size (first ones) */
        // let defColor = this.state.product.colors[0];
        // let defSize = this.state.product.sizes[0];
        // this.setState({
        //     selectedColor: defColor,
        //     selectedSize: defSize
        // });

        Navigation.events().bindComponent(this);
        //get the product with id of this.props.product.id from your server
        let productId = this.props.Id;
        let _product = this.props.data;
        let wishList = await AsyncStorage.getItem('myWhishList');
        console.log('wishList', wishList);
        if (wishList)
            wishList = JSON.parse(wishList);
        else
            wishList = [];

        if (_product) {
            productId=_product._id;
            this.setState({
                product: _product,
                  liked: wishList.includes(_product._id) ? true : false
                // liked: false
            })
        }
        else {
            Meteor.call('getSingleProduct', productId, (err, res) => {
                if (err) {
                    console.log('this is due to error. ' + err);
                }
                else {
                    console.log(res);
                    productId=res._id;
                    this.setState({
                        product: res,
                        liked: wishList.includes(res._id) ? true : false
                        // liked: false
                    });
                }
            });
        };

        //Get Similar products
        Meteor.call('getSimilarProduct', productId, (err, res) => {
            if (err) {
                console.log('this is due to error. ' + err);
            }
            else {
                this.setState({similarProducts: res});
            }
        })


        //Update View Count
        Meteor.call('updateViewCount',productId);
    }

    // componentWillReceiveProps(newProps) {
    //     if (this.props.Product != newProps.Product) {
    //         this.setState({product: newProps.Product});
    //     }
    //
    // }

    _browse = (url) => {
        Linking.openURL(url).catch((err) => console.error('An error occurred', err));
    }

    render() {
        return (

            <Container style={{backgroundColor: colors.appBackground}}>
                <View style={{
                    paddingHorizontal: 16,
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    left: 0,
                    height: 70,
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    zIndex: 1
                }}>
                    <TouchableOpacity style={{
                        alignSelf: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: 40,
                        height: 40,
                        borderRadius: 100,
                    }}
                                      onPress={() => {
                                          Navigation.pop(this.props.componentId)
                                      }}>
                        <FIcon name='arrow-left' color='white' size={24}/>
                    </TouchableOpacity>

                    {this.state.product ?
                        <Text numberOfLines={1} note style={{color: 'white'}}>{this.state.product.title}</Text> : null}
                    <TouchableOpacity style={{
                        alignSelf: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: 40,
                        height: 40,
                        borderRadius: 100,
                    }}
                                      onPress={this.addToWishlist.bind(this)}>
                        {this.state.liked ?
                            <NBIcon name='heart' style={{fontSize: 26, color: colors.primary}}/>
                            : <FIcon name='heart' size={24} color='white'/>}
                    </TouchableOpacity>

                </View>
                {this.state.product ?
                    <>
                    <Content>
                    <View style={{flex:1}}>
                        <Carousel
                            data={this.state.product.images}
                            renderItem={this._renderItem}
                            ref={(carousel) => {
                                this._carousel = carousel;
                            }}
                            sliderWidth={Dimensions.get('window').width}
                            itemWidth={Dimensions.get('window').width}
                            onSnapToItem={(index) => this.setState({activeSlide: index})}
                            enableSnap={true}
                        />
                        </View>
                        <Pagination
                            dotsLength={this.state.product.images.length}
                            activeDotIndex={this.state.activeSlide}
                            containerStyle={{
                                backgroundColor: 'transparent',
                                paddingTop: 0,
                                paddingBottom: 0,
                                marginTop: -15
                            }}
                            dotStyle={{
                                width: 10,
                                height: 10,
                                borderRadius: 5,
                                marginHorizontal: 2,
                                backgroundColor: 'rgba(255, 255, 255, 0.92)'
                            }}
                            inactiveDotOpacity={0.4}
                            inactiveDotScale={0.6}
                        />
                        <View style={{
                            backgroundColor: '#fdfdfd',
                            paddingTop: 10,
                            paddingBottom: 10,
                            paddingLeft: 12,
                            paddingRight: 12,
                            alignItems: 'center'
                        }}>
                            <Grid>
                                <Col size={3}>
                                    <Text style={{
                                        fontSize: 18,
                                        color: colors.appLayout
                                    }}>{this.state.product.title}</Text>
                                </Col>
                                {this.state.product.price ?
                                    <Col size={2}>
                                        <Text style={{
                                            fontSize: 17,
                                            fontWeight: 'bold',
                                            color: colors.appLayout
                                        }}>Rs. {this.state.product.price}{this.state.product.unit ?
                                            <Text>/{this.state.product.unit}</Text> : null}</Text>
                                    </Col>
                                    : null}
                            </Grid>

                            <Grid>
                                <Col size={2}>
                                    <View style={{flex: 1, justifyContent: 'center'}}>
                                        <Text>Available Quantity:</Text>
                                    </View>
                                </Col>
                                <Col size={2}><Text style={{fontSize: 16}}>{this.state.product.availabeQuantity}</Text></Col>
                            </Grid>
                            {/*{this.state.product.colors ?*/}
                                {/*<Grid>*/}
                                    {/*<Col size={2}>*/}
                                        {/*<View style={{flex: 1, justifyContent: 'center'}}>*/}
                                            {/*<Text>Available Colors:</Text>*/}
                                        {/*</View>*/}
                                    {/*</Col>*/}
                                    {/*<Col size={2}><Text style={{fontSize: 16}}>{this.state.product.colors}</Text></Col>*/}
                                {/*</Grid> : null}*/}
                            {/*{this.state.product.sizes ?*/}
                                {/*<Grid>*/}
                                    {/*<Col size={2}>*/}
                                        {/*<View style={{flex: 1, justifyContent: 'center'}}>*/}
                                            {/*<Text>Available Size:</Text>*/}
                                        {/*</View>*/}
                                    {/*</Col>*/}
                                    {/*<Col size={2}><Text style={{fontSize: 16}}>{this.state.product.sizes}</Text></Col>*/}
                                {/*</Grid> : null}*/}
                            {this.state.product.contact ?
                                <Grid>
                                    <Col size={2}>
                                        <View style={{flex: 1, justifyContent: 'center'}}>
                                            <Text>Cntact No:</Text>
                                        </View>
                                    </Col>
                                    <Col size={2}><Text style={{fontSize: 16}}>{this.state.product.contact}</Text></Col>
                                </Grid> : null}
                            <Grid>
                                <Col size={2}>
                                    <View style={{flex: 1, justifyContent: 'center'}}>
                                        <Text>Home Delivery ?</Text>
                                    </View>
                                </Col>
                                <Col size={2}><Text
                                    style={{fontSize: 16}}>{this.state.product.homeDelivery ? "YES" : "NO"}</Text></Col>
                            </Grid>
                            {(this.state.product.hasOwnProperty('radius') && this.state.product.radius > 0) ?
                                <Grid>
                                    <Col size={2}>
                                        <View style={{flex: 1, justifyContent: 'center'}}>
                                            <Text>Servie Area :</Text>
                                        </View>
                                    </Col>
                                    <Col size={2}><Text style={{fontSize: 16}}>Within {this.state.product.radius} KM
                                        Radius</Text></Col>
                                </Grid>
                                : null}
                            {this.state.product.website ?
                                <Grid>
                                    <Col size={2}>
                                        <View style={{flex: 1, justifyContent: 'center'}}>
                                            <Text>WebLink</Text>
                                        </View>
                                    </Col>
                                    <Col size={2}>
                                        <TouchableOpacity onPress={() => {
                                            this._browse(this.state.product.website)
                                        }}>
                                            <Text style={{fontSize: 16, color: colors.statusBar}}>
                                                {this.state.product.website}
                                            </Text>
                                        </TouchableOpacity>
                                    </Col>
                                </Grid> : null}



                            <Grid>
                            <Col size={2}>
                            <View style={{flex: 1, justifyContent: 'center'}}>
                            <Text>Select Quantity:</Text>
                            </View>
                            </Col>

                            <Col size={2}>
                            <View style={{flex: 1, flexDirection: 'row'}}>
                            <Button block icon transparent
                            onPress={() => this.setState({quantity: this.state.quantity > 1 ? this.state.quantity - 1 : 1})}>
                            <NBIcon name='ios-remove' style={{color: colors.appLayout}}/>
                            </Button>
                            <View style={{
                            flex: 4,
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingLeft: 30,
                            paddingRight: 30
                            }}>
                            <Text style={{fontSize: 18}}>{this.state.quantity}</Text>
                            </View>
                            <Button block icon transparent
                            onPress={() => this.setState({quantity: this.state.quantity < this.state.product.availabeQuantity? this.state.quantity+ 1 : this.state.product.availabeQuantity})}>
                            <NBIcon style={{color: colors.appLayout}} name='ios-add'/>
                            </Button>
                            </View>
                            </Col>
                            </Grid>
                            {/*<Grid style={{marginTop: 15}}>*/}
                            {/*<Col size={3}>*/}
                            {/*<Button block onPress={this.addToCart.bind(this)}*/}
                            {/*style={{backgroundColor: colors.appLayout}}>*/}
                            {/*<Text style={{color: "#fdfdfd", marginLeft: 5}}>Add to cart</Text>*/}
                            {/*</Button>*/}
                            {/*</Col>*/}
                            {/*<Col>*/}
                            {/*<Button block onPress={this.addToWishlist.bind(this)} icon transparent*/}
                            {/*style={{backgroundColor: '#fdfdfd'}}>*/}
                            {/*<Icon style={{color: colors.appLayout}} name='ios-heart'/>*/}
                            {/*</Button>*/}
                            {/*</Col>*/}
                            {/*</Grid>*/}
                            {this.state.product.colors && this.state.product.colors.length>0?
                            <Grid style={{marginTop: 15}}>
                                <Col size={2}>
                                    <View style={{flex: 1, justifyContent: 'center'}}>
                                        <Text>Color:</Text>
                                    </View>
                                </Col>

                                    <Col size={2}>
                                        <Picker
                                            mode="dropdown"
                                            placeholder="Select a color"
                                            note={true}
                                            selectedValue={this.state.selectedColor}
                                            onValueChange={(color) => this.setState({selectedColor: color})}
                                        >
                                            {this.renderColors(this.state.product.colors)}
                                        </Picker>
                                    </Col>
                            </Grid>:null}
                            {this.state.product.sizes && this.state.product.sizes.length>0?
                            <Grid>
                                <Col size={2}>
                                    <View style={{flex: 1, justifyContent: 'center'}}>
                                        <Text>Size:</Text>
                                    </View>
                                </Col>
                                    <Col size={2}>
                                        <Picker
                                            mode="dropdown"
                                            placeholder="Select a size"
                                            note={true}
                                            selectedValue={this.state.selectedSize}
                                            onValueChange={(size) => this.setState({selectedSize: size})}
                                        >
                                            {this.renderSize(this.state.product.sizes)}
                                        </Picker>
                                    </Col>
                            </Grid>:null}
                            <View style={{
                                marginTop: 15,
                                padding: 10,
                                borderWidth: 1,
                                borderRadius: 3,
                                borderColor: 'rgba(149, 165, 166, 0.3)'
                            }}>
                                <Text style={{marginBottom: 5}}>Description</Text>
                                <View style={{
                                    width: 50,
                                    height: 1,
                                    backgroundColor: 'rgba(44, 62, 80, 0.5)',
                                    marginLeft: 7,
                                    marginBottom: 10
                                }}/>
                               {/* <NBText note>
                                    {this.state.product.description}
                                </NBText>*/}
                                 <AutoHeightWebView
                                    // default width is the width of screen
                                    // if there are some text selection issues on iOS, the width should be reduced more than 15 and the marginTop should be added more than 35
                                    style={{
                                        width: viewportWidth - 33,
                                        marginHorizontal: 15,
                                        marginVertical: 20
                                    }}

                                    customStyle={''}

                                    onSizeUpdated={size => console.log(size.height)}


                                    source={{html: this.state.product.description || " "}}

                                />
                            </View>
                        </View>
                        <View style={{marginTop: 15, paddingLeft: 12, paddingRight: 12}}>
                            <Text style={{marginBottom: 5}}>Similar items</Text>
                            <View style={{
                                width: 50,
                                height: 1,
                                backgroundColor: 'rgba(44, 62, 80, 0.5)',
                                marginLeft: 7,
                                marginBottom: 10
                            }}/>
                            <FlatList style={styles.mainContainer}
                                      data={this.state.similarProducts}
                                      keyExtracter={(item, index) => item._id}
                                      horizontal={false}
                                      numColumns={2}
                                      renderItem={(item, index) => this._renderProduct(item, index)}
                            />
                        </View>
                    </Content>
                        <Footer style={{backgroundColor:'white', justifyContent:'center', alignItems:'center', paddingHorizontal:5}}>
                            <Grid>
                                <Col size={2}>
                                    <Button block onPress={this.addToCart}
                                            style={[customStyle.buttonPrimary, {marginRight: 5}]}>
                                        <Text style={customStyle.buttonPrimaryText}>Add to Cart</Text>
                                    </Button>
                                </Col>
                                <Col size={2}>
                                    <Button block onPress={this.OrderNow.bind(this)}
                                            style={[customStyle.buttonPrimary, {marginRight: 5}]}>
                                        <Text style={customStyle.buttonPrimaryText}>Order Now</Text>
                                    </Button>
                                </Col>
                                <Col size={1}>
                                    <Button block icon transparent
                                        // onPress={this.addToCart.bind(this)}
                                            style={[customStyle.buttonOutlineSecondary, {marginRight: 5}]}>
                                        <FIcon name={'phone'} size={24} color={colors.primary}/>
                                    </Button>
                                </Col>
                                <Col size={1}>
                                    <Button block icon transparent
                                         onPress={this.handleChat.bind(this)}
                                            style={[customStyle.buttonOutlineSecondary, {marginRight: 5}]}>
                                        <FIcon name={'message-square'} size={24} color={colors.primary}/>
                                    </Button>
                                </Col>
                            </Grid>
                        </Footer>
                        </>
                    :
                    <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                    <Spinner color={colors.primary}/>
                    </View>}
            </Container>
        );
    }

    _renderItem = ({item, index}) => {
        return (
            <TouchableWithoutFeedback
                key={index}
                onPress={() => goToRoute(this.props.componentId,'ImageGallery', {
                    images: this.state.product.images,
                    position: parseInt(index)
                })}
            >
                <Image
                    source={{uri: settings.API_URL + 'images/' + item}}
                    style={{width: Dimensions.get('window').width, height: 300, resizeMode: 'contain'}}
                    resizeMode="cover"
                />
            </TouchableWithoutFeedback>
        );
    }

    _renderProduct = (data, index) => {
        let item = data.item;
        console.log(item)
        return (
            <View key={item._id} style={{width:'50%'}}>
                <TouchableOpacity onPress={()=>goToRoute(this.props.componentId,"ProductDetail", {'Id':item._id,'data':item})} style={styles.containerStyle}>
                    <Product  product={item}   />
                </TouchableOpacity>
            </View>
        )
    }

    renderColors(colorsss) {
        let colors = [];
      //  colorsss = colors.includes(',') ? colorsss.split(',') : [colorsss];
        colorsss.map((color, i) => {
            colors.push(
                <Item key={i} label={color} value={color}/>
            );
        });
        return colors;
    }

    renderSize(sizess) {
        let size = [];
       // sizess = sizess.includes(',') ? sizess.split(',') : [sizess];
        sizess.map((s, i) => {
            size.push(
                <Item key={i} label={s} value={s}/>
            );
        });
        return size;
    }

    // renderSimilairs() {
    //     let items = [];
    //     let stateItems = this.state.product.similarItems;
    //     for (var i = 0; i < stateItems.length; i += 2) {
    //         if (stateItems[i + 1]) {
    //             items.push(
    //                 <Grid key={i}>
    //                     <ProductComponent key={stateItems[i].id} product={stateItems[i]}/>
    //                     <ProductComponent key={stateItems[i + 1].id} product={stateItems[i + 1]} isRight/>
    //                 </Grid>
    //             );
    //         }
    //         else {
    //             items.push(
    //                 <Grid key={i}>
    //                     <ProductComponent key={stateItems[i].id} product={stateItems[i]}/>
    //                     <Col key={i + 1}/>
    //                 </Grid>
    //             );
    //         }
    //     }
    //     return items;
    // }

    openGallery = (pos) => {
        goToRoute(this.props.componentId,'ImageGallery', {images: this.state.product.images, position: pos});
    }

    addToCart=async() =>{
        var product = this.state.product;
        product['color'] = this.state.selectedColor ? this.state.selectedColor : this.state.product.colors[0];
        product['size'] = this.state.selectedSize ? this.state.selectedSize : this.state.product.sizes[0];
        product['orderQuantity'] = this.state.quantity;
        // product['finalPrice'] = Math.round(this.state.product.price - (this.state.product.price * (this.state.product.discount / 100)));
        let cartList = await AsyncStorage.getItem('myCart');
        let cartItem={
            id:product._id,
            orderQuantity:product.orderQuantity,
            color:product.color,
            size:product.size
        }
        if (cartList) {
            cartList = JSON.parse(cartList);
        }
        else {
            cartList = [];
        }
        let index = cartList.findIndex(item => {
            return item.id == product._id
        });
        if (index > -1) {
            cartList.splice(index, 1);
            cartList.push(cartItem);
        }
        else {
            cartList.push(cartItem);
        }
        ToastAndroid.showWithGravityAndOffset(
            'Product added to your cart !',
            ToastAndroid.LONG,
            ToastAndroid.TOP,
            0,
            50,
        );
        AsyncStorage.setItem('myCart', JSON.stringify(cartList));
    }

    async addToWishlist() {
        var productId = this.state.product._id;
        const liked = this.state.liked;
        this.setState({liked: !liked});
        let wishList = await AsyncStorage.getItem('myWhishList');
        if (wishList) {
            wishList = JSON.parse(wishList);
        }
        else {
            wishList = [productId];
        }
        let index=wishList.findIndex(item=>{return item==productId});
        if(index>-1)
            wishList.splice(index,1);
        else
            wishList.push(productId);

        AsyncStorage.setItem('myWhishList', JSON.stringify(wishList));
        ToastAndroid.showWithGravityAndOffset(
            liked ? 'Product removed from  Wishlist !' : 'Product added to  Wishlist !',
            ToastAndroid.LONG,
            ToastAndroid.TOP,
            0,
            50,
        );
    }

    OrderNow() {
        let product = this.state.product;
        product['orderQuantity'] = this.state.quantity;
        product['color'] = this.state.selectedColor ? this.state.selectedColor : this.state.product.colors[0];
        product['size'] = this.state.selectedSize ? this.state.selectedSize : this.state.product.sizes[0];
        product['finalPrice'] = Math.round(this.state.product.price - (this.state.product.discount ? (this.state.product.price * (this.state.product.discount / 100)):0));
        goToRoute(this.props.componentId,'CheckoutEF', {'productOrder': product});
    }

    _getChatChannel(userId){
        var channelId = new Promise(function (resolve, reject) {
            Meteor.call('addChatChannel', userId, function (error, result) {
                if (error) {
                    reject(error);
                } else {
                    // Now I can access `result` and make an assign `result` to variable `resultData`
                    resolve(result);
                }
            });
        });
        return channelId;
    }

    handleChat(){
        let Service=this.state.product.Service;
        console.log('service' + Service._id);
        this._getChatChannel(Service._id).then(channelId => {
            // console.log(channelId);
            let Channel = {
                channelId: channelId,
                user: {
                    userId: Service.createdBy,
                    name: "",
                    profileImage: null,
                },
                service: Service
            };
            goToRoute(this.props.componentId,"Message",{Channel});
        }).catch(error => {
            console.error(error);
        });
    }



    search(array, object) {
        for (var i = 0; i < array.length; i++)
            if (JSON.stringify(array[i]) === JSON.stringify(object))
                return true;
        return false;
    }

}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'wrap',

    },
    containerStyle: {
        flex: 1,
        borderWidth: 0,
        marginHorizontal:5,
        marginVertical:5,
        borderColor: '#808080',
        elevation: 2,
        width: (viewportWidth / 2) - 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
});

export default Meteor.withTracker((props) => {
    // let param = props.Id;
    // let Id = typeof (param) === "string" ? param : param._id;
    // Meteor.subscribe('products', Id);
    return {
        user: Meteor.user(),
        // Products: Meteor.collection('product').find({_id: {$ne: Id}}),
        // Product: Meteor.collection('product').findOne({_id: Id})
    };
})(ProductDetail);
