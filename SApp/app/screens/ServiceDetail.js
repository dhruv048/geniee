import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Alert,
    ScrollView,
    StatusBar,
    Modal, ToastAndroid,Linking
} from 'react-native';
import {Button, Container, Content, Textarea, Icon, Header, Left, Body, Right, Footer, FooterTab} from 'native-base'
import Meteor, {createContainer} from "react-native-meteor";
import settings ,{userType} from "../config/settings";
import userImage from '../images/Image.png';
import {Rating, AirbnbRating} from 'react-native-elements';
import {colors} from "../config/styles";
import call from "react-native-phone-call";
import Loading from "../components/Loading/Loading";
import StarRating from "../components/StarRating/StarRating";
// import RNEsewaSdk from "react-native-esewa-sdk";

import { DeviceEventEmitter } from 'react-native';

import { NativeModules } from 'react-native';
//const { RNEsewaSdk } = NativeModules;


class ServiceDetail extends Component {

    ratingCompleted = (rating) => {
        this.setState({
            starCount: rating,
        });
    }
    _callPhone = (number) => {
      // let res=  this.onEsewaComplete();
      // alert(res);
      // console.log(res)
     if(!number){
         Alert.alert('Contact No. Unavailable for the Service')
     }

        const args = {
            number: number, // String value with the number to call
            prompt: false // Optional boolean property. Determines if the user should be prompt prior to the call
        }
        call(args).catch(console.error)
    }



    constructor(props) {
        super(props);
        this.state = {
            starCount: 2,
            isLoading:false,
            showModal:false,
            comment:'',
        }

    }

    componentDidMount(){
        // this.handler= DeviceEventEmitter.addListener('onEsewaComplete', this.onEsewaComplete);
    }

