import React, {Component} from 'react';
import { StyleSheet, Text,Alert, View,ScrollView, Modal ,Image,TouchableHighlight,Linking,} from 'react-native';
import { colors } from '../config/styles';
import Button from '../components/Button';
import CustomHeader from '../components/Header';
import InputWrapper from "../components/GenericTextInput/InputWrapper";
import GenericTextInput from "../components/GenericTextInput";
import PropTypes from 'prop-types';
import Icon  from 'react-native-vector-icons/FontAwesome';
import Meteor, { createContainer } from 'react-native-meteor';
import GridView from 'react-native-super-grid';
import call from "react-native-phone-call";



const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: colors.background,
  },
  main: {
    fontSize: 20,
    textAlign: 'center',
    color: colors.headerText,
    fontWeight: '400',
    fontStyle: 'italic',
  },
    buttons: {
      marginTop:5,
        justifyContent: 'center',
        flexDirection: 'row',
    },
    gridView: {
        paddingTop: 25,
        flex: 1,
    },
    itemContainer: {
        justifyContent: 'flex-end',
        borderRadius: 5,
        padding: 10,
        height: 120,
        marginTop:10,
    },
    itemName: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
        textAlign: 'center',
    },
    itemCode: {
        fontWeight: '600',
        fontSize: 12,
        color: '#fff',
        textAlign: 'center',
    },
    addButton:{
        justifyContent: 'center',
        alignItems:'center',
        borderRadius: 5,
        margin: 10,
        height:100,
        width:100,
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

class Home extends Component {

    constructor(props) {
        super(props);
        this.mounted = false;
        this.state = {
            toEdit:'',
            showModal: false,
            name: '',
            title: '',
            contact: '',
            editItem: false,
            items:{},
            error:null,
            role:Meteor.user().profile.role,
            isVisible:false
        }

    }
    componentWillMount() {
        this.mounted = true;

    }

    componentDidMount(){
        Meteor.subscribe('notifications-list');
    }

    componentWillUnmount(){
        this.mounted = false;
    }
    handleError = (error) => {
        if (this.mounted) {
            this.setState({ error });
        }
    }

    handleCreateNew = () => {
        if(this.mounted) {
            if(this.validInput()) {
                const {name, title, contact} = this.state;
                let item = {name: name, title: title, contact: contact}
                Meteor.call('addNewCategory', item, (err, res) => {
                    if (err) {
                        console.log(err);
                        this.handleError(err.reason);
                    }
                    else {
                        console.log(res);
                        this.setState({
                            // items: itemss,
                            showModal: false,
                            name:'',
                            contact:'',
                            title:'',
                            error:null
                        })
                    }
                });
            }
        }
    }
    handleEdit=(item)=>{
        this.setState({
            toEdit:item._id,
            name: item.name,
            contact: item.contact,
            title: item.title,
            editItem:true,
            showModal: true,
            error:null,
        });
    }

    validInput = () => {
        const {name, contact, title,  } = this.state;
        let valid = true;

        if (name.length === 0 || contact.length === 0 || title.length===0) {
            this.handleError('Title, Name and Phone No cannot be empty.');
            valid = false;
        }

        if (valid) {
            this.handleError(null);
        }
        return valid;
    }

    handleEditOld=()=>{
        debugger;
        if(this.validInput()) {
            const {name, contact, title} = this.state;
            let itemToEdit = {_id:this.state.toEdit,name:name,title:title,contact:contact}
            Meteor.call('updateCategory',itemToEdit,(err,res)=>{
               if(err){
                   console.log(err);
                   this.handleError(err.reason);
               }
               else {
                   console.log(res);
                   this.setState({
                       // items: items,
                       showModal: false,
                       editItem: false,
                       name: '',
                       title: '',
                       contact: '',
                       error:null,
                   })
               }
            });
        }
    }


    handleRemove=(id)=>{
        Alert.alert(
            'Remove Item',
            'Do you want to Remove?',
            [
                {text: 'Yes Remove', onPress: () =>  Meteor.call('removeCategory',id,(err)=>{
                        if(err){
                            console.log(err);
                           Alert.alert(err.reason);
                        }
                    })},
                {text: 'Not Now', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            ],
            { cancelable: false }
        )
    }


    handleCancel=()=>{
        this.setState({
            showModal: false,
            editItem:false,
            name:'',
            title:'',
            contact:'',
            idToEdit:'',
            error:null,
        })
    }
    handleSignout=()=>{
        Alert.alert(
            'SignOut',
            'Do you want to SignOut?',
            [
                {text: 'Yes SignOut', onPress: () =>  Meteor.logout((err)=>{
                        if(!err)
                            this.props.navigation.navigate('signIn')
                    })},
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            ],
            { cancelable: false }
        )

    }
    callPhone(number){
        const args = {
            number: number, // String value with the number to call
            prompt: false // Optional boolean property. Determines if the user should be prompt prior to the call
        }
        if(this.mounted) {
            Meteor.call('updateCallCount',(err)=>{
                if(err){
                    this.handleError(err.reason);
                }
            });
            call(args).catch(console.error)
        }
    }
    showPopover=() =>{
        this.setState({isVisible: true});
    }

    closePopover=() =>{
        this.setState({isVisible: false});
    }
    static navigationOptions={
        drawerIcon:(
            <Image source={require('../images/settings.png')}
                   style={{height:25,width:25}}/>
        )
    }
    render() {
        const title= this.state.editItem ? "Edit Item" : "Add Item";
        let button;
        const addUser = (<Icon  size={30} name='user-plus' color="white"  onPress={()=>{this.props.navigation.navigate("SignUp")}} ></Icon>);
        if (this.state.editItem ) {
            button = <Button text="Update" onPress={this.handleEditOld}/>;
        } else {
            button = <Button text="Save" onPress={this.handleCreateNew}/>;
        }

        return (

            <View style={styles.container}>
            <CustomHeader />
                {this.props.user.profile.role === 1?
                    <Icon.Button  size={35} name='plus-square' style={{backgroundColor: "#39BD98", justifyContent:'center', alignItems:'center'}}  onPress={()=>{this.setState({showModal: true})}}>Add New</Icon.Button>
                    :null}

                <ScrollView style={styles.scrollView}>
                    <GridView
                        itemDimension={130}
                        items={this.props.items}
                        style={styles.gridView}
                        renderItem={item => (
                            <View style={[styles.itemContainer, {backgroundColor: "rgb(44, 116, 224)"}]}>
                                <Text style={styles.itemName}>{item.title}</Text>
                                <Text style={styles.itemCode}>Person: {item.name}</Text>
                                {/*<Text style={styles.itemCode}>Mb: {item.contact}</Text>*/}
                                <View style={styles.buttons}/>
                                {this.props.user.profile.role === 1  ?
                                    <Icon name="times-circle" color="white" onPress={()=>{this.handleRemove(item._id)}} size={30} style={{
                                        position: 'absolute',
                                        right: 3,
                                        top: 1,
                                        bottom: 0,
                                    }} />:null}
                                    {this.props.user.profile.role === 1  ?
                                    <Icon.Button size={20} name='edit'
                                                 style={[styles.button, {textAlign: 'center', padding: 5,backgroundColor: "#39BD98"}]}
                                                 onPress={() => {
                                                     this.handleEdit(item)
                                                 }}> Edit</Icon.Button>
                                    : <Icon.Button size={20} name='phone-square'
                                                   style={[styles.button, {textAlign: 'center', padding: 5,backgroundColor: "#39BD98"}]}
                                                   onPress={() => {
                                                       this.callPhone(item.contact)
                                                   }}> Call</Icon.Button>
                                }
                            </View>
                        )}
                    />

                </ScrollView>

                <Modal style={styles.container} visible={this.state.showModal} onRequestClose={()=>{}}>
                    <Text style={styles.main}>
                        {title}
                    </Text>
                    <InputWrapper>
                        <GenericTextInput
                            placeholder="Title"
                            onChangeText={(title) => this.setState({title})}
                            defaultValue={this.state.title}
                        />
                        <GenericTextInput
                            placeholder="Name"
                            onChangeText={(name) => this.setState({name})}
                            borderTop
                            defaultValue={this.state.name}
                        />
                        <View style={styles.divider}></View>
                        <GenericTextInput
                            placeholder="Phone"
                            onChangeText={(contact) => this.setState({contact})}
                            borderTop
                            defaultValue={this.state.contact}
                        />

                    </InputWrapper>

                    <View style={styles.error}>
                        <Text style={styles.errorText}>{this.state.error}</Text>
                    </View>

                    <View style={styles.buttons}>
                        {button}
                        <Button text="Cancel" onPress={this.handleCancel}/>
                    </View>

                </Modal>
            </View>
        );
    };
}

Home.propTypes = {
  navigation: PropTypes.object,
};


export default createContainer(() => {
    Meteor.subscribe('categories-list');
    return {

        items: Meteor.collection('category').find(),
        user :Meteor.user(),
        // notifications:[{
        //     title:"Updates",
        //     message:"A lot new features available now. Grab new App by Tapping here",
        //     url:"http://github.com",
        //     linkText:"here"
        // },
        //     {
        //         title:"Updates",
        //         message:"A lot new features available now. Grab new App by Tapping here",
        //         url:"http://github.com",
        //         linkText:"here"
        //     }]
            };
}, Home);