import React, {Fragment} from 'react';
import {
  View,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  Image,
  Modal,
  StatusBar,
  TextInput,
  SafeAreaView,
  ScrollView,
  BackHandler,
  FlatList,
} from 'react-native';
import Autocomplete from 'native-base-autocomplete';
import {colors, customStyle} from '../../config/styles';
import {
  Container,
  Content,
  Text,
  Item,
  Icon,
  ListItem,
  Textarea,
  CheckBox,
  Button,
  Picker,
  Header,
  Left,
  Body,
  Label,
  Footer,
  Input as NBInput
} from 'native-base';
import ActionSheet from 'react-native-actionsheet';
import Meteor from '../../react-native-meteor';
import FIcon from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-crop-picker';
import LocationPicker from '../../components/LocationPicker';
import {
  backToRoot,
  goToRoute,
  navigateToRoutefromSideMenu,
  goBack,
} from '../../Navigation';
import CogMenu from '../../components/CogMenu';
import {Navigation} from 'react-native-navigation/lib/dist/index';
import settings, {BusinessType} from '../../config/settings';
import ImageResizer from 'react-native-image-resizer';
import AsyncStorage from '@react-native-community/async-storage';
import Loading from '../../components/Loading';
import _ from 'lodash';
import {
  GalioProvider,
  Input,
  Button as GButton,
  Radio,
  Text as GText,
} from 'galio-framework';
import {customGalioTheme} from '../../config/themes';

const RNFS = require('react-native-fs');

const styles = StyleSheet.create({
  screenHeader: {
    fontSize: 20,
    fontFamily: `Source Sans Pro`,
    color: '#ffffff',
  },

  s1f0fdd20: {
    color: `rgba(0, 0, 0, 1)`,
    fontFamily: `Source Sans Pro`,
    fontSize: 36,
  },
  sfe09f185: {
    color: `rgba(87, 150, 252, 1)`,
    fontSize: 60,
  },
  imageView: {
    backgroundColor: customGalioTheme.COLORS.WHITE,
    alignItems: `center`,
    borderColor: customGalioTheme.COLORS.PLACEHOLDER,
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
    opacity: 0.5,
  },
  sdbde75cb: {
    backgroundColor: `rgba(87, 150, 252, 1)`,
    height: 1,
    marginBottom: 13,
    marginTop: 13,
    width: `100%`,
  },
  sb47a0426: {
    color: `rgba(51, 51, 51, 1)`,
    fontFamily: `Source Sans Pro`,
    fontSize: 16,
    opacity: 0.5,
    lineHeight: 2,
  },
  s5e284020: {
    color: `rgba(87, 150, 252, 1)`,
    fontFamily: `Helvetica`,
    fontSize: 9,
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
    width: 36,
  },
  s57ff64ea: {
    flexDirection: `row`,
    width: 230,
  },
  s906d750e: {
    backgroundColor: `rgba(87, 150, 252, 1)`,
    height: 1,
    marginBottom: 13,
    marginTop: 13,
    width: `100%`,
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
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'white',
    borderRadius: customGalioTheme.SIZES.INPUT_BORDER_RADIUS,
    borderWidth: customGalioTheme.SIZES.INPUT_BORDER_WIDTH,
    borderColor: customGalioTheme.COLORS.PLACEHOLDER,
    paddingHorizontal: 16,
    fontSize: customGalioTheme.SIZES.INPUT_TEXT,
    color: customGalioTheme.COLORS.INPUT_TEXT,
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
    maxHeight: 100,
  },
  autosuggestionView: {
    maxHeight: 100,
    backgroundColor: `rgba(243, 247, 255, 1)`,
    fontSize: 16,
    padding: 10,
    //paddingLeft: 0,
    width: '100%',
    backgroundColor: '#ececec',
    flexGrow: 1,
  },
  s50325ddf: {
    backgroundColor: `rgba(0, 0, 0, 0.11)`,
    height: 1,
    marginBottom: 2,
    marginTop: 2,
    width: `100%`,
  },
  itemText: {
    color: 'rgba(51, 51, 51, 1)',
    fontFamily: 'Source Sans Pro',
    fontSize: 16,
    opacity: 0.5,
  },
  form: {
    // flex: 1.5
  },
  formContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    flex: 1,
    // width: '100%',
  },
  sbf9e8383: {
    flex: 1,
    opacity: 1,
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
    textAlign: 'center',
  },
  titleText: {
    fontWeight: '500',
    marginBottom: 5,
    marginTop: 5,
    textAlign: 'center',
    color: `rgba(51, 51, 51, 1)`,
    fontFamily: `Source Sans Pro`,
    fontSize: 16,
    opacity: 0.5,
  },
  directorText: {
    color: 'grey',
    fontSize: 12,
    marginBottom: 10,
    textAlign: 'center',
  },
  openingText: {
    textAlign: 'center',
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
    height: 60,
  },
  description: {
    fontWeight: 'bold',
  },
  predefinedPlacesDescription: {
    //color: '#1faadb'
  },
  textInput: {
    //backgroundColor: `rgba(243, 247, 255, 1)`,
    borderRadius: 5,
    color: 'rgba(0, 0, 0, 1)',
    fontFamily: 'Source Sans Pro',
    fontSize: 18,
    // padding: 10,
    paddingLeft: 40,
    width: '100%',
    marginBottom: 4,
    marginTop: 4,
    height: 50,
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
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
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '45%',
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
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.whiteText,
    textAlign: 'center',
  },
});

