
import React, { Component } from 'react';
import { View, ListView, TouchableOpacity ,Text,Image} from 'react-native';
import Icon  from 'react-native-vector-icons/FontAwesome';

const FlatListItem=(props)=>{
    return(
        <View style={{flex:1,flexDirection:'column', backgroundColor:'rgb(192, 213, 229)'}}>
            <TouchableOpacity  onPress={ props.onListItemPress }>
            <View style={{flex:1,flexDirection:'row',padding:10}}>
                <Icon  size={50} name="comments"></Icon>
                    {/*<Image*/}
                        {/*source={require("../images/RoshanShah.jpg")}*/}
                        {/*style={{width:100,height:100,margin:5}}*/}
                    {/*/>*/}
                    <View style={{flex:1,flexDirection:'column', height:35, padding:10}} >
                        <Text style={{fontWeight: '500', fontSize: 16}}>
                            {props.name.length > 30 ? props.name.substring(0, 26) + '...' : props.name}
                            {/*{props.name}*/}
                            </Text>
                        <Text style={{fontWeight: '400', fontSize: 14}}>{props.title}</Text>
                    </View>
            </View>
            </TouchableOpacity>
            <View style={{height:2,backgroundColor:'white'}} ></View>
            </View>
    )
}

export {FlatListItem}