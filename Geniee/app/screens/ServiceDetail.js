import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,    TouchableOpacity, Image,
    Alert,    FlatList, StatusBar,
    Modal, ToastAndroid, Linking, Dimensions
} from 'react-native';
import {
    Button,
    Container,
    Content,
    Textarea,
    Icon,
    Header,
    Left,
    Body, Col,
    Footer,
    FooterTab,
    Row, Grid
} from 'native-base'
import Meteor from "../react-native-meteor";
import settings from "../config/settings";
import userImage from '../images/Image.png';
import {AirbnbRating} from 'react-native-elements';
import {colors,customStyle} from "../config/styles";
import call from "react-native-phone-call";
import Loading from "../components/Loading/Loading";
import StarRating from "../components/StarRating/StarRating";
import {goToChat, goToRoute} from "../Navigation";
const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');
import CogMenu from "../components/CogMenu";
import {Navigation} from 'react-native-navigation';

import Product from "../components/Store/Product";
import MyFunctions from "../lib/MyFunctions";
import ServiceRatings from "./services/ServiceRatings";


//const { RNEsewaSdk } = NativeModules;


class ServiceDetail extends Component {

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
            Service:'',
        }

    }

    componentDidMount() {
        Navigation.events().bindComponent(this);
        // this.handler= DeviceEventEmitter.addListener('onEsewaComplete', this.onEsewaComplete);
        const Id = this.props.Id;
        console.log(Id)
        let Service = {};
        if (typeof (Id) === "string") {
            Meteor.call('getSingleService',Id,(err,res)=>{
                if(!err) {
                    console.log(res)
                    Service = res.result[0];
                    this.setState({Service});
                 //   Service.avgRate = this.averageRating(Service.ratings)
                }
            });
            // Service = Meteor.collection('serviceReact').findOne({_id: Id});

            Meteor.call('updateServiceViewCount', Id);
            Meteor.call('getMyRating', Id, (err, res) => {
                console.log('myRating:', res);
                this.setState({myRating: res});
                if (res && res.hasOwnProperty('rating'))
                    this.setState({comment: res.rating.comment, starCount: res.rating.count})
            })
        }
        else {
            console.log(Id)
           // Service = Id;
            this.setState({Service:Id});
            Meteor.call('updateServiceViewCount', Id._id)
            Meteor.call('getMyRating', Id._id, (err, res) => {
                console.log('myRating:', res);
                this.setState({myRating: res});
                if (res && res.hasOwnProperty('rating'))
                    this.setState({comment: res.rating.comment, starCount: res.rating.count})
            })
        }


    }

    componentWillUnmount() {
        // this.handler.unsubscribe()
    }

    onEsewaComplete = async () => {
        const componentName = await RNEsewaSdk.resolveActivity();
        if (!componentName) {
            // You could also display a dialog with the link to the app store.
            throw new Error(`Cannot resolve activity for intent . Did you install the app?`);
        }

        const response = await RNEsewaSdk.makePayment('1').then(function (response) {
            return response
        }).catch(function (error) {
            console.log('There has been a problem with your fetch operation: ' + error.message);
            // ADD THIS THROW error
            throw error;
        });

        // if (response.resultCode !== RNEsewaSdk.OK) {
        //     throw new Error('Invalid result from child activity.');
        // }
        console.log(response.data);


        return response.data;
    };

    handleChat = (Service) => {
        console.log('service' + Service._id);
        this._getChatChannel(Service._id).then(channelId => {
            console.log(channelId);
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

    _getChatChannel = (userId) => {
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
    _saveRatting = (id) => {
        //  alert(this.state.comment);
        console.log(this.state.comment + this.state.starCount);
        let rating = {
            count: this.state.starCount,
            comment: this.state.comment
        };

        Meteor.call('updateRating', id, rating, (err, res) => {
            if (err) {
                console.log('err:' + err);
                ToastAndroid.showWithGravityAndOffset(
                    err.message,
                    ToastAndroid.LONG,
                    ToastAndroid.TOP,
                    0,
                    50,
                );
            }
            else {
                console.log('resss' + res);
                this.setState({showModal: false});
                ToastAndroid.showWithGravityAndOffset(
                    "Rating Updated Successfully!",
                    ToastAndroid.LONG,
                    ToastAndroid.TOP,
                    0,
                    50,
                );
                Meteor.call('getSingleService',this.state.Service._id,(err,res)=> {
                    if (!err) {
                        console.log(res)
                        let Service = res.result[0];
                        this.setState({Service});
                        //   Service.avgRate = this.averageRating(Service.ratings)
                    }
                });
            }
        })
    }



    clickEventListener() {
        Alert.alert("Success", "Product has beed added to cart")
    }

    averageRating = (arr) => {
        let sum = 0;
        arr.forEach(item => {
            sum = sum + item.count;
        })
        var avg = sum / arr.length;
        return Math.round(avg);
    }

    _browse = (url) => {
        Linking.openURL(url).catch((err) => console.error('An error occurred', err));
    }

    navigateToRoute(route,parm){
        Navigation.push(this.props.componentId, {
            component: {
                name: route,
                passProps: parm
            }
        });
}
    _renderProduct=(data,index)=>{
        let item=data.item;
        return(
            <View style={{width:'50%'}}>
            <TouchableOpacity onPress={()=>this.navigateToRoute("ProductDetail", {'data':item})} style={styles.containerStyle}>
            <Product key={item._id} product={item}   />
            </TouchableOpacity>
            </View>
        )
    };

    _showImage=(image)=>{
        if(image) {
            goToRoute(this.props.componentId, 'ImageGallery', {
                images: [image],
                position: parseInt('0')
            })
        }
    }
    render() {
        const Id = this.props.Id;
       // console.log(Id)
        // let Service = {};
        // if (typeof (Id) === "string") {
        //     Service = Meteor.collection('serviceReact').findOne({_id: Id});
        //     Service.avgRate = this.averageRating(Service.ratings)
        // }
        // else {
        //     console.log(Id)
        //     Service = Id;
        // }


        return (
            <Container style={styles.container}>

                <StatusBar
                    backgroundColor={colors.statusBar}
                    barStyle='light-content'
                />
                <Header style={{backgroundColor: '#094c6b'}}>
                    <Left>
                        {/*<Button transparent onPress={() => {*/}
                            {/*this.props.navigation.openDrawer()*/}
                        {/*}}>*/}
                            {/*<Icon name="md-more" style={{fontWeight: '500', fontSize: 35}}/>*/}
                        {/*</Button>*/}
                        <CogMenu componentId={this.props.componentId}/>
                    </Left>

                    <Body>
                    <Text style={styles.screenHeader}>Service Details</Text>
                    </Body>
                </Header>
                {!this.state.Service ? <Loading/> :
                <Content style={{marginVertical: 0, paddingVertical: 0}}>
                    <TouchableOpacity onPress={()=>this._showImage(this.state.Service.coverImage)}>
                        <Image style={styles.productImg}
                               onPress={()=>this._showImage(Service.coverImage) }
                               source={this.state.Service.coverImage ? {uri: settings.IMAGE_URL+ this.state.Service.coverImage}:userImage}/>
                    </TouchableOpacity>
                    <Text style={styles.name}>{this.state.Service.title}</Text>
                    <TouchableOpacity onPress={()=>goToRoute(this.props.componentId, 'ServiceRatings', {Id:this.state.Service._id})} style={ styles.starView }><StarRating starRate={this.state.Service.Rating.avgRate}/></TouchableOpacity>
                    
                    {(this.state.Service.location.hasOwnProperty('formatted_address')) ?
                        <Text style={styles.availableText}>{this.state.Service.location.formatted_address}
                        </Text> :
                        <Text style={styles.unavailableText}>
                            {'Address Unavailable!'}
                        </Text>
                    }


                    {/*<View style={styles.starDisplay}>
                        <Rating
                            imageSize={20}
                            readonly
                            startingValue={this.state.Service.avgRate}
                            style={{color: '#094c6b'}}
                        />
                    </View>
                    <View style={styles.serviceInfo}>*/}


                    {(this.state.Service.hasOwnProperty('radius') && this.state.Service.radius > 0) ?
                        <Text style={styles.serviceText}>Servie Area : Within {this.state.Service.radius} KM Radius from Address</Text> : null
                    }

                    <Text style={styles.infoText}>
                        Contact: {this.state.Service.contact1} {this.state.Service.contact}
                    </Text>
                    {/*<Text style={ styles.infoText }>
                        {this.state.Service.contact}
                    </Text>*/}

                    {this.state.Service.hasOwnProperty('email') ?
                        <Text style={styles.infoText}>{this.state.Service.email}</Text> : null
                    }

                    {this.state.Service.hasOwnProperty('website') ?
                        <TouchableOpacity onPress={() => {
                            this._browse(this.state.Service.website)
                        }}>
                            <Text style={styles.websiteLink}>
                                {this.state.Service.website}
                            </Text>
                        </TouchableOpacity> : null
                    }
                    {/*</View>*/}

                    <View style={styles.separator}></View>

                    <View style={{alignItems: 'center', marginHorizontal: 30}}>
                        <Text style={styles.description}>
                            {this.state.Service.description}
                        </Text>
                    </View>

                    <View style={styles.separator}></View>
                    {this.props.Products.length>0?
                    <View style={{alignItems: 'center', marginHorizontal: 30}}>
                        <Text style={[styles.screenHeader,{color:colors.appLayout}]}>
                            Products
                        </Text>

                    </View>:null}
                    <FlatList style={styles.mainContainer}
                              data={this.props.Products}
                              keyExtracter={(item, index) => item._id}
                              horizontal={false}
                              numColumns={2}
                              renderItem={(item,index)=>this._renderProduct(item,index)}
                    />
                </Content>}
                {  this.state.Service?
                <Footer>
                    <FooterTab style={{backgroundColor: '#094c6b'}}>
                        {(this.state.Service.contact ||this.state.Service.contact1)?
                        <Button onPress={() => {
                            MyFunctions._callPhone(this.state.Service.contact ? this.state.Service.contact : this.state.Service.contact1)
                        }}>
                            <Icon name="md-call"/>
                            <Text style={{color: '#ffffff'}}>Call</Text>
                        </Button>
                            :null}
                        {this.props.user &&
                        this.state.Service.createdBy != null && this.props.user._id != this.state.Service.createdBy ?
                            <Button onPress={() => {
                                this.handleChat(this.state.Service)
                            }}>
                                <Icon name="md-chatboxes"/>
                                <Text style={{color: '#ffffff'}}>Chat</Text>
                            </Button> : null}
                        {this.props.user && this.props.user._id != this.state.Service.createdBy ?
                            <Button onPress={() => {
                                this.setState({showModal: true})
                            }}>
                                <Icon name="md-star"/>
                                <Text style={{color: '#ffffff'}}>Rate</Text>
                            </Button>
                            : null}
                    </FooterTab>
                </Footer>:null}

                <View style={{marginTop: 0}}>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.showModal}
                        onRequestClose={() => {
                            this.setState({showModal: false})
                        }}>
                        <View style={{
                            flex: 1,
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'rgba(0,0,0,.5)'
                        }}>

                            <View style={{
                                backgroundColor: 'white',
                                width: 350,
                                height: 420,
                                padding: 30,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.8,
                                shadowRadius: 4,
                                elevation: 1,
                                borderRadius: 4

                            }}>
                                <Text style={{fontSize: 18, marginBottom: 5, textAlign: 'center'}}>
                                    How was your experience
                                    with "{this.state.Service.title}"?
                                </Text>
                                <View style={styles.starContainer}>
                                    <AirbnbRating
                                        reviews={['Terrible', 'Bad', 'Okay', 'Good', 'Great']}
                                        count={5}
                                        defaultRating={1}
                                        size={25}
                                        showRating={true}
                                        onFinishRating={this.ratingCompleted}
                                    />
                                </View>
                                <View style={styles.formGroup}>
                                <Textarea bordered rowSpan={4} placeholder="Comment"
                                    //  style={styles.inputText}
                                          placeholderTextColor={`rgba(0, 0, 0, 0.44)`}
                                          underlineColorAndroid='rgba(0,0,0,0)'
                                    //onSubmitEditing={() => this.contactNumber.focus()}
                                          onChangeText={(comment) => this.setState({comment})}
                                />
                                </View>
                                <Grid>
                                    <Row>
                                        <Col style={{marginRight: 5}}>
                                    <Button block style={customStyle.buttonPrimary} onPress={() => {
                                        this._saveRatting(this.state.Service._id)
                                    }}><Text style={customStyle.buttonPrimaryText}> Save </Text></Button>
                                        </Col>
                                        <Col style={{marginRight: 5}}>
                                    <Button block  style={customStyle.buttonLight} onPress={() => {
                                        this.setState({showModal: false})
                                    }}>
                                        <Text style={customStyle.buttonLightText}>Cancel</Text>
                                    </Button>
                                        </Col>
                                    </Row>
                                </Grid>
                            </View>
                        </View>
                    </Modal>
                </View>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {

        flex: 1,
        marginVertical: 0,
        backgroundColor: '#05a5d10d',
    },
    screenHeader: {
        fontSize: 18,
        fontFamily: `Source Sans Pro`,
        color: '#ffffff',

    },
    productImg: {
        width: '100%',
        height: 150,
    },
    serviceInfo: {
        width: '100%',
        //backgroundColor: colors.inputBackground,
        paddingHorizontal: 10,
        padding: 5,
    },
    name: {
        fontSize: 22,
        //color: "#696969",
        fontWeight: 'bold',        
        color: '#000',
        width: '100%',
        backgroundColor: colors.inputBackground,
        //backgroundColor: '#094c6b0a',
        paddingHorizontal: 10,
        padding: 5,
        textAlign: 'center',        
    },
    starView: {
        backgroundColor: colors.inputBackground,
        textAlign: 'center',
        paddingHorizontal: 10,
        padding: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        //borderRadius: 5,
        borderBottomColor: '#094c6b',
        borderBottomWidth: 2
    },
    availableText: {
        marginTop: 5,
        fontSize: 16,
        fontWeight: 'bold',
        //justifyContent: 'center',
        //alignItems: 'center',
        paddingHorizontal: 10,
    },
    infoText: {
        marginTop: 5,
        fontSize: 16,
        fontWeight: 'bold',
        paddingHorizontal: 10,
    },
    websiteLink: {
        marginTop: 5,
        fontSize: 16,
        fontWeight: 'bold',
        paddingHorizontal: 10,
        color: colors.statusBar
    },
    serviceText: {
        marginTop: 5,
        fontSize: 16,
        color: "#696969",
        fontWeight: 'bold',
        paddingHorizontal: 10,
        //stextAlign: 'center'
    },
    unavailableText: {
        marginTop: 5,
        fontSize: 16,
        color: "red",
        fontWeight: 'bold',
        //textAlign: 'center'
    },
    description: {
        //textAlign: 'center',
        marginTop: 10,
        color: "#696969",
    },
    star: {
        width: 40,
        height: 40,
        color: '#094c6b'
    },
    btnColor: {
        height: 30,
        width: 30,
        borderRadius: 30,
        marginHorizontal: 3
    },
    btnSize: {
        height: 40,
        width: 40,
        borderRadius: 40,
        borderColor: '#778899',
        borderWidth: 1,
        marginHorizontal: 3,
        backgroundColor: 'white',

        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    starDisplay: {
        //justifyContent: 'center',
        marginHorizontal: 10,
        flexDirection: 'row',
        marginTop: 5
    },
    starContainer: {
        marginBottom: 15
    },
    formGroup: {
        marginBottom: 15
    },
    contentColors: {
        justifyContent: 'center',
        marginHorizontal: 30,
        flexDirection: 'row',
        marginTop: 20
    },
    contentSize: {
        justifyContent: 'center',
        marginHorizontal: 30,
        flexDirection: 'row',
        marginTop: 20
    },
    separator: {
        height: 2,
        backgroundColor: "#094c6b",
        marginTop: 10,
        marginHorizontal: 10
    },

    addToCarContainer: {
        marginHorizontal: 30,
        marginTop: 10
    },
    containerForm: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    inputBox: {
        width: 300,
        backgroundColor: colors.inputBackground,
        borderRadius: 25,
        paddingHorizontal: 16,
        fontSize: 16,
        color: colors.whiteText,
        marginVertical: 5
    },

    button: {
        width: 300,
        backgroundColor: colors.buttonPrimaryBackground,
        borderRadius: 25,
        marginVertical: 10,
        paddingVertical: 13
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.whiteText,
        textAlign: 'center'
    },
    forgotPwdButton: {
        color: colors.redText,
        fontSize: 14,
        fontWeight: '500'
    },

    signupCont: {
        flexGrow: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingVertical: 16,
        flexDirection: 'row'
    },
    signupText: {
        color: colors.primaryText,
        fontSize: 16,
        fontWeight: '700',
        paddingVertical: 2
    },
    navButton: {
        width: 80,
        backgroundColor: colors.buttonPrimaryBackground,
        borderRadius: 25,
        paddingVertical: 2,
        marginLeft: 5
    },
    navButtonText: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.whiteText,
        textAlign: 'center'
    },
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
        width: (viewportWidth / 2) - 10,
        justifyContent: 'center',
        alignItems: 'center'
    },

});

export default Meteor.withTracker((props) => {
    let param = props.Id;
    let Id = typeof (param) === "string" ? param : param._id;
    Meteor.subscribe('products',Id);
  //  Meteor.subscribe('get-channel');
    return {
        detailsReady: true,
        getChannel: (id) => {
            // return Meteor.collection('chatChannels').findOne({users: { "$in" : [id]}});
            return Meteor.collection('chatChannels').findOne({$and: [{'otherUser.serviceId': id}, {createdBy: Meteor.userId()}]});
        },
        user: Meteor.user(),
        Products: Meteor.collection('product').find({service: Id})
    };
})(ServiceDetail);