class AddService extends React.PureComponent {
  constructor(props) {
    super(props);
    this.mounted = false;
    this.state = {
      query: '',
      selectedCategory: {subCategory: ''},
      title: '',
      homeDelivery: false,
      radius: "0",
      description: '',
      location: null,
      contact: '',
      avatarSource: null,
      selected: 'Keynull',
      modalVisible: false,
      Image: null,
      price: null,
      unit: null,
      webLink: '',
      pickLocation: false,
      loading: false,
      categoryModal: '',
      type: 0,
      businessType: 101,
    };
    this.categories = [];
    this._debouncedFindCategory = _.debounce(this._findCategory, 100);
  }

  async componentDidMount() {
    let MainCategories = await AsyncStorage.getItem('Categories');
    if (MainCategories) {
      MainCategories = JSON.parse(MainCategories);
    } else {
      MainCategories = Meteor.collection('MainCategories').find();
    }
    MainCategories.forEach(item => {
      this.categories = this.categories.concat(item.subCategories);
    });
    this.setState({categories: this.categories});
    Navigation.events().bindComponent(this);
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButton.bind(this),
    );
    this.fillEditForm();
  }

  fillEditForm = () => {
    let _serviceToEdit = this.props.Service;
    //  console.log(_serviceToEdit,this.categories)
    if (_serviceToEdit) {
      let selectedCategory = this.categories.find(item => {
        return item.subCatId == _serviceToEdit.categoryId;
      });
      this.setState({
        query: selectedCategory.subCategory,
        selectedCategory: selectedCategory,
        title: _serviceToEdit.title,
        homeDelivery: _serviceToEdit.homeDelivery,
        radius: _serviceToEdit.radius.toString(),
        description: _serviceToEdit.description,
        location: _serviceToEdit.location,
        contact: _serviceToEdit.contact,
        price: _serviceToEdit.price,
        unit: _serviceToEdit.unit,
        webLink: _serviceToEdit.website,
        avatarSource: {uri: settings.IMAGE_URL + _serviceToEdit.coverImage},
        businessType:_serviceToEdit.businessType,
      });
    }
  };

  handleBackButton() {
    // navigateToRoutefromSideMenu(this.props.componentId,'Dashboard');
    backToRoot(this.props.componentId);
    return true;
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress');
  }

  _handleImageUpload = selected => {
    this.setModalVisible(false);
    if (selected === 0) {
      ImagePicker.openCamera({
        width: 1440,
        height: 720,
        cropping: true,
        includeBase64: true,
        compressImageMaxWidth: 1440,
        compressImageMaxHeight: 720,
        compressImageQuality: 0.8,
      }).then(image => {
        console.log(image);
        this._onImageChange(image);
      });
    } else if (selected === 1) {
      ImagePicker.openPicker({
        width: 1440,
        height: 720,
        cropping: true,
        includeBase64: true,
        compressImageMaxWidth: 1440,
        compressImageMaxHeight: 720,
        compressImageQuality: 0.8,
      }).then(image => {
        console.log(image);
        this._onImageChange(image);
      });
    }
  };
  _onImageChange = image => {
    const compressFormat = 'JPEG';
    const newWidth = image.width > 1440 ? 1440 : image.width;
    const newHeight = image.height > 2960 ? 2960 : image.width;
    console.log(image);
    // ImageResizer.createResizedImage(image.path, newWidth, newHeight, compressFormat, 80).then((response) => {
    //     response.mime="image/jpeg";
    //     console.log(response);
    //     this.setState({
    //         // avatarSource: {uri: `data:${image.mime};base64,${image.data}`},
    //           avatarSource:{ uri:  response.uri },
    //     });
    //     RNFS.readFile(response.uri, "base64").then(data => {
    //         // binary data
    //         console.log(data);
    //         response.data=data;
    //         this.setState({Image:response});
    //     });
    // }).catch(e=>{
    //   console.log(e)
    // });
    //
    // ImagePicker.clean().then(() => {
    //     console.log('removed all tmp images from tmp directory');
    // }).catch(e => {
    //     alert(e);
    // });

    this.setState({
      avatarSource: {uri: `data:${image.mime};base64,${image.data}`},
      // avatarSource:{ uri:  response.uri },
      Image: image,
    });
  };
  _updateHomeDelivery = () => {
    let current = this.state.homeDelivery;
    this.setState({homeDelivery: current === false ? true : false});
  };
  _callSaveServiceMethod = service => {
    service.Image = this.state.Image;
    let _service = this.props.Service;
    if (_service) {
      service.coverImage = _service.coverImage;
      this.setState({loading: true});
      Meteor.call('updateService', _service._id, service, (err, res) => {
        this.setState({loading: false});
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
            'Service Updated Successfully!!',
            ToastAndroid.LONG,
            ToastAndroid.TOP,
            0,
            50,
          );
          // hack because react-native-meteor doesn't login right away after sign in
          console.log('Reslut from addNewService' + res);
          this.setState({
            query: '',
            selectedCategory: {subCategory: ''},
            title: '',
            homeDelivery: false,
            radius: "0",
            description: '',
            location: '',
            contact: '',
            price: null,
            unit: null,
            webLink: '',
            businessType:101,
          });
          //  navigateToRoutefromSideMenu(this.props.componentId, 'MyServices');
          //Store own Services
          Meteor.call('geOwnServiceList', (err, res) => {
            if (!err) {
              AsyncStorage.setItem('myServices', res);
            }
          });
          goBack(this.props.componentId);
        }
      });
    } else {
      service.owner = Meteor.userId();
      this.setState({loading: true});
      Meteor.call('addNewService', service, (err, res) => {
        this.setState({loading: false});
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
            selectedCategory: {subCategory: ''},
            title: '',
            homeDelivery: false,
            radius: "0",
            description: '',
            location: '',
            contact: '',
            price: null,
            unit: null,
            webLink: '',
          });
          navigateToRoutefromSideMenu(this.props.componentId, 'MyServices');
        }
      });
    }
  };
  _saveService = () => {
    const {
      title,
      description,
      radius,
      contact,
      homeDelivery,
      selectedCategory,
      query,
      price,
      unit,
      location,
      webLink,
      businessType
    } = this.state;
    let service = {
      title: title,
      description: description,
      contact: contact,
      location: location,
      radius: parseInt(radius),
      coverImage: null,
      homeDelivery: homeDelivery,
      price: price,
      unit: unit,
      website: webLink,
      businessType:businessType,
    };
    if (
      title.length === 0 ||
      contact.length === 0 ||
      description.length === 0 ||
      radius.length === 0 ||
      !location
    ) {
      ToastAndroid.showWithGravityAndOffset(
        'Please Enter all the fields with *.',
        ToastAndroid.LONG,
        ToastAndroid.TOP,
        0,
        50,
      );
      //valid = false;
    } else {
      if (selectedCategory === null && query.length > 3) {
        // Meteor.call('addCategory', this.state.query, (err, res) => {
        //     if (err) {
        //         console.log(err)
        //     }
        //     else {
        service.Category = {subCatId: null, subCategory: query};
        this._callSaveServiceMethod(service);
        //     }
        // })
      } else if (selectedCategory) {
        service.Category = selectedCategory;
        this._callSaveServiceMethod(service);
      } else {
        ToastAndroid.showWithGravityAndOffset(
          'Please Enter Category Name with length greater than 3',
          ToastAndroid.LONG,
          ToastAndroid.TOP,
          0,
          50,
        );
      }
    }
  };
  handleLocation = (data, Detail) => {
    console.log(data, 'Detail :' + Detail);
    this.setState({
      location: data,
    });
  };

  handleOnLocationSelect(location) {
    console.log(location);
    this.setState({location: location, pickLocation: false});
  }

  closePickLocation() {
    console.log('method Called');
    this.setState({pickLocation: false});
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  _findCategory(query) {
    if (query === '') {
      this.setState({categories: this.categories});
    }

    let categories = this.categories;
    const regex = new RegExp(`${query.trim()}`, 'i');
    categories = categories.filter(
      category => category.subCategory.search(regex) >= 0,
    );
    this.setState({categories});
  }

  typeChanged = type => {
    this.setState({type});
  };
  businessTypeChange = businessType => {
    this.setState({businessType});
  };
  render() {
    const {query, selectedCategory, location} = this.state;
    // const categories = this._findCategory(query);
    // const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
    return (
        <Container style={styles.container}>
          <Header
            androidStatusBarColor={colors.StatusBar}
            style={{backgroundColor: '#094c6b'}}>
            <Left>
              {/*<Button transparent onPress={() => {*/}
              {/*this.props.navigation.openDrawer()*/}
              {/*}}>*/}
              {/*<Icon name="md-more" style={{fontWeight: '500', fontSize: 35}}/>*/}
              {/*</Button>*/}
              <CogMenu componentId={this.props.componentId} />
            </Left>

            <Body>
              <Text style={styles.screenHeader}>
                {this.props.Service ? 'Update service' : 'New Service'}
              </Text>
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
           <GalioProvider theme={customGalioTheme}>
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
              <SafeAreaView
                style={styles.formContainer}
                keyboardShouldPersistTaps="always">
                {/*<Item style={styles.sbc83915f}>*/}
                <View style={styles.sbc83915f}>
                  {/*<Text style={styles.s1f0fdd20}>{`Add Service`}</Text>*/}
                  <TouchableOpacity
                    style={styles.imageView}
                    onPress={() => {
                      this.ActionSheet.show();
                    }}>
                    {this.state.avatarSource !== null ? (
                      <Image
                        style={{
                          width: '100%',
                          height: 150,
                          borderRadius: 10,
                          borderWidth: 3,
                          height: 150,
                          justifyContent: `center`,
                          borderColor: customGalioTheme.COLORS.PLACEHOLDER,
                        }}
                        source={this.state.avatarSource}
                      />
                    ) : (
                      <Icon style={styles.sfe09f185} name="camera" />
                    )}
                  </TouchableOpacity>
                </View>
                {/*<View underlineColorAndroid='rgba(0,0,0,0)'*/}
                {/*style={{width: '100%', minHeight: 40, marginVertical: 5, justifyContent: `center`}}>*/}
                {/*<Autocomplete*/}
                {/*autoCapitalize="none"*/}
                {/*style={styles.inputBoxAC}*/}
                {/*autoCorrect={false}*/}
                {/*data={categories.length === 1 && comp(query, categories[0].subCategory)*/}
                {/*? [] : categories}*/}
                {/*defaultValue={query}*/}
                {/*hideResults={selectedCategory && selectedCategory.subCategory === query}*/}
                {/*onChangeText={text => this.setState({query: text})}*/}
                {/*underlineColorAndroid='rgba(0,0,0,0)'*/}
                {/*placeholder="Enter Category's name (*)"*/}
                {/*placeholderTextColor={`rgba(0, 0, 0, 0.44)`}*/}
                {/*renderItem={cat => <View style={{maxHeight: 200}}><ScrollView style={{flexGrow: 0}}><TouchableOpacity*/}
                {/*style={styles.autosuggestCont}*/}
                {/*onPress={() => (*/}
                {/*console.log(cat),*/}
                {/*this.setState({*/}
                {/*query: cat.subCategory,*/}
                {/*selectedCategory: cat*/}
                {/*})*/}
                {/*)}*/}
                {/*>*/}
                {/*<Text style={styles.autosuggesText}>{cat.subCategory}</Text>*/}
                {/*</TouchableOpacity></ScrollView></View>}*/}
                {/*/>*/}
                {/*</View>*/}

                <Input
                  color={customGalioTheme.COLORS.INPUT_TEXT}
                  placeholder="Category (*)"
                  onSubmitEditing={() => this.title.focus()}
                  onKeyPress={() => this.setState({categoryModal: true})}
                  onKeyFocus={() => this.setState({categoryModal: true})}
                  value={this.state.selectedCategory.subCategory}
                />
 <View
                  style={{
                    width: '100%',
                    backgroundColor: customGalioTheme.COLORS.WHITE,
                    borderRadius: customGalioTheme.SIZES.INPUT_BORDER_RADIUS,
                    borderWidth: customGalioTheme.SIZES.INPUT_BORDER_WIDTH,
                    borderColor: customGalioTheme.COLORS.PLACEHOLDER,
                  }}>
                  <Picker
                    mode="dropdown"
                    iosIcon={<Icon name="arrow-down" />}
                    placeholder="Select Service Type"
                    placeholderStyle={{
                      color: customGalioTheme.COLORS.PLACEHOLDER,
                    }}
                    placeholderIconColor={customGalioTheme.COLORS.PLACEHOLDER}
                    style={{width: '100%'}}
                    selectedValue={this.state.businessType}
                    onValueChange={this.businessTypeChange}>
                    {/*          {for (let [key, value] of Object.entries(BusinessType)) {
  (<Picker.Item label={key} value={value} />)
}}*/}
                    <Picker.Item
                      label="Service Provider"
                      value={BusinessType.SERVICE_PROVIDER}
                    />
                    <Picker.Item
                      label="Products/Goods Seller"
                      value={BusinessType.PRODUCTS_GOODS_SELLER}
                    />
                    <Picker.Item
                      label="Resturant"
                      value={BusinessType.RESTURANT}
                    />
                  </Picker>
                </View>
                <Input
                  color={customGalioTheme.COLORS.INPUT_TEXT}
                  placeholder="Title (*)"
                  onSubmitEditing={() => this.title.focus()}
                  onChangeText={title => this.setState({title})}
                  value={this.state.title}
                />
                <Textarea
                  rowSpan={3}
                  placeholder="Description (*)"
                  style={styles.inputTextarea}
                  placeholderTextColor={customGalioTheme.COLORS.PLACEHOLDER}
                  //onSubmitEditing={() => this.contactNumber.focus()}
                  onChangeText={description => this.setState({description})}
                  value={this.state.description}
                />
                {/*<Input disabled*/}
                {/*style={styles.inputText}*/}
                {/*placeholderTextColor={`rgba(0, 0, 0, 0.44)`}*/}
                {/*underlineColorAndroid='rgba(0,0,0,0)'*/}
                {/*placeholder='Location'*/}
                {/*keyboardType='phone-pad'*/}
                {/*onChangeText={(location) => this.setState({location})}*/}
                {/*/>*/}

                {/*<GooglePlaceSearchBox*/}
                {/*onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true*/}
                {/*console.log(data, details);*/}
                {/*this.handleLocation(details)*/}
                {/*}}*/}
                {/*placeholder={'Enter Address'}*/}
                {/*placeholderTextColor={`rgba(0, 0, 0, 0.44)`}*/}
                {/*underlineColorAndroid='rgba(0,0,0,0)'*/}
                {/*styles={GooglePlaceSerachStyle}*/}
                {/*/>*/}

                <Input
                  color={customGalioTheme.COLORS.INPUT_TEXT}
                  //   onBlur={()=>this.setState({pickLocation:true})}
                  onFocus={() => this.setState({pickLocation: true})}
                  placeholder="Location"
                  value={location ? location.formatted_address : ""}
                  //   onChangeText={(radius) => this.setState({radius})}
                />

                <Input
                  color={customGalioTheme.COLORS.INPUT_TEXT}
                  placeholder="Radius for Service Area in KiloMeter (*)"
                  keyboardType="phone-pad"
                  onChangeText={radius => this.setState({radius})}
                  value={this.state.radius}
                />
             {/*}   <Label>Business Type: </Label>
                <View
                  style={{
                    flexDirection: 'row',
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    width: '100%',
                    marginVertical: 20,
                    height: 40,
                    backgroundColor: customGalioTheme.COLORS.WHITE,
                    borderRadius: customGalioTheme.SIZES.INPUT_BORDER_RADIUS,
                    borderWidth: customGalioTheme.SIZES.INPUT_BORDER_WIDTH,
                    borderColor: customGalioTheme.COLORS.PLACEHOLDER,
                  }}>
                  <Radio
                    label="Service Provider"
                    onChange={() => this.typeChanged(0)}
                    initialValue={this.state.type == 0}
                  />
                  <Radio
                    label="Products Seller"
                    onChange={() => this.typeChanged(1)}
                    initialValue={this.state.type == 1}
                  />
                </View> */}
               

                {/*   <View style={styles.multiField}>
                <View style={{flex:1,marginRight:5}} >
                  <Input
                    color={customGalioTheme.COLORS.INPUT_TEXT}
                    placeholder="Unit"
                    onChangeText={unit => this.setState({unit})}
                    value={this.state.unit}
                  />
                  </View>
                   <View style={{flex:1,marginLeft:5}}>
                  <Input
                    color={customGalioTheme.COLORS.INPUT_TEXT}     
                    placeholder="Price per Unit"
                    keyboardType="phone-pad"
                    onChangeText={price => this.setState({price})}
                    value={this.state.price}
                  />
                  </View>
                </View> 

                <View style={styles.multiField}>
                <View style={{flex:1,marginRight:5}} > */}
                <Input
                  color={customGalioTheme.COLORS.INPUT_TEXT}
                  // style={{width:'90%'}}
                  placeholder="Contact No (*)"
                  keyboardType="phone-pad"
                  onChangeText={contact => this.setState({contact})}
                  value={this.state.contact}
                />
                {/* </View>
                 <View style={styles.chkView}>
                    <CheckBox
                      style={{marginEnd: 20}}
                      checked={this.state.homeDelivery}
                      onPress={this._updateHomeDelivery}
                    />
                    <Text style={{color: `rgba(0, 0, 0, 0.44)`}}>
                      {'Home Delivery'}
                    </Text>
                  </View>
                </View>*/}

                <Input
                  color={customGalioTheme.COLORS.INPUT_TEXT}
                  placeholder="Website"
                  onChangeText={webLink => this.setState({webLink})}
                  value={this.state.webLink}
                />
                {/*} <View style={styles.buttonView}>
                  <Button style={styles.button} onPress={this._saveService}>
                    <Text style={styles.buttonText}>
                      {this.props.Service ? 'Update' : 'Save'}{' '}
                    </Text>
                  </Button>
                </View>
                <GButton
                  onPress={this._saveService}
                  style={{width: '100%', marginVertical: 20}}
                  loading={this.state.loading}
                  disabled={this.state.loading}>
                  {this.props.Service ? 'Update' : 'Save'}
                </GButton>*/}
              </SafeAreaView>
            </Fragment>
            <ActionSheet
              ref={o => (this.ActionSheet = o)}
              title={'Please select the option'}
              options={[
                <Text style={{color: colors.appLayout}}>
                  Take Picture from Camera
                </Text>,
                <Text style={{color: colors.appLayout}}>
                  Pick Image from Gallery
                </Text>,
                'Cancel',
              ]}
              cancelButtonIndex={2}
              destructiveButtonIndex={2}
              onPress={index => {
                this._handleImageUpload(index);
              }}
            />
          </Content>
         
          <LocationPicker
            close={this.closePickLocation.bind(this)}
            onLocationSelect={this.handleOnLocationSelect.bind(this)}
            modalVisible={this.state.pickLocation}
          />

        
           <Footer style={{backgroundColor: colors.appBackground, alignItems: 'center',paddingHorizontal:10,height:50}}>
               <GButton
                  onPress={this._saveService}
                  style={{width: '100%', marginVertical: 20}}
                  loading={this.state.loading}
                  disabled={this.state.loading}>
                  {this.props.Service ? 'Update' : 'Save'}
                </GButton>

          </Footer>
            </GalioProvider>
              {/* SELCT CATEGORY MODAL START */}
          <Modal
            style={customStyle.modal}
            // transparent={true}
            visible={this.state.categoryModal}
            onRequestClose={() => {
              this.setState({categoryModal: false});
            }}>
            <Header
              androidStatusBarColor={colors.statusBar}
              style={{backgroundColor: colors.appLayout}}>
              <Left style={{flex: 1}}>
                <Button
                  transparent
                  style={{paddingHorizontal: 10}}
                  onPress={() => {
                    this.setState({categoryModal: false});
                  }}>
                  <FIcon name="arrow-left" size={20} color={'white'} />
                </Button>
              </Left>
              <Body style={{flex: 7,width:'100%',}}>
                <Item 
                  rounded
                  searchBar
                  boadered
                  style={{
                    width:'100%',
                    backgroundColor: 'white',
                    height: 40,
                  }}>
                  <NBInput
                  style={{width:'100%',}}
                    value={this.state.query}
                    placeholder="Search.."
                    onChangeText={text => {
                      this._debouncedFindCategory(text),
                        this.setState({query: text});
                    }}
                  />
                  {this.state.query ? (
                    <Button
                      style={{paddingHorizontal: 10}}
                      onPress={() => {
                        this.setState({query: ''});
                      }}
                      transparent>
                      <FIcon name="x" size={20} />
                    </Button>
                  ) : null}
                </Item>
              </Body>
            </Header>
            <Content padder>
              <FlatList
                data={this.state.categories}
                _keyExtractor={(item, index) => index.toString()}
                keyboardShouldPersistTaps="always"
                renderItem={({item, index}) => (
                  <ListItem
                    onPress={() => {
                      this.setState({
                        selectedCategory: item,
                        categoryModal: false,
                      });
                    }}>
                    <Text>{item.subCategory}</Text>
                  </ListItem>
                )}
              />
            </Content>
          </Modal>
          {/* SELCT CATEGORY MODAL STOP */}
        </Container>
     
    );
  }
}

AddService.defaultProps = {};

export {styles};
export default Meteor.createContainer(() => {
  Meteor.subscribe('categories');
  return {
    categories: Meteor.collection('categories').find(),
  };
}, AddService);