import React, { Component } from 'react';
import Meteor, { createContainer } from 'react-native-meteor';
import { StyleSheet, Dimensions, Text, View, Image,Platform } from 'react-native';
import PropTypes from 'prop-types';
import Icon  from 'react-native-vector-icons/FontAwesome';
import { colors } from '../config/styles';
// import { Header } from 'react-native-elements';

const window = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        width: window.width,
        height: window.height * 0.4,
    },
    body: {
        marginTop: -50,
        alignItems: 'center',
    },
})

 class   Settings extends Component {
    static navigationOptions={
        drawerIcon:(
            <Image source={require('../images/settings.png')}
                   style={{height:25,width:25}}/>
        )
    }
    render() {
        return(
      <View>
      {/*<Header style={{height:25}}*/}
              {/*statusBarProps={{ barStyle: 'light-content' }}*/}
              {/*leftComponent={<Icon name="bars" size={30} color="white"  onPress={()=> this.props.navigation.navigate('DrawerOpen')} />}*/}
              {/*rightComponent={ <Icon color="white" size={30} name='sign-out' style={{}}  onPress={this.handleSignout} ></Icon>}*/}
              {/*outerContainerStyles={{height: Platform.OS === 'ios' ? 70 :  70 - 24, padding:10}}*/}
      {/*/>*/}
          <Text>Settings</Text>
      </View>

        )
    }
}

export default Settings;



