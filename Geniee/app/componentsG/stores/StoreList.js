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
import { Button as RNPButton } from 'react-native-paper';
import Moment from 'moment';

const StoreList = (props) => {

    const [loggedUser, setLoggedUser] = useState(Meteor.user());

    const _renderStore = (data, index) => {
        let item = data.item;
        return (
            <View
                key={item._id}
                onPress={() => _handleProductPress(item)}
                style={[
                    customStyle.productContainerStyle,
                    { borderTopLeftRadius: 4, borderTopRightRadius: 5 },
                ]}>
                <View
                    key={item._id}
                    style={[customStyle.Card, { top: 0, left: 0, rigth: 0 }]}>
                    <View style={{ width: '100%', borderRadius: 5 }}>
                        <Image
                            source={{ uri: settings.IMAGE_URL + item.images[0] }}
                            style={{
                                flex: 1, width: undefined, height: 70, width: 100, resizeMode: 'cover', borderRadius: 4, marginBottom: 8,
                            }}
                        />
                    </View>
                    <View>
                        <View>
                            <Text numberOfLines={1} style={{ fontSize: 10 }}>Butwal</Text>
                            <Text numberOfLines={2} style={{ fontSize: 12, fontWeight: 'bold', color: colors.gray_100 }}>
                                {/* style={{ fontSize: 12, color: colors.primaryText }}
                                 numberOfLines={1}> */}
                                {/* //{item.title} */}Phis is a title of product/ 200gb ram 600Gb memory
                            </Text>
                            <View style={{ marginTop: 5, marginRight: 5 }}>
                                <RNPButton
                                    mode='text'
                                    uppercase={false}
                                    onPress={() => { console.log('Visit Prssed') }}
                                >
                                    <Text style={{ fontSize: 10 }}>Visit</Text>
                                    <Icon name='chevron-right' style={{ marginLeft: 10, marginTop: 10 }} />
                                </RNPButton>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <>
            <StatusBar backgroundColor={colors.statusBar} />
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.whiteText }}>
                <View
                    style={{
                        backgroundColor: colors.appLayout,
                        height: 80,
                    }}>
                    <Header
                            androidStatusBarColor={colors.statusBar}
                            style={{ backgroundColor: '#4d94ff' }}
                        >
                            <RNPButton
                                transparent
                                uppercase={false}
                                style={{ width: '100%', alignItems: 'flex-start' }}
                                onPress={() => {
                                    props.navigation.goBack();
                                }}>
                                <Icon style={{ color: '#ffffff', fontSize: 20 }} name="arrow-left" />
                                <Text style={{ color: colors.whiteText, fontSize: 20 }}>Product Preview</Text>
                            </RNPButton>
                        </Header>
                </View>
                {/*{loading ? <ActivityIndicator style={{flex: 1}}/> : null}*/}

                <Content
                    onScroll={_onScroll}
                    style={{
                        width: '100%',
                        flex: 1,
                        paddingTop: 8,
                    }}>
                    <View>
                        {/* STORE*/}
                        {popularProducts.length > 0 ? (
                            <View style={styles.block}>
                                <View style={styles.blockHeader}>
                                    <Text style={[styles.blockTitle, { fontSize: 16 }]}>Featured Store</Text>
                                    <RNPButton
                                        mode='text'
                                        uppercase={false}
                                        onPress={() =>
                                            props.navigation.navigate('AllProducts', {
                                                Region: region,
                                            })
                                        }>
                                        <Text style={{ fontSize: 10, color: colors.statusBar }}>See All</Text>
                                        <Icon name="arrow-right" style={customStyle.blockHeaderArrow} />
                                    </RNPButton>
                                </View>
                                <FlatList
                                    contentContainerStyle={{
                                        paddingBottom: 15,
                                        marginHorizontal: 8,
                                        marginTop: 15
                                    }}
                                    data={popularProducts}
                                    horizontal={true}
                                    keyExtractor={(item, index) => item._id}
                                    showsHorizontalScrollIndicator={false}
                                    //  numColumns={3}
                                    renderItem={(item, index) => _renderStore(item, index)}
                                />
                            </View>
                        ) : null}
                    </View>

                </Content>
                {/* <FooterTabs route={'Home'} componentId={props.componentId}/> */}
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        // flexDirection: 'column',
        // flexWrap: 'wrap',
    },
    containerStyle: {
        paddingLeft: 5,
        paddingVertical: 5,
        //backgroundColor: 'white',
        borderWidth: 0,
        // marginVertical: 4,
        borderColor: '#808080',
        //elevation: 5,
        //width: (viewportWidth-60)/3,
        width: 100,
        margin: 5,
        height: 100,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
export default StoreList;
