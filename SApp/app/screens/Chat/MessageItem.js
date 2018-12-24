import React from 'react';
import { View, Text } from 'react-native';

 const MessageItem = (props) => {
    return (
        <View style={{}}>
            <Text style={{fontSize: 12, color: props.isUser ? '#fff' : '#000'}}>{props.message}</Text>
        </View>
    )
}
export  {MessageItem}