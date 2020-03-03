import React, {Component} from 'react';
import {
    Header, Text, Container, Content, Badge, Right, Left, Body, Button, ListItem, Card, CardItem, Thumbnail
} from 'native-base';

import {
    StyleSheet, StatusBar, View, FlatList, BackHandler,TouchableWithoutFeedback
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {colors} from "../../config/styles";
import {settings} from "../../config/settings";
import Meteor from '../../react-native-meteor';
import Moment from "moment/moment";
import {Navigation} from "react-native-navigation/lib/dist/index";
import CogMenu from "../../components/CogMenu";
import {backToRoot, goToRoute, navigateToRoutefromSideMenu} from "../../Navigation";

class ChatList extends Component {
    constructor(props) {
        super(props);
        this._handlePress = this._handlePress.bind(this);
        this.state = {
            chatList: [],
        }
    }

    componentDidMount() {
        Navigation.events().bindComponent(this);
        this.setState({chatList: this.props.chatChannels})
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));

    }



    handleBackButton(){
        console.log('handlebackpress')
        // navigateToRoutefromSideMenu(this.props.componentId,'Dashboard');
        backToRoot(this.props.componentId);
        return true;
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress');
    }
    componentWillReceiveProps(newProps) {
        this.setState({chatList: []})
        let sorteData = newProps.chatChannels.sort((a, b) => {
            if (!a.hasOwnProperty('latestMessage') || !a.latestMessage.hasOwnProperty('messageOn')) {
                if (!b.hasOwnProperty('latestMessage') || !b.latestMessage.hasOwnProperty('messageOn'))
                    return 0;
                else
                    return 1
            }
            else if (!b.hasOwnProperty('latestMessage') || !b.latestMessage.hasOwnProperty('messageOn')) {
                return 0;
            }
            else if (Moment(a.latestMessage.messageOn).isBefore(Moment(b.latestMessage.messageOn))) {
                return 1;
            }
            else if (Moment(a.latestMessage.messageOn).isAfter(Moment(b.latestMessage.messageOn))) {
                return -1
            }
            else {
                return 0;
            }
        });
        // console.log('received new props..', newProps.chatChannels)
        // console.log('sortedData', sorteData);
        this.setState({chatList: sorteData})
    }
    _handlePress = (channel) => {
        let Channel = {
            channelId: channel._id,
            user: {
                userId: channel.user._id,
                name: channel.user.profile.name||'',
                profileImage: channel.user.profile.profileImage||'',
            },
            service:channel.service
        }
        goToRoute(this.props.componentId,'Message', {Channel: Channel})
    }

    _renderList = (data) => {
        const logged = Meteor.userId()
        let item = data.item;
        console.log(item)
        item.Message = item.latestMessage ?  item.latestMessage.messageData: null;
        item.user = item.Users.find(item => item._id !== logged);

        return (
            <View key={data.item._id} style={styles.serviceList}>
                <TouchableWithoutFeedback onPress={() => {
                    this._handlePress(item)
                }}>
                    <ListItem thumbnail>
                        <Left>

                            <Thumbnail
                                source={item.user.profile.profileImage ? {uri: settings.IMAGE_URL+'images/' + item.user.profile.profileImage} : require('../../images/duser.png')}/>
                        </Left>
                        <Body>
                            <View style={{flexDirection: 'row'}}>
                                <Text>{item.user.profile.name}</Text>
                                {item.unreadMessagesCount > 0 ?
                                    <View style={{alignSelf: 'flex-end'}}>
                                        <Badge style={{backgroundColor: colors.appLayout, height: 20}}>
                                            <Text style={{
                                                fontSize: 12,
                                                fontWeight: '200',
                                                color: 'white',
                                                lineHeight: 20
                                            }}>{item.unreadMessagesCount}</Text>
                                        </Badge>
                                    </View>
                                    : null
                                }
                            </View>
                            {item.Message ?
                                <View style={{flexDirection: 'row'}}>
                                    {item.Message.type == 'text' ?
                                        <Text note numberOfLines={2}>{item.Message.message}</Text> : <Icon name={'file'} size={20}/>}
                                    
                                </View>
                                : null
                            }
                        </Body>
                        {item.Message ?
                        <Right>
                        {item.latestMessage.from !== logged ?
                                        <Text style={{alignSelf: 'flex-end'}} note>{Moment(item.latestMessage.messageOn).local().fromNow()}</Text>
                                        // <Text style={{alignSelf: 'flex-end'}} note>{Moment(item.latestMessage.messageOn).local().format('hh:mm A')}</Text>
                            :
                                        <View style={{
                                            flexDirection: 'row',
                                            alignSelf: 'flex-end',
                                        }}>
                                            {/*<Text style={{alignSelf: 'flex-end'}} note>{Moment(item.latestMessage.messageOn).local().format('hh:mm A')}</Text>*/}
                                            <Text style={{alignSelf: 'flex-end'}} note>{Moment(item.latestMessage.messageOn).local().fromNow()}</Text>
                                            {item.latestMessage.seen ?
                                                <MaterialIcon name={'done-all'} size={13}
                                                style={{color: colors.appLayout, marginHorizontal: 5}}/> :
                                                <MaterialIcon name={'done'} size={13} style={{color: '#8E8E8E', marginHorizontal: 5}}/>
                                            }
                                        </View>}
                        </Right>
                        : null
                    }
                    </ListItem>
                </TouchableWithoutFeedback>
            </View>
        )
    }

    render() {

        return (
            <Container>
                <StatusBar
                    backgroundColor={colors.statusBar}
                    barStyle='light-content'
                />
                <Header searchBar rounded style={{backgroundColor: colors.appLayout}}>
                    <Left>
                        {/*<Button onPress={() => Navigation.pop(this.props.componentId)} transparent>*/}
                            {/*<Icon name='arrow-left' color='white' size={25}/>*/}
                        {/*</Button>*/}

                        <CogMenu componentId={this.props.componentId}/>
                    </Left>
                    <Body>
                    <Text style={{color: 'white'}}>
                        Messages
                    </Text>
                    </Body>
                    {/*<Right style={{margin: 7}}>*/}
                    {/*<Button onPress={() => {*/}
                    {/*goToRoute(this.props.componentId,'AddHospital')*/}
                    {/*}} transparent>*/}
                    {/*<Icon name='plus' color='white' size={25}/>*/}
                    {/*</Button>*/}
                    {/*</Right>*/}
                </Header>
                <Content style={styles.content}>
                    <FlatList
                        data={this.state.chatList}
                        renderItem={this._renderList}
                        keyExtractor={item => item._id}
                    />
                </Content>
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
        backgroundColor: '#094c6b0a',
        //marginVertical: 5,
        //marginHorizontal: '2%',
        borderRadius: 0,
        borderBottomColor: '#094c6b',
        borderBottomWidth: 5,
        paddingVertical: 10
    },
});

export default Meteor.withTracker(() => {
    return {
        chatChannels: Meteor.collection('chatChannels').find()
    }
})(ChatList);