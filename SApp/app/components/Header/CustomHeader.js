import React from 'react';
import {Text, View, ScrollView, Platform, TouchableHighlight, Linking, Alert,} from 'react-native';
import styles from './styles';
import Icon  from 'react-native-vector-icons/FontAwesome';
import Popover from 'react-native-popover-view';
import { Header} from 'react-native-elements';
import PropTypes from 'prop-types';
import Meteor from 'react-native-meteor';
import { withNavigation } from 'react-navigation';

class CustomHeader extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            isVisible:false,
        }
    }
    showPopoverr=()=>{
        this.setState({
            isVisible:true,
        })
    }
    closePopoverr=()=>{
        this.setState({
            isVisible:false,
        })
    }

    render() {
        Meteor.subscribe('notifications-list');
        return (
            <Header
                statusBarProps={{barStyle: 'light-content'}}
                // rightComponent={<Icon  size={30} name='sign-out' color="white"  onPress={this.handleSignout} ></Icon>}
                rightComponent={
                    <View style={{marginLeft: 5, flexDirection: 'row',alignItems: 'center',justifyContent: 'center'}}>
                        {this.props.notifications.length > 0 ?
                            <View style={{paddingRight: 15}}>
                                <Popover style={{justifyContent: 'flex-start', flexDirection: 'row', padding: 0}}
                                         isVisible={this.state.isVisible}
                                         fromView={this.touchable}
                                         onClose={() => this.closePopoverr()}>
                                    <View style={{padding: 10, margin: 0}}>
                                        <ScrollView>
                                        {this.props.notifications.map((l, i) => (

                                            <View key={i} style={{
                                                padding: 10,
                                                backgroundColor: 'rgb(192, 213, 229)',
                                                width: 'auto',
                                                marginTop: 5,
                                                borderRadius: 6
                                            }}>
                                                <View>
                                                    <Text style={styles.main}>{l.title}</Text>
                                                </View>
                                                <View style={styles.subtitleView}>
                                                    {/*<Image source={require('../images/avatar-placeholder.png')} style={styles.ratingImage}/>*/}
                                                    <Icon name="comment" color="white" size={30}></Icon>
                                                    <Text onPress={() => Linking.openURL(l.url)}
                                                          style={styles.ratingText}>{l.message}</Text>
                                                    <Text style={{color: '#3ca3f2'}}
                                                          onPress={() => Linking.openURL(l.url)}> {l.linkText}</Text>

                                                </View>
                                            </View>
                                        ))}
                                        </ScrollView>
                                    </View>
                                </Popover>

                                <TouchableHighlight ref={ref => this.touchable = ref}   onPress={()=>{this.showPopoverr()}}
                                                    style={styles.badgeIconView}>
                                    <View style={styles.badgeIconView}>
                                        <Text style={styles.badge}> {this.props.notifications.length} </Text>
                                        <Icon size={30} name='bell' ref={ref => this.touchable = ref}
                                            onPress={()=>{this.showPopoverr()}} color="white"
                                              style={{width: 30, height: 30}}/>
                                    </View>
                                </TouchableHighlight>

                            </View> : null}
                        <Icon size={30} name='sign-out' color="white" onPress={this.props.handleSignout}></Icon>
                    </View>}
                leftComponent={
                    <View style={{marginLeft: 5, flexDirection: 'row',alignItems: 'center',justifyContent: 'center'}}>

                        <Icon name="bars" size={30} color="white" onPress={() => {
                            this.props.navigation.navigate('DrawerOpen')
                        }}/>
                    </View>

                }
                outerContainerStyles={{height: Platform.OS === 'ios' ? 70 : 70 - 24, padding: 10}}
            />
        );
    }
};

CustomHeader.propTypes = {
    notifications: PropTypes.array,
    handleSignout: PropTypes.func,
    onPress: PropTypes.func,
    isVisible:PropTypes.bool,
};

CustomHeader.defaultProps = {
    notifications: Meteor.collection('notifications-list').find(),
    handleSignout:()=>{
        Alert.alert(
            'SignOut',
            'Do you want to SignOut?',
            [
                {text: 'Yes SignOut', onPress: () =>  Meteor.logout((err)=>{
                        if(!err)
                            this.props.navigation.navigate('signIn')
                    })},
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            ],
            { cancelable: false }
        )
    }
};

export default withNavigation(CustomHeader);
