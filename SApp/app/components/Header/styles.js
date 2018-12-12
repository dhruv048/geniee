import {StyleSheet} from 'react-native';

export default StyleSheet.create({
    badgeIconView:{
        position:'relative',
    },
    badge:{
        color:'#fff',
        position:'absolute',
        zIndex:5,
        top:-5,
        right:2,
        padding:1,
        backgroundColor:'red',
        borderRadius:6
    },
    subtitleView: {
        flexDirection: 'row',
        padding: 10,
        paddingTop: 0,

    },
    ratingImage: {
        height: 25,
        width: 25
    },
    ratingText: {
        padding: 10,
        color: 'rgb(39, 44, 48)'
    },
})