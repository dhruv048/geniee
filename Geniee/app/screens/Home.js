import React, {Component} from 'react';
import _ from 'lodash';
import {
    Container,
    Header,
    Content,
    Button,
    Icon,
    Item,
    Input,
} from 'native-base';

import {
    StyleSheet,
    Picker,
    ActivityIndicator,
    BackHandler,
    PermissionsAndroid,
    FlatList,
    View, 
} from 'react-native';
import {BottomNavigation} from 'react-native-paper';
import Meteor from "../react-native-meteor";
import Map from './Map';
import settings from "../config/settings";
import {colors, customStyle} from "../config/styles";
import MyFunctions from '../lib/MyFunctions'
import Geolocation from 'react-native-geolocation-service';
import ServiceItem from  "../components/Service/ServiceItem";
import {CogMenu} from "../components/CogMenu/CogMenu";
import FIcon from 'react-native-vector-icons/Feather';

class Home extends Component {

    _handlItemPress = (service) => {
        // service.avgRate = this.averageRating(service.ratings);
         this.props.navigation.navigate('ServiceDetail', {Id: service});
    }

    _fetchMarkers = () => {
        let markers = [];
        this.state.data.map(item => {
            if (item.location.hasOwnProperty('geometry') && item.location.geometry) {
                let latlang = item.location.geometry.location;
                // console.log('item:' + latlang)
                markers.push({
                    _id: item._id,
                    latlng:
                        {
                            latitude: latlang.lat,
                            longitude: latlang.lng
                        },
                    coordinate: latlang,
                    title: item.title,
                    description: item.description
                })
            }
            else {
                console.log(item)
            }
        })
        // this.setState({
        //     markers
        // })
        // console.log('state.markers:' + this.state.markers)
        return markers
    };
    _onEndReached = (distance) => {
        console.log(distance);
        if (!this.currentSearch && this.skip>this.lastSkip && !this.state.loading) {
            this.setState({loading: true})
           this.fetchData();
        }
    }
    averageRating = (arr) => {
        let sum = 0;
        arr.forEach(item => {
            sum = sum + item.count;
        });
        var avg = sum / arr.length;
        return Math.round(avg);
    }
    _search = (text) => {
        console.log('search',text);
        if (text.length<1) {
            this.currentSearch = text;
            this.skip=0;
            this.arrayholder=[];
            this.fetchData(this.skip,this.limit);
            // var data = this.props.categories;
            // this.setState({
            //     data: data, loading: false
            // });
            // this.arrayholder = data;
            return;
        }
        var delayTimer;
        if (text === this.currentSearch)
            return;

        if (text.length > 3) {
            clearTimeout(delayTimer);
            // delayTimer = setTimeout(function() {
            this.currentSearch = text;
            var dataToSend = {
                subCatIds: this.props.route.params.Id,
                searchValue: text,
                coords: [this.region.longitude, this.region.latitude]
            };
            console.log('fetch')
            return fetch(settings.API_URL + 'search', {
                method: "POST",//Request Type
                body: JSON.stringify(dataToSend),//post body
                headers: {//Header Defination
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(responseJson => {
                    console.log(responseJson);
                    this.setState(
                        {
                            loading: false,
                            data: responseJson.data,
                        }
                    );
                    this.arrayholder = responseJson.data
                })
                .catch(error => {
                    console.error(error);
                });
            // },2000);
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
            currentSearch: "",
            loading: true,
            data: [],
            error: null,
            searchText: '',
            selected: 'all',
            active: false,
            query:'',
            index:0,
        }
        this.arrayholder = [];
        this.currentSearch = '';
        this.region = {
            latitude: 27.712020,
            longitude: 85.312950,
        };
        this.skip=0;
        this.lastSkip;
        this.limit = 20;
        this.watchID;
        this.granted = false;
        this.isDisplaying=false;
        this.fetchData= this.fetchData.bind(this)
    }


    async componentDidMount() {
        
        BackHandler.addEventListener('hardwareBackPress', this.handleBackfromHome);
        this.region=this.props.route.params.Region;
        this.granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                'title': 'Location Permission',
                'message': 'This App needs access to your location ' +
                'so we can know where you are.'
            }
        )
        if (this.granted === PermissionsAndroid.RESULTS.GRANTED) {

            console.log("You can use locations ")
            Geolocation.getCurrentPosition(
                (position) => {
                    console.log(position);
                    let region = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    }
                    this.region = region;
                    // Meteor.subscribe('nearByService', {
                    //     limit: this.limit,
                    //     coords: [region.longitude, region.latitude],
                    //     subCatIds: this.props.route.params.Id
                    // })
                },
                (error) => {
                    // See error code charts below.
                    console.log(error.code, error.message);
                },
                {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000}
            );
        } else {
            console.log("Location permission denied")
        }
        this.watchID = Geolocation.watchPosition(
            (position) => {
                console.log(position);
                let region = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }
                this.region = region;
            },
            (error) => {
                // See error code charts below.
                console.log(error.code, error.message);
            },
            {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000}
        );

