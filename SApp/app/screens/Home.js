import React, {Component} from 'react';
import _ from 'lodash';
import {
    Container,
    Header,
    Left,
    Body,
    Subtitle,
    Right,
    Content,
    List,
    ListItem,
    Thumbnail,
    Footer,
    FooterTab,
    Button,
    Icon,
    Text,
    Item,
    Input,
    Picker
} from 'native-base';

import {
    StyleSheet,
    Image,
    StatusBar,
    TouchableWithoutFeedback,
    Keyboard,
    Alert,
    PermissionsAndroid
} from 'react-native';

import Sidebar from '../components/MenuNav/MenuNav';
import Loading from '../components/Loading';
import logoImage from '../images/logo2-trans-640X640.png';
import dUser from '../images/Image.png';
import Meteor, {createContainer} from "react-native-meteor";
import Map from './Map';
import settings from "../config/settings";
import {colors} from "../config/styles";
import MyFunctions from '../lib/MyFunctions'


class Home extends Component {
    constructor(props) {
        super(props);
        this.mounted = false;
        this.state = {
            selectedTab: 'home',
            markers: [],
            currentSearch: "",
            loading: false,
            data: Meteor.collection('service').find(),
            error: null,
            searchText: '',
            selected: 'all'
        }
        this.arrayholder = Meteor.collection('service').find();
        this.currentSearch = '';
        this.region = {
            latitude: 27.700769,
            longitude: 85.300140,
        };

    }

