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
    Linking, ToastAndroid
} from 'react-native';
import {
    Icon as NBIcon,
    View,
    Container,
    Content,
    Item,
    Grid,
    Col,
    Toast,
    Text as NBText, Spinner, Button, Picker, Header, Left, Right, Title, Body, Footer, Label
} from 'native-base';
import FIcon from "react-native-vector-icons/Feather";
import Carousel, {Pagination} from 'react-native-snap-carousel';


import Text from "../../components/ecommerce/Text";

import {default as ProductComponent} from '../../components/ecommerce/Product';
import {colors, customStyle} from "../../config/styles";
import Meteor from "../../react-native-meteor";
import settings from "../../config/settings";
import AutoHeightWebView from 'react-native-autoheight-webview';
import {goBack, goToRoute} from "../../Navigation";

const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');


class ProductDetailEF extends Component {

    constructor(props) {
        super(props);
        this.state = {
            product: null,
            activeSlide: 0,
            quantity: 1,
            selectedColor: '',
            selectedSize: '',
            similarProducts: '',
            liked: false
        };
    }


    componentWillMount() {
        //get the product with id of this.props.product.id from your server
        //this.setState({product: this.props.Product});

    }

    async componentDidMount() {
        this.setInitial
        /* Select the default color and size (first ones) */
        let productId = this.props.route.params.Id;
        let _product = this.props.data;
        let wishList = await AsyncStorage.getItem('myWhishList');
        console.log('wishList', wishList);
        if (wishList)
            wishList = JSON.parse(wishList);
        else
            wishList = [];
        console.log(_product)
        if (_product) {
            this.setState({
                product: _product,
                liked: wishList.includes(_product._id) ? true : false
                // liked: false
            });
        }
        else {
            Meteor.call('getSingleProductEF', productId, (err, res) => {
                if (err) {
                    console.log('this is due to error. ' + err);
                }
                else {
                    this.setState({
                        product: res,
                        liked: wishList.includes(res._id) ? true : false
                        // liked: false
                    });
                }
                console.log('This is testing : '+ this.state.product)
            });
        }
        ;
        //Get Similar products
        Meteor.call('getSimilarProductEF', productId, (err, res) => {
            console.log(err, res);
            if (err) {
                console.log('this is due to error. ' + err);
            }
            else {
                this.setState({similarProducts: res});
            }
        });


        //Update Views Count
        Meteor.call('updateViewCountEF', productId);
    }

    setInitial() {
        let defColor = this.state.product.colors.length > 0 ? this.state.product.colors[0].trim() : '';
        let defSize = this.state.product.sizes.length > 0 ? this.state.product.sizes[0].trim() : '';
        this.setState({
            selectedColor: defColor,
            selectedSize: defSize
        });
        console.log(defColor, defSize)
    }

    componentWillReceiveProps(newProps) {
        if (this.props.Product != newProps.Product) {
            this.setState({product: newProps.Product});
        }
        if (this.state.product != null || this.state.product != undefined) {
            this.setInitial
        }

    }

    OrderNow() {
        let product = this.state.product;
        product['orderQuantity'] = this.state.quantity;
        product['finalPrice'] = Math.round(this.state.product.price - (this.state.product.price * (this.state.product.discount / 100)));
        this.props.navigation.navigate( 'CheckoutEF', {'productOrder': product});
    }

    _browse = (url) => {
        Linking.openURL(url).catch((err) => console.error('An error occurred', err));
    }

