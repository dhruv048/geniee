import React, {Fragment} from "react";
import {
    View,
    StyleSheet,
    ToastAndroid,
    TouchableOpacity,
    Image,
    Modal,
    StatusBar,
    TextInput,
    FlatList,
    Dimensions,
    SafeAreaView, ScrollView,BackHandler
} from "react-native";
import Autocomplete from 'native-base-autocomplete';
import {colors} from "../../config/styles";
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
    Right,
    Footer
} from 'native-base';
import Meteor from "../../react-native-meteor";
const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');
import ActionSheet from 'react-native-actionsheet';
//import ImagePicker from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import {CogMenu} from "../../components/CogMenu/CogMenu";
import {Navigation} from "react-native-navigation/lib/dist/index";
import {backToRoot, goToRoute, goBack} from "../../Navigation";
import AsyncStorage from '@react-native-community/async-storage';
import settings from "../../config/settings";
import FIcon from 'react-native-vector-icons/Feather';
import Loading from '../../components/Loading';



class AddProduct extends React.PureComponent {
    constructor(props) {
        super(props);
        this.mounted = false;
        this.state = {
            query: '',
            selectedService: null,
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
            discount: null,
            unit: null,
            webLink:'',
            images:[],
            qty:'',
            loading:false,
        };
         this.myServices=[];
         this.imagesToRemove=[];
    }

