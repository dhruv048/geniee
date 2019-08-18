import React, {Component} from 'react';
import {StyleSheet, Dimensions, View, Image, Alert} from 'react-native';
import Meteor from 'react-native-meteor';
import {colors} from '../config/styles';
import GenericTextInput, {InputWrapper} from '../components/GenericTextInput';
import {Header,Left,Body,Text,Item,Content,Container,Button,Label,Input,Textarea} from 'native-base';
import Icon from 'react-native-vector-icons/Feather'

const window = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: colors.appBackground,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop:10
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
    header: {
        marginBottom: 25,
        alignItems: 'center',
     //   backgroundColor:'#80ccff',
        padding:5
    },
    headerText: {
        fontSize: 30,
        color: colors.headerText,
        fontWeight: '600',
        fontStyle: 'italic',
    },
    subHeaderText: {
        fontSize: 20,
       // color: colors.headerText,
        fontWeight: '400',
        fontStyle: 'italic',
        textAlign:'center',
        color:'#006bb3'
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
        };
    }

    componentWillMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    handleError = (error) => {
        if (this.mounted) {
            this.setState({error});
        }
    }

    validInput = () => {
        const {name, email, message, contact} = this.state;
        let valid = true;

        if (contact.length === 0 || message.length === 0 || name.length === 0 || email.length == 0) {
            this.handleError('Please Enter all the information.');
            valid = false;
        }

        if (valid) {
            this.handleError(null);
        }
        return valid;
    }


    handleContactUS = () => {
        const {name, email, message, contact} = this.state;
        if (this.validInput()) {
            let contactInfo = {
                name: name,
                phone: contact,
                email: email,
                message: message
            };
            Meteor.call('addContactUsMessage', contactInfo, (err, result) => {
                if (err) {
                    this.handleError(err.reason);
                } else {
                    Alert.alert("DONE", "We will Contact you shortly!!");
                    this.props.navigation.navigate('Home');
                }
            });
        }
    }

    render() {

        return (
            <Container style={styles.container}>
                <Header style={{backgroundColor:colors.appLayout}}>
                    <Left>
                        <Icon name={'arrow-left'} size={25} color={'white'} onPress={()=>this.props.navigation.goBack()}/>
                    </Left>
                    <Body>
                    <Text style={{color:'white'}} >Contact Us</Text>
                    </Body>
                </Header>
                <Content>
                <View style={styles.subContainer}>
                    <View style={styles.header}>
                        <Text style={styles.subHeaderText}>
                            Want to get in touch with us? Fill out the form below to send us a message and we will try
                            to get back to you within 24 hours!
                        </Text>
                    </View>


                        <Item floatingLabel>
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
                        </Item>
                        {/*<Item floatingLabel>*/}
                            {/*<Label>Message</Label>*/}
                            <Textarea underline placeholder="Message"
                            onChangeText={(message) => this.setState({message})}
                            rowSpan={5}
                            />
                        {/*</Item>*/}
                        <View style={styles.error}>
                            <Text style={styles.errorText}>{this.state.error}</Text>
                        </View>
                    <View style={styles.buttons}>
                        <Button block  onPress={this.handleContactUS}>
                            <Text>SEND</Text>
                        </Button>
                        {/*<Button text="Cancel" onPress={() => {*/}
                            {/*this.setState({*/}
                                {/*error: null*/}
                            {/*}), this.props.navigation.navigate('Home')*/}
                        {/*}}/>*/}
                    </View>
                    {/*<KeyboardSpacer/>*/}
                </View>
                </Content>
            </Container>
        );
    }
}

export default ContactUs;
