import React, { Component, createRef } from 'react';
import _ from 'lodash';
import {
    Container,
    Header,
    Content,
    Icon,
    Button,
    Item,
    Input,
    Text
} from 'native-base';

import {
    StyleSheet,
    Picker,
    ActivityIndicator,
    BackHandler,
    PermissionsAndroid,
    FlatList,
    View,
    TouchableOpacity
} from 'react-native';
import { FAB, Appbar, Divider,Headline,RadioButton } from 'react-native-paper';
import Meteor from "../react-native-meteor";
import Map from './Map';
import settings from "../config/settings";
import { colors, customStyle } from "../config/styles";
import MyFunctions from '../lib/MyFunctions'
import Geolocation from 'react-native-geolocation-service';
import ServiceItem from "../components/Service/ServiceItem";
import FIcon from 'react-native-vector-icons/Feather';
import ActionSheet from "react-native-actions-sheet"; 
import { Provider } from 'react-native-paper';
import { customPaperTheme } from '../config/themes';
import CartIcon from '../components/HeaderIcons/CartIcon';

class Home extends Component {

    constructor(props) {
        super(props);
        this.mounted = false;
        this.state = {
            selectedTab: 'list',
            markers: [],
            currentSearch: "",
            loading: false,
            data: [],
            error: null,
            searchText: '',
            selected: 'all',
            active: false,
            query: '',
            index: 0,
            isSearch: false,
            sortByItem: '',
            filterOption: 'all',
            filterText:'All'
        }
        this.arrayholder = [];
        this.currentSearch = '';
        this.region = {
            latitude: 27.712020,
            longitude: 85.312950,
        };
        this.skip = 0;
        this.lastSkip;
        this.limit = 20;
        this.watchID;
        this.granted = false;
        this.isDisplaying = false;
        this.fetchData = this.fetchData.bind(this);
        this.actionSheetRef = createRef();
        this.myServices=[];
    }