    async componentDidMount() {
        Navigation.events().bindComponent(this);
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));
        let myServices = await AsyncStorage.getItem('myServices');
        console.log(myServices)
        this.myServices=JSON.parse(myServices);
        this.fillEditForm();
    };

    fillEditForm=()=>{
        let _product=this.props.Product;
        if(_product) {
            let _serv=this.myServices.find(serv=>{return serv._id==_product.service});
            let colorss="";
            _product.colors.forEach((item,i)=>{
                if(i==0)
                    colorss=colorss+item;
                else
                    colorss=colorss+";"+item;
            });
            let sizess="";
            _product.sizes.forEach((item,i)=>{
                if(i==0)
                    sizess=sizess+item;
                else
                    sizess=sizess+";"+item;
            });

            let imgs=[];
            _product.images.forEach(item=>{
                let image={
                    _id:item,
                    uri:settings.IMAGE_URL+item
                };
                imgs.push(image)
            })

            this.setState({
                query: _serv.title,
                selectedService: _serv,
                title: _product.title,
                homeDelivery: _product.homeDelivery,
                radius: _product.radius?_product.radius.toString():"",
                description: _product.description,
                location: _product.location,
                contact: _product.contact,
                price: _product.price?_product.price.toString():"",
                discount: _product.discount?_product.discount.toString():"",
                unit: _product.unit,
                webLink: _product.website,
                colors: colorss,
                sizes: sizess,
                qty: _product.qty.toString(),
                images: imgs
            });
        }
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

    _handleImageUpload = (selected) => {
        this.setModalVisible(false);
        if (selected === 0) {
            ImagePicker.openCamera({
                includeBase64: true,
                compressImageMaxWidth:1440,
                compressImageMaxHeight:2560,
                compressImageQuality:0.8
            }).then(image => {
                console.log(image);
                this._onImageChange(image)
            });
        }
        else if (selected === 1) {
            ImagePicker.openPicker({
                includeBase64: true,
                compressImageMaxWidth:1440,
                compressImageMaxHeight:2560,
                compressImageQuality:0.8
            }).then(image => {
                console.log(image);
                this._onImageChange(image)
            });
        }
    };
    _onImageChange = (image) => {
        image.uri=`data:${image.mime};base64,${image.data}`;
        console.log(image);
        this.setState(prevState => ({
            images: [...prevState.images, image ]
        }))

        ImagePicker.clean().then(() => {
            console.log('removed all tmp images from tmp directory');
        }).catch(e => {
            alert(e);
        });
    };

    removeImage=(image)=>{
        let images=[...this.state.images];
        let index=images.indexOf(image);
        console.log(index,image)
        if(index !== -1){
            images.splice(index,1);
            this.setState({images:images});
            if(image.hasOwnProperty("_id")){
                this.imagesToRemove.push(image._id);
            }
        }
}
    _updateHomeDelivery = () => {
        let current = this.state.homeDelivery;
        this.setState(
            {homeDelivery: current === false ? true : false}
        )
    };
    _callSaveServiceMethod = (product) => {
        product.images = this.state.images;
        let _product=this.props.Product;
        this.setState({loading:true});
        if(_product){
            Meteor.call('updateProduct', _product._id,product, this.imagesToRemove,(err, res) => {
                this.setState({loading:false});
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
                    ToastAndroid.showWithGravityAndOffset(
                        "Updated Successfully!!",
                        ToastAndroid.LONG,
                        ToastAndroid.TOP,
                        0,
                        50,
                    );
                    // hack because react-native-meteor doesn't login right away after sign in
                    console.log('Reslut from addNewService' + res);
                    this.resetForm();
                    goBack(this.props.componentId);
                }
            });
        }
        else {
            Meteor.call('addNewProduct', product, (err, res) => {
                this.setState({loading:false});
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
                    ToastAndroid.showWithGravityAndOffset(
                        "Added Product Successfully!!",
                        ToastAndroid.LONG,
                        ToastAndroid.TOP,
                        0,
                        50,
                    );
                    // hack because react-native-meteor doesn't login right away after sign in
                    console.log('Reslut from addNewService' + res);
                   this.resetForm();
                    goToRoute(this.props.componentId, "MyProducts");
                }
            });
        }

    };

    resetForm(){
        this.setState({
            query: '',
            selectedService: null,
            title: '',
            homeDelivery: false,
            radius: 0,
            description: '',
            location: '',
            contact: '',
            price: null,
            discount: null,
            unit: null,
            webLink: '',
            colors: '',
            sizes: '',
            qty: '',
            images: [],
        });
    }
    _saveService = () => {
        const {title, description, radius, contact, homeDelivery, selectedService, images, price,discount, unit, location, webLink, colors, sizes, qty} = this.state;
        let product = {
            title: title,
            description: description,
            contact: contact,
            // location: this.state.location,
            radius: radius,
            //  coverImage: null,
            homeDelivery: homeDelivery,
            price: price,
            discount: discount,
            unit: unit,
            website: webLink,
            sizes: sizes ? (sizes.includes(';') ? sizes.split(';') : [sizes]) : [],
            colors: colors ? (colors.includes(';') ? colors.split(';') : [colors]) : [],
            qty: qty,
            images:images,
            service:selectedService._id,
            serviceOwner:selectedService.owner
        };
        if (title.length === 0 || contact.length === 0 || description.length === 0 || radius.length === 0 ||  !selectedService) {
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
            this._callSaveServiceMethod(product)
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

        const myServices = this.myServices;
        const regex = new RegExp(`${query.trim()}`, 'i');
        return myServices.filter(ser => ser.title.search(regex) >= 0);
    }
    _getListItem = (data, index) => {
        let item = data.item;
        return (
            <View key={index}>
                <View  style={[styles.containerStyle]}>
                    <Image style={{flex: 1, alignSelf: 'stretch', width: undefined, height: undefined,resizeMode:'cover'}}
                           source={{uri:item.uri}}/>
                    <Button onPress={()=>this.removeImage(item)} transparent style={{position:'absolute', top:-15,right:-5}}>
                        <FIcon name='x-circle' size={20} color={colors.danger}/>
                    </Button>
                </View>

            </View>

        )
    };
    render() {
        const {query, selectedService} = this.state;
        const myServices = this._findCategory(query);
        const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();

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
                            {/*<Icon name="md-more" style={{fontWeight:'500', fontSize: 35}}/>*/}
                        {/*</Button>*/}
                        <CogMenu componentId={this.props.componentId} />
                    </Left>

                    <Body>
                    <Text style={styles.screenHeader}>{this.props.Product? "Update Product":"Add Product"}</Text>
                    </Body>
                </Header>
                <Content>


                    <Fragment>
                        <SafeAreaView style={styles.sb85086c9} keyboardShouldPersistTaps='always'>
                            <View underlineColorAndroid='rgba(0,0,0,0)'
                                  style={{width:'100%',minHeight:40,  marginVertical: 5, justifyContent: `center`}}>
                                <Autocomplete
                                    autoCapitalize="none"
                                    style={styles.inputBoxAC}
                                    autoCorrect={false}
                                    data={myServices.length === 1 && comp(query, myServices[0].title)
                                        ? [] : myServices}
                                    defaultValue={query}
                                    hideResults={selectedService && selectedService.title === query}
                                    onChangeText={text => this.setState({query: text})}
                                    underlineColorAndroid='rgba(0,0,0,0)'
                                    placeholder="Enter Service Name (*)"
                                    placeholderTextColor={`rgba(0, 0, 0, 0.44)`}
                                    renderItem={ser => <View style={{maxHeight:200}}>
                                        <ScrollView style={{flexGrow: 0}}>
                                        <TouchableOpacity
                                        style={styles.autosuggestCont}
                                        onPress={() => (
                                            this.setState({
                                                query: ser.title,
                                                selectedService: ser
                                            })
                                        )}
                                    >
                                        <Text style={styles.autosuggesText}>{ser.title}</Text>
                                    </TouchableOpacity>
                                        </ScrollView></View>}
                                />
                            </View>

                            <TextInput placeholder='Title (*)'
                                       style={styles.inputBox}
                                       placeholderTextColor={`rgba(0, 0, 0, 0.44)`}
                                       underlineColorAndroid='rgba(0,0,0,0)'
                                       onSubmitEditing={() => this.title.focus()}
                                       onChangeText={(title) => this.setState({title})}
                                       value={this.state.title}
                            />
                            <Textarea rowSpan={3} placeholder="Description (*)"
                                      style={styles.inputTextarea}
                                      placeholderTextColor={`rgba(0, 0, 0, 0.44)`}
                                      underlineColorAndroid='red'
                                //onSubmitEditing={() => this.contactNumber.focus()}
                                      onChangeText={(description) => this.setState({description})}
                                      value={this.state.description}
                            />


                            <View style={styles.multiField}>
                                <TextInput underlineColorAndroid='rgba(0,0,0,0)'
                                           placeholderTextColor={`rgba(0, 0, 0, 0.44)`}
                                           style={styles.inputBoxMultiField}
                                           placeholder='Available Qty'
                                           keyboardType='phone-pad'
                                           onChangeText={(qty) => this.setState({qty})}
                                           value={this.state.qty}
                                />
                                <TextInput underlineColorAndroid='rgba(0,0,0,0)'
                                           placeholderTextColor={`rgba(0, 0, 0, 0.44)`}
                                           style={styles.inputBoxMultiField}
                                           placeholder='Unit'
                                           onChangeText={(unit) => this.setState({unit})}
                                           value={this.state.unit}
                                />

                            </View>
                            <View style={styles.multiField}>
                                <TextInput underlineColorAndroid='rgba(0,0,0,0)'
                                           placeholderTextColor={`rgba(0, 0, 0, 0.44)`}
                                           style={styles.inputBoxMultiField}
                                           placeholder='Price per Unit'
                                           keyboardType='phone-pad'
                                           onChangeText={(price) => this.setState({price})}
                                           value={this.state.price}
                                />
                                <TextInput underlineColorAndroid='rgba(0,0,0,0)'
                                           placeholderTextColor={`rgba(0, 0, 0, 0.44)`}
                                           style={styles.inputBoxMultiField}
                                           placeholder='Discount in %'
                                           keyboardType='phone-pad'
                                           onChangeText={(discount) => this.setState({discount})}
                                           value={this.state.discount}
                                />

                            </View>
                            <View style={styles.multiField}>
                                <TextInput underlineColorAndroid='rgba(0,0,0,0)'
                                           placeholderTextColor={`rgba(0, 0, 0, 0.44)`}
                                           style={styles.inputBoxMultiField}
                                           placeholder='Radius in K.M (*)'
                                           keyboardType='phone-pad'
                                           onChangeText={(radius) => this.setState({radius})}
                                           value={this.state.radius}
                                />
                                <View style={styles.chkView}><CheckBox style={{marginEnd:20}} checked={this.state.homeDelivery}
                                                                       onPress={this._updateHomeDelivery}/>
                                    <Text style={{color: `rgba(0, 0, 0, 0.44)`}}>{'Home Delivery'}</Text></View>
                            </View>
                            <Textarea rowSpan={2} placeholder="Colors seperated ;"
                                      style={styles.inputTextarea}
                                      placeholderTextColor={`rgba(0, 0, 0, 0.44)`}
                                      underlineColorAndroid='red'

                                      onChangeText={(colors) => this.setState({colors})}
                                      value={this.state.colors}
                            />
                            <Textarea rowSpan={2} placeholder="Sizes seperated by ;"
                                      style={styles.inputTextarea}
                                      placeholderTextColor={`rgba(0, 0, 0, 0.44)`}
                                      underlineColorAndroid='red'
                                      onChangeText={(sizes) => this.setState({sizes})}
                                      value={this.state.sizes}
                            />

                            <TextInput underlineColorAndroid='rgba(0,0,0,0)'
                                       placeholderTextColor={`rgba(0, 0, 0, 0.44)`}
                                       style={styles.inputBox}
                                       placeholder='Contact No (*)'
                                       keyboardType='phone-pad'
                                       onChangeText={(contact) => this.setState({contact})}
                                       value={this.state.contact}
                            />


                            <TextInput underlineColorAndroid='rgba(0,0,0,0)'
                                       placeholderTextColor={`rgba(0, 0, 0, 0.44)`}
                                       style={styles.inputBox}
                                       placeholder='Website'
                                       onChangeText={(webLink) => this.setState({webLink})}
                                       value={this.state.webLink}
                            />
                            <FlatList style={styles.mainContainer}
                                      data={this.state.images}
                                      renderItem={this._getListItem}
                                      keyExtracter={(item, index) =>index.toString()}
                                      horizontal={false}
                                      numColumns={2}
                            />
                            <Button
                                style={styles.button}
                                onPress={()=>this.ActionSheet.show()}>
                                <Icon name={'ios-add'} color={'white'}/>
                                <Text style={styles.buttonText}>Upload Image </Text>
                            </Button>


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
                    <ActionSheet
                        ref={o => this.ActionSheet = o}
                        title={'Please select the option'}
                        options={[<Text style={{color: colors.appLayout}}>Take Picture from Camera</Text>,
                            <Text style={{color: colors.appLayout}}>Pick Image from Gallery</Text>, 'Cancel']}
                        cancelButtonIndex={2}
                        destructiveButtonIndex={2}
                        onPress={(index) => {
                            this._handleImageUpload(index)
                        }}
                    />
                </Content>
                <Footer style={{backgroundColor:colors.appBackground, alignItems:'center'}}>
                    {/*<View style={styles.buttonView}>*/}
                        <Button
                            style={styles.button}
                            onPress={this._saveService}>
                            <Text style={styles.buttonText}> {this.props.Product?"Update":"Save"} </Text>
                        </Button>
                    {/*</View>*/}
                </Footer>
                {this.state.loading?
                    <Loading/>:null}
            </Container>

        );
    }
}

