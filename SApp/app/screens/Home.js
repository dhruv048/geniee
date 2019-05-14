import React, {Component} from 'react';
import _ from 'lodash';
import {
    Container, Header, Left, Body, Title, Subtitle, Right, Content, List, ListItem, Thumbnail, Footer, FooterTab, Button, Icon, Text,
    Item, Input, Drawer
} from 'native-base';

import {StyleSheet, Image, StatusBar, TouchableWithoutFeedback, Keyboard} from 'react-native';

import Sidebar from '../components/MenuNav/MenuNav';
import Loading from '../components/Loading';
import logoImage from '../images/logo2-trans-640X640.png';
import dUser from '../images/Image.png';
import Meteor, {createContainer} from "react-native-meteor";
import Map from './Map';
import settings from "../config/settings";


class Home extends Component {
    constructor(props) {
        super(props);
        this.mounted = false;
        this.state = {
            selectedTab: 'home',
            markers: [],
            currentSearch: "",
            loading: false,
            data: [],
            error: null,
            searchText:''
        }
        this.arrayholder = [];
        this.currentSearch='';
    }
    componentDidMount(){
        Meteor.subscribe('categories-list',()=>{
            this.setState({
                data:Meteor.collection('service').find()
            })
            this.arrayholder=Meteor.collection('service').find();
        })
    }
    componentWillMount() {
        this.mounted = true;
        // this._fetchMarkers()

    }

    componentWillUnmount() {
        this.mounted = false;
    }

    _handlItemPress = (service) => {
        this.props.navigation.navigate('Service', {'Service': service});
    }

    _getListItem = (rowData) => {
        return (<ListItem thumbnail>
            <Left>
                {rowData.coverImage === null ?
                    <Thumbnail style={styles.banner} square source={dUser}/> :
                    <Thumbnail style={styles.banner}
                               source={{uri: settings.API_URL + 'images/' + rowData.coverImage}}/>}
            </Left>
            <Body>
            <Text>{rowData.title}</Text>
            <Text note numberOfLines={1}>{rowData.description}</Text>
            {/*<Text note numberOfLines={1}>{'Ph: '}{rowData.contact} {' , Service on'} {rowData.radius} {' KM around'}</Text>*/}
            </Body>
            <Right>
                <Button onPress={() => {
                    this._handlItemPress(rowData)
                }} transparent>
                    <Text>View</Text>
                </Button>
            </Right>
        </ListItem>)

    }

    closeDrawer() {
        this.drawer._root.close();
    }

    openDrawer() {
        this.drawer._root.open();
    }

    _fetchMarkers = () => {
        let markers = [];
        this.props.categories.map(item => {
            if (item.location.hasOwnProperty('geometry')) {
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
        })
        console.log('markers:' + markers)
        // this.setState({
        //     markers
        // })
        console.log('state.markers:' + this.state.markers)
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


    _search =  (text)=> {
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
        this.setState({ loading: true });
        if (textData === this.currentSearch) {
            // abort search if query wasn't different
            return;
        }
            this.currentSearch=textData;
            const newData = this.arrayholder.filter(item => {
                const itemData =
                    `${item.title.toUpperCase()} ${item.description.toUpperCase()}`;
                return itemData.indexOf(textData) > -1;
            });
        this.setState({data: newData, loading: false});
    };

    render() {


        return (

            <Drawer ref={(ref) => {
                this.drawer = ref;
            }} content={<Sidebar navigator={this.navigator}/>} onClose={() => this.closeDrawer()}>
                {/*<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>*/}
                    <Container>

                        <Header style={{backgroundColor: '#094c6b'}}>
                            {/*<Left>
                            <Button transparent>
                                <Icon name="cog" />
                            </Button>                        
                        </Left>*/}
                            <Body>
                            <Item><Input placeholder="Search" style={styles.searchInput}
                                         placeholderTextColor='#ffffff'
                                         selectionColor='#ffffff'
                                         underlineColorAndroid="transparent"
                                         onChangeText={(searchText )=> {
                                             this._search(searchText)
                                         }}
                                         autoCorrect={false}
                            />
                                <Button transparent onPress={()=>{}}><Icon style={styles.activeTabIcon} name='search'/></Button>

                                {/*<Button transparent onPress={() => this.openDrawer()}>*/}
                                    {/*<Icon name='more' style={styles.activeTabIcon}/>*/}
                                {/*</Button>*/}
                            </Item>

                            </Body>
                            {/*<Right>
                            <Button transparent onPress={()=>this.openDrawer()}>
                                <Icon name='more' />
                            </Button>
                        </Right>    */}
                        </Header>

                        <Content style={styles.content}>
                            {this.state.loading===true ?
                            <Loading/> : <Text/>}
                            {this.renderSelectedTab()}
                            {/*<List style={styles.contentList}*/}
                            {/*dataArray={this.props.categories}*/}
                            {/*renderRow={this._getListItem} >*/}
                            {/*</List>*/}
                        </Content>

                        <Footer>
                            <FooterTab style={styles.footerTab}>
                                <Button vertical active={this.state.selectedTab === 'home'}
                                        onPress={() => this.setState({selectedTab: 'home'})}>
                                    <Icon name="list" style={styles.activeTabIcon}/>
                                    <Text style={styles.activeTabText}>List View</Text>
                                </Button>
                                <Image source={logoImage} style={styles.image}/>
                                <Button vertical active={this.state.selectedTab === 'map'}
                                        onPress={() => this.setState({selectedTab: 'map'})}>
                                    <Icon name="map"/>
                                    <Text>Map View</Text>
                                </Button>
                            </FooterTab>
                        </Footer>

                    </Container>
                {/*</TouchableWithoutFeedback>*/}
            </Drawer>

        );
    };
}



const styles = StyleSheet.create({
    content: {
        backgroundColor: '#05a5d10d',
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
        height: 40,
        width: 300,
        paddingHorizontal: 16,
        borderTopWidth: 0,
        borderRightWidth: 0,
        borderLeftWidth: 0,
        borderBottomWidth: 0,
    }
});

export default createContainer(() => {
    Meteor.subscribe('categories-list');
    return {
        categories: Meteor.collection('service').find()
    }
}, Home);