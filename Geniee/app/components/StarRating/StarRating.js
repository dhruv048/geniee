import React, {Component} from 'react';
import {StyleSheet, View, Image} from 'react-native';
import PropTypes from 'prop-types';
import {Icon} from 'native-base';
import {colors} from "../../config/styles";


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
            let icon=<Icon name={'star'} type={'FontAwesome'} style={{fontSize:13,color:colors.warning,fontWight:'100',elevation: 4,}} active={true}/>;
            //if rating is lower, set path for unfilled star
            if (i > ratingDynamicVal) {
                path = require('./star-unfilled.png');
                icon=<Icon name={'star'} type={'Feather'} style={{fontSize:13,color:colors.warning,fontWight:'100',elevation: 4,}} active={false}  />
            }

            stars.push((<Image key={i} style={styles.starImg} source={path} />));
           // stars.push(icon);
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
        justifyContent:'space-around',
    },
    starImg: {
        width: 15,
        height: 15,
    },
});