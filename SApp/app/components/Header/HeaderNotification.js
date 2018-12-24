import React from 'react';
import {Text, View, ScrollView, Platform, TouchableHighlight, Linking, Alert} from 'react-native';
import styles from "./styles";
import Popover from 'react-native-popover-view';
import Icon  from 'react-native-vector-icons/FontAwesome';
import Meteor, { createContainer } from 'react-native-meteor';

class HeaderNotification extends React.Component {
    constructor(props)
    {
        super(props);
        this.state = {
            isVisible: false,
        }
    };
    showPopover=()=>{
        this.setState({
            isVisible:true,
        })
    }
    closePopover=()=>{
        this.setState({
            isVisible:false,
        })
    }
    render()
    {
        return (
            <View style={{paddingRight: 15}}>
                <Popover style={{justifyContent: 'flex-start', flexDirection: 'row', padding: 0}}
                         isVisible={this.state.isVisible}
                         fromView={this.touchable}
                         onClose={() => this.closePopover()}>
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

                <TouchableHighlight ref={ref => this.touchable = ref} onPress={() => {
                    this.showPopover()
                }}
                                    style={styles.badgeIconView}>
                    <View style={styles.badgeIconView}>
                        <Text style={styles.badge}> {this.props.notifications.length} </Text>
                        <Icon size={30} name='bell' ref={ref => this.touchable = ref}
                              onPress={() => {
                                  this.showPopover()
                              }} color="white"
                              style={{width: 30, height: 30}}/>
                    </View>
                </TouchableHighlight>

            </View>
        );
    }
};

export default createContainer(()=>{
    Meteor.subscribe('notifications-list');
    return {
        notifications: Meteor.collection('notification').find(),
    }
    }, HeaderNotification);