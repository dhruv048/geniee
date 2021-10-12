import { Container, Content, Header,Left,Right } from 'native-base';
import React from 'react';
import { Keyboard, View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FIcon from 'react-native-vector-icons/Feather';
import { colors } from '../../../config/styles';

const MyOrders = (props) => {
    return (
        <Container>
            <Content style={{ backgroundColor: colors.appBackground }}>
                <Header androidStatusBarColor={colors.statusBar}
                    style={{ backgroundColor: '#4d94ff' }}>
                        <Left>
                    <Button
                    transparent
                    uppercase={false}
                    onPress={()=>props.navigation.navigate('Home')}>
                        <FIcon style={{ color: '#ffffff', fontSize: 18 }} name='arrow-left' />
                        <Text style={{ color: colors.whiteText, fontSize:18}}>Home</Text>
                    </Button>
                </Left>
                <Right>

                </Right>
                </Header>
                <View style={styles.container}>
                    <Text>Your Orders:</Text>
                </View>
            </Content>
        </Container>
    );
}

export default MyOrders;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '50%',
    },

    btnComplete: {
        width: '55%',
        marginBottom: 20,
        marginTop:10,
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