import React, {Fragment} from "react";
import {View, StyleSheet, ToastAndroid, TouchableOpacity, Image, Modal, StatusBar, TextInput} from "react-native";

{/*import Icon from 'react-native-vector-icons/FontAwesome';*/
}
import {SafeAreaView} from "react-navigation";
import Autocomplete from 'native-base-autocomplete';
import {colors} from "../config/styles";
import {
    Container,
    Content,
    Text,
    Item,
    Icon,
    Input,
    ListItem,
    Textarea,
    CheckBox,
    Button,
    Picker,
    Header,
    Left,
    Body,
    Right
} from 'native-base';
import Meteor, {createContainer} from "react-native-meteor";
import GooglePlaceSearchBox from '../components/GooglePlaceSearch';
import GoogleSearch from '../components/GooglePlaceSearch/GoogleSearch'

//import ImagePicker from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import {ScrollView} from "react-native-gesture-handler";

const GooglePlaceSerachStyle = {
    textInputContainer: {
        width: "100%",
        backgroundColor: 'rgba(0,0,0,0)',
        borderTopWidth: 0,
        borderBottomWidth: 0,
        padding: 0,

    },
    description: {
        fontWeight: 'bold',
        color: colors.appLayout
    },
    predefinedPlacesDescription: {
        color: colors.appLayout
    },
    textInput: {
        width: 300,
        backgroundColor: colors.inputBackground,
        borderRadius: 25,
        paddingHorizontal: 16,
        fontSize: 16,
        color: colors.whiteText,
        // marginVertical: 5,
        height: 40,
        margin: 0,
        marginTop: 0,
        marginLeft: 0,
        marginRight: 0,
        paddingTop: 0,
        paddingBottom: 0
    },
    listView: {
        flex: 1,
    }
}

