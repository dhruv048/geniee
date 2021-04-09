import React, { PureComponent } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { Badge } from 'react-native-paper';
import { colors } from '../../config/styles';
import { TouchableOpacity } from 'react-native';
import Meteor from '../../react-native-meteor';


class NotificationIcon extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            notificationCount: 0
        };
    }

    componentDidMount(){
        // console.log(this.props)
        if (this.props.notificationCount.length > 0)
        this.setState({
            notificationCount: this.props.notificationCount[0].totalCount,
        });
    };

    componentWillReceiveProps(newProps) {
        // console.log(newProps)
        if (newProps.notificationCount.length > 0) {
            //console.log(newProps.notificationCount)
            this.setState({
                notificationCount: newProps.notificationCount[0].totalCount,
            });
        }
    }

    render() {
        return (
            <TouchableOpacity style={{marginHorizontal:5}}
                onPress={() => navigation.navigate('CartEF')}
            >
                <Icon name="bell" style={{ fontSize: 22, color: 'white' }} />
                {this.state.notificationCount > 0 ? (
                    <Badge  style={{ position: 'absolute', top: -10, right: -7, borderWidth: 2, borderColor: colors.appLayout }}>
                        {this.state.notificationCount}
                    </Badge>
                ) : null}
            </TouchableOpacity>
        );
    }
}


export default Meteor.withTracker(() => {
    return {
        notificationCount: Meteor.collection('newNotificationCount').find(),
    };
})(NotificationIcon);
