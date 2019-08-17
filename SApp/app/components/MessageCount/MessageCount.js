import React, {Component} from 'react';
import {
    Text,Badge
} from 'native-base';
import Meteor, {withTracker} from 'react-native-meteor';
import {View} from 'react-native';


class MessageCount extends Component {
    constructor(props) {
        super(props);

    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }


    render() {
        console.log(this.props.unreadMessages)
        return (
            <View style={{position: 'absolute', top:-5,right:-5}}>
            {this.props.unreadMessages.length>0?
                <Badge  style={{height:18,padding:2}}>
                    <Text style={{fontSize:8, fontWeight:'100', lineHeight:18}}>{this.props.unreadMessages.length}</Text>
                </Badge>:null}
            </View>
        );
    };
}

export default withTracker(()=>{
    Meteor.subscribe('unreadMessageCount');
    return{
      unreadMessages : Meteor.collection('chatItems').find({$and:[{to: Meteor.userId()},{seen:false}]})
    }
})(MessageCount) ;