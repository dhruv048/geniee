import React, { Component, useEffect, useState } from 'react';
import Meteor from '../../../react-native-meteor';
import {
    StyleSheet,
    Dimensions,
    View,
    ToastAndroid,
    TouchableOpacity,
    FlatList,
    Image,
    SafeAreaView,
    StatusBar,
    useWindowDimensions,
} from 'react-native';
import {
    Header,
    Container,
    Content,
    Item,
    Body,
    Left,
    Button,
    Right,
    Text,
    ListItem,
    Thumbnail,
    Icon as NBIcon,
    Spinner,
    Card,
    CardItem,
} from 'native-base';
import Icon from 'react-native-vector-icons/Feather';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import { colors, customStyle, variables } from '../../../config/styles';
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
import settings from '../../../config/settings';
import { Button as RNPButton, TextInput } from 'react-native-paper';
import Moment from 'moment';
import EIcon from 'react-native-vector-icons/EvilIcons';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view'

const OrderReport = (props) => {
    const [todayOrder, setTodayOrder] = useState(12000);
    const [weekOrder, setWeekOrder] = useState(340);
    const [pendingOrder, setPendingOrder] = useState(2340);
    const [shippedOrder, setShippedOrder] = useState(20);
    const [deliveredOrder, setDeliveredOrder] = useState(30);
    return (
        <Content style={{ marginTop: 15, marginHorizontal: 10 }}>
            <View style={{ paddingVertical: 25 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Analytics :</Text>
                <View style={{ flexDirection: 'row', paddingTop:8 }}>
                    <Text>Today's Order</Text>
                    <Text style={{ marginLeft: 'auto', fontWeight: 'bold', color: colors.gray_100 }}>{todayOrder}</Text>
                </View>
                <View style={{ flexDirection: 'row', paddingTop: 8 }}>
                    <Text>This Week's Order</Text>
                    <Text style={{ marginLeft: 'auto', fontWeight: 'bold', color: colors.gray_100 }}>{weekOrder}</Text>
                </View>
                <View style={{ flexDirection: 'row', paddingTop: 8 }}>
                    <Text style={{color:'#FFC940'}}>Pending Order</Text>
                    <Text style={{ marginLeft: 'auto', fontWeight: 'bold', color: colors.gray_100 }}>{pendingOrder}</Text>
                </View>
                <View style={{ flexDirection: 'row', paddingTop: 8 }}>
                    <Text style={{color:'#3DA9FC'}}>Shipped Order</Text>
                    <Text style={{ marginLeft: 'auto', fontWeight: 'bold', color: colors.gray_100 }}>{shippedOrder}</Text>
                </View>
                <View style={{ flexDirection: 'row', paddingTop: 8 }}>
                    <Text style={{color:'#00B35E'}}>Delivered Order</Text>
                    <Text style={{ marginLeft: 'auto', fontWeight: 'bold', color: colors.gray_100 }}>{deliveredOrder}</Text>
                </View>
            </View>
        </Content>
    )
}

const MerchantOrder = (props) => {

    const [totalOrder, setTotalOrder] = useState(12340);

    const layout = useWindowDimensions();

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'first', title: 'This Week', navigation: props.navigation },
        { key: 'second', title: 'Monthly', navigation: props.navigation },
        { key: 'third', title: 'Yearly', navigation: props.navigation },
    ]);

    const renderScene = SceneMap({
        first: OrderReport,
        second: OrderReport,
        third: OrderReport,
    });

    const renderTabBar = (props) => (
        <TabBar
            {...props}
            activeColor={'black'}
            inactiveColor={'black'}
            style={{ marginTop: 15, backgroundColor: 'white' }}
        />
    );

    return (
        <>
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.whiteText }}>
                <Container>
                <View
                    style={{
                        backgroundColor: colors.appLayout,
                        height: 80,
                    }}>
                    <Header
                        androidStatusBarColor={colors.statusBar}
                        style={{ backgroundColor: '#4d94ff' }}>
                        <RNPButton
                            transparent
                            uppercase={false}
                            style={{ width: '100%', alignItems: 'flex-start' }}
                            onPress={() => {
                                props.navigation.goBack();
                            }}>
                            <Icon style={{ color: '#ffffff', fontSize: 20 }} name="arrow-left" />
                            <Text style={{ color: colors.whiteText, fontSize: 20 }}>Order Overview</Text>
                        </RNPButton>
                    </Header>
                </View>
                <View style={styles.content}>
                    <View style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center', backgroundColor: '#EEEDED', height: 100 }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.statusBar }}>{totalOrder}</Text>
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Total Order</Text>
                    </View>
                </View>
                <TabView
                    navigationState={{ index, routes }}
                    renderScene={renderScene}
                    renderTabBar={renderTabBar}
                    onIndexChange={setIndex}
                    initialLayout={{ width: layout.width }}
                />
                </Container>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.whiteText,
        flex: 1,
    },
    content: {
        backgroundColor: colors.appBackground,
        marginHorizontal: 15
    },
});
export default MerchantOrder;