AddProduct.defaultProps = {};
const GooglePlaceSerachStyle={
    textInputContainer: {
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0)',
        borderTopWidth: 0,
        borderBottomWidth: 0,
        padding:0
    },
    //container:{
    //padding:0,
    //borderRadius: 25,
    //},
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
        height:40,
        margin:0 ,
        marginTop:0,
        marginLeft:0,
        marginRight:0,
        paddingTop:0,
        paddingBottom:0
    },

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
        height:50,
        maxHeight: 100
    },
    autosuggestionView: {
        maxHeight: 100,
        backgroundColor: `rgba(243, 247, 255, 1)`,
        fontSize: 16,
        padding: 10,
        //paddingLeft: 0,
        width: '100%',
        backgroundColor: '#ececec',flexGrow:1
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
        borderBottomWidth:0,
        margin:0,
        height:60
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
        height:50
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
    mainContainer: {
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'wrap',

    },
    containerStyle: {
        flex: 1,
        padding: 1,
        borderWidth: 0,
        marginVertical: 8,
        borderColor: '#808080',
        elevation: 10,
        marginHorizontal: 5,
        width: (viewportWidth / 2) - 10,
        height: 100,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },

});
export {styles};
export default Meteor.createContainer(() => {
    return {
        categories: Meteor.collection('categories').find(),
        myServices: Meteor.collection('service').find()
    }
}, AddProduct);
