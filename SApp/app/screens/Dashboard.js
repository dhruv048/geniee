import React, {Component} from 'react';
import Meteor, {withTracker} from 'react-native-meteor';
import {
    StyleSheet,
    Dimensions,
    StatusBar,
    View,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    FlatList
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {Header, Container, Content, Item, Body, Left, Button,Right, Text, Input} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import {colors} from '../config/styles';
import SplashScreen from "react-native-splash-screen";
// import { Header } from 'react-native-elements';

const window = Dimensions.get('window');

class Dashboard extends Component {

    constructor(props) {
        super(props)
        this.state = {
            categories: [],
            loading: true,
        };
        this.arrayholder;
        this.currentSearch = '';
        this.region = {
            latitude: 27.712020,
            longitude: 85.312950,
        };
        this.granted;
    }

     componentDidMount  () {
        Meteor.subscribe('categories-list');
        Meteor.subscribe('aggChatChannels')
        // this.granted = await PermissionsAndroid.request(
        //    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        //     {
        //         'title': 'Location Permission',
        //         'message': 'This App needs access to your location ' +
        //         'so we can know where you are.'
        //     }
        // )
        // if (PermissionsAndroid.RESULTS.GRANTED) {

            console.log("You can use locations ")
            Geolocation.getCurrentPosition(
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
        // } else {
        //     console.log("Location permission denied")
        // }

        this.setState({categories: this.props.categories?this.props.categories:[], loading: false})
        this.arrayholder =  this.props.categories?this.props.categories:[]
    }
    componentWillReceiveProps(newProps) {
        const oldProps = this.props
        if (oldProps.categories !== newProps.categories) {
            this.setState({categories: newProps.categories, loading:false})
            this.arrayholder = newProps.categories;
            this._search(this.currentSearch)
        }
    }
    _search = (text) => {
        const textData = text.trim().toUpperCase();
        this.setState({loading: true});
        // if (textData === this.currentSearch) {
        //     // abort search if query wasn't different
        //     return;
        // }
        if (textData === "") {
            this.setState({
                categories: this.arrayholder, loading: false
            });
            return;
        }

        this.currentSearch = textData;
        const newData = this.arrayholder.filter(item => {
            const itemData =
                `${item.mainCategory.toUpperCase()}`;
            return itemData.indexOf(textData) > -1;
        });
        this.setState({categories: newData, loading: false});
    };

    _itemClick = (item) => {
        let Ids = [];
        item.subCategories.map(item => {
            Ids.push(item.subCatId)
        })
        this.props.navigation.navigate("Home", {Id: Ids,Region:this.region})
    }

    renderItem = (data, index) => {
        var item = data.item;
        return (
            <View key={item._id} style={styles.containerStyle}>
                <TouchableOpacity  onPress={() => this._itemClick(item)}>
                    <Body>
                    <Icon name={item.icon} size={40}/>
                    </Body>

                    <Text>
                        <Text>{item.mainCategory}</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        return (
            <Container style={{flex: 1, backgroundColor: colors.appBackground}}>
                <StatusBar
                    backgroundColor={colors.statusBar}
                    barStyle='light-content'
                />
                <Header style={{backgroundColor: '#094c6b'}}>
                    <Left style={{flex:1}}>
                        <Button transparent onPress={()=>{this.props.navigation.openDrawer()}}>
                            <Icon name={'ellipsis-v'} size={25} color={'white'}/></Button>
                    </Left>
                    <Body style={{flexDirection: 'row',flex:6}}>
                    <Item style={{height: 40, width:'90%'}}>
                        {/*<Button transparent onPress={()=>{}}>*/}
                        <Icon style={styles.activeTabIcon} name='search' size={15}/>
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
                    </Item>
                    </Body>

                </Header>
                {this.state.loading ? <ActivityIndicator style={{flex: 1}}/> : null}
                <Content style={{width: '100%', flex: 1,}}>
                    {/*<ScrollView style={{width: '100%', flex: 1}}>*/}
                    <FlatList style={styles.mainContainer}
                              data={this.state.categories}
                              numColumns={2}
                              renderItem={this.renderItem}
                              keyExtractor={item=>item._id}
                    />
                    {/*</ScrollView>*/}
                </Content>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'wrap',

    },
    containerStyle: {
        padding: 10,
        backgroundColor: 'white',
        borderWidth: 0,
        marginVertical: 8,
        borderColor: '#808080',
        elevation: 10,
        width: '42%',
        marginHorizontal: '4%',
        height: 100,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
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
})
export default withTracker(() => {

    return {
        categories: Meteor.collection('MainCategories').find()
    }
})(Dashboard);
Dashboard.defaultProps = {
    categories: [],
}



