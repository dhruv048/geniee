import React, { Component } from 'react';
import Meteor from 'react-native-meteor';
import Loading from "../components/Loading/Loading";
const USER_TOKEN_KEY = 'USER_TOKEN_KEY_GENNIE';
import { AsyncStorage} from 'react-native';


class LogOut extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount(){
       this._handleSignout()
    }
    componentDidMount(){
        // alert('called')
        // this._handleSignout
    }
    _handleSignout= () => {
        // Alert.alert(
        //     'SignOut',
        //     'Do you want to SignOut?',
        //     [
        //         {
        //             text: 'Yes SignOut', onPress: () => Meteor.logout((err) => {
        //                 if (!err)
        //                    goToRoute(this.props.componentId,'Auth')
        //             })
        //         },
        //         {text: 'Cancel', onPress: () => goBack(this.props.componentId)}
        //     ],
        //     {cancelable: false}
        // )

        Meteor.logout((err) => {
            if (!err){
                console.log('logout')
                AsyncStorage.setItem(USER_TOKEN_KEY, '');
                this.props.navigation.navigate('UnAuthorized');
            }
            else
                goBack(this.props.componentId)
        })
    }


    rerender = () => this.forceUpdate()

    render() {
        {this._handleSignout()}
        const {navigate} = this.props.navigation;
        return (
            <Loading/>
        );

    }
}



export default LogOut;
