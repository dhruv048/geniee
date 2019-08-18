import React, { Component } from 'react';
import { View, ListView, StatusBar ,Text,Image,Alert} from 'react-native';
import {  FlatListItem } from '../FlatListItem';
import Meteor, { createContainer } from 'react-native-meteor';
import CustomHeader from "../Header/index"
import HeaderMenu from "../Header/HeaderMenu";
import Icon  from 'react-native-vector-icons/FontAwesome';
import {colors} from "../../config/styles";
class ChatList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            refresh: false,
            id:null,
            chatUsers:[],
            categories:[],
        }
    }



    componentWillMount() {
        // let chanel = this.props.navigation.getParam('channel', null);
        // console.log(chanel._id)
        // if (chanel !== null || chanel !== undefined) {
        //     this.props.navigation.navigate('Chat', {channel: chanel});
        //
        // } else {
        //
        // }
    }

    componentWillReceiveProps(props) {

    }



    _getOpenChannelList = (init) => {
        if (init) {
            const openChannelListQuery = sbCreateOpenChannelListQuery();
            this.setState({ openChannelListQuery }, () => {
                this.props.getOpenChannelList(this.state.openChannelListQuery);
            });
        } else {

        }
    }

    _onListItemPress = (channel) => {
        this.props.navigation.navigate('Chat',{channel:channel});
    }

    _handleScroll = (e) => {
        // if (e.nativeEvent.contentOffset.y < -100 && !this.state.refresh) {
        //     this.setState({ list: [], openChannelList: ds.cloneWithRows([]), refresh: true }, () => {
        //         this._initOpenChannelList();
        //     });
        // }
    }

    _renderList = (rowData) => {
        if(rowData) {
            return (
                <View style={{padding: 5}}>
                    <StatusBar
                        backgroundColor={colors.statusBar}
                        barStyle='light-content'
                    />
                    <FlatListItem
                        key={rowData._id}
                        onListItemPress={() => {
                            this._onListItemPress(rowData)
                        }}
                        name={rowData.createdBy===this.props.user._id ? rowData.otherUser.name : rowData.createUser.name}
                        title={rowData.createdBy===this.props.user._id ? rowData.otherUser.name : rowData.createUser.name}
                    />
                </View>
            )
        }
    }

    render() {


            return (

                <View>
                    <CustomHeader
                        centerComponent={{text:'CHATS',style:{color:'white'}}}
                        leftComponent={<HeaderMenu/>}
                    />
                    <ListView
                        enableEmptySections={true}
                        renderRow={this._renderList}
                        dataSource={ds.cloneWithRows(this.props.channelList)}
                        onEndReached={() => this._getOpenChannelList(false)}
                        onEndReachedThreshold={-50}
                        onScroll={this._handleScroll}
                    />
                    {/*{chanel!==null? this.props.navigation.navigate('Chat',{channel:chanel}) :null}*/}
                </View>
            )
        }

}

const styles = {
};

const ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2
});

function mapStateToProps({ openChannel })  {
    const { list } = openChannel;
    return { list };
}

export default createContainer(()=>{
    Meteor.subscribe('get-channel');
    let categories=[]
    Meteor.subscribe('categories-list',()=>{
        categories=Meteor.collection('category').find();
    });
    // let chatUsers=[];
    // if(user.profile.role!==0){
    //     debugger;
    //     console.log('called');
    //     Meteor.subscribe('chatUsers',()=> {
    //         chatUsers = Meteor.users.find();
    //     })
    // }
    // else{
    //     chatUsers=[]
    // }

    return {
        user:Meteor.user(),
        channelList: Meteor.collection('chatChannels').find(),
    }
} ,ChatList);
