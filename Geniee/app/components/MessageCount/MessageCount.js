import React, {Component} from 'react';
import {
    Badge
} from 'react-native-paper';
import Meteor  from '../../react-native-meteor';
import {View} from 'react-native';
import {customGalioTheme} from "../../config/themes";


class MessageCount extends Component {
    constructor(props) {
        super(props);

    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    render() {
        // console.log(this.props.unreadMessages)
        return (
            <View
                // style={{position: 'absolute', top:-5,right:-5}}
            >
            {this.props.unreadMessages.length>0?
                <Badge style={{backgroundColor: customGalioTheme.COLORS.PRIMARY}}>
                    {this.props.unreadMessages.length}
                </Badge>:null}
            </View>
        );
    };
}

export default Meteor.withTracker(()=>{
    Meteor.subscribe('unreadMessageCount');
    return{
      unreadMessages : Meteor.collection('chatItems').find({$and:[{to: Meteor.userId()},{seen:false}]})
    }
})(MessageCount) ;