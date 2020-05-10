import React from 'react';
import {TouchableOpacity, View} from "react-native";
import {Footer, Input, Button} from "native-base";
import Icon from "react-native-vector-icons/Feather";
import {variables} from '../../config/styles';


class CommentInputBox extends React.Component {
    constructor(props) {
        super();
        this.state = {
            height: 40
        }
    }

    updateSize = (height) => {
        console.log(height)
        this.setState({
            height
        });
    }

    render() {
        const {height} = this.state;
        const {onChangeText, onPressSend, value} = this.props;
        let newStyle = {
            height
        }
        // console.log(this.props.onPressSend)
        return (
            <Footer style={{
                backgroundColor: 'white',
                height: this.state.height + 10,
                elevation: 5,
                width: '100%',
                paddingLeft: 10,
                paddingTop: 5
            }}>
                <Input value={value}
                       multiline={true}
                       onContentSizeChange={(e) => this.updateSize(e.nativeEvent.contentSize.height)}
                       placeholder="Write a comment"
                       style={[{backgroundColor: 'white'}, newStyle]}
                       onChangeText={(Comment) => {
                           onChangeText(Comment)
                       }}/>
                <Button style={{
                    marginHorizontal: 10,
                    marginBottom: 8,
                    width: 38,
                    height: 38,
                    backgroundColor: variables.primary,
                    borderRadius: 38,
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'flex-end',
                    elevation: 0
                }}
                        disabled={!value || value.length < 1}
                        onPress={this.props.onPressSend}>
                    <Icon name='send' color={'white'} size={20}/>
                </Button>
            </Footer>
        );
    }
}

export default CommentInputBox;

