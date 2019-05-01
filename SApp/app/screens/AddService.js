import React, { Fragment } from "react";
import {View, StyleSheet, ToastAndroid} from "react-native";
import Icon  from 'react-native-vector-icons/FontAwesome';
import { SafeAreaView } from "react-navigation";
import Autocomplete from 'native-base-autocomplete';
import {colors} from "../config/styles";
import {    Container, Content, Text,  Item,  Input,  ListItem, Textarea, CheckBox,Button} from 'native-base';
import Meteor, {createContainer} from "react-native-meteor";

const styles = StyleSheet.create({
    s1f0fdd20: {
        color: `rgba(0, 0, 0, 1)`,
        fontFamily: `Source Sans Pro`,
        fontSize: 36
    },
    sfe09f185: {
        color: `rgba(87, 150, 252, 1)`,
        fontSize: 60
    },
    s98b3c3c3: {
        alignItems: `center`,
        borderColor: `rgba(87, 150, 252, 1)`,
        borderRadius: 75,
        borderWidth: 3,
        height: 150,
        justifyContent: `center`,
        marginTop: 30,
        width: 150
    },
    sbc83915f: {
        alignItems: `center`,
        flex: 1,
        padding: 20
    },
    sad8176a7: {
        color: `rgba(51, 51, 51, 1)`,
        fontFamily: `Source Sans Pro`,
        fontSize: 16,
        opacity: 0.5
    },
    sdbde75cb: {
        backgroundColor: `rgba(87, 150, 252, 1)`,
        height: 1,
        marginBottom: 13,
        marginTop: 13,
        width: `100%`
    },
    sb47a0426: {
        color: `rgba(51, 51, 51, 1)`,
        fontFamily: `Source Sans Pro`,
        fontSize: 16,
        opacity: 0.5,
        lineHeight: 2
    },
    s5e284020: {
        color: `rgba(87, 150, 252, 1)`,
        fontFamily: `Helvetica`,
        fontSize: 9
    },
    s4fda91b2: {
        alignItems: `center`,
        backgroundColor: `rgba(255, 255, 255, 0.8)`,
        borderColor: `rgba(87, 150, 252, 1)`,
        borderRadius: 9,
        borderWidth: 1,
        height: 18,
        justifyContent: `center`,
        marginLeft: 15,
        width: 36
    },
    s57ff64ea: {
        flexDirection: `row`,
        width: 230
    },
    s906d750e: {
        backgroundColor: `rgba(87, 150, 252, 1)`,
        height: 1,
        marginBottom: 13,
        marginTop: 13,
        width: `100%`
    },
    inputText: {
       // color: `rgba(51, 51, 51, 1)`,
        fontFamily: `Source Sans Pro`,
        fontSize: 16,
        opacity: 0.5
    },
    s50325ddf: {
        backgroundColor: `rgba(87, 150, 252, 1)`,
        height: 1,
        marginBottom: 13,
        marginTop: 13,
        width: `100%`
    },
    itemText: {
        color: `rgba(51, 51, 51, 1)`,
        fontFamily: `Source Sans Pro`,
        fontSize: 16,
        opacity: 0.5
    },
    form: {
       // flex: 1.5
    },
    sb85086c9: {
      //  alignItems: 'center',
        padding: 20,
      //  flex: 1
    },
    sbf9e8383: {
        flex: 1,
        opacity: 1
    },
    container: {
        backgroundColor: colors.appBackground,
       // flex: 1,

    },
    // itemText: {
    //     fontSize: 15,
    //     margin: 2,
    //     backgroundColor:'green',
    // },
    descriptionContainer: {
        // `backgroundColor` needs to be set otherwise the
        // autocomplete input will disappear on text input.
        marginTop: 10,
        backgroundColor: colors.bgBrightWhite,
    },
    infoText: {
        textAlign: 'center'
    },
    titleText: {
        fontWeight: '500',
        marginBottom: 10,
        marginTop: 10,
        textAlign: 'center',
        color: `rgba(51, 51, 51, 1)`,
        fontFamily: `Source Sans Pro`,
        fontSize: 16,
        opacity: 0.5
    },
    directorText: {
        color: 'grey',
        fontSize: 12,
        marginBottom: 10,
        textAlign: 'center'
    },
    openingText: {
        textAlign: 'center'
    },
    buttonContainer: { flex: 1, alignSelf: 'center', paddingTop: 20 },
    centerButton: { margin: 10, alignSelf: 'center' },

    checkBokView:{
        height:50,
        flex:1,
        paddingLeft:5,
        paddingRight:5,
        fontSize:17,
        color:'#000',
        flexDirection:'row',
        paddingTop:15,
    }

});

class AddService extends React.PureComponent {
    constructor(props) {
        super(props);
        this.mounted = false;
        this.state = {
            query: '',
            selectedCategory: null,
            title:'',
            homeDelivery: false,
            radius:0,
            description:'',
            location:'',
            contact:''
        };

    }

    _findCategory(query) {
        if (query === '') {
            return [];
        }

        const  categories  = this.props.categories;
        const regex = new RegExp(`${query.trim()}`, 'i');
        return categories.filter(category => category.name.search(regex) >= 0);
    }

    _updateHomeDelivery=()=>{
        let current=this.state.homeDelivery;
        this.setState(
            {homeDelivery: current===false ? true : false}
        )
    }

