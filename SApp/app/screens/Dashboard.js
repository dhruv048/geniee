import React, {Component} from 'react';
import Meteor, {withTracker} from 'react-native-meteor';
import {StyleSheet, Dimensions, StatusBar, View, Image, TouchableOpacity,ScrollView} from 'react-native';
import PropTypes from 'prop-types';
import {Header, Container, Content, Item, Body, Left, Right, Text, Input} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import {colors} from '../config/styles';
import SplashScreen from "react-native-splash-screen";
// import { Header } from 'react-native-elements';

const window = Dimensions.get('window');

class Dashboard extends Component {
    static navigationOptions = {
        drawerIcon: (
            <Image source={require('../images/settings.png')}
                   style={{height: 25, width: 25}}/>
        )
    }

    constructor(props){
        super(props)
        this.state={
            categories:[],
            loading:true,
        };
        this.arrayholder;
        this.currentSearch='';
    }
    componentDidMount() {
        Meteor.subscribe('categories-list',()=>{
            SplashScreen.hide();
            this.setState({categories:Meteor.collection('MainCategories').find(),loading:false})
        });
        this.arrayholder=Meteor.collection('MainCategories').find();
    }

    _search=(text)=>{
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
                `${item.title.toUpperCase()} ${item.description.toUpperCase()}`;
            return itemData.indexOf(textData) > -1;
        });
        this.setState({categories: newData, loading: false});
    };

    _itemClick=(item)=>{
        let Ids=[];
       item.subCategories.map(item=>{
            Ids.push(item.subCatId)
        })
        this.props.navigation.navigate("Home", {Id:Ids})
    }

    render() {
        return (
            <Container style={{flex:1,backgroundColor: colors.appBackground}}>
                <StatusBar
                    backgroundColor={colors.statusBar}
                    barStyle='light-content'
                />
                <Header style={{backgroundColor: '#094c6b'}}>

                    <Body style={{flexDirection: 'row',marginHorizontal:30}}>
                    <Item style={{height: 40, flex: 4}}>
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
                <ScrollView style={{width: '100%', flex: 1}}>
                    <View style={styles.mainContainer}>
                    {this.state.categories.map(item => (
                        <View key={item._id} style={styles.containerStyle}>
                            <TouchableOpacity onPress={() => this._itemClick(item)}>
                                <Body>
                                <Icon name={item.icon} size={40}/>
                                </Body>

                                <Text>
                                    <Text>{item.mainCategory}</Text>
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                    </View>
                </ScrollView>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent:'space-around'

    },
    containerStyle: {
        padding: 10,
        backgroundColor: 'white',
        borderWidth: 0,
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10,
        borderColor: '#808080',
        marginTop: 10,
        elevation: 10,
        width: '43%',
        height:100,
        borderRadius: 5,
        justifyContent:'center',
        alignItems:'center'
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
    console.log(Meteor.collection('MainCategories').find())
    return {
        categories: Meteor.collection('MainCategories').find()
    }
})(Dashboard);
Dashboard.defaultProps={
    categories: [],
}



