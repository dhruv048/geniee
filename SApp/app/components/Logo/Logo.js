import React, {Component} from 'react';
import {StyleSheet, View, Image} from 'react-native';

import logoImage from '../../images/logo2-trans-640X640.png';

export default class Logo extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Image source={logoImage} style={styles.image} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  image: {
    width: 125,
    height: 125,
  },
});