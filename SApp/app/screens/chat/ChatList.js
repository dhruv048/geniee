import React, {Component} from 'react';
import {
    Header, Text, Container, Content, Item, Right, Left, Body, Button, ListItem, Card, CardItem, Thumbnail
} from 'native-base';

import {
    StyleSheet, StatusBar, View, FlatList, TouchableOpacity

} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {colors} from "../../config/styles";
import {settings} from "../../config/settings";
import Meteor, {withTracker} from 'react-native-meteor';
import Moment from "moment/moment";

class ChatList extends Component {
    constructor(props) {
        super(props);
        this._handlePress = this._handlePress.bind(this)
    }

    componentDidMount() {

    }


    componentWillUnmount() {

    }

    _handlePress = (channel) => {
        let Channel = {
            channelId: channel._id,
            user: {
                userId: channel.user._id,
                name: channel.user.profile.name,
                profileImage: channel.user.profile.profileImage,
            },
            service:channel.service
        }
        this.props.navigation.navigate('Message', {Channel: Channel})
    }

    _renderList = (data) => {
        const logged = Meteor.userId()
        let item = data.item;
        console.log(item)
        item.Message = item.latestMessage ?  item.latestMessage.messageData: null;
        item.user = item.Users.find(item => item._id !== logged);

        return (
            <ListItem style={{width: '100%'}} key={data.item._id}>
                <TouchableOpacity onPress={() => {
                    this._handlePress(item)
                }}>
                    <View style={{flexDirection: 'row', width: '100%'}}>
                        <View>
                            <Thumbnail
                                source={item.user.profile.profileImage ? {uri: settings.IMAGE_URL+'images/' + item.user.profile.profileImage} : require('../../images/duser.png')}/>
                        </View>
                        <View style={{marginHorizontal: 10}}>
                            <Text>{item.user.profile.name}</Text>
                            {item.Message ?
                                <View style={{flexDirection: 'row'}}>
                                    {item.Message.type == 'text' ?
                                        <Text note>{item.Message.message}</Text> : <Icon name={'file'} size={20}/>}
                                    {item.latestMessage.from !== logged ?
                                        <Text style={{alignSelf: 'flex-end'}}
                                              note>{Moment(item.latestMessage.messageOn).local().format('hh:mm A')}</Text> :
                                        <View style={{
                                            flexDirection: 'row',
                                            alignSelf: 'flex-end',
                                        }}>
                                            <Text style={{alignSelf: 'flex-end'}}
                                                  note>{Moment(item.latestMessage.messageOn).local().format('hh:mm A')}</Text>
                                            {item.latestMessage.seen ?
                                                <Icon name={'eye'} size={13}
                                                      style={{color: colors.appLayout, marginHorizontal: 5}}/> :
                                                <Icon name={'eye-off'} size={13}
                                                      style={{color: 'black', marginHorizontal: 5}}/>
                                            }
                                        </View>}
                                </View>
                                : null
                            }
                        </View>
                    </View>
                </TouchableOpacity>
            </ListItem>
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
                        <Button onPress={() => {
                            this.props.navigation.navigate('Home')
                        }} transparent>
                            <Icon name='arrow-left' color='white' size={25}/>
                        </Button>
                    </Left>
                    <Body>
                    <Text style={{color: 'white'}}>
                        Messages
                    </Text>
                    </Body>
                    {/*<Right style={{margin: 7}}>*/}
                    {/*<Button onPress={() => {*/}
                    {/*this.props.navigation.navigate('AddHospital')*/}
                    {/*}} transparent>*/}
                    {/*<Icon name='plus' color='white' size={25}/>*/}
                    {/*</Button>*/}
                    {/*</Right>*/}
                </Header>
                <Content style={styles.content}>
                    <FlatList
                        data={this.props.chatChannels}
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
    }
});

export default withTracker(() => {
    return {
        chatChannels: Meteor.collection('chatChannels').find()
    }
})(ChatList);