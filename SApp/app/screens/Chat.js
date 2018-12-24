import React, { Component } from 'react';
import { View, ListView ,Alert} from 'react-native';
import Meteor, { createContainer } from 'react-native-meteor';
import Message from "../components/Chat/Message";
import {ChatInput} from "../components/Chat/ChatInput";
import {MessageItem }from "../components/Chat/MessageItem";
import Icon  from 'react-native-vector-icons/FontAwesome';
import Moment from 'moment';
import CustomHeader from "../components/Header";

class Chat extends Component {

    constructor(props) {
        super(props);
        this.state = {
            previousMessageListQuery: null,
            textMessage: ''
        }
    }

    componentDidMount() {
        this.setState({
            channel:this.props.navigation.getParam('channel'),
        })
    }

    _onBackButtonPress = () => {
        const { channelUrl } = this.props.navigation.state.params;
        this.props.channelExit(channelUrl);
    }

    componentWillReceiveProps(props) {
        const { exit } = props;
        if (exit) {
            this.props.navigation.goBack();
        }
    }

    _onTextMessageChanged = (textMessage) => {
        this.setState({ textMessage });
    }



    _onPress=()=>{}
    _onSendButtonPress = () => {
        this._sendMessage('text', this.state.textMessage);
    }

    _sendMessage=(type,message)=>{
        let Message= {
            channelId: this.state.channel._id,
            chat:{type:type,message: message},
            To: this.state.channel.createdBy===this.props.user._id ? this.state.channel.otherUser._id : this.state.channel.createdBy
        }

        Meteor.call('addChatItem',Message,(err,res)=>{
            if(err){
                Alert.alert(err);
            }
            else{
                this.setState({textMessage:''})
            }
        })
    }
    _renderList = (rowData) => {
        if (rowData) {
            return (
                <Message
                    key={rowData._id }
                    isShow={true}
                    isUser={rowData.From===this.props.user._id? true: false}
                    profileUrl={require('../images/rn-logo.png')}
                    nickname={this.props.nickname}
                    time={Moment(rowData.createdAt).fromNow()}
                    message={(
                        <MessageItem
                            isUser={rowData.From===this.props.user._id? true: false}
                            message={rowData.chat.message}
                        />
                    )}
                    onPress={()=>{this._onPress}}
                />
            )
        } else { // FileMessage/AdminMessage
            return (<View></View>)
        }
    }
    static navigationOptions={
        drawerIcon:(
            <Icon  size={24} name="comments"></Icon>
        )
    }

    render() {
        const channel=this.props.navigation.getParam('channel')
        Moment.locale('en');
        const chatInput=(
        <ChatInput
            onRightPress={this._onSendButtonPress}
            textMessage={this.state.textMessage}
            onChangeText={this._onTextMessageChanged}
        />
        )
        return (
            <View style={styles.containerViewStyle}>
                <CustomHeader
                    centerComponent={{text:channel.createdBy===this.props.user._id ? channel.otherUser.name : channel.createUser.name,style:{color:'white'}}}
                    leftComponent={ <Icon color='white' size={30} name="arrow-left" onPress={() => {
                        this.props.navigation.navigate('ChatList')}}></Icon>}
                />
                <View style={styles.messageListViewStyle}>
                    <ListView
                        enableEmptySections={true}
                        renderRow={this._renderList}
                        dataSource={ds.cloneWithRows(this.props.messageList)}
                        onEndReachedThreshold={-100}
                    />
                </View>
                <View style={styles.messageInputViewStyle}>
                    {chatInput}

                </View>
            </View>
        )
    }
}

const ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2
})

function mapStateToProps({ chat }) {
    const { exit } = chat;
    list = ds.cloneWithRows(sbAdjustMessageList(chat.list));
    return { list, exit }
}

export default createContainer((props)=>{
    const channel=props.navigation.getParam('channel');
    const user= Meteor.user();
    Meteor.subscribe('chat-list',channel._id);
    return {
        user:Meteor.user(),
        nickname: channel.createdBy===user._id? channel.otherUser.name : channel.createUser.name,
        list:[{
            isUserMessage:true,
            isUser:true,
            channelId: 1,
            messageId: 1,
            reqId: 1,
            message:"My Message here",
            customType: '',
            data:{data:'data'},
                sender: {isShow:true,profileUrl:'../images/RoshanShah.jpg',nickname:'Rosn'},
            createdAt: "Today",
            updatedAt: "Today"
        },
            {
                isUserMessage:true,
                isUser:false,
                channelId: 1,
                messageId: 2,
                reqId: 2,
                message:"My Message here",
                customType: '',
                data:{data:'data'},
                sender: {isShow:true,profileUrl:'../images/RoshanShah.jpg',nickname:'Rosn'},
                createdAt: "Today",
                updatedAt: "Today"
            }],
        messageList:Meteor.collection('chatItems').find({},{sort:{createdAt:-1}})
    }
},Chat);

const styles = {
    renderTypingViewStyle: {
        flexDirection: 'row',
        marginLeft: 14,
        marginRight: 14,
        marginTop: 4,
        marginBottom: 0,
        paddingBottom: 0,
        height: 14
    },
    containerViewStyle: {
        backgroundColor: '#fff',
        flex: 1
    },
    messageListViewStyle: {
        flex: 10,
        transform: [{ scaleY: -1 }]
    },
    messageInputViewStyle: {
        flex: 1,
        marginBottom: 8,
        flexDirection: 'column',
        justifyContent: 'center'
    }
};
