import React, { Component } from 'react';
import {StyleSheet, Dimensions, Text, View, ScrollView, Image, Modal, LayoutAnimation, Platform} from 'react-native';
import Meteor, {Accounts, createContainer} from 'react-native-meteor';
import PropTypes from 'prop-types';
import Loading from '../components/Loading';
import { colors } from '../config/styles';
import userImage from '../images/RoshanShah.jpg';
import Button from "../components/Button";
import { Rating, AirbnbRating } from 'react-native-ratings';
import call from 'react-native-phone-call'
import InputWrapper from "../components/GenericTextInput/InputWrapper";
import GenericTextInput from "../components/GenericTextInput";
import {Header} from 'react-native-elements';
import Icon  from 'react-native-vector-icons/FontAwesome';

const window = Dimensions.get('window');
const MARGIN_HORIZONTAL = 10;
const cardSize = window.width - (MARGIN_HORIZONTAL * 2);

const styles = StyleSheet.create({

  container: {
      flex:1,
      // justifyContent: 'center',
      // alignItems: 'center',
      backgroundColor: colors.background,
      // padding: 10,
  },
    main: {
        fontSize: 20,
        textAlign: 'center',
        color: colors.headerText,
        fontWeight: '400',
        fontStyle: 'italic',
    },
  list: {},
  ite: {
      flex:1,
    backgroundColor: colors.buttonBackground,
    width: cardSize,
    height: cardSize / 2,
      marginHorizontal: MARGIN_HORIZONTAL,
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    // color: colors.buttonText,
  },
    itemDesc: {
        fontSize: 15,
        fontWeight: '400',
    },
    itemContent: {
        fontSize: 14,
        fontWeight: '300',
    },
    userImg: {
        width: 150,
        height: 150,
    },
    buttons: {
        justifyContent: 'center',
        flexDirection: 'row',
        height:50,
    },
    error: {
        height: 28,
        justifyContent: 'center',
        width: window.width,
        alignItems: 'center',
    },
    errorText: {
        color: colors.errorText,
        fontSize: 14,
    },
});

class Details extends Component  {
    constructor(props) {
        super(props);

        this.mounted = false;
        this.state={
            showModal:false,
            title:'',
            description:'',
            error:null,
        }
    }
   ratingCompleted(rating) {
        console.log("Rating is: " + rating)
    }
    componentWillMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }
    handleError(error) {
        if (this.mounted) {
            this.setState({ error });
        }
    }

    handleCreate () {
        const {title,description } = this.state;
        this.setState({
            showModal:false,
        })
    }

    handleCancel ()  {
        const {title,description } = this.state;
        this.setState({
            showModal:false
    })
    }
    callPhone(){
        const args = {
            number: '9813798508', // String value with the number to call
             prompt: false // Optional boolean property. Determines if the user should be prompt prior to the call
             }
             if(this.mounted) {
                 call(args).catch(console.error)
             }
    }

    static navigationOptions={
        drawerIcon:(
            <Image source={require('../images/settings.png')}
                   style={{height:25,width:25}}/>
        )
    }
    render() {
    if (!this.props.detailsReady) {
        return <Loading/>;
    }
    else {
        return (
            <View style={styles.container}>
                <Header style={{height:25}}
                        statusBarProps={{ barStyle: 'light-content' }}
                        leftComponent={<Icon color="white" name="bars" size={30} onPress={()=> this.props.navigation.navigate('DrawerOpen')} />}
                        // rightComponent={ <Icon  size={30} name='sign-out' style={{}}  onPress={this.handleSignout} ></Icon>}
                        outerContainerStyles={{height: Platform.OS === 'ios' ? 70 :  70 - 24, padding:10}}
                />
                <View style={{justifyContent:'center',alignItems:'center'}}>
                <Text style={styles.main}>
                    Roshan Shah

                </Text>
                <Text>Sr. Software Engineer </Text>
                <Image style={styles.userImg} source={userImage}/>
                </View>
                <AirbnbRating
                    count={5}
                    reviews={["Terrible", "Bad", "OK", "Good", "Very Good"]}
                    defaultRating={0}
                    size={20}
                    onFinishRating={this.ratingCompleted}
                />
                <Text style={styles.itemText}>{this.props.detail.title}</Text>
                <Text style={styles.itemDesc}>{this.props.detail.description}</Text>
                <ScrollView>
                    <View style={styles.item} key={this.props.detail._id}>
                        <Text style={styles.itemDesc}>{this.props.detail.content}</Text>
                    </View>

                </ScrollView>
                <View style={styles.buttons}>
                    <Button text="Call" onPress={() => this.callPhone()}/>
                    <Button text="Message"/>
                    <Button text="Create Ticket"  onPress={()=>{
                        this.setState({
                            showModal: true
                        })}
                    }/>
                </View>

                <Modal style={styles.ite} visible={this.state.showModal} onRequestClose={()=>{}}>
                    <Text style={styles.main}>
                       Create New Ticket
                    </Text>
                    <InputWrapper>
                        <GenericTextInput
                            placeholder="Title"
                            onChangeText={(title) => this.setState({title})}
                        />
                        <GenericTextInput
                            placeholder="Deccription"
                            onChangeText={(description) => this.setState({description})}
                            secureTextEntry
                            borderTop
                        />
                    </InputWrapper>

                    <View style={styles.error}>
                        <Text style={styles.errorText}>{this.state.error}</Text>
                    </View>

                    <View style={styles.buttons}>
                        <Button text="Create Ticket" onPress={this.handleCreate}/>
                        <Button text="Cancel" onPress={()=>{
                            this.setState({
                                showModal: false
                        })}
                        }/>
                    </View>

                </Modal>
            </View>
        );
    }
}
};

Details.propTypes = {
  detailsReady: PropTypes.bool,
  details: PropTypes.array,
    detail : PropTypes.object,
};

export default createContainer(() => {
  const handle = Meteor.subscribe('details-list');

  return {
    detailsReady: true,
    details: Meteor.collection('details').find() || [],
      detail:{
          _id: "RXz4yMhNzzwrd22Li",
          title :" Screenshots and screencasts",
          description : "You can take a picture of your screen (a screenshot) or record a video of what is happening on the screen (a screencast). This is useful if you want to show someone how to do something on the computer, for example. Screenshots and screencasts are just normal picture and video files, so you can email them and share them on the web.",
          content : "This component renders a Grid View that adapts itself to various screen resolutions.\n Instead of passing an itemPerRow argument, you pass itemDimension and each item will be rendered with a dimension size equal to or more than (to fill the screen) the given dimension.Internally, \n these components use the native FlatList or SectionList."
      },
  };
}, Details);