    _callSaveServiceMethod=(service)=>{
        Meteor.call('addNewService', service, (err, res) => {
            if (err) {
                ToastAndroid.showWithGravityAndOffset(
                    err.reason,
                    ToastAndroid.LONG,
                    ToastAndroid.TOP,
                    0,
                    50,
                );
                console.log(err.reason);
            } else {
                // hack because react-native-meteor doesn't login right away after sign in
                console.log('Reslut from addNewService' + res);
                this.setState({
                    query: '',
                    selectedCategory: null,
                    title:'',
                    homeDelivery: false,
                    radius:0,
                    description:'',
                    location:'',
                    contact:''
                });
                this.props.navigation.navigate('Home');
            }
        });

    }
    _saveService=()=>{
        const {title, description, radius, contact, homeDelivery,selectedCategory,query} = this.state;
        let service = {
            title: title,
            description: description,
            contact: contact,
            location:{lat:100,long:100},
            radius:radius,
            coverImage:null,
            homeDelivery:homeDelivery,
        };
        if (title.length === 0 || contact.length === 0 || description.length === 0 ||  radius.length === 0) {
            ToastAndroid.showWithGravityAndOffset(
                'Please Enter all the fields.',
                ToastAndroid.LONG,
                ToastAndroid.TOP,
                0,
                50,
            );
            //valid = false;
        }
        else {
            if(selectedCategory===null  && query.length>3){
                Meteor.call('addCategory',this.state.query,(err,res)=>{
                    if(err){
                        console.log(err)
                    }
                    else{
                        debugger;
                        service.Category={_id:null,name:query}
                        this._callSaveServiceMethod(service)
                    }
                })
            }
            else if(selectedCategory) {
                service.Category=selectedCategory;
                this._callSaveServiceMethod(service)
            }
            else {
                ToastAndroid.showWithGravityAndOffset(
                    'Please Enter Category Name with length greater than 3',
                    ToastAndroid.LONG,
                    ToastAndroid.TOP,
                    0,
                    50,
                );
            }
        }
    }
    render() {
        const { query, selectedCategory } = this.state;
        const categories = this._findCategory(query);
        const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
        return (
            <Container style={styles.container}>
                <Content>
            <Fragment>
                {/*<ImageBackground*/}
                    {/*style={styles.sbf9e8383}*/}
                    {/*source={{*/}
                        {/*uri:*/}
                            {/*"https://storage.googleapis.com/laska-a5b9d.appspot.com/users/8gFytgGUIxUmMgoS77epODqK1F82/apps/-LYZqWkoo_OshI8cOcox/7405112c-8e46-4d6f-9d60-5278eebf67df"*/}
                    {/*}}*/}
                    {/*resizeMode={`stretch`}*/}
                {/*>*/}
                    <SafeAreaView style={styles.sb85086c9}>
                        <View style={styles.sbc83915f}>
                            <Text style={styles.s1f0fdd20}>{`Add Service`}</Text>
                            <View style={styles.s98b3c3c3}>
                                <Icon
                                    style={styles.sfe09f185}
                                   name='camera'
                                />
                            </View>
                        </View>
                        <View style={styles.form}>
                            <Autocomplete
                                autoCapitalize="none"
                                autoCorrect={false}
                                data={categories.length === 1 && comp(query, categories[0].name)
                                    ? [] : categories}
                                defaultValue={query}
                                hideResults={selectedCategory && selectedCategory.name === query}
                                onChangeText={text => this.setState({ query: text })}
                                placeholder="Enter Category's name"
                                renderItem={cat => <ListItem style={{backgroundColor:colors.bgBrightGreen}}
                                    onPress={() => (
                                        this.setState({ query: cat.name, selectedCategory: cat })
                                    )}

                                    style={styles.inputText}
                                >
                                    <Text>{cat.name}</Text>
                                </ListItem>}
                            />
                            <View style={styles.descriptionContainer}>
                            </View>
                           {/*<View style={styles.s906d750e} />*/}
                            <Item >
                                <Input placeholder='Title'
                                       style={styles.item_text}
                                       underlineColorAndroid='rgba(0,0,0,0)'
                                       onSubmitEditing={() => this.title.focus()}
                                       onChangeText={(title) => this.setState({title})}
                                />
                            </Item>
                            <Textarea rowSpan={4}  placeholder="Description"
                                      underlineColorAndroid='rgba(0,0,0,0)'
                             //onSubmitEditing={() => this.contactNumber.focus()}
                            onChangeText={(description) => this.setState({description})}
                            />
                            <View  style={styles.s50325ddf} />
                            <Item >
                                <Input  disabled
                                        underlineColorAndroid='rgba(0,0,0,0)'
                                        placeholder='Location'
                                        keyboardType='phone-pad'
                                        onChangeText={(location) => this.setState({location})}
                                />
                            </Item>
                            <Item >
                                <Input  underlineColorAndroid='rgba(0,0,0,0)'
                                        placeholder='Radius in KiloMeter'
                                        keyboardType='phone-pad'
                                        onChangeText={(radius) => this.setState({radius})}
                                />
                            </Item>
                            <View style={styles.checkBokView}>
                            <Text style={styles.inputText}>{'Home Delivery'}</Text>

                            <CheckBox checked={this.state.homeDelivery} onPress={this._updateHomeDelivery} />

                            </View>
                            <View   style={styles.s50325ddf} />
                            <Item >
                                <Input  underlineColorAndroid='rgba(0,0,0,0)'
                                        placeholder='Contact No'
                                        keyboardType='phone-pad'
                                        onChangeText={(contact) => this.setState({contact})}
                                />
                            </Item>

                            <View   style={styles.s50325ddf} />
                            <Button block success onPress={this._saveService}><Text> Save </Text></Button>

                        </View>
                    </SafeAreaView>
            </Fragment>
                </Content>
            </Container>
        );
    }
}

AddService.defaultProps = {};

export { styles };
export default  createContainer(()=>{
    Meteor.subscribe('categories');
    return{
        categories:Meteor.collection('categories').find()
    }
},AddService);
