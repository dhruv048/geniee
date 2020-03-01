/**
 * This is the category component used in the home page
 **/

// React native and others libraries imports
import React, {Component} from 'react';
import {Image, Dimensions, TouchableOpacity, TouchableNativeFeedback} from 'react-native';
import {View} from 'native-base';
// import { Actions } from 'react-native-router-flux';

// Our custom files and classes import
import Text from './Text';

export default class CategoryBlock extends Component {
    render() {
        return (
            <View>
                <TouchableNativeFeedback
                    onPress={this.props.onPress}
                    //activeOpacity={0.5}
                >
                    <View style={styles.list}>
                        {/* <Image style={styles.image} source={{uri: this.props.image}}/> */}
                        {/* <View style={styles.overlay}/>
                        <View style={styles.border}/> */}
                        <View style={styles.item}>
                            <Text style={styles.title}>{this.props.title}</Text>
                            <Text style={styles.subtitle}>{this.props.count} items</Text>
                        </View>
                    </View>
                </TouchableNativeFeedback>
            </View>
        );
    }


}

const styles = {
    list: {
        paddingHorizontal: 30
    },
    item: {
        // width: Dimensions.get('window').width,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 18,
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
    },
    title: {
        // textAlign: 'center',
        // color: '#fdfdfd',
        fontSize: 18,
        flexGrow: 1,
        width: '70%',
        
    },
    subtitle: {
        // textAlign: 'center',
        // color: '#fdfdfd',
        // fontSize: 16,
        // fontWeight: '100',
        // fontStyle: 'italic'
        width: '30%',
        textAlign: 'right',
        paddingLeft: 10,
        color: '#8E8E8E',
        textTransform: 'uppercase',
        fontSize: 13
    },
    overlay: {
        // position: 'absolute',
        // top: 0,
        // left: 0,
        // right: 0,
        // bottom: 0,
        // backgroundColor: 'rgba(30, 42, 54, 0.4)'
    },
    border: {
        // position: 'absolute',
        // top: 10,
        // left: 10,
        // right: 10,
        // bottom: 10,
        // borderWidth: 1,
        // borderColor: 'rgba(253, 253, 253, 0.2)'
    },
    image: {
        // height: 200,
        // width: null,
        // flex: 1
    }
};