    render() {
        if (this.state.product != null || this.state.product != undefined) {
            this.setInitial
        }
        return (

            <Container style={customStyle.Container}>
                {/*<Header androidStatusBarColor={colors.statusBar}*/}
                {/*style={{backgroundColor: 'white', elevation: null}}>*/}
                {/*<Left>*/}
                {/*<Button transparent onPress={() => {*/}
                {/*this.props.navigation.pop()*/}
                {/*}}>*/}
                {/*<FIcon name="arrow-left" color={'#2E2E2E'} size={24}/>*/}
                {/*</Button>*/}
                {/*</Left>*/}

                {/*<Body>*/}
                {/*<Title>this.state.product.title</Title>*/}
                {/*</Body>*/}
                {/*<Right>*/}
                {/*<Button onPress={this.addToWishlist.bind(this)} transparent>*/}
                {/*{this.state.liked ?*/}
                {/*<NBIcon name='heart' style={{fontSize: 26, color: colors.appLayout}}/>*/}
                {/*: <FIcon name='heart' size={24} color={'#2E2E2E'}/>}*/}
                {/*</Button>*/}
                {/*</Right>*/}
                {/*</Header>*/}

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
                                          this.props.navigation.goBack()
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
                        <Content style={styles.content}>
                            <Carousel style={{backgroundColor: '#fff'}}
                                      data={this.state.product.images}
                                      renderItem={this._renderItem}
                                      ref={(carousel) => {
                                          this._carousel = carousel;
                                      }}
                                      sliderWidth={Dimensions.get('window').width}
                                      itemWidth={Dimensions.get('window').width}
                                      onSnapToItem={(index) => this.setState({activeSlide: index})}
                                      enableSnap={true}
                                      containerCustomStyle={{backgroundColor: '#fff'}}
                            />
                            <Pagination
                                dotsLength={this.state.product.images.length}
                                activeDotIndex={this.state.activeSlide}
                                containerStyle={{
                                    paddingTop: 10,
                                    paddingBottom: 10,
                                    marginTop: -15,
                                    backgroundColor: '#fff'
                                }}
                                dotContainerStyle={{marginHorizontal: 3}}
                                dotStyle={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: 20,
                                    marginHorizontal: 0,
                                    backgroundColor: colors.primary
                                }}
                                inactiveDotStyle={{backgroundColor: '#ddd'}}
                                inactiveDotScale={1}
                            />

                            <View style={{padding: 16, backgroundColor: '#fff'}}>
                                <View style={{flex: 1, flexDirection: 'column', alignItems: 'flex-start', marginBottom: 7}}>
                                    {this.state.product.price ?
                                        <Text style={{
                                            fontSize: 18,
                                            fontWeight: 'bold',
                                            color: colors.primaryText
                                        }}>Rs. {(this.state.product.price - (this.state.product.price * (this.state.product.discount / 100)))}{this.state.product.unit ?
                                            <Text style={{
                                                fontSize: 18,
                                                fontWeight: 'bold',
                                                color: colors.primaryText
                                            }}> / {this.state.product.unit}</Text> : null}</Text>
                                        : null}
                                    <Text style={{
                                        fontSize: 16,
                                        color: '#8E8E8E',
                                        textDecorationLine: 'line-through',
                                        paddingBottom: 2,
                                        marginLeft: 7
                                    }}>Rs {this.state.product.price}</Text>
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            color: '#8E8E8E',
                                            // color: colors.success,
                                            paddingBottom: 2,
                                            marginLeft: 7
                                        }}>{this.state.product.discount ? this.state.product.discount : 0}% off</Text>
                                </View>
                                <Text style={{
                                    fontSize: 16,
                                    marginBottom: 10,
                                    color: '#8E8E8E',
                                    //color: colors.primaryText,
                                    fontWeight: 'bold'
                                }}>{this.state.product.title}
                                    <Text style={{fontSize: 16}}
                                          note> ({this.state.product.isVeg ? "Veg" : "Non-Veg"})</Text>
                                </Text>
                                <Grid style={{borderBottomColor: '#ddd', borderBottomWidth: 0,marginBottom:10}}>
                                    <Col size={2}>
                                        <View style={{flex: 1, justifyContent: 'center'}}>
                                            <Text style={{fontSize: 15}}>Select Quantity</Text>
                                        </View>
                                    </Col>

                                    <Col size={1}>
                                        <View style={{flex: 1, flexDirection: 'row'}}>
                                            <Button block icon transparent
                                                    onPress={() => this.setState({quantity: this.state.quantity > 1 ? this.state.quantity - 1 : 1})}>
                                                <FIcon name='minus' size={20} style={{color: colors.appLayout}}/>
                                            </Button>
                                            <View style={{
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                paddingLeft: 20,
                                                paddingRight: 20
                                            }}>
                                                <Text style={{fontSize: 15}}>{this.state.quantity}</Text>
                                            </View>
                                            <Button block icon transparent
                                                    onPress={() => this.setState({quantity: this.state.quantity + 1})}>
                                                <FIcon style={{color: colors.appLayout}} size={20} name='plus'/>
                                            </Button>
                                        </View>
                                    </Col>
                                </Grid>
                                <View>
                                <Button block onPress={this.OrderNow.bind(this)}
                                            style={[customStyle.buttonPrimary, {marginRight: 5, marginBottom:10}]}>
                                        <Text style={customStyle.buttonPrimaryText}>Order Now</Text>
                                    </Button>
                                </View>
                                {/* <Grid>
                                <Col size={3}>
                                    <Text style={{
                                        fontSize: 18,
                                        color: colors.appLayout
                                    }}>{this.state.product.productTitle}</Text>
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
                            </Grid> */}

                                {/*<Text*/}
                                {/*style={{fontSize: 16, marginBottom: 16}}>{this.state.product.availabeQuantity} {this.state.product.unit}{this.state.product.availabeQuantity > 1 ? 's' : ''} available</Text>*/}
                                {/*<Grid >*/}
                                {/*<Col size={2}>*/}
                                {/*<View style={{flex: 1, justifyContent: 'center'}}>*/}
                                {/*<Text style={{fontSize: 15}}>Is Veg</Text>*/}
                                {/*</View>*/}
                                {/*</Col>*/}
                                {/*<Col size={1}><Text style={{fontSize: 16}}>{this.state.product.isVeg}</Text></Col>*/}
                                {/*</Grid>*/}
                                {/*<Grid style={{borderBottomColor: '#ddd', borderBottomWidth: 1}}>*/}
                                {/*<Col size={2}>*/}
                                {/*<View style={{flex: 1, justifyContent: 'center'}}>*/}
                                {/*<Text style={{fontSize: 15}}>Brand</Text>*/}
                                {/*</View>*/}
                                {/*</Col>*/}
                                {/*<Col size={1}><Text*/}
                                {/*style={{fontSize: 16}}>{this.state.product.brand}</Text></Col>*/}
                                {/*</Grid>*/}
                                <Label style={{
                                    borderBottomColor: '#ddd',
                                    borderBottomWidth: 1,
                                    color: colors.primaryText
                                }}>Nutritions</Label>
                                {this.state.product.nutritions.map(item => (
                                    <Grid style={{borderBottomColor: '#ddd', borderBottomWidth: 0}}>
                                        <Col size={2}>
                                            <View style={{flex: 1, justifyContent: 'center'}}>
                                                <Text style={{fontSize: 15}}>{item.label}</Text>
                                            </View>
                                        </Col>
                                        <Col size={2}>
                                            <View style={{flex: 1, justifyContent: 'center'}}>
                                                <Text style={{fontSize: 15}}>{item.value}</Text>
                                            </View>
                                        </Col>
                                    </Grid>
                                ))}
                                {/*<Grid style={{borderBottomColor: '#ddd', borderBottomWidth: 1}}>*/}
                                {/*<Col size={2}>*/}
                                {/*<View style={{flex: 1, justifyContent: 'center'}}>*/}
                                {/*<Text style={{fontSize: 15}}>Color</Text>*/}
                                {/*</View>*/}
                                {/*</Col>*/}
                                {/*{this.state.product.colors ?*/}
                                {/*<Col size={1}>*/}
                                {/*<Picker*/}
                                {/*mode="dropdown"*/}
                                {/*placeholder="Select a color"*/}
                                {/*note={true}*/}
                                {/*selectedValue={this.state.selectedColor}*/}
                                {/*onValueChange={(color) => this.setState({selectedColor: color})}*/}
                                {/*>*/}
                                {/*{this.renderColors(this.state.product.colors)}*/}
                                {/*</Picker>*/}
                                {/*</Col> : null}*/}
                                {/*</Grid>*/}
                                {/*<Grid style={{borderBottomColor: '#ddd', borderBottomWidth: 1}}>*/}
                                {/*<Col size={2}>*/}
                                {/*<View style={{flex: 1, justifyContent: 'center'}}>*/}
                                {/*<Text style={{fontSize: 15}}>Size</Text>*/}
                                {/*</View>*/}
                                {/*</Col>*/}
                                {/*{this.state.product.sizes ?*/}
                                {/*<Col size={1}>*/}
                                {/*<Picker*/}
                                {/*mode="dropdown"*/}
                                {/*placeholder="Select a size"*/}
                                {/*note={true}*/}
                                {/*selectedValue={this.state.selectedSize}*/}
                                {/*onValueChange={(size) => this.setState({selectedSize: size})}*/}
                                {/*>*/}
                                {/*{this.renderSize(this.state.product.sizes)}*/}
                                {/*</Picker>*/}
                                {/*</Col> : null}*/}
                                {/*</Grid>*/}
                                

                            </View>
                            <View style={{padding: 16, marginTop: 7, backgroundColor: '#fff'}}>
                                <Text style={{marginBottom: 5, color: '#8E8E8E', marginBottom: 10}}>Description</Text>
                                {/*<NBText>*/}
                                {/*{this.state.product.content}*/}
                                {/*</NBText>*/}
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


                                    source={{html: this.state.product.content || " "}}

                                />
                            </View>
                            <View style={{marginTop: 7}}>
                                <Text style={{
                                    fontSize: 15,
                                    fontWeight: 'bold',
                                    padding: 15,
                                    backgroundColor: '#fff',
                                    borderBottomColor: '#ddd',
                                    borderBottomWidth: 1
                                }}>Similar items</Text>
                                <FlatList style={styles.mainContainer}
                                          data={this.state.similarProducts}
                                          keyExtracter={(item, index) => item._id}
                                          horizontal={false}
                                          numColumns={2}
                                          renderItem={(item, index) => this._renderProduct(item, index)}
                                />
                            </View>
                        </Content>
                        {/* <Footer style={{
                            backgroundColor: 'white',
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingHorizontal: 5
                        }}>
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
                            </Grid>
                        </Footer> */}
                    </>
                    :
                    <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                        <Spinner color={colors.primary}/>
                    </View>}
                {/* <Footer>
                        <Button block onPress={this.addToCart.bind(this)}
                                style={{backgroundColor: colors.appLayout, marginRight: 10}}>
                            <Text style={{color: "#fdfdfd", marginLeft: 5}}>Add to cart</Text>
                        </Button>
                        <Button block onPress={this.OrderNow.bind(this)}
                                style={{backgroundColor: colors.appLayout, marginRight: 10}}>
                            <Text style={{color: "#fdfdfd", marginLeft: 5}}>Order Now</Text>
                        </Button>
                    </Footer> */}
            </Container>
        );
    }

    _renderItem = ({item, index}) => {
        return (
            <TouchableWithoutFeedback
                key={index}
                onPress={() => this.props.navigation.navigate( 'ImageGallery', {
                    images: this.state.product.images,
                    position: parseInt(index)
                })}
            >
                <Image
                    source={{uri: settings.IMAGE_URL + item}}
                    style={{width: Dimensions.get('window').width, height: 300, resizeMode: 'contain'}}
                    resizeMode="cover"
                />
            </TouchableWithoutFeedback>
        );
    }

    _renderProduct = (data, index) => {
        let item = data.item;
        return (
            <TouchableOpacity onPress={() => this.props.navigation.push("ProductDetailEF", {'Id': item._id, data: item})}
                              style={styles.containerStyle}>
                <ProductComponent key={item._id} product={item}/>
            </TouchableOpacity>
        )
    }

    renderColors(colorsss) {
        let colors = [];
        // colorsss = colorsss.includes(',') ? colorsss.split(',') : [colorsss];
        colorsss.map((color, i) => {
            colors.push(
                <Item style={{textAlign: 'flex-end'}} key={i} label={color.trim()} value={color.trim()}/>
            );
        });
        return colors;
    }

    renderSize(sizess) {
        let size = [];
        // sizess = sizess.includes(',') ? sizess.split(',') : [sizess];
        sizess.map((s, i) => {
            size.push(
                <Item key={i} label={s.trim()} value={s.trim()}/>
            );
        });
        return size;
    }

    addToCart = async () => {
        var product = this.state.product;
        // product['color'] = this.state.selectedColor ? this.state.selectedColor : this.state.product.colors[0];
        // product['size'] = this.state.selectedSize ? this.state.selectedSize : this.state.product.sizes[0];
        product['orderQuantity'] = this.state.quantity;
        // product['finalPrice'] = Math.round(this.state.product.price - (this.state.product.price * (this.state.product.discount / 100)));
        let cartList = await AsyncStorage.getItem('myCart');
        let cartItem = {
            id: product._id,
            orderQuantity: product.orderQuantity
        }
        if (cartList) {
            cartList = JSON.parse(cartList);
        }
        else {
            cartList = [];
        }
        let index = cartList.findIndex(item => {
            return item.id == product.id
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
        let index = wishList.findIndex(item => {
            return item == productId
        });
        if (index > -1)
            wishList.splice(index, 1);
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

    search(array, object) {
        for (var i = 0; i < array.length; i++)
            if (JSON.stringify(array[i]) === JSON.stringify(object))
                return true;
        return false;
    }
}

const styles = StyleSheet.create({
    container: {},
    content: {},
    mainContainer: {},
    containerStyle: {
        width: (viewportWidth / 2),
        borderRadius: 0,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        borderRightWidth: 1,
        borderRightColor: '#ddd',
        backgroundColor: '#fff'
    },
});

export default Meteor.withTracker((props) => {
    let param = props.Id;
    //let Id = typeof (param) === "string" ? param : param._id; this is commented as _id is not available
    let Id = typeof (param) === "string" ? param : null;
    console.log(Id)
    //Meteor.subscribe('singleProduct', Id);
    //Meteor.subscribe('similarProducts', Id);
    return {
        user: Meteor.user(),
        Products: Meteor.collection('products').find({_id: {$ne: Id}}),
        Product: Meteor.collection('products').findOne({_id: Id})
    };
})(ProductDetailEF);
