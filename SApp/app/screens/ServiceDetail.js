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
    Modal
} from 'react-native';
import {Button, Container, Content, Textarea, Left, Icon,Body} from 'native-base'
import Meteor, {createContainer} from "react-native-meteor";
import settings ,{userType} from "../config/settings";
import userImage from '../images/Image.png';
import {Rating, AirbnbRating} from 'react-native-elements';
import {colors} from "../config/styles";
import call from "react-native-phone-call";
import Loading from "../components/Loading/Loading";

class ServiceDetail extends Component {

    ratingCompleted = (rating) => {
        this.setState({
            starCount: rating,
        });
    }
    _callPhone = (number) => {
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

    handleChat = (id) => {
        var channel = this.props.getChannel(id);
        console.log('channel' + channel);

            if (channel === null || channel === undefined) {
                Meteor.call('createChatChannel', {To: id}, (err, result) => {
                    if (err) {
                        console.log('err:' + err);
                    }
                    else {
                        this.setState({isLoading: true});
                        console.log('resss' + result);
                        Meteor.subscribe('get-channel', (ready) => {
                            console.log('ready' + ready);
                            let channel = Meteor.collection('chatChannels').findOne({_id: result});
                            console.log('new Channel' + channel);
                            // this.props.navigation.navigate('Chat', {'channel': this.props.getChannel(id)})
                            this.setState({isLoading: false});
                            this.props.navigation.navigate('Chat', {'channel': channel})

                        })
                    }
                })
            }
            else {

                this.props.navigation.navigate('Chat', {'channel': channel})
            }
    }


    _saveRatting=(id)=>{
        this.setState({showModal:false});
        alert(this.state.comment);
        console.log(this.state.comment +this.state.starCount);
    }

    clickEventListener(){
        Alert.alert("Success", "Product has beed added to cart")
    }

    render() {
        const Service = this.props.navigation.getParam('Service');
        const {navigate} = this.props.navigation;
        return (
            <Container style={styles.container}>
                <StatusBar
                    backgroundColor={colors.statusBar}
                    barStyle='light-content'
                />
                {/*<Header  style={{backgroundColor:'#094c6b', height:40}}>*/}
                {/*<Left>*/}
                {/*<Button transparent onPress={()=>{this.props.navigation.goBack()}}>*/}
                {/*<Icon name='arrow-back' />*/}
                {/*</Button>*/}
                {/*</Left>*/}
                    {/*<Body></Body>*/}
                {/*</Header>*/}
                <Content style={{marginTop:10}}>
                    {this.state.isLoading === true ? <Loading/> : <Text/>}
                    <ScrollView>
                        <View style={{alignItems: 'center', marginHorizontal: 30}}>
                            {Service.coverImage === null ?
                                <Image style={styles.productImg} source={userImage}/> :
                                <Image style={styles.productImg}
                                       source={{uri: settings.API_URL + 'images/' + Service.coverImage}}/>}
                            <Text style={styles.name}>{Service.title}</Text>
                            {Service.location.hasOwnProperty('formatted_address') ?
                                <Text style={styles.availableText}>{Service.location.formatted_address}</Text> :
                                <Text style={styles.unavailableText}>{'Address Unavailable!'}</Text>}
                            {Service.location.hasOwnProperty('formatted_address') ?
                                <Text style={styles.serviceText}> Servie Area : Within {Service.radius} KM Radius from
                                    Address.</Text> : <Text/>}
                            <Text style={styles.description}>
                                {Service.description}
                            </Text>
                        </View>
                        <View style={styles.starContainer}>
                            <AirbnbRating
                                reviews={['Terrible', 'Bad', 'Okay', 'Good', 'Great']}
                                count={5}
                                defaultRating={this.state.starCount}
                                size={20}
                                showRating={false}
                                readOnly={true}

                            />
                        </View>
                        {/*<View style={styles.contentColors}>*/}
                        {/*<TouchableOpacity style={[styles.btnColor, {backgroundColor:"#00BFFF"}]}></TouchableOpacity>*/}
                        {/*<TouchableOpacity style={[styles.btnColor, {backgroundColor:"#FF1493"}]}></TouchableOpacity>*/}
                        {/*<TouchableOpacity style={[styles.btnColor, {backgroundColor:"#00CED1"}]}></TouchableOpacity>*/}
                        {/*<TouchableOpacity style={[styles.btnColor, {backgroundColor:"#228B22"}]}></TouchableOpacity>*/}
                        {/*<TouchableOpacity style={[styles.btnColor, {backgroundColor:"#20B2AA"}]}></TouchableOpacity>*/}
                        {/*<TouchableOpacity style={[styles.btnColor, {backgroundColor:"#FF4500"}]}></TouchableOpacity>*/}
                        {/*</View>*/}
                        {/*<View style={styles.contentSize}>*/}
                        {/*<TouchableOpacity style={styles.btnSize}><Text>S</Text></TouchableOpacity>*/}
                        {/*<TouchableOpacity style={styles.btnSize}><Text>M</Text></TouchableOpacity>*/}
                        {/*<TouchableOpacity style={styles.btnSize}><Text>L</Text></TouchableOpacity>*/}
                        {/*<TouchableOpacity style={styles.btnSize}><Text>XL</Text></TouchableOpacity>*/}
                        {/*</View>*/}
                        <View style={styles.separator}></View>
                        <View style={styles.addToCarContainer}>
                            <Button block info rounded onPress={() => {
                                this._callPhone(Service.contact)
                            }}><Text> Call </Text></Button>
                        </View>

                        <View style={styles.addToCarContainer}>
                            {this.props.user ?
                            <Button block success rounded onPress={() => {this.handleChat(Service.createdBy)}} ><Text> Message </Text></Button> : <Text/>}
                        </View>
                        <View style={styles.addToCarContainer}>
                            {this.props.user ?
                            <Button style={{marginBottom: 5}} block warning rounded onPress={() => {
                                this.setState({showModal:true})
                            }}><Text> Rate </Text></Button>
                                : <Text/>}
                        </View>
                    </ScrollView>
                </Content>
                <View style={{marginTop: 22}}>
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
      //  marginTop: 20,
        backgroundColor:'#05a5d10d',
    },
    productImg: {
        width: 300,
        height: 150,
    },
    name: {
        fontSize: 28,
        color: "#696969",
        fontWeight: 'bold'
    },
    availableText: {
        marginTop: 10,
        fontSize: 15,
        color: "green",
        fontWeight: 'bold',
        textAlign: 'center'
    },
    serviceText: {
        marginTop: 10,
        fontSize: 13,
        color: "#696969",
        fontWeight: 'bold',
        textAlign: 'center'
    },
    unavailableText: {
        marginTop: 10,
        fontSize: 15,
        color: "red",
        fontWeight: 'bold',
        textAlign: 'center'
    },
    description: {
        textAlign: 'center',
        marginTop: 10,
        color: "#696969",
    },
    star: {
        width: 40,
        height: 40,
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
        backgroundColor: "#eeeeee",
        marginTop: 20,
        marginHorizontal: 30
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
    const handle = Meteor.subscribe('details-list');
    Meteor.subscribe('get-channel');
    return {
        detailsReady: true,
        details: Meteor.collection('details').find() || [],
        getChannel:(id)=>{
            // return Meteor.collection('chatChannels').findOne({users: { "$in" : [id]}});
            return Meteor.collection('chatChannels').findOne({'otherUser._id':id});
        },
        user: Meteor.user()
    };
}, ServiceDetail);