import React, {Component} from 'react';
import _ from 'lodash';
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Content,
  ListItem,
  Thumbnail,
  Button,
  Text,
  Item,
  Input,
} from 'native-base';

import {
  StyleSheet,
  BackHandler,
  StatusBar,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  FlatList,
  View,
  ToastAndroid,
} from 'react-native';

import Icon from 'react-native-vector-icons/Feather';
import Meteor from '../../react-native-meteor';
import settings from '../../config/settings';
import {colors} from '../../config/styles';
import MyFunctions from '../../lib/MyFunctions';
import StarRating from '../../components/StarRating/StarRating';
import {Navigation} from 'react-native-navigation/lib/dist/index';
import {
  backToRoot,
  goBack,
  goToRoute,
  navigateToRoutefromSideMenu,
} from '../../Navigation';
import ServiceDetail from '../ServiceDetail';
import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';
import AsyncStorage from '@react-native-community/async-storage';
import ServiceItem from  "../../components/Service/ServiceItem";
import {CogMenu} from "../../components/CogMenu/CogMenu";


class MyServices extends Component {
  
  _handlItemPress = service => {
    service.avgRate = this.averageRating(service.ratings);
    this.props.navigation.navigate( 'ServiceDetail', {Id: service});
  };

  _fetchMarkers = () => {
    let markers = [];
    this.state.data.map(item => {
      if (item.location.hasOwnProperty('geometry') && item.location.geometry) {
        let latlang = item.location.geometry.location;
        // console.log('item:' + latlang)
        markers.push({
          _id: item._id,
          latlng: {
            latitude: latlang.lat,
            longitude: latlang.lng,
          },
          coordinate: latlang,
          title: item.title,
          description: item.description,
        });
      } else {
        console.log(item);
      }
    });
    // this.setState({
    //     markers
    // })
    // console.log('state.markers:' + this.state.markers)
    return markers;
  };
  _onEndReached = distance => {
    console.log(distance);
    if (!this.currentSearch) {
      this.limit = this.limit + 20;
      this.setState({loading: true});
      // Meteor.subscribe('nearByService', {
      //     limit: this.limit,
      //     coords: [this.region.longitude, this.region.latitude],
      //     subCatIds: this.props.Id
      // }, () => {
      //     this.setState({loading: false})
      // });
    }
  };
  averageRating = arr => {
    let sum = 0;
    arr.forEach(item => {
      sum = sum + item.count;
    });
    var avg = sum / arr.length;
    return Math.round(avg);
  };
  _search = text => {
    console.log('search');
    var delayTimer;
    if (text === this.currentSearch) return;
    if (text === '') {
      this.setState({
        loading: true,
      });
      var data = this.arrayholder;
      this.setState({
        data: data,
        loading: false,
      });
      // this.arrayholder = data;
      // return;
    }
    if (text.length > 3) {
      this.setState({
        loading: true,
      });
      clearTimeout(delayTimer);
      // delayTimer = setTimeout(function() {
      this.currentSearch = text;
      // var dataToSend = {
      //     subCatIds: this.props.Id'),
      //     searchValue: text,
      //     coords: [this.region.longitude, this.region.latitude]
      // };
      // console.log('fetch')
      // return fetch(settings.API_URL + 'search', {
      //     method: "POST",//Request Type
      //     body: JSON.stringify(dataToSend),//post body
      //     headers: {//Header Defination
      //         'Content-Type': 'application/json'
      //     }
      // })
      //     .then(response => response.json())
      //     .then(responseJson => {
      //         console.log(responseJson);
      //         this.setState(
      //             {
      //                 loading: false,
      //                 data: responseJson.data,
      //             }
      //         );
      //         this.arrayholder = responseJson.data
      //     })
      //     .catch(error => {
      //         console.error(error);
      //     });
      // },2000);

      var dataToSend = this.arrayholder.filter(item => {
        return item.title.includes(text) || item.description.includes(text);
      });
      this.setState({
        data: dataToSend,
        loading: false,
      });
    }

    // const textData = text.trim().toUpperCase();
    // this.setState({loading: true});
    // // if (textData === this.currentSearch) {
    // //     // abort search if query wasn't different
    // //     return;
    // // }
    // if (textData === "") {
    //     this.setState({
    //         data: this.arrayholder, loading: false
    //     });
    //     return;
    // }
    //
    // this.currentSearch = textData;
    // const newData = this.arrayholder.filter(item => {
    //     const itemData =
    //         `${item.title.toUpperCase()} ${item.description.toUpperCase()}`;
    //     return itemData.indexOf(textData) > -1;
    // });
    // this.setState({data: newData, loading: false});
  };

