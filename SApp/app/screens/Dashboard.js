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
import PropTypes from 'prop-types';
import {Header, Container, Content, Item, Body, Left, Button,Right, Text, Input} from 'native-base';
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

    constructor(props) {
        super(props)
        this.state = {
            categories: [],
            loading: true,
        };
        this.arrayholder;
        this.currentSearch = '';
    }

    componentDidMount() {
        Meteor.subscribe('categories-list');
        SplashScreen.hide();
        this.setState({categories: Meteor.collection('MainCategories').find(), loading: false})
        this.arrayholder = Meteor.collection('MainCategories').find()
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
        this.props.navigation.navigate("Home", {Id: Ids})
    }

    renderItem = (data, index) => {
        var item = data.item;
        return (
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



