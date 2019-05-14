import React from 'react';
import { Platform} from 'react-native';
import { Header} from 'react-native-elements';


class CustomHeader extends React.Component{
    constructor(props){
        super(props)
    }
    render() {
        return (
            <Header
                containerStyle={{
                    backgroundColor: '#094c6b',
                    justifyContent: 'space-around',
                    paddingTop: 2,
                    height: Platform.OS === 'ios' ? 70 : 70 - 24,
                }}
                statusBarProps={{barStyle: 'light-content'}}
                rightComponent={this.props.rightComponent}
                centerComponent={this.props.centerComponent}
                leftComponent={this.props.leftComponent}
            />
        );
    }
};

export default CustomHeader;