  constructor(props) {
    super(props);
    this.mounted = false;
    this.state = {
      selectedTab: 'home',
      markers: [],
      currentSearch: '',
      loading: true,
      data: [],
      error: null,
      searchText: '',
      selected: 'all',
      active: false,
    };
    this.arrayholder = [];
    this.currentSearch = '';
    this.region = {
      latitude: 27.71202,
      longitude: 85.31295,
    };
    this.limit = 20;
    this.watchID;
    this.granted = false;
    this.isDisplaying = false;
  }

  async componentDidMount() {
    
    this.fetchData();
    // this.setState({
    //     data: this.props.myServices, loading: false
    // })
    // this.arrayholder = this.props.myServices;
  }

  handleBackButtonMyService() {
    console.log('handlebackpress from My Services..');
    this.props.navigation.navigate('Home');
    return true;
  }


  componentDidAppear() {
    this.isDisplaying = true;
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonMyService.bind(this),
    );
    this.fetchData();
  }

  componentDidDisappear() {
    this.isDisplaying = false;
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonMyService.bind(this),
    );
  }

  closeDrawer() {
    this.drawer._root.close();
  }

  openDrawer() {
    this.drawer._root.open();
  }

  fetchData = () => {
    Meteor.call('getMyServices', (err, res) => {
      console.log(err, res);
      if (!err) {
        if (res.result.length > 0) {
          //   this.skip = this.skip + this.limit;
          // this.arrayholder = this.arrayholder.concat(res.result);
          this.setState({data: res.result});
          this.arrayholder = res.result;
        }
        this.setState({loading: false});
      }
    });
  };

 
  _getListItem = data => {
    let rowData = data.item;
    return (

      <ServiceItem service={rowData} componentId={this.props.componentId} />
    );
  };

  renderSelectedTab() {
    const home = (
      <FlatList
        style={styles.contentList}
        data={this.state.data}
        renderItem={this._getListItem}
        initialNumToRender={15}
        //  onEndReached={(distance) => this._onEndReached(distance)}
        onEndReachedThreshold={0.1}
        ListFooterComponent={
          this.state.loading ? <ActivityIndicator style={{height: 80}} /> : null
        }
        keyExtractor={(item, index) => index.toString()}
      />
    );
    return home;
    // switch (this.state.selectedTab) {
    //     case 'home':
    //         return home;
    //         break;
    //     case 'map':
    //         return (<Map
    //             markers={this._fetchMarkers()}/>);
    //         break;
    //     default:
    // }
  }

  onValueChange(value) {
    this.setState({
      selected: value,
    });
    switch (value) {
      case 'all':
        this.setState({
          data: this.props.categories,
        });
        this.arrayholder = this.props.categories;
        // this._search(this.state.currentSearch);
        break;

      case 'starred':
        const newDat = this.arrayholder;
        let latest = newDat.sort((a, b) => {
          return this.averageRating(b.ratings) - this.averageRating(a.ratings);
        });
        this.setState({
          data: [],
        });
        this.setState({
          data: latest,
        });
        // this.arrayholder = latest;
        //  this._search(this.state.currentSearch);
        break;

      case 'myLocation':
        const newData = this.arrayholder.filter(item => {
          if (item.location.hasOwnProperty('geometry')) {
            return MyFunctions.isWithinRange(
              item.location.geometry.location.lat,
              item.location.geometry.location.lng,
              this.region.latitude,
              this.region.longitude,
              item.radius,
            );
          } else {
            return false;
          }
        });
        this.setState({data: newData});
        this.arrayholder = newData;
        //   this._search(this.state.currentSearch)
        break;
      default:
    }
  }

  render() {
    return (
      <Container style={{backgroundColor: colors.appBackground}}>
        <Header rounded searchBar
          androidStatusBarColor={colors.statusBar}
          style={{backgroundColor: '#094c6b'}}>
          {/*<Left>
                            <Button transparent>
                                <Icon name="cog" />
                            </Button>
                        </Left>*/}

          {/*<Body style={{flexDirection: 'row'}}>
                    <Item style={{height: 40, flex: 4, paddingVertical: 5}}>*/}

            <Item style={{height: 40, flex: 4, paddingVertical: 5}}>
              {/*<Button transparent onPress={()=>{}}>*/}
              {/*<Icon style={styles.activeTabIcon} name="search" />*/}
              {/*</Button>*/}
                <CogMenu componentId={this.props.componentId} color={colors.primary}/>
              <Input
                placeholder="Search..."
                //  underlineColorAndroid="transparent"
                onChangeText={searchText => {
                  this._search(searchText);
                }}
                autoCorrect={false}
              />

              <Button transparent style={{paddingHorizontal:10}} onPress={() => this.props.navigation.navigate('AddService')}>
              <Icon name='plus' size={28} color={colors.primary}/>
              </Button>
            </Item>
            {/*<Item style={{height: 40, flex: 2, marginLeft: 4}}>*/}
            {/*<Picker*/}
            {/*mode="dropdown"*/}
            {/*iosIcon={<Icon name="arrow-dropdown-circle" style={{color: "#007aff", fontSize: 25}}/>}*/}
            {/*style={{color: '#ffffff'}}*/}
            {/*note={false}*/}
            {/*selectedValue={this.state.selected}*/}
            {/*onValueChange={this.onValueChange.bind(this)}*/}
            {/*>*/}
            {/*<Picker.Item label="All" value="all"/>*/}
            {/*<Picker.Item label="Starred" value="starred"/>*/}
            {/*<Picker.Item label="My Location" value="myLocation"/>*/}
            {/*</Picker>*/}
            {/*</Item>*/}

          {/*<Right>*/}
          {/*/!*<Button transparent onPress={()=>this.openDrawer()}>*!/*/}
          {/*/!*<Icon name='more' />*!/*/}
          {/*/!*</Button>*!/*/}
          {/**/}
          {/*</Right>*/}
        </Header>

        <Content style={styles.content}>
          {/*{ (this.state.data.length<10 && !this.currentSearch )? <ActivityIndicator style={{ flex:1}}/>: null}*/}
          {this.renderSelectedTab()}
          {/*<List style={styles.contentList}*/}
          {/*dataArray={this.props.categories}*/}
          {/*renderRow={this._getListItem} >*/}
          {/*</List>*/}
        </Content>
        {/*<Footer>*/}
        {/*<FooterTab style={styles.footerTab}>*/}
        {/*<Button vertical active={this.state.selectedTab === 'home'}*/}
        {/*onPress={() => this.setState({selectedTab: 'home'})}>*/}
        {/*<Icon name="list" style={styles.activeTabIcon}/>*/}
        {/*<Text style={styles.activeTabText}>List View</Text>*/}
        {/*</Button>*/}
        {/*/!*<Image source={logoImage} style={styles.image}/>*!/*/}
        {/*<Button vertical active={this.state.selectedTab === 'map'}*/}
        {/*onPress={() => this.setState({selectedTab: 'map'})}>*/}
        {/*<Icon name="map"/>*/}
        {/*<Text>Map View</Text>*/}
        {/*</Button>*/}
        {/*</FooterTab>*/}
        {/*</Footer>*/}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: colors.appBackground,
    flex: 1,
    padding:8,
  },
  serviceList: {
    flex: 1,
    backgroundColor: colors.inputBackground,
    backgroundColor: '#094c6b0a',
    //marginVertical: 5,
    //marginHorizontal: '2%',
    borderRadius: 5,
    borderBottomColor: '#094c6b',
    borderBottomWidth: 10,
  },
  serviceTitle: {
    color: '#000000',
    fontWeight: 'bold',
  },
  serviceAddress: {
    color: '#000000',
  },
  serviceDist: {
    color: '#000000',
  },
  serviceAction: {
    //flexDirection: 'row',
    //justifyContent: 'center',
    //alignItems: 'center',
  },
  serviceIconBtn: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  catIcon: {
    padding: 5,
    borderRadius: 100,
    backgroundColor: '#094c6b',
    color: '#fff',
    width: 30,
    height: 30,
    marginRight: 0,
  },
  contentList: {
    //marginVertical: 3,
    //paddingVertical: 3
  },
  image: {
    width: 50,
    height: 56,
    borderRadius: 25,
    backgroundColor: '#000000',
  },
  banner: {
    width: 80,
    height: 50,
    borderRadius: 3,
    backgroundColor: '#000000',
  },
  footerTab: {
    backgroundColor: '#094c6b',
    borderTopWidth: 3,
    borderTopColor: '#000000',
  },
  activeTab: {
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
  },
  activeTabIcon: {
    color: '#ffffff',
  },
  activeTabText: {
    color: '#ffffff',
  },
  searchInput: {
    color: '#ffffff',
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
});

export default Meteor.withTracker(props => {
  // Meteor.subscribe('myServices');
  return {
    // myServices: Meteor.collection('service').find()
  };
})(MyServices);