        if(this.props.Region){
            this.region=this.props.Region;
        }
        this.fetchData(this.region);

        // this.setState({
        //     data: this.props.categories, loading: false
        // })
        // this.arrayholder = this.props.categories;
    }

    componentWillReceiveProps(newProps) {
        // const oldProps = this.props
        // if (oldProps.categories !== newProps.categories) {
        //     this.setState({data: newProps.categories, loading: false})
        //     this.arrayholder = newProps.categories;
        //     this._search(this.currentSearch)
        // }
    }

    componentWillUnmount() {
        this.mounted = false;
        this.watchID != null && Geolocation.clearWatch(this.watchID);
        BackHandler.removeEventListener('hardwareBackPress',this.handleBackfromHome);
    }

    handleBackfromHome=()=>{
        if( this.isDisplaying) {
            console.log('handlebackpress')
            // this.props.navigation.navigate('Dashboard');
            this.props.navigation.navigate('Home');
            return true;
        }

    }


    fetchData=(region)=>{
        console.log(this.region)
        const data={
            skip:this.skip,
            limit: this.limit,
            coords: [this.region.longitude ?this.region.longitude: 85.312950, this.region.latitude?this.region.latitude:27.712020],
            subCatIds: this.props.route.params.Id ? this.props.route.params.Id: null
        };
        this.lastSkip=this.skip;
        this.setState({loading:true})
        Meteor.call('getServicesNearBy',data,(err,res)=>{
            console.log(err,res);
            this.setState({loading:false})
            if(!err){
                if(res.result.length>0) {
                    this.skip = this.skip + this.limit;
                    this.arrayholder = this.arrayholder.concat(res.result);
                    this.setState({data: this.arrayholder});
                }
                this.setState({loading: false});
            }
        })
    }

    componentDidAppear(){
        this.isDisplaying=true;
    }

    componentDidDisappear(){
        this.isDisplaying=false
    }

    closeDrawer() {
        this.drawer._root.close();
    }

    openDrawer() {
        this.drawer._root.open();
    }

    _getListItem = (data) => {
       let rowData = data.item;
        return (
            <ServiceItem componentId={this.props.componentId} service={rowData} />
        )

    }

    renderSelectedTab() {
        const home = (
            <FlatList style={styles.contentList}
                      data={this.state.data}
                      onEndReachedThreshold={0.1}
                      renderItem={this._getListItem}
                      initialNumToRender={15}
                      onEndReached={(distance) => this._onEndReached(distance)}
                      ListFooterComponent={this.state.loading ? <ActivityIndicator style={{height: 80}}/> : null}
                      keyExtractor={(item, index) => index.toString()}
            />

        )
        switch (this.state.selectedTab) {
            case 'home':
                return home;
                break;
            case 'map':
                return (<Map componentId={this.props.componentId}
                    markers={this._fetchMarkers()}/>);
                break;
            default:
        }
    }

    renderScene = ({ route, jumpTo }) => {
        const home = (
            <FlatList
                contentContainerStyle={{padding:5}}
                style={styles.contentList}
                      data={this.state.data}
                      onEndReachedThreshold={0.1}
                      renderItem={this._getListItem}
                      initialNumToRender={15}
                      onEndReached={(distance) => this._onEndReached(distance)}
                      ListFooterComponent={this.state.loading ? <ActivityIndicator style={{height: 80}}/> : null}
                      keyExtractor={(item, index) => index.toString()}
            />

        )
        switch (route.key) {
            case 'list':
                return home;
                break;
            case 'map':
                return (<Map componentId={this.props.componentId}
                             markers={this._fetchMarkers()}/>);
                break;
            default:
        }
    }

     setIndex(index){
        this.setState({index});
     }

    onValueChange(value) {
        this.setState({
            selected: value
        });
        switch (value) {
            case 'all':
                this.setState({
                    data:  this.arrayholder,
                });
                //this.arrayholder = this.props.categories;
                // this._search(this.state.currentSearch);
                break;

            case 'starred':
                const newDat = this.arrayholder;
                let latest = newDat.sort((a, b) => {
                    return (b.Rating.avgRate - a.Rating.avgRate);
                });
                this.setState({
                    data: []
                });
                this.setState({
                    data: latest
                });
                // this.arrayholder = latest;
                //  this._search(this.state.currentSearch);
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
            //    this.arrayholder = newData;
                //   this._search(this.state.currentSearch)
                break;
            default:
        }
    };

    render() {
       const routes=[
            {key:'list',title:'List' ,icon:'menu', color: '#3F51B5'},
            {key:'map',title:'Map' ,icon:'map'  }
        ];
       const {index} = this.state;
        return (
            <Container style={{backgroundColor: colors.appBackground}}>
                {/*<StatusBar*/}
                    {/*backgroundColor={colors.statusBar}*/}
                    {/*barStyle='light-content'*/}
                {/*/>*/}
                <Header searchBar rounded androidStatusBarColor={colors.statusBar} style={{backgroundColor: colors.primary}}>
                    {/*<Left>
                            <Button transparent>
                                <Icon name="cog" />
                            </Button>                        
                        </Left>*/}

                    {/*<Body style={{flexDirection: 'row'}}>
                    <Item style={{height: 40, flex: 4, paddingVertical: 5}}>*/}
                    {/*<Body style={{flexDirection: 'row'}}>*/}
                    <Item >
                        <CogMenu componentId={this.props.componentId} color={colors.primary}/>
                        {/*<Button transparent onPress={()=>{}}>*/}
                        {/*<Icon style={styles.activeTabIcon} name='search'/>*/}
                        {/*</Button>*/}
                        <Input placeholder="Search.."
                               value={this.state.query}
                               onChangeText={(searchText) => {
                                   this._search(searchText), this.setState({query:searchText})
                               }}
                               autoCorrect={false}
                        />

                        {this.state.query ?
                            <Button style={{paddingHorizontal: 10}}
                                    onPress={() => {
                                        this.setState({query: ''}),
                                            this._search("")
                                    }} transparent>
                                <FIcon name='x' size={20} color={colors.primary}/>
                            </Button> :
                        <Picker
                            mode="dropdown"
                            iosIcon={<Icon name="arrow-dropdown-circle" style={{color: "#007aff", fontSize: 25}}/>}

                            note={false}
                            selectedValue={this.state.selected}
                            onValueChange={this.onValueChange.bind(this)}
                        >
                            <Picker.Item label="All" value="all"/>
                            <Picker.Item label="Starred" value="starred"/>
                            <Picker.Item label="My Location" value="myLocation"/>
                            <Picker.Item label="Select Categories" value="category"/>
                        </Picker>}

                        {/*<Button transparent onPress={() => this.openDrawer()}>*/}
                        {/*<Icon name='more' style={styles.activeTabIcon}/>*/}
                        {/*</Button>*/}

                    </Item>
                    {/*<Item style={{height: 40, flex: 2, marginLeft: 4}}>*/}
                        {/*<Picker*/}
                            {/*mode="dropdown"*/}
                            {/*iosIcon={<Icon name="arrow-dropdown-circle" style={{color: "#007aff", fontSize: 25}}/>}*/}
                            {/**/}
                            {/*note={false}*/}
                            {/*selectedValue={this.state.selected}*/}
                            {/*onValueChange={this.onValueChange.bind(this)}*/}
                        {/*>*/}
                            {/*<Picker.Item label="All" value="all"/>*/}
                            {/*<Picker.Item label="Starred" value="starred"/>*/}
                            {/*<Picker.Item label="My Location" value="myLocation"/>*/}
                        {/*</Picker>*/}
                            {/*</Item>*/}
                    {/*</Body>*/}
                    {/*<Right>*/}
                    {/*/!*<Button transparent onPress={()=>this.openDrawer()}>*!/*/}
                    {/*/!*<Icon name='more' />*!/*/}
                    {/*/!*</Button>*!/*/}
                    {/**/}
                    {/*</Right>*/}
                </Header>

                <View
                    style={{flex: 1}} >
                    {/*{ (this.state.data.length<10 && !this.currentSearch )? <ActivityIndicator style={{ flex:1}}/>: null}*/}
                    {/*{this.renderSelectedTab()}*/}
                    {/*<List style={styles.contentList}*/}
                    {/*dataArray={this.props.categories}*/}
                    {/*renderRow={this._getListItem} >*/}
                    {/*</List>*/}

                <BottomNavigation
                    barStyle={{ paddingBottom: 5,backgroundColor:colors.primary }}
                    navigationState={{index, routes}}
                    onIndexChange={index=>this.setIndex(index)}
                    renderScene={this.renderScene}
                />

                </View>

                {/*<Footer>*/}
                    {/*<FooterTab style={[customStyle.footer,{paddingHorizontal:0}]}>*/}
                        {/*<Button vertical style={{height:'100%',backgroundColor : this.state.selectedTab === 'home'? colors.primary : 'white'}}*/}
                                {/*onPress={() => this.setState({selectedTab: 'home'})}>*/}
                            {/*<Icon name="list" style={this.state.selectedTab === 'home'? styles.activeTabIcon:{ color: colors.primary}}/>*/}
                            {/*<Text style={this.state.selectedTab === 'home'? styles.activeTabText :{ color: colors.primary}}>List View</Text>*/}
                        {/*</Button>*/}
                        {/*/!*<Image source={logoImage} style={styles.image}/>*!/*/}
                        {/*<Button   vertical  style={{height : '100%', backgroundColor : this.state.selectedTab === 'map'? colors.primary : 'white'}}*/}
                                {/*onPress={() => this.setState({selectedTab: 'map'})}>*/}
                            {/*<Icon name="map"  style={this.state.selectedTab === 'map'? styles.activeTabIcon:{ color: colors.primary}}/>*/}
                            {/*<Text style={this.state.selectedTab === 'map'? styles.activeTabText :{ color: colors.primary}}>Map View</Text>*/}
                        {/*</Button>*/}
                    {/*</FooterTab>*/}
                {/*</Footer>*/}

            </Container>


        );
    };
}


