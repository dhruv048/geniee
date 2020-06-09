import React, {Component} from 'react';
import {StyleSheet, Dimensions, View, BackHandler, Alert, TextInput, StatusBar, TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard,} from 'react-native';
import Meteor from '../react-native-meteor';
import {colors} from '../config/styles';
import {Header,Left,Body,Text,Container,Button,Textarea, Title, Icon} from 'native-base';
import CogMenu from "../components/CogMenu";
import {Navigation} from "react-native-navigation/lib/dist/index";
import {backToRoot, goToRoute, navigateToRoutefromSideMenu} from "../Navigation";
//import Icon from 'react-native-vector-icons/Feather'
import {GalioProvider, Input, Button as GButton} from 'galio-framework';
import {customGalioTheme} from '../config/themes';

const window = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        //flex: 1,
        //justifyContent: 'center',
        //alignItems: 'center',
        width: '100%',
        backgroundColor: colors.appBackground,
        fontFamily: `Source Sans Pro`,
    },
    screenHeader: {
        fontSize: 20,
        color: '#ffffff',        
    },
    contentContainer: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    inputBox: {
        flexDirection: 'row',
        width: '100%',
        height: 40,
        backgroundColor: colors.inputBackground,
        borderRadius: 25,
        paddingHorizontal: 16,
        fontSize: 16,
        color: colors.whiteText,
        marginVertical: 5,
    },
    inputTextarea: {
        flexDirection: 'row',
        width: '100%',
        backgroundColor: 'white',
        borderRadius: customGalioTheme.SIZES.INPUT_BORDER_RADIUS,
        borderWidth:customGalioTheme.SIZES.INPUT_BORDER_WIDTH,
        borderColor:customGalioTheme.COLORS.PLACEHOLDER,
        paddingHorizontal: 16,
        fontSize: customGalioTheme.SIZES.INPUT_TEXT,
        color: customGalioTheme.COLORS.INPUT_TEXT,
        marginVertical: 5,

    },
    button: {
        width: '100%',
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
    //buttons: {
        //flexDirection: 'row',
        //justifyContent: 'center',
       // marginTop:10
    //},
    //error: {
        //flexDirection: 'row',
        //height: 28,
        //justifyContent: 'center',
        //width: '100%',
        //alignItems: 'center',
    //},
    errorText: {
        color: colors.danger,
        fontSize: 14,
        marginBottom: 14,
    },
    //header: {
        //marginBottom: 25,
        //alignItems: 'center',
     //   backgroundColor:'#80ccff',
        //padding:5
    //},
    //headerText: {
        //fontSize: 30,
        //color: colors.headerText,
        //fontWeight: '600',
        //fontStyle: 'italic',
    //},
    subHeaderText: {
        fontSize: 20,
       // color: colors.headerText,
        fontWeight: '400',
        fontStyle: 'italic',
        textAlign:'center',
        //color:'#006bb3',
        marginBottom: 14,
        color: colors.primaryText,
    },
    subContainer: {
       marginHorizontal:20
    },
});

class ContactUs extends Component {
    constructor(props) {
        super(props);

        this.mounted = false;
        this.state = {
            name: '',
            email: '',
            contact: '',
            message: '',
            error: null,
            loading:false,
        };
    }


