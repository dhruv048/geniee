import React from 'react';
import { Image } from 'react-native';
import gravatar from 'gravatar-api';
import PropTypes from 'prop-types';

import styles from './styles';
import avatarImage from '../../images/avatar-placeholder.png';

const Avatar = (props) => {
  const gravatarOptions = {
    email: props.email,
    parameters: { size: 200 },
  };

  const uri = gravatar.imageUrl(gravatarOptions);
  return (
    <Image
      style={styles.avatar}
      source={{ uri }}
      defaultSource={avatarImage}
    />
  );
};

Avatar.propTypes = {
  email: PropTypes.string,
};

export default Avatar;
