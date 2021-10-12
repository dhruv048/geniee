import { Container, Content, Header } from 'native-base';
import React from 'react';
import { Keyboard, View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../../config/styles';

const RegisterCompleted = (props) => {

    const becomeSeller = () => {  
        const registerUser = props.route.params.data;
        props.navigation.navigate('BecomeSeller',{data : registerUser});
    }
    return (
        <Container>
            <Content style={{ backgroundColor: colors.appBackground }}>
                <Header androidStatusBarColor={colors.statusBar}
                    style={{ backgroundColor: '#4d94ff' }}>
                </Header>
                <View style={styles.container}>
                    <Icon name='check-circle' style={{ fontSize: 70, color: 'green' }} />
                    <Text style={{ fontSize: 20, marginTop: 35, marginBottom: 20 }}>Your account is ready!</Text>
                    <Button
                        mode='contained'
                        uppercase={false}
                        icon='shopping'
                        style={styles.btnComplete}
                        onPress={() => { props.navigation.navigate('Home') }}
                    >
                        <Text style={styles.btnCompleteText}>Begin the shopping</Text>
                    </Button>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text>Want to be a seller?</Text>
                        <Button
                            uppercase={false}
                            onPress={() => { becomeSeller() }}
                        >
                            <Text>Become a Seller</Text>
                        </Button>
                    </View>
                </View>
            </Content>
        </Container>
    );
}

export default RegisterCompleted;

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