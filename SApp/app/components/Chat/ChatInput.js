import React from 'react';
import { View, Dimensions, Platform } from 'react-native';
//import {Icon ,Input} from 'react-native-elements';
import {Input,Item} from 'native-base';
import Icon  from 'react-native-vector-icons/FontAwesome';


const { width } = Dimensions.get('window');

const ChatInput = (props) => {
    const { textMessage, onChangeText,onFocus,onRightPress } = props;
    return (
            <Item style={{marginHorizontal:15}}>
                {/*<View style={{flexDirection: 'row'}}>*/}
                {/*<Input*/}
                {/*containerStyle={{marginLeft: 20, marginRight: 0}}*/}
                {/*inputStyle={{*/}
                {/*color: '#212529',*/}
                {/*minHeight: 36,*/}
                {/*width: (width-60),*/}
                {/*}}*/}
                {/*placeholder={'Your message'}*/}
                {/*autoCapitalize='none'*/}
                {/*autoCorrect={false}*/}
                {/*selectionColor={'#212529'}*/}
                {/*value={textMessage}*/}
                {/*onChangeText={onChangeText}*/}
                {/*onFocus={onFocus}*/}
                {/*/>*/}
                {/*<Icon*/}
                {/*containerStyle={{marginLeft: 1, marginRight:5}}*/}
                {/*iconStyle={{margin: 0, padding: 0}}*/}
                {/*name='envelope'*/}
                {/*type='font-awesome'*/}
                {/*color={textMessage.length > 0 ? '#7d62d9' : '#494e57'}*/}
                {/*size={25}*/}
                {/*onPress={onRightPress}*/}
                {/*/>*/}
                <Input placeholder='Your Message'
                       autoCapitalize='none'
                       autoCorrect={false}
                       selectionColor={'#212529'}
                       value={textMessage}
                       onChangeText={onChangeText}
                       onFocus={onFocus}
                       style={{ width: (width-60)}}

                />
                <Icon onPress={onRightPress} style={{fontSize: 25,color:textMessage.length > 0 ? '#7d62d9' : '#494e57'}} active name='envelope' />
            </Item>
        // </View>
    )
}

export { ChatInput};