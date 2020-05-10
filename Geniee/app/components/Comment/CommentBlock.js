import {Card, CardItem, Text, Thumbnail} from "native-base";
import {View} from "react-native";
import React from "react";
import {customStyle} from "../../config/styles";
import {Rating} from "react-native-elements";

const CommentBlock = (props) => {
    return (
        <Card style={customStyle.Card}>
            <CardItem style={{flex: 1, alignItems: 'flex-start'}}>
                <View style={{paddingRight: 15, paddingTop: 5}}>
                    <Thumbnail medium square style={{borderRadius:5}}
                               source={props.source}/>
                </View>
                <View style={{flex: 1}}>
                    <Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 5}}>{props.name}</Text>
                    {props.rating ?
                        <Rating
                            imageSize={20}
                            readonly
                            startingValue={props.rating}
                            style={{alignSelf: 'flex-start'}}
                        /> : null}
                    <Text style={{fontSize: 15, marginBottom: 5}}>{props.Comment}</Text>
                    <Text note>{props.CommentDate}</Text>
                </View>
            </CardItem>
        </Card>
    );
}

export default CommentBlock