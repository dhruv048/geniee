import { Container, Content, Header, Left, Right } from 'native-base';
import React from 'react';
import { Keyboard, View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { colors } from '../../../config/styles';
import Icon from 'react-native-vector-icons/Feather';
import Meteor from '../../../react-native-meteor';
import { customPaperTheme } from '../../../config/themes';

const BusinessCompleted = (props) => {

    const loggedUser = Meteor.user() ? Meteor.user() :props.route.params.data;

    const addItemOrService = () => {
        props.navigation.navigate('ProductInfo', {data: loggedUser});
    }
    const showSellingRules = () => {
        console.log('Selling Rules');
    }
    const handleSkipCall = () => {
        console.log('Handle Skip Call');
        props.navigation.navigate('Home')
    }
    return (
        <Container>
            <Content style={{ backgroundColor: colors.appBackground }}>
                <Header
                    androidStatusBarColor={colors.statusBar}
                    style={{ backgroundColor: colors.statusBar, marginTop: customPaperTheme.headerMarginVertical }}
                >
                    <Left>
                        <Button
                            transparent
                            uppercase={false}
                            onPress={() => {
                                props.navigation.goBack();
                            }}>
                            <Icon style={{ color: '#ffffff', fontSize: 20 }} name="arrow-left" />
                            <Text style={{ color: colors.whiteText }}>
                                Back
                            </Text>
                        </Button>
                    </Left>
                    <Right>
                        <Button
                            transparent
                            uppercase={false}
                            onPress={() => {
                                handleSkipCall();
                            }}>
                            <Text style={{ color: colors.whiteText }}>
                                Skip
                            </Text>
                        </Button>
                    </Right>
                </Header>
                <View style={styles.container}>
                    <View style={styles.welcomeText}>
                        <Text
                            style={styles.textHeader}>
                            Geniee is taking time to verify your account.
                        </Text>
                        <Text
                            style={styles.textSubHeader}>
                            This is usually takes few hours. The products you posted will be visible once Geniee approves it.
                        </Text>
                    </View>
                    <Button
                        mode='contained'
                        uppercase={false}
                        style={{ marginBottom: 15, height: 40 }}
                        onPress={() => { addItemOrService() }}
                    >
                        <Text>Post your first item/service</Text>
                        <Icon style={{ color: '#ffffff', fontSize: 15, marginTop: 5 }} name="arrow-right" />
                    </Button>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text>Read our</Text>
                        <Button
                            uppercase={false}
                            onPress={() => { showSellingRules() }}
                        >
                            <Text>Selling rules & Manual</Text>
                        </Button>
                    </View>
                </View>
            </Content>
        </Container>
    );
}

export default BusinessCompleted;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '50%',
    },
    welcomeText: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        flexDirection: 'column',
        paddingHorizontal: 20,
    },
    textHeader: {
        fontSize: 20,
        color: 'rgba(0, 0, 0, 0.87)',
        marginBottom: 5,
        marginTop: 25,
        fontWeight: 'bold'
    },

    textSubHeader: {
        fontSize: 16,
        color: 'rgba(0, 0, 0, 0.87)',
        marginBottom: 25,
    },
})