const styles = StyleSheet.create({
    screenHeader: {
        fontSize: 20,
        fontFamily: `Source Sans Pro`,
        color: '#ffffff',

    },

    s1f0fdd20: {
        color: `rgba(0, 0, 0, 1)`,
        fontFamily: `Source Sans Pro`,
        fontSize: 36
    },
    sfe09f185: {
        color: `rgba(87, 150, 252, 1)`,
        fontSize: 60
    },
    imageView: {
        alignItems: `center`,
        borderColor: colors.inputBackground,
        borderRadius: 10,
        borderWidth: 3,
        height: 150,
        justifyContent: `center`,
        marginTop: 0,
        width: '100%',
    },
    sbc83915f: {
        alignItems: `center`,
        width: '100%',
        //flex: 1,
        //padding: 10
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
    inputBoxAC: {
        width: '100%',
        height: 40,
        backgroundColor: colors.inputBackground,
        borderRadius: 25,
        paddingHorizontal: 16,
        fontSize: 16,
        color: colors.whiteText,
        marginVertical: 5,
    },
    inputBox: {
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
        width: '100%',
        backgroundColor: colors.inputBackground,
        borderRadius: 10,
        paddingHorizontal: 16,
        fontSize: 16,
        color: colors.whiteText,
        marginVertical: 5,
    },
    autocompleteOptions: {
        backgroundColor: `rgba(243, 247, 255, 1)`,
        borderRadius: 5,
        color: `rgba(0, 0, 0, 1)`,
        fontFamily: `Source Sans Pro`,
        fontSize: 16,
        padding: 10,
        //paddingLeft: 0,
        width: '100%',
        //marginBottom: 4,
        //marginTop: 4,
        height: 50,
        maxHeight: 100
    },
    autosuggestionView: {
        maxHeight: 100,
        backgroundColor: `rgba(243, 247, 255, 1)`,
        fontSize: 16,
        padding: 10,
        //paddingLeft: 0,
        width: '100%',
        backgroundColor: '#ececec', flexGrow: 1
    },
    s50325ddf: {
        backgroundColor: `rgba(0, 0, 0, 0.11)`,
        height: 1,
        marginBottom: 2,
        marginTop: 2,
        width: `100%`,

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
        alignItems: 'center',
        justifyContent: `center`,
        padding: 10,
        flexGrow: 1,
        width: '100%',
    },
    sbf9e8383: {
        flex: 1,
        opacity: 1
    },
    container: {
        backgroundColor: colors.appBackground,
        width: '100%',
        //flex: 1,
        //alignItems: 'center',
        //justifyContent: 'center'

    },
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
        marginBottom: 5,
        marginTop: 5,
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
    buttonContainer: {flex: 1, alignSelf: 'center', paddingTop: 20},
    centerButton: {margin: 10, alignSelf: 'center'},

    checkBokView: {
        //sbackgroundColor: `rgba(243, 247, 255, 1)`,
        //borderRadius: 5,
        color: `rgba(0, 0, 0, 0.44)`,
        fontFamily: `Source Sans Pro`,
        fontSize: 18,
        padding: 10,
        paddingLeft: 40,
        width: `100%`,
        flexDirection: 'row',
        // paddingTop: 15,
    },
    textInputContainer: {
        width: '100%',
        //backgroundColor: 'rgba(0,0,0,0)',
        borderTopWidth: 0,
        borderBottomWidth: 0,
        margin: 0,
        height: 60
    },
    description: {
        fontWeight: 'bold'
    },
    predefinedPlacesDescription: {
        //color: '#1faadb'
    },
    textInput: {
        //backgroundColor: `rgba(243, 247, 255, 1)`,
        borderRadius: 5,
        color: `rgba(0, 0, 0, 1)`,
        fontFamily: `Source Sans Pro`,
        fontSize: 18,
        // padding: 10,
        paddingLeft: 40,
        width: `100%`,
        marginBottom: 4,
        marginTop: 4,
        height: 50
    },
    autosuggestCont: {
        //padding: 10,
        backgroundColor: '#ececec',
    },
    autosuggesText: {
        marginBottom: 1,
        padding: 10,
        borderBottomColor: colors.inputBackground,
        borderBottomWidth: 1,
    },
    multiField: {
        flexDirection: 'row',
        flexGrow: 1,
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    inputBoxMultiField: {
        width: '48%',
        height: 40,
        backgroundColor: colors.inputBackground,
        borderRadius: 25,
        paddingHorizontal: 16,
        fontSize: 16,
        color: colors.whiteText,
        marginVertical: 5,
        marginHorizontal: '1%',
    },

    chkView: {
        flexDirection: `row`,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '48%',
        height: 40,
        marginHorizontal: '1%',
    },

    buttonView: {
        width: '100%',
        //minHeight:40,  
        marginBottom: 0,
        marginTop: 45,
    },
    button: {
        width: '100%',
        backgroundColor: colors.buttonPrimaryBackground,
        borderRadius: 25,
        //marginVertical: 10,
        paddingVertical: 13,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.whiteText,
        textAlign: 'center'
    },

});

class AddService extends React.PureComponent {
    constructor(props) {
        super(props);
        this.mounted = false;
        this.state = {
            query: '',
            selectedCategory: null,
            title: '',
            homeDelivery: false,
            radius: 0,
            description: '',
            location: null,
            contact: '',
            avatarSource: null,
            selected: 'Keynull',
            modalVisible: false,
            Image: null,
            price: null,
            unit: null,
            webLink: ''
        };

        this.categories = []

    }

    componentDidMount() {
        Meteor.subscribe('categories-list', () => {
            let MaiCategories = Meteor.collection('MainCategories').find();
            MaiCategories.forEach(item => {
                this.categories = this.categories.concat(item.subCategories);
            })
        })
    }

    _handleImageUpload = (selected) => {
        this.setModalVisible(false);
        if (selected === 'key0') {
            ImagePicker.openCamera({
                width: 400,
                height: 200,
                cropping: true,
                includeBase64: true
            }).then(image => {
                console.log(image);
                this._onImageChange(image)
            });
        }
        else if (selected === 'key1') {
            ImagePicker.openPicker({
                width: 400,
                height: 200,
                cropping: true,
                includeBase64: true
            }).then(image => {
                console.log(image);
                this._onImageChange(image)
            });
        }
    };
    _onImageChange = (image) => {

        // this.setState({
        //     avatarSource: {uri: `data:${image.mime};base64,${image.data}`},
        //     //  avatarSource:{ uri:  image.path }
        //     Image: image
        // });

        ImagePicker.clean().then(() => {
            console.log('removed all tmp images from tmp directory');
        }).catch(e => {
            alert(e);
        });
    }
    _updateHomeDelivery = () => {
        let current = this.state.homeDelivery;
        this.setState(
            {homeDelivery: current === false ? true : false}
        )
    };
    _callSaveServiceMethod = (service) => {
        service.Image = this.state.Image;
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
                    title: '',
                    homeDelivery: false,
                    radius: 0,
                    description: '',
                    location: '',
                    contact: '',
                    price: null,
                    unit: null,
                    webLink: ''
                });
                this.props.navigation.navigate('Home');
            }
        });

    };
    _saveService = () => {
        const {title, description, radius, contact, homeDelivery, selectedCategory, query, price, unit, location, webLink} = this.state;
        let service = {
            title: title,
            description: description,
            contact: contact,
            location: this.state.location,
            radius: radius,
            coverImage: null,
            homeDelivery: homeDelivery,
            price: price,
            unit: unit,
            website: webLink,
        };
        if (title.length === 0 || contact.length === 0 || description.length === 0 || radius.length === 0 || !location) {
            ToastAndroid.showWithGravityAndOffset(
                'Please Enter all the fields with *.',
                ToastAndroid.LONG,
                ToastAndroid.TOP,
                0,
                50,
            );
            //valid = false;
        }
        else {
            if (selectedCategory === null && query.length > 3) {
                // Meteor.call('addCategory', this.state.query, (err, res) => {
                //     if (err) {
                //         console.log(err)
                //     }
                //     else {
                service.Category = {subCatId: null, subCategory: query}
                this._callSaveServiceMethod(service)
                //     }
                // })
            }
            else if (selectedCategory) {
                service.Category = selectedCategory;
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

    handleLocation = (data, Detail) => {
        console.log(data, 'Detail :' + Detail)
        this.setState({
            location: data
        })
    }

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

    _findCategory(query) {
        if (query === '') {
            return [];
        }

        const categories = this.categories;
        const regex = new RegExp(`${query.trim()}`, 'i');
        return categories.filter(category => category.subCategory.search(regex) >= 0);
    }

    render() {
        const {query, selectedCategory} = this.state;
        const categories = this._findCategory(query);
        const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
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
                            <Icon name="md-more" style={{fontWeight: '500', fontSize: 35}}/>
                        </Button>
                    </Left>

                    <Body>
                    <Text style={styles.screenHeader}>Add Service</Text>
                    </Body>
                    {/*<Right>
                        <Button transparent onPress={() => navigate('Home')}>
                            <Icon name='home' style={{fontWeight:'500', fontSize: 30}}/>
                        </Button> 
                        <Button transparent onPress={() => navigate('Chat')}>
                            <Icon name='md-chatboxes' style={{fontWeight:'500', fontSize: 30}}/>
                        </Button>                    
                    </Right>*/}
                </Header>
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
                        <SafeAreaView style={styles.sb85086c9} keyboardShouldPersistTaps='always'>
                            {/*<Item style={styles.sbc83915f}>*/}
                            <View style={styles.sbc83915f}>
                                {/*<Text style={styles.s1f0fdd20}>{`Add Service`}</Text>*/}
                                <TouchableOpacity style={styles.imageView} onPress={() => {
                                    this.setModalVisible(true)
                                }}>
                                    {this.state.avatarSource !== null ?
                                        <Image style={{
                                            width: '100%',
                                            height: 150,
                                            borderRadius: 10,
                                            borderWidth: 3,
                                            height: 150,
                                            justifyContent: `center`,
                                            borderColor: `rgba(87, 150, 252, 1)`
                                        }} source={this.state.avatarSource}/> :
                                        <Icon
                                            style={styles.sfe09f185}
                                            name='camera'
                                        />}
                                </TouchableOpacity>
                            </View>
                            <View underlineColorAndroid='rgba(0,0,0,0)'
                                  style={{width: '100%', minHeight: 40, marginVertical: 5, justifyContent: `center`}}>
                                <Autocomplete
                                    autoCapitalize="none"
                                    style={styles.inputBoxAC}
                                    autoCorrect={false}
                                    data={categories.length === 1 && comp(query, categories[0].subCategory)
                                        ? [] : categories}
                                    defaultValue={query}
                                    hideResults={selectedCategory && selectedCategory.subCategory === query}
                                    onChangeText={text => this.setState({query: text})}
                                    underlineColorAndroid='rgba(0,0,0,0)'
                                    placeholder="Enter Category's name (*)"
                                    placeholderTextColor={`rgba(0, 0, 0, 0.44)`}
                                    renderItem={cat => <View style={{maxHeight: 200}}><ScrollView style={{flexGrow: 0}}><TouchableOpacity
                                        style={styles.autosuggestCont}
                                        onPress={() => (
                                            this.setState({
                                                query: cat.subCategory,
                                                selectedCategory: cat
                                            })
                                        )}
                                    >
                                        <Text style={styles.autosuggesText}>{cat.subCategory}</Text>
                                    </TouchableOpacity></ScrollView></View>}
                                />
                            </View>

                            <TextInput placeholder='Title (*)'
                                       style={styles.inputBox}
                                       placeholderTextColor={`rgba(0, 0, 0, 0.44)`}
                                       underlineColorAndroid='rgba(0,0,0,0)'
                                       onSubmitEditing={() => this.title.focus()}
                                       onChangeText={(title) => this.setState({title})}
                            />
                            <Textarea rowSpan={3} placeholder="Description (*)"
                                      style={styles.inputTextarea}
                                      placeholderTextColor={`rgba(0, 0, 0, 0.44)`}
                                      underlineColorAndroid='red'
                                //onSubmitEditing={() => this.contactNumber.focus()}
                                      onChangeText={(description) => this.setState({description})}
                            />
                            {/*<Input disabled*/}
                            {/*style={styles.inputText}*/}
                            {/*placeholderTextColor={`rgba(0, 0, 0, 0.44)`}*/}
                            {/*underlineColorAndroid='rgba(0,0,0,0)'*/}
                            {/*placeholder='Location'*/}
                            {/*keyboardType='phone-pad'*/}
                            {/*onChangeText={(location) => this.setState({location})}*/}
                            {/*/>*/}

                            <GooglePlaceSearchBox
                                onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                                    console.log(data, details);
                                    this.handleLocation(details)
                                }}
                                placeholder={'Enter Address'}
                                placeholderTextColor={`rgba(0, 0, 0, 0.44)`}
                                underlineColorAndroid='rgba(0,0,0,0)'
                                styles={GooglePlaceSerachStyle}
                            />


                            <TextInput underlineColorAndroid='rgba(0,0,0,0)'
                                       placeholderTextColor={`rgba(0, 0, 0, 0.44)`}
                                       style={styles.inputBox}
                                       placeholder='Radius for Service Area in KiloMeter (*)'
                                       keyboardType='phone-pad'
                                       onChangeText={(radius) => this.setState({radius})}
                            />


                            <View style={styles.multiField}>
                                <TextInput underlineColorAndroid='rgba(0,0,0,0)'
                                           placeholderTextColor={`rgba(0, 0, 0, 0.44)`}
                                           style={styles.inputBoxMultiField}
                                           placeholder='Unit'
                                           onChangeText={(unit) => this.setState({unit})}
                                />
                                <TextInput underlineColorAndroid='rgba(0,0,0,0)'
                                           placeholderTextColor={`rgba(0, 0, 0, 0.44)`}
                                           style={styles.inputBoxMultiField}
                                           placeholder='Price per Unit'
                                           keyboardType='phone-pad'
                                           onChangeText={(price) => this.setState({price})}
                                />
                            </View>

                            <View style={styles.multiField}>


                                <TextInput underlineColorAndroid='rgba(0,0,0,0)'
                                           placeholderTextColor={`rgba(0, 0, 0, 0.44)`}
                                           style={styles.inputBoxMultiField}
                                           placeholder='Contact No (*)'
                                           keyboardType='phone-pad'
                                           onChangeText={(contact) => this.setState({contact})}
                                />

                                <View style={styles.chkView}><CheckBox style={{marginEnd: 20}}
                                                                       checked={this.state.homeDelivery}
                                                                       onPress={this._updateHomeDelivery}/>
                                    <Text style={{color: `rgba(0, 0, 0, 0.44)`}}>{'Home Delivery'}</Text></View>

                            </View>


                            <TextInput underlineColorAndroid='rgba(0,0,0,0)'
                                       placeholderTextColor={`rgba(0, 0, 0, 0.44)`}
                                       style={styles.inputBox}
                                       placeholder='Website'
                                       onChangeText={(webLink) => this.setState({webLink})}
                            />
                            <View style={styles.buttonView}>
                                <Button
                                    style={styles.button}
                                    onPress={this._saveService}>
                                    <Text style={styles.buttonText}> Save </Text>
                                </Button></View>

                            <View style={{marginTop: 22}}>
                                <Modal
                                    animationType="slide"
                                    transparent={true}
                                    visible={this.state.modalVisible}
                                    onRequestClose={() => {
                                        this.setModalVisible
                                    }}>
                                    <View style={{
                                        flex: 1,
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>

                                        <View style={{
                                            backgroundColor: 'white',
                                            width: 350,
                                            height: 200,
                                            padding: 30,

                                        }}>

                                            <Button block bordered info onPress={() => {
                                                this._handleImageUpload('key0')
                                            }}>
                                                <Text style={styles.item_text}>Picture from Camera</Text>
                                            </Button>
                                            <Button style={{marginTop: 10}} info block bordered onPress={() => {
                                                this._handleImageUpload('key1')
                                            }}>
                                                <Text style={styles.item_text}>Picture from Gallery </Text>
                                            </Button>
                                            <Button transparent danger onPress={() => {
                                                this.setModalVisible(false)
                                            }}>
                                                <Text>Cancel</Text>
                                            </Button>
                                        </View>
                                    </View>
                                </Modal>
                            </View>
                        </SafeAreaView>
                    </Fragment>
                </Content>
            </Container>
        );
    }
}

AddService.defaultProps = {};

export {styles};
export default createContainer(() => {
    Meteor.subscribe('categories');
    return {
        categories: Meteor.collection('categories').find()
    }
}, AddService);
