/**
 * This is the Main file
 **/

// React native and others libraries imports
import React, {Component} from 'react';
import {View, Icon, Spinner} from 'native-base';
import Gallery from 'react-native-image-gallery';
import settings from "../../config/settings";

export default class ImageGallery extends Component {
    constructor(props) {
        super(props);
        this.state = {
            images: [],
            initialPage: 0
        };
    }

    componentDidMount() {
        let imgs = [];

        const images = this.props.navigation.getParam('images');
        console.log(images)
        images.map((img, i) => {
            imgs.push({source: {uri: settings.API_URL+"images/" + img}})
        });
        this.setState({images: imgs});
    }

    render() {
        const images = this.props.navigation.getParam('images');
        const position = this.props.navigation.getParam('position');
        return (
            <View style={{flex: 1, backgroundColor: 'black'}}>
                {this.state.images.length > 0 ?
                    <Gallery
                        initialPage={position}
                        style={{flex: 1, backgroundColor: 'black'}}
                        images={this.state.images}
                    /> : <Spinner/>}
                <Icon name="ios-close" style={styles.icon} onPress={() => this.props.navigation.goBack()}/>
            </View>
        );
    }
}

const styles = {
    icon: {
        color: 'white',
        fontSize: 46,
        position: 'absolute',
        top: 15,
        left: 15,
        width: 40,
        height: 40
    }
};