    componentWillUnmount(){
       // this.handler.unsubscribe()
    }
    onEsewaComplete =async() => {
        const componentName = await RNEsewaSdk.resolveActivity();
        if (!componentName) {
            // You could also display a dialog with the link to the app store.
            throw new Error(`Cannot resolve activity for intent . Did you install the app?`);
        }

        const response = await RNEsewaSdk.makePayment('1').then(function(response){
            return response
        }).catch(function(error) {
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
        console.log('service'+Service._id);
        this._getChatChannel(Service._id).then(channelId => {
            console.log(channelId);
            let Channel = {
                channelId: channelId,
                user: {
                    userId: Service.createdBy,
                    name: "",
                    profileImage:null,
                },
                service:Service
            }
            this.props.navigation.navigate('Message', {Channel: Channel});
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
    _saveRatting=(id)=>{
      //  alert(this.state.comment);
        console.log(this.state.comment +this.state.starCount);
        let rating={
            count:this.state.starCount,
            comment:this.state.comment
        }

        Meteor.call('updateRating',id,rating,(err,res)=>{
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
                this.setState({showModal:false});
                ToastAndroid.showWithGravityAndOffset(
                    "Rating Updated Successfully!",
                    ToastAndroid.LONG,
                    ToastAndroid.TOP,
                    0,
                    50,
                );
            }
        })
    }

    clickEventListener(){
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

    _browse=(url)=>{
        Linking.openURL(url).catch((err) => console.error('An error occurred', err));
    }

    render() {
        const Id=this.props.navigation.getParam('Id');
        console.log(Id)
        let Service={};
        if(typeof (Id)==="string" ){
            Service=Meteor.collection('serviceReact').findOne({_id:Id});
            Service.avgRate = this.averageRating(Service.ratings)
        }
        else{
            console.log(Id)
            Service=Id;
        }

        const {navigate} = this.props.navigation;
        return (
            <Container style={styles.container}>
                <StatusBar
                    backgroundColor={colors.statusBar}
                    barStyle='light-content'
                />
                <Header style={{backgroundColor: '#094c6b'}}>
                    <Left>
                        <Button transparent onPress={() => {
                            this.props.navigation.openDrawer()
                        }}>
                            <Icon name="md-more" style={{fontWeight:'500', fontSize: 35}}/>
                        </Button>                        
                    </Left>

                    <Body>
                        <Text style={styles.screenHeader}>Service Details</Text>
                    </Body>
                </Header>

                <Content style={{marginVertical: 0, paddingVertical: 0, flexGrow: 1}}>
                    {this.state.isLoading === true ? <Loading/> : null}
                    
                    {Service.coverImage === null ?
                        <Image style={styles.productImg} source={userImage}/> :
                        <Image style={styles.productImg}
                            source={{uri: settings.API_URL + 'images/' + Service.coverImage}}/>
                    }
                        
                    <Text style={styles.name}>{Service.title}</Text>
                            
                    <View style={ styles.starView }><StarRating starRate={rowData.hasOwnProperty('ratings') ? this.averageRating(Service.ratings) : 0}/></View>
                    
                    {(Service.location.hasOwnProperty('formatted_address')) ?
                        <Text style={styles.availableText}>                                              {Service.location.formatted_address}
                        </Text> :
                        <Text style={styles.unavailableText}>
                            {'Address Unavailable!'}
                        </Text>
                    }
                    
                            
                    {/*<View style={styles.starDisplay}>
                        <Rating
                            imageSize={20}
                            readonly
                            startingValue={Service.avgRate}
                            style={{color: '#094c6b'}}
                        />
                    </View>
                    <View style={styles.serviceInfo}>*/}
                    
                                
                    {(Service.hasOwnProperty('radius') && Service.radius>0) ?
                        <Text style={styles.serviceText}> Servie Area : Within {Service.radius} KM Radius from Address.</Text> : null
                    }
                    
                    <Text style={ styles.infoText }>
                        Contact: {Service.contact1} {Service.contact}
                    </Text>
                    {/*<Text style={ styles.infoText }>
                        {Service.contact}
                    </Text>*/}
                                
                    {Service.hasOwnProperty('email') ?
                        <Text style={ styles.infoText }>{ Service.email }</Text> : null
                    }

                    {Service.hasOwnProperty('website') ?    
                        <TouchableOpacity onPress={()=>{this._browse(Service.website)}}>
                            <Text style={ styles.websiteLink } >
                                {Service.website}
                            </Text>
                        </TouchableOpacity> : null
                    }
                    {/*</View>*/}
                        
                    <View style={styles.separator}></View>
                        
                    <View style={{alignItems: 'center', marginHorizontal: 30}}>
                        <Text style={styles.description}>
                            {Service.description}
                        </Text>
                    </View>
                </Content>

                <Footer>
                    <FooterTab style={{backgroundColor: '#094c6b'}}>
                        <Button onPress={() => {
                                this._callPhone(Service.contact? Service.contact : Service.contact1)
                            }}>
                            <Icon name="md-call"/>
                            <Text style={{color: '#ffffff'}}>Call</Text>
                        </Button>
                        {this.props.user &&
                        Service.createdBy!= null && this.props.user._id != Service.createdBy ?
                        <Button onPress={() => {this.handleChat(Service)}}>
                            <Icon name="md-chatboxes"/>
                            <Text style={{color: '#ffffff'}}>Chat</Text>
                        </Button>: null}
                        {this.props.user && this.props.user._id != Service.createdBy ?
                        <Button onPress={() => {
                            this.setState({showModal:true})
                        }}>
                            <Icon name="md-star"/>
                            <Text style={{color: '#ffffff'}}>Rate</Text>
                        </Button>
                        : null}
                    </FooterTab>
                </Footer>

                <View style={{marginTop: 0}}>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.showModal}
                        onRequestClose={() => {
                            this.setState({showModal:false})
                        }}>
                        <View style={{
                            flex: 1,
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>

                            <View style={{
                                backgroundColor:'white',
                                width: 350,
                                height: 400,
                                padding:30,
                                borderWidth: 2,
                                borderColor: colors.buttonPrimaryBackground,

                            }}>
                                <Text style={styles.signupText}>
                                   Rate Service
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
                                <Textarea bordered rowSpan={4} placeholder="Comment"
                                        //  style={styles.inputText}
                                          placeholderTextColor={`rgba(0, 0, 0, 0.44)`}
                                          underlineColorAndroid='rgba(0,0,0,0)'
                                    //onSubmitEditing={() => this.contactNumber.focus()}
                                          onChangeText={(comment) => this.setState({comment})}
                                />
                                <View style={styles.addToCarContainer}>
                                    <Button block success  onPress={() => {
                                        this._saveRatting(Service._id)
                                    }}><Text> Save </Text></Button>
                                </View>
                                <View style={styles.addToCarContainer}>
                                <Button block  danger onPress={()=>{this.setState({showModal:false})}}>
                                    <Text>Cancel</Text>
                                </Button>
                                </View>
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
        backgroundColor:'#05a5d10d',
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
    infoText : {
        marginTop: 5,
        fontSize: 16,
        fontWeight: 'bold',
        paddingHorizontal: 10,
    },
    websiteLink : {
        marginTop: 5,
        fontSize: 16,
        fontWeight: 'bold',
        paddingHorizontal: 10,
        color:colors.statusBar
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
        justifyContent: 'center',
        marginHorizontal: 30,
        flexDirection: 'row',
        marginTop: 20
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

});

export default createContainer(() => {
    Meteor.subscribe('get-channel');
    return {
        detailsReady: true,
        getChannel:(id)=>{
            // return Meteor.collection('chatChannels').findOne({users: { "$in" : [id]}});
            return Meteor.collection('chatChannels').findOne({$and:[{'otherUser.serviceId':id},{createdBy:Meteor.userId()}]});
        },
        user: Meteor.user()
    };
}, ServiceDetail);