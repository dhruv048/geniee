import React from 'react';
import { View} from 'react-native';
import Icon  from 'react-native-vector-icons/FontAwesome';
import {withNavigation} from "react-navigation";
class HeaderMenu extends React.Component{
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View style={{marginLeft: 5, flexDirection: 'row',alignItems: 'center',justifyContent: 'center'}}>

                <Icon name="bars" size={30} color="white" onPress={() => {
                    this.props.navigation.navigate('DrawerOpen')
                }}/>
            </View>
        )
    }
}

export default withNavigation(HeaderMenu);