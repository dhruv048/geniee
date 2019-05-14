import React from 'react';
import { Platform} from 'react-native';
import { Header} from 'react-native-elements';
import {withNavigation} from 'react-navigation'


class CustomHeader extends React.Component{
    constructor(props){
        super(props)
    }
    render() {
        return (
            <Header
                containerStyle={{
                    backgroundColor: '#05a5d10d',
                    justifyContent: 'space-around',
                    paddingTop: 2,
                }}
                statusBarProps={{barStyle: 'light-content'}}
                rightComponent={this.props.rightComponent}
                centerComponent={this.props.centerComponent}
                leftComponent={this.props.leftComponent}
                outerContainerStyles={{height: Platform.OS === 'ios' ? 70 : 70 - 24, padding: 2}}
            />
        );
    }
};

export default withNavigation( CustomHeader);
