import React from 'react';
import { View, Dimensions, Platform } from 'react-native';
// import {Icon,Input } from 'react-native-elements';

const { width } = Dimensions.get('window');

const ChatInput = (props) => {
    const { textMessage, onChangeText,onFocus,onRightPress } = props;
    return (
        <View style={{flexDirection: 'row'}}>
            <Input
                containerStyle={{marginLeft: 20, marginRight: 0}}
                inputStyle={{
                    color: '#212529',
                    minHeight: 36,
                     width: (width-60),
                }}
                placeholder={'Your message'}
                autoCapitalize='none'
                autoCorrect={false}
                selectionColor={'#212529'}
                value={textMessage}
                onChangeText={onChangeText}
                onFocus={onFocus}
            />
            {/*<Icon*/}
                {/*containerStyle={{marginLeft: 1, marginRight:5}}*/}
                {/*iconStyle={{margin: 0, padding: 0}}*/}
                {/*name='envelope'*/}
                {/*type='font-awesome'*/}
                {/*color={textMessage.length > 0 ? '#7d62d9' : '#494e57'}*/}
                {/*size={25}*/}
                {/*onPress={onRightPress}*/}
            {/*/>*/}
        </View>
    )
}

export { ChatInput};