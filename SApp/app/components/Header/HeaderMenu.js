import React from 'react';
import { View,Text} from 'react-native';
import Icon  from 'react-native-vector-icons/FontAwesome';
import {withNavigation} from "react-navigation";
class HeaderMenu extends React.Component{
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View style={{marginLeft: 5, flexDirection: 'row',alignItems: 'center',justifyContent: 'center'}}>
                    <Text  >
                <Icon name="bars" style={{fontWeight:'500'}} size={30} color="white" onPress={() => {
                    this.props.navigation.openDrawer()
                }}/>
                    </Text>
            </View>
        )
    }
}

export default withNavigation(HeaderMenu);