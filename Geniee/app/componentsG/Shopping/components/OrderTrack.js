import { Container, Content, Header, Left, Right } from 'native-base';
import React from 'react';
import { Keyboard, View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FIcon from 'react-native-vector-icons/Feather';
import { colors } from '../../../config/styles';
import MapView from 'react-native-maps';

const OrderTrack = (props) => {

    const orderId = props.route.params.order;
    return (
        <Container style={{ backgroundColor: colors.appBackground }}>
            <Content>
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
                        <Text style={{ color: colors.whiteText, fontSize: 20 }}>{orderId}</Text>
                    </Button>
                </Header>

                <View style={{ marginTop: '1%' }}>
                    <View>
                        <MapView
                            style={{ height: 250}}
                            initialRegion={{
                                latitude: 27.712020,
                                longitude: 85.312950,
                                latitudeDelta: 0.001,
                                longitudeDelta: 0.001
                            }}
                        ><Text>Location</Text></MapView>
                    </View>
                    <View>
                        <Text style={{ fontSize: 20, marginTop: 35, marginBottom: 20 }}>Your orders are on the way to your doorsteps</Text>
                    </View>
                </View>
            </Content>
        </Container>
    )
}

export default OrderTrack;

const styles = StyleSheet.create({

})