    componentDidMount() {
        // Meteor.subscribe('categories-list',()=>{
        //     // this.setState({
        //     //     data:Meteor.collection('service').find()
        //     // })
        //     // this.arrayholder=Meteor.collection('service').find();
        // })

        const granted = PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                'title': 'Location Permission',
                'message': 'This App needs access to your location ' +
                'so we can know where you are.'
            }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {

            console.log("You can use locations ")
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log(position)
                    //   const location = JSON.stringify(position);
                    let region = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    };
                    this.region = region;
                },
                error => Alert.alert(error.message),
                {enableHighAccuracy: true, timeout: 5000}
            );
        } else {
            console.log("Location permission denied")
        }
    }

    componentWillMount() {
        this.mounted = true;
        // this._fetchMarkers()
        // Meteor.subscribe('categories-list', () => {
            this.setState({
                data: Meteor.collection('service').find()
            })
            this.arrayholder = Meteor.collection('service').find();
        // })


    }

    componentWillReceiveProps(newProps) {
        const oldProps = this.props
        if (oldProps.categories !== newProps.categories) {
            this.setState({data: newProps.categories})
            this.arrayholder = newProps.categories;
            this._search(this.currentSearch)
        }
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    _handlItemPress = (service) => {
        this.props.navigation.navigate('Service', {'Service': service});
    }

    _getListItem = (rowData) => {
        return (
            <TouchableWithoutFeedback onPress={() => {
                this._handlItemPress(rowData)
            }}>
                <ListItem thumbnail>
                    <Left>
                        {rowData.coverImage === null ?
                            <Thumbnail style={styles.banner} square source={dUser}/> :
                            <Thumbnail style={styles.banner}
                                       source={{uri: settings.API_URL + 'images/' + rowData.coverImage}}/>}
                    </Left>
                    <Body>
                    <Text numberOfLines={1}>{rowData.title}</Text>
                    <Text note numberOfLines={1}>{rowData.description}</Text>
                    {/*<Text note numberOfLines={1}>{'Ph: '}{rowData.contact} {' , Service on'} {rowData.radius} {' KM around'}</Text>*/}
                    </Body>
                    {/*<Right>*/}
                    {/*<Button onPress={() => {*/}
                    {/*this._handlItemPress(rowData)*/}
                    {/*}} transparent>*/}
                    {/*<Text>View</Text>*/}
                    {/*</Button>*/}
                    {/*</Right>*/}

                    <Right>
                         <Text style={{fontSize:25, fontWeight:'400'}}><Icon name={'star'} style={{color:'#094c6b'}}/> : {rowData.hasOwnProperty('ratings')? this.averageRating(rowData.ratings) : 0}</Text>
                    </Right>

                </ListItem>
            </TouchableWithoutFeedback>
        )

    }

    closeDrawer() {
        this.drawer._root.close();
    }

    openDrawer() {
        this.drawer._root.open();
    }

    _fetchMarkers = () => {
        let markers = [];
        this.state.data.map(item => {
            if (item.location.hasOwnProperty('geometry') && item.location.geometry) {
                let latlang = item.location.geometry.location;
                console.log('item:' + latlang)
                markers.push({
                    latlng:
                        {
                            latitude: latlang.lat,
                            longitude: latlang.lng
                        },
                    title: item.title,
                    description: item.description
                })
            }
            else{
              console.log(item)
            }
        })
        // this.setState({
        //     markers
        // })
        // console.log('state.markers:' + this.state.markers)
        return markers
    }

    renderSelectedTab() {
        const home = (
            <List style={styles.contentList}
                  dataArray={this.state.data}
                  renderRow={this._getListItem}>
            </List>
        )
        switch (this.state.selectedTab) {
            case 'home':
                return home;
                break;
            case 'map':
                return (<Map
                    markers={this._fetchMarkers()}/>);
                break;
            default:
        }
    }

    onValueChange(value) {
        this.setState({
            selected: value
        });
        switch (value) {
            case 'all':
                this.setState({
                    data: this.props.categories,
                });
                this.arrayholder = this.props.categories;
                this._search(this.state.currentSearch)
                break;
            case 'starred':
                break;
            case 'myLocation':
                const newData = this.arrayholder.filter(item => {
                    if (item.location.hasOwnProperty('geometry')) {
                        return MyFunctions.isWithinRange(item.location.geometry.location.lat, item.location.geometry.location.lng, this.region.latitude, this.region.longitude, item.radius);
                    }
                    else {
                        return false
                    }
                });
                this.setState({data: newData});
                this.arrayholder = newData;
                this._search(this.state.currentSearch)
                break;
            default:
        }
    };

    averageRating = (arr) => {
        let sum = 0;
        arr.forEach(item => {
            sum = sum + item.count;
        })
        var avg = sum / arr.length;
        return avg;
    }

    _search = (text) => {
        //  debugger
        // let searchText = this.state.searchText.trim();
        //  if (searchText === this.state.currentSearch) {
        //      // abort search if query wasn't different
        //      return;
        //  }
        //  // clear results immediately (don't show expired results)
        //  // NOTE: this can cause "flicker" as results are removed / re added
        //  if (searchText === ""){
        //      this.setState({
        //          result:this.props.categories
        //      });
        //      return;
        //  }
        //  this.setState({
        //      searching: true,
        //  });
        //  _.debounce((searchText) => {
        //      this.setState({currentSearch: searchText});
        //      Meteor.call('SearchService', searchText, (err, res) => {
        //          debugger;
        //          if (err) {
        //              console.error(err);
        //          }
        //          if (this.state.currentSearch !== this.state.searchText) {
        //              this.setState({
        //                  searching: false,
        //              });
        //              // query changed, results aren't relevant
        //              return;
        //          }
        //          this.setState({
        //              result: res,
        //              searching: false
        //          })
        //      })
        //  }, 300);

        const textData = text.trim().toUpperCase();
        this.setState({loading: true});
        // if (textData === this.currentSearch) {
        //     // abort search if query wasn't different
        //     return;
        // }
        if (textData === "") {
            this.setState({
                data: this.arrayholder, loading: false
            });
            return;
        }

        this.currentSearch = textData;
        const newData = this.arrayholder.filter(item => {
            const itemData =
                `${item.title.toUpperCase()} ${item.description.toUpperCase()}`;
            return itemData.indexOf(textData) > -1;
        });
        this.setState({data: newData, loading: false});
    };

    render() {


        return (
            <Container style={{backgroundColor: colors.appBackground}}>
                <StatusBar
                    backgroundColor={colors.statusBar}
                    barStyle='light-content'
                />
                <Header style={{backgroundColor: '#094c6b'}}>
                    {/*<Left>
                            <Button transparent>
                                <Icon name="cog" />
                            </Button>                        
                        </Left>*/}

                    <Body style={{flexDirection: 'row'}}>
                    <Item rounded style={{height: 40, flex: 4}}>
                        {/*<Button transparent onPress={()=>{}}>*/}
                        <Icon style={styles.activeTabIcon} name='search'/>
                        {/*</Button>*/}
                        <Input placeholder="Search" style={styles.searchInput}
                               placeholderTextColor='#ffffff'
                               selectionColor='#ffffff'
                            //  underlineColorAndroid="transparent"
                               onChangeText={(searchText) => {
                                   this._search(searchText)
                               }}
                               autoCorrect={false}
                        />


                        {/*<Button transparent onPress={() => this.openDrawer()}>*/}
                        {/*<Icon name='more' style={styles.activeTabIcon}/>*/}
                        {/*</Button>*/}

                    </Item>
                    <Item rounded style={{height: 40, flex: 2, marginLeft: 4}}>
                        <Picker
                            mode="dropdown"
                            iosIcon={<Icon name="arrow-dropdown-circle" style={{color: "#007aff", fontSize: 25}}/>}
                            style={{color: '#ffffff'}}
                            note={false}
                            selectedValue={this.state.selected}
                            onValueChange={this.onValueChange.bind(this)}
                        >
                            <Picker.Item label="All" value="all"/>
                            <Picker.Item label="Starred" value="starred"/>
                            <Picker.Item label="My Location" value="myLocation"/>
                        </Picker>
                    </Item>
                    </Body>
                    {/*<Right>*/}
                        {/*/!*<Button transparent onPress={()=>this.openDrawer()}>*!/*/}
                        {/*/!*<Icon name='more' />*!/*/}
                        {/*/!*</Button>*!/*/}
                     {/**/}
                    {/*</Right>*/}
                </Header>

                <Content style={styles.content}>
                    {this.renderSelectedTab()}
                    {/*<List style={styles.contentList}*/}
                    {/*dataArray={this.props.categories}*/}
                    {/*renderRow={this._getListItem} >*/}
                    {/*</List>*/}
                </Content>
                {this.state.loading === true ?
                    <Loading/> : <Text style={{height: 0}}/>}
                <Footer>
                    <FooterTab style={styles.footerTab}>
                        <Button vertical active={this.state.selectedTab === 'home'}
                                onPress={() => this.setState({selectedTab: 'home'})}>
                            <Icon name="list" style={styles.activeTabIcon}/>
                            <Text style={styles.activeTabText}>List View</Text>
                        </Button>
                        {/*<Image source={logoImage} style={styles.image}/>*/}
                        <Button vertical active={this.state.selectedTab === 'map'}
                                onPress={() => this.setState({selectedTab: 'map'})}>
                            <Icon name="map"/>
                            <Text>Map View</Text>
                        </Button>
                    </FooterTab>
                </Footer>

            </Container>


    );
    };
    }



    const styles = StyleSheet.create({
        content: {
        backgroundColor: colors.appBackground,
        //backgroundColor: '#05a5d10d',
        //borderTopWidth: 3,
        //borderTopColor: '#000000',
        //borderBottomWidth: 3,
        //borderBottomColor: '#000000',        
    },
        contentList: {
        //marginVertical: 3,
        //paddingVertical: 3
    },
        image: {
        width: 50,
        height: 56,
        borderRadius: 25,
        backgroundColor: '#000000'
    },
        banner: {
        width: 80,
        height: 50,
        borderRadius: 3,
        backgroundColor: '#000000'
    },
        footerTab: {
        backgroundColor: '#094c6b',
        //borderTopWidth: 3,
        //borderTopColor: '#000000',
    },
        activeTab: {
        //borderBottomWidth: 1,
        //borderBottomColor: '#f2f2f2',        
    },
        activeTabIcon: {
        color: '#ffffff'
    },
        activeTabText: {
        color: '#ffffff'
    },
        searchInput: {
        //borderBottomWidth: 3,
        //borderBottomColor: '#000000',
        color: '#ffffff',
        //backgroundColor: '#898e907a',
        // height: 40,
        // width: 300,
        // paddingHorizontal: 16,
        borderTopWidth: 0,
        borderRightWidth: 0,
        borderLeftWidth: 0,
        borderBottomWidth: 0,
    }
    });

    export default createContainer(() => {
        //Meteor.subscribe('categories-list');
        return {
        categories: Meteor.collection('service').find()
    }
    }, Home);