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
import Statusbar from '../../Shared/components/Statusbar';
import { customPaperTheme } from '../../../config/themes';

const RevenueReport = (props) => {
    const [sale, setSale] = useState(12000);
    const [cancelled, setCancelled] = useState(340);
    const [earnings, setEarnings] = useState(2340);
    return (
        <Content style={{ marginTop: 20, marginHorizontal: 10 }}>
            <View style={{ paddingVertical: 25 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Analytics :</Text>
                <View style={{ flexDirection: 'row', paddingTop: 5 }}>
                    <Text>Total Earnings</Text>
                    <Text style={{ marginLeft: 'auto', fontWeight: 'bold', color: colors.gray_100 }}>Rs.{earnings}</Text>
                </View>
                <View style={{ flexDirection: 'row', paddingTop: 5 }}>
                    <Text>Total Earnings</Text>
                    <Text style={{ marginLeft: 'auto', fontWeight: 'bold', color: colors.gray_100 }}>Rs.{earnings}</Text>
                </View>
            </View>
            <View style={{ paddingVertical: 15 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Revenue Overall :</Text>
                <View style={{ flexDirection: 'row', paddingTop: 5 }}>
                    <Text>Sold</Text>
                    <Text style={{ marginLeft: 'auto', fontWeight: 'bold', color: colors.gray_100 }}>Rs.{sale}</Text>
                </View>
                <View style={{ flexDirection: 'row', paddingTop: 5 }}>
                    <Text>Cancelled</Text>
                    <Text style={{ marginLeft: 'auto', fontWeight: 'bold', color: colors.gray_100 }}>Rs.{cancelled}</Text>
                </View>
                <View style={{ flexDirection: 'row', paddingTop: 5 }}>
                    <Text>Net Revenue</Text>
                    <Text style={{ marginLeft: 'auto', fontWeight: 'bold', color: colors.gray_100 }}>Rs.{sale - cancelled}</Text>
                </View>
            </View>
        </Content>
    )
}

const Earnings = (props) => {

    const [totalSale, setTotalSale] = useState(12340);

    const layout = useWindowDimensions();

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'first', title: 'This Week', navigation: props.navigation },
        { key: 'second', title: 'Monthly', navigation: props.navigation },
        { key: 'third', title: 'Yearly', navigation: props.navigation },
    ]);

    const renderScene = SceneMap({
        first: RevenueReport,
        second: RevenueReport,
        third: RevenueReport,
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
                <Statusbar />
                <Header
                    androidStatusBarColor={colors.statusBar}
                    style={{ backgroundColor: colors.statusBar, marginTop: customPaperTheme.headerMarginVertical }}
                >
                    <RNPButton
                        transparent
                        uppercase={false}
                        style={{ width: '100%', alignItems: 'flex-start' }}
                        onPress={() => {
                            props.navigation.goBack();
                        }}>
                        <Icon style={{ color: '#ffffff', fontSize: 20 }} name="arrow-left" />
                        <Text style={{ color: colors.whiteText, fontSize: 20 }}>Sales Preview</Text>
                    </RNPButton>
                </Header>
                <Container>
                    <View style={styles.content}>
                        <View style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center', backgroundColor: '#EEEDED', height: 100 }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.statusBar }}>Rs.{totalSale}</Text>
                            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Total Sale</Text>
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
        marginHorizontal: 15,
        marginTop:10
    },
});
export default Earnings;
