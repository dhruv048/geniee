// import React, { Component } from 'react';
// import Meteor, { createContainer } from 'react-native-meteor';
// import { List, ListItem } from 'react-native-elements'
// import { StyleSheet, Dimensions, Text, View, Image, } from 'react-native';
// import PropTypes from 'prop-types';
//
// import { colors } from '../config/styles';
// import Button from '../components/Button';
// import Avatar from '../components/Avatar';
// import userImage from '../images/duser.png';
//
// const window = Dimensions.get('window');
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: colors.background,
//     },
//     header: {
//         width: window.width,
//         height: window.height * 0.4,
//     },
//     body: {
//         marginTop: -50,
//         alignItems: 'center',
//     },
//     imageViewContainer: {
//         width: '50%',
//         height: 100 ,
//         margin: 10,
//         borderRadius : 10
//
//     },
//
//     textViewContainer: {
//
//         textAlignVertical:'center',
//         width:'50%',
//         padding:20
//
//     }
// });
//
// class Users extends Component {
//     constructor(props) {
//         super(props);
//
//         this.mounted = false;
//         this.state={
//             users:this.props.users,
//         }
//     }
//
//     GetItem =(name) =>{
//
//         alert(name);
//
//     }
//     render() {
//         const list=this.state.users;
//
//         return (
//             <View style={styles.container}>
//
//                 <List
//                     {
//                     list.map((item) => (
//                        <ListItem
//
//                        <View style={{flex:1, flexDirection: 'row'}}>
//
//                            <Image source = {userImage} style={styles.imageViewContainer} />
//
//                            <Text onPress={this.GetItem.bind(this, item.name)} style={styles.textViewContainer} >{item.name}</Text>
//                            <Text  style={styles.textViewContainer} >{item.email}</Text>
//                            <Text  style={styles.textViewContainer} >{item.phone}</Text>
//
//                        </View>
//                        />
//                     ))
//                     }
//                 />
//             </View>
//         );
//     }
// }
//
// Users.propTypes = {
//     users: PropTypes.array,
// };
//
// export default createContainer(() => {
//     return {
//         users: [
//             {name:'Roshan Shah', email:"roshanshah.011@gmail.com", phone:"9813798508"},
//             {name:'Roshan Shah', email:"roshanshah.011@gmail.com", phone:"9813798508"},
//             {name:'Roshan Shah', email:"roshanshah.011@gmail.com", phone:"9813798508"},
//             {name:'Roshan Shah', email:"roshanshah.011@gmail.com", phone:"9813798508"},
//         ],
//     };
// }, Users);
