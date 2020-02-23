import React, {Component} from 'react';
import {Badge, Body, Card, CardItem, Container, Content, Header, Icon, Input, Text, Item} from "native-base";
import {Navigation} from 'react-native-navigation';
import {colors} from "../config/styles";
import {FlatList, StyleSheet, TouchableOpacity} from "react-native";
import Meteor from '../react-native-meteor';
class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            categories: [],
            refreshing:false,
        }
        this.categories=[];
    }

    componentDidMount() {
        Navigation.events().bindComponent(this);
    }

    componentDidAppear() {
        this.setState({text: 'componentDidAppear'});
        Meteor.call('getCategoriesGR', (err, res) => {
         //   console.log(err,res)
            if (!err) {
                this.setState({categories: res.result});
                this.categories=res.result;
            }
        })
    }

    componentDidDisappear() {
        console.log('componentDidDisappear-Dashboard');
    }
    _handleRefresh() {
        this.setState({refreshing: true});
        Meteor.call('getCategoriesGR', (err, res) => {
            //   console.log(err,res)
            if (!err) {
                this.setState({categories: res.result,refreshing:false})
                this.categories=res.result;
            }
            else{
                this.setState({refreshing:false})
            }
        })

    }
    goToUserList(Id){
        Navigation.push(this.props.componentId, {
            component: {
                name: "UserList",
                passProps: {
                    Id
                }
            }
        });
    };
    _onChangeSearchText(text){
        console.log(text);
        if(!text){
            this.setState({categories:this.categories});
        }
        else{
            let categories=this.categories;
            categories=categories.filter(item=>item.title.toUpperCase().includes(text.toUpperCase()));
            this.setState({categories});
        }
    }

    renderItem = ({item}) => {
        return (
            <TouchableOpacity style={{ flex: 1, margin: 5,maxWidth:'50%'   }} onPress={()=>this.goToUserList(item._id)}>
            <Card key={item._id} >
                <CardItem style={styles.imageThumbnail}>
                    <Badge info style={{height:80,alignItems:'center',width:80,borderRadius:40, justifyContent:'center'}}>
                    <Text style={{fontSize:50,fontWeight:'500',lineHeight:55}}>{item.hasOwnProperty('users') ?item.users.count:'0' }</Text>
                    </Badge>
                </CardItem>
                <CardItem style={{alignItems:'center', justifyContent:'center', fontSize:25,fontWeight:'500'}}>
                    <Text >{item.title}</Text>
                </CardItem>
            </Card>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <Container >
                <Header androidStatusBarColor={colors.statusBar} searchBar rounded style={{backgroundColor: colors.appLayout}}>
                    <Item>
                        <Icon name="ios-search" />
                        <Input
                            onChangeText={this._onChangeSearchText.bind(this)} // <-- Here
                            placeholder="Search"
                        />
                    </Item>
                </Header>
                <Content style={styles.MainContainer}>
                    {/*<Text>{this.state.text}</Text>*/}
                    <FlatList
                        data={this.state.categories}
                        renderItem={this.renderItem}
                        numColumns={2}
                        keyExtractor={(item, index) => index.toString()}
                        refreshing={this.state.refreshing}
                        onRefresh={this._handleRefresh.bind(this)}
                    />
                </Content>
            </Container>
        );
    }
};
const styles = StyleSheet.create({
    MainContainer: {
     //   justifyContent: 'center',
        flex: 1,
        paddingTop: 10,
    },
    imageThumbnail: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 100,
    },
});
export default Dashboard;