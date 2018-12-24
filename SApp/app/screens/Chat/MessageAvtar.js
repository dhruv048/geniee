import React from 'react';
import { View ,Image} from 'react-native';
import { Avatar } from 'react-native-elements';
// import logoImage from '/app/images/rn-logo.png';

const _renderAvatar = (isShow, uri, onImagePress) => {
    if (!isShow) {
        uri = '';
    }
    return uri ? (
        <Avatar
            small
            rounded
            source={uri}
            onPress={onImagePress}
        />


    ) : null
    //     (<Image style={{width:34,height:34,borderRadius:15}}
    //             source = {logoImage}>
    // </Image>);
}

const MessageAvatar = (props) => {
    return (
        <View style={styles.viewStyle}>
            {_renderAvatar(props.isShow, props.uri, props.onPress)}
        </View>
    )
}

const styles = {
    viewStyle: {
        backgroundColor: '#fff',
        marginRight: 8,
        width: 34,
        height: 34
    }
}

export { MessageAvatar };