    componentDidMount() {
        Navigation.events().bindComponent(this);
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));
    }

    handleBackButton(){
        console.log('handlebackpress')
        // navigateToRoutefromSideMenu(this.props.componentId,'Dashboard');
        backToRoot(this.props.componentId);
        return true;
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress');
    }
    handleError = (error) => {
        console.log('handleError')
            this.setState({error});
    }

    validInput = () => {
        const {name, email, message, contact} = this.state;
        let valid = true;

        if (!contact.length || !message|| !name || !email) {
            this.handleError('Please Enter all the information.');
            valid = false;
        }
        else{
            this.handleError('');
            valid = true;
        }

        if (valid) {
            this.handleError(null);
        }
        return valid;
    }


    handleContactUS = () => {
        console.log('handleContactUS')
        const {name, email, message, contact} = this.state;
        if (this.validInput()) {
            let contactInfo = {
                name: name,
                phone: contact,
                email: email,
                message: message
            };
            this.setState({loading:true});
            Meteor.call('addContactUsMessage', contactInfo, (err, result) => {
                this.setState({loading:false});
                if (err) {
                    this.handleError(err.reason);
                } else {
                    Alert.alert("DONE", "We will Contact you shortly!!");
                    goToRoute(this.props.componentId,'Dashboard');
                }
            });
        }
    }

    render() {

        return (
              <GalioProvider theme={customGalioTheme}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

            <Container style={styles.container}>
                <StatusBar
                    backgroundColor={colors.statusBar}
                    barStyle='light-content'
                />
                <Header style={{backgroundColor: '#094c6b'}}>
                    <Left>
                        {/*<Button transparent onPress={()=>{goBack(this.props.componentId)}}>*/}
                            {/*<Icon style={{color: '#ffffff'}} name="arrow-back" />*/}
                        {/*</Button>*/}
                        <CogMenu componentId={this.props.componentId}/>
                    </Left>
                    <Body>
                        <Title style={styles.screenHeader}>Contact Us</Title>
                    </Body>
                </Header>
                <View style={styles.contentContainer}>
                    <KeyboardAvoidingView style={{padding: 20}}>
                    {/*<View style={styles.header}>*/}
                        <Text style={styles.subHeaderText}>
                            Want to get in touch with us? Fill out the form below to send us a message and we will try
                            to get back to you within 24 hours!
                        </Text>
                    {/*</View>*/}

                    <View><Input
                      color={customGalioTheme.COLORS.INPUT_TEXT}
                                   placeholder='Full name'
                                   onChangeText={(name) => this.setState({name})} />

                    <Input
                      color={customGalioTheme.COLORS.INPUT_TEXT}
                                   placeholder='Email address'
                                   keyboardType='email-address'
                                   onChangeText={(email) => this.setState({email})}
                                   textContentType={'emailAddress'}
                    />

                   <Input
                      color={customGalioTheme.COLORS.INPUT_TEXT}
                                   placeholder='Phone No.'
                                   keyboardType='phone-pad'
                                   onChangeText={(contact) => this.setState({contact})}
                    />

                    <Textarea rowSpan={4} placeholder="Description (*)"
                                    style={styles.inputTextarea}
                                    placeholderTextColor={customGalioTheme.COLORS.PLACEHOLDER}
                                    selectionColor='#ffffff'
                                    underlineColorAndroid='rgba(0,0,0,0)'
                                    //onSubmitEditing={() => this.contactNumber.focus()}
                                    onChangeText={(message) => this.setState({message})}
                    /></View>

                        {/*<Item floatingLabel>
                            <Label>Full name</Label>
                        <Input
                            onChangeText={(name) => this.setState({name})}
                        />
                        </Item>
                        <Item floatingLabel>
                            <Label>Email address</Label>
                            <Input
                            onChangeText={(email) => this.setState({email})} />
                        </Item>
                        <Item floatingLabel>
                            <Label>Phone No.</Label>
                            <Input
                            onChangeText={(contact) => this.setState({contact})}
                        />
                        </Item>*/}
                        {/*<Item floatingLabel>*/}
                            {/*<Label>Message</Label>*/}
                            {/*<Textarea underline placeholder="Message"
                            onChangeText={(message) => this.setState({message})}
                            rowSpan={5}
                    />*/}
                        {/*</Item>*/}
                        <View style={styles.error}>
                            <Text style={styles.errorText}>{this.state.error}</Text>
                        </View>
                    
                        <View>

                         <GButton
                      onPress={() => {
                        this.handleContactUS();
                      }}
                      style={{width: '100%', marginVertical: 20}}
                      loading={this.state.loading}
                      disabled={this.state.loading}>
                      Send
                    </GButton>
                             {/*}   <TouchableOpacity  style={styles.button}  onPress={()=>this.handleContactUS()}>
                                    <Text style={styles.buttonText}>SEND</Text>
                                </TouchableOpacity>*/}
                            </View>
                    
                    {/*<View style={styles.buttons}>
                        <Button block  onPress={this.handleContactUS}>
                            <Text>SEND</Text>
                </Button>*/}
                        {/*<Button text="Cancel" onPress={() => {*/}
                            {/*this.setState({*/}
                                {/*error: null*/}
                            {/*}), this.props.navigation.navigate('Home')*/}
                        {/*}}/>*/}
                    {/*</View>*/}
                    {/*<KeyboardSpacer/>*/}
                    </KeyboardAvoidingView>
                    
                </View>
                
            </Container>
            </TouchableWithoutFeedback>
              </GalioProvider>
        );
    }
}

export default (ContactUs);
