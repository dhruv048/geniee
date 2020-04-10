import React, {Component} from 'react';
import {StyleSheet, View, Image} from 'react-native';
import PropTypes from 'prop-types';

export default class StarRating extends Component {
    render() {
        //receive rating from prop
        let ratingDynamicVal =Math.round(this.props.starRate);

        //this array will contain star tags
        let stars = [];

        //loop for 5 times
        for (var i = 1; i <= 5; i++) {
            //set the path for colored star
            let path = require('./star-filled.png');
            //if rating is lower, set path for unfilled star
            if (i > ratingDynamicVal) {
                path = require('./star-unfilled.png');
            }
            
            stars.push((<Image key={i} style={styles.starImg} source={path} />));
        }
     
        return (
            <View style={ styles.rateCont }>
                { stars }
            </View>    
        );

    } 
};
  
StarRating.propTypes = {
    starRate: PropTypes.number,
}; 

const styles = StyleSheet.create({
    rateCont: {
        //backgroundColor: '#05a5d10d',
        backgroundColor: 'transparent',
        flexDirection: 'row',
        alignItems: 'center',
    },
    starImg: {
        width: 15,
        height: 15,
    },
});