import React from 'react';
import { View, TextInput } from 'react-native';
import styles from './styles';
import PropTypes from 'prop-types';
import Button from "../Button/Button";

const GenericTextInput = (props) => {
  return (
    <View>
      {props.borderTop ? <View style={styles.divider} /> : null}
      <TextInput
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType='next'
        {...props}
      />
    </View>
  );
};

GenericTextInput.propTypes = {
  borderTop: PropTypes.bool,
};



export default GenericTextInput;