    _handlItemPress = (service) => {
        // service.avgRate = this.averageRating(service.ratings);
        this.props.navigation.navigate('ServiceDetail', { Id: service });
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
        if(this.state.filterOption=='all'){
        console.log(distance);
        if (!this.currentSearch && this.skip > this.lastSkip && !this.state.loading) {
            this.setState({ loading: true })
            this.fetchData();
        }
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
        console.log('search', text);
        if (text.length < 1) {
            this.currentSearch = text;
            this.skip = 0;
            this.arrayholder = [];
            this.fetchData(this.skip, this.limit);
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

    async componentDidMount() {
        this.region = this.props.route.params.Region;
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
                    this.fetchData();
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
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
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
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );

        if (this.props.route.params.Region) {
            this.region = this.props.route.params.Region;
        }
        this.fetchData(this.region);

        // this.setState({
        //     data: this.props.categories, loading: false
        // })
        // this.arrayholder = this.props.categories;
    }


    componentWillUnmount() {
        this.watchID != null && Geolocation.clearWatch(this.watchID);
    }



    fetchData = (region) => {
        if(!this.state.loading){
        console.log(this.region)
        const data = {
            skip: this.skip,
            limit: this.limit,
            coords: [this.region.longitude ? this.region.longitude : 85.312950, this.region.latitude ? this.region.latitude : 27.712020],
            subCatIds: this.props.route.params.Id ? this.props.route.params.Id : null
        };
        this.lastSkip = this.skip;
        this.setState({ loading: true })
        Meteor.call('getServicesNearBy', data, (err, res) => {
            console.log(err, res);
            this.setState({ loading: false })
            if (!err) {
                if (res.result.length > 0) {
                    this.skip = this.skip + this.limit;
                    this.arrayholder = this.arrayholder.concat(res.result);
                    this.setState({ data: this.arrayholder });
                }
                this.setState({ loading: false });
            }
        });

        Meteor.call('getMyServices', (err, res) => {
            console.log(err, res);
            if (!err) {
              if (res.result.length > 0) {
                //   this.skip = this.skip + this.limit;
                // this.arrayholder = this.arrayholder.concat(res.result);
                // this.setState({data: res.result});
                this.myServices = res.result;
              }
              this.setState({loading: false});
            }
          });
        }
    }


    _getListItem = (data) => {
        let rowData = data.item;
        return (
            <ServiceItem navigation={this.props.navigation} service={rowData} />
        )

    }

    _setFilter = (value) => {
        switch(value){
            case 'all':
                this.setState({ filterOption: value, filterText: 'All' , data: this.arrayholder,});        
                break;
            case 'starred':
                this.setState({ filterOption: value, filterText: 'Most Rated' });
                const newDat = this.arrayholder.slice();
                let latest = newDat.sort((a, b) => {
                    return (b.Rating.avgRate - a.Rating.avgRate);
                });
                this.setState({
                    data: latest
                });
                break;
            case 'myLocation':
                this.setState({ filterOption: value, filterText: 'My Location' });
                let newData = this.arrayholder.slice();
                 newData = newData.filter(item => {
                    if (item.location.hasOwnProperty('geometry')) {
                        return MyFunctions.isWithinRange(item.location.geometry.location.lat, item.location.geometry.location.lng, this.region.latitude, this.region.longitude, item.radius);
                    }
                    else {
                        return false
                    }
                });
                this.setState({ data: newData });
                break;
            case 'category':
                this.setState({ filterOption: value, filterText: 'Categories' });
                break;
            case 'myServices':
                this.setState({ filterOption: value, filterText: 'My Services', data:this.myServices });
                break;

        }
    }


    renderScene = (route) => {
        const home = (
            <FlatList
                contentContainerStyle={{ padding: 5 }}
                style={styles.contentList}
                data={this.state.data}
                onEndReachedThreshold={0.1}
                renderItem={this._getListItem}
                initialNumToRender={15}
                onEndReached={(distance) => this._onEndReached(distance)}
                ListFooterComponent={this.state.loading ? <ActivityIndicator style={{ height: 80 }} /> : null}
                keyExtractor={(item, index) => index.toString()}
                numColumns={2}
            />

        )
        switch (route) {
            case 'list':
                return home;
                break;
            case 'map':
                return (<Map componentId={this.props.componentId}
                    markers={this._fetchMarkers()} />);
                break;
            default:
        }
    }

    setIndex(index) {
        this.setState({ index });
    }

    onValueChange(value) {
        this.setState({
            selected: value
        });
        switch (value) {
            case 'all':
                this.setState({
                    data: this.arrayholder,
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
                this.setState({ data: newData });
                //    this.arrayholder = newData;
                //   this._search(this.state.currentSearch)
                break;
            default:
        }
    };

    render() {
         
        const userId=Meteor.userId();
        return (
            <Container style={{ backgroundColor: colors.appBackground }}>
                <Provider theme={customPaperTheme}>
                <Appbar.Header style={{backgroundColor:colors.appLayout,marginHorizontal:16}}>
                    <Appbar.BackAction style={{marginLeft:0}} color={colors.whiteText} onPress={() => {
                        this.props.navigation.goBack();
                    }} />
                    <Appbar.Content color={colors.whiteText} title="Service/Store nearby.." />

                    {/* <Appbar.Action color={colors.whiteText} icon="magnify" onPress={() => this.setState({ isSearch: true })} /> */}
                    <FIcon name="search" style={customStyle.actionIcon} />
                    {/* <CartIcon  navigation={this.props.navigation} /> */}
                </Appbar.Header>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16 }}>
                    <View style={{ flexDirection: 'row', }}>
                        <Text style={{ marginTop: 10 }}>{this.state.filterText}</Text>
                        <Button transparent style={{ marginLeft: 10 }}
                            onPress={() => this.actionSheetRef.current?.setModalVisible(true)}>
                            <FIcon name='chevron-down' size={24} />
                        </Button>
                    </View>
                    <View style={{ flexDirection: 'row', }}>
                        <Button transparent 
                        onPress={() => this.setState({selectedTab:'list'})}>
                            <FIcon name='list' size={24} />
                        </Button>
                        <Button transparent style={{ marginLeft: 16 }}
                        onPress={() => this.setState({selectedTab:'map'})}>
                            <FIcon name='map' size={24} />
                        </Button>
                    </View>
                </View>
                <Divider />
                <View style={{flex:1}}>
                    {this.state.selectedTab=='list'? 
                    <FlatList
                    contentContainerStyle={{ padding: 5 }}
                    style={styles.contentList}
                    data={this.state.data}
                    onEndReachedThreshold={0.1}
                    renderItem={this._getListItem}
                    initialNumToRender={15}
                    onEndReached={(distance) => this._onEndReached(distance)}
                    ListFooterComponent={this.state.loading ? <ActivityIndicator style={{ height: 80 }} /> : null}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={2}
                />
                :
                <Map navigation={this.props.navigation}
                    markers={this._fetchMarkers()} />
                }
                </View>
              
                    <ActionSheet ref={this.actionSheetRef}
                        initialOffsetFromBottom={2}
                        statusBarTranslucent
                        bounceOnOpen={true}
                        bounciness={4}
                        gestureEnabled={true}
                        defaultOverlayOpacity={0.3}
                    >
                        <View
                            nestedScrollEnabled={true}
                            style={styles.actionContentView}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Headline>Filter By</Headline>
                                <TouchableOpacity onPress={() => { this.actionSheetRef.current?.setModalVisible(false) }} />
                                <FIcon onPress={() => { this.actionSheetRef.current?.setModalVisible(false) }} name="x" size={25} />
                            </View>
                            <TouchableOpacity onPress={() => { this.actionSheetRef.current?.setModalVisible(false), this._setFilter('all') }}
                                style={{ flexDirection: 'row', paddingLeft: 20, alignItems: 'center' }}>
                                <RadioButton status={this.state.filterOption == "all" ? 'checked' : 'unchecked'} color={colors.primary} />
                                <Text note style={{ marginLeft: 10 }}>All</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { this.actionSheetRef.current?.setModalVisible(false), this._setFilter('starred') }}
                                style={{ flexDirection: 'row', paddingLeft: 20, alignItems: 'center' }}>
                                <RadioButton status={this.state.filterOption == "starred" ? 'checked' : 'unchecked'} color={colors.primary} />
                                <Text note style={{ marginLeft: 10 }}>Most Rated</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { this.actionSheetRef.current?.setModalVisible(false), this._setFilter('myLocation') }}
                                style={{ flexDirection: 'row', paddingLeft: 20,  alignItems: 'center' }}>
                                <RadioButton status={this.state.filterOption == "myLocation" ? 'checked' : 'unchecked'} color={colors.primary} />
                                <Text note style={{ marginLeft: 10 }}>My Location</Text>
                            </TouchableOpacity>
                            {/* <TouchableOpacity onPress={() => { this.actionSheetRef.current?.setModalVisible(false), this._setFilter('category') }}
                                style={{ flexDirection: 'row', paddingLeft: 20, alignItems: 'center' }}>
                                <RadioButton status={this.state.filterOption == "category" ? 'checked' : 'unchecked'} color={colors.primary} />
                                <Text note style={{ marginLeft: 10 }}>Select Categories</Text>
                            </TouchableOpacity> */}
                            {userId ?
                                <TouchableOpacity onPress={() => { this.actionSheetRef.current?.setModalVisible(false), this._setFilter('myServices') }}
                                    style={{ flexDirection: 'row', paddingLeft: 20, alignItems: 'center' }}>
                                    <RadioButton status={this.state.filterOption == "myServices" ? 'checked' : 'unchecked'} color={colors.primary} />
                                    <Text note style={{ marginLeft: 10 }}>My Services</Text>
                                </TouchableOpacity> : null}
                        </View>
                    </ActionSheet>
                    {/*{ (this.state.data.length<10 && !this.currentSearch )? <ActivityIndicator style={{ flex:1}}/>: null}*/}
                    {/*{this.renderSelectedTab()}*/}
                    {/*<List style={styles.contentList}*/}
                    {/*dataArray={this.props.categories}*/}
                    {/*renderRow={this._getListItem} >*/}
                    {/*</List>*/}
                    {/* <BottomNavigation
                        barStyle={{ paddingBottom: 1, backgroundColor: colors.whiteText, }}
                        navigationState={{ index, routes }}
                        onIndexChange={index => this.setIndex(index)}
                        renderScene={this.renderScene}
                        activeColor='#0000FF'
                    /> */}

                 

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
                <FAB
        label={'Add New'}
        color={colors.whiteText}
        visible={userId}
    style={styles.fab}
    small
    icon="plus"
    onPress={() => this.props.navigation.navigate('AddService')}
  />


                </Provider>
            </Container>


        );
    };
}


const styles = StyleSheet.create({
    content: {
        backgroundColor: colors.appBackground,
        flex: 1

    },

    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor:colors.appLayout
      },
    contentList: {
        backgroundColor: colors.whiteText,
        flex: 1
    },

    activeTab: {
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
    },

    searchInput: {
        color: '#ffffff',
        borderTopWidth: 0,
        borderRightWidth: 0,
        borderLeftWidth: 0,
        borderBottomWidth: 0,
    },
    actionContentView: {
        width: '100%',
        paddingHorizontal: 12,
        paddingTop: 5
    },
});

export default Meteor.withTracker((props) => {
    let Ids = props.Id
    return {
        // categories: Meteor.collection('serviceReact').find({categoryId: {$in: Ids}})
    }
})(Home);