const styles = StyleSheet.create({
    content: {
        backgroundColor: colors.appBackground,
        flex: 1

    },
    serviceList: {
        //backgroundColor: colors.inputBackground,
        backgroundColor: '#4d94ff0a',
        //marginVertical: 5,
        //marginHorizontal: '2%',
        borderRadius: 0,
        borderBottomColor: '#4d94ff',
        borderBottomWidth: 5
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
        alignItems: 'center'
    },
    catIcon: {
        padding: 5,
        borderRadius: 100,
        backgroundColor: '#4d94ff',
        color: '#fff',
        width: 30,
        height: 30,
        marginRight: 0
    },
    contentList: {
      flex:1
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
        backgroundColor: '#4d94ff',
        borderTopWidth: 3,
        borderTopColor: '#000000',
    },
    activeTab: {
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
    },
    activeTabIcon: {
        color: '#ffffff'
    },
    activeTabText: {
        color: '#ffffff'
    },
    searchInput: {
        color: '#ffffff',
        borderTopWidth: 0,
        borderRightWidth: 0,
        borderLeftWidth: 0,
        borderBottomWidth: 0,
    }
});

export default Meteor.withTracker((props) => {
    let Ids = props.Id
    return {
       // categories: Meteor.collection('serviceReact').find({categoryId: {$in: Ids}})
    }
})(Home);