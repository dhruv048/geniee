import React, { Component } from 'react';
import Meteor, { createContainer } from 'react-native-meteor';
import {StyleSheet, Dimensions, Text, View, Image, Platform} from 'react-native';
import PropTypes from 'prop-types';
import {Header} from 'react-native-elements';
import { colors } from '../config/styles';
import Button from '../components/Button';
import Avatar from '../components/Avatar';
import { capitalize } from '../lib/string';
import headerImage from '../images/header-image.png';
import Icon  from 'react-native-vector-icons/FontAwesome';
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
});

class Profile extends Component {
  handleSignOut = () => {
    Meteor.logout();
  }
    static navigationOptions={
        drawerIcon:(
            <Image source={require('../images/settings.png')}
                   style={{height:25,width:25}}/>
        )
    }
  render() {
    const { user } = this.props;
    let email;

    if (user) {
      email = user.emails[0].address;
    }

    return (
      <View style={styles.container}>
          <Header style={{height:25}}
                  statusBarProps={{ barStyle: 'light-content' }}
                  leftComponent={<Icon color="white" name="bars" size={30} onPress={()=> this.props.navigation.navigate('DrawerOpen')} />}
                  // rightComponent={ <Icon  size={30} name='sign-out' style={{}}  onPress={this.handleSignout} ></Icon>}
                  outerContainerStyles={{height: Platform.OS === 'ios' ? 70 :  70 - 24, padding:10}}
          />
        <Image style={styles.header} source={headerImage} />
        <View style={styles.body}>
          <Avatar email={email} />
          <Text>{capitalize(email)}</Text>
          <Button text="Sign Out" onPress={this.handleSignOut} />
        </View>
      </View>
    );
  }
}

Profile.propTypes = {
  user: PropTypes.object,
};

export default createContainer(() => {
  return {
    user: Meteor.user(),
  };
}, Profile);
