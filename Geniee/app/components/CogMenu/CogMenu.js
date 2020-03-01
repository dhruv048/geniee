import React,{PureComponent} from 'react'
import {Navigation} from 'react-native-navigation';
import {Text,Button} from "native-base";
import Icon from 'react-native-vector-icons/FontAwesome';

export class CogMenu extends PureComponent{
    constructor(props){
        super(props)
    }

    onPress(){
        console.log(this.props)
        Navigation.mergeOptions(this.props.componentId, {
            sideMenu: {
                left: {
                    visible: true,
                },
            },
        });
    }


    render() {
        const {componentId, onPress} = this.props;
        return (
            <Button transparent onPress={onPress ? onPress: this.onPress.bind(this)}>
                <Text>
                    <Icon name={'ellipsis-v'} size={25} color={'white'}/>
                </Text>
            </Button>
        );
    }
};



