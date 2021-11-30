import { Container, Content, Header,Left,Right } from 'native-base';
import React, { useEffect, useState } from 'react';
import { Keyboard, View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FIcon from 'react-native-vector-icons/Feather';
import { colors } from '../../../config/styles';

const OrdersCompleted = (props) => {

    const[orderId, setOrderId] = useState();

    useEffect(() =>{
        setOrderId('#1224axfe34io');
    },[])
    const trackMyOrders = () => {  
        //const orderItems = props.route.params.data;
        props.navigation.navigate('OrderTrack',{order : orderId});
    }
    return (
        <Container>
            <Content style={{ backgroundColor: colors.appBackground }}>
            <Header
                    androidStatusBarColor={colors.statusBar}
                    style={{ backgroundColor: '#4d94ff' }}
                >
                    <Button
                        transparent
                        uppercase={false}
                        style={{ width: '100%', alignItems: 'flex-start' }}
                        onPress={() => {
                            props.navigation.goBack();
                        }}>
                        <FIcon style={{ color: '#ffffff', fontSize: 20 }} name="arrow-left" />
                        <Text style={{ color: colors.whiteText, fontSize: 20 }}>Home</Text>
                    </Button>
                </Header>
                <View style={styles.container}>
                    <Icon name='check-circle' style={{ fontSize: 70, color: 'green' }} />
                    <Text style={{ fontSize: 20, marginTop: 35, marginBottom: 20 }}>Your orders are on the way to your doorsteps</Text>
                    <Text>Your order is {orderId}</Text>
                    <Button
                        mode='contained'
                        uppercase={false}
                        icon='shopping'
                        style={styles.btnComplete}
                        onPress={() => {trackMyOrders()}}
                    >
                        <Text style={styles.btnCompleteText}>Track My orders</Text>
                    </Button>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text>Product similar to your orders</Text>            
                    </View>
                </View>
            </Content>
        </Container>
    );
}

export default OrdersCompleted;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '30%',
    },

    btnComplete: {
        width: '55%',
        marginBottom: 20,
        marginTop:20,
        marginLeft: '3%',
        borderRadius: 6,
        height: 45,
    },

    btnCompleteText: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.whiteText,
    },

})