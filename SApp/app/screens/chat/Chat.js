import React, {Component} from 'react';
import {
    Header, Text, Container, Content, Thumbnail, Right, Left, Body, Button, ListItem, Card, Item, Input, Footer

} from 'native-base';

import {
    StyleSheet, StatusBar, View, FlatList, Image, Dimensions, ToastAndroid, ScrollView, TouchableOpacity

} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {colors} from "../../config/styles";
import Meteor, {withTracker} from 'react-native-meteor';
import settings from "../../config/settings";
import Moment from 'moment';
import MyFunctions from '../../lib/MyFunctions';
import ImagePicker from 'react-native-image-crop-picker';
import DocumentPicker from 'react-native-document-picker';
import FileViewer from 'react-native-file-viewer';

const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');
var RNFS = require('react-native-fs');

class Chat extends Component {
    getMessage = (message) => {
        const loggedUser = Meteor.userId();
        let Message = message.messageData;
        if (message.from != loggedUser)
            return (
                <View key={message._id} style={{padding: 3, marginRight: 35, marginLeft: 10, width: '100%'}}>
                    {Message.type === 'text' ?
                        <Text style={{
                            alignSelf: 'flex-start',
                            backgroundColor: colors.bgBrightYellow,
                            padding: 2
                        }}>{Message.message}</Text>
                        : <TouchableOpacity onPress={() => this._showFile(Message, false)}>
                            <View>
                                {Message.type.includes('image') ?
                                    <Image style={{
                                        alignSelf: 'flex-start',
                                        width: 200,
                                        height: 200,
                                        resizeMode: 'contain'
                                    }}
                                           source={{uri: settings.API_URL+'images/' + Message.src}}/>
                                    :
                                    <Icon style={{alignSelf: 'flex-start'}} name={'file-text'} size={50}/>}
                                <Text style={{
                                    alignSelf: 'flex-start',
                                    color: colors.appLayout
                                }}>{Message.fileName || ''}</Text>
                            </View>
                        </TouchableOpacity>
                    }
                    <Text style={{alignSelf: 'flex-start'}}
                          note>{Moment(message.messageOn).local().format('hh:mm A')}</Text>
                </View>
            )
        else return (
            <View key={message._id} style={{padding: 3, marginRight: 10, marginLeft: 35, padding: 2, width: '100%'}}>
                {Message.type === 'text' ?
                    <Text style={{alignSelf: 'flex-end', backgroundColor: 'white'}}>{Message.message}</Text>
                    :
                    <TouchableOpacity onPress={() => this._showFile(Message, false)}>
                        <View>
                            {Message.type.includes('image') ?
                                <Image style={{alignSelf: 'flex-end', width: 200, height: 200, resizeMode: 'contain'}}
                                       source={{uri: settings.API_URL+'images/' + Message.src}}/>
                                :
                                <Icon style={{alignSelf: 'flex-end'}} name={'file-text'} size={50}/>}
                            <Text
                                style={{alignSelf: 'flex-end', color: colors.appLayout}}>{Message.fileName || ''}</Text>
                        </View>
                    </TouchableOpacity>
                }
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'flex-end'
                }}>
                    <Text note>{Moment(message.messageOn).local().format('hh:mm A')}</Text>
                    {message.seen ?
                        <Icon name={'eye'} size={13} style={{color: colors.appLayout, marginHorizontal: 5}}/> :
                        <Icon name={'eye-off'} size={13} style={{color: 'black', marginHorizontal: 5}}/>
                    }
                </View>
            </View>

        )
    }
    _renderList = (data) => {
        let item = data.item;
        // console.log(item)
        return (
            <ListItem key={data.index} style={{flexDirection: 'column'}}>
                <Text style={{fontWeight: '500', color: colors.appLayout}}>{item._id}</Text>
                {item.messages.map((message, index) => this.getMessage(message)
                )}
            </ListItem>
        )
    }
    _sendMessage = () => {
        const chanelId=this.props.navigation.getParam('Channel').channelId;
        if (this.state.message) {
            let Message = {
                channelId: chanelId,
                data: {message: this.state.message, type: 'text'}
            };
            this._saveMessageToServer(Message);
        }
        if (this.state.files.length > 0) {
            this.state.files.map((file, index) => {
                Meteor.call('uploadChatFile', file,chanelId, (err, result) => {
                    if (err) {
                      console.log(err.reason);
                        ToastAndroid.showWithGravityAndOffset(
                            err.reason,
                            ToastAndroid.LONG,
                            ToastAndroid.TOP,
                            0,
                            80,
                        );
                    }
                    else {
                        console.log(result)
                        this._removeFile(index);
                    }
                });
            })
        }
    };

    _onViewChange = (info) => {
        const loggedUser = Meteor.userId();
        let messagesToUpdate = [];
        // console.log(info);
        let viewableItems = info.viewableItems;
        viewableItems.forEach(viewableItem => {
            if (viewableItem.isViewable) {
                viewableItem.item.messages.forEach(item => {
                    if (item.from != loggedUser && !item.seen) {
                        messagesToUpdate.push(item._id)
                    }
                })
            }
        })
        if (messagesToUpdate.length > 0) {
            Meteor.call('updateMessageSeen', messagesToUpdate, (err) => {
                if (err) {
                    console.log(err)
                }
            })
        }
    }
    _sendImageCamera = () => {
        ImagePicker.openCamera({
            includeBase64: true
        }).then(image => {
            console.log(image);
            const uri = `data:${image.mime};base64,${image.data}`;
            image.name = Meteor.userId() + Moment().format('DDMMYYx') + '.' + image.mime.substr(image.mime.indexOf('/') + 1);
            image.fileName = image.name;
            image.src = uri;
            this.setState(prevState => ({
                files: [...prevState.files, image]
            }))

            ImagePicker.clean().then(() => {
                console.log('removed all tmp images from tmp directory');
            }).catch(e => {
                alert(e);
            });
        });

    }
    _senFile = async () => {
        try {
            const file = await DocumentPicker.pick({
                type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
                readContent: true
            });
            // console.log(
            //     file
            // );
            RNFS.readFile(file.uri, 'base64')
                .then((encoded) => {
                    // Send it to a server
                    // console.log(encoded)
                    file.data = encoded;
                    file.mime = file.type;
                    file.fileName = file.name;
                    file.name = Meteor.userId() + Moment().format('DDMMYYx') + '.' + file.mime.substr(file.mime.indexOf('/') + 1);
                    // file.imagUri = file.mime.includes('image/') ? `data:${file.mime};base64,${file.data}` : null;
                    file.src = file.uri;
                    this.setState(prevState => ({
                        files: [...prevState.files, file]
                    }))
                })
                .catch((error) => console.error(error));
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
            } else {
                throw err;
            }
        }
    }
    _removeFile = (i) => {
        let files = [...this.state.files];
        files.splice(i, 1);
        this.setState({files});
    }

    constructor(props) {
        super(props);
        this.state = {
            message: "",
            files: [],
            modalItem: '',
            customModalVisible: false,
            allowDelete: false
        }
        this._sendMessage = this._sendMessage.bind(this);
        this.viewabilityConfig = {
            minimumViewTime: 100,
            viewAreaCoveragePercentThreshold: 50
        }
        this._onViewChange = this._onViewChange.bind(this);
        this._showFile = this._showFile.bind(this);
    }

    _saveMessageToServer(Message) {
           Meteor.call('addChatMessage', Message, (err) => {
               if (err) {

               }
               else {
                   this.setState({message: ""})

                   // this.flatList.scrollToOffset({offset: 0, animated: true});
               }
           })
       }



    componentDidMount() {

    }

    componentWillReceiveProps() {
    }

    componentWillUnmount() {

    }


    _showFile = (file, allowDelete) => {
        console.log(file)
        // this.setState({
        //     modalItem:file,
        //     customModalVisible:true,
        //     allowDelete:allowDelete
        // })
        if (allowDelete) {
            FileViewer.open(file.src, {showOpenWithDialog: true, displayName: file.fileName})
        }
        else {
            MyFunctions._openFile(settings.API_URL+'images/' + file.src, file.fileName)
        }
    }

    render() {
        const channel = this.props.navigation.getParam('Channel');
        console.log(channel)
        return (
            <Container>
                <StatusBar
                    backgroundColor={colors.statusBar}
                    barStyle='light-content'
                />
                <Header searchBar rounded style={{backgroundColor: colors.appLayout}}>
                    <Left>
                        <Button onPress={() => {
                            this.props.navigation.goBack()
                        }} transparent>
                            <Icon name='arrow-left' color='white' size={25}/>
                        </Button>


                    </Left>
                    <Body>
                    <Text style={{color: 'white', fontSize: 18, fontWeight: '500'}}>
                        {channel.user.name||''}
                    </Text>
                    <Text style={{color: 'white', fontSize: 14, fontWeight: '200'}}>
                        {channel.service.title||""}
                    </Text>
                    </Body>
                    <Right style={{margin: 7}}>
                        <Thumbnail
                            source={channel.user.profileImage ? {uri: settings.API_URL +'images/'+ channel.user.profileImage} : require('../../images/duser.png')}/>
                    </Right>
                </Header>
                <View style={styles.content}>
                    <FlatList
                        inverted
                        ref={ref => this.flatList = ref}
                        // onContentSizeChange={() => this.flatList.scrollToEnd({animated: true})}
                        // onLayout={() => this.flatList.scrollToEnd({animated: false})}
                        data={this.props.messages}
                        renderItem={this._renderList}
                        keyExtractor={(item, index) => index.toString()}
                        onViewableItemsChanged={this._onViewChange}
                        viewabilityConfig={this.viewabilityConfig}
                        onEndReachedThreshold={0.5}
                        onEndReached={(info) => {
                        }}
                    />
                    <ScrollView style={{marginHorizontal: 10, maxHeight: 400}}>
                        {this.state.files.map((file, index) => (
                            <TouchableOpacity onPress={() => this._showFile(file, true)} key={index}>
                                <View style={{
                                    marginVertical: 5, backgroundColor: colors.appLayout,
                                    flexDirection: 'row'
                                }}>

                                    <View style={{alignSelf: 'flex-start'}}>
                                        {file.mime.includes('application/') ?
                                            <Icon name="file-text" size={50}/>
                                            :
                                            <Thumbnail square medium onPress={() => this._showFile(file, true)}
                                                       source={{uri: file.src}}/>}
                                    </View>
                                    <View style={{alignSelf: 'center', width: '75%'}}>
                                        <Text style={{color: 'white'}} note>{file.fileName}</Text>
                                    </View>
                                    <View style={{alignSelf: 'flex-end'}}>
                                        <Button transparent style={{
                                            // ...StyleSheet.absoluteFillObject,
                                            // alignSelf: 'flex-end',
                                            // right: 0,
                                            // marginTop: -5,
                                            // position: 'absolute',
                                        }}
                                                onPress={() => this._removeFile(index)}
                                        >
                                            <Icon name='x-circle' size={25} color={'red'}/></Button>
                                    </View>

                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    {/*<View style={{flex:1}} >*/}
                    {/*<Modal*/}
                    {/*animationType="slide"*/}
                    {/*transparent={false}*/}
                    {/*visible={this.state.customModalVisible}*/}
                    {/*onRequestClose={() => {this.setState({customModalVisible:false})*/}
                    {/*}} >*/}
                    {/*{this.state.modalItem?*/}
                    {/*<View style={{flex:1}}>*/}
                    {/*{this.state.modalItem.type.includes('application/')?*/}

                    {/*<Icon name={'file'} size={100}/>:*/}
                    {/*<Image style={{flex: 1, alignSelf: 'stretch', width: undefined, height: undefined,resizeMode:'contain'}}*/}
                    {/*source={{uri: settings.IMAGE_URL + this.state.modalItem.src}}/>*/}
                    {/*}*/}
                    {/*<Button transparent style={{*/}
                    {/*...StyleSheet.absoluteFillObject,*/}
                    {/*alignSelf: 'flex-start',*/}
                    {/*left: 10,*/}
                    {/*marginTop: -5,*/}
                    {/*position: 'absolute',*/}
                    {/*}}*/}
                    {/*onPress={() => this.setState({customModalVisible:false})}*/}
                    {/*>*/}
                    {/*<Icon name='arrow-left' size={30} color={'blue'}/></Button>*/}
                    {/*<View style={{*/}
                    {/*...StyleSheet.absoluteFillObject,*/}
                    {/*left:10,*/}
                    {/*bottom: 10,*/}
                    {/*marginVertical:20,*/}
                    {/*position: 'absolute',*/}
                    {/*}}>*/}
                    {/*<Text style={{color:colors.appLayout,fontWeight:'500'}}>{this.state.modalItem.fileName||''}</Text>*/}
                    {/*</View>*/}
                    {/*</View>:null}*/}
                    {/*</Modal>*/}
                    {/*</View>*/}
                </View>
                <Footer style={{backgroundColor: 'white', flexDirection: 'column'}}>
                    <Item style={{width: '90%',}}>
                        <Input
                            placeholder={'Write Message'}
                            value={this.state.message}
                            onChangeText={(message) => {
                                this.setState({message})
                            }}/>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center',}}>
                            <Button transparent onPress={this._senFile}>
                                <Icon name='paperclip' size={25}/></Button>
                            <Button transparent style={{marginHorizontal: 5}} onPress={this._sendImageCamera}>
                                <Icon name='camera' size={25}/></Button>
                            <Button transparent onPress={this._sendMessage}>
                                <Icon
                                    style={{color: this.state.message.length > 1 || this.state.files.length > 0 ? colors.appLayout : undefined}}
                                    name='send' size={25}/></Button>
                        </View>
                    </Item>
                </Footer>
            </Container>
        );
    };
}


const styles = StyleSheet.create({
    content: {
        backgroundColor: colors.appBackground,
        flex: 1
    }
});

export default withTracker((props) => {
    let channel = props.navigation.getParam('Channel');
    Meteor.subscribe('chatItemsGroupByDate',channel.channelId)
    Meteor.subscribe('chatUsers',channel.channelId);
    console.log(Meteor.collection('users').find())
    return {
        messages: Meteor.collection('chatItems').find({}, {$sort: {_id: -1}}),
        user:Meteor.collection('users').findOne({_id:channel.user.userId})
    }
})(Chat);