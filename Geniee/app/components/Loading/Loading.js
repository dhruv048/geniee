import React from 'react';
import { View, ActivityIndicator,Image } from 'react-native';
import styles from './styles';
import PropTypes from 'prop-types';
import {colors} from "../../config/styles";

const Loading = (props) => {
  return (
    <View style={styles.container}>
      {/* <ActivityIndicator
          animating
          size={props.size}
          {...props}
          color={colors.appLayout}
      /> */}
      <Image
      style={{height:40,width:40}}
        source={require('../../images/loading.gif')}
       />
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
