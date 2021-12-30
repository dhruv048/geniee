import React from 'react';
import { View, ActivityIndicator,Image } from 'react-native';
import styles from './styles';
import PropTypes from 'prop-types';
import {colors} from "../../config/styles";

const Loading = (props) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator
          animating
          size={props.size}
          {...props}
          color={colors.statusBar}
      />
      {/* <Image
      style={{height:60,width:60}}
        source={require('../../images/loading.gif')}
       /> */}
    </View>
  );
};

Loading.propTypes = {
  size: PropTypes.string,
};

Loading.defaultProps = {
  size: 'large',
};

export default Loading;
