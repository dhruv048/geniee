import React from 'react';
import {TouchableOpacity, Image, StyleSheet, View, Modal, ToastAndroid} from 'react-native';
import {Button, Text} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import ImagePicker from 'react-native-image-crop-picker';
import Meteor from '../../react-native-meteor';
import settings, {getProfileImage} from '../../config/settings';
import Moment from "moment/moment";
import ActionSheet from 'react-native-actionsheet';
import {colors} from "../../config/styles";

class UploadProfilePic extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            avatarSource: null,
            modalVisible:false,
            user:Meteor.user()
        }
        // this.setModalVisible = this.setModalVisible.bind(this);
        // this._handleImageUpload=this._handleImageUpload(this);
        // this._onImageChange=this._onImageChange.bind(this);
    }

    componentDidMount(){
        this.setState({
            user:this.props.user,
            avatarSource: this.props.user? this.props.user.profile.profileImage : null
        })
    }

    componentWillReceiveProps(newProps){
        console.log('newProps.user',newProps.user)
        if(newProps.user && this.props.user!==newProps.user){
            this.setState({
                user:newProps.user,
                avatarSource: newProps.user.profile.profileImage
            })
        }
    }

    setModalVisible(visible) {
        if(this.state.user) {
            this.setState({modalVisible: visible});
        }
    }
    _handleImageUpload = (selected) => {
        this.setModalVisible(false);
        if(selected == 0){
            ImagePicker.openCamera({
                width: 200,
                height: 200,
                cropping: true,
                includeBase64:true
            }).then(image => {
                console.log(image);
                this._onImageChange(image)
            });
        }
        else if (selected == 1){
            ImagePicker.openPicker({
                width: 200,
                height: 200,
                cropping: true,
                includeBase64:true
            }).then(image => {
                console.log(image);
                this._onImageChange(image)
            });
        }
    };
    _onImageChange=(image)=>{
        const uri=`data:${image.mime};base64,${image.data}`;
        image.name = Meteor.userId() + Moment().format('DDMMYYx') + '.' + image.mime.substr(image.mime.indexOf('/') + 1);
        Meteor.call('uploadProfileImage', uri, (err, result) => {
                if(!err) {
                    console.log(result);
                    this.setState({
                        // avatarSource:uri,
                        avatarSource: result,
                        //  avatarSource:{ uri:  image.path }

                    });
                }
                else{
                    ToastAndroid.showWithGravityAndOffset(
                       err.reason,
                        ToastAndroid.LONG,
                        ToastAndroid.TOP,
                        0,
                        80,
                    );
                }
        })
        ImagePicker.clean().then(() => {
            console.log('removed all tmp images from tmp directory');
        }).catch(e => {
            alert(e);
        });
    }

    render() {

        return (
            <View style={{justifyContent:'center', alignItems:'center', marginTop: 20, marginLeft:20}}>
                {this.state.user?
                <TouchableOpacity style={styles.imageView} onPress={() => {
                    this.ActionSheet.show()
                }}>
                        <Image style={{
                            width: 75,
                            height: 75,
                            borderRadius: 75,
                            borderWidth: 3,
                            justifyContent: `center`,
                            alignSelf: 'center',
                            borderColor: `rgba(87, 150, 252, 1)`,
                            backgroundColor:'white',
                        }} source={this.state.avatarSource? {uri:getProfileImage(this.state.avatarSource)} : require('../../images/user-icon.png')}/>
                    {/* {this.state.user?
                    <Icon name="camera" color="#4F8EF7" size={25} style={{ position: 'absolute', bottom: 0, left: 90 }} />
                    :null} */}

                </TouchableOpacity>:
                    <Image style={{width: 75, height: 75}}
                           source={require('../../images/logo2-trans-640X640.png')} />}
                {/*<Text style={{fontSize:16,fontWeight:"400",color:'white'}}>WELLCOME</Text>*/}
                {/*{this.state.user?*/}
                    {/*<Text style={{fontSize:14,fontWeight:"200",color:'white'}}>{this.state.user.profile.name}</Text>:null}*/}

                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    title={'Please select the option'}
                    options={[<Text style={{color: colors.text_muted}}>Take Picture from Camera</Text>,
                        <Text style={{color: colors.text_muted}}>Pick Image from Gallery</Text>, 'Cancel']}
                    cancelButtonIndex={2}
                    destructiveButtonIndex={2}
                    onPress={(index) => {
                        this._handleImageUpload(index)
                    }}
                />

                <View style={{marginTop: 22}}>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.modalVisible}
                        onRequestClose={() => {
                            this.setModalVisible(false)
                        }}>
                        <View style={{
                            flex: 1,
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>

                            <View style={{
                                backgroundColor: 'white',
                                width: 350,
                                height: 200,
                                padding: 30,

                            }}>

                                <Button block bordered info onPress={()=>{
                                    this._handleImageUpload('key0')}
                                }>
                                    <Text style={styles.item_text}>Picture from Camera</Text>
                                </Button>
                                <Button style={{marginTop: 10}} info block bordered onPress={
                                    ()=>{ this._handleImageUpload('key1')}
                                }>
                                    <Text style={styles.item_text}>Picture from Gallery </Text>
                                </Button>
                                <Button transparent danger onPress={() => {
                                    this.setModalVisible(false)
                                }}>
                                    <Text>Cancel</Text>
                                </Button>
                            </View>
                        </View>
                    </Modal>
                </View>
            </View>
        )
    }

};

export default Meteor.withTracker(()=>{
    return{
        user:Meteor.user()
    }
})(UploadProfilePic);

const styles = StyleSheet.create({
    imageView: {
        // alignSelf: `center`,
        // borderColor: `rgba(87, 150, 252, 1)`,
        // borderRadius: 75,
        // borderWidth: 3,
        // height: 150,
        // justifyContent: `center`,
        // marginTop: 50,
        // width: 150
    },
    sfe09f185: {
        color: `rgba(87, 150, 252, 1)`,
        fontSize: 60
    },
})