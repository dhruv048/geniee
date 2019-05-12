import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Alert,
    ScrollView,
    FlatList,
} from 'react-native';
import {Button} from 'native-base'
import Meteor, {createContainer} from "react-native-meteor";
import settings from "../config/settings";
import userImage from '../images/Image.png';
import {   Rating, AirbnbRating} from 'react-native-elements';
import {colors} from "../config/styles";
import call from "react-native-phone-call";

class ServiceDetail extends Component {

    constructor(props) {
        super(props);
        this.state={
            starCount:2
        }
    }

    clickEventListener() {
        Alert.alert("Success", "Product has beed added to cart")
    }
    ratingCompleted=(rating)=> {
        this.setState({
            starCount: rating
        });
    }

    _callPhone=(number)=>{
        const args = {
            number: number, // String value with the number to call
            prompt: false // Optional boolean property. Determines if the user should be prompt prior to the call
        }
            call(args).catch(console.error)
    }

    render() {
        const Service=this.props.navigation.getParam('Service');
        return (
            <View style={styles.container}>
                <ScrollView >
                    <View style={{alignItems:'center', marginHorizontal:30}}>
                        {Service.coverImage===null?
                            <Image style={styles.productImg} source={userImage} /> :
                            <Image style={styles.productImg} source={{uri: settings.API_URL+'images/'+Service.coverImage}}/> }
                        <Text style={styles.name}>{Service.title}</Text>
                        {Service.location.hasOwnProperty('formatted_address') ?
                        <Text style={styles.availableText}>{Service.location.formatted_address}</Text> :
                        <Text style={styles.unavailableText}>{'Address Unavailable!'}</Text>}
                        {Service.location.hasOwnProperty('formatted_address') ?
                        <Text style={styles.serviceText}>  Servie Area : Within {Service.radius} KM Radius from Location.</Text> :''}
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
                            showRating
                            onFinishRating={this.ratingCompleted}
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
                        <Button block info rounded onPress={()=>{this._callPhone(Service.contact)}}><Text> Call </Text></Button>
                    </View>

                    <View style={styles.addToCarContainer}>
                        <Button block success rounded onPress={()=>{}} style={{ marginBottom:10}}><Text> Message </Text></Button>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:colors.backgroundColor,
        flex:1,
        marginTop:20,
    },
    productImg:{
        width:300,
        height:150,
    },
    name:{
        fontSize:28,
        color:"#696969",
        fontWeight:'bold'
    },
    availableText:{
        marginTop:10,
        fontSize:15,
        color:"green",
        fontWeight:'bold',
        textAlign:'center'
    },
    serviceText:{
        marginTop:10,
        fontSize:13,
        color:"#696969",
        fontWeight:'bold',
        textAlign:'center'
    },
    unavailableText:{
        marginTop:10,
        fontSize:15,
        color:"red",
        fontWeight:'bold',
        textAlign:'center'
    },
    description:{
        textAlign:'center',
        marginTop:10,
        color:"#696969",
    },
    star:{
        width:40,
        height:40,
    },
    btnColor: {
        height:30,
        width:30,
        borderRadius:30,
        marginHorizontal:3
    },
    btnSize: {
        height:40,
        width:40,
        borderRadius:40,
        borderColor:'#778899',
        borderWidth:1,
        marginHorizontal:3,
        backgroundColor:'white',

        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    starContainer:{
        justifyContent:'center',
        marginHorizontal:30,
        flexDirection:'row',
        marginTop:20
    },
    contentColors:{
        justifyContent:'center',
        marginHorizontal:30,
        flexDirection:'row',
        marginTop:20
    },
    contentSize:{
        justifyContent:'center',
        marginHorizontal:30,
        flexDirection:'row',
        marginTop:20
    },
    separator:{
        height:2,
        backgroundColor:"#eeeeee",
        marginTop:20,
        marginHorizontal:30
    },

    addToCarContainer:{
        marginHorizontal:30,
        marginTop:10
    }
});

export default createContainer(() => {
    const handle = Meteor.subscribe('details-list');

    return {
        detailsReady: true,
        details: Meteor.collection('details').find() || []
    };
}, ServiceDetail);