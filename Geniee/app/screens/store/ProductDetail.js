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
    Linking
} from 'react-native';
import {
    View,
    Container,
    Content,
    Button,
    Left,
    Right,
    Picker,
    Item,
    Grid,
    Col,
    Toast,
    Text as NBText, Spinner
} from 'native-base';
import Icon from "react-native-vector-icons/Feather";
import Carousel, {Pagination} from 'react-native-snap-carousel';

import {Navigation} from 'react-native-navigation';
import Text from "../../components/Store/Text";
import Product from "../../components/Store/Product";
import {colors} from "../../config/styles";
import Meteor from "../../react-native-meteor";
import settings from "../../config/settings";
import {goToRoute} from "../../Navigation";

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


    componentDidMount() {
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

        if (_product) {
            productId=_product._id;
            this.setState({
                product: _product,
                //   liked: wishList.includes(_product._id) ? true : false
                // liked: false
            })
        }
        else {
            Meteor.call('getSingleProduct', productId, (err, res) => {
                if (err) {
                    console.log('this is due to error. ' + err);
                }
                else {
                    productId=res._id;
                    this.setState({
                        product: res,
                        //  liked: wishList.includes(res._id) ? true : false
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
        });
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
                        <Icon name='arrow-left' color='white' size={24}/>
                    </TouchableOpacity>

                    {/*<TouchableOpacity style={{*/}
                    {/*alignSelf: 'center',*/}
                    {/*justifyContent: 'center',*/}
                    {/*alignItems: 'center',*/}
                    {/*width: 40,*/}
                    {/*height: 40,*/}
                    {/*borderRadius: 100,*/}
                    {/*}}*/}
                    {/*onPress={this.UpdateDoctorProfile}>*/}
                    {/*<Icon name='check' color={colors.appLayout} size={24}/>*/}
                    {/*</TouchableOpacity>*/}

                </View>
                {this.state.product ?
                    <Content>
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
                            {/*<Grid style={{marginTop: 15}}>*/}
                            {/*<Col>*/}
                            {/*<View style={{flex: 1, justifyContent: 'center'}}>*/}
                            {/*<Text>Color:</Text>*/}
                            {/*</View>*/}
                            {/*</Col>*/}
                            {/*{this.state.product.colors?*/}
                            {/*<Col size={3}>*/}
                            {/*<Picker*/}
                            {/*mode="dropdown"*/}
                            {/*placeholder="Select a color"*/}
                            {/*note={true}*/}
                            {/*selectedValue={this.state.selectedColor}*/}
                            {/*onValueChange={(color) => this.setState({selectedColor: color})}*/}
                            {/*>*/}
                            {/*{this.renderColors(this.state.product.colors)}*/}
                            {/*</Picker>*/}
                            {/*</Col>:null}*/}
                            {/*</Grid>*/}
                            {/*<Grid>*/}
                            {/*<Col>*/}
                            {/*<View style={{flex: 1, justifyContent: 'center'}}>*/}
                            {/*<Text>Size:</Text>*/}
                            {/*</View>*/}
                            {/*</Col>*/}
                            {/*{this.state.product.sizes?*/}
                            {/*<Col size={3}>*/}
                            {/*<Picker*/}
                            {/*mode="dropdown"*/}
                            {/*placeholder="Select a size"*/}
                            {/*note={true}*/}
                            {/*selectedValue={this.state.selectedSize}*/}
                            {/*onValueChange={(size) => this.setState({selectedSize: size})}*/}
                            {/*>*/}
                            {/*{this.renderSize(this.state.product.sizes)}*/}
                            {/*</Picker>*/}
                            {/*</Col>:null}*/}
                            {/*</Grid>*/}
                            <Grid>
                                <Col size={2}>
                                    <View style={{flex: 1, justifyContent: 'center'}}>
                                        <Text>Available Quantity:</Text>
                                    </View>
                                </Col>
                                <Col size={2}><Text style={{fontSize: 16}}>{this.state.product.qty}</Text></Col>
                            </Grid>
                            {this.state.product.colors ?
                                <Grid>
                                    <Col size={2}>
                                        <View style={{flex: 1, justifyContent: 'center'}}>
                                            <Text>Available Colors:</Text>
                                        </View>
                                    </Col>
                                    <Col size={2}><Text style={{fontSize: 16}}>{this.state.product.colors}</Text></Col>
                                </Grid> : null}
                            {this.state.product.sizes ?
                                <Grid>
                                    <Col size={2}>
                                        <View style={{flex: 1, justifyContent: 'center'}}>
                                            <Text>Available Size:</Text>
                                        </View>
                                    </Col>
                                    <Col size={2}><Text style={{fontSize: 16}}>{this.state.product.sizes}</Text></Col>
                                </Grid> : null}
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
                            {/*<Grid>*/}
                            {/*<Col size={2}>*/}
                            {/*<View style={{flex: 1, justifyContent: 'center'}}>*/}
                            {/*<Text>Select Quantity:</Text>*/}
                            {/*</View>*/}
                            {/*</Col>*/}

                            {/*<Col size={2}>*/}
                            {/*<View style={{flex: 1, flexDirection: 'row'}}>*/}
                            {/*<Button block icon transparent*/}
                            {/*onPress={() => this.setState({quantity: this.state.quantity > 1 ? this.state.quantity - 1 : 1})}>*/}
                            {/*<Icon name='ios-remove' style={{color: colors.appLayout}}/>*/}
                            {/*</Button>*/}
                            {/*<View style={{*/}
                            {/*flex: 4,*/}
                            {/*justifyContent: 'center',*/}
                            {/*alignItems: 'center',*/}
                            {/*paddingLeft: 30,*/}
                            {/*paddingRight: 30*/}
                            {/*}}>*/}
                            {/*<Text style={{fontSize: 18}}>{this.state.quantity}</Text>*/}
                            {/*</View>*/}
                            {/*<Button block icon transparent*/}
                            {/*onPress={() => this.setState({quantity: this.state.quantity + 1})}>*/}
                            {/*<Icon style={{color: colors.appLayout}} name='ios-add'/>*/}
                            {/*</Button>*/}
                            {/*</View>*/}
                            {/*</Col>*/}
                            {/*</Grid>*/}
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
                                <NBText note>
                                    {this.state.product.description}
                                </NBText>
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
                    : <Spinner/>}
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
        colorsss = colors.includes(',') ? colorsss.split(',') : [colorsss];
        colorsss.map((color, i) => {
            colors.push(
                <Item key={i} label={color} value={color}/>
            );
        });
        return colors;
    }

    renderSize(sizess) {
        let size = [];
        sizess = sizess.includes(',') ? sizess.split(',') : [sizess];
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

    addToCart() {
        var product = this.state.product;
        product['color'] = this.state.selectedColor;
        product['size'] = this.state.selectedSize;
        product['quantity'] = this.state.quantity;
        AsyncStorage.getItem("CART", (err, res) => {
            if (!res) AsyncStorage.setItem("CART", JSON.stringify([product]));
            else {
                var items = JSON.parse(res);
                items.push(product);
                AsyncStorage.setItem("CART", JSON.stringify(items));
            }
            Toast.show({
                text: 'Product added to your cart !',
                position: 'bottom',
                type: 'success',
                buttonText: 'Dismiss',
                duration: 3000
            });
        });
    }

    addToWishlist() {
        var product = this.state.product;
        var success = true;
        AsyncStorage.getItem("WISHLIST", (err, res) => {
            if (!res) AsyncStorage.setItem("WISHLIST", JSON.stringify([product]));
            else {
                var items = JSON.parse(res);
                if (this.search(items, product)) {
                    success = false
                }
                else {
                    items.push(product);
                    AsyncStorage.setItem("WISHLIST", JSON.stringify(items));
                }
            }
            if (success) {
                Toast.show({
                    text: 'Product added to your wishlist !',
                    position: 'bottom',
                    type: 'success',
                    buttonText: 'Dismiss',
                    duration: 3000
                });
            }
            else {
                Toast.show({
                    text: 'This product already exist in your wishlist !',
                    position: 'bottom',
                    type: 'danger',
                    buttonText: 'Dismiss',
                    duration: 3000
                });
            }
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
