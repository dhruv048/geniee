import  React,{Component} from 'react';
import {colors} from "../config/styles";
import {Body, Card, CardItem, Container, Content, Header, Left, Text, Title,Button} from "native-base";
import {FlatList, Image, StyleSheet, TouchableOpacity} from "react-native";
import settings from "../config/settings";
import {Navigation} from "react-native-navigation";
import Meteor from "../react-native-meteor";
import Icon from 'react-native-vector-icons/Feather';
class UserList extends Component
{
    constructor(props){
        super(props);
        this.state={
            users:[],
            refreshing:false
        }
    }
    componentDidMount() {
        Navigation.events().bindComponent(this);
    }

    componentDidAppear() {
        const { Id } = this.props;
        Meteor.call('getUserbyCatId',Id, (err, res) => {
           // console.log(err,res)
            if (!err) {
                this.setState({users: res})
            }
        })
    }

    componentDidDisappear() {
        console.log('componentDidDisappear-UserList');
    }
    onUserPress(User){
        Navigation.push(this.props.componentId, {
            component: {
                name: "Profile",
                passProps: {
                    User
                }
            }
        });
    }

    _handleRefresh() {
        const {Id} = this.props;
        this.setState({refreshing: true});
        Meteor.call('getUserbyCatId',Id, (err, res) => {
            //   console.log(err,res)
            if (!err) {
                this.setState({users: res, refreshing: false})
            }
            else {
                this.setState({refreshing: false})
            }
        })
    }
    renderItem = ({item}) => {
        return (
            <TouchableOpacity style={{ flex: 1, margin: 10 , maxWidth:'50%' }} onPress={()=>this.onUserPress(item)}>
            <Card key={item._id} >
                <CardItem style={styles.imageThumbnail}>
                   <Image style={{height:80, width:80, borderRadius:40}} square source={{uri:settings.IMAGE_URL+item.profilepic}}/>
                </CardItem>
                <CardItem style={{alignItems:'center', justifyContent:'center', fontSize:25,fontWeight:'500',flexDirection:'column'}}>
                    <Text >{item.fullname}</Text>
                    <Text >{item.contact}</Text>
                </CardItem>
            </Card>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <Container >
                <Header androidStatusBarColor={colors.statusBar} style={{backgroundColor: colors.appLayout}}>
                    <Left>
                        <Button transparent onPress={()=>{Navigation.pop(this.props.componentId)}}>
                            <Icon name={'arrow-left'} size={29} color={'white'}/>
                        </Button>
                    </Left>
                    <Body>
                    <Title>Users</Title>
                    </Body>
                </Header>
                <Content style={styles.MainContainer}>
                    {/*<Text>{this.state.text}</Text>*/}
                    <FlatList
                        data={this.state.users}
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
}
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